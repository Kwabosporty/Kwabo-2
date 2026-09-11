import { useState, useEffect, useCallback } from 'react';
import { ArticleCard } from '../types';

const STORAGE_KEY_BOOKMARKS = 'kwabo_bookmarked_articles';
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

/**
 * Reads all bookmarked items from localStorage
 */
export function getSavedBookmarks(): SavedArticleItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading bookmarks from localStorage:', err);
    return [];
  }
}

/**
 * Returns set of bookmarked article IDs for fast lookup
 */
export function getSavedBookmarkIds(): string[] {
  return getSavedBookmarks().map((item) => item.id);
}

/**
 * Checks if a specific article ID is currently bookmarked
 */
export function isArticleSaved(id: string): boolean {
  if (!id) return false;
  const list = getSavedBookmarks();
  return list.some((item) => item.id === id);
}

/**
 * Toggles bookmark status for an article.
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
  if (typeof window === 'undefined' || !article?.id) return false;

  const current = getSavedBookmarks();
  const exists = current.some((item) => item.id === article.id);

  let updated: SavedArticleItem[];
  let isSavedNow: boolean;

  if (exists) {
    updated = current.filter((item) => item.id !== article.id);
    isSavedNow = false;
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
    updated = [newItem, ...current];
    isSavedNow = true;
  }

  try {
    localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(updated));
    // Dispatch custom event to notify all components in the current tab
    window.dispatchEvent(
      new CustomEvent(BOOKMARK_EVENT, {
        detail: { articleId: article.id, isSaved: isSavedNow },
      })
    );
  } catch (err) {
    console.error('Error saving bookmark to localStorage:', err);
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

    // Listen to in-app changes
    window.addEventListener(BOOKMARK_EVENT, updateBookmarks);
    // Listen to cross-tab storage changes
    window.addEventListener('storage', updateBookmarks);

    return () => {
      window.removeEventListener(BOOKMARK_EVENT, updateBookmarks);
      window.removeEventListener('storage', updateBookmarks);
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
