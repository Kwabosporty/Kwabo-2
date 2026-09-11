import React, { useState, useEffect } from 'react';
import { Clock, MessageSquare, Share2, ArrowRight, Sparkles } from 'lucide-react';
import { BlogPost, BlogCategoryFilter, ArticleCard, AdminPost } from '../types';
import { INITIAL_BLOG_POSTS, MORE_BLOG_POSTS } from '../data/blogData';
import { supabaseService } from '../services/supabaseService';

interface LatestNewsFeedProps {
  onSelectArticle: (article: ArticleCard) => void;
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

  useEffect(() => {
    const handleStorageChange = () => {
      const dbPosts = supabaseService.getPosts().filter((p) => p.status === 'published');
      if (dbPosts.length > 0) {
        setDisplayedPosts(dbPosts.map(mapAdminPostToBlogPost));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Filter posts by active category
  const filteredPosts = displayedPosts.filter((post) => {
    if (activeCategory === 'ALL') return true;
    return post.categoryFilter === activeCategory;
  });

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayedPosts((prev) => [...prev, ...MORE_BLOG_POSTS]);
      setHasLoadedMore(true);
      setIsLoadingMore(false);
    }, 500);
  };

  const handleCardClick = (post: BlogPost) => {
    onSelectArticle({
      id: post.id,
      title: post.title,
      subtitle: post.excerpt,
      image: post.image,
      category: post.category,
      categoryType: 'breaking',
      categoryColor: post.categoryColor,
      author: `${post.author.name}${post.author.role ? ` • ${post.author.role}` : ''}`,
      readTime: post.readTime,
    });
  };

  const handleShare = (e: React.MouseEvent, title: string) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    alert(`Link copied for: "${title}"`);
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

        {/* Category filter tabs (Right-aligned) */}
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
                className={`text-xs font-bold px-3 py-1.5 rounded-md whitespace-nowrap transition-all uppercase tracking-wider select-none ${
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
            className="text-xs text-[#00E5FF] hover:underline"
          >
            Reset filter to ALL
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post, idx) => {
            // First item is featured (spans 2 cols on md/lg) when on ALL tab or when featured is true
            const isFeatured = idx === 0 && (activeCategory === 'ALL' || post.featured);

            if (isFeatured) {
              return (
                <article
                  key={post.id}
                  id={`featured-card-${post.id}`}
                  onClick={() => handleCardClick(post)}
                  className="md:col-span-2 lg:col-span-2 group bg-[#1A1A1A] hover:bg-[#1E1E22] border border-[#2B303D] hover:border-[#A3E635] hover:shadow-[0_0_20px_rgba(163,230,53,0.18)] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col lg:flex-row"
                >
                  {/* Image Container (Left on desktop) */}
                  <div className="relative lg:w-3/5 overflow-hidden aspect-video lg:aspect-auto min-h-[260px]">
                    <img
                      src={post.image}
                      alt={post.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 brightness-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#1A1A1A]" />

                    {/* Category Badge (Top-Left overlay) */}
                    <div className="absolute top-3.5 left-3.5 z-10">
                      <span
                        className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md select-none"
                        style={{
                          backgroundColor: post.categoryColor,
                          color: post.categoryColor === '#A3E635' || post.categoryColor === '#00E5FF' || post.categoryColor === '#FACC15' ? '#000000' : '#FFFFFF',
                        }}
                      >
                        {post.category}
                      </span>
                    </div>

                    {/* Reading Time (Top-Right overlay) */}
                    <div className="absolute top-3.5 right-3.5 z-10 bg-black/75 backdrop-blur-xs border border-white/10 text-neutral-200 text-[11px] font-mono px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                      <Clock className="w-3 h-3 text-[#A3E635]" />
                      <span>{post.readTime}</span>
                    </div>

                    {/* High Priority Editorial Tag */}
                    <div className="absolute bottom-3 left-3.5 hidden lg:block z-10">
                      <span className="text-[10px] font-mono uppercase bg-[#121417]/80 text-[#00E5FF] px-2 py-0.5 rounded border border-[#00E5FF]/30 backdrop-blur-xs">
                        ★ LEAD STORY
                      </span>
                    </div>
                  </div>

                  {/* Content Body & Footer (Right on desktop) */}
                  <div className="p-5 sm:p-6 lg:w-2/5 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      {/* Meta Line */}
                      <div className="flex items-center gap-2 text-xs text-neutral-400">
                        {post.author.avatar ? (
                          <img
                            src={post.author.avatar}
                            alt={post.author.name}
                            referrerPolicy="no-referrer"
                            className="w-5 h-5 rounded-full object-cover border border-neutral-700"
                          />
                        ) : null}
                        <span className="text-white font-medium">{post.author.name}</span>
                        <span>•</span>
                        <span className="font-mono text-neutral-400">{post.date}</span>
                      </div>

                      {/* Article Title */}
                      <h3 className="text-lg sm:text-xl font-black text-white group-hover:text-[#A3E635] transition-colors leading-snug line-clamp-3 font-sport">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-xs sm:text-sm text-[#9CA3AF] line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>

                    {/* Card Footer */}
                    <div className="pt-3 border-t border-[#2B303D] flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-xs font-black text-[#A3E635] tracking-wider uppercase group-hover:translate-x-1 transition-transform">
                        <span>READ STORY</span>
                        <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                      </span>

                      <div className="flex items-center gap-3 text-neutral-400 text-xs">
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span className="font-mono">{post.commentsCount}</span>
                        </span>
                        <button
                          onClick={(e) => handleShare(e, post.title)}
                          className="hover:text-white p-1 rounded hover:bg-neutral-800 transition-colors"
                          title="Share article"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            }

            // Standard 1-column Card Stack
            return (
              <article
                key={post.id}
                id={`article-card-${post.id}`}
                onClick={() => handleCardClick(post)}
                className="group bg-[#1A1A1A] hover:bg-[#1E1E22] border border-[#2B303D] hover:border-[#A3E635] hover:shadow-[0_0_20px_rgba(163,230,53,0.18)] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col justify-between"
              >
                {/* A. Image Container (Top: 16:9 aspect ratio) */}
                <div className="relative aspect-video w-full overflow-hidden bg-[#15171C]">
                  <img
                    src={post.image}
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 brightness-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent opacity-60" />

                  {/* Category Badge (Top-Left overlay) */}
                  <div className="absolute top-3 left-3 z-10">
                    <span
                      className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md select-none"
                      style={{
                        backgroundColor: post.categoryColor,
                        color: post.categoryColor === '#A3E635' || post.categoryColor === '#00E5FF' || post.categoryColor === '#FACC15' ? '#000000' : '#FFFFFF',
                      }}
                    >
                      {post.category}
                    </span>
                  </div>

                  {/* Reading Time (Top-Right overlay) */}
                  <div className="absolute top-3 right-3 z-10 bg-black/75 backdrop-blur-xs border border-white/10 text-neutral-200 text-[10px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                    <Clock className="w-3 h-3 text-[#A3E635]" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                {/* B. Content Body (Middle) */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    {/* Meta Line: Date published and Author Name */}
                    <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                      {post.author.avatar ? (
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          referrerPolicy="no-referrer"
                          className="w-4 h-4 rounded-full object-cover border border-neutral-700"
                        />
                      ) : null}
                      <span className="text-white font-medium">{post.author.name}</span>
                      <span>•</span>
                      <span className="font-mono text-neutral-400">{post.date}</span>
                    </div>

                    {/* Article Title: 2-line clamped heading, shifts to Lime Green on hover */}
                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-[#A3E635] transition-colors line-clamp-2 leading-snug font-sport">
                      {post.title}
                    </h3>

                    {/* Excerpt: 2-line clamped summary text in muted light gray (#9CA3AF) */}
                    <p className="text-xs text-[#9CA3AF] line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* C. Card Footer (Bottom) */}
                  <div className="pt-3 border-t border-[#2B303D] flex items-center justify-between">
                    {/* "Read More" Action */}
                    <span className="inline-flex items-center gap-1 text-xs font-extrabold text-[#A3E635] tracking-wider uppercase group-hover:translate-x-1 transition-transform">
                      <span>READ STORY</span>
                      <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                    </span>

                    {/* Social / Engagement */}
                    <div className="flex items-center gap-2.5 text-neutral-400 text-xs">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        <span className="font-mono text-[11px]">{post.commentsCount}</span>
                      </span>
                      <button
                        onClick={(e) => handleShare(e, post.title)}
                        className="hover:text-white p-1 rounded hover:bg-neutral-800 transition-colors"
                        title="Share article"
                      >
                        <Share2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* 4. INTERACTIVE CALL-TO-ACTION (LOAD MORE) */}
      <div className="pt-4 flex justify-center">
        {!hasLoadedMore ? (
          <button
            id="load-more-articles-btn"
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="border-2 border-[#A3E635] text-white bg-[#121212] hover:bg-[#A3E635] hover:text-black transition-all px-8 py-3 rounded-lg text-xs sm:text-sm font-black uppercase tracking-wider font-sport shadow-[0_0_15px_rgba(163,230,53,0.15)] flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isLoadingMore ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>FETCHING HEADLINES...</span>
              </>
            ) : (
              <span>LOAD MORE ARTICLES</span>
            )}
          </button>
        ) : (
          <div className="text-center text-xs text-neutral-400 font-mono py-2">
            ✓ You&apos;re completely up to date with the latest KwaboSports coverage.
          </div>
        )}
      </div>
    </section>
  );
};
