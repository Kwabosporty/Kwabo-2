import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Eye,
  CheckCircle2,
  Sparkles,
  Layers,
  Image as ImageIcon,
  RotateCcw,
  ShieldCheck,
  Globe,
  Clock,
  Calendar,
  UserCheck,
  Tag,
  Share2,
  Bookmark,
  ChevronRight,
  ExternalLink,
  Laptop,
  Maximize2,
  Columns,
  SquareCode,
  FileEdit,
  Youtube,
} from 'lucide-react';
import {
  AdminPost,
  Category,
  PostType,
  PostStatus,
  DEFAULT_EEAT_AUTHOR_BIO,
} from '../../types';
import { RichTextEditor } from './RichTextEditor';
import { AuthorBioBox } from '../AuthorBioBox';

interface AdminPostEditorViewProps {
  postToEdit?: AdminPost | null;
  categories: Category[];
  onSavePost: (
    postData: Omit<AdminPost, 'id' | 'created_at' | 'updated_at' | 'views'>,
    existingId?: string
  ) => void;
  onCancel: () => void;
}

const PRESET_IMAGES = [
  {
    label: 'Champions League Action',
    url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1000&auto=format&fit=crop&q=80',
  },
  {
    label: 'Transfer Radar Wire',
    url: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'NBA Arena Night',
    url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'F1 Cockpit Telemetry',
    url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=80',
  },
];

