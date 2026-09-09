import React, { useState, useEffect } from 'react';
import { Circle, AlertOctagon, RefreshCw } from 'lucide-react';
import { COMMENTARY_DATA } from '../data/sportsData';
import { TeamBadge } from './TeamBadge';
import { CommentaryItem } from '../types';

export const LiveMatchCentreWidget: React.FC = () => {
  const [activeMinute, setActiveMinute] = useState(28);
  const [commentaryList, setCommentaryList] = useState<CommentaryItem[]>(COMMENTARY_DATA);
  const [possessionRMA, setPossessionRMA] = useState(45);
  const [isSimulating, setIsSimulating] = useState(false);

  // Quick live event simulation for interactivity
  const handleAddLiveEvent = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const newMin = activeMinute + 2;
      setActiveMinute(newMin);
      const newComment: CommentaryItem = {
        id: `c-sim-${Date.now()}`,
        minute: `${newMin}'`,
        type: 'general',
        text: `Dangerous counter-attack! Bellingham delivers a piercing through-ball into the box.`,
        highlight: true,
      };
      setCommentaryList([newComment, ...commentaryList.slice(0, 4)]);
      setPossessionRMA(Math.min(58, Math.max(40, possessionRMA + (Math.random() > 0.5 ? 2 : -2))));
      setIsSimulating(false);
    }, 400);
  };

  const possessionFCB = 100 - possessionRMA;

  return (
    <div
      id="live-match-centre-widget"
      className="bg-[#15181E] border border-[#262C38] rounded-xl p-4 sm:p-5 flex flex-col justify-between h-full relative"
    >
      <div>
        {/* Header: Title + Widget tag */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-black tracking-wider text-[#A3E635] uppercase">
              LIVE MATCH CENTRE
            </span>
            <Circle className="w-2 h-2 fill-[#A3E635] text-[#A3E635] animate-pulse" />
          </div>
          <span className="text-[10px] text-neutral-400 font-mono uppercase bg-[#1F242E] px-2 py-0.5 rounded border border-[#2B3342]">
            Widget
          </span>
        </div>

        {/* Live Score Box */}
        <div className="bg-[#191D24] border border-[#29303D] rounded-lg p-3 text-center mb-3">
          <div className="flex items-center justify-between gap-2 px-1">
            {/* Real Madrid */}
            <div className="flex items-center gap-2 flex-1 justify-end">
              <span className="font-extrabold text-xs sm:text-sm text-white tracking-wide">
                REAL MADRID
              </span>
              <TeamBadge code="RMA" size="sm" />
            </div>

            {/* Score */}
            <div className="px-2 sm:px-3 text-center shrink-0">
              <div className="text-xl sm:text-2xl font-black text-[#00E5FF] tracking-tight font-sport">
                0 - 0
              </div>
              <div className="text-[11px] font-mono text-neutral-400">
                {activeMinute}&apos;
              </div>
            </div>

            {/* FC Barcelona */}
            <div className="flex items-center gap-2 flex-1 justify-start">
              <TeamBadge code="FCB" size="sm" />
              <span className="font-extrabold text-xs sm:text-sm text-white tracking-wide">
                FC BARCELONA
              </span>
            </div>
          </div>

          {/* Game events badge */}
          <div className="mt-2 pt-2 border-t border-[#252C38] flex items-center justify-center gap-1.5">
            <span className="inline-flex items-center gap-1 bg-red-950/70 border border-red-800/80 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded">
              <AlertOctagon className="w-3 h-3 text-red-500 fill-red-500/30" />
              RED CARD (15&apos;)
            </span>
          </div>
        </div>

        {/* Interactive Visuals: Stylized possession bar (45% | 55%) */}
        <div className="space-y-1.5 mb-3.5">
          <div className="flex items-center justify-between text-xs font-mono font-bold">
            <span className="text-red-400">{possessionRMA}%</span>
            <span className="text-[10px] text-neutral-400 font-sans tracking-wider uppercase font-semibold">
              POSSESSION
            </span>
            <span className="text-[#00E5FF]">{possessionFCB}%</span>
          </div>

          {/* Split Colored Bar */}
          <div className="w-full h-2.5 bg-[#1F242E] rounded-full overflow-hidden flex relative">
            <div
              className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-500"
              style={{ width: `${possessionRMA}%` }}
            />
            {/* Center indicator pin */}
            <div className="w-1 h-3.5 -mt-0.5 bg-white z-10 shadow-sm" />
            <div
              className="h-full bg-gradient-to-r from-[#00E5FF] to-cyan-300 transition-all duration-500"
              style={{ width: `${possessionFCB}%` }}
            />
          </div>
        </div>

        {/* Vertical Text Commentary Timeline */}
        <div className="space-y-2 text-xs">
          {commentaryList.slice(0, 4).map((item, index) => (
            <div key={item.id} className="flex items-start gap-2 text-neutral-300 leading-snug">
              {index === 0 ? (
                <div className="w-2 h-2 rounded-full bg-[#00E5FF] mt-1.5 shrink-0 animate-ping" />
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-600 mt-1.5 shrink-0" />
              )}
              <p
                className={`text-[11px] ${
                  item.highlight
                    ? 'text-white font-medium'
                    : 'text-neutral-400'
                }`}
              >
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-3 pt-2.5 border-t border-[#22262F] flex items-center justify-between text-[11px]">
        <button
          id="simulate-match-event-btn"
          onClick={handleAddLiveEvent}
          disabled={isSimulating}
          className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-[#A3E635] font-semibold transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${isSimulating ? 'animate-spin text-[#A3E635]' : ''}`} />
          <span>Update Feed</span>
        </button>

        <span className="text-neutral-400 text-[10px]">Audio Stream: ON 🔊</span>
      </div>
    </div>
  );
};
