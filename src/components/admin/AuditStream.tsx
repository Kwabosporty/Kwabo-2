import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldAlert,
  Radio,
  FileText,
  FolderPlus,
  Settings,
  UserCheck,
  Clock,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { AdminAuditLog } from '../../types';
import { supabaseService } from '../../services/supabaseService';

interface AuditStreamProps {
  initialLogs?: AdminAuditLog[];
  onViewAllLogs?: () => void;
  limit?: number;
}

export const AuditStream: React.FC<AuditStreamProps> = ({
  initialLogs,
  onViewAllLogs,
  limit = 5,
}) => {
  const [logs, setLogs] = useState<AdminAuditLog[]>(() => {
    if (initialLogs && initialLogs.length > 0) {
      return initialLogs.slice(0, limit);
    }
    return supabaseService.getAuditLogs().slice(0, limit);
  });

  const [lastPingId, setLastPingId] = useState<string | null>(null);

  // Subscribe to real-time events via supabaseService / supabase.channel
  useEffect(() => {
    const unsubscribe = supabaseService.subscribeToAuditLogs((newLog) => {
      setLogs((prev) => [newLog, ...prev.slice(0, limit - 1)]);
      setLastPingId(newLog.id);
      setTimeout(() => setLastPingId(null), 2500);
    });

    return () => {
      unsubscribe();
    };
  }, [limit]);

  const getActionBadge = (action: string) => {
    if (action.includes('PUBLISH') || action.includes('CREATED')) {
      return {
        bg: 'bg-[#A3E635]/15 text-[#A3E635] border-[#A3E635]/30',
        icon: FileText,
      };
    }
    if (action.includes('UPDATE') || action.includes('SYNC')) {
      return {
        bg: 'bg-[#00E5FF]/15 text-[#00E5FF] border-[#00E5FF]/30',
        icon: Radio,
      };
    }
    if (action.includes('DELETE') || action.includes('UNPUBLISH')) {
      return {
        bg: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
        icon: ShieldAlert,
      };
    }
    return {
      bg: 'bg-neutral-800 text-neutral-300 border-neutral-700',
      icon: Settings,
    };
  };

  const formatRelativeTime = (isoString: string) => {
    try {
      const diffSec = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
      if (diffSec < 45) return 'Just now';
      if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
      if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
      return new Date(isoString).toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return 'Recent';
    }
  };

  return (
    <div className="space-y-3">
      {/* Stream Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E5FF] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00E5FF]" />
          </span>
          <span className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider">
            Real-Time Audit Trail
          </span>
        </div>

        <span className="text-[10px] font-mono text-neutral-400">
          Listening on public:admin_audit_logs
        </span>
      </div>

      {/* Log Feed List */}
      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {logs.map((log) => {
            const badge = getActionBadge(log.action);
            const Icon = badge.icon;
            const isNewPing = lastPingId === log.id;

            return (
              <motion.div
                key={log.id}
                layout
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`p-2.5 rounded-lg border transition-all text-xs ${
                  isNewPing
                    ? 'bg-[#18181B] border-[#00E5FF] shadow-[0_0_12px_rgba(0,229,255,0.15)]'
                    : 'bg-[#141417] border-[#27272A] hover:border-neutral-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`inline-flex items-center gap-1 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase shrink-0 ${badge.bg}`}
                    >
                      <Icon className="w-2.5 h-2.5" />
                      {log.action.replace('_', ' ')}
                    </span>
                    <span className="font-semibold text-white truncate max-w-[140px] sm:max-w-[180px]">
                      {log.target_title || log.details}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-neutral-400 shrink-0 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    {formatRelativeTime(log.timestamp)}
                  </span>
                </div>

                <div className="mt-1 flex items-center justify-between text-[11px] text-neutral-400 font-mono">
                  <span className="truncate max-w-[180px]">by {log.admin_name}</span>
                  <span className="text-neutral-400">{log.ip_address}</span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {onViewAllLogs && (
        <button
          onClick={onViewAllLogs}
          className="w-full py-1.5 text-center text-xs font-mono text-neutral-400 hover:text-[#00E5FF] flex items-center justify-center gap-1 transition-colors pt-1"
        >
          <span>View Full Audit History</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};
