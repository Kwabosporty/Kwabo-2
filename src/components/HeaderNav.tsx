import React, { useState } from 'react';
import { Search, ChevronDown, Menu, X, Globe, ShieldCheck, LogOut, Bookmark } from 'lucide-react';
import { AdminProfile } from '../types';
import { useBookmarks } from '../utils/bookmarkStorage';

interface HeaderNavProps {
  onOpenSearch: () => void;
  onOpenAuth: () => void;
  onOpenAdmin?: () => void;
  onLogout?: () => void;
  currentUser?: AdminProfile | null;
  activeNav: string;
  onSelectNav: (nav: string) => void;
  onToggleMobileSidebar: () => void;
  isMobileSidebarOpen: boolean;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  onOpenSearch,
  onOpenAuth,
  onOpenAdmin,
  onLogout,
  currentUser,
  activeNav,
  onSelectNav,
  onToggleMobileSidebar,
  isMobileSidebarOpen,
}) => {
  const { bookmarkedIds } = useBookmarks();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const navItems = [
    {
      id: 'football',
      label: 'Football',
      hasDropdown: true,
      subItems: ['Premier League', 'La Liga', 'UEFA Champions League', 'Serie A', 'Bundesliga'],
    },
    {
      id: 'basketball',
      label: 'Basketball',
      hasDropdown: true,
      subItems: ['NBA', 'EuroLeague', 'WNBA', 'NCAA'],
    },
    {
      id: 'motorsport',
      label: 'Motorsport',
      hasDropdown: true,
      subItems: ['Formula 1', 'MotoGP', 'WEC', 'NASCAR'],
    },
    {
      id: 'combat',
      label: 'Combat',
      hasDropdown: true,
      subItems: ['UFC', 'Boxing', 'ONE Championship', 'Bellator'],
    },
    {
      id: 'all-sports',
      label: 'All Sports',
      icon: '☰',
      isSpecial: true,
    },
  ];

  return (
    <header id="main-header" className="w-full bg-[#121212] border-b border-[#22262F] sticky top-[38px] z-30 px-4 lg:px-6 py-3">
      <div className="flex items-center justify-between gap-4 max-w-[1920px] mx-auto">
        {/* Left: Mobile sidebar toggle + Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            id="mobile-menu-toggle"
            onClick={onToggleMobileSidebar}
            aria-label="Toggle sidebar menu"
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#1E2229] md:hidden"
          >
            {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div
            id="brand-logo"
            onClick={() => onSelectNav('all-sports')}
            className="flex items-center cursor-pointer group select-none tracking-tighter"
          >
            <span className="text-2xl sm:text-3xl font-black italic tracking-tighter text-[#A3E635] font-sport transition-transform group-hover:scale-[1.02]">
              KWABO
            </span>
            <span className="text-2xl sm:text-3xl font-black italic tracking-tighter text-white font-sport ml-0.5">
              SPORTS
            </span>
          </div>
        </div>

        {/* Center: Desktop Navigation Links with dropdown carets */}
        <nav id="desktop-nav-links" className="hidden md:flex items-center gap-1 lg:gap-3 text-sm font-semibold">
          {navItems.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => item.hasDropdown && setOpenDropdown(item.id)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  id={`nav-item-${item.id}`}
                  onClick={() => onSelectNav(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all select-none ${
                    isActive || (item.isSpecial && activeNav === 'all-sports')
                      ? 'text-[#A3E635] font-bold border-b-2 border-[#A3E635]'
                      : 'text-neutral-300 hover:text-white hover:bg-[#1A1D24]'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.hasDropdown && (
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        openDropdown === item.id ? 'rotate-180 text-[#A3E635]' : 'text-neutral-400'
                      }`}
                    />
                  )}
                  {item.icon && <span className="text-base leading-none ml-0.5">{item.icon}</span>}
                </button>

                {/* Dropdown Menu */}
                {item.hasDropdown && openDropdown === item.id && (
                  <div className="absolute left-0 top-full mt-1 w-52 bg-[#181B20] border border-[#2D3340] rounded-lg shadow-2xl py-2 z-50">
                    {item.subItems?.map((sub, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => {
                          onSelectNav(item.id);
                          setOpenDropdown(null);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-neutral-300 hover:text-white hover:bg-[#232833] hover:text-[#A3E635] transition-colors flex items-center justify-between"
                      >
                        <span>{sub}</span>
                        <span className="text-[10px] text-neutral-500 font-mono">Live</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Right: Search + Saved Bookmarks + Auth Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            id="global-search-btn"
            onClick={onOpenSearch}
            aria-label="Search KwaboSports"
            className="p-2 rounded-lg text-neutral-300 hover:text-white hover:bg-[#1C2028] transition-colors cursor-pointer"
            title="Search matches, leagues, players"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Bookmarks Counter Indicator */}
          <div
            id="header-saved-bookmarks-indicator"
            title={
              bookmarkedIds.length > 0
                ? `${bookmarkedIds.length} article${bookmarkedIds.length === 1 ? '' : 's'} saved to local bookmarks`
                : 'No saved articles yet. Click bookmark on any article to save locally!'
            }
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors select-none ${
              bookmarkedIds.length > 0
                ? 'bg-[#192219] text-[#A3E635] border border-[#A3E635]/30'
                : 'bg-transparent text-neutral-500 border border-transparent'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${bookmarkedIds.length > 0 ? 'fill-[#A3E635]' : ''}`} />
            <span className="font-bold">{bookmarkedIds.length}</span>
            <span className="hidden lg:inline text-[11px] text-neutral-400">SAVED</span>
          </div>

          {!currentUser ? (
            /* Unauthenticated Public Visitor: Show SIGN IN only. Public sign-ups are disabled. ADMIN CMS is NOT visible. */
            <button
              id="header-sign-in-btn"
              onClick={onOpenAuth}
              className="border border-[#4B5563] hover:border-[#A3E635] hover:text-[#A3E635] text-white text-xs sm:text-sm font-bold tracking-wider px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-md transition-all uppercase whitespace-nowrap bg-transparent hover:bg-[#A3E635]/10 flex items-center gap-1.5 font-mono"
            >
              <span>SIGN IN</span>
            </button>
          ) : (
            /* Authenticated Admin: ONLY accessible after an admin logs in */
            <div className="flex items-center gap-2">
              {onOpenAdmin && (
                <button
                  id="header-admin-cms-btn"
                  onClick={onOpenAdmin}
                  title="Open KwaboSports Admin CMS & Studio"
                  className="bg-[#1C2028] hover:bg-[#252B36] border border-[#A3E635]/50 hover:border-[#A3E635] text-[#A3E635] text-xs font-bold px-3 py-1.5 sm:py-2 rounded-md transition-all uppercase tracking-wider flex items-center gap-1.5 font-sport cursor-pointer shadow-xs"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#A3E635]" />
                  <span className="hidden sm:inline">ADMIN CMS</span>
                  <span className="sm:hidden">CMS</span>
                </button>
              )}

              {/* Admin Avatar and Logout Action */}
              <div className="flex items-center gap-2 pl-2 border-l border-[#27272A]">
                <button
                  onClick={onOpenAdmin}
                  title={`Logged in as ${currentUser.full_name} (${currentUser.role})`}
                  className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
                >
                  <img
                    src={currentUser.avatar_url}
                    alt={currentUser.full_name}
                    className="w-7 h-7 rounded-full object-cover border border-[#A3E635]/50"
                    referrerPolicy="no-referrer"
                  />
                  <span className="hidden lg:inline-block text-xs font-semibold text-white max-w-[100px] truncate">
                    {currentUser.full_name.split(' ')[0]}
                  </span>
                </button>

                {onLogout && (
                  <button
                    id="header-admin-logout-btn"
                    onClick={onLogout}
                    title="Log Out of Admin Session"
                    className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 px-2 py-1.5 rounded-md border border-transparent hover:border-red-500/20 transition-all font-mono font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-400" />
                    <span className="hidden sm:inline">LOGOUT</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
