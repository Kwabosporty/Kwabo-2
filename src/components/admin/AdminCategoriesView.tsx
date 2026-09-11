import React, { useState } from 'react';
import {
  Tags,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  FolderOpen,
  Sparkles,
} from 'lucide-react';
import { Category } from '../../types';

interface AdminCategoriesViewProps {
  categories: Category[];
  onCreateCategory: (data: { name: string; slug: string; description: string; color: string }) => void;
  onUpdateCategory: (id: string, updates: Partial<Category>) => void;
  onDeleteCategory: (id: string) => void;
}

const COLOR_PALETTE = [
  '#A3E635', // Lime
  '#00E5FF', // Cyan
  '#EF4444', // Red
  '#FACC15', // Yellow
  '#FB923C', // Orange
  '#A855F7', // Purple
  '#10B981', // Emerald
  '#EC4899', // Pink
];

export const AdminCategoriesView: React.FC<AdminCategoriesViewProps> = ({
  categories,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
}) => {
  // Form States
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#A3E635');

  // Edit Mode state
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  // Deletion Confirmation Modal state
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [showSuccessNotice, setShowSuccessNotice] = useState<string | null>(null);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategoryId) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generated);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter a category name.');
      return;
    }

    if (editingCategoryId) {
      onUpdateCategory(editingCategoryId, {
        name: name.trim(),
        slug: slug.trim() || name.toLowerCase().replace(/\s+/g, '-'),
        description: description.trim(),
        color,
      });
      setShowSuccessNotice(`Category "${name}" updated successfully!`);
      setEditingCategoryId(null);
    } else {
      onCreateCategory({
        name: name.trim(),
        slug: slug.trim() || name.toLowerCase().replace(/\s+/g, '-'),
        description: description.trim(),
        color,
      });
      setShowSuccessNotice(`Category "${name}" created and published!`);
    }

    // Reset fields
    setName('');
    setSlug('');
    setDescription('');
    setColor('#A3E635');

    setTimeout(() => {
      setShowSuccessNotice(null);
    }, 2500);
  };

  const handleStartEdit = (cat: Category) => {
    setEditingCategoryId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description);
    setColor(cat.color || '#A3E635');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingCategoryId(null);
    setName('');
    setSlug('');
    setDescription('');
    setColor('#A3E635');
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      onDeleteCategory(categoryToDelete.id);
      setShowSuccessNotice(`Category "${categoryToDelete.name}" deleted. Posts moved to Uncategorized.`);
      setCategoryToDelete(null);
      setTimeout(() => setShowSuccessNotice(null), 2500);
    }
  };

  return (
    <div id="admin-categories-view" className="space-y-6">
      {/* Notice Banner */}
      {showSuccessNotice && (
        <div className="flex items-center gap-2 text-xs font-bold text-[#A3E635] bg-[#A3E635]/15 border border-[#A3E635]/40 p-3 rounded-xl animate-fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{showSuccessNotice}</span>
        </div>
      )}

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================= */}
        {/* LEFT SIDE: 'ADD NEW CATEGORY' FORM (lg:col-span-5) */}
        {/* ========================================================= */}
        <div className="lg:col-span-5 bg-[#1A1A1A] border border-[#2B303D] rounded-2xl p-6 shadow-xl space-y-5">
          <div className="border-b border-[#262C38] pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#A3E635] rounded-xs" />
              <h3 className="text-base font-black text-white font-sport uppercase tracking-tight">
                {editingCategoryId ? 'EDIT CATEGORY' : 'ADD NEW CATEGORY'}
              </h3>
            </div>
            {editingCategoryId && (
              <button
                onClick={handleCancelEdit}
                className="text-xs text-neutral-400 hover:text-white underline font-mono"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Field 1: Category Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider">
                Category Name
              </label>
              <input
                id="category-name-input"
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. UFC & Combat Sports, Bundesliga..."
                className="w-full bg-[#14161D] border border-[#2B3242] focus:border-[#A3E635] text-white text-sm px-3.5 py-2.5 rounded-xl outline-none font-bold transition-all placeholder:text-neutral-600 font-sport"
              />
            </div>

            {/* Field 2: Category Slug */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">
                Category Slug (URL Path)
              </label>
              <div className="flex items-center bg-[#14161D] border border-[#2B3242] rounded-xl px-3 py-2 text-xs font-mono">
                <span className="text-[#00E5FF] select-none font-bold">kwabosports.com/category/</span>
                <input
                  id="category-slug-input"
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="ufc-combat"
                  className="bg-transparent text-white outline-none flex-1 ml-1 text-xs font-mono"
                />
              </div>
            </div>

            {/* Field 3: Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider">
                Description & Scope
              </label>
              <textarea
                id="category-desc-input"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what kind of sports journalism or tournament coverage lives under this category..."
                className="w-full bg-[#14161D] border border-[#2B3242] focus:border-[#A3E635] text-white text-xs p-3 rounded-xl outline-none transition-all placeholder:text-neutral-600 resize-none leading-relaxed"
              />
            </div>

            {/* Field 4: Tag Color Palette */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">
                Brand Indicator Color
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {COLOR_PALETTE.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    style={{ backgroundColor: c }}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${
                      color === c ? 'scale-125 border-white shadow-md' : 'border-transparent opacity-80'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Action Button: Solid Lime Green [Save & Publish Category] */}
            <div className="pt-2">
              <button
                id="save-category-btn"
                type="submit"
                className="w-full bg-[#A3E635] hover:bg-[#8fd624] text-black font-black text-xs uppercase tracking-wider py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(163,230,53,0.25)] flex items-center justify-center gap-2 font-sport cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>{editingCategoryId ? 'UPDATE CATEGORY' : 'SAVE & PUBLISH CATEGORY'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* ========================================================= */}
        {/* RIGHT SIDE: EXISTING CATEGORIES DATA TABLE (lg:col-span-7) */}
        {/* ========================================================= */}
        <div className="lg:col-span-7 bg-[#1A1A1A] border border-[#2B303D] rounded-2xl overflow-hidden shadow-xl">
          <div className="p-5 border-b border-[#262C38] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#00E5FF] rounded-xs" />
              <h3 className="text-base font-black text-white font-sport uppercase tracking-tight">
                ACTIVE SUPABASE CATEGORIES ({categories.length})
              </h3>
            </div>
            <span className="text-[10px] font-mono text-neutral-500">
              table: public.categories
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-300">
              <thead className="bg-[#14161B] text-neutral-400 uppercase font-mono text-[10px] tracking-wider border-b border-[#242935]">
                <tr>
                  <th className="py-3 px-4 font-bold">Category</th>
                  <th className="py-3 px-4 font-bold">URL Slug</th>
                  <th className="py-3 px-4 font-bold text-center">Articles</th>
                  <th className="py-3 px-4 font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#242935]">
                {categories.map((cat) => {
                  const isUncategorized = cat.slug === 'uncategorized';
                  return (
                    <tr
                      key={cat.id}
                      className="hover:bg-[#1E222A] transition-colors group"
                    >
                      {/* Name + Color swatch */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                            style={{ backgroundColor: cat.color || '#A3E635' }}
                          />
                          <div>
                            <span className="font-bold text-white text-xs block group-hover:text-[#A3E635] transition-colors">
                              {cat.name}
                            </span>
                            {cat.description && (
                              <p className="text-[11px] text-neutral-400 line-clamp-1 max-w-xs">
                                {cat.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Slug */}
                      <td className="py-3 px-4 font-mono text-[11px] text-[#00E5FF]">
                        /{cat.slug}
                      </td>

                      {/* Post Count */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded font-mono text-xs font-bold bg-[#14161D] border border-neutral-700 text-white">
                          {cat.post_count}
                        </span>
                      </td>

                      {/* Actions Column */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleStartEdit(cat)}
                            title="Edit Category"
                            className="p-1.5 text-neutral-400 hover:text-[#00E5FF] hover:bg-[#00E5FF]/10 rounded-md transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {isUncategorized ? (
                            <span
                              title="Default fallback category cannot be deleted"
                              className="p-1.5 text-neutral-600 cursor-not-allowed"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </span>
                          ) : (
                            <button
                              onClick={() => setCategoryToDelete(cat)}
                              title="Delete Category"
                              className="p-1.5 text-neutral-400 hover:text-[#EF4444] hover:bg-[#EF4444]/10 rounded-md transition-colors"
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
        </div>
      </div>

      {/* MODAL: Category Delete Confirmation with Warning */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1A1E24] border border-[#EF4444]/50 max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/30 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-[#EF4444]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-black text-white font-sport uppercase">
                  Delete Category: {categoryToDelete.name}?
                </h4>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Are you sure? Posts in this category will move to <span className="text-[#A3E635] font-bold">Uncategorized</span>.
                </p>
              </div>
            </div>

            <div className="p-3 bg-[#121418] rounded-xl border border-neutral-800 text-xs text-neutral-400">
              Total Affected Posts: <span className="font-bold text-white font-mono">{categoryToDelete.post_count}</span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCategoryToDelete(null)}
                className="px-4 py-2 text-xs font-bold text-neutral-300 hover:text-white rounded-lg bg-[#252B38] hover:bg-[#2D3444] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-black text-white bg-[#EF4444] hover:bg-[#dc2626] rounded-lg transition-colors font-sport uppercase tracking-wider shadow-[0_0_12px_rgba(239,68,68,0.3)]"
              >
                Confirm & Reassign Posts
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
