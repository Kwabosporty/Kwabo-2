import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { STANDINGS_DATA } from '../data/sportsData';
import { TeamBadge } from './TeamBadge';

export const LeagueHubWidget: React.FC = () => {
  const [selectedLeagueTab, setSelectedLeagueTab] = useState('Premier League');

  return (
    <div
      id="featured-league-hub-widget"
      className="bg-[#15181E] border border-[#262C38] rounded-xl p-4 sm:p-5 flex flex-col justify-between h-full"
    >
      <div>
        {/* Header Tag */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-black tracking-wider text-[#A3E635] uppercase">
            FEATURED LEAGUE HUB
          </span>
        </div>

        {/* League Title */}
        <h2 className="text-lg sm:text-xl font-black text-white tracking-tight mb-3 font-sport">
          {selectedLeagueTab}
        </h2>

        {/* Standings Table: Columns: POS, TEAM, P, MP, PTS */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-neutral-400 font-semibold border-b border-[#262C38] pb-1.5 text-[10px] tracking-wider uppercase">
                <th className="py-2 pl-1 w-10">POS</th>
                <th className="py-2">TEAM</th>
                <th className="py-2 text-center w-8">P</th>
                <th className="py-2 text-center w-8">MP</th>
                <th className="py-2 text-right pr-1 w-10">PTS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#202530]">
              {STANDINGS_DATA.map((row) => (
                <tr
                  key={row.pos}
                  className="hover:bg-[#1D222B] transition-colors group cursor-pointer"
                >
                  {/* Position + Trend indicator */}
                  <td className="py-2 pl-1 text-neutral-300 font-bold font-mono">
                    <div className="flex items-center gap-1.5">
                      <span>{row.pos}</span>
                      {row.trend === 'up' && (
                        <ArrowUp className="w-3 h-3 text-[#A3E635] stroke-[3]" />
                      )}
                      {row.trend === 'down' && (
                        <ArrowDown className="w-3 h-3 text-red-500 stroke-[3]" />
                      )}
                      {row.trend === 'same' && (
                        <Minus className="w-3 h-3 text-neutral-500" />
                      )}
                    </div>
                  </td>

                  {/* Team with badge + code */}
                  <td className="py-2">
                    <div className="flex items-center gap-2">
                      <TeamBadge code={row.code} size="xs" />
                      <span className="font-extrabold text-white tracking-wide group-hover:text-[#A3E635] transition-colors">
                        {row.code}
                      </span>
                    </div>
                  </td>

                  {/* Played */}
                  <td className="py-2 text-center text-neutral-300 font-mono">
                    {row.played}
                  </td>

                  {/* MP */}
                  <td className="py-2 text-center text-neutral-300 font-mono font-medium">
                    {row.mp}
                  </td>

                  {/* PTS */}
                  <td className="py-2 text-right pr-1 font-bold text-white font-mono text-xs">
                    {row.pts}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer link */}
      <div className="mt-3 pt-2.5 border-t border-[#22262F] flex items-center justify-between text-[11px] text-neutral-400">
        <span className="text-neutral-400">Matchday 33 of 38</span>
        <button
          onClick={() => alert('Full Table view: Premier League standings with GD, Form & Head-to-Head.')}
          className="text-[#A3E635] hover:underline font-semibold"
        >
          View Full Table →
        </button>
      </div>
    </div>
  );
};
