import React, { useState, useEffect } from 'react';
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  Code,
  Link,
  Image as ImageIcon,
  Eye,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  Layers,
  Upload,
} from 'lucide-react';
import { AdminPost, Category, PostType, PostStatus } from '../../types';

interface AdminPostEditorViewProps {
  postToEdit?: AdminPost | null;
  categories: Category[];
  onSavePost: (postData: Omit<AdminPost, 'id' | 'created_at' | 'updated_at' | 'views'>, existingId?: string) => void;
  onCancel: () => void;
}

const PRESET_IMAGES = [
  {
    label: 'Champions League',
    url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1000&auto=format&fit=crop&q=80',
  },
  {
    label: 'Transfer Window',
    url: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'NBA Arena',
    url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'F1 Cockpit',
    url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=80',
  },
];

export const AdminPostEditorView: React.FC<AdminPostEditorViewProps> = ({
  postToEdit,
  categories,
  onSavePost,
  onCancel,
}) => {
  // Form States
  const [title, setTitle] = useState(postToEdit?.title || '');
  const [slug, setSlug] = useState(postToEdit?.slug || '');
  const [excerpt, setExcerpt] = useState(postToEdit?.excerpt || '');
  const [content, setContent] = useState(
    postToEdit?.content ||
      `<h2>Match Overview & Tactical Analysis</h2><p>In an explosive start to the fixture, high pressing in the attacking third exposed positional imbalances...</p><blockquote>"We executed the tactical transition precisely as prepared." — Head Coach</blockquote><p>Key telemetry and physical metrics reveal an astounding work rate in the center of the pitch.</p>`
  );
  const [featuredImage, setFeaturedImage] = useState(
    postToEdit?.featured_image || PRESET_IMAGES[0].url
  );
  const [categoryId, setCategoryId] = useState(
    postToEdit?.category_id || (categories[0]?.id || 'cat-tactics')
  );
  const [postType, setPostType] = useState<PostType>(postToEdit?.post_type || 'news');
  const [status, setStatus] = useState<PostStatus>(postToEdit?.status || 'published');
  const [isFeatured, setIsFeatured] = useState<boolean>(postToEdit?.is_featured || false);
  const [readTime, setReadTime] = useState(postToEdit?.read_time || '4 min read');

  // WYSIWYG Editor Mode (Visual vs Raw HTML)
  const [isRawHtml, setIsRawHtml] = useState(false);
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);

  // Auto slug generation from title if not manually edited
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!postToEdit) {
      const generated = newTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generated);
    }
  };

  // Quick formatting buttons for WYSIWYG textarea
  const applyFormat = (tagStart: string, tagEnd: string = '') => {
    const textarea = document.getElementById('wysiwyg-content-area') as HTMLTextAreaElement | null;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end) || 'text';
    const replacement = `${tagStart}${selected}${tagEnd}`;
    const updated = content.substring(0, start) + replacement + content.substring(end);
    setContent(updated);
  };

  const handlePublishSubmit = (targetStatus: PostStatus = status) => {
    if (!title.trim()) {
      alert('Please enter a headline for the article.');
      return;
    }

    const selectedCategory = categories.find((c) => c.id === categoryId) || categories[0];

    const postPayload: Omit<AdminPost, 'id' | 'created_at' | 'updated_at' | 'views'> = {
      title: title.trim(),
      slug: slug.trim() || 'sports-headline',
      excerpt: excerpt.trim() || title.trim(),
      content: content.trim(),
      featured_image: featuredImage.trim(),
      category_id: selectedCategory?.id || 'cat-uncategorized',
      category_name: selectedCategory?.name || 'Sports News',
      category_slug: selectedCategory?.slug || 'sports-news',
      category_color: selectedCategory?.color || '#A3E635',
      post_type: postType,
      status: targetStatus,
      is_featured: isFeatured,
      author_id: postToEdit?.author_id || 'admin-1',
      author_name: postToEdit?.author_name || 'Elena Rostova',
      author_role: postToEdit?.author_role || 'Chief Football Tactician',
      author_avatar:
        postToEdit?.author_avatar ||
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
      read_time: readTime,
      published_at: targetStatus === 'published' ? new Date().toISOString() : null,
    };

    onSavePost(postPayload, postToEdit?.id);
    setIsSavedSuccess(true);
    setTimeout(() => {
      setIsSavedSuccess(false);
    }, 2500);
  };

  return (
    <div id="admin-post-editor" className="space-y-6">
      {/* Top Banner Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#252B38] pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-2 rounded-lg bg-[#1A1D24] hover:bg-[#252B38] text-neutral-400 hover:text-white transition-colors"
            title="Back to posts"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-xl font-black text-white font-sport uppercase tracking-tight">
              {postToEdit ? 'EDIT ARTICLE' : 'CREATE NEW ARTICLE'}
            </h2>
            <p className="text-xs text-neutral-400 font-mono">
              Writing studio with live slug routing & Supabase database sync
            </p>
          </div>
        </div>

        {/* Status Confirmation Banner */}
        {isSavedSuccess && (
          <div className="flex items-center gap-2 text-xs font-bold text-[#A3E635] bg-[#A3E635]/15 border border-[#A3E635]/40 px-3 py-1.5 rounded-lg animate-pulse">
            <CheckCircle2 className="w-4 h-4" />
            <span>Article successfully saved to Supabase!</span>
          </div>
        )}
      </div>

      {/* 2-COLUMN LAYOUT: 70% Left Editorial Area + 30% Right Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================= */}
        {/* LEFT AREA: 70% WIDTH (lg:col-span-8 or 8.5) */}
        {/* ========================================================= */}
        <div className="lg:col-span-8 space-y-5">
          {/* A. Title Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider flex items-center justify-between">
              <span>Article Headline</span>
              <span className="text-neutral-500 font-normal">{title.length}/120 chars</span>
            </label>
            <input
              id="post-title-input"
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter catchy sports headline (e.g. Inside City's Inverted Wing-Back Revolution)..."
              className="w-full bg-[#181B22] border-2 border-[#2C3342] focus:border-[#A3E635] text-white text-lg sm:text-xl font-black font-sport p-3.5 rounded-xl outline-none transition-all placeholder:text-neutral-600 shadow-inner"
            />
          </div>

          {/* B. Slug Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">
              Permalink / URL Slug
            </label>
            <div className="flex items-center bg-[#15171D] border border-[#262C38] rounded-xl px-3 py-2 text-xs font-mono">
              <span className="text-[#00E5FF] select-none font-bold">kwabosports.com/news/</span>
              <input
                id="post-slug-input"
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="your-custom-slug"
                className="bg-transparent text-white outline-none flex-1 ml-1 text-xs font-mono"
              />
            </div>
          </div>

          {/* C. Excerpt Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider flex items-center justify-between">
              <span>Front-Page Excerpt (2-Line Card Preview)</span>
              <span className="text-neutral-500 font-normal">{excerpt.length}/220 chars</span>
            </label>
            <textarea
              id="post-excerpt-input"
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A concise 2-sentence summary that appears on the homepage Bento cards and feeds..."
              className="w-full bg-[#181B22] border border-[#2C3342] focus:border-[#A3E635] text-white text-xs sm:text-sm p-3 rounded-xl outline-none transition-all placeholder:text-neutral-600 leading-relaxed resize-none"
            />
          </div>

          {/* D. Classic WYSIWYG Editor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider">
                Article Body & Content Studio
              </label>

              {/* Raw HTML vs Visual View Toggle */}
              <button
                type="button"
                onClick={() => setIsRawHtml(!isRawHtml)}
                className={`text-[11px] font-mono px-2.5 py-1 rounded-md border flex items-center gap-1.5 transition-all select-none ${
                  isRawHtml
                    ? 'bg-[#00E5FF]/15 text-[#00E5FF] border-[#00E5FF]/40'
                    : 'bg-[#1E222A] text-neutral-400 border-neutral-700 hover:text-white'
                }`}
              >
                <Code className="w-3 h-3" />
                <span>{isRawHtml ? 'Visual Editor Mode' : 'Raw HTML View'}</span>
              </button>
            </div>

            {/* WYSIWYG Toolbar */}
            <div className="bg-[#1C2028] border border-[#2D3545] rounded-t-xl p-2 flex flex-wrap items-center gap-1">
              <button
                type="button"
                onClick={() => applyFormat('<b>', '</b>')}
                title="Bold"
                className="p-1.5 rounded hover:bg-[#2A3140] text-neutral-300 hover:text-[#A3E635] transition-colors"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => applyFormat('<i>', '</i>')}
                title="Italic"
                className="p-1.5 rounded hover:bg-[#2A3140] text-neutral-300 hover:text-[#A3E635] transition-colors"
              >
                <Italic className="w-4 h-4" />
              </button>

              <div className="w-px h-5 bg-[#2E3647] mx-1" />

              <button
                type="button"
                onClick={() => applyFormat('<h1>', '</h1>')}
                title="Heading 1"
                className="p-1.5 rounded hover:bg-[#2A3140] text-neutral-300 hover:text-[#00E5FF] transition-colors"
              >
                <Heading1 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => applyFormat('<h2>', '</h2>')}
                title="Heading 2"
                className="p-1.5 rounded hover:bg-[#2A3140] text-neutral-300 hover:text-[#00E5FF] transition-colors"
              >
                <Heading2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => applyFormat('<h3>', '</h3>')}
                title="Heading 3"
                className="p-1.5 rounded hover:bg-[#2A3140] text-neutral-300 hover:text-[#00E5FF] transition-colors"
              >
                <Heading3 className="w-4 h-4" />
              </button>

              <div className="w-px h-5 bg-[#2E3647] mx-1" />

              <button
                type="button"
                onClick={() => applyFormat('<blockquote>', '</blockquote>')}
                title="Quote"
                className="p-1.5 rounded hover:bg-[#2A3140] text-neutral-300 hover:text-[#FACC15] transition-colors"
              >
                <Quote className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => applyFormat('<ul>\n  <li>', '</li>\n</ul>')}
                title="Bullet list"
                className="p-1.5 rounded hover:bg-[#2A3140] text-neutral-300 hover:text-white transition-colors"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => applyFormat('<ol>\n  <li>', '</li>\n</ol>')}
                title="Numbered list"
                className="p-1.5 rounded hover:bg-[#2A3140] text-neutral-300 hover:text-white transition-colors"
              >
                <ListOrdered className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => applyFormat('<a href="https://" target="_blank">', '</a>')}
                title="Insert Link"
                className="p-1.5 rounded hover:bg-[#2A3140] text-neutral-300 hover:text-[#00E5FF] transition-colors"
              >
                <Link className="w-4 h-4" />
              </button>

              <div className="ml-auto text-[10px] font-mono text-neutral-500 pr-2">
                Formatting: HTML / Markdown supported
              </div>
            </div>

            {/* Editor Body */}
            {isRawHtml ? (
              <textarea
                id="wysiwyg-content-area"
                rows={14}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="<p>Write your article content with raw HTML...</p>"
                className="w-full bg-[#14161C] border-x border-b border-[#2D3545] rounded-b-xl p-4 font-mono text-xs text-neutral-200 focus:outline-none focus:border-[#00E5FF] transition-all leading-relaxed"
              />
            ) : (
              <div className="relative">
                <textarea
                  id="wysiwyg-content-area"
                  rows={14}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Draft your editorial reporting, tactical deep-dive, or player ratings..."
                  className="w-full bg-[#14161C] border-x border-b border-[#2D3545] rounded-b-xl p-4 font-sans text-sm text-neutral-200 focus:outline-none focus:border-[#A3E635] transition-all leading-relaxed"
                />
              </div>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT SIDEBAR PANEL: 30% WIDTH (lg:col-span-4) */}
        {/* ========================================================= */}
        <div className="lg:col-span-4 space-y-5">
          {/* 1. PUBLISH BOX */}
          <div className="bg-[#1A1A1A] border border-[#2B303D] rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#262C38] pb-3">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#A3E635]" />
                Publish Parameters
              </span>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                  status === 'published'
                    ? 'bg-[#A3E635]/15 text-[#A3E635] border border-[#A3E635]/30'
                    : 'bg-[#FACC15]/15 text-[#FACC15] border border-[#FACC15]/30'
                }`}
              >
                {status}
              </span>
            </div>

            {/* Status Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-neutral-400 uppercase">
                Publication Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PostStatus)}
                className="w-full bg-[#14161D] border border-[#2B3242] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#A3E635]"
              >
                <option value="published">Published (Live instantly)</option>
                <option value="draft">Draft (Private editorial review)</option>
                <option value="scheduled">Scheduled (Embargoed release)</option>
              </select>
            </div>

            {/* Post Type Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-neutral-400 uppercase">
                Editorial Type
              </label>
              <select
                value={postType}
                onChange={(e) => setPostType(e.target.value as PostType)}
                className="w-full bg-[#14161D] border border-[#2B3242] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#A3E635]"
              >
                <option value="news">News Wire (Standard report)</option>
                <option value="transfer">Transfer News (Radar & fees)</option>
                <option value="analysis">Tactical Analysis (Formations)</option>
                <option value="opinion">Opinion Column (Editorial take)</option>
              </select>
            </div>

            {/* Read Time */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-neutral-400 uppercase">
                Estimated Reading Time
              </label>
              <input
                type="text"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                placeholder="4 min read"
                className="w-full bg-[#14161D] border border-[#2B3242] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#A3E635]"
              />
            </div>

            {/* Solid Neon Lime [PUBLISH ARTICLE] Button */}
            <div className="pt-2 space-y-2">
              <button
                id="editor-publish-btn"
                onClick={() => handlePublishSubmit('published')}
                className="w-full bg-[#A3E635] hover:bg-[#8fd624] text-black text-xs font-black uppercase tracking-wider py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(163,230,53,0.3)] flex items-center justify-center gap-2 font-sport cursor-pointer"
              >
                <span>PUBLISH ARTICLE</span>
              </button>

              <button
                id="editor-save-draft-btn"
                onClick={() => handlePublishSubmit('draft')}
                className="w-full bg-[#202530] hover:bg-[#272D3B] text-neutral-300 hover:text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 font-sport"
              >
                <span>Save As Draft</span>
              </button>
            </div>
          </div>

          {/* 2. CATEGORY PICKER */}
          <div className="bg-[#1A1A1A] border border-[#2B303D] rounded-2xl p-5 shadow-xl space-y-3">
            <label className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center justify-between">
              <span>Category Taxonomy</span>
              <span className="text-[10px] text-[#00E5FF] font-mono">Supabase table</span>
            </label>
            <select
              id="editor-category-select"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-[#14161D] border border-[#2B3242] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#00E5FF]"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} ({cat.post_count} posts)
                </option>
              ))}
            </select>
          </div>

          {/* 3. FEATURED IMAGE URL INPUT & LIVE PREVIEW BOX */}
          <div className="bg-[#1A1A1A] border border-[#2B303D] rounded-2xl p-5 shadow-xl space-y-3">
            <label className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center justify-between">
              <span>Featured Image URL</span>
              <ImageIcon className="w-3.5 h-3.5 text-neutral-400" />
            </label>
            <input
              id="editor-image-url-input"
              type="text"
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              placeholder="Paste Image URL (Unsplash/Web CDN)..."
              className="w-full bg-[#14161D] border border-[#2B3242] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#A3E635] font-mono placeholder:text-neutral-600"
            />

            {/* Quick Presets for Instant Selection */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-neutral-500 uppercase">
                Quick Sports Presets:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {PRESET_IMAGES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFeaturedImage(preset.url)}
                    className="text-[10px] font-sans text-neutral-300 hover:text-white bg-[#14161D] hover:bg-[#202530] border border-[#2B3242] rounded px-2 py-1 truncate text-left"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Instant Live Image Preview Box */}
            <div className="space-y-1 pt-1">
              <span className="text-[10px] font-mono text-neutral-400 uppercase">
                Live Image Preview
              </span>
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-[#121418] border border-neutral-700 relative">
                {featuredImage ? (
                  <img
                    src={featuredImage}
                    alt="Live preview"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = PRESET_IMAGES[0].url;
                    }}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-neutral-500 text-xs">
                    <ImageIcon className="w-6 h-6 mb-1" />
                    <span>No image URL entered</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 4. FEATURED TOGGLE (PIN AS FRONT-PAGE HERO POST) */}
          <div className="bg-[#1A1A1A] border border-[#2B303D] rounded-2xl p-5 shadow-xl flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-white font-sport uppercase tracking-wider block">
                Pin as Front-Page Hero Post
              </span>
              <p className="text-[11px] text-neutral-400 leading-snug">
                Overrides primary Bento slot on KwaboSports homepage.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#252B38] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#A3E635]" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
