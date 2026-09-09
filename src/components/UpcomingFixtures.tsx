import React from 'react';
import { Calendar, Bell, Clock } from 'lucide-react';
import { UPCOMING_FIXTURES } from '../data/sportsData';
import { TeamBadge } from './TeamBadge';

export const UpcomingFixtures: React.FC = () => {
  return (
    <div id="upcoming-fixtures-section" className="w-full mt-2">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-black tracking-wider text-[#A3E635] uppercase">
            UPCOMING FIXTURES
          </span>
          <span className="text-xs text-neutral-400 font-medium">This Week&apos;s Blockbusters</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <Calendar className="w-3.5 h-3.5 text-neutral-400" />
          <span>All times UTC</span>
        </div>
      </div>

      {/* Grid / Horizontal Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {UPCOMING_FIXTURES.map((fix) => (
          <div
            key={fix.id}
            className="bg-[#15181E] hover:bg-[#1A1F27] border border-[#262C38] hover:border-[#374154] rounded-xl p-3.5 transition-all group flex flex-col justify-between"
          >
            {/* Top: Date + Competition */}
            <div className="flex items-center justify-between text-[11px] mb-2.5">
              <span className="font-bold text-[#A3E635] uppercase tracking-wider">
                {fix.date}
              </span>
              <span className="text-neutral-400 font-mono flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {fix.time}
              </span>
            </div>

            {/* Middle: Teams matchup */}
            <div className="space-y-2 my-1">
              {/* Home */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TeamBadge code={fix.homeCode} size="xs" />
                  <span className="text-xs font-bold text-white group-hover:text-[#00E5FF] transition-colors">
                    {fix.homeTeam}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-neutral-400">VS</span>
              </div>

              {/* Away */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TeamBadge code={fix.awayCode} size="xs" />
                  <span className="text-xs font-bold text-white group-hover:text-[#00E5FF] transition-colors">
                    {fix.awayTeam}
                  </span>
                </div>
                <button
                  onClick={() => alert(`Reminder set for ${fix.homeTeam} vs ${fix.awayTeam}!`)}
                  className="text-neutral-500 hover:text-[#A3E635] p-1 transition-colors"
                  title="Set match notification"
                  aria-label="Set match notification"
                >
                  <Bell className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Bottom: Tournament tag + Odds */}
            <div className="pt-2 mt-2 border-t border-[#22262F] flex items-center justify-between text-[10px] text-neutral-400">
              <span className="truncate max-w-[130px]">{fix.competition}</span>
              <span className="font-mono text-neutral-400">{fix.odds}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
