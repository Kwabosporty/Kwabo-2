import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Command,
  Bell,
  CheckCircle2,
  LogOut,
  ExternalLink,
  User,
  Shield,
  Menu,
  Sparkles,
  Database,
  Radio,
  Clock,
  X,
} from 'lucide-react';
import { AdminProfile, NotificationItem } from '../../types';

interface HeaderProps {
  currentUser: AdminProfile | null;
  onOpenCommandPalette: () => void;
  onLogout: () => void;
  onViewPublicSite: () => void;
  onToggleMobileDrawer?: () => void;
  notifications: NotificationItem[];
  onMarkNotificationsRead?: () => void;
  supabaseConnected?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onOpenCommandPalette,
  onLogout,
  onViewPublicSite,
  onToggleMobileDrawer,
  notifications,
  onMarkNotificationsRead,
  supabaseConnected = true,
}) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-20 h-16 bg-[#09090B]/90 backdrop-blur-md border-b border-[#27272A] px-4 md:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Quick Search ⌘K */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        {onToggleMobileDrawer && (
          <button
            onClick={onToggleMobileDrawer}
            className="md:hidden p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-[#18181B] border border-[#27272A]"
            aria-label="Open sidebar drawer"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}

        {/* Global Quick-Search Command Bar (⌘K) */}
        <button
          onClick={onOpenCommandPalette}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-[#141417] hover:bg-[#18181B] border border-[#27272A] hover:border-neutral-600 text-xs text-neutral-400 hover:text-neutral-200 transition-all shadow-inner group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white transition-colors" />
            <span className="truncate">Search articles, categories, actions...</span>
          </div>
          <div className="flex items-center gap-1 font-mono text-[10px] bg-[#27272A]/80 text-neutral-400 px-1.5 py-0.5 rounded border border-[#3F3F46]">
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </div>
        </button>
      </div>

      {/* Right Controls: Real-Time Heartbeat + Notifications + User Menu */}
      <div className="flex items-center gap-2 md:gap-3.5">
        {/* Real-time Sync Heartbeat Status Indicator */}
        <div
          title="Active Real-time Supabase Data Pipeline"
          className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#121215] border border-[#27272A] text-xs"
        >
          <span className="relative flex h-2 w-2">
            {supabaseConnected && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A3E635] opacity-75" />
            )}
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                supabaseConnected ? 'bg-[#A3E635]' : 'bg-amber-400'
              }`}
            />
          </span>
          <span className="font-mono text-[11px] text-neutral-300 flex items-center gap-1">
            <Database className="w-3 h-3 text-[#A3E635]" />
            {supabaseConnected ? 'Supabase Connected' : 'Sync Reconnecting'}
          </span>
          <span className="hidden lg:inline-block text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#27272A] text-neutral-400">
            REST + WSS
          </span>
        </div>

        {/* Notifications Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setIsNotifOpen(!isNotifOpen);
              if (onMarkNotificationsRead && !isNotifOpen) {
                onMarkNotificationsRead();
              }
            }}
            className="relative p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-[#18181B] border border-transparent hover:border-[#27272A] transition-all"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_6px_#00E5FF]" />
            )}
          </button>

          {/* Notifications Dropdown Drawer */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-88 rounded-xl bg-[#121215] border border-[#27272A] shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#27272A]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    System Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#00E5FF]/20 text-[#00E5FF]">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setIsNotifOpen(false)}
                  className="p-1 text-neutral-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#27272A]">
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-xs text-neutral-500">
                    No active notifications
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-2 rounded-lg border text-xs transition-colors ${
                        notif.read
                          ? 'bg-[#141417] border-[#27272A]/60 text-neutral-400'
                          : 'bg-[#18181B] border-[#27272A] text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-semibold text-white flex items-center gap-1.5">
                          {notif.type === 'live' ? (
                            <Radio className="w-3 h-3 text-[#A3E635]" />
                          ) : notif.type === 'audit' ? (
                            <Shield className="w-3 h-3 text-[#00E5FF]" />
                          ) : (
                            <Sparkles className="w-3 h-3 text-amber-400" />
                          )}
                          {notif.title}
                        </span>
                        <span className="text-[10px] font-mono text-neutral-500 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {notif.timestamp}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-300 leading-snug">
                        {notif.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar Dropdown Menu */}
        {currentUser && (
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full bg-[#141417] hover:bg-[#18181B] border border-[#27272A] transition-all"
            >
              <img
                src={currentUser.avatar_url}
                alt={currentUser.full_name}
                className="w-6 h-6 rounded-full object-cover border border-[#27272A]"
                referrerPolicy="no-referrer"
              />
              <span className="hidden sm:inline-block text-xs font-semibold text-neutral-200 max-w-[110px] truncate">
                {currentUser.full_name.split(' ')[0]}
              </span>
              <span className="text-[9px] font-mono font-bold text-[#A3E635] bg-[#A3E635]/15 px-1 py-0.2 rounded border border-[#A3E635]/30">
                ADMIN
              </span>
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#121215] border border-[#27272A] shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-2 border-b border-[#27272A] mb-1">
                  <div className="text-xs font-bold text-white truncate">
                    {currentUser.full_name}
                  </div>
                  <div className="text-[11px] text-neutral-400 font-mono truncate">
                    {currentUser.email}
                  </div>
                  <div className="mt-1 flex items-center gap-1">
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#A3E635]/20 text-[#A3E635] font-bold">
                      {currentUser.role}
                    </span>
                    <span className="text-[9px] text-neutral-500 font-mono">
                      ID: {currentUser.id.slice(0, 8)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onViewPublicSite();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-neutral-300 hover:text-white hover:bg-[#18181B] transition-colors text-left"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Switch to Public Site</span>
                </button>

                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-400" />
                  <span>Sign Out Session</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Explicit Sign Out Button in Header Bar */}
        {currentUser && (
          <button
            id="header-explicit-signout-btn"
            onClick={onLogout}
            title="Sign out of Admin Command Center"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#141417] hover:bg-red-500/10 text-neutral-400 hover:text-red-400 border border-[#27272A] hover:border-red-500/30 transition-all text-xs font-mono"
          >
            <LogOut className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden md:inline">Sign Out</span>
          </button>
        )}
      </div>
    </header>
  );
};
