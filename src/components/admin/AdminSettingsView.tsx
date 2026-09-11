import React, { useState } from 'react';
import { Settings, CheckCircle2, Shield, Save, Sliders, Pin } from 'lucide-react';
import { SiteSettings, AdminPost } from '../../types';

interface AdminSettingsViewProps {
  settings: SiteSettings;
  posts: AdminPost[];
  onSaveSettings: (updates: Partial<SiteSettings>) => void;
}

export const AdminSettingsView: React.FC<AdminSettingsViewProps> = ({
  settings,
  posts,
  onSaveSettings,
}) => {
  const [tickerEnabled, setTickerEnabled] = useState(settings.score_ticker_enabled);
  const [tickerSpeed, setTickerSpeed] = useState(settings.ticker_speed);
  const [pinnedPostId, setPinnedPostId] = useState(settings.pinned_hero_post_id);
  const [maintenanceMode, setMaintenanceMode] = useState(settings.maintenance_mode);
  const [siteTitle, setSiteTitle] = useState(settings.site_title);
  const [editorialEmail, setEditorialEmail] = useState(settings.editorial_email);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      score_ticker_enabled: tickerEnabled,
      ticker_speed: tickerSpeed,
      pinned_hero_post_id: pinnedPostId,
      maintenance_mode: maintenanceMode,
      site_title: siteTitle,
      editorial_email: editorialEmail,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div id="admin-settings-view" className="max-w-4xl space-y-6">
      {/* Header Banner */}
      <div className="flex items-center justify-between border-b border-[#252B38] pb-4">
        <div>
          <h2 className="text-xl font-black text-white uppercase font-sport tracking-tight">
            SITE & EDITORIAL SETTINGS
          </h2>
          <p className="text-xs text-neutral-400 font-mono">
            Control persistent score ticker, hero overrides, and publication parameters
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 text-xs font-bold text-[#A3E635] bg-[#A3E635]/15 border border-[#A3E635]/40 px-3 py-1.5 rounded-lg animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings synced & logged!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Card 1: Score Ticker Settings */}
        <div className="bg-[#1A1A1A] border border-[#2B303D] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#242935] pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#A3E635]" />
              <h3 className="text-sm font-bold text-white uppercase font-sport tracking-wider">
                Live Match Score Ticker
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[#A3E635]">Top Sticky Bar</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">Enable Real-Time Score Ticker</div>
              <p className="text-[11px] text-neutral-400">
                Shows persistent streaming match scores across football, basketball, F1 & combat.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={tickerEnabled}
                onChange={(e) => setTickerEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#252B38] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#A3E635]" />
            </label>
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-mono text-neutral-400 uppercase">
              Ticker Animation Speed
            </label>
            <select
              value={tickerSpeed}
              onChange={(e) => setTickerSpeed(e.target.value as any)}
              className="w-full bg-[#14161D] border border-[#2B3242] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#A3E635]"
            >
              <option value="slow">Slow (Smooth reading pace)</option>
              <option value="normal">Normal (Standard broadcast speed)</option>
              <option value="fast">Fast (Rapid ticker stream)</option>
            </select>
          </div>
        </div>

        {/* Card 2: Pinned Hero Article */}
        <div className="bg-[#1A1A1A] border border-[#2B303D] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#242935] pb-3">
            <div className="flex items-center gap-2">
              <Pin className="w-4 h-4 text-[#00E5FF]" />
              <h3 className="text-sm font-bold text-white uppercase font-sport tracking-wider">
                Pinned Front-Page Hero Post
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[#00E5FF]">Homepage Bento Override</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-neutral-400 uppercase">
              Select Article to Force as Primary Lead Story
            </label>
            <select
              value={pinnedPostId}
              onChange={(e) => setPinnedPostId(e.target.value)}
              className="w-full bg-[#14161D] border border-[#2B3242] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#00E5FF]"
            >
              {posts.map((post) => (
                <option key={post.id} value={post.id}>
                  [{post.category_name}] {post.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Card 3: General Portal Metadata */}
        <div className="bg-[#1A1A1A] border border-[#2B303D] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#242935] pb-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#A3E635]" />
              <h3 className="text-sm font-bold text-white uppercase font-sport tracking-wider">
                Publication Metadata
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-neutral-400 uppercase">
                Site Title Brand
              </label>
              <input
                type="text"
                value={siteTitle}
                onChange={(e) => setSiteTitle(e.target.value)}
                className="w-full bg-[#14161D] border border-[#2B3242] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#A3E635]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-neutral-400 uppercase">
                Editorial Contact Email
              </label>
              <input
                type="email"
                value={editorialEmail}
                onChange={(e) => setEditorialEmail(e.target.value)}
                className="w-full bg-[#14161D] border border-[#2B3242] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#A3E635]"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="bg-[#A3E635] hover:bg-[#8fd624] text-black font-black text-xs uppercase tracking-wider px-8 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(163,230,53,0.3)] flex items-center gap-2 font-sport cursor-pointer"
          >
            <Save className="w-4 h-4 stroke-[3]" />
            <span>SAVE SITE CONFIGURATION</span>
          </button>
        </div>
      </form>
    </div>
  );
};
