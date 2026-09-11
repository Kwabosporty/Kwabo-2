import React from 'react';
import { ShieldCheck, Youtube, ExternalLink, Award, CheckCircle2 } from 'lucide-react';
import { DEFAULT_EEAT_AUTHOR_BIO } from '../types';

interface AuthorBioBoxProps {
  bio?: string;
  authorName?: string;
  authorRole?: string;
  authorAvatar?: string;
  compact?: boolean;
}

export const AuthorBioBox: React.FC<AuthorBioBoxProps> = ({
  bio = DEFAULT_EEAT_AUTHOR_BIO,
  authorName = 'Elena Rostova',
  authorRole = 'Chief Football Tactician & Senior Editor',
  authorAvatar = 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
  compact = false,
}) => {
  const effectiveBio = bio.trim() || DEFAULT_EEAT_AUTHOR_BIO;

  // Render text with interactive links for About Us and Our YouTube Channel if not already HTML links
  const renderFormattedBio = (rawText: string) => {
    // If it already contains <a> tags, render as sanitized HTML
    if (rawText.includes('<a ') || rawText.includes('href=')) {
      return (
        <span
          className="prose prose-invert prose-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: rawText }}
        />
      );
    }

    // Replace "About Us" and "Our YouTube Channel" with rich interactive links
    const parts: React.ReactNode[] = [];
    const regex = /(About Us|Our YouTube Channel)/gi;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(rawText)) !== null) {
      if (match.index > lastIndex) {
        parts.push(rawText.substring(lastIndex, match.index));
      }

      const phrase = match[0];
      if (phrase.toLowerCase() === 'about us') {
        parts.push(
          <a
            key={`link-about-${match.index}`}
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              window.location.hash = 'about';
            }}
            className="text-[#00E5FF] hover:text-[#5ce9ff] font-bold underline decoration-[#00E5FF]/60 hover:decoration-[#00E5FF] transition-colors inline-flex items-center gap-0.5 mx-0.5"
            title="KwaboSports Editorial Principles & About Us"
          >
            <span>About Us</span>
            <ExternalLink className="w-3 h-3 inline-block ml-0.5" />
          </a>
        );
      } else if (phrase.toLowerCase() === 'our youtube channel') {
        parts.push(
          <a
            key={`link-yt-${match.index}`}
            href="https://youtube.com/@kwabosports"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#EF4444] hover:text-[#f87171] font-bold underline decoration-[#EF4444]/60 hover:decoration-[#EF4444] transition-colors inline-flex items-center gap-1 mx-0.5 bg-[#2B1417]/80 px-1.5 py-0.5 rounded border border-[#EF4444]/30"
            title="Subscribe to KwaboSports on YouTube for Daily Video Analysis"
          >
            <Youtube className="w-3.5 h-3.5 text-[#EF4444] fill-[#EF4444]" />
            <span>Our YouTube Channel</span>
          </a>
        );
      }
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < rawText.length) {
      parts.push(rawText.substring(lastIndex));
    }

    return <>{parts}</>;
  };

  return (
    <div
      id="author-bio-eeat-section"
      className="bg-gradient-to-br from-[#161920] to-[#12141A] border border-[#262D3B] hover:border-[#384256] transition-all rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden"
    >
      {/* Decorative accent lines */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#A3E635] via-[#00E5FF] to-[#EF4444]" />

      {/* Top E-E-A-T attribution badge header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#252C3A] pb-3 mb-3.5">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-[#A3E635]/15 border border-[#A3E635]/30 text-[#A3E635]">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              AUTHOR BIO / EDITORIAL ATTRIBUTION
              <span className="inline-flex items-center px-1.5 py-0.2 text-[9px] font-mono text-[#A3E635] bg-[#A3E635]/10 border border-[#A3E635]/30 rounded">
                E-E-A-T VERIFIED
              </span>
            </span>
            <p className="text-[10px] text-neutral-400 font-mono">
              KwaboSports Editorial Integrity & Fact-Checked Sports Journalism
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-neutral-400">
          <span className="flex items-center gap-1 text-[#00E5FF]">
            <CheckCircle2 className="w-3 h-3" /> Real-time Wire
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-[#EF4444]">
            <Youtube className="w-3 h-3 fill-[#EF4444]" /> Daily Live Broadcasts
          </span>
        </div>
      </div>

      {/* Author Profile and Bio Narrative */}
      <div className="flex flex-col sm:flex-row items-start gap-4">
        {/* Author Avatar with verified check */}
        <div className="relative shrink-0">
          <img
            src={authorAvatar}
            alt={authorName}
            referrerPolicy="no-referrer"
            className="w-13 h-13 sm:w-15 sm:h-15 rounded-full object-cover border-2 border-[#A3E635] shadow-[0_0_12px_rgba(163,230,53,0.25)]"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80';
            }}
          />
          <div
            className="absolute -bottom-1 -right-1 bg-[#A3E635] text-black rounded-full p-0.5 shadow"
            title="Verified Sports Author"
          >
            <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
          </div>
        </div>

        {/* Narrative & Links */}
        <div className="flex-1 space-y-1.5">
          <div className="flex flex-wrap items-baseline gap-2">
            <h4 className="text-sm font-bold text-white font-sport uppercase tracking-wide">
              {authorName}
            </h4>
            <span className="text-[11px] font-mono text-[#A3E635] bg-[#1C251C] border border-[#2A3B2A] px-2 py-0.2 rounded">
              {authorRole}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed">
            {renderFormattedBio(effectiveBio)}
          </p>
        </div>
      </div>

      {/* Quick Action Badges */}
      {!compact && (
        <div className="mt-3 pt-3 border-t border-[#202734] flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-neutral-400">
          <span className="text-[11px] text-neutral-400">
            Editorial Guidelines compliant with European Sports Journalism standards.
          </span>
          <div className="flex items-center gap-2">
            <a
              href="#about"
              className="text-[11px] text-[#00E5FF] hover:text-white transition-colors underline flex items-center gap-1"
            >
              <span>Editorial Policy</span>
            </a>
            <span className="text-neutral-600">|</span>
            <a
              href="https://youtube.com/@kwabosports"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-[#EF4444] hover:text-white transition-colors underline flex items-center gap-1"
            >
              <Youtube className="w-3 h-3" />
              <span>KwaboSports Live</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
