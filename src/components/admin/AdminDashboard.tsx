import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Activity,
  Trophy,
  FileText,
  PlusCircle,
  FolderTree,
  ShieldAlert,
  Users,
  Settings,
  X,
  FileCheck2,
  TrendingUp,
  Radio,
  Clock,
  Sparkles,
  Plus,
} from 'lucide-react';

import { Sidebar, AdminTab } from './Sidebar';
import { Header } from './Header';
import { StatCard } from './StatCard';
import { DataTable } from './DataTable';
import { LiveOpsPanel } from './LiveOpsPanel';
import { CommandPalette } from './CommandPalette';
import { LiveMatchesSyncView } from './LiveMatchesSyncView';
import { LeagueStandingsView } from './LeagueStandingsView';
import { AdminUsersView } from './AdminUsersView';
import { AdminPostEditorView } from './AdminPostEditorView';
import { AdminCategoriesView } from './AdminCategoriesView';
import { AdminPostsListView } from './AdminPostsListView';
import { AdminLogsView } from './AdminLogsView';
import { AdminSettingsView } from './AdminSettingsView';
import { AdminAuthView } from './AdminAuthView';

import { supabaseService } from '../../services/supabaseService';
import {
  AdminPost,
  Category,
  AdminProfile,
  ArticleCard,
  NotificationItem,
} from '../../types';

