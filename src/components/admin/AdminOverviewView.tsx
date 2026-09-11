import React, { useState } from 'react';
import {
  FileText,
  Clock,
  Tags,
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  Eye,
  ArrowUpRight,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { AdminPost, AdminDashboardStats, Category, AdminAuditLog } from '../../types';
import { AdminTab } from './AdminSidebar';

interface AdminOverviewViewProps {
  stats: AdminDashboardStats;
  posts: AdminPost[];
  categories: Category[];
  logs: AdminAuditLog[];
  onSelectTab: (tab: AdminTab) => void;
  onEditPost: (post: AdminPost) => void;
  onDeletePost: (postId: string) => void;
  onViewPost: (post: AdminPost) => void;
}

export const AdminOverviewView: React.FC<AdminOverviewViewProps> = ({
  stats,
  posts,
  categories,
  logs,
  onSelectTab,
  onEditPost,
  onDeletePost,
  onViewPost,
}) => {
  const [postToDelete, setPostToDelete] = useState<AdminPost | null>(null);

  // Take the 5 most recent posts
  const recentPosts = posts.slice(0, 6);

  const handleDeleteConfirm = () => {
    if (postToDelete) {
      onDeletePost(postToDelete.id);
      setPostToDelete(null);
    }
  };

  return (
    <div id="admin-overview-view" className="space-y-6">
      {/* 1. QUICK ACTION BANNER (TOP ACTION BAR) */}
      <div className="bg-gradient-to-r from-[#171A21] via-[#1A1E26] to-[#14171D] border border-[#272E3D] rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#A3E635] bg-[#A3E635]/10 px-2 py-0.5 rounded border border-[#A3E635]/30">
              Editorial HQ
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              Live broadcast & publishing operations
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight font-sport">
            KwaboSports Control Desk
          </h2>
          <p className="text-xs text-neutral-400 max-w-xl leading-relaxed">
            Publish breaking transfer dispatches, tactical game reviews, and update active sports domains connected with the Supabase schema.
          </p>
        </div>

        {/* Quick Action Bar High-Visibility Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            id="overview-add-category-btn"
            onClick={() => onSelectTab('categories')}
            className="bg-[#1A1E26] hover:bg-[#232936] text-[#00E5FF] border border-[#00E5FF]/40 hover:border-[#00E5FF] font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 font-sport shadow-[0_0_12px_rgba(0,229,255,0.15)]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Add New Category</span>
          </button>

          <button
            id="overview-create-article-btn"
            onClick={() => onSelectTab('create')}
            className="bg-[#A3E635] hover:bg-[#8fd624] text-black font-black text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all shadow-[0_0_20px_rgba(163,230,53,0.3)] flex items-center gap-2 font-sport cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Create New Article</span>
          </button>
        </div>
      </div>

      {/* 2. METRIC SUMMARY CARDS (TOP ROW - 4 CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Posts Published */}
        <div
          id="stat-card-posts"
          className="bg-[#1A1A1A] border border-[#2B303D] hover:border-[#A3E635]/50 transition-all rounded-xl p-5 relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">
              Total Published
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#A3E635]/15 border border-[#A3E635]/30 flex items-center justify-center text-[#A3E635]">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-sport">
              {stats.total_posts}
            </span>
            <span className="text-[11px] font-mono text-[#A3E635]">
              +3 this week
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">
            Articles synced with Supabase <code className="text-neutral-300">posts</code>
          </p>
          <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-[#A3E635]/5 rounded-full blur-xl group-hover:bg-[#A3E635]/10 transition-all" />
        </div>

        {/* Card 2: Drafts Pending (Yellow Accent Indicator) */}
        <div
          id="stat-card-drafts"
          className="bg-[#1A1A1A] border border-[#2B303D] hover:border-[#FACC15]/60 transition-all rounded-xl p-5 relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">
              Drafts Pending
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#FACC15]/15 border border-[#FACC15]/30 flex items-center justify-center text-[#FACC15]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#FACC15] font-sport">
              {stats.drafts_pending}
            </span>
            <span className="text-[11px] font-mono text-[#FACC15] bg-[#FACC15]/10 px-1.5 py-0.5 rounded">
              Needs Review
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">
            Awaiting editorial approval & publishing
          </p>
          <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-[#FACC15]/5 rounded-full blur-xl group-hover:bg-[#FACC15]/10 transition-all" />
        </div>

        {/* Card 3: Total Categories Active (Cyan Accent Indicator) */}
        <div
          id="stat-card-categories"
          className="bg-[#1A1A1A] border border-[#2B303D] hover:border-[#00E5FF]/60 transition-all rounded-xl p-5 relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">
              Active Categories
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#00E5FF]/15 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF]">
              <Tags className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-sport">
              {stats.active_categories}
            </span>
            <span className="text-[11px] font-mono text-[#00E5FF]">
              6 active tags
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">
            Dynamic domains mapped in Supabase
          </p>
          <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-[#00E5FF]/5 rounded-full blur-xl group-hover:bg-[#00E5FF]/10 transition-all" />
        </div>

        {/* Card 4: Total Blog Views (Lime green sparkline graph icon) */}
        <div
          id="stat-card-views"
          className="bg-[#1A1A1A] border border-[#2B303D] hover:border-[#A3E635]/60 transition-all rounded-xl p-5 relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">
              Total Blog Views
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#A3E635]/15 border border-[#A3E635]/30 flex items-center justify-center text-[#A3E635] shadow-[0_0_8px_rgba(163,230,53,0.3)]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-sport">
              {stats.total_views.toLocaleString()}
            </span>
            <span className="text-[11px] font-mono text-[#A3E635] flex items-center gap-0.5">
              <span>+{stats.today_views}</span>
              <span className="text-[9px]">today</span>
            </span>
          </div>
          {/* Sparkline simulation */}
          <div className="mt-2 flex items-end gap-1 h-3">
            {[40, 65, 55, 80, 70, 95, 85, 100].map((val, i) => (
              <div
                key={i}
                style={{ height: `${val}%` }}
                className="flex-1 bg-[#A3E635] rounded-xs opacity-75 group-hover:opacity-100 transition-opacity"
              />
            ))}
          </div>
          <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-[#A3E635]/5 rounded-full blur-xl group-hover:bg-[#A3E635]/10 transition-all" />
        </div>
      </div>

      {/* 3. RECENT POSTS TABLE (MIDDLE SECTION) */}
      <div className="bg-[#1A1A1A] border border-[#2B303D] rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-[#2B303D] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#A3E635] rounded-xs" />
              <h3 className="text-base font-black text-white uppercase tracking-tight font-sport">
                RECENT EDITORIAL POSTS
              </h3>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Live records from Supabase table: <code className="text-neutral-300">public.posts</code>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectTab('posts')}
              className="text-xs font-bold text-[#A3E635] hover:text-[#8fd624] px-3 py-1.5 rounded-lg bg-[#A3E635]/10 border border-[#A3E635]/30 transition-colors flex items-center gap-1 uppercase tracking-wider font-sport"
            >
              <span>View All ({posts.length})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-[#14161B] text-neutral-400 uppercase font-mono text-[10px] tracking-wider border-b border-[#242935]">
              <tr>
                <th className="py-3.5 px-4 font-bold">Featured Image</th>
                <th className="py-3.5 px-4 font-bold">Article Title</th>
                <th className="py-3.5 px-4 font-bold">Category</th>
                <th className="py-3.5 px-4 font-bold">Author</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold text-right">Views</th>
                <th className="py-3.5 px-4 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#242935]">
              {recentPosts.map((post) => {
                const isPublished = post.status === 'published';
                return (
                  <tr
                    key={post.id}
                    className="hover:bg-[#1E222A] transition-colors group"
                  >
                    {/* Featured Image Thumbnail */}
                    <td className="py-3 px-4 w-20">
                      <div className="w-16 h-11 rounded-lg overflow-hidden bg-[#242935] relative shrink-0 border border-neutral-700">
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        {post.is_featured && (
                          <div className="absolute top-0.5 right-0.5 bg-[#A3E635] text-black font-black text-[7px] px-1 rounded font-sport">
                            HERO
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Title */}
                    <td className="py-3 px-4 font-bold text-white max-w-xs">
                      <div className="line-clamp-2 leading-snug group-hover:text-[#A3E635] transition-colors">
                        {post.title}
                      </div>
                      <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                        /{post.slug}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md font-mono"
                        style={{
                          backgroundColor: `${post.category_color}20`,
                          color: post.category_color,
                          border: `1px solid ${post.category_color}40`,
                        }}
                      >
                        {post.category_name}
                      </span>
                    </td>

                    {/* Author */}
                    <td className="py-3 px-4 whitespace-nowrap text-neutral-300">
                      <div className="flex items-center gap-1.5">
                        <img
                          src={post.author_avatar}
                          alt={post.author_name}
                          referrerPolicy="no-referrer"
                          className="w-5 h-5 rounded-full object-cover border border-neutral-700"
                        />
                        <span className="font-medium text-white">{post.author_name}</span>
                      </div>
                    </td>

                    {/* Status (Pill Tag) */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {isPublished ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#A3E635]/15 text-[#A3E635] border border-[#A3E635]/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#A3E635] animate-pulse" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FACC15]/15 text-[#FACC15] border border-[#FACC15]/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FACC15]" />
                          Draft
                        </span>
                      )}
                    </td>

                    {/* Views */}
                    <td className="py-3 px-4 text-right font-mono font-bold text-white whitespace-nowrap">
                      {post.views.toLocaleString()}
                    </td>

                    {/* Actions (Edit / Delete buttons) */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onViewPost(post)}
                          title="Preview article"
                          className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-md transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onEditPost(post)}
                          title="Edit in WYSIWYG studio"
                          className="p-1.5 text-neutral-400 hover:text-[#00E5FF] hover:bg-[#00E5FF]/10 rounded-md transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setPostToDelete(post)}
                          title="Delete article"
                          className="p-1.5 text-neutral-400 hover:text-[#EF4444] hover:bg-[#EF4444]/10 rounded-md transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. LOWER ROW: QUICK AUDIT TRAIL & SYSTEM STATUS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity / Audit Trail Mini */}
        <div className="lg:col-span-2 bg-[#1A1A1A] border border-[#2B303D] rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#262C38] pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#00E5FF]" />
              <h3 className="text-sm font-bold text-white uppercase font-sport tracking-wider">
                Recent Audit Trail (Supabase `admin_audit_logs`)
              </h3>
            </div>
            <button
              onClick={() => onSelectTab('logs')}
              className="text-xs text-[#00E5FF] hover:underline font-mono"
            >
              Full Log ({logs.length})
            </button>
          </div>

          <div className="space-y-2.5">
            {logs.slice(0, 4).map((log) => (
              <div
                key={log.id}
                className="flex items-start justify-between gap-3 p-2.5 rounded-lg bg-[#14161C] border border-[#222834] text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#A3E635] text-[10px]">
                      {log.action}
                    </span>
                    <span className="text-white font-medium">{log.target_title}</span>
                  </div>
                  <p className="text-neutral-400 text-[11px]">{log.details}</p>
                </div>
                <div className="text-[10px] font-mono text-neutral-500 shrink-0 text-right">
                  {new Date(log.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Category Summary Card */}
        <div className="bg-[#1A1A1A] border border-[#2B303D] rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#262C38] pb-3">
            <div className="flex items-center gap-2">
              <Tags className="w-4 h-4 text-[#A3E635]" />
              <h3 className="text-sm font-bold text-white uppercase font-sport tracking-wider">
                Top Categories
              </h3>
            </div>
            <button
              onClick={() => onSelectTab('categories')}
              className="text-xs text-[#A3E635] hover:underline font-mono"
            >
              Manage
            </button>
          </div>

          <div className="space-y-2">
            {categories.slice(0, 5).map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between p-2 rounded-lg bg-[#14161C] border border-[#222834]"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-xs font-bold text-white">{cat.name}</span>
                </div>
                <span className="text-xs font-mono text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded">
                  {cat.post_count} articles
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {postToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1A1E24] border border-[#EF4444]/40 max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-[#EF4444]">
              <div className="w-10 h-10 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/30 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-[#EF4444]" />
              </div>
              <div>
                <h4 className="text-base font-black text-white font-sport uppercase">
                  Delete Article?
                </h4>
                <p className="text-xs text-neutral-400">
                  This will remove the post from Supabase and the live homepage.
                </p>
              </div>
            </div>

            <div className="p-3 bg-[#121418] rounded-xl border border-neutral-800 text-xs text-neutral-300 font-medium">
              &quot;{postToDelete.title}&quot;
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setPostToDelete(null)}
                className="px-4 py-2 text-xs font-bold text-neutral-300 hover:text-white rounded-lg bg-[#252B38] hover:bg-[#2D3444] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-xs font-black text-white bg-[#EF4444] hover:bg-[#dc2626] rounded-lg transition-colors font-sport uppercase tracking-wider"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
