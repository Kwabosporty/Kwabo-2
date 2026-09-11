import React from 'react';
import { Bookmark } from 'lucide-react';
import { motion } from 'motion/react';
import { HERO_ARTICLE, SECONDARY_CARDS } from '../data/sportsData';
import { ArticleCard } from '../types';
import { useBookmarks } from '../utils/bookmarkStorage';

interface HeroBentoProps {
  onSelectArticle?: (article: ArticleCard) => void;
}

export const HeroBento: React.FC<HeroBentoProps> = ({ onSelectArticle }) => {
  const { isBookmarked, toggleBookmark } = useBookmarks();

  const transferCard = SECONDARY_CARDS[0]; // Transfer update
  const opinionCard = SECONDARY_CARDS[2]; // Opinion NBA

  const handleToggle = (e: React.MouseEvent, article: ArticleCard) => {
    e.stopPropagation();
    toggleBookmark(article);
  };

  return (
    <div id="top-hero-bento-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 w-full">
      {/* LEFT: Large Hero Article (60% width / 7-8 cols on lg) */}
      <div
        id="hero-main-card"
        onClick={() => onSelectArticle && onSelectArticle(HERO_ARTICLE)}
        className="lg:col-span-7 xl:col-span-7 relative group rounded-xl overflow-hidden cursor-pointer border border-[#262C38] bg-[#16191F] min-h-[340px] sm:min-h-[400px] flex flex-col justify-end"
      >
        {/* Background Action Photo */}
        <div className="absolute inset-0 z-0">
          <img
            src={HERO_ARTICLE.image}
            alt="El Clasico Tactical Breakdown - Mbappe & Bellingham"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out brightness-90"
          />
          {/* Deep charcoal gradient overlay for crisp legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E1013] via-[#0E1013]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0E1013]/70 via-transparent to-transparent" />
        </div>

        {/* Top Floating Controls */}
        <div className="absolute top-4 right-4 z-20">
          <motion.button
            id={`bookmark-hero-${HERO_ARTICLE.id}`}
            whileTap={{ scale: 0.85 }}
            onClick={(e) => handleToggle(e, HERO_ARTICLE)}
            title={isBookmarked(HERO_ARTICLE.id) ? 'Saved to Bookmarks' : 'Save to Bookmarks'}
            aria-label="Bookmark hero article"
            className={`p-2 rounded-xl backdrop-blur-md transition-all cursor-pointer ${
              isBookmarked(HERO_ARTICLE.id)
                ? 'bg-[#A3E635] text-black shadow-[0_0_15px_rgba(163,230,53,0.4)]'
                : 'bg-black/60 text-white/80 hover:text-white hover:bg-black/80 border border-white/10'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked(HERO_ARTICLE.id) ? 'fill-black' : ''}`} />
          </motion.button>
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 p-5 sm:p-7 space-y-3">
          {/* Tag: Cyan colored "MATCH PREVIEW" label */}
          <div>
            <span
              id="hero-tag-match-preview"
              className="inline-block bg-[#00E5FF] text-black text-[11px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded shadow-sm"
            >
              MATCH PREVIEW
            </span>
          </div>

          {/* Title: Bold, italicized, capitalized */}
          <h1
            id="hero-article-title"
            className="text-2xl sm:text-3xl xl:text-4xl font-black italic uppercase tracking-tight text-white leading-[1.08] font-sport drop-shadow-md"
          >
            THE FINAL BATTLE: EL CLÁSICO TACTICAL BREAKDOWN
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-neutral-300 font-medium max-w-xl leading-relaxed">
            {HERO_ARTICLE.subtitle}
          </p>
        </div>
      </div>

      {/* RIGHT: Vertical Stack (40% width / 5 cols on lg) */}
      <div id="hero-secondary-stack" className="lg:col-span-5 xl:col-span-5 flex flex-col gap-3.5">
        {/* Card 1: TRANSFER UPDATE */}
        <div
          id="secondary-card-transfer"
          onClick={() => onSelectArticle && onSelectArticle(transferCard)}
          className="relative group rounded-xl overflow-hidden cursor-pointer border border-[#262C38] bg-[#16191F] flex-1 min-h-[165px] flex flex-col justify-end"
        >
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src={transferCard.image}
              alt={transferCard.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 brightness-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E1013] via-[#0E1013]/60 to-transparent" />
          </div>

          {/* Top Bookmark */}
          <div className="absolute top-3 right-3 z-20">
            <motion.button
              id={`bookmark-secondary-${transferCard.id}`}
              whileTap={{ scale: 0.85 }}
              onClick={(e) => handleToggle(e, transferCard)}
              title={isBookmarked(transferCard.id) ? 'Saved' : 'Bookmark story'}
              aria-label="Bookmark transfer story"
              className={`p-1.5 rounded-lg backdrop-blur-md transition-all cursor-pointer ${
                isBookmarked(transferCard.id)
                  ? 'bg-[#A3E635] text-black shadow-[0_0_12px_rgba(163,230,53,0.4)]'
                  : 'bg-black/60 text-white/80 hover:text-white hover:bg-black/80 border border-white/10'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked(transferCard.id) ? 'fill-black' : ''}`} />
            </motion.button>
          </div>

          {/* Content */}
          <div className="relative z-10 p-4 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[#A3E635] text-[11px] font-black uppercase tracking-wider">
                TRANSFER UPDATE
              </span>
            </div>

            <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight uppercase leading-snug font-sport">
              {transferCard.title}
            </h3>
          </div>
        </div>

        {/* Card 2: OPINION */}
        <div
          id="secondary-card-opinion"
          onClick={() => onSelectArticle && onSelectArticle(opinionCard)}
          className="relative group rounded-xl overflow-hidden cursor-pointer border border-[#262C38] bg-[#16191F] flex-1 min-h-[165px] flex flex-col justify-end"
        >
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src={opinionCard.image}
              alt={opinionCard.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 brightness-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E1013] via-[#0E1013]/60 to-transparent" />
          </div>

          {/* Top Bookmark */}
          <div className="absolute top-3 right-3 z-20">
            <motion.button
              id={`bookmark-secondary-${opinionCard.id}`}
              whileTap={{ scale: 0.85 }}
              onClick={(e) => handleToggle(e, opinionCard)}
              title={isBookmarked(opinionCard.id) ? 'Saved' : 'Bookmark story'}
              aria-label="Bookmark opinion story"
              className={`p-1.5 rounded-lg backdrop-blur-md transition-all cursor-pointer ${
                isBookmarked(opinionCard.id)
                  ? 'bg-[#A3E635] text-black shadow-[0_0_12px_rgba(163,230,53,0.4)]'
                  : 'bg-black/60 text-white/80 hover:text-white hover:bg-black/80 border border-white/10'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked(opinionCard.id) ? 'fill-black' : ''}`} />
            </motion.button>
          </div>

          {/* Content */}
          <div className="relative z-10 p-4 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[#FACC15] text-[11px] font-black uppercase tracking-wider">
                OPINION
              </span>
            </div>

            <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight uppercase leading-snug font-sport">
              {opinionCard.title}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};
