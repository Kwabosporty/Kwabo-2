import React, { useState } from 'react';
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
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Radio,
  Zap,
} from 'lucide-react';
import { AdminProfile } from '../../types';

export type AdminTab =
  | 'dashboard'
  | 'live-sync'
  | 'standings'
  | 'posts'
  | 'create-post'
  | 'categories'
  | 'audit-logs'
  | 'users'
  | 'settings';

interface SidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  currentUser: AdminProfile | null;
  onViewPublicSite: () => void;
  liveSyncCount?: number;
}

interface NavItem {
  id: AdminTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: 'lime' | 'cyan' | 'neutral';
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Core Command',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      {
        id: 'live-sync',
        label: 'Live Matches Sync',
        icon: Activity,
        badge: 'LIVE',
        badgeColor: 'lime',
      },
      { id: 'standings', label: 'League Standings', icon: Trophy },
    ],
  },
  {
    title: 'Content Management',
    items: [
      { id: 'posts', label: 'All Posts', icon: FileText },
      { id: 'create-post', label: 'Create Post', icon: PlusCircle, badge: 'New', badgeColor: 'cyan' },
      { id: 'categories', label: 'Categories', icon: FolderTree },
    ],
  },
  {
    title: 'System & Control',
    items: [
      { id: 'audit-logs', label: 'Audit Logs', icon: ShieldAlert },
      { id: 'users', label: 'Admin Users', icon: Users },
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  currentUser,
  onViewPublicSite,
}) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 68 : 250 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="relative h-screen bg-[#09090B] border-r border-[#27272A] flex flex-col justify-between select-none z-30 shrink-0"
    >
      {/* Top Brand Area */}
      <div className="flex flex-col">
        <div className="h-16 border-b border-[#27272A] flex items-center justify-between px-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#A3E635] to-[#84cc16] flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(163,230,53,0.3)]">
              <Zap className="w-4 h-4 text-black stroke-[2.5]" />
            </div>

            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.15 }}
                  className="flex flex-col min-w-0 leading-tight"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-sm tracking-tight text-white font-sport">
                      KWABO<span className="text-[#A3E635]">SPORTS</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                      Control Panel
                    </span>
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#A3E635] animate-pulse" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Toggle button */}
          <button
            onClick={onToggleCollapse}
            title={isCollapsed ? 'Expand sidebar (Ctrl+B)' : 'Collapse sidebar'}
            className="p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-[#18181B] border border-transparent hover:border-[#27272A] transition-all"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation Sections */}
        <nav className="p-2.5 space-y-5 overflow-y-auto max-h-[calc(100vh-140px)] scrollbar-thin scrollbar-thumb-[#27272A]">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-1">
              {!isCollapsed && (
                <div className="px-2.5 py-1 text-[10px] font-semibold tracking-wider text-neutral-500 uppercase font-mono">
                  {section.title}
                </div>
              )}

              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;

                return (
                  <div key={item.id} className="relative">
                    <button
                      onClick={() => onSelectTab(item.id)}
                      onMouseEnter={() => setHoveredItem(item.id)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-medium transition-all group relative ${
                        isActive
                          ? 'bg-[#18181B] text-[#A3E635] border border-[#27272A] shadow-sm'
                          : 'text-neutral-400 hover:text-white hover:bg-[#141417]'
                      }`}
                    >
                      {/* Active Indicator Bar on left */}
                      {isActive && (
                        <motion.div
                          layoutId="activeTabIndicator"
                          className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#A3E635] rounded-r-full shadow-[0_0_8px_#A3E635]"
                        />
                      )}

                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive
                            ? 'text-[#A3E635]'
                            : 'text-neutral-400 group-hover:text-white'
                        }`}
                      />

                      {!isCollapsed && (
                        <div className="flex-1 flex items-center justify-between overflow-hidden text-left">
                          <span className="truncate">{item.label}</span>

                          {item.badge && (
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase font-mono tracking-wider shrink-0 flex items-center gap-1 ${
                                item.badgeColor === 'lime'
                                  ? 'bg-[#A3E635]/15 text-[#A3E635] border border-[#A3E635]/30'
                                  : item.badgeColor === 'cyan'
                                  ? 'bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30'
                                  : 'bg-neutral-800 text-neutral-300'
                              }`}
                            >
                              {item.badge === 'LIVE' && (
                                <Radio className="w-2.5 h-2.5 animate-pulse text-[#A3E635]" />
                              )}
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}
                    </button>

                    {/* Floating Tooltip in Collapsed Mode */}
                    {isCollapsed && hoveredItem === item.id && (
                      <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 px-2.5 py-1 bg-[#18181B] text-white text-xs font-medium rounded-md border border-[#27272A] shadow-xl whitespace-nowrap flex items-center gap-2 pointer-events-none">
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#A3E635]/20 text-[#A3E635]">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom Footer Area */}
      <div className="p-2.5 border-t border-[#27272A] space-y-2 bg-[#09090B]">
        {/* Switch to Public Site */}
        <button
          onClick={onViewPublicSite}
          title="Return to Public Live Site"
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-neutral-400 hover:text-white hover:bg-[#18181B] border border-transparent hover:border-[#27272A] transition-all"
        >
          <ExternalLink className="w-4 h-4 shrink-0 text-neutral-500" />
          {!isCollapsed && <span className="truncate">View Public Site</span>}
        </button>

        {/* User profile capsule */}
        {currentUser && (
          <div
            className={`flex items-center gap-2.5 p-1.5 rounded-lg bg-[#121215] border border-[#27272A] ${
              isCollapsed ? 'justify-center' : ''
            }`}
          >
            <img
              src={currentUser.avatar_url}
              alt={currentUser.full_name}
              className="w-7 h-7 rounded-full object-cover border border-[#27272A] shrink-0"
              referrerPolicy="no-referrer"
            />
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-white truncate">
                  {currentUser.full_name}
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[9px] font-mono text-[#A3E635] uppercase font-bold tracking-wider">
                    {currentUser.role}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.aside>
  );
};
