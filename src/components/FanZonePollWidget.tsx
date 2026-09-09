import React, { useState } from 'react';
import { MoreHorizontal, CheckCircle2 } from 'lucide-react';
import { BALLON_DOR_POLL } from '../data/sportsData';
import { PollOption } from '../types';

export const FanZonePollWidget: React.FC = () => {
  const [pollOptions, setPollOptions] = useState<PollOption[]>(BALLON_DOR_POLL);
  const [userVotedId, setUserVotedId] = useState<string | null>('haaland');
  const [totalVotes, setTotalVotes] = useState(1000);

  const handleVote = (optionId: string) => {
    if (userVotedId === optionId) return;

    setUserVotedId(optionId);
    const newTotal = totalVotes + 1;
    setTotalVotes(newTotal);

    setPollOptions((prev) => {
      const updated = prev.map((opt) => {
        const votes = opt.id === optionId ? opt.votes + 1 : opt.votes;
        return {
          ...opt,
          votes,
        };
      });

      return updated.map((opt) => ({
        ...opt,
        percentage: Math.round((opt.votes / newTotal) * 100),
      }));
    });
  };

  return (
    <div
      id="fan-zone-poll-widget"
      className="bg-[#15181E] border border-[#262C38] rounded-xl p-4 sm:p-5 flex flex-col justify-between h-full"
    >
      <div>
        {/* Header Tag + Menu */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-black tracking-wider text-[#A3E635] uppercase">
            FAN ZONE POLL
          </span>
          <button
            aria-label="Poll options"
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Title */}
        <h2 className="text-base sm:text-lg font-black text-white tracking-tight uppercase mb-3 font-sport">
          WHO WILL WIN BALLON D&apos;OR?
        </h2>

        {/* Four player headshots row */}
        <div className="grid grid-cols-4 gap-2 mb-3.5">
          {pollOptions.map((opt) => (
            <div
              key={opt.id}
              onClick={() => handleVote(opt.id)}
              className={`flex flex-col items-center cursor-pointer group transition-transform ${
                userVotedId === opt.id ? 'scale-105' : 'hover:scale-102'
              }`}
            >
              <div
                className={`relative w-11 h-11 sm:w-13 sm:h-13 rounded-lg overflow-hidden border-2 bg-neutral-800 transition-all ${
                  userVotedId === opt.id
                    ? 'border-[#00E5FF] shadow-[0_0_12px_rgba(0,229,255,0.4)]'
                    : 'border-[#262C38] group-hover:border-neutral-500'
                }`}
              >
                <img
                  src={opt.image}
                  alt={opt.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top brightness-90"
                />
                {userVotedId === opt.id && (
                  <div className="absolute top-0.5 right-0.5 bg-[#00E5FF] rounded-full p-0.5">
                    <CheckCircle2 className="w-2.5 h-2.5 text-black stroke-[3]" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Percentage Bars */}
        <div className="space-y-2">
          {pollOptions.map((opt) => {
            const isSelected = userVotedId === opt.id;
            return (
              <button
                key={opt.id}
                id={`poll-option-${opt.id}`}
                onClick={() => handleVote(opt.id)}
                className="w-full text-left relative overflow-hidden rounded-md border border-[#282F3D] bg-[#1A1E26] hover:bg-[#202632] transition-colors p-2 flex items-center justify-between group"
              >
                {/* Background Fill Bar */}
                <div
                  className={`absolute inset-y-0 left-0 transition-all duration-500 ${
                    isSelected
                      ? 'bg-[#00E5FF] text-black'
                      : 'bg-[#27303E] group-hover:bg-[#303B4C]'
                  }`}
                  style={{ width: `${opt.percentage}%` }}
                />

                {/* Name Label */}
                <span
                  className={`relative z-10 font-bold text-xs tracking-wider uppercase font-sport transition-colors ${
                    isSelected ? 'text-black font-extrabold' : 'text-neutral-200 group-hover:text-white'
                  }`}
                >
                  {opt.name}
                </span>

                {/* Percentage */}
                <span
                  className={`relative z-10 font-mono text-xs font-bold ${
                    isSelected ? 'text-black' : 'text-neutral-400 group-hover:text-neutral-200'
                  }`}
                >
                  ({opt.percentage}%)
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-3 pt-2.5 border-t border-[#22262F] flex items-center justify-between text-[10px] text-neutral-400 font-mono">
        <span>{totalVotes.toLocaleString()} votes cast</span>
        <span className="text-[#A3E635]">Live voting open</span>
      </div>
    </div>
  );
};
