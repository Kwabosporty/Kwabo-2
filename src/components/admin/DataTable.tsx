import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { AdminPost, Category } from '../../types';

interface DataTableProps {
  posts: AdminPost[];
  categories: Category[];
  onEditPost: (post: AdminPost) => void;
  onToggleStatus: (postId: string) => void;
  onDeletePost: (postId: string) => void;
  onPreviewPost?: (post: AdminPost) => void;
  loading?: boolean;
}

export const DataTable: React.FC<DataTableProps> = ({
  posts,
  categories,
  onEditPost,
  onToggleStatus,
  onDeletePost,
  onPreviewPost,
  loading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const ITEMS_PER_PAGE = 7;

  // Filtered dataset
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Status filter
      if (statusFilter !== 'all') {
        const pStatus = post.status.toLowerCase();
        if (pStatus !== statusFilter) return false;
      }

      // Category filter
      if (categoryFilter !== 'all' && post.category_id !== categoryFilter) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = post.title.toLowerCase().includes(q);
        const matchesAuthor = post.author_name.toLowerCase().includes(q);
        const matchesCategory = post.category_name.toLowerCase().includes(q);
        if (!matchesTitle && !matchesAuthor && !matchesCategory) return false;
      }

      return true;
    });
  }, [posts, statusFilter, categoryFilter, searchQuery]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / ITEMS_PER_PAGE));
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="rounded-xl bg-[#121215] border border-[#27272A] overflow-hidden shadow-sm flex flex-col">
      {/* Table Filter & Search Header */}
      <div className="p-4 border-b border-[#27272A] flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-[#0e0e11]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#A3E635]" />
          <h3 className="text-sm font-bold text-white tracking-wider uppercase font-sport">
            Recent Articles Database
          </h3>
          <span className="text-xs font-mono text-neutral-400 bg-[#18181B] px-2 py-0.5 rounded border border-[#27272A]">
            {filteredPosts.length} Records
          </span>
        </div>

        {/* Search and Filters Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Search */}
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Filter titles..."
              className="w-full bg-[#18181B] border border-[#27272A] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#A3E635] transition-all"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-[#18181B] border border-[#27272A] rounded-lg px-2.5 py-1.5 text-xs text-neutral-300 focus:outline-none focus:border-[#A3E635]"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Status Tabs */}
          <div className="flex items-center rounded-lg bg-[#18181B] p-0.5 border border-[#27272A]">
            {(['all', 'published', 'draft'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setStatusFilter(tab);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 text-[11px] font-mono uppercase font-bold rounded-md transition-all ${
                  statusFilter === tab
                    ? 'bg-[#27272A] text-white shadow-xs'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="p-6 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-12 bg-[#18181B] rounded-lg animate-pulse border border-[#27272A]/50"
            />
          ))}
        </div>
      ) : filteredPosts.length === 0 ? (
        /* Empty State */
        <div className="py-16 text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-[#18181B] border border-[#27272A] flex items-center justify-center mx-auto text-neutral-500">
            <FileText className="w-6 h-6" />
          </div>
          <div className="text-sm font-semibold text-white">No articles found</div>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            Try adjusting your search query, status filters, or publish a new article from the editor.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setCategoryFilter('all');
            }}
            className="text-xs font-mono text-[#A3E635] hover:underline pt-1"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        /* Interactive Table */
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#27272A] bg-[#141417] text-[11px] font-semibold font-mono uppercase text-neutral-400">
                <th className="py-3 px-4">Article</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Author</th>
                <th className="py-3 px-3 text-right">Views</th>
                <th className="py-3 px-4 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272A]/60 text-xs">
              {paginatedPosts.map((post) => {
                const isPublished = post.status.toLowerCase() === 'published';
                const viewCount = post.view_count ?? post.views ?? 0;

                return (
                  <tr
                    key={post.id}
                    className="hover:bg-[#18181B]/50 transition-colors group"
                  >
                    {/* Title & Thumbnail */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          className="w-10 h-10 rounded-md object-cover border border-[#27272A] shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0 max-w-xs sm:max-w-sm md:max-w-md">
                          <div
                            onClick={() => onPreviewPost && onPreviewPost(post)}
                            className="font-medium text-white truncate hover:text-[#A3E635] cursor-pointer transition-colors"
                            title={post.title}
                          >
                            {post.title}
                          </div>
                          <div className="text-[11px] font-mono text-neutral-400 truncate flex items-center gap-1.5">
                            <span>/{post.slug}</span>
                            {post.is_featured && (
                              <span className="text-[9px] px-1 py-0.2 rounded bg-[#A3E635]/15 text-[#A3E635] font-bold">
                                PINNED HERO
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-3">
                      <span
                        className="inline-flex items-center gap-1.5 text-[11px] font-medium font-mono px-2 py-0.5 rounded-full border"
                        style={{
                          backgroundColor: `${post.category_color}15`,
                          borderColor: `${post.category_color}40`,
                          color: post.category_color,
                        }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: post.category_color }}
                        />
                        {post.category_name}
                      </span>
                    </td>

                    {/* Status Pill Badge */}
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                          isPublished
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isPublished ? 'bg-emerald-400' : 'bg-amber-400'
                          }`}
                        />
                        {isPublished ? 'PUBLISHED' : 'DRAFT'}
                      </span>
                    </td>

                    {/* Author */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={post.author_avatar}
                          alt={post.author_name}
                          className="w-5 h-5 rounded-full object-cover border border-[#27272A]"
                          referrerPolicy="no-referrer"
                        />
                        <span className="text-neutral-300 font-medium truncate max-w-[100px]">
                          {post.author_name}
                        </span>
                      </div>
                    </td>

                    {/* Views Count */}
                    <td className="py-3 px-3 text-right">
                      <div className="inline-flex items-center gap-1 font-mono text-neutral-300">
                        <Eye className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{viewCount.toLocaleString()}</span>
                      </div>
                    </td>

                    {/* Quick Action Buttons */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Toggle Draft/Published */}
                        <button
                          onClick={() => onToggleStatus(post.id)}
                          title={
                            isPublished
                              ? 'Unpublish article (switch to Draft)'
                              : 'Publish article live'
                          }
                          className={`p-1.5 rounded-md border transition-all ${
                            isPublished
                              ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20'
                              : 'text-neutral-400 bg-[#18181B] border-[#27272A] hover:text-white'
                          }`}
                        >
                          {isPublished ? (
                            <ToggleRight className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <ToggleLeft className="w-4 h-4 text-neutral-400" />
                          )}
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => onEditPost(post)}
                          title="Open in WYSIWYG Editor"
                          className="p-1.5 rounded-md text-neutral-400 hover:text-white bg-[#18181B] border border-[#27272A] hover:border-[#A3E635] transition-all"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button / Confirmation */}
                        {deleteConfirmId === post.id ? (
                          <div className="flex items-center gap-1 bg-red-500/10 border border-red-500/30 rounded-md p-0.5 animate-in fade-in duration-150">
                            <button
                              onClick={() => {
                                onDeletePost(post.id);
                                setDeleteConfirmId(null);
                              }}
                              className="px-1.5 py-0.5 text-[10px] font-mono font-bold text-white bg-red-500 rounded hover:bg-red-600 transition-colors"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-1 py-0.5 text-[10px] text-neutral-400 hover:text-white"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(post.id)}
                            title="Delete article"
                            className="p-1.5 rounded-md text-neutral-400 hover:text-red-400 bg-[#18181B] border border-[#27272A] hover:border-red-500/40 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Footer */}
      {filteredPosts.length > ITEMS_PER_PAGE && (
        <div className="p-3 border-t border-[#27272A] bg-[#0e0e11] flex items-center justify-between text-xs text-neutral-400">
          <span className="font-mono">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{' '}
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredPosts.length)} of{' '}
            {filteredPosts.length}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md bg-[#18181B] border border-[#27272A] text-neutral-300 disabled:opacity-40 disabled:cursor-not-allowed hover:text-white"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono px-2 text-white">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-md bg-[#18181B] border border-[#27272A] text-neutral-300 disabled:opacity-40 disabled:cursor-not-allowed hover:text-white"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
