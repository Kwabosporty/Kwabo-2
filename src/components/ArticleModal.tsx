import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, Share2, Bookmark, Flame, Check, CheckCircle2 } from 'lucide-react';
import { ArticleCard } from '../types';
import { useBookmarks } from '../utils/bookmarkStorage';
import { SocialShareBar } from './SocialShareBar';
import { AuthorBioBox } from './AuthorBioBox';

interface ArticleModalProps {
  article: ArticleCard | null;
  onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose }) => {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const [showSharePanel, setShowSharePanel] = useState(false);
  const [bookmarkFeedback, setBookmarkFeedback] = useState<string | null>(null);

  if (!article) return null;

  const isSaved = isBookmarked(article.id);

  const handleToggleBookmark = () => {
    const nextSaved = toggleBookmark(article);
    setBookmarkFeedback(nextSaved ? 'Article saved to your Bookmarks!' : 'Article removed from Bookmarks');
    setTimeout(() => {
      setBookmarkFeedback(null);
    }, 2400);
  };

  const articleUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}#article=${article.id}`
      : `https://kwabosports.com/articles/${article.id}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="article-read-dialog"
        className="w-full max-w-3xl bg-[#14171D] border border-[#2B3342] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col relative"
      >
        {/* Floating Bookmark Feedback Toast */}
        <AnimatePresence>
          {bookmarkFeedback && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-[#121E15] border border-[#A3E635]/40 text-[#A3E635] px-4 py-2 rounded-xl text-xs font-mono font-bold shadow-2xl flex items-center gap-2 pointer-events-none"
            >
              <CheckCircle2 className="w-4 h-4 text-[#A3E635]" />
              <span>{bookmarkFeedback}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-[#242A38] bg-[#121417]">
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-black uppercase px-2.5 py-0.5 rounded"
              style={{
                backgroundColor: article.categoryColor || '#A3E635',
                color:
                  article.categoryColor === '#A3E635' ||
                  article.categoryColor === '#00E5FF' ||
                  article.categoryColor === '#FACC15'
                    ? '#000'
                    : '#fff',
              }}
            >
              {article.category}
            </span>
            <span className="text-xs text-neutral-400 font-mono">KWABO EXCLUSIVE</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Share Toggle in Header */}
            <button
              id="modal-share-quick-btn"
              onClick={() => setShowSharePanel(!showSharePanel)}
              aria-label="Share article"
              title="Share article options"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                showSharePanel
                  ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/30'
                  : 'text-neutral-400 hover:text-white hover:bg-[#202530]'
              }`}
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Bookmark Toggle in Header */}
            <motion.button
              id="modal-bookmark-toggle-btn"
              whileTap={{ scale: 0.88 }}
              onClick={handleToggleBookmark}
              aria-label={isSaved ? 'Remove bookmark' : 'Bookmark article'}
              title={isSaved ? 'Saved to Bookmarks' : 'Bookmark this story'}
              className={`p-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 text-xs font-mono ${
                isSaved
                  ? 'bg-[#A3E635]/20 text-[#A3E635] border border-[#A3E635]/40 shadow-[0_0_12px_rgba(163,230,53,0.3)]'
                  : 'text-neutral-400 hover:text-white hover:bg-[#202530]'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#A3E635]' : ''}`} />
              <span className="hidden sm:inline text-[11px] font-bold">
                {isSaved ? 'SAVED' : 'BOOKMARK'}
              </span>
            </motion.button>

            {/* Close Button */}
            <button
              id="modal-close-btn"
              onClick={onClose}
              aria-label="Close article"
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-[#202530] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Expandable Social Sharing Drawer (Header) */}
        <AnimatePresence>
          {showSharePanel && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-[#101318] border-b border-[#242A38] px-6 py-3.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs font-mono text-neutral-300 flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-[#00E5FF]" />
                  <span>Share story directly:</span>
                </div>
                <SocialShareBar
                  title={article.title}
                  articleId={article.id}
                  url={articleUrl}
                  compact={true}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Article Title */}
          <h1 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tight text-white font-sport leading-tight">
            {article.title}
          </h1>

          {/* Subtitle */}
          {article.subtitle && (
            <p className="text-sm sm:text-base text-neutral-300 font-medium leading-relaxed">
              {article.subtitle}
            </p>
          )}

          {/* Meta Info */}
          <div className="flex items-center justify-between text-xs text-neutral-400 border-y border-[#242A38] py-2.5">
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold">
                {article.author || 'Kwabo Editorial Staff'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {article.readTime || '4 min read'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[#A3E635]">
              <Flame className="w-3.5 h-3.5 fill-[#A3E635]" />
              <span className="font-semibold">Trending High</span>
            </div>
          </div>

          {/* Feature Image */}
          <div className="rounded-xl overflow-hidden max-h-[360px] border border-[#282F3D]">
            <img
              src={article.image}
              alt={article.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Text Content */}
          <div className="text-neutral-300 text-sm leading-relaxed space-y-4 font-sans">
            {article.content ? (
              <div
                className="prose prose-invert prose-sm max-w-none [&_h1]:text-xl [&_h1]:font-black [&_h1]:text-white [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-white [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-white [&_blockquote]:border-l-4 [&_blockquote]:border-[#00E5FF] [&_blockquote]:pl-4 [&_blockquote]:my-3 [&_blockquote]:text-neutral-300 [&_a]:text-[#00E5FF] [&_a]:underline"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            ) : (
              <>
                <p>
                  Tonight&apos;s clash marks one of the most anticipated tactical duels in modern European sports. With high-intensity transitional presses and dynamic inverted wingers, both coaching setups have tailored their systems to exploit half-spaces.
                </p>
                <p>
                  Key analytical indicators demonstrate that early midfield tempo and defensive transitions will decide the outcome. Barcelona&apos;s high defensive line will be tested by blistering pace on the counter, while Real Madrid&apos;s box-to-box engine will need to withstand aggressive sustained possession.
                </p>
                <div className="p-4 rounded-xl bg-[#1A1F29] border-l-4 border-[#00E5FF] space-y-1">
                  <span className="text-xs font-bold text-[#00E5FF] uppercase tracking-wider">
                    TACTICAL INSIGHT MATRIX
                  </span>
                  <p className="text-xs text-neutral-300">
                    Expected Goals (xG) project 2.8 combined goals with a 42% probability of decisive set-piece influence in the final 20 minutes.
                  </p>
                </div>
              </>
            )}
          </div>

          {/* DEDICATED AUTHOR BIO & E-E-A-T SECTION */}
          <div className="pt-2">
            <AuthorBioBox
              bio={article.authorBio}
              authorName={article.author ? article.author.split('•')[0].trim() : undefined}
              authorRole={article.author && article.author.includes('•') ? article.author.split('•')[1].trim() : undefined}
            />
          </div>

          {/* DEDICATED SOCIAL MEDIA SHARING COMPONENT */}
          <div className="pt-2 border-t border-[#242A38]">
            <SocialShareBar
              title={article.title}
              articleId={article.id}
              url={articleUrl}
              compact={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
