import React, { useState } from 'react';
import { Copy, Check, Share2, Send, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SocialShareBarProps {
  title: string;
  articleId?: string;
  url?: string;
  compact?: boolean;
}

export const SocialShareBar: React.FC<SocialShareBarProps> = ({
  title,
  articleId,
  url,
  compact = false,
}) => {
  const [copied, setCopied] = useState(false);

  // Generate robust share URL
  const shareUrl =
    url ||
    (typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}${articleId ? `#article=${articleId}` : ''}`
      : 'https://kwabosports.com');

  const shareText = `Check out this story on KwaboSports: "${title}"`;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = shareUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy share link:', err);
    }
  };

  const handleShareTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText
    )}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer,width=600,height=450');
  };

  const handleShareWhatsApp = () => {
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      `${shareText}\n${shareUrl}`
    )}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // User cancelled or failed
      }
    } else {
      handleCopyLink();
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        {/* Copy Link */}
        <button
          onClick={handleCopyLink}
          title={copied ? 'Link Copied!' : 'Copy Article Link'}
          aria-label="Copy article link"
          className={`p-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1 cursor-pointer ${
            copied
              ? 'bg-[#A3E635] text-black font-bold shadow-[0_0_12px_rgba(163,230,53,0.4)]'
              : 'text-neutral-400 hover:text-white hover:bg-[#202530]'
          }`}
        >
          {copied ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : <Copy className="w-3.5 h-3.5" />}
          {copied && <span className="text-[10px]">Copied</span>}
        </button>

        {/* Twitter / X */}
        <button
          onClick={handleShareTwitter}
          title="Share to Twitter / X"
          aria-label="Share on Twitter"
          className="p-1.5 text-neutral-400 hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10 rounded-lg transition-colors cursor-pointer"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </button>

        {/* WhatsApp */}
        <button
          onClick={handleShareWhatsApp}
          title="Share to WhatsApp"
          aria-label="Share on WhatsApp"
          className="p-1.5 text-neutral-400 hover:text-[#25D366] hover:bg-[#25D366]/10 rounded-lg transition-colors cursor-pointer"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.301-.15-1.782-.879-2.058-.98-.277-.101-.478-.15-.68.15-.201.3-.779.98-.954 1.18-.175.2-.351.226-.652.076-.301-.151-1.27-.468-2.42-1.493-.894-.798-1.498-1.783-1.674-2.084-.175-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.175.201-.301.301-.502.101-.2.051-.376-.025-.527-.075-.15-.68-1.637-.93-2.242-.244-.589-.492-.51-.68-.52l-.578-.01c-.201 0-.527.076-.803.376s-1.054 1.03-1.054 2.512c0 1.482 1.08 2.911 1.23 3.112.15.2 2.124 3.245 5.146 4.551.719.31 1.28.496 1.718.636.722.23 1.378.198 1.898.12.578-.087 1.782-.728 2.033-1.431.25-.703.25-1.306.175-1.432-.075-.125-.276-.2-.577-.35zM12.04 2C6.527 2 2.05 6.477 2.05 11.99c0 1.84.498 3.565 1.365 5.048L2 22l5.12-1.343a9.92 9.92 0 004.92 1.333h.004c5.512 0 9.99-4.478 9.99-9.99 0-2.67-1.04-5.18-2.926-7.067A9.928 9.928 0 0012.04 2z" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl bg-[#171A21] border border-[#272D3B] space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider font-sport">
          <Share2 className="w-4 h-4 text-[#A3E635]" />
          <span>Share This Article</span>
        </div>
        <span className="text-[11px] font-mono text-neutral-400">Spread the coverage</span>
      </div>

      {/* Sharing Buttons Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {/* Copy URL */}
        <button
          onClick={handleCopyLink}
          type="button"
          className={`px-3 py-2.5 rounded-lg border text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            copied
              ? 'bg-[#A3E635] text-black border-[#A3E635] shadow-[0_0_15px_rgba(163,230,53,0.3)]'
              : 'bg-[#1E222B] hover:bg-[#252A36] text-white border-[#2F3647]'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-neutral-400" />
              <span>Copy Link</span>
            </>
          )}
        </button>

        {/* Share to Twitter / X */}
        <button
          onClick={handleShareTwitter}
          type="button"
          className="px-3 py-2.5 rounded-lg bg-[#1E222B] hover:bg-[#1DA1F2]/20 text-white hover:text-[#1DA1F2] border border-[#2F3647] hover:border-[#1DA1F2]/50 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer group"
        >
          <svg className="w-4 h-4 fill-neutral-300 group-hover:fill-[#1DA1F2] transition-colors" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span>Share to X</span>
        </button>

        {/* Share to WhatsApp */}
        <button
          onClick={handleShareWhatsApp}
          type="button"
          className="px-3 py-2.5 rounded-lg bg-[#1E222B] hover:bg-[#25D366]/20 text-white hover:text-[#25D366] border border-[#2F3647] hover:border-[#25D366]/50 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer group"
        >
          <svg className="w-4 h-4 fill-neutral-300 group-hover:fill-[#25D366] transition-colors" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.301-.15-1.782-.879-2.058-.98-.277-.101-.478-.15-.68.15-.201.3-.779.98-.954 1.18-.175.2-.351.226-.652.076-.301-.151-1.27-.468-2.42-1.493-.894-.798-1.498-1.783-1.674-2.084-.175-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.175.201-.301.301-.502.101-.2.051-.376-.025-.527-.075-.15-.68-1.637-.93-2.242-.244-.589-.492-.51-.68-.52l-.578-.01c-.201 0-.527.076-.803.376s-1.054 1.03-1.054 2.512c0 1.482 1.08 2.911 1.23 3.112.15.2 2.124 3.245 5.146 4.551.719.31 1.28.496 1.718.636.722.23 1.378.198 1.898.12.578-.087 1.782-.728 2.033-1.431.25-.703.25-1.306.175-1.432-.075-.125-.276-.2-.577-.35zM12.04 2C6.527 2 2.05 6.477 2.05 11.99c0 1.84.498 3.565 1.365 5.048L2 22l5.12-1.343a9.92 9.92 0 004.92 1.333h.004c5.512 0 9.99-4.478 9.99-9.99 0-2.67-1.04-5.18-2.926-7.067A9.928 9.928 0 0012.04 2z" />
          </svg>
          <span>WhatsApp</span>
        </button>
      </div>

      {/* URL Preview bar */}
      <div className="flex items-center gap-2 bg-[#101217] px-3 py-1.5 rounded-lg border border-[#232733] text-[11px] font-mono text-neutral-400">
        <span className="text-neutral-500 shrink-0">URL:</span>
        <span className="truncate text-neutral-300 select-all">{shareUrl}</span>
      </div>
    </div>
  );
};
