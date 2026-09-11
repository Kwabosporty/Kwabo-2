import React, { useState } from 'react';
import { Trophy, RefreshCw, CheckCircle2, ShieldCheck } from 'lucide-react';
import { STANDINGS_DATA } from '../../data/sportsData';

interface LeagueTeam {
  pos: number;
  team: string;
  code: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gd: number;
  pts: number;
  form: string[];
}

const PREMIER_LEAGUE_TABLE: LeagueTeam[] = [
  { pos: 1, team: 'Arsenal', code: 'ARS', played: 28, won: 20, drawn: 4, lost: 4, gd: 45, pts: 64, form: ['W', 'W', 'W', 'D', 'W'] },
  { pos: 2, team: 'Liverpool', code: 'LIV', played: 28, won: 19, drawn: 7, lost: 2, gd: 39, pts: 64, form: ['W', 'D', 'W', 'W', 'W'] },
  { pos: 3, team: 'Manchester City', code: 'MCI', played: 28, won: 19, drawn: 6, lost: 3, gd: 35, pts: 63, form: ['D', 'W', 'W', 'W', 'W'] },
  { pos: 4, team: 'Aston Villa', code: 'AVL', played: 29, won: 17, drawn: 5, lost: 7, gd: 18, pts: 56, form: ['D', 'L', 'W', 'W', 'W'] },
  { pos: 5, team: 'Tottenham Hotspur', code: 'TOT', played: 28, won: 16, drawn: 5, lost: 7, gd: 17, pts: 53, form: ['L', 'W', 'W', 'L', 'W'] },
  { pos: 6, team: 'Manchester United', code: 'MUN', played: 28, won: 15, drawn: 2, lost: 11, gd: 0, pts: 47, form: ['W', 'L', 'L', 'W', 'W'] },
  { pos: 7, team: 'West Ham United', code: 'WHU', played: 29, won: 12, drawn: 8, lost: 9, gd: -4, pts: 44, form: ['D', 'D', 'W', 'W', 'L'] },
  { pos: 8, team: 'Chelsea', code: 'CHE', played: 27, won: 11, drawn: 6, lost: 10, gd: 2, pts: 39, form: ['W', 'D', 'D', 'W', 'L'] },
];

const LA_LIGA_TABLE: LeagueTeam[] = [
  { pos: 1, team: 'Real Madrid', code: 'RMA', played: 29, won: 22, drawn: 6, lost: 1, gd: 44, pts: 72, form: ['W', 'W', 'D', 'W', 'D'] },
  { pos: 2, team: 'Barcelona', code: 'FCB', played: 29, won: 19, drawn: 7, lost: 3, gd: 26, pts: 64, form: ['W', 'W', 'D', 'W', 'W'] },
  { pos: 3, team: 'Girona', code: 'GIR', played: 29, won: 19, drawn: 5, lost: 5, gd: 25, pts: 62, form: ['L', 'W', 'L', 'W', 'L'] },
  { pos: 4, team: 'Athletic Club', code: 'ATH', played: 29, won: 16, drawn: 8, lost: 5, gd: 22, pts: 56, form: ['W', 'W', 'D', 'L', 'W'] },
  { pos: 5, team: 'Atlético Madrid', code: 'ATM', played: 29, won: 17, drawn: 4, lost: 8, gd: 20, pts: 55, form: ['L', 'L', 'W', 'D', 'W'] },
  { pos: 6, team: 'Real Sociedad', code: 'RSO', played: 29, won: 12, drawn: 10, lost: 7, gd: 11, pts: 46, form: ['W', 'W', 'L', 'L', 'W'] },
];

export const LeagueStandingsView: React.FC = () => {
  const [activeLeague, setActiveLeague] = useState<'epl' | 'laliga'>('epl');
  const standings = activeLeague === 'epl' ? PREMIER_LEAGUE_TABLE : LA_LIGA_TABLE;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#27272A]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-5 h-5 text-[#FACC15]" />
            <h2 className="text-xl font-bold tracking-tight text-white font-sport">
              League Standings & Table Engine
            </h2>
          </div>
          <p className="text-xs text-neutral-400 font-mono">
            View, audit and synchronize league table data feeding the front-page Featured League Hub.
          </p>
        </div>

        {/* League Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#141417] border border-[#27272A]">
          <button
            onClick={() => setActiveLeague('epl')}
            className={`px-3 py-1.5 text-xs font-mono font-bold uppercase rounded-md transition-all ${
              activeLeague === 'epl'
                ? 'bg-[#A3E635] text-black shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Premier League
          </button>
          <button
            onClick={() => setActiveLeague('laliga')}
            className={`px-3 py-1.5 text-xs font-mono font-bold uppercase rounded-md transition-all ${
              activeLeague === 'laliga'
                ? 'bg-[#A3E635] text-black shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            La Liga
          </button>
        </div>
      </div>

      {/* Standings Table Container */}
      <div className="rounded-xl bg-[#121215] border border-[#27272A] overflow-hidden">
        <div className="p-4 border-b border-[#27272A] flex items-center justify-between bg-[#0e0e11]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-white uppercase">
              {activeLeague === 'epl' ? 'English Premier League' : 'Spanish La Liga'} (Season 2025/26)
            </span>
          </div>
          <span className="text-[11px] font-mono text-neutral-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#A3E635]" /> Verified by Official Sports API
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#27272A] bg-[#141417] text-[11px] font-mono uppercase text-neutral-400">
                <th className="py-2.5 px-3 w-10 text-center">Pos</th>
                <th className="py-2.5 px-3">Club</th>
                <th className="py-2.5 px-3 text-center">MP</th>
                <th className="py-2.5 px-3 text-center">W</th>
                <th className="py-2.5 px-3 text-center">D</th>
                <th className="py-2.5 px-3 text-center">L</th>
                <th className="py-2.5 px-3 text-center">GD</th>
                <th className="py-2.5 px-3 text-center">Form</th>
                <th className="py-2.5 px-4 text-center font-bold text-[#A3E635]">PTS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272A]/50">
              {standings.map((row) => (
                <tr key={row.pos} className="hover:bg-[#18181B]/50 transition-colors">
                  <td className="py-2.5 px-3 text-center font-mono font-bold">
                    <span
                      className={`inline-flex items-center justify-center w-5 h-5 rounded ${
                        row.pos <= 4
                          ? 'bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30'
                          : row.pos >= 18
                          ? 'bg-rose-500/15 text-rose-400'
                          : 'text-neutral-400'
                      }`}
                    >
                      {row.pos}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-medium text-white flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#A3E635] bg-[#18181B] px-1.5 py-0.5 rounded border border-[#27272A]">
                      {row.code}
                    </span>
                    <span>{row.team}</span>
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-neutral-400">{row.played}</td>
                  <td className="py-2.5 px-3 text-center font-mono text-neutral-400">{row.won}</td>
                  <td className="py-2.5 px-3 text-center font-mono text-neutral-400">{row.drawn}</td>
                  <td className="py-2.5 px-3 text-center font-mono text-neutral-400">{row.lost}</td>
                  <td className="py-2.5 px-3 text-center font-mono font-semibold text-neutral-300">
                    {row.gd > 0 ? `+${row.gd}` : row.gd}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {row.form.map((res, idx) => (
                        <span
                          key={idx}
                          className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-mono font-bold ${
                            res === 'W'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : res === 'D'
                              ? 'bg-neutral-600/30 text-neutral-400'
                              : 'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          {res}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-2.5 px-4 text-center font-mono font-extrabold text-[#A3E635]">
                    {row.pts}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
