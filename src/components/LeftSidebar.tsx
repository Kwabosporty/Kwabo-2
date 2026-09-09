import React from 'react';
import { ChevronRight, Zap, BarChart2, RefreshCw } from 'lucide-react';

interface LeftSidebarProps {
  selectedSport: string;
  onSelectSport: (sport: string) => void;
  selectedLeague: string;
  onSelectLeague: (league: string) => void;
  selectedContentType: string;
  onSelectContentType: (type: string) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  selectedSport,
  onSelectSport,
  selectedLeague,
  onSelectLeague,
  selectedContentType,
  onSelectContentType,
  isMobileOpen,
  onCloseMobile,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          id="sidebar-mobile-backdrop"
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 z-40 md:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      <aside
        id="left-sidebar-nav"
        className={`fixed md:sticky top-[102px] h-[calc(100vh-102px)] overflow-y-auto bg-[#121417] border-r border-[#22262F] z-40 transition-transform duration-300 md:translate-x-0 w-64 lg:w-[220px] xl:w-[240px] shrink-0 px-4 py-5 flex flex-col justify-between select-none ${
          isMobileOpen ? 'translate-x-0 left-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* SECTION A: ALL SPORTS */}
          <div>
            <h3 className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase mb-3 px-2">
              ALL SPORTS
            </h3>

            <div className="space-y-1">
              {/* Football (with nested Premier League & La Liga) */}
              <div>
                <button
                  id="sidebar-sport-football"
                  onClick={() => {
                    onSelectSport('football');
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-bold transition-all text-left group ${
                    selectedSport === 'football'
                      ? 'text-[#A3E635] bg-[#1E251E]/60'
                      : 'text-neutral-300 hover:text-white hover:bg-[#1A1E24]'
                  }`}
                >
                  <span className="text-base group-hover:scale-110 transition-transform">⚽</span>
                  <span className="tracking-wide">FOOTBALL</span>
                </button>

                {/* Nested Links under Football */}
                <div className="ml-5 mt-1 space-y-1 border-l-2 border-[#262C38] pl-2.5">
                  <button
                    id="sidebar-sub-premier-league"
                    onClick={() => {
                      onSelectSport('football');
                      onSelectLeague('premier-league');
                    }}
                    className={`w-full flex items-center gap-1.5 py-1.5 px-2 rounded text-xs font-semibold transition-colors text-left ${
                      selectedLeague === 'premier-league'
                        ? 'text-white font-bold bg-[#252C38]'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <ChevronRight className="w-3 h-3 text-neutral-500" />
                    <span>Premier League</span>
                  </button>

                  <button
                    id="sidebar-sub-la-liga"
                    onClick={() => {
                      onSelectSport('football');
                      onSelectLeague('la-liga');
                    }}
                    className={`w-full flex items-center gap-1.5 py-1.5 px-2 rounded text-xs font-semibold transition-colors text-left ${
                      selectedLeague === 'la-liga'
                        ? 'text-white font-bold bg-[#252C38]'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <ChevronRight className="w-3 h-3 text-neutral-500" />
                    <span>La Liga</span>
                  </button>
                </div>
              </div>

              {/* Basketball */}
              <button
                id="sidebar-sport-basketball"
                onClick={() => {
                  onSelectSport('basketball');
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-bold transition-all text-left group ${
                  selectedSport === 'basketball'
                    ? 'text-[#A3E635] bg-[#1E251E]/60'
                    : 'text-neutral-300 hover:text-white hover:bg-[#1A1E24]'
                }`}
              >
                <span className="text-base group-hover:scale-110 transition-transform">🏀</span>
                <span className="tracking-wide">BASKETBALL</span>
              </button>

              {/* Motorsport */}
              <button
                id="sidebar-sport-motorsport"
                onClick={() => {
                  onSelectSport('motorsport');
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-bold transition-all text-left group ${
                  selectedSport === 'motorsport'
                    ? 'text-[#A3E635] bg-[#1E251E]/60'
                    : 'text-neutral-300 hover:text-white hover:bg-[#1A1E24]'
                }`}
              >
                <span className="text-base group-hover:scale-110 transition-transform">🏎️</span>
                <span className="tracking-wide">MOTORSPORT</span>
              </button>
            </div>
          </div>

          <div className="h-[1px] bg-[#22262F] my-2" />

          {/* SECTION B: CONTENT TYPES */}
          <div>
            <h3 className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase mb-3 px-2">
              CONTENT TYPES
            </h3>

            <div className="space-y-1">
              <button
                id="sidebar-content-news"
                onClick={() => onSelectContentType('news')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left ${
                  selectedContentType === 'news'
                    ? 'text-[#A3E635] bg-[#1E251E]/60 font-bold'
                    : 'text-neutral-300 hover:text-white hover:bg-[#1A1E24]'
                }`}
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>News</span>
              </button>

              <button
                id="sidebar-content-analysis"
                onClick={() => onSelectContentType('analysis')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left ${
                  selectedContentType === 'analysis'
                    ? 'text-[#A3E635] bg-[#1E251E]/60 font-bold'
                    : 'text-neutral-300 hover:text-white hover:bg-[#1A1E24]'
                }`}
              >
                <BarChart2 className="w-4 h-4 text-[#00E5FF]" />
                <span>Analysis</span>
              </button>

              <button
                id="sidebar-content-transfers"
                onClick={() => onSelectContentType('transfers')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left ${
                  selectedContentType === 'transfers'
                    ? 'text-[#A3E635] bg-[#1E251E]/60 font-bold'
                    : 'text-neutral-300 hover:text-white hover:bg-[#1A1E24]'
                }`}
              >
                <RefreshCw className="w-4 h-4 text-emerald-400" />
                <span>Transfers</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom subtle system indicator */}
        <div className="pt-4 border-t border-[#22262F]/60 text-[10px] text-neutral-400 flex items-center justify-between">
          <span>Kwabo Live Engine v2.4</span>
          <span className="w-2 h-2 rounded-full bg-[#A3E635] animate-ping" />
        </div>
      </aside>
    </>
  );
};
