import React, { useState } from 'react';
import { Search, X, TrendingUp, Trophy } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (query: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectResult,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const popularSearches = [
    'El Clásico Tactics',
    'Ballon d\'Or 2026',
    'Haaland vs Mbappé',
    'Premier League Standings',
    'Ferrari Monza GP',
    'Lakers vs Warriors',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="search-dialog"
        className="w-full max-w-xl bg-[#15181E] border border-[#2B3242] rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-[#242A38] gap-3">
          <Search className="w-5 h-5 text-[#A3E635]" />
          <input
            type="text"
            placeholder="Search teams, fixtures, players, leagues..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-white placeholder-neutral-500 focus:outline-none text-sm font-medium"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-neutral-500 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs bg-[#242A38] text-neutral-300 hover:text-white px-2 py-1 rounded"
          >
            ESC
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Trending Searches */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
              <TrendingUp className="w-3.5 h-3.5 text-[#A3E635]" />
              <span>Trending in KwaboSports</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((term, i) => (
                <button
                  key={i}
                  onClick={() => {
                    onSelectResult(term);
                    onClose();
                  }}
                  className="px-3 py-1.5 bg-[#1D222C] hover:bg-[#252C38] border border-[#2B3342] text-neutral-300 hover:text-white rounded-lg text-xs transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="border-t border-[#22262F] pt-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
              <Trophy className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>Quick Categories</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div
                onClick={() => {
                  onSelectResult('Premier League');
                  onClose();
                }}
                className="p-2.5 rounded-lg bg-[#191D24] hover:bg-[#202530] cursor-pointer flex items-center justify-between"
              >
                <span className="font-semibold text-white">⚽ Premier League</span>
                <span className="text-[10px] text-neutral-500 font-mono">Standings</span>
              </div>
              <div
                onClick={() => {
                  onSelectResult('Live Match Centre');
                  onClose();
                }}
                className="p-2.5 rounded-lg bg-[#191D24] hover:bg-[#202530] cursor-pointer flex items-center justify-between"
              >
                <span className="font-semibold text-white">🔴 El Clásico Live</span>
                <span className="text-[10px] text-[#A3E635] font-mono">28&apos;</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
