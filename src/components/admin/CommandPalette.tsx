import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Command,
  FileText,
  PlusCircle,
  FolderTree,
  ShieldAlert,
  Users,
  Settings,
  Activity,
  ExternalLink,
  X,
  CornerDownLeft,
} from 'lucide-react';
import { AdminPost, Category } from '../../types';
import { AdminTab } from './Sidebar';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: AdminTab) => void;
  posts: AdminPost[];
  categories: Category[];
  onSelectPost: (post: AdminPost) => void;
  onTriggerSync: () => void;
  onViewPublicSite: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  posts,
  categories,
  onSelectPost,
  onTriggerSync,
  onViewPublicSite,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Global keyboard listener for ⌘K and Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Available system actions
  const systemActions = [
    {
      id: 'act-new-post',
      title: 'Create New Article',
      category: 'Actions',
      icon: PlusCircle,
      action: () => {
        onSelectTab('create-post');
        onClose();
      },
    },
    {
      id: 'act-sync-sports',
      title: 'Trigger Live Sports Sync',
      category: 'Actions',
      icon: Activity,
      action: () => {
        onTriggerSync();
        onClose();
      },
    },
    {
      id: 'act-categories',
      title: 'Manage Categories',
      category: 'Navigation',
      icon: FolderTree,
      action: () => {
        onSelectTab('categories');
        onClose();
      },
    },
    {
      id: 'act-audit',
      title: 'View System Audit Logs',
      category: 'Navigation',
      icon: ShieldAlert,
      action: () => {
        onSelectTab('audit-logs');
        onClose();
      },
    },
    {
      id: 'act-users',
      title: 'Manage Admin Users',
      category: 'Navigation',
      icon: Users,
      action: () => {
        onSelectTab('users');
        onClose();
      },
    },
    {
      id: 'act-public',
      title: 'Switch to Public Live Site',
      category: 'System',
      icon: ExternalLink,
      action: () => {
        onViewPublicSite();
        onClose();
      },
    },
  ];

  // Filtered results
  const filteredActions = systemActions.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase())
  );

  const filteredPosts = posts
    .filter((p) => p.title.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 4);

  const filteredCategories = categories
    .filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 3);

  const allResults = [
    ...filteredActions.map((a) => ({ type: 'action' as const, data: a })),
    ...filteredPosts.map((p) => ({ type: 'post' as const, data: p })),
    ...filteredCategories.map((c) => ({ type: 'category' as const, data: c })),
  ];

  const handleKeyDownInMenu = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, allResults.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + allResults.length) % Math.max(1, allResults.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const current = allResults[selectedIndex];
      if (current) {
        if (current.type === 'action') {
          current.data.action();
        } else if (current.type === 'post') {
          onSelectPost(current.data);
          onClose();
        } else if (current.type === 'category') {
          onSelectTab('categories');
          onClose();
        }
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-in fade-in duration-150">
      <div
        className="w-full max-w-xl rounded-2xl bg-[#121215] border border-[#27272A] shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDownInMenu}
      >
        {/* Search Input Bar */}
        <div className="p-3.5 border-b border-[#27272A] flex items-center gap-3 bg-[#0e0e11]">
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or search articles, categories..."
            className="w-full bg-transparent text-sm text-white placeholder-neutral-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-[#18181B]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-3 scrollbar-thin scrollbar-thumb-[#27272A]">
          {allResults.length === 0 ? (
            <div className="py-10 text-center text-xs text-neutral-500 font-mono">
              No matching commands or articles found for "{query}"
            </div>
          ) : (
            <>
              {/* Actions */}
              {filteredActions.length > 0 && (
                <div>
                  <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-bold">
                    Quick Commands
                  </div>
                  <div className="space-y-1">
                    {filteredActions.map((action, idx) => {
                      const Icon = action.icon;
                      const isSelected = selectedIndex === idx;

                      return (
                        <button
                          key={action.id}
                          onClick={action.action}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors text-left ${
                            isSelected
                              ? 'bg-[#18181B] text-[#A3E635] border border-[#27272A]'
                              : 'text-neutral-300 hover:bg-[#141417]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className="w-4 h-4 text-neutral-400" />
                            <span className="font-medium">{action.title}</span>
                          </div>
                          <span className="text-[10px] font-mono text-neutral-500">
                            {action.category}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Articles */}
              {filteredPosts.length > 0 && (
                <div>
                  <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-bold">
                    Articles
                  </div>
                  <div className="space-y-1">
                    {filteredPosts.map((post, pIdx) => {
                      const overallIdx = filteredActions.length + pIdx;
                      const isSelected = selectedIndex === overallIdx;

                      return (
                        <button
                          key={post.id}
                          onClick={() => {
                            onSelectPost(post);
                            onClose();
                          }}
                          onMouseEnter={() => setSelectedIndex(overallIdx)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors text-left ${
                            isSelected
                              ? 'bg-[#18181B] text-[#A3E635] border border-[#27272A]'
                              : 'text-neutral-300 hover:bg-[#141417]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate max-w-sm">
                            <FileText className="w-4 h-4 text-neutral-400 shrink-0" />
                            <span className="font-medium truncate">{post.title}</span>
                          </div>
                          <span className="text-[10px] font-mono text-neutral-400 shrink-0">
                            {post.category_name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Categories */}
              {filteredCategories.length > 0 && (
                <div>
                  <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-bold">
                    Categories
                  </div>
                  <div className="space-y-1">
                    {filteredCategories.map((cat, cIdx) => {
                      const overallIdx =
                        filteredActions.length + filteredPosts.length + cIdx;
                      const isSelected = selectedIndex === overallIdx;

                      return (
                        <button
                          key={cat.id}
                          onClick={() => {
                            onSelectTab('categories');
                            onClose();
                          }}
                          onMouseEnter={() => setSelectedIndex(overallIdx)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors text-left ${
                            isSelected
                              ? 'bg-[#18181B] text-[#A3E635] border border-[#27272A]'
                              : 'text-neutral-300 hover:bg-[#141417]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <FolderTree className="w-4 h-4 text-neutral-400" />
                            <span className="font-medium">{cat.name}</span>
                          </div>
                          <span className="text-[10px] font-mono text-neutral-400">
                            {cat.post_count} posts
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-2.5 border-t border-[#27272A] bg-[#0e0e11] flex items-center justify-between text-[11px] font-mono text-neutral-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-[#18181B] border border-[#27272A] text-neutral-300">
                ↑↓
              </kbd>{' '}
              to navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-[#18181B] border border-[#27272A] text-neutral-300">
                ↵
              </kbd>{' '}
              to select
            </span>
          </div>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-[#18181B] border border-[#27272A] text-neutral-300">
              ESC
            </kbd>{' '}
            to close
          </span>
        </div>
      </div>
    </div>
  );
};
