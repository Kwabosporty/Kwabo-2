import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Circle } from 'lucide-react';
import { TICKER_MATCHES } from '../data/sportsData';
import { TeamBadge } from './TeamBadge';

export const ScoreTicker: React.FC = () => {
  const [startIndex, setStartIndex] = useState(0);

  const handleNext = () => {
    setStartIndex((prev) => (prev + 1) % TICKER_MATCHES.length);
  };

  const handlePrev = () => {
    setStartIndex((prev) => (prev - 1 + TICKER_MATCHES.length) % TICKER_MATCHES.length);
  };

  // Visible items (can show 4 on desktop, wrap around)
  const visibleMatches = Array.from({ length: 4 }).map((_, idx) => {
    const itemIndex = (startIndex + idx) % TICKER_MATCHES.length;
    return TICKER_MATCHES[itemIndex];
  });

  const getSportIcon = (sport: string) => {
    switch (sport) {
      case 'basketball':
        return <span className="text-sm">🏀</span>;
      case 'motorsport':
        return <span className="text-sm">🏎️</span>;
      case 'combat':
        return <span className="text-sm">🥊</span>;
      default:
        return <span className="text-sm">⚽</span>;
    }
  };

  return (
    <div id="score-ticker-bar" className="w-full bg-[#121417] border-b border-[#22262F] sticky top-0 z-40 px-3 py-1.5 flex items-center justify-between text-xs select-none">
      <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar w-full py-0.5">
        {visibleMatches.map((match, idx) => (
          <div
            key={`${match.id}-${idx}`}
            className="flex items-center gap-2 bg-[#1A1E24] hover:bg-[#222832] transition-colors border border-[#2B3240] rounded-md px-3 py-1.5 shrink-0 cursor-pointer group"
          >
            {/* Sport Icon */}
            <div className="text-neutral-400 group-hover:text-white transition-colors">
              {getSportIcon(match.sport)}
            </div>

            {/* Match info */}
            <div className="flex items-center gap-1.5 font-semibold text-neutral-200 tracking-wide">
              {match.sport === 'football' ? (
                <>
                  <TeamBadge code={match.homeTeam} size="xs" />
                  <span className="font-bold text-white">{match.homeTeam}</span>
                  <span className="text-[#A3E635] font-bold mx-0.5 font-sport">
                    {match.homeScore}-{match.awayScore}
                  </span>
                  <span className="font-bold text-white">{match.awayTeam}</span>
                  <TeamBadge code={match.awayTeam} size="xs" />
                </>
              ) : match.sport === 'basketball' ? (
                <>
                  <span className="font-bold text-white">{match.homeTeam}</span>
                  <span className="text-[#A3E635] font-bold mx-0.5 font-sport">
                    {match.homeScore}-{match.awayScore}
                  </span>
                  <span className="font-bold text-white">{match.awayTeam}</span>
                </>
              ) : (
                <>
                  <span className="text-neutral-300 font-medium">{match.homeTeam}</span>
                  <span className="text-neutral-400 font-normal">/</span>
                  <span className="text-neutral-300 font-medium">{match.awayTeam}</span>
                </>
              )}
            </div>

            {/* Divider */}
            <div className="h-3 w-[1px] bg-[#333C4D] mx-0.5"></div>

            {/* Game state / live tag */}
            <div className="flex items-center gap-1.5 font-mono text-[11px]">
              <span className="text-neutral-400">{match.gameState}</span>
              {match.isLive && (
                <span className="inline-flex items-center gap-1 text-[#A3E635] font-semibold text-[11px] uppercase tracking-wider">
                  <Circle className="w-2 h-2 fill-[#A3E635] animate-pulse" />
                  Live
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <div className="flex items-center gap-1 pl-2 border-l border-[#2B3240] shrink-0">
        <button
          id="ticker-prev-btn"
          onClick={handlePrev}
          aria-label="Previous scores"
          className="p-1 rounded hover:bg-[#252A36] text-neutral-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          id="ticker-next-btn"
          onClick={handleNext}
          aria-label="Next scores"
          className="p-1 rounded hover:bg-[#252A36] text-neutral-400 hover:text-white transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
