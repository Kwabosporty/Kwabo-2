import React, { useState, useEffect } from 'react';
import { ScoreTicker } from './components/ScoreTicker';
import { HeaderNav } from './components/HeaderNav';
import { LeftSidebar } from './components/LeftSidebar';
import { HeroBento } from './components/HeroBento';
import { LeagueHubWidget } from './components/LeagueHubWidget';
import { LiveMatchCentreWidget } from './components/LiveMatchCentreWidget';
import { FanZonePoll } from './components/FanZonePoll';
import { UpcomingFixtures } from './components/UpcomingFixtures';
import { LatestNewsFeed } from './components/LatestNewsFeed';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { AuthModal } from './components/AuthModal';
import { ArticleModal } from './components/ArticleModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ArticleCard, AdminProfile } from './types';
import { supabaseService } from './services/supabaseService';

export default function App() {
  const [currentView, setCurrentView] = useState<'public' | 'admin'>('public');
  const [currentUser, setCurrentUser] = useState<AdminProfile | null>(() => supabaseService.getCurrentUser());
  const [activeNav, setActiveNav] = useState('all-sports');
  const [selectedSport, setSelectedSport] = useState('football');
  const [selectedLeague, setSelectedLeague] = useState('premier-league');
  const [selectedContentType, setSelectedContentType] = useState('news');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<ArticleCard | null>(null);

  // Check URL hash for direct #admin and #admin/login links
  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('admin')) {
        setCurrentView('admin');
      } else {
        setCurrentView('public');
      }
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  const handleNavigateAdmin = () => {
    setCurrentView('admin');
    window.location.hash = 'admin/dashboard';
  };

  const handleNavigatePublic = () => {
    setCurrentView('public');
    window.location.hash = '';
  };

  const handleLogout = () => {
    supabaseService.logout();
    setCurrentUser(null);
    setCurrentView('public');
    window.location.hash = '';
  };

  if (currentView === 'admin') {
    return (
      <>
        <AdminDashboard
          onViewPublicSite={handleNavigatePublic}
          onUserChange={setCurrentUser}
          onPreviewArticleModal={(article) => setSelectedArticle(article)}
        />
        <ArticleModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col font-sans selection:bg-[#A3E635] selection:text-black">
      {/* 2.A: Persistent Top Sticky Score Ticker */}
      <ScoreTicker />

      {/* 2.B: Brand & Navigation Bar (Below Ticker) */}
      <HeaderNav
        activeNav={activeNav}
        currentUser={currentUser}
        onLogout={handleLogout}
        onSelectNav={(nav) => {
          setActiveNav(nav);
          if (nav === 'football' || nav === 'basketball' || nav === 'motorsport') {
            setSelectedSport(nav);
          }
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAdmin={handleNavigateAdmin}
        isMobileSidebarOpen={isMobileSidebarOpen}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />

      {/* Main Layout: Left Sidebar (~20%) + Main Bento Content (~80%) */}
      <div className="flex-1 w-full max-w-[1920px] mx-auto flex items-start">
        {/* 3: Left Sidebar Navigation Component */}
        <LeftSidebar
          selectedSport={selectedSport}
          onSelectSport={(sport) => {
            setSelectedSport(sport);
            setActiveNav(sport);
          }}
          selectedLeague={selectedLeague}
          onSelectLeague={setSelectedLeague}
          selectedContentType={selectedContentType}
          onSelectContentType={setSelectedContentType}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* 4: Main Content Component (Bento Grid) - ~80% of viewport */}
        <main
          id="main-bento-content"
          className="flex-1 min-w-0 px-3.5 sm:px-5 lg:px-6 py-4 space-y-4 max-w-[1600px]"
        >
          {/* 4.1: Top Hero Article & Secondary Cards (3-Card Grid) */}
          <section id="hero-bento-section">
            <HeroBento onSelectArticle={(article) => setSelectedArticle(article)} />
          </section>

          {/* 4.2: Lower Data Widgets (3-Column Bento Row) */}
          <section
            id="lower-data-widgets-row"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 items-stretch"
          >
            {/* Column A: FEATURED LEAGUE HUB */}
            <div className="flex flex-col">
              <LeagueHubWidget />
            </div>

            {/* Column B: LIVE MATCH CENTRE */}
            <div className="flex flex-col">
              <LiveMatchCentreWidget />
            </div>

            {/* Column C: FAN ZONE POLL */}
            <div className="flex flex-col md:col-span-2 lg:col-span-1">
              <FanZonePoll />
            </div>
          </section>

          {/* 4.3: LATEST NEWS & INSIGHTS FEED */}
          <LatestNewsFeed onSelectArticle={(article) => setSelectedArticle(article)} />

          {/* 4.4: Full-Width Section (Bottom) - UPCOMING FIXTURES */}
          <section id="fixtures-bento-section" className="pt-1">
            <UpcomingFixtures />
          </section>
        </main>
      </div>

      {/* Global Application Footer */}
      <Footer />

      {/* Interactive Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectResult={(query) => {
          if (query.toLowerCase().includes('premier') || query.toLowerCase().includes('standings')) {
            setSelectedSport('football');
            setSelectedLeague('premier-league');
          }
        }}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onOpenAdmin={handleNavigateAdmin}
        onLoginAdmin={(user) => {
          setCurrentUser(user);
          handleNavigateAdmin();
        }}
      />

      <ArticleModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />
    </div>
  );
}
