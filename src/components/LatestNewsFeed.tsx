import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowDown, CheckCircle2 } from 'lucide-react';
import { BlogPost, BlogCategoryFilter, ArticleCard as ArticleCardType, AdminPost } from '../types';
import { INITIAL_BLOG_POSTS, MORE_BLOG_POSTS } from '../data/blogData';
import { supabaseService } from '../services/supabaseService';
import { ArticleCard } from './ArticleCard';

interface LatestNewsFeedProps {
  onSelectArticle: (article: ArticleCardType) => void;
}

const CATEGORY_TABS: BlogCategoryFilter[] = [
  'ALL',
  'TRANSFER NEWS',
  'TACTICAL ANALYSIS',
  'MATCH REPORTS',
  'OPINION',
];

function mapAdminPostToBlogPost(p: AdminPost): BlogPost {
  let filter: BlogCategoryFilter = 'ALL';
  const nameUpper = p.category_name.toUpperCase();
  if (nameUpper.includes('TRANSFER')) filter = 'TRANSFER NEWS';
  else if (nameUpper.includes('TACTIC') || nameUpper.includes('ANALYSIS')) filter = 'TACTICAL ANALYSIS';
  else if (nameUpper.includes('REPORT') || nameUpper.includes('MATCH')) filter = 'MATCH REPORTS';
  else if (nameUpper.includes('OPINION') || nameUpper.includes('COLUMN')) filter = 'OPINION';
  else filter = 'TRANSFER NEWS';

  return {
    id: p.id,
    title: p.title,
    excerpt: p.excerpt,
    category: p.category_name,
    categoryColor: p.category_color,
    categoryBg: `${p.category_color}20`,
    categoryFilter: filter,
    date: p.published_at ? new Date(p.published_at).toLocaleDateString() : 'Today',
    readTime: p.read_time,
    image: p.featured_image,
    author: {
      name: p.author_name,
      role: p.author_role,
      avatar: p.author_avatar,
    },
    commentsCount: 14,
    featured: p.is_featured,
    content: p.content,
  };
}

