import React from 'react';
import {
  LayoutDashboard,
  FileText,
  PenSquare,
  Tags,
  BarChart3,
  Settings,
  LogOut,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { AdminProfile } from '../../types';

export type AdminTab = 'overview' | 'posts' | 'create' | 'categories' | 'logs' | 'settings';

interface AdminSidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  user: AdminProfile | null;
  onLogout: () => void;
  onViewPublicSite: () => void;
  postDraftsCount?: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onSelectTab,
  user,
  onLogout,
  onViewPublicSite,
  postDraftsCount = 0,
}) => {
  const navItems: {
    id: AdminTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number;
    badgeColor?: string;
  }[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
    },
    {
      id: 'posts',
      label: 'Posts & Blog',
      icon: FileText,
      badge: postDraftsCount > 0 ? `${postDraftsCount} drafts` : undefined,
      badgeColor: 'bg-[#FACC15]/20 text-[#FACC15] border-[#FACC15]/30',
    },
    {
      id: 'create',
      label: 'Create New Post',
      icon: PenSquare,
    },
    {
      id: 'categories',
      label: 'Categories',
      icon: Tags,
    },
    {
      id: 'logs',
      label: 'Analytics & Logs',
      icon: BarChart3,
    },
    {
      id: 'settings',
      label: 'Site Settings',
      icon: Settings,
    },
  ];

  return (
    <aside
      id="admin-navigation-sidebar"
      className="w-60 min-w-[240px] max-w-[240px] bg-[#121212] border-r border-[#22262F] flex flex-col justify-between h-screen sticky top-0 z-40 select-none"
    >
      {/* Top Section: Brand + Super Admin Badge */}
      <div className="p-4 border-b border-[#22262F]">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center tracking-tighter">
            <span className="text-xl font-black italic tracking-tighter text-[#A3E635] font-sport">
              KWABO
            </span>
            <span className="text-xl font-black italic tracking-tighter text-white font-sport ml-0.5">
              SPORTS
            </span>
            <span className="ml-2 text-[10px] font-mono tracking-widest text-[#00E5FF] uppercase bg-[#00E5FF]/10 border border-[#00E5FF]/30 px-1.5 py-0.5 rounded">
              ADMIN
            </span>
          </div>

          <div className="flex items-center justify-between mt-1">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#1E2E1E] border border-[#A3E635]/40 text-[#A3E635] text-[10px] font-mono font-bold shadow-[0_0_8px_rgba(163,230,53,0.2)]">
              <ShieldCheck className="w-3 h-3 text-[#A3E635]" />
              <span>SUPER_ADMIN</span>
            </div>

            <button
              onClick={onViewPublicSite}
              title="Return to Public Fan Portal"
              className="text-[11px] text-neutral-400 hover:text-white flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-[#1C2028] transition-colors"
            >
              <span>Site</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Center Navigation Links */}
      <div className="flex-1 py-4 px-2 space-y-1 overflow-y-auto no-scrollbar">
        <div className="px-3 pb-2 text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
          Management
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              id={`admin-nav-${item.id}`}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
                isActive
                  ? 'bg-[#1A1E24] text-[#A3E635] border-l-3 border-[#A3E635] shadow-[0_0_12px_rgba(163,230,53,0.15)] font-sport tracking-wide'
                  : 'text-neutral-400 hover:text-white hover:bg-[#16181D]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-[#A3E635]' : 'text-neutral-500'
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                    item.badgeColor || 'bg-neutral-800 text-neutral-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-4 px-3 pb-2 text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
          System Schema
        </div>

        <div className="px-3 py-2 bg-[#16191E] rounded-lg border border-[#242A35] text-[10px] text-neutral-400 space-y-1">
          <div className="flex items-center justify-between text-[#00E5FF]">
            <span className="font-mono">Supabase Sync</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
          </div>
          <div className="text-[9px] text-neutral-500 font-mono truncate">
            tables: posts, categories, profiles, audit_logs
          </div>
        </div>
      </div>

      {/* Bottom: User Profile Pill + Log Out Button */}
      <div className="p-3 border-t border-[#22262F] bg-[#101216]">
        <div className="flex items-center justify-between gap-2 bg-[#171A21] border border-[#262C38] p-2.5 rounded-xl">
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={
                user?.avatar_url ||
                'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80'
              }
              alt={user?.full_name || 'Admin'}
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full object-cover border border-[#A3E635]/50 shrink-0"
            />
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">
                {user?.full_name || 'Elena Rostova'}
              </div>
              <div className="text-[10px] text-neutral-400 font-mono truncate">
                {user?.email || 'admin@kwabosports.com'}
              </div>
            </div>
          </div>

          <button
            id="admin-logout-btn"
            onClick={onLogout}
            title="Log Out of Admin Session"
            className="p-1.5 text-neutral-400 hover:text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
