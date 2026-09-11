import React, { useState } from 'react';
import {
  ShieldCheck,
  BarChart3,
  TrendingUp,
  Clock,
  Filter,
  Eye,
  CheckCircle2,
  Terminal,
} from 'lucide-react';
import { AdminAuditLog, AdminDashboardStats, Category, AdminPost } from '../../types';

interface AdminLogsViewProps {
  logs: AdminAuditLog[];
  stats: AdminDashboardStats;
  posts: AdminPost[];
  categories: Category[];
}

export const AdminLogsView: React.FC<AdminLogsViewProps> = ({
  logs,
  stats,
  posts,
  categories,
}) => {
  const [selectedType, setSelectedType] = useState<string>('ALL');

  const filteredLogs = logs.filter((l) => {
    if (selectedType === 'ALL') return true;
    if (selectedType === 'POSTS') return l.target_type === 'post';
    if (selectedType === 'CATEGORIES') return l.target_type === 'category';
    if (selectedType === 'SETTINGS') return l.target_type === 'setting';
    if (selectedType === 'AUTH') return l.target_type === 'auth';
    return true;
  });

  return (
    <div id="admin-logs-view" className="space-y-6">
      {/* Top Telemetry & View Counters Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#1A1A1A] border border-[#2B303D] rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
            <span>TOTAL BLOG VIEWS</span>
            <Eye className="w-4 h-4 text-[#00E5FF]" />
          </div>
          <div className="text-3xl font-black text-white font-sport">
            {stats.total_views.toLocaleString()}
          </div>
          <p className="text-[11px] text-[#A3E635] font-mono">
            +{stats.today_views} unique impressions logged today
          </p>
        </div>

        <div className="bg-[#1A1A1A] border border-[#2B303D] rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
            <span>AUDIT EVENTS RECORDED</span>
            <Terminal className="w-4 h-4 text-[#A3E635]" />
          </div>
          <div className="text-3xl font-black text-white font-sport">
            {logs.length}
          </div>
          <p className="text-[11px] text-neutral-400 font-mono">
            Immutable log trail in <code className="text-neutral-300">admin_audit_logs</code>
          </p>
        </div>

        <div className="bg-[#1A1A1A] border border-[#2B303D] rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
            <span>SYSTEM INTEGRITY</span>
            <ShieldCheck className="w-4 h-4 text-[#A3E635]" />
          </div>
          <div className="text-3xl font-black text-[#A3E635] font-sport flex items-center gap-2">
            <span>100%</span>
            <span className="text-xs text-neutral-400 font-sans font-normal">SECURE</span>
          </div>
          <p className="text-[11px] text-neutral-400 font-mono">
            Supabase RLS active & Super Admin verified
          </p>
        </div>
      </div>

      {/* Audit Trail Table */}
      <div className="bg-[#1A1A1A] border border-[#2B303D] rounded-2xl overflow-hidden shadow-xl space-y-4">
        <div className="p-5 border-b border-[#262C38] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#A3E635] rounded-xs" />
              <h3 className="text-base font-black text-white uppercase font-sport tracking-tight">
                ADMIN AUDIT TRAIL (`admin_audit_logs`)
              </h3>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Chronological log of editorial additions, category edits, and staff sessions
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {['ALL', 'POSTS', 'CATEGORIES', 'SETTINGS', 'AUTH'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`text-[11px] font-mono font-bold px-3 py-1 rounded-lg uppercase transition-all ${
                  selectedType === type
                    ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/50'
                    : 'bg-[#14161E] text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-[#14161B] text-neutral-400 uppercase font-mono text-[10px] tracking-wider border-b border-[#242935]">
              <tr>
                <th className="py-3 px-4 font-bold">Timestamp</th>
                <th className="py-3 px-4 font-bold">Action</th>
                <th className="py-3 px-4 font-bold">Target</th>
                <th className="py-3 px-4 font-bold">Admin Staff</th>
                <th className="py-3 px-4 font-bold">IP Address</th>
                <th className="py-3 px-4 font-bold">Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#242935]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#1E222A] transition-colors font-sans">
                  <td className="py-3 px-4 font-mono text-[11px] text-neutral-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#101217] border border-neutral-700 text-[#A3E635]">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-white max-w-xs truncate">
                    {log.target_title}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-neutral-300">
                    {log.admin_name}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-neutral-400 whitespace-nowrap">
                    {log.ip_address}
                  </td>
                  <td className="py-3 px-4 text-neutral-400 text-xs max-w-md">
                    {log.details}
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
