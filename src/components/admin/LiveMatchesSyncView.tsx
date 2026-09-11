import React, { useState } from 'react';
import {
  Activity,
  Radio,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Database,
  ArrowUpRight,
  Clock,
  Play,
  Pause,
  Sliders,
} from 'lucide-react';
import { supabaseService } from '../../services/supabaseService';

export const LiveMatchesSyncView: React.FC = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState<string | null>(null);

  const mockLiveFeeds = [
    {
      id: 'match-1',
      league: 'Premier League',
      home: 'Arsenal',
      away: 'Chelsea',
      score: '2 - 1',
      minute: "78'",
      status: 'IN_PLAY',
      provider: 'Opta Live Stream',
      lastUpdate: '4s ago',
    },
    {
      id: 'match-2',
      league: 'La Liga',
      home: 'Real Madrid',
      away: 'Barcelona',
      score: '1 - 1',
      minute: "64'",
      status: 'IN_PLAY',
      provider: 'LaLiga Official API',
      lastUpdate: '2s ago',
    },
    {
      id: 'match-3',
      league: 'UEFA Champions League',
      home: 'Bayern Munich',
      away: 'PSG',
      score: '3 - 2',
      minute: "89'",
      status: 'IN_PLAY',
      provider: 'UEFA Telemetry',
      lastUpdate: '1s ago',
    },
    {
      id: 'match-4',
      league: 'NBA',
      home: 'Boston Celtics',
      away: 'LA Lakers',
      score: '104 - 98',
      minute: 'Q4 3:12',
      status: 'IN_PLAY',
      provider: 'Sportradar NBA',
      lastUpdate: '6s ago',
    },
  ];

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      const res = await supabaseService.triggerLiveSportsSync();
      setLastSyncResult(
        `Synced ${res.syncedMatches} matches at ${res.timestamp} successfully.`
      );
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#27272A]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold tracking-tight text-white font-sport">
              Live Matches Sync Engine
            </h2>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#A3E635]/15 text-[#A3E635] border border-[#A3E635]/30">
              <Radio className="w-3 h-3 animate-pulse" /> LIVE WSS PIPELINE
            </span>
          </div>
          <p className="text-xs text-neutral-400 font-mono">
            Control real-time score ingestion, webhooks, and ticker dispatch across football & basketball leagues.
          </p>
        </div>

        <button
          onClick={handleManualSync}
          disabled={isSyncing}
          className="flex items-center gap-2 px-4 py-2 bg-[#A3E635] hover:bg-[#8fd624] text-black font-extrabold text-xs rounded-lg uppercase tracking-wider font-mono shadow-[0_0_12px_rgba(163,230,53,0.2)] transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Syncing...' : 'Sync Provider Data Now'}</span>
        </button>
      </div>

      {lastSyncResult && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{lastSyncResult}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-xl bg-[#121215] border border-[#27272A]">
          <div className="text-xs font-mono text-neutral-400 uppercase">
            Active Monitored Matches
          </div>
          <div className="text-2xl font-bold text-white font-sport mt-1">
            4 Live Fixtures
          </div>
          <div className="text-[11px] text-[#A3E635] font-mono mt-1">
            4/4 feeds connected
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#121215] border border-[#27272A]">
          <div className="text-xs font-mono text-neutral-400 uppercase">
            Ingestion Latency
          </div>
          <div className="text-2xl font-bold text-white font-sport mt-1">
            180ms
          </div>
          <div className="text-[11px] text-emerald-400 font-mono mt-1">
            Real-time WebSocket streaming
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#121215] border border-[#27272A]">
          <div className="text-xs font-mono text-neutral-400 uppercase">
            Ticker Sync State
          </div>
          <div className="text-2xl font-bold text-white font-sport mt-1">
            Broadcasting
          </div>
          <div className="text-[11px] text-[#00E5FF] font-mono mt-1">
            Global header ticker receiving updates
          </div>
        </div>
      </div>

      {/* Live Active Matches Table */}
      <div className="rounded-xl bg-[#121215] border border-[#27272A] overflow-hidden">
        <div className="p-4 border-b border-[#27272A] flex items-center justify-between bg-[#0e0e11]">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#A3E635]" />
            <h3 className="text-xs font-mono font-bold uppercase text-white tracking-wider">
              Active Ingested Live Scoreboards
            </h3>
          </div>
          <span className="text-[11px] font-mono text-neutral-400">
            Auto-polling every 10s
          </span>
        </div>

        <div className="divide-y divide-[#27272A]/70 text-xs">
          {mockLiveFeeds.map((match) => (
            <div
              key={match.id}
              className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 hover:bg-[#18181B]/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="inline-block w-2 h-2 rounded-full bg-[#A3E635] animate-ping" />
                <div>
                  <div className="text-[11px] font-mono text-neutral-400 uppercase">
                    {match.league}
                  </div>
                  <div className="text-sm font-bold text-white font-sport flex items-center gap-2">
                    <span>{match.home}</span>
                    <span className="text-[#A3E635] bg-[#18181B] px-2 py-0.5 rounded border border-[#27272A]">
                      {match.score}
                    </span>
                    <span>{match.away}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-[11px] font-mono text-neutral-400">
                <span className="text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                  {match.minute}
                </span>
                <span>{match.provider}</span>
                <span className="text-neutral-400">{match.lastUpdate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
