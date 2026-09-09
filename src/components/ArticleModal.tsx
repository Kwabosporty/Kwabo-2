import React from 'react';
import { X, Clock, Share2, Bookmark, Flame } from 'lucide-react';
import { ArticleCard } from '../types';

interface ArticleModalProps {
  article: ArticleCard | null;
  onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose }) => {
  if (!article) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="article-read-dialog"
        className="w-full max-w-3xl bg-[#14171D] border border-[#2B3342] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-[#242A38] bg-[#121417]">
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-black uppercase px-2.5 py-0.5 rounded"
              style={{
                backgroundColor: article.categoryColor,
                color: article.categoryColor === '#A3E635' || article.categoryColor === '#00E5FF' || article.categoryColor === '#FACC15' ? '#000' : '#fff',
              }}
            >
              {article.category}
            </span>
            <span className="text-xs text-neutral-400 font-mono">KWABO EXCLUSIVE</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('Article link copied to clipboard!')}
              aria-label="Share article"
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-[#202530]"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => alert('Article saved to your Kwabo Reading List!')}
              aria-label="Bookmark article"
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-[#202530]"
            >
              <Bookmark className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              aria-label="Close article"
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-[#202530]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5">
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
              <span className="text-white font-semibold">{article.author || 'Kwabo Editorial Staff'}</span>
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
          </div>
        </div>
      </div>
    </div>
  );
};
