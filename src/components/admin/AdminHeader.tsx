import React from 'react';
import { Search, Plus, ExternalLink, Database, Sparkles } from 'lucide-react';
import { AdminTab } from './AdminSidebar';

interface AdminHeaderProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onViewPublicSite: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  totalPosts: number;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  currentTab,
  onSelectTab,
  onViewPublicSite,
  searchQuery,
  onSearchChange,
  totalPosts,
}) => {
  const titles: Record<AdminTab, { title: string; subtitle: string }> = {
    overview: {
      title: 'DASHBOARD OVERVIEW',
      subtitle: 'Real-time telemetry, publication stats, and quick actions',
    },
    posts: {
      title: 'POSTS & EDITORIAL ARCHIVE',
      subtitle: `Manage ${totalPosts} live stories, drafts, and breaking bulletins`,
    },
    create: {
      title: 'POST CREATOR & WYSIWYG STUDIO',
      subtitle: 'Craft high-impact sports journalism with rich media formatting',
    },
    categories: {
      title: 'DYNAMIC CATEGORY MANAGER',
      subtitle: 'Create, color-tag, and structure editorial sports domains',
    },
    logs: {
      title: 'AUDIT LOGS & TELEMETRY',
      subtitle: 'Immutable record of editorial actions, logins, and view traffic',
    },
    settings: {
      title: 'SITE & CMS SETTINGS',
      subtitle: 'Configure real-time score tickers, hero pins, and publication parameters',
    },
  };

  return (
    <header
      id="admin-top-header"
      className="bg-[#121212]/95 backdrop-blur-md border-b border-[#22262F] sticky top-0 z-30 px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4 select-none"
    >
      {/* Left: Section Title & Breadcrumb */}
      <div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-4 bg-[#A3E635] rounded-xs shadow-[0_0_6px_rgba(163,230,53,0.8)]" />
          <h1 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight font-sport">
            {titles[currentTab]?.title || 'ADMIN CONSOLE'}
          </h1>
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-[#00E5FF] bg-[#00E5FF]/10 border border-[#00E5FF]/30 px-2 py-0.5 rounded ml-1">
            <Database className="w-3 h-3" />
            Supabase Schema Active
          </span>
        </div>
        <p className="text-xs text-neutral-400 font-sans mt-0.5">
          {titles[currentTab]?.subtitle}
        </p>
      </div>

      {/* Right: Search + Quick Action Buttons */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden sm:block w-48 lg:w-64">
          <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search posts, tags..."
            className="w-full bg-[#1A1D24] border border-[#2B3242] focus:border-[#A3E635] text-xs text-white rounded-lg pl-8 pr-3 py-1.5 outline-none placeholder-neutral-500 transition-all font-sans"
          />
        </div>

        {/* Quick Action 1: Add New Category */}
        <button
          id="quick-add-category-btn"
          onClick={() => onSelectTab('categories')}
          className="bg-[#1A1D24] hover:bg-[#232833] border border-[#2E3545] hover:border-[#00E5FF] text-neutral-200 hover:text-[#00E5FF] text-xs font-bold px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap font-sport uppercase tracking-wider"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Add Category</span>
        </button>

        {/* Quick Action 2: Create New Article */}
        <button
          id="quick-create-article-btn"
          onClick={() => onSelectTab('create')}
          className="bg-[#A3E635] hover:bg-[#8fd624] text-black text-xs font-black px-4 py-2 rounded-lg transition-all shadow-[0_0_12px_rgba(163,230,53,0.25)] flex items-center gap-1.5 whitespace-nowrap font-sport uppercase tracking-wider cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>+ Create New Article</span>
        </button>

        {/* Live Site Preview link */}
        <button
          onClick={onViewPublicSite}
          title="Open Public Sports Portal"
          className="border border-[#323947] hover:border-white text-neutral-300 hover:text-white p-2 rounded-lg text-xs transition-colors hidden xl:flex items-center gap-1.5"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="text-[11px] font-medium">View Live Site</span>
        </button>
      </div>
    </header>
  );
};
