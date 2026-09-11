import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Clock,
  ArrowUpDown,
} from 'lucide-react';
import { AdminPost, Category, PostStatus } from '../../types';

interface AdminPostsListViewProps {
  posts: AdminPost[];
  categories: Category[];
  onCreateNew: () => void;
  onEditPost: (post: AdminPost) => void;
  onDeletePost: (postId: string) => void;
  onViewPost: (post: AdminPost) => void;
}

export const AdminPostsListView: React.FC<AdminPostsListViewProps> = ({
  posts,
  categories,
  onCreateNew,
  onEditPost,
  onDeletePost,
  onViewPost,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [postToDelete, setPostToDelete] = useState<AdminPost | null>(null);

  // Filter posts
  const filteredPosts = posts.filter((p) => {
    if (selectedStatus !== 'all' && p.status !== selectedStatus) return false;
    if (selectedCategory !== 'all' && p.category_id !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchAuthor = p.author_name.toLowerCase().includes(q);
      const matchCat = p.category_name.toLowerCase().includes(q);
      if (!matchTitle && !matchAuthor && !matchCat) return false;
    }
    return true;
  });

  const publishedCount = posts.filter((p) => p.status === 'published').length;
  const draftCount = posts.filter((p) => p.status === 'draft').length;

  return (
    <div id="admin-posts-list-view" className="space-y-5">
      {/* Top Header & Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white uppercase font-sport tracking-tight">
            POSTS & EDITORIAL ARCHIVE
          </h2>
          <p className="text-xs text-neutral-400 font-mono">
            {posts.length} Total Articles ({publishedCount} Published, {draftCount} Drafts)
          </p>
        </div>

        <button
          id="create-article-button-header"
          onClick={onCreateNew}
          className="bg-[#A3E635] hover:bg-[#8fd624] text-black text-xs font-black uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(163,230,53,0.25)] flex items-center gap-2 font-sport cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Create New Article</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#1A1A1A] border border-[#2B303D] rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Articles', count: posts.length },
            { id: 'published', label: 'Published', count: publishedCount },
            { id: 'draft', label: 'Drafts', count: draftCount },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap uppercase font-sport tracking-wider transition-all ${
                selectedStatus === tab.id
                  ? 'bg-[#A3E635] text-black shadow-xs'
                  : 'bg-[#14161D] text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Category Filter & Search Input */}
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#14161D] border border-[#2B3242] text-xs text-white rounded-lg px-2.5 py-1.5 outline-none focus:border-[#A3E635]"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search headline..."
              className="w-full bg-[#14161D] border border-[#2B3242] focus:border-[#A3E635] text-xs text-white rounded-lg pl-8 pr-2.5 py-1.5 outline-none font-sans"
            />
          </div>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-[#1A1A1A] border border-[#2B303D] rounded-2xl overflow-hidden shadow-xl">
        {filteredPosts.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 space-y-3">
            <p className="text-sm font-bold text-white">No articles matched your filter criteria.</p>
            <button
              onClick={() => {
                setSelectedStatus('all');
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="text-xs text-[#A3E635] underline"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-300">
              <thead className="bg-[#14161B] text-neutral-400 uppercase font-mono text-[10px] tracking-wider border-b border-[#242935]">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Thumbnail</th>
                  <th className="py-3.5 px-4 font-bold">Headline & Permalink</th>
                  <th className="py-3.5 px-4 font-bold">Category</th>
                  <th className="py-3.5 px-4 font-bold">Author</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-4 font-bold text-right">Views</th>
                  <th className="py-3.5 px-4 font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#242935]">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-[#1E222A] transition-colors group">
                    {/* Thumbnail */}
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

                    {/* Headline */}
                    <td className="py-3 px-4 max-w-sm">
                      <div className="font-bold text-white line-clamp-2 leading-snug group-hover:text-[#A3E635] transition-colors">
                        {post.title}
                      </div>
                      <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                        /{post.slug} • <span className="text-neutral-400">{post.read_time}</span>
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

                    {/* Status */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {post.status === 'published' ? (
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

                    {/* Actions */}
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {postToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1A1E24] border border-[#EF4444]/40 max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4">
            <h4 className="text-base font-black text-white font-sport uppercase text-[#EF4444]">
              Delete Article?
            </h4>
            <p className="text-xs text-neutral-300">
              Are you sure you want to delete &quot;{postToDelete.title}&quot;? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setPostToDelete(null)}
                className="px-4 py-2 text-xs font-bold text-neutral-300 hover:text-white rounded-lg bg-[#252B38]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeletePost(postToDelete.id);
                  setPostToDelete(null);
                }}
                className="px-4 py-2 text-xs font-black text-white bg-[#EF4444] hover:bg-[#dc2626] rounded-lg uppercase tracking-wider font-sport"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
