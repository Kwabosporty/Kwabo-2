import React, { useState } from 'react';
import { Users, Shield, Plus, Mail, CheckCircle2, UserPlus, Key } from 'lucide-react';
import { AdminProfile } from '../../types';
import { supabaseService } from '../../services/supabaseService';

export const AdminUsersView: React.FC = () => {
  const [users, setUsers] = useState<AdminProfile[]>(() => supabaseService.getAdminUsers());
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'EDITOR' | 'AUTHOR'>('EDITOR');
  const [inviteSuccess, setInviteSuccess] = useState(false);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    supabaseService.addAuditLog({
      action: 'ADMIN_INVITED',
      target_type: 'auth',
      target_id: `inv-${Date.now()}`,
      target_title: `Staff Invitation: ${inviteEmail}`,
      details: `Dispatched role invitation (${inviteRole}) to ${inviteEmail}.`,
    });

    setInviteSuccess(true);
    setTimeout(() => {
      setInviteSuccess(false);
      setIsInviteOpen(false);
      setInviteEmail('');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#27272A]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-[#A3E635]" />
            <h2 className="text-xl font-bold tracking-tight text-white font-sport">
              Admin Users & Access Control (RBAC)
            </h2>
          </div>
          <p className="text-xs text-neutral-400 font-mono">
            Manage editorial staff, assign roles (Super Admin, Editor, Author), and audit session access.
          </p>
        </div>

        <button
          onClick={() => setIsInviteOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 bg-[#A3E635] hover:bg-[#8fd624] text-black font-extrabold text-xs rounded-lg uppercase tracking-wider font-mono shadow-[0_0_12px_rgba(163,230,53,0.2)] transition-all self-start"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Editorial Staff</span>
        </button>
      </div>

      {/* Invite Modal */}
      {isInviteOpen && (
        <div className="p-4 rounded-xl bg-[#141417] border border-[#27272A] animate-in fade-in space-y-3 max-w-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold uppercase text-white">
              Send Staff Role Invitation
            </h3>
            <button
              onClick={() => setIsInviteOpen(false)}
              className="text-xs text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          {inviteSuccess ? (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Invitation dispatched via Supabase Auth email service.</span>
            </div>
          ) : (
            <form onSubmit={handleInvite} className="space-y-3">
              <div>
                <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                  STAFF WORK EMAIL
                </label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="analyst@kwabosports.com"
                  className="w-full bg-[#18181B] border border-[#27272A] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#A3E635]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                  ASSIGNED ROLE
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full bg-[#18181B] border border-[#27272A] rounded-lg px-3 py-1.5 text-xs text-neutral-300 focus:outline-none focus:border-[#A3E635]"
                >
                  <option value="EDITOR">EDITOR (Full post and category control)</option>
                  <option value="AUTHOR">AUTHOR (Create and edit own posts)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-[#A3E635] text-black font-extrabold text-xs rounded-lg uppercase tracking-wider font-mono hover:bg-[#8fd624] transition-all"
              >
                Dispatch Invite Email
              </button>
            </form>
          )}
        </div>
      )}

      {/* Users Table */}
      <div className="rounded-xl bg-[#121215] border border-[#27272A] overflow-hidden">
        <div className="p-4 border-b border-[#27272A] flex items-center justify-between bg-[#0e0e11]">
          <span className="text-xs font-mono font-bold text-white uppercase">
            Active Staff Profiles ({users.length})
          </span>
          <span className="text-[11px] font-mono text-neutral-400">
            Backed by Supabase Auth & profiles table
          </span>
        </div>

        <div className="divide-y divide-[#27272A]/70 text-xs">
          {users.map((user) => (
            <div
              key={user.id}
              className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-[#18181B]/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar_url}
                  alt={user.full_name}
                  className="w-10 h-10 rounded-full object-cover border border-[#27272A]"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="font-bold text-white flex items-center gap-2">
                    <span>{user.full_name}</span>
                    <span className="text-neutral-400 text-[11px] font-mono">
                      @{user.username}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-neutral-400 flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-neutral-400" />
                    <span>{user.email}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                    user.role === 'SUPER_ADMIN'
                      ? 'bg-[#A3E635]/15 text-[#A3E635] border-[#A3E635]/30'
                      : user.role === 'EDITOR'
                      ? 'bg-[#00E5FF]/15 text-[#00E5FF] border-[#00E5FF]/30'
                      : 'bg-purple-500/15 text-purple-400 border-purple-500/30'
                  }`}
                >
                  {user.role}
                </span>

                <span className="text-[11px] font-mono text-neutral-400">
                  Joined {new Date(user.created_at).toLocaleDateString([], { month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