export const AdminPostEditorView: React.FC<AdminPostEditorViewProps> = ({
  postToEdit,
  categories,
  onSavePost,
  onCancel,
}) => {
  // Normalize initial Post Type (NEWS, TRANSFER, ANALYSIS, MATCH_REPORT, OPINION)
  const initialPostType = (): PostType => {
    if (!postToEdit?.post_type) return 'NEWS';
    const pt = postToEdit.post_type.toUpperCase();
    if (['NEWS', 'TRANSFER', 'ANALYSIS', 'MATCH_REPORT', 'OPINION'].includes(pt)) {
      return pt as PostType;
    }
    if (pt === 'REPORT') return 'MATCH_REPORT';
    return 'NEWS';
  };

  // Normalize initial Status (DRAFT, PUBLISHED)
  const initialStatus = (): PostStatus => {
    if (!postToEdit?.status) return 'PUBLISHED';
    const st = postToEdit.status.toUpperCase();
    if (st === 'DRAFT') return 'DRAFT';
    return 'PUBLISHED';
  };

  // FORM STATES
  const [title, setTitle] = useState(postToEdit?.title || '');
  const [slug, setSlug] = useState(postToEdit?.slug || '');
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(!!postToEdit?.slug);
  const [excerpt, setExcerpt] = useState(postToEdit?.excerpt || '');
  const [content, setContent] = useState(
    postToEdit?.content ||
      `<h2>Match Overview & Tactical Analysis</h2>
<p>In an explosive start to the fixture, high-tempo pressing in the attacking third exposed positional imbalances across the opposing defensive line.</p>
<blockquote>"We executed the transitional overload exactly according to our preparation." — Head Coach</blockquote>
<p>Telemetry metrics and physical tracking indicate a historic physical output in the center of the pitch, allowing quick recoveries in transition.</p>`
  );
  const [featuredImage, setFeaturedImage] = useState(
    postToEdit?.featured_image || PRESET_IMAGES[0].url
  );
  const [categoryId, setCategoryId] = useState(
    postToEdit?.category_id || categories[0]?.id || 'cat-tactics'
  );
  const [postType, setPostType] = useState<PostType>(initialPostType());
  const [status, setStatus] = useState<PostStatus>(initialStatus());
  const [isFeatured, setIsFeatured] = useState<boolean>(postToEdit?.is_featured || false);
  const [readTime, setReadTime] = useState(postToEdit?.read_time || '4 min read');

  // AUTHOR BIO & E-E-A-T SECTION STATE
  const [authorBio, setAuthorBio] = useState<string>(
    postToEdit?.author_bio || DEFAULT_EEAT_AUTHOR_BIO
  );
  const [authorName, setAuthorName] = useState(postToEdit?.author_name || 'Elena Rostova');
  const [authorRole, setAuthorRole] = useState(
    postToEdit?.author_role || 'Chief Football Tactician & Senior Editor'
  );
  const [authorAvatar, setAuthorAvatar] = useState(
    postToEdit?.author_avatar ||
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80'
  );

  // UI View Layout: 'split' (side by side), 'editor-only', 'preview-only'
  const [viewMode, setViewMode] = useState<'split' | 'editor-only' | 'preview-only'>('split');
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);

  // Route indicator: Next.js 15 route representation
  const activeRoutePath = postToEdit
    ? `/admin/posts/edit/[${postToEdit.id}]`
    : '/admin/posts/new';

  // 1. Automatic slug generator from title
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!isSlugManuallyEdited) {
      const generatedSlug = newTitle
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // remove special characters
        .replace(/[\s_-]+/g, '-') // collapse whitespace and replace by -
        .replace(/^-+|-+$/g, ''); // remove leading/trailing dashes
      setSlug(generatedSlug);
    }
  };

  const handleSlugChange = (newSlug: string) => {
    setIsSlugManuallyEdited(true);
    setSlug(
      newSlug
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
    );
  };

  const resetSlugToTitle = () => {
    setIsSlugManuallyEdited(false);
    const generatedSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setSlug(generatedSlug);
  };

  // Reset Author Bio to default Kwabo Sports E-E-A-T text
  const handleResetAuthorBio = () => {
    setAuthorBio(DEFAULT_EEAT_AUTHOR_BIO);
  };

  // Get active Category object
  const activeCategory =
    categories.find((c) => c.id === categoryId) ||
    categories[0] || {
      id: 'cat-news',
      name: 'Football News',
      slug: 'football-news',
      color: '#A3E635',
      description: 'Global Football News',
      post_count: 12,
      created_at: new Date().toISOString(),
    };

  // Save / Publish Submit handler
  const handleSaveSubmit = (targetStatus?: PostStatus) => {
    if (!title.trim()) {
      alert('Please enter a headline for the article before saving.');
      return;
    }

    const finalStatus = targetStatus || status;

    const payload: Omit<AdminPost, 'id' | 'created_at' | 'updated_at' | 'views'> = {
      title: title.trim(),
      slug: slug.trim() || 'sports-headline',
      excerpt: excerpt.trim() || title.trim(),
      content: content.trim(),
      featured_image: featuredImage.trim() || PRESET_IMAGES[0].url,
      category_id: activeCategory.id,
      category_name: activeCategory.name,
      category_slug: activeCategory.slug,
      category_color: activeCategory.color || '#A3E635',
      post_type: postType,
      status: finalStatus,
      is_featured: isFeatured,
      author_id: postToEdit?.author_id || 'admin-1',
      author_name: authorName,
      author_role: authorRole,
      author_avatar: authorAvatar,
      author_bio: authorBio.trim() || DEFAULT_EEAT_AUTHOR_BIO,
      read_time: readTime || '4 min read',
      published_at:
        finalStatus === 'PUBLISHED' || finalStatus === 'published'
          ? new Date().toISOString()
          : null,
    };

    onSavePost(payload, postToEdit?.id);

    setIsSavedSuccess(true);
    setTimeout(() => {
      setIsSavedSuccess(false);
    }, 3000);
  };

  return (
    <div id="admin-post-editor-studio" className="space-y-6 pb-12">
      {/* ========================================================= */}
      {/* 1. TOP ROUTE BREADCRUMB & ACTION HEADER                   */}
      {/* ========================================================= */}
      <div className="bg-[#161922] border border-[#262D3B] rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Back button, Route Badge, Title */}
        <div className="flex items-start sm:items-center gap-3">
          <button
            id="editor-back-to-posts-btn"
            onClick={onCancel}
            title="Back to Posts Archive"
            className="p-2.5 rounded-xl bg-[#1E232E] hover:bg-[#2A3140] text-neutral-300 hover:text-white border border-[#2B3445] transition-all cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>ADMIN</span>
                <ChevronRight className="w-3 h-3 text-neutral-600" />
                <span>POSTS</span>
                <ChevronRight className="w-3 h-3 text-neutral-600" />
                <span className="text-[#00E5FF]">
                  {postToEdit ? 'EDIT ARTICLE' : 'CREATE NEW'}
                </span>
              </span>

              {/* Next.js 15 Route badge */}
              <span
                id="editor-nextjs-route-badge"
                className="text-[10px] font-mono text-[#A3E635] bg-[#1A251A] border border-[#2C402C] px-2 py-0.5 rounded-full font-bold flex items-center gap-1"
                title="Next.js 15 Route Target"
              >
                <SquareCode className="w-3 h-3" />
                {activeRoutePath}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white font-sport uppercase tracking-tight">
              {postToEdit ? 'EDIT ARTICLE SPECIFICATION' : 'NEW BLOG POST STUDIO'}
            </h1>
          </div>
        </div>

        {/* Center & Right: View Switchers & Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Layout Mode Switcher */}
          <div className="bg-[#12141A] border border-[#2A3242] p-1 rounded-xl flex items-center gap-1">
            <button
              type="button"
              onClick={() => setViewMode('split')}
              title="Split View: Editor + Live Preview"
              className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'split'
                  ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Split View</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('editor-only')}
              title="Editor Focus Only"
              className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'editor-only'
                  ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <FileEdit className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Editor</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('preview-only')}
              title="Live Preview Focus"
              className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'preview-only'
                  ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Live Preview</span>
            </button>
          </div>

          {/* Save As Draft button */}
          <button
            id="editor-header-save-draft"
            type="button"
            onClick={() => handleSaveSubmit('DRAFT')}
            className="px-4 py-2 rounded-xl bg-[#202532] hover:bg-[#283040] text-neutral-300 hover:text-white text-xs font-bold font-sport uppercase tracking-wider border border-[#2E374A] transition-all cursor-pointer"
          >
            Save Draft
          </button>

          {/* Primary Save & Publish button */}
          <button
            id="editor-header-publish-now"
            type="button"
            onClick={() => handleSaveSubmit('PUBLISHED')}
            className="px-5 py-2 rounded-xl bg-[#A3E635] hover:bg-[#8fd624] text-black text-xs font-black font-sport uppercase tracking-wider shadow-[0_0_15px_rgba(163,230,53,0.3)] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{postToEdit ? 'UPDATE ARTICLE' : 'PUBLISH POST'}</span>
          </button>
        </div>
      </div>

      {/* SUCCESS NOTIFICATION TOAST */}
      {isSavedSuccess && (
        <div className="bg-[#182618] border border-[#A3E635]/50 text-[#A3E635] p-3.5 rounded-xl text-xs font-mono font-bold flex items-center justify-between gap-2 shadow-lg animate-pulse">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>
              Article record saved and synchronized to Supabase table <code>public.posts</code>{' '}
              with author bio!
            </span>
          </div>
          <span className="text-[10px] text-neutral-400 font-normal">Auto-synced</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. MAIN LAYOUT: SPLIT (EDITOR + LIVE PREVIEW)             */}
      {/* ========================================================= */}
      <div
        className={`grid gap-6 items-start ${
          viewMode === 'split'
            ? 'grid-cols-1 xl:grid-cols-12'
            : 'grid-cols-1'
        }`}
      >
        {/* ======================================================= */}
        {/* LEFT / PRIMARY: BLOG POST FORM FIELDS                   */}
        {/* ======================================================= */}
        {viewMode !== 'preview-only' && (
          <div
            className={`space-y-6 ${
              viewMode === 'split' ? 'xl:col-span-7' : 'w-full max-w-5xl mx-auto'
            }`}
          >
            {/* CARD 1: CORE ARTICLE METADATA (Title, Slug, Excerpt) */}
            <div className="bg-[#161922] border border-[#262D3B] rounded-2xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-[#242A38] pb-3">
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#A3E635]" />
                  1. Editorial Title & Taxonomy
                </span>
                <span className="text-[10px] font-mono text-neutral-500">public.posts</span>
              </div>

              {/* A. Article Title Input with char counter */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="article-title-field"
                    className="text-xs font-mono font-bold text-white uppercase tracking-wider"
                  >
                    Article Title <span className="text-[#A3E635]">*</span>
                  </label>
                  <span className="text-[11px] font-mono text-neutral-400">
                    {title.length}/120 characters
                  </span>
                </div>
                <input
                  id="article-title-field"
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Inside City's Inverted Wing-Back Revolution: Masterclass Breakdown"
                  className="w-full bg-[#12141A] border-2 border-[#2B3445] focus:border-[#A3E635] text-white text-base sm:text-lg font-bold font-sport p-3.5 rounded-xl outline-none transition-all placeholder:text-neutral-600 shadow-inner"
                />
              </div>

              {/* B. Automatic Slug Generator */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="article-slug-field"
                    className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <span>Permanent URL Slug</span>
                    {isSlugManuallyEdited && (
                      <span className="text-[10px] text-[#FACC15] bg-[#FACC15]/10 px-1.5 py-0.2 rounded font-normal">
                        Custom Slug
                      </span>
                    )}
                  </label>

                  {isSlugManuallyEdited && (
                    <button
                      type="button"
                      onClick={resetSlugToTitle}
                      className="text-[10px] font-mono text-[#00E5FF] hover:underline flex items-center gap-1 cursor-pointer"
                      title="Sync slug with current title"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Re-sync from title</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center bg-[#101217] border border-[#283040] focus-within:border-[#00E5FF] rounded-xl px-3 py-2 text-xs font-mono transition-colors">
                  <span className="text-[#00E5FF] font-bold select-none shrink-0">
                    kwabosports.com/news/
                  </span>
                  <input
                    id="article-slug-field"
                    type="text"
                    value={slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    placeholder="automatic-slug-generator"
                    className="bg-transparent text-white outline-none flex-1 ml-1 text-xs font-mono placeholder:text-neutral-600"
                  />
                </div>
              </div>

              {/* C. 2-Line Excerpt Preview */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="article-excerpt-field"
                    className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider"
                  >
                    Front-Page Excerpt (2-Sentence Summary)
                  </label>
                  <span className="text-[11px] font-mono text-neutral-500">
                    {excerpt.length}/240
                  </span>
                </div>
                <textarea
                  id="article-excerpt-field"
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="A concise two-sentence summary that highlights the narrative on the homepage Bento and feed cards..."
                  className="w-full bg-[#12141A] border border-[#2B3445] focus:border-[#A3E635] text-white text-xs sm:text-sm p-3 rounded-xl outline-none transition-all placeholder:text-neutral-600 resize-none leading-relaxed"
                />
              </div>

              {/* D. Category, Post Type, and Publication Status Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                {/* 1. Category Selector (Populated from public.categories) */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="category-select-field"
                    className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider flex items-center justify-between"
                  >
                    <span>Category</span>
                    <span className="text-[10px] text-[#00E5FF]">categories</span>
                  </label>
                  <select
                    id="category-select-field"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-[#12141A] border border-[#2B3445] rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-[#00E5FF] cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name} ({cat.post_count} posts)
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Post Type Dropdown (NEWS, TRANSFER, ANALYSIS, MATCH_REPORT, OPINION) */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="post-type-select-field"
                    className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider"
                  >
                    Post Type
                  </label>
                  <select
                    id="post-type-select-field"
                    value={postType}
                    onChange={(e) => setPostType(e.target.value as PostType)}
                    className="w-full bg-[#12141A] border border-[#2B3445] rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-[#A3E635] cursor-pointer uppercase font-sport font-bold"
                  >
                    <option value="NEWS">NEWS (Breaking Wire)</option>
                    <option value="TRANSFER">TRANSFER (Radar & Deals)</option>
                    <option value="ANALYSIS">ANALYSIS (Tactical Breakdown)</option>
                    <option value="MATCH_REPORT">MATCH_REPORT (Full Report)</option>
                    <option value="OPINION">OPINION (Editorial Column)</option>
                  </select>
                </div>

                {/* 3. Status Dropdown (DRAFT, PUBLISHED) */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="post-status-select-field"
                    className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider"
                  >
                    Post Status
                  </label>
                  <select
                    id="post-status-select-field"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as PostStatus)}
                    className={`w-full border rounded-xl px-3 py-2.5 text-xs outline-none cursor-pointer uppercase font-sport font-bold transition-colors ${
                      status === 'PUBLISHED' || status === 'published'
                        ? 'bg-[#152315] border-[#A3E635]/60 text-[#A3E635]'
                        : 'bg-[#232014] border-[#FACC15]/60 text-[#FACC15]'
                    }`}
                  >
                    <option value="PUBLISHED">PUBLISHED (Live)</option>
                    <option value="DRAFT">DRAFT (Unpublished)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* CARD 2: FEATURED IMAGE URL & QUICK PREVIEW */}
            <div className="bg-[#161922] border border-[#262D3B] rounded-2xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-[#242A38] pb-3">
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#00E5FF]" />
                  2. Featured Image & Media Asset
                </span>
                <span className="text-[10px] font-mono text-neutral-400">16:9 Hero Ratio</span>
              </div>

              {/* Direct text input for Image URL */}
              <div className="space-y-1.5">
                <label
                  htmlFor="featured-image-url-input"
                  className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider"
                >
                  Featured Image URL
                </label>
                <input
                  id="featured-image-url-input"
                  type="text"
                  value={featuredImage}
                  onChange={(e) => {
                    setFeaturedImage(e.target.value);
                    setImageLoadError(false);
                  }}
                  placeholder="https://images.unsplash.com/... or sports CDN URL"
                  className="w-full bg-[#12141A] border border-[#2B3445] focus:border-[#00E5FF] text-white text-xs font-mono p-3 rounded-xl outline-none transition-all placeholder:text-neutral-600"
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
                  Quick Sports Presets:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PRESET_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setFeaturedImage(preset.url);
                        setImageLoadError(false);
                      }}
                      className={`text-[11px] font-sans p-2 rounded-lg border text-left truncate transition-all cursor-pointer ${
                        featuredImage === preset.url
                          ? 'bg-[#00E5FF]/15 text-[#00E5FF] border-[#00E5FF]/40'
                          : 'bg-[#12141A] text-neutral-300 border-[#2A3140] hover:text-white hover:bg-[#1A1F2B]'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Image Preview Box */}
              <div className="pt-1">
                <div className="w-full aspect-[21/9] sm:aspect-[24/9] rounded-xl overflow-hidden bg-[#101217] border border-[#2B3445] relative flex items-center justify-center">
                  {featuredImage && !imageLoadError ? (
                    <img
                      src={featuredImage}
                      alt="Featured image preview"
                      referrerPolicy="no-referrer"
                      onError={() => setImageLoadError(true)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-4 text-neutral-500 font-mono text-xs space-y-1">
                      <ImageIcon className="w-6 h-6 mx-auto mb-1 text-neutral-600" />
                      <span>{imageLoadError ? 'Unable to load image URL' : 'No image URL provided'}</span>
                    </div>
                  )}

                  {/* Overlay Tag indicator */}
                  <div className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-mono text-white border border-white/10 flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: activeCategory.color || '#A3E635' }}
                    />
                    <span>{activeCategory.name}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 3: MAIN BODY CONTENT (Rich HTML Editor) */}
            <div className="bg-[#161922] border border-[#262D3B] rounded-2xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-[#242A38] pb-3">
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <FileEdit className="w-4 h-4 text-[#A3E635]" />
                  3. Main Body Content (Rich HTML Editor)
                </span>
                <span className="text-[10px] font-mono text-[#A3E635] bg-[#1C251C] border border-[#283828] px-2 py-0.5 rounded">
                  WYSIWYG & HTML
                </span>
              </div>

              {/* Rich Text Editor Component */}
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="Compose the match report, in-depth tactical analysis, quote reactions, and statistical ratings..."
                minHeight="340px"
              />
            </div>

            {/* CARD 4: DEDICATED AUTHOR BIO & E-E-A-T SECTION */}
            <div
              id="author-bio-editor-card"
              className="bg-[#161922] border-2 border-[#A3E635]/40 rounded-2xl p-5 shadow-xl space-y-4 relative overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#A3E635]/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2B3545] pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[#A3E635]/20 text-[#A3E635]">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase font-sport tracking-wide flex items-center gap-1.5">
                      Author Bio / Editorial Attribution
                      <span className="text-[10px] font-mono text-[#A3E635] bg-[#1E261E] border border-[#2B3B2B] px-1.5 py-0.2 rounded font-normal">
                        E-E-A-T Mandatory
                      </span>
                    </h3>
                    <p className="text-[11px] text-neutral-400 font-mono">
                      Controls public editorial credibility and attribution links per Google E-E-A-T standards
                    </p>
                  </div>
                </div>

                {/* Reset to default Kwabo Sports attribution button */}
                <button
                  type="button"
                  id="reset-author-bio-btn"
                  onClick={handleResetAuthorBio}
                  className="text-xs font-mono text-[#00E5FF] hover:text-white bg-[#141F2B] hover:bg-[#1C2A3B] border border-[#00E5FF]/30 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                  title="Reset to official KwaboSports E-E-A-T description"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Default Kwabo Attribution</span>
                </button>
              </div>

              {/* Author metadata row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label
                    htmlFor="author-name-input"
                    className="text-xs font-mono font-bold text-neutral-300 uppercase"
                  >
                    Author Full Name
                  </label>
                  <input
                    id="author-name-input"
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full bg-[#12141A] border border-[#2A3342] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#A3E635] font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="author-role-input"
                    className="text-xs font-mono font-bold text-neutral-300 uppercase"
                  >
                    Author Role / Title
                  </label>
                  <input
                    id="author-role-input"
                    type="text"
                    value={authorRole}
                    onChange={(e) => setAuthorRole(e.target.value)}
                    className="w-full bg-[#12141A] border border-[#2A3342] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#A3E635] font-sans"
                  />
                </div>
              </div>

              {/* Dedicated Author Bio Text Area */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="author-bio-textarea"
                    className="text-xs font-mono font-bold text-white uppercase tracking-wider"
                  >
                    Author Bio / Editorial Attribution Text
                  </label>
                  <span className="text-[11px] font-mono text-neutral-400">
                    {authorBio.length} characters
                  </span>
                </div>

                <textarea
                  id="author-bio-textarea"
                  rows={4}
                  value={authorBio}
                  onChange={(e) => setAuthorBio(e.target.value)}
                  placeholder="Enter custom author bio or leave default KwaboSports editorial attribution..."
                  className="w-full bg-[#12141A] border-2 border-[#2B3545] focus:border-[#A3E635] text-white text-xs sm:text-sm p-3.5 rounded-xl outline-none transition-all placeholder:text-neutral-600 leading-relaxed font-sans"
                />

                <div className="bg-[#12151D] border border-[#222A38] rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-neutral-400">
                  <div className="flex items-center gap-1.5 text-neutral-300">
                    <Sparkles className="w-3.5 h-3.5 text-[#A3E635] shrink-0" />
                    <span>
                      Mentions of <strong>About Us</strong> and <strong>Our YouTube Channel</strong>{' '}
                      automatically render active styled links in the live public preview!
                    </span>
                  </div>
                </div>
              </div>

              {/* Hero Post Toggle */}
              <div className="pt-2 border-t border-[#252C3A] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white font-sport uppercase tracking-wider block">
                    Pin as Front-Page Hero Post
                  </span>
                  <p className="text-[11px] text-neutral-400">
                    Pins this article to the primary hero slot on KwaboSports homepage.
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
        )}

        {/* ======================================================= */}
        {/* RIGHT: LIVE PREVIEW CARD (PUBLIC SITE RENDERING)       */}
        {/* ======================================================= */}
        {viewMode !== 'editor-only' && (
          <div
            className={`space-y-4 ${
              viewMode === 'split' ? 'xl:col-span-5' : 'w-full max-w-4xl mx-auto'
            }`}
          >
            {/* Live Preview Header Controls */}
            <div className="flex items-center justify-between bg-[#161922] border border-[#262D3B] px-4 py-2.5 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00E5FF] animate-ping" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  LIVE ARTICLE PREVIEW
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#00E5FF] bg-[#00E5FF]/10 border border-[#00E5FF]/30 px-2 py-0.5 rounded">
                Real-time Public Rendering
              </span>
            </div>

            {/* Public Article Preview Card */}
            <div
              id="live-preview-public-card"
              className="bg-[#101217] border border-[#262C3A] rounded-2xl overflow-hidden shadow-2xl"
            >
              {/* Top Banner with Featured Image */}
              <div className="relative aspect-[16/9] w-full bg-[#161820] overflow-hidden">
                <img
                  src={featuredImage || PRESET_IMAGES[0].url}
                  alt={title || 'Article preview'}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = PRESET_IMAGES[0].url;
                  }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101217] via-[#101217]/40 to-transparent" />

                {/* Badges Overlay */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="px-2.5 py-0.5 rounded text-[10px] font-mono font-black uppercase tracking-wider text-black shadow-md"
                      style={{ backgroundColor: activeCategory.color || '#00E5FF' }}
                    >
                      {activeCategory.name}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider text-white bg-black/60 border border-white/10 backdrop-blur-md">
                      {postType}
                    </span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      status === 'PUBLISHED' || status === 'published'
                        ? 'bg-[#A3E635]/20 text-[#A3E635] border border-[#A3E635]/40'
                        : 'bg-[#FACC15]/20 text-[#FACC15] border border-[#FACC15]/40'
                    }`}
                  >
                    {status}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 space-y-5">
                {/* Title */}
                <h2 className="text-xl sm:text-2xl font-black text-white font-sport uppercase tracking-tight leading-tight">
                  {title || 'Enter your headline above to preview in real-time...'}
                </h2>

                {/* Excerpt */}
                {excerpt && (
                  <p className="text-xs sm:text-sm text-neutral-300 font-medium leading-relaxed border-l-2 border-[#A3E635] pl-3 py-0.5">
                    {excerpt}
                  </p>
                )}

                {/* Author Byline & Metadata Bar */}
                <div className="flex items-center justify-between text-xs text-neutral-400 border-y border-[#202734] py-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={authorAvatar}
                      alt={authorName}
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-full object-cover border border-[#A3E635]"
                    />
                    <div>
                      <div className="text-white font-bold text-xs">{authorName}</div>
                      <div className="text-[10px] text-neutral-400 font-mono">{authorRole}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#A3E635]" />
                      {readTime}
                    </span>
                    <span>•</span>
                    <span className="text-[#00E5FF]">Just now</span>
                  </div>
                </div>

                {/* Rendered HTML Body Preview */}
                <div className="space-y-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block">
                    Article Body Narrative:
                  </span>
                  <div
                    className="prose prose-invert prose-sm max-w-none text-neutral-300 leading-relaxed [&_h1]:text-lg [&_h1]:font-black [&_h1]:text-white [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-white [&_h3]:text-sm [&_h3]:font-bold [&_h3]:text-white [&_blockquote]:border-l-4 [&_blockquote]:border-[#00E5FF] [&_blockquote]:pl-3 [&_blockquote]:my-2 [&_blockquote]:text-neutral-300 [&_a]:text-[#00E5FF] [&_a]:underline"
                    dangerouslySetInnerHTML={{
                      __html: content || '<p>Write your article content in the editor...</p>',
                    }}
                  />
                </div>

                {/* DEDICATED AUTHOR BIO & E-E-A-T SECTION IN LIVE PREVIEW */}
                <div className="pt-2">
                  <AuthorBioBox
                    bio={authorBio}
                    authorName={authorName}
                    authorRole={authorRole}
                    authorAvatar={authorAvatar}
                    compact={false}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