interface AdminDashboardProps {
  onViewPublicSite: () => void;
  onPreviewArticleModal?: (article: ArticleCard) => void;
  onUserChange?: (user: AdminProfile | null) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onViewPublicSite,
  onPreviewArticleModal,
  onUserChange,
}) => {
  // Navigation & Shell States
  const [currentTab, setCurrentTab] = useState<AdminTab>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Auth User State (Protected Gate)
  const [currentUser, setCurrentUser] = useState<AdminProfile | null>(null);

  // Core Data States
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState(supabaseService.getStats());
  const [logs, setLogs] = useState(supabaseService.getAuditLogs());
  const [settings, setSettings] = useState(supabaseService.getSettings());
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Currently selected post for editing
  const [postToEdit, setPostToEdit] = useState<AdminPost | null>(null);

  // Sync data from database/service
  const refreshAllData = () => {
    const p = supabaseService.getPosts();
    const c = supabaseService.getCategories();
    const s = supabaseService.getStats();
    const l = supabaseService.getAuditLogs();
    const setts = supabaseService.getSettings();

    setPosts(p);
    setCategories(c);
    setStats(s);
    setLogs(l);
    setSettings(setts);
  };

  useEffect(() => {
    // Check active session
    const user = supabaseService.getCurrentUser();
    setCurrentUser(user);
    refreshAllData();

    // Default notifications
    setNotifications([
      {
        id: 'n-1',
        title: 'Live Matches Connected',
        message: 'Premier League & UCL score feeds broadcasting at 60s interval',
        timestamp: '1m ago',
        read: false,
        type: 'live',
      },
      {
        id: 'n-2',
        title: 'New Editorial Article Published',
        message: 'Champions League Tactical Breakdown is live on front-page',
        timestamp: '12m ago',
        read: false,
        type: 'post',
      },
      {
        id: 'n-3',
        title: 'Audit Log Recorded',
        message: 'Super Admin credentials authenticated from verified IP',
        timestamp: '25m ago',
        read: true,
        type: 'audit',
      },
    ]);

    setIsLoadingData(false);

    // Subscribe to real-time audit logs
    const unsub = supabaseService.subscribeToAuditLogs((newLog) => {
      setLogs((prev) => [newLog, ...prev]);
      setStats(supabaseService.getStats());
    });

    // Hash-based URL route parser for /admin/posts/new and /admin/posts/edit/[id]
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'admin/posts/new' || hash === '/admin/posts/new') {
        setPostToEdit(null);
        setCurrentTab('create-post');
      } else if (hash.startsWith('admin/posts/edit/') || hash.startsWith('/admin/posts/edit/')) {
        const id = hash.split('admin/posts/edit/')[1]?.replace('/', '');
        if (id) {
          const allPosts = supabaseService.getPosts();
          const target = allPosts.find((p) => p.id === id);
          if (target) {
            setPostToEdit(target);
            setCurrentTab('create-post');
          }
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      unsub();
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Keyboard shortcut Ctrl+B or ⌘+B to collapse/expand sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        setIsSidebarCollapsed((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers
  const handleLogout = () => {
    supabaseService.logout();
    setCurrentUser(null);
    if (onUserChange) onUserChange(null);
    onViewPublicSite();
  };

  const handleLoginSuccess = (user: AdminProfile) => {
    setCurrentUser(user);
    if (onUserChange) onUserChange(user);
    refreshAllData();
    setCurrentTab('dashboard');
  };

  // Post Actions
  const handleSavePost = (
    postData: Omit<AdminPost, 'id' | 'created_at' | 'updated_at' | 'views'>,
    existingId?: string
  ) => {
    if (existingId) {
      supabaseService.updatePost(existingId, postData);
    } else {
      supabaseService.createPost(postData);
    }
    refreshAllData();
    setPostToEdit(null);
    setCurrentTab('posts');
    window.location.hash = 'admin/posts';
  };

  const handleEditPost = (post: AdminPost) => {
    setPostToEdit(post);
    setCurrentTab('create-post');
    window.location.hash = `admin/posts/edit/${post.id}`;
  };

  const handleDeletePost = (postId: string) => {
    supabaseService.deletePost(postId);
    refreshAllData();
  };

  const handleToggleStatus = (postId: string) => {
    supabaseService.togglePostStatus(postId);
    refreshAllData();
  };

  const handleViewPost = (post: AdminPost) => {
    if (onPreviewArticleModal) {
      onPreviewArticleModal({
        id: post.id,
        title: post.title,
        subtitle: post.excerpt,
        image: post.featured_image,
        category: post.category_name,
        categoryType: 'breaking',
        categoryColor: post.category_color,
        author: `${post.author_name} • ${post.author_role}`,
        authorBio: post.author_bio,
        content: post.content,
        readTime: post.read_time,
      });
    }
  };

  // Category Actions
  const handleCreateCategory = (data: {
    name: string;
    slug: string;
    description: string;
    color: string;
  }) => {
    supabaseService.createCategory(data);
    refreshAllData();
  };

  const handleUpdateCategory = (id: string, updates: Partial<Category>) => {
    supabaseService.updateCategory(id, updates);
    refreshAllData();
  };

  const handleDeleteCategory = (id: string) => {
    supabaseService.deleteCategory(id);
    refreshAllData();
  };

  // Settings Actions
  const handleSaveSettings = (updates: any) => {
    supabaseService.updateSettings(updates);
    refreshAllData();
  };

  // -------------------------------------------------------------
  // PROTECTED AUTHENTICATION & ROLE CHECK (NEXT.JS MIDDLEWARE SIMULATION)
  // -------------------------------------------------------------
  if (!currentUser) {
    return (
      <AdminAuthView
        onLoginSuccess={handleLoginSuccess}
        onViewPublicSite={onViewPublicSite}
        onLogin={(email, pass) => supabaseService.login(email, pass)}
        onRegister={(email, pass) => supabaseService.register(email, pass)}
      />
    );
  }

  // 403 ACCESS DENIED CHECK: Role must strictly be SUPER_ADMIN or EDITOR
  if (currentUser.role !== 'SUPER_ADMIN' && currentUser.role !== 'EDITOR') {
    // Sign out immediately as per Next.js middleware specification
    supabaseService.logout();
    return (
      <AdminAuthView
        onLoginSuccess={handleLoginSuccess}
        onViewPublicSite={onViewPublicSite}
        onLogin={(email, pass) => supabaseService.login(email, pass)}
        onRegister={(email, pass) => supabaseService.register(email, pass)}
        initialError="Access Denied: Admin Privileges Required"
      />
    );
  }

  return (
    <div
      id="kwabo-admin-shell"
      className="min-h-screen bg-[#09090B] text-neutral-100 flex flex-row font-sans selection:bg-[#A3E635] selection:text-black overflow-hidden"
    >
      {/* 1. COLLAPSIBLE LEFT SIDEBAR (DESKTOP) */}
      <div className="hidden md:flex shrink-0">
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => {
            if (tab === 'create-post') {
              setPostToEdit(null);
              window.location.hash = 'admin/posts/new';
            } else if (tab === 'posts') {
              window.location.hash = 'admin/posts';
            }
            setCurrentTab(tab);
          }}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          currentUser={currentUser}
          onViewPublicSite={onViewPublicSite}
          onLogout={handleLogout}
        />
      </div>

      {/* MOBILE DRAWER BACKUP FOR SMALL VIEWPORTS */}
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileDrawerOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Sidebar drawer content */}
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.2 }}
              className="relative w-64 max-w-[85vw] h-full bg-[#09090B] border-r border-[#27272A] z-50 flex flex-col"
            >
              <div className="p-4 border-b border-[#27272A] flex items-center justify-between">
                <span className="font-extrabold text-sm text-white font-sport">
                  KWABO<span className="text-[#A3E635]">SPORTS</span>
                </span>
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-1 rounded-md text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                <Sidebar
                  currentTab={currentTab}
                  onSelectTab={(tab) => {
                    if (tab === 'create-post') {
                      setPostToEdit(null);
                      window.location.hash = 'admin/posts/new';
                    } else if (tab === 'posts') {
                      window.location.hash = 'admin/posts';
                    }
                    setCurrentTab(tab);
                    setIsMobileDrawerOpen(false);
                  }}
                  isCollapsed={false}
                  onToggleCollapse={() => {}}
                  currentUser={currentUser}
                  onViewPublicSite={onViewPublicSite}
                  onLogout={handleLogout}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. MAIN APPLICATION CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-[#09090B]">
        {/* Sticky Header with ⌘K, Heartbeat, and Avatar Menu */}
        <Header
          currentUser={currentUser}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onLogout={handleLogout}
          onViewPublicSite={onViewPublicSite}
          onToggleMobileDrawer={() => setIsMobileDrawerOpen(true)}
          notifications={notifications}
          onMarkNotificationsRead={() => {
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
          }}
          supabaseConnected={true}
        />

        {/* Interior Dynamic Workspace Scrollable Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-[1700px] w-full mx-auto space-y-6 scrollbar-thin scrollbar-thumb-[#27272A]">
          {/* TAB 1: CORE DASHBOARD WORKSPACE */}
          {currentTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Dashboard Sub-Header & Quick Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-white font-sport flex items-center gap-2">
                    Command Overview
                    <span className="text-xs font-mono font-normal text-neutral-400 bg-[#141417] px-2 py-0.5 rounded-md border border-[#27272A]">
                      Live Telemetry
                    </span>
                  </h1>
                  <p className="text-xs text-neutral-400 font-mono mt-0.5">
                    Real-time status across published articles, dynamic view telemetry, categories, and background cron workers.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setPostToEdit(null);
                      setCurrentTab('create-post');
                    }}
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#A3E635] hover:bg-[#8fd624] text-black font-extrabold text-xs uppercase tracking-wider font-mono shadow-[0_0_12px_rgba(163,230,53,0.25)] transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Create Article</span>
                  </button>
                </div>
              </div>

              {/* 3. REAL-TIME SUPABASE INTEGRATION: TOP METRIC CARDS ROW (4-COLUMNS GRID) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {/* 1. Total Published Posts (status = 'PUBLISHED') */}
                <StatCard
                  title="Total Published Posts"
                  value={stats.total_posts.toString()}
                  subtitle={`${stats.drafts_pending} drafts pending`}
                  icon={FileCheck2}
                  accentColor="lime"
                  badge="status = 'PUBLISHED'"
                  trend={{ value: '+12% this week', isPositive: true }}
                />

                {/* 2. Total Article Views (SUM(view_count)) */}
                <StatCard
                  title="Total Article Views"
                  value={stats.total_views.toLocaleString()}
                  subtitle={`${stats.today_views.toLocaleString()} visits today`}
                  icon={TrendingUp}
                  accentColor="cyan"
                  badge="SUM(view_count)"
                  trend={{ value: '+18.4%', isPositive: true }}
                />

                {/* 3. Active Categories Count */}
                <StatCard
                  title="Active Categories Count"
                  value={stats.active_categories.toString()}
                  subtitle="Active taxonomy & hubs"
                  icon={FolderTree}
                  accentColor="yellow"
                  badge="ACTIVE COUNT"
                />

                {/* 4. Sports Feed Status ('Live Sync Active') */}
                <StatCard
                  title="Sports Feed Status"
                  value="Live Sync Active"
                  subtitle="Ingestion cron every 60s"
                  icon={Radio}
                  accentColor="lime"
                  isLive={true}
                  badge="WSS + REST"
                />
              </div>

              {/* 3. MAIN CONTENT AREA (2-COLUMN GRID SPLIT 70/30) */}
              <div className="grid grid-cols-1 lg:grid-cols-10 gap-5 items-start">
                {/* Left (70%): Recent Articles Data Table */}
                <div className="lg:col-span-7">
                  <DataTable
                    posts={posts}
                    categories={categories}
                    onEditPost={handleEditPost}
                    onToggleStatus={handleToggleStatus}
                    onDeletePost={handleDeletePost}
                    onPreviewPost={handleViewPost}
                  />
                </div>

                {/* Right (30%): Live Operations Panel */}
                <div className="lg:col-span-3">
                  <LiveOpsPanel
                    onViewAllLogs={() => setCurrentTab('audit-logs')}
                    onLiveSyncSuccess={refreshAllData}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LIVE MATCHES SYNC */}
          {currentTab === 'live-sync' && <LiveMatchesSyncView />}

          {/* TAB 3: LEAGUE STANDINGS */}
          {currentTab === 'standings' && <LeagueStandingsView />}

          {/* TAB 4: ALL POSTS LIST */}
          {currentTab === 'posts' && (
            <AdminPostsListView
              posts={posts}
              categories={categories}
              onCreateNew={() => {
                setPostToEdit(null);
                setCurrentTab('create-post');
                window.location.hash = 'admin/posts/new';
              }}
              onEditPost={handleEditPost}
              onDeletePost={handleDeletePost}
              onViewPost={handleViewPost}
            />
          )}

          {/* TAB 5: CREATE / EDIT POST (WYSIWYG STUDIO) */}
          {currentTab === 'create-post' && (
            <AdminPostEditorView
              postToEdit={postToEdit}
              categories={categories}
              onSavePost={handleSavePost}
              onCancel={() => {
                setPostToEdit(null);
                setCurrentTab('posts');
                window.location.hash = 'admin/posts';
              }}
            />
          )}

          {/* TAB 6: CATEGORIES */}
          {currentTab === 'categories' && (
            <AdminCategoriesView
              categories={categories}
              onCreateCategory={handleCreateCategory}
              onUpdateCategory={handleUpdateCategory}
              onDeleteCategory={handleDeleteCategory}
            />
          )}

          {/* TAB 7: AUDIT LOGS */}
          {currentTab === 'audit-logs' && (
            <AdminLogsView
              logs={logs}
              stats={stats}
              posts={posts}
              categories={categories}
            />
          )}

          {/* TAB 8: ADMIN USERS (RBAC) */}
          {currentTab === 'users' && <AdminUsersView />}

          {/* TAB 9: SETTINGS */}
          {currentTab === 'settings' && (
            <AdminSettingsView
              settings={settings}
              posts={posts}
              onSaveSettings={handleSaveSettings}
            />
          )}
        </div>
      </div>

      {/* Global ⌘K Command Palette Dialog */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTab={(tab) => {
          if (tab === 'create-post') setPostToEdit(null);
          setCurrentTab(tab);
        }}
        posts={posts}
        categories={categories}
        onSelectPost={handleViewPost}
        onTriggerSync={async () => {
          await supabaseService.triggerLiveSportsSync();
          refreshAllData();
        }}
        onViewPublicSite={onViewPublicSite}
      />
    </div>
  );
};