export const LatestNewsFeed: React.FC<LatestNewsFeedProps> = ({ onSelectArticle }) => {
  const [activeCategory, setActiveCategory] = useState<BlogCategoryFilter>('ALL');
  const [displayedPosts, setDisplayedPosts] = useState<BlogPost[]>(() => {
    try {
      const dbPosts = supabaseService.getPosts().filter((p) => p.status === 'published');
      if (dbPosts.length > 0) {
        return dbPosts.map(mapAdminPostToBlogPost);
      }
    } catch {
      // fallback
    }
    return INITIAL_BLOG_POSTS;
  });

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasLoadedMore, setHasLoadedMore] = useState(false);
  const [newlyLoadedIds, setNewlyLoadedIds] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = supabaseService.subscribeToPostsChange((posts) => {
      const published = posts.filter((p) => p.status === 'published');
      if (published.length > 0) {
        setDisplayedPosts(published.map(mapAdminPostToBlogPost));
      }
    });
    return () => unsubscribe();
  }, []);

  // Filter posts by active category
  const filteredPosts = displayedPosts.filter((post) => {
    if (activeCategory === 'ALL') return true;
    return post.categoryFilter === activeCategory;
  });

  const handleLoadMore = () => {
    if (isLoadingMore || hasLoadedMore) return;
    setIsLoadingMore(true);

    setTimeout(() => {
      const moreItems = MORE_BLOG_POSTS;
      const newIds = moreItems.map((p) => p.id);

      setDisplayedPosts((prev) => {
        const existingIds = new Set(prev.map((item) => item.id));
        const toAdd = moreItems.filter((item) => !existingIds.has(item.id));
        return [...prev, ...toAdd];
      });

      setNewlyLoadedIds(newIds);
      setHasLoadedMore(true);
      setIsLoadingMore(false);
    }, 600);
  };

  const handleShare = (e: React.MouseEvent, title: string, id: string) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}${window.location.pathname}#article=${id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
    }
  };

  return (
    <section
      id="latest-news-insights-feed"
      className="w-full bg-[#121212] pt-4 pb-8 space-y-6"
    >
      {/* SECTION HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#22262F] pb-4">
        {/* Title + Accent Detail */}
        <div className="flex items-center gap-2.5">
          <div className="w-1.5 h-6 bg-[#A3E635] rounded-xs shadow-[0_0_8px_rgba(163,230,53,0.8)]" />
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase font-sport">
            LATEST NEWS & INSIGHTS
          </h2>
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-[#A3E635] bg-[#1E261E] border border-[#2B3B2B] px-2 py-0.5 rounded ml-2">
            <Sparkles className="w-3 h-3" />
            24/7 Editorial Desk
          </span>
        </div>

        {/* Category filter tabs */}
        <div
          id="news-category-filters"
          className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1"
        >
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeCategory === tab;
            return (
              <button
                key={tab}
                id={`filter-tab-${tab.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setActiveCategory(tab)}
                className={`text-xs font-bold px-3 py-1.5 rounded-md whitespace-nowrap transition-all uppercase tracking-wider select-none cursor-pointer ${
                  isActive
                    ? 'bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF] shadow-[0_0_12px_rgba(0,229,255,0.25)]'
                    : 'text-neutral-400 hover:text-white bg-[#1A1D24] hover:bg-[#222732] border border-transparent'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* ARTICLE CARDS GRID */}
      {filteredPosts.length === 0 ? (
        <div className="py-12 text-center text-neutral-400 space-y-2 bg-[#171A21] rounded-xl border border-[#262C38]">
          <p className="text-sm font-semibold text-white">No articles found in this category.</p>
          <button
            onClick={() => setActiveCategory('ALL')}
            className="text-xs text-[#00E5FF] hover:underline cursor-pointer"
          >
            Reset filter to ALL
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post, idx) => {
            const isFeatured = idx === 0 && (activeCategory === 'ALL' || post.featured);
            const isNewlyLoaded = newlyLoadedIds.includes(post.id);
            const loadMoreIndex = newlyLoadedIds.indexOf(post.id);

            return (
              <ArticleCard
                key={post.id}
                post={post}
                isFeatured={isFeatured}
                isNewlyLoaded={isNewlyLoaded}
                animationIndex={loadMoreIndex >= 0 ? loadMoreIndex : idx}
                onSelectArticle={onSelectArticle}
                onShare={handleShare}
              />
            );
          })}

          {/* SKELETON PREVIEW WHILE LOADING MORE */}
          {isLoadingMore && (
            <>
              {[1, 2, 3].map((skeletonIdx) => (
                <motion.div
                  key={`loading-skeleton-${skeletonIdx}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, delay: skeletonIdx * 0.05 }}
                  className="bg-[#181B22] border border-[#262D3B] rounded-xl overflow-hidden animate-pulse flex flex-col justify-between"
                >
                  <div className="aspect-video bg-[#202532] w-full relative">
                    <div className="absolute top-3 left-3 w-20 h-4 bg-[#2C3345] rounded-full" />
                    <div className="absolute top-3 right-3 w-14 h-4 bg-[#2C3345] rounded-full" />
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="w-24 h-3 bg-[#262D3B] rounded" />
                    <div className="w-full h-4 bg-[#262D3B] rounded" />
                    <div className="w-4/5 h-4 bg-[#262D3B] rounded" />
                    <div className="w-full h-10 bg-[#202532] rounded mt-4" />
                  </div>
                </motion.div>
              ))}
            </>
          )}
        </div>
      )}

      {/* 4. INTERACTIVE CALL-TO-ACTION (LOAD MORE) */}
      <div className="pt-4 flex flex-col items-center justify-center gap-2">
        {!hasLoadedMore ? (
          <motion.button
            id="load-more-articles-btn"
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="border-2 border-[#A3E635] text-white bg-[#121212] hover:bg-[#A3E635] hover:text-black transition-all px-8 py-3 rounded-lg text-xs sm:text-sm font-black uppercase tracking-wider font-sport shadow-[0_0_15px_rgba(163,230,53,0.15)] flex items-center gap-2.5 disabled:opacity-60 cursor-pointer group"
          >
            {isLoadingMore ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>FETCHING NEW STORIES...</span>
              </>
            ) : (
              <>
                <span>LOAD MORE ARTICLES</span>
                <ArrowDown className="w-4 h-4 stroke-[2.5] group-hover:translate-y-0.5 transition-transform" />
              </>
            )}
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 text-xs text-neutral-400 font-mono py-3 px-5 rounded-full bg-[#181B20] border border-[#272D3B]"
          >
            <CheckCircle2 className="w-4 h-4 text-[#A3E635]" />
            <span>You&apos;re completely up to date with the latest KwaboSports coverage.</span>
          </motion.div>
        )}
      </div>
    </section>
  );
};
