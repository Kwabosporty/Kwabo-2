import React from 'react';
import { motion } from 'motion/react';
import { Clock, MessageSquare, Share2, Bookmark, ArrowRight } from 'lucide-react';
import { ArticleCard as ArticleCardType, BlogPost } from '../types';
import { useBookmarks } from '../utils/bookmarkStorage';

interface ArticleCardProps {
  post: BlogPost | ArticleCardType;
  isFeatured?: boolean;
  isNewlyLoaded?: boolean;
  animationIndex?: number;
  onSelectArticle: (article: ArticleCardType) => void;
  onShare?: (e: React.MouseEvent, title: string, id: string) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  post,
  isFeatured = false,
  isNewlyLoaded = false,
  animationIndex = 0,
  onSelectArticle,
  onShare,
}) => {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const saved = isBookmarked(post.id);

  // Normalize post properties between BlogPost and ArticleCardType
  const title = post.title;
  const excerpt = 'excerpt' in post ? post.excerpt : post.subtitle || '';
  const image = post.image;
  const category = post.category;
  const categoryColor = post.categoryColor || '#A3E635';
  const readTime = post.readTime || '4 min read';
  const date = 'date' in post ? post.date : 'Today';
  const authorName =
    'author' in post
      ? typeof post.author === 'string'
        ? post.author
        : post.author?.name || 'Kwabo Sports'
      : 'Kwabo Sports';
  const authorAvatar = 'author' in post && typeof post.author === 'object' ? post.author?.avatar : undefined;
  const commentsCount = 'commentsCount' in post ? post.commentsCount : 12;

  const handleCardClick = () => {
    onSelectArticle({
      id: post.id,
      title,
      subtitle: excerpt,
      image,
      category,
      categoryType: 'breaking',
      categoryColor,
      author: authorName,
      readTime,
    });
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleBookmark({
      id: post.id,
      title,
      category,
      categoryColor,
      image,
      subtitle: excerpt,
      author: authorName,
      readTime,
    });
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onShare) {
      onShare(e, title, post.id);
    } else {
      const shareUrl = `${window.location.origin}${window.location.pathname}#article=${post.id}`;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareUrl);
      }
    }
  };

  // Animation variants for graceful fade-in and upward slide
  const motionProps = isNewlyLoaded
    ? {
        initial: { opacity: 0, y: 28, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: {
          duration: 0.5,
          delay: Math.min(animationIndex * 0.08, 0.4),
          ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        },
      }
    : {
        initial: { opacity: 1, y: 0 },
        animate: { opacity: 1, y: 0 },
      };

  if (isFeatured) {
    return (
      <motion.article
        id={`featured-card-${post.id}`}
        onClick={handleCardClick}
        {...motionProps}
        className="md:col-span-2 lg:col-span-2 group bg-[#1A1A1A] hover:bg-[#1E1E22] border border-[#2B303D] hover:border-[#A3E635] hover:shadow-[0_0_24px_rgba(163,230,53,0.18)] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col lg:flex-row relative"
      >
        {/* Image Container (Left on desktop) */}
        <div className="relative lg:w-3/5 overflow-hidden aspect-video lg:aspect-auto min-h-[260px]">
          <img
            src={image}
            alt={title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#1A1A1A]" />

          {/* Category Badge (Top-Left overlay) */}
          <div className="absolute top-3.5 left-3.5 z-10">
            <span
              className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md select-none"
              style={{
                backgroundColor: categoryColor,
                color:
                  categoryColor === '#A3E635' ||
                  categoryColor === '#00E5FF' ||
                  categoryColor === '#FACC15'
                    ? '#000000'
                    : '#FFFFFF',
              }}
            >
              {category}
            </span>
          </div>

          {/* Reading Time (Top-Right overlay) */}
          <div className="absolute top-3.5 right-3.5 z-10 bg-black/75 backdrop-blur-xs border border-white/10 text-neutral-200 text-[11px] font-mono px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
            <Clock className="w-3 h-3 text-[#A3E635]" />
            <span>{readTime}</span>
          </div>

          {/* Lead Story Tag */}
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
              {authorAvatar ? (
                <img
                  src={authorAvatar}
                  alt={authorName}
                  referrerPolicy="no-referrer"
                  className="w-5 h-5 rounded-full object-cover border border-neutral-700"
                />
              ) : null}
              <span className="text-white font-medium">{authorName}</span>
              <span>•</span>
              <span className="font-mono text-neutral-400">{date}</span>
            </div>

            {/* Article Title */}
            <h3 className="text-lg sm:text-xl font-black text-white group-hover:text-[#A3E635] transition-colors leading-snug line-clamp-3 font-sport">
              {title}
            </h3>

            {/* Excerpt */}
            <p className="text-xs sm:text-sm text-[#9CA3AF] line-clamp-3 leading-relaxed">
              {excerpt}
            </p>
          </div>

          {/* Card Footer */}
          <div className="pt-3 border-t border-[#2B303D] flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-xs font-black text-[#A3E635] tracking-wider uppercase group-hover:translate-x-1 transition-transform">
              <span>READ STORY</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </span>

            <div className="flex items-center gap-2 text-neutral-400 text-xs">
              <span className="flex items-center gap-1 mr-1">
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="font-mono">{commentsCount}</span>
              </span>

              {/* Bookmark Button */}
              <motion.button
                id={`bookmark-btn-${post.id}`}
                whileTap={{ scale: 0.85 }}
                onClick={handleBookmarkClick}
                title={saved ? 'Saved to Bookmarks' : 'Save to Bookmarks'}
                aria-label="Bookmark article"
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  saved
                    ? 'text-[#A3E635] bg-[#A3E635]/15 border border-[#A3E635]/40 shadow-[0_0_10px_rgba(163,230,53,0.3)]'
                    : 'hover:text-white hover:bg-neutral-800'
                }`}
              >
                <Bookmark
                  className={`w-4 h-4 transition-transform ${saved ? 'fill-[#A3E635]' : ''}`}
                />
              </motion.button>

              {/* Share Button */}
              <button
                onClick={handleShareClick}
                className="hover:text-white p-1.5 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
                title="Share article"
                aria-label="Share article"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.article>
    );
  }

  // Standard 1-column Card Stack
  return (
    <motion.article
      id={`article-card-${post.id}`}
      onClick={handleCardClick}
      {...motionProps}
      className="group bg-[#1A1A1A] hover:bg-[#1E1E22] border border-[#2B303D] hover:border-[#A3E635] hover:shadow-[0_0_20px_rgba(163,230,53,0.18)] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col justify-between relative"
    >
      {/* A. Image Container (Top: 16:9 aspect ratio) */}
      <div className="relative aspect-video w-full overflow-hidden bg-[#15171C]">
        <img
          src={image}
          alt={title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent opacity-60" />

        {/* Category Badge (Top-Left overlay) */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md select-none"
            style={{
              backgroundColor: categoryColor,
              color:
                categoryColor === '#A3E635' ||
                categoryColor === '#00E5FF' ||
                categoryColor === '#FACC15'
                  ? '#000000'
                  : '#FFFFFF',
            }}
          >
            {category}
          </span>
        </div>

        {/* Reading Time (Top-Right overlay) */}
        <div className="absolute top-3 right-3 z-10 bg-black/75 backdrop-blur-xs border border-white/10 text-neutral-200 text-[10px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
          <Clock className="w-3 h-3 text-[#A3E635]" />
          <span>{readTime}</span>
        </div>
      </div>

      {/* B. Content Body (Middle) */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          {/* Meta Line: Date published and Author Name */}
          <div className="flex items-center gap-2 text-[11px] text-neutral-400">
            {authorAvatar ? (
              <img
                src={authorAvatar}
                alt={authorName}
                referrerPolicy="no-referrer"
                className="w-4 h-4 rounded-full object-cover border border-neutral-700"
              />
            ) : null}
            <span className="text-white font-medium">{authorName}</span>
            <span>•</span>
            <span className="font-mono text-neutral-400">{date}</span>
          </div>

          {/* Article Title */}
          <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-[#A3E635] transition-colors line-clamp-2 leading-snug font-sport">
            {title}
          </h3>

          {/* Excerpt */}
          <p className="text-xs text-[#9CA3AF] line-clamp-2 leading-relaxed">
            {excerpt}
          </p>
        </div>

        {/* C. Card Footer (Bottom) */}
        <div className="pt-3 border-t border-[#2B303D] flex items-center justify-between">
          {/* "Read More" Action */}
          <span className="inline-flex items-center gap-1 text-xs font-extrabold text-[#A3E635] tracking-wider uppercase group-hover:translate-x-1 transition-transform">
            <span>READ STORY</span>
            <ArrowRight className="w-3 h-3 stroke-[2.5]" />
          </span>

          {/* Engagement: Comments + Bookmark + Share */}
          <div className="flex items-center gap-2 text-neutral-400 text-xs">
            <span className="flex items-center gap-1 mr-0.5">
              <MessageSquare className="w-3 h-3" />
              <span className="font-mono text-[11px]">{commentsCount}</span>
            </span>

            {/* Bookmark Button */}
            <motion.button
              id={`bookmark-btn-${post.id}`}
              whileTap={{ scale: 0.85 }}
              onClick={handleBookmarkClick}
              title={saved ? 'Saved to Bookmarks' : 'Save to Bookmarks'}
              aria-label="Bookmark article"
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                saved
                  ? 'text-[#A3E635] bg-[#A3E635]/15 border border-[#A3E635]/40 shadow-[0_0_10px_rgba(163,230,53,0.3)]'
                  : 'hover:text-white hover:bg-neutral-800'
              }`}
            >
              <Bookmark
                className={`w-3.5 h-3.5 transition-transform ${saved ? 'fill-[#A3E635]' : ''}`}
              />
            </motion.button>

            {/* Share Button */}
            <button
              onClick={handleShareClick}
              className="hover:text-white p-1.5 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
              title="Share article"
              aria-label="Share article"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
};
