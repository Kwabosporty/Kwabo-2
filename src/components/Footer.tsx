import React from 'react';
import { Globe, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer id="kwabosports-footer" className="w-full bg-[#0E1013] border-t border-[#22262F] mt-12 py-10 px-4 lg:px-8 text-neutral-400 text-xs">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand */}
        <div className="space-y-3">
          <div className="flex items-center tracking-tighter">
            <span className="text-2xl font-black italic tracking-tighter text-[#A3E635] font-sport">
              KWABO
            </span>
            <span className="text-2xl font-black italic tracking-tighter text-white font-sport ml-0.5">
              SPORTS
            </span>
          </div>
          <p className="text-neutral-400 text-xs leading-relaxed max-w-xs">
            The definitive global sports media destination delivering real-time tactical intelligence, live score telemetry, and breaking news.
          </p>
          <div className="flex items-center gap-2 text-[11px] text-[#A3E635] font-mono">
            <span className="w-2 h-2 rounded-full bg-[#A3E635] animate-ping" />
            <span>GLOBAL DESK ACTIVE</span>
          </div>
        </div>

        {/* Channels */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-sport">Coverage Channels</h4>
          <ul className="space-y-1.5">
            <li><a href="#premier-league" className="hover:text-white transition-colors">Premier League & Champions League</a></li>
            <li><a href="#la-liga" className="hover:text-white transition-colors">La Liga & Serie A Hubs</a></li>
            <li><a href="#nba" className="hover:text-white transition-colors">NBA Court Vision & Advanced Analytics</a></li>
            <li><a href="#f1" className="hover:text-white transition-colors">Formula 1 Telemetry & GP Insights</a></li>
            <li><a href="#combat" className="hover:text-white transition-colors">UFC & Boxing Heavyweight Rankings</a></li>
          </ul>
        </div>

        {/* Content Types */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-sport">Editorial Series</h4>
          <ul className="space-y-1.5">
            <li><a href="#tactics" className="hover:text-white transition-colors">Deep Dive: Tactical Breakdown</a></li>
            <li><a href="#transfers" className="hover:text-white transition-colors">Transfer Radar: Verified Deals</a></li>
            <li><a href="#fanzone" className="hover:text-white transition-colors">Fan Zone Interactive Polls</a></li>
            <li><a href="#matchcentre" className="hover:text-white transition-colors">Live Match Centre Commentary</a></li>
            <li><a href="#audio" className="hover:text-white transition-colors">Kwabo Audio Matchday Streams</a></li>
          </ul>
        </div>

        {/* Newsletter / Passport */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-sport">Kwabo Sports Passport</h4>
          <p className="text-neutral-400 text-xs">
            Subscribe for instant score flashes and bespoke tactical debriefs direct to your inbox.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-[#1A1D24] border border-[#2B3242] rounded-lg px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#A3E635] flex-1"
            />
            <button
              onClick={() => alert('Thanks for subscribing to Kwabo Daily Insights!')}
              className="bg-[#A3E635] hover:bg-[#8fd624] text-black font-extrabold text-xs px-3 py-1.5 rounded-lg uppercase tracking-wider font-sport"
            >
              JOIN
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto pt-6 border-t border-[#1C2028] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-400">
        <div>
          © 2026 KwaboSports Media Group. All rights reserved. Ultra-modern sports analytics & coverage.
        </div>
        <div className="flex items-center gap-4">
          <a href="#privacy" className="hover:text-white">Privacy Policy</a>
          <a href="#terms" className="hover:text-white">Terms of Service</a>
          <a href="#cookies" className="hover:text-white">Cookie Settings</a>
          <a href="#editorial" className="hover:text-white">Editorial Guidelines</a>
        </div>
      </div>
    </footer>
  );
};
