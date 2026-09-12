import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseService';
import { ArticleCard } from '../types';

const BOOKMARK_EVENT = 'kwabo_bookmarks_updated';

export interface SavedArticleItem {
  id: string;
  title: string;
  category: string;
  categoryColor?: string;
  image: string;
  subtitle?: string;
  author?: string;
  readTime?: string;
  savedAt: string;
}

// In-memory Runtime Store (ZERO localStorage)
let inMemoryBookmarks: SavedArticleItem[] = [];
let hasSyncedWithSupabase = false;

// Cross-tab broadcast channel for instantaneous sync without localStorage
let bookmarkBroadcast: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    bookmarkBroadcast = new BroadcastChannel('kwabo_bookmarks_channel');
    bookmarkBroadcast.onmessage = (ev) => {
      if (ev.data && Array.isArray(ev.data.bookmarks)) {
        inMemoryBookmarks = ev.data.bookmarks;
        window.dispatchEvent(new CustomEvent(BOOKMARK_EVENT));
      }
    };
  }
} catch {
  // BroadcastChannel unavailable in some environments
}

/**
 * Syncs bookmarks directly from Supabase bookmarks table
 */
export async function syncBookmarksFromSupabase(): Promise<void> {
  if (hasSyncedWithSupabase) return;
  hasSyncedWithSupabase = true;

  if (!supabase) return;

  try {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && Array.isArray(data)) {
      inMemoryBookmarks = data.map((row: any) => ({
        id: row.article_id || row.id,
        title: row.title || 'Untitled Article',
        category: row.category || 'Sports',
        categoryColor: row.category_color || '#00E5FF',
        image: row.image || '',
        subtitle: row.subtitle,
        author: row.author,
        readTime: row.read_time || '3 min read',
        savedAt: row.created_at || new Date().toISOString(),
      }));
      window.dispatchEvent(new CustomEvent(BOOKMARK_EVENT));
    }
  } catch (err) {
    console.warn('Supabase bookmark sync notice:', err);
  }
}

// Auto-trigger sync on module load in browser
if (typeof window !== 'undefined') {
  syncBookmarksFromSupabase();
}

/**
 * Reads all bookmarked items from active in-memory store
 */
export function getSavedBookmarks(): SavedArticleItem[] {
  return [...inMemoryBookmarks];
}

/**
 * Returns set of bookmarked article IDs for fast lookup
 */
export function getSavedBookmarkIds(): string[] {
  return inMemoryBookmarks.map((item) => item.id);
}

/**
 * Checks if a specific article ID is currently bookmarked
 */
export function isArticleSaved(id: string): boolean {
  if (!id) return false;
  return inMemoryBookmarks.some((item) => item.id === id);
}

/**
 * Toggles bookmark status for an article directly in memory and Supabase.
 * Returns true if now bookmarked, false if removed.
 */
export function toggleArticleBookmark(article: {
  id: string;
  title: string;
  category?: string;
  categoryColor?: string;
  image?: string;
  subtitle?: string;
  excerpt?: string;
  author?: string | { name: string };
  readTime?: string;
}): boolean {
  if (!article?.id) return false;

  const exists = inMemoryBookmarks.some((item) => item.id === article.id);
  let isSavedNow: boolean;

  if (exists) {
    inMemoryBookmarks = inMemoryBookmarks.filter((item) => item.id !== article.id);
    isSavedNow = false;

    // Delete from Supabase bookmarks table
    if (supabase) {
      Promise.resolve(
        supabase
          .from('bookmarks')
          .delete()
          .eq('article_id', article.id)
      ).catch(() => {});
    }
  } else {
    const authorName =
      typeof article.author === 'string'
        ? article.author
        : article.author?.name || 'Kwabo Editorial';

    const newItem: SavedArticleItem = {
      id: article.id,
      title: article.title,
      category: article.category || 'News',
      categoryColor: article.categoryColor || '#A3E635',
      image: article.image || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80',
      subtitle: article.subtitle || article.excerpt,
      author: authorName,
      readTime: article.readTime || '3 min read',
      savedAt: new Date().toISOString(),
    };
    inMemoryBookmarks = [newItem, ...inMemoryBookmarks];
    isSavedNow = true;

    // Save to Supabase bookmarks table
    if (supabase) {
      Promise.resolve(
        supabase
          .from('bookmarks')
          .upsert({
            article_id: newItem.id,
            title: newItem.title,
            category: newItem.category,
            category_color: newItem.categoryColor,
            image: newItem.image,
            subtitle: newItem.subtitle,
            author: newItem.author,
            read_time: newItem.readTime,
            created_at: newItem.savedAt,
          })
      ).catch(() => {});
    }
  }

  // Broadcast to other open tabs via BroadcastChannel (in-memory IPC, zero localStorage)
  if (bookmarkBroadcast) {
    try {
      bookmarkBroadcast.postMessage({ bookmarks: inMemoryBookmarks });
    } catch {
      // ignore broadcast error
    }
  }

  // Dispatch custom event to notify all components in the current view
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent(BOOKMARK_EVENT, {
        detail: { articleId: article.id, isSaved: isSavedNow },
      })
    );
  }

  return isSavedNow;
}

/**
 * Custom React Hook to listen to bookmark state changes across the application
 */
export function useBookmarks() {
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => getSavedBookmarkIds());

  useEffect(() => {
    const updateBookmarks = () => {
      setBookmarkedIds(getSavedBookmarkIds());
    };

    if (typeof window !== 'undefined') {
      window.addEventListener(BOOKMARK_EVENT, updateBookmarks);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener(BOOKMARK_EVENT, updateBookmarks);
      }
    };
  }, []);

  const isBookmarked = useCallback(
    (id: string) => bookmarkedIds.includes(id),
    [bookmarkedIds]
  );

  const toggle = useCallback((article: any) => {
    const newState = toggleArticleBookmark(article);
    setBookmarkedIds(getSavedBookmarkIds());
    return newState;
  }, []);

  return {
    bookmarkedIds,
    isBookmarked,
    toggleBookmark: toggle,
  };
}
