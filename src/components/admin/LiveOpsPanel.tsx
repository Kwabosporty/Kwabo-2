import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  RefreshCw,
  Radio,
  CheckCircle2,
  Server,
  Zap,
  Globe,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { AuditStream } from './AuditStream';
import { supabaseService } from '../../services/supabaseService';

interface LiveOpsPanelProps {
  onViewAllLogs: () => void;
  onLiveSyncSuccess?: () => void;
}

export const LiveOpsPanel: React.FC<LiveOpsPanelProps> = ({
  onViewAllLogs,
  onLiveSyncSuccess,
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);

  const handleManualSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setSyncStatus('idle');

    try {
      const result = await supabaseService.triggerLiveSportsSync();
      setLastSyncTime(result.timestamp);
      setSyncStatus('success');
      if (onLiveSyncSuccess) onLiveSyncSuccess();
      setTimeout(() => setSyncStatus('idle'), 3500);
    } catch {
      setSyncStatus('error');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="rounded-xl bg-[#121215] border border-[#27272A] p-4 flex flex-col gap-5 shadow-sm">
      {/* 1. Live Sports Feed Switch & Sync Ingestion Module */}
      <div className="rounded-lg bg-[#141417] border border-[#27272A] p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#A3E635]/15 border border-[#A3E635]/30 flex items-center justify-center">
              <Activity className="w-3.5 h-3.5 text-[#A3E635]" />
            </div>
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Live Sports Feed Engine
              </div>
              <div className="text-[10px] text-neutral-400 font-mono">
                Ingestion endpoint: <span className="text-[#A3E635]">/api/sync-sports</span>
              </div>
            </div>
          </div>

          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A3E635] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#A3E635]" />
          </span>
        </div>

        {/* Auto Sync Toggle & Status */}
        <div className="flex items-center justify-between p-2 rounded-md bg-[#0e0e11] border border-[#27272A] text-xs">
          <div className="flex items-center gap-2 text-neutral-300">
            <Globe className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-[11px] font-mono">Auto Cron Polling (60s)</span>
          </div>
          <button
            onClick={() => setAutoSyncEnabled(!autoSyncEnabled)}
            className={`w-8 h-4 rounded-full p-0.5 transition-colors ${
              autoSyncEnabled ? 'bg-[#A3E635]' : 'bg-[#27272A]'
            }`}
          >
            <div
              className={`w-3 h-3 rounded-full bg-black transition-transform ${
                autoSyncEnabled ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Manual Sync Trigger Button */}
        <button
          onClick={handleManualSync}
          disabled={isSyncing}
          className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-md ${
            isSyncing
              ? 'bg-[#18181B] text-neutral-400 border border-[#27272A] cursor-wait'
              : syncStatus === 'success'
              ? 'bg-emerald-500 text-black font-extrabold'
              : 'bg-[#A3E635] hover:bg-[#8fd624] text-black hover:shadow-[0_0_15px_rgba(163,230,53,0.3)]'
          }`}
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`}
          />
          <span>
            {isSyncing
              ? 'Fetching Provider Telemetry...'
              : syncStatus === 'success'
              ? 'Scores Synced (15 Matches)'
              : 'Trigger Live Sports Sync Now'}
          </span>
        </button>

        <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 px-0.5">
          <span>Last polled: {lastSyncTime}</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-2.5 h-2.5" /> 100% HEALTHY
          </span>
        </div>
      </div>

      {/* 2. Real-time Admin Audit Log Stream (5 latest rows) */}
      <div className="border-t border-[#27272A] pt-4">
        <AuditStream onViewAllLogs={onViewAllLogs} limit={5} />
      </div>

      {/* 3. System Telemetry & Cluster Nodes */}
      <div className="border-t border-[#27272A] pt-4 space-y-2">
        <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Server className="w-3 h-3 text-neutral-400" />
            Infrastructure Status
          </span>
          <span className="text-[#00E5FF] font-bold">EDGE NODE LON-1</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
          <div className="p-2 rounded bg-[#141417] border border-[#27272A] space-y-0.5">
            <div className="text-neutral-400">DB Latency</div>
            <div className="text-white font-bold text-xs flex items-center gap-1">
              <span>24 ms</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#A3E635]" />
            </div>
          </div>

          <div className="p-2 rounded bg-[#141417] border border-[#27272A] space-y-0.5">
            <div className="text-neutral-400">WSS Channel</div>
            <div className="text-[#00E5FF] font-bold text-xs">CONNECTED</div>
          </div>
        </div>
      </div>
    </div>
  );
};
