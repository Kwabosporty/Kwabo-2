import React, { useState, useRef, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Minus,
  Code2,
  Eye,
  Sparkles,
  Check,
  X,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write your sports reporting, tactical breakdown, or editorial analysis...',
  minHeight = '320px',
}) => {
  const [isRawHtml, setIsRawHtml] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('https://');
  const [linkText, setLinkText] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageCaption, setImageCaption] = useState('');

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const visualEditorRef = useRef<HTMLDivElement | null>(null);

  // Sync content to visual editor when switched to visual
  useEffect(() => {
    if (!isRawHtml && visualEditorRef.current && visualEditorRef.current.innerHTML !== value) {
      visualEditorRef.current.innerHTML = value;
    }
  }, [isRawHtml, value]);

  // Insert tag or wrap selected text
  const applyWrap = (tagStart: string, tagEnd: string = '') => {
    if (isRawHtml && textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = value.substring(start, end) || 'text';
      const replacement = `${tagStart}${selected}${tagEnd}`;
      const updated = value.substring(0, start) + replacement + value.substring(end);
      onChange(updated);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + tagStart.length, start + replacement.length - tagEnd.length);
      }, 0);
    } else {
      // In visual mode
      document.execCommand('styleWithCSS', false, 'false');
      if (tagStart === '<b>') document.execCommand('bold', false);
      else if (tagStart === '<i>') document.execCommand('italic', false);
      else if (tagStart === '<u>') document.execCommand('underline', false);
      else if (tagStart === '<s>') document.execCommand('strikeThrough', false);
      else if (tagStart === '<h1>') document.execCommand('formatBlock', false, 'h1');
      else if (tagStart === '<h2>') document.execCommand('formatBlock', false, 'h2');
      else if (tagStart === '<h3>') document.execCommand('formatBlock', false, 'h3');
      else if (tagStart === '<blockquote>') document.execCommand('formatBlock', false, 'blockquote');
      else if (tagStart.includes('<ul>')) document.execCommand('insertUnorderedList', false);
      else if (tagStart.includes('<ol>')) document.execCommand('insertOrderedList', false);
      else if (tagStart === '<hr />') document.execCommand('insertHorizontalRule', false);
      else {
        // Fallback injection
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const selectedText = range.toString() || 'text';
          const node = document.createElement('span');
          node.innerHTML = `${tagStart}${selectedText}${tagEnd}`;
          range.deleteContents();
          range.insertNode(node);
        }
      }

      if (visualEditorRef.current) {
        onChange(visualEditorRef.current.innerHTML);
      }
    }
  };

  const handleVisualInput = () => {
    if (visualEditorRef.current) {
      onChange(visualEditorRef.current.innerHTML);
    }
  };

  const handleInsertLinkSubmit = () => {
    if (!linkUrl.trim()) return;
    const url = linkUrl.trim();
    const text = linkText.trim() || url;
    const anchorHtml = `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-[#00E5FF] underline font-semibold hover:text-[#5ce9ff]">${text}</a>`;

    if (isRawHtml) {
      applyWrap(anchorHtml, '');
    } else {
      document.execCommand('insertHTML', false, anchorHtml);
      if (visualEditorRef.current) {
        onChange(visualEditorRef.current.innerHTML);
      }
    }

    setShowLinkModal(false);
    setLinkUrl('https://');
    setLinkText('');
  };

  const handleInsertImageSubmit = () => {
    if (!imageUrl.trim()) return;
    const url = imageUrl.trim();
    const captionHtml = imageCaption.trim()
      ? `<figcaption class="text-xs text-neutral-400 text-center mt-1.5 font-mono">${imageCaption.trim()}</figcaption>`
      : '';
    const figureHtml = `<figure class="my-4 rounded-xl overflow-hidden border border-[#2B3445] bg-[#14161E]"><img src="${url}" alt="${imageCaption || 'KwaboSports Match Image'}" class="w-full h-auto object-cover" />${captionHtml}</figure>`;

    if (isRawHtml) {
      applyWrap(figureHtml, '');
    } else {
      document.execCommand('insertHTML', false, figureHtml);
      if (visualEditorRef.current) {
        onChange(visualEditorRef.current.innerHTML);
      }
    }

    setShowImageModal(false);
    setImageUrl('');
    setImageCaption('');
  };

  const insertTacticalCallout = () => {
    const calloutHtml = `<div class="p-4 my-4 rounded-xl bg-[#141A24] border-l-4 border-[#00E5FF] space-y-1"><strong class="text-xs font-mono font-bold text-[#00E5FF] uppercase tracking-wider block">TACTICAL INTELLIGENCE NOTE</strong><p class="text-xs text-neutral-300">Key tactical shift observed in transition play and half-space overload.</p></div>`;
    if (isRawHtml) {
      applyWrap(calloutHtml, '');
    } else {
      document.execCommand('insertHTML', false, calloutHtml);
      if (visualEditorRef.current) {
        onChange(visualEditorRef.current.innerHTML);
      }
    }
  };

  // Word count & Character count calculation
  const cleanText = value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = cleanText ? cleanText.split(/\s+/).length : 0;
  const charCount = cleanText.length;

  return (
    <div className="w-full bg-[#161922] border border-[#2C3342] focus-within:border-[#A3E635] rounded-xl overflow-hidden shadow-inner transition-colors">
      {/* RICH TEXT TOOLBAR */}
      <div className="bg-[#1C202B] border-b border-[#2C3342] p-2 flex flex-wrap items-center justify-between gap-1 select-none">
        {/* Left Toolbar formatting buttons */}
        <div className="flex flex-wrap items-center gap-1">
          {/* Bold, Italic, Underline, Strike */}
          <button
            type="button"
            onClick={() => applyWrap('<b>', '</b>')}
            title="Bold (Ctrl+B)"
            className="p-1.5 rounded hover:bg-[#2A3140] text-neutral-300 hover:text-[#A3E635] transition-colors"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => applyWrap('<i>', '</i>')}
            title="Italic (Ctrl+I)"
            className="p-1.5 rounded hover:bg-[#2A3140] text-neutral-300 hover:text-[#A3E635] transition-colors"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => applyWrap('<u>', '</u>')}
            title="Underline (Ctrl+U)"
            className="p-1.5 rounded hover:bg-[#2A3140] text-neutral-300 hover:text-[#A3E635] transition-colors"
          >
            <Underline className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => applyWrap('<s>', '</s>')}
            title="Strikethrough"
            className="p-1.5 rounded hover:bg-[#2A3140] text-neutral-300 hover:text-[#A3E635] transition-colors"
          >
            <Strikethrough className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-[#2E3647] mx-1" />

          {/* Headings */}
          <button
            type="button"
            onClick={() => applyWrap('<h1>', '</h1>')}
            title="Heading 1"
            className="p-1.5 rounded hover:bg-[#2A3140] text-neutral-300 hover:text-[#00E5FF] transition-colors"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => applyWrap('<h2>', '</h2>')}
            title="Heading 2"
            className="p-1.5 rounded hover:bg-[#2A3140] text-neutral-300 hover:text-[#00E5FF] transition-colors"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => applyWrap('<h3>', '</h3>')}
            title="Heading 3"
            className="p-1.5 rounded hover:bg-[#2A3140] text-neutral-300 hover:text-[#00E5FF] transition-colors"
          >
            <Heading3 className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-[#2E3647] mx-1" />

          {/* Lists & Quotes */}
          <button
            type="button"
            onClick={() => applyWrap('<blockquote>', '</blockquote>')}
            title="Blockquote"
            className="p-1.5 rounded hover:bg-[#2A3140] text-neutral-300 hover:text-[#FACC15] transition-colors"
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => applyWrap('<ul>\n  <li>', '</li>\n</ul>')}
            title="Bulleted List"
            className="p-1.5 rounded hover:bg-[#2A3140] text-neutral-300 hover:text-white transition-colors"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => applyWrap('<ol>\n  <li>', '</li>\n</ol>')}
            title="Numbered List"
            className="p-1.5 rounded hover:bg-[#2A3140] text-neutral-300 hover:text-white transition-colors"
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-[#2E3647] mx-1" />

          {/* Inserts: Link, Image, Tactical Box */}
          <button
            type="button"
            onClick={() => {
              if (textareaRef.current) {
                const sel = value.substring(
                  textareaRef.current.selectionStart,
                  textareaRef.current.selectionEnd
                );
                if (sel) setLinkText(sel);
              }
              setShowLinkModal(true);
            }}
            title="Insert Hyperlink"
            className="p-1.5 rounded hover:bg-[#2A3140] text-neutral-300 hover:text-[#00E5FF] transition-colors"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setShowImageModal(true)}
            title="Insert Image by URL"
            className="p-1.5 rounded hover:bg-[#2A3140] text-neutral-300 hover:text-[#00E5FF] transition-colors"
          >
            <ImageIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={insertTacticalCallout}
            title="Insert Tactical Callout Matrix"
            className="px-2 py-1 rounded text-[11px] font-mono font-bold bg-[#141F2B] hover:bg-[#1A2A3B] text-[#00E5FF] border border-[#00E5FF]/30 transition-colors flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3" />
            <span>Callout</span>
          </button>
        </div>

        {/* Right Toolbar mode switcher */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsRawHtml(!isRawHtml)}
            className={`text-[11px] font-mono px-2.5 py-1 rounded-md border flex items-center gap-1.5 transition-all cursor-pointer ${
              isRawHtml
                ? 'bg-[#00E5FF]/15 text-[#00E5FF] border-[#00E5FF]/40'
                : 'bg-[#151820] text-neutral-400 border-neutral-700 hover:text-white'
            }`}
          >
            {isRawHtml ? <Eye className="w-3.5 h-3.5" /> : <Code2 className="w-3.5 h-3.5" />}
            <span>{isRawHtml ? 'Visual Mode' : 'Raw HTML'}</span>
          </button>
        </div>
      </div>

      {/* QUICK INSERT LINK MODAL */}
      {showLinkModal && (
        <div className="bg-[#12141A] border-b border-[#2C3342] p-3 flex flex-col sm:flex-row items-center gap-2 text-xs">
          <div className="flex-1 w-full sm:w-auto">
            <input
              type="text"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              placeholder="Anchor Text (e.g. About Us or Match Report)..."
              className="w-full bg-[#1A1D24] border border-[#2D3545] rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-[#00E5FF] text-xs font-mono"
            />
          </div>
          <div className="flex-1 w-full sm:w-auto">
            <input
              type="text"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="URL (e.g. https://... or #about)"
              className="w-full bg-[#1A1D24] border border-[#2D3545] rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-[#00E5FF] text-xs font-mono"
            />
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={handleInsertLinkSubmit}
              className="px-3 py-1.5 rounded-lg bg-[#00E5FF] hover:bg-[#38bdf8] text-black font-bold font-mono text-xs flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply Link</span>
            </button>
            <button
              type="button"
              onClick={() => setShowLinkModal(false)}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white bg-[#1E222A]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* QUICK INSERT IMAGE MODAL */}
      {showImageModal && (
        <div className="bg-[#12141A] border-b border-[#2C3342] p-3 flex flex-col sm:flex-row items-center gap-2 text-xs">
          <div className="flex-1 w-full sm:w-auto">
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Image URL (https://...)"
              className="w-full bg-[#1A1D24] border border-[#2D3545] rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-[#A3E635] text-xs font-mono"
            />
          </div>
          <div className="flex-1 w-full sm:w-auto">
            <input
              type="text"
              value={imageCaption}
              onChange={(e) => setImageCaption(e.target.value)}
              placeholder="Image caption / attribution"
              className="w-full bg-[#1A1D24] border border-[#2D3545] rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-[#A3E635] text-xs font-mono"
            />
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={handleInsertImageSubmit}
              className="px-3 py-1.5 rounded-lg bg-[#A3E635] hover:bg-[#8fd624] text-black font-bold font-mono text-xs flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Insert Image</span>
            </button>
            <button
              type="button"
              onClick={() => setShowImageModal(false)}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white bg-[#1E222A]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* EDITOR CANVAS */}
      {isRawHtml ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="<p>Write raw HTML markup for the article narrative...</p>"
          style={{ minHeight }}
          className="w-full bg-[#12141A] p-4 text-xs font-mono text-neutral-200 outline-none resize-y leading-relaxed border-none block"
        />
      ) : (
        <div
          ref={visualEditorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleVisualInput}
          onBlur={handleVisualInput}
          style={{ minHeight }}
          className="w-full bg-[#14161F] p-4 text-sm text-neutral-200 outline-none overflow-y-auto leading-relaxed focus:ring-0 prose prose-invert prose-sm max-w-none [&_h1]:text-2xl [&_h1]:font-black [&_h1]:text-white [&_h1]:mb-3 [&_h2]:text-xl [&_h2]:font-extrabold [&_h2]:text-white [&_h2]:mb-2 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-white [&_h3]:mb-2 [&_p]:mb-3 [&_blockquote]:border-l-4 [&_blockquote]:border-[#00E5FF] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-neutral-300 [&_blockquote]:my-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3 [&_a]:text-[#00E5FF] [&_a]:underline"
          data-placeholder={placeholder}
        />
      )}

      {/* FOOTER BAR: Metrics & Quick Help */}
      <div className="bg-[#101217] border-t border-[#232834] px-4 py-2 flex items-center justify-between text-[11px] font-mono text-neutral-400">
        <div className="flex items-center gap-3">
          <span>{wordCount} words</span>
          <span>•</span>
          <span>{charCount} characters</span>
          <span>•</span>
          <span className="text-[#A3E635]">~{Math.max(1, Math.ceil(wordCount / 200))} min read</span>
        </div>
        <div className="hidden sm:block text-neutral-400">
          Tip: Rich HTML, embeds, and standard typography elements supported.
        </div>
      </div>
    </div>
  );
};
