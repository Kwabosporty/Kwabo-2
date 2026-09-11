import React, { useState } from 'react';
import { X, Lock, Mail, ShieldCheck, ArrowRight, ShieldAlert } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { AdminProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdmin?: () => void;
  onLoginAdmin?: (user: AdminProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onOpenAdmin,
  onLoginAdmin,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const user = await supabaseService.login(email, password);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        if (onLoginAdmin) {
          onLoginAdmin(user);
        } else if (onOpenAdmin) {
          onOpenAdmin();
        }
      }, 500);
    } catch (err: any) {
      if (err.message === '403_ACCESS_DENIED') {
        setErrorMsg('403 Access Denied: Admin Privileges Required.');
      } else {
        setErrorMsg(err.message || 'Invalid Credentials');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedirectToAdminLogin = () => {
    onClose();
    if (onOpenAdmin) {
      onOpenAdmin();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="auth-dialog"
        className="w-full max-w-md bg-[#09090B] border border-[#27272A] rounded-2xl shadow-2xl overflow-hidden p-6 relative"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-[#18181B]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-1 mb-2">
          <span className="text-2xl font-black italic tracking-tighter text-[#A3E635] font-sport">
            KWABO
          </span>
          <span className="text-2xl font-black italic tracking-tighter text-white font-sport">
            SPORTS
          </span>
          <span className="text-[10px] bg-[#141417] text-neutral-400 font-mono px-2 py-0.5 rounded border border-[#27272A] ml-2">
            STAFF ACCESS
          </span>
        </div>

        {/* Security Notice: Zero Public Sign-Ups */}
        <div className="mb-5 p-2.5 rounded-lg bg-[#141417] border border-[#27272A] text-[11px] font-mono text-neutral-400 flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-[#A3E635] shrink-0" />
          <span>Restricted Portal: Public sign-ups are disabled.</span>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#A3E635]/20 text-[#A3E635] flex items-center justify-center mx-auto">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white font-sport">
              Identity Verified
            </h3>
            <p className="text-xs text-neutral-400">
              Launching KwaboSports Command Center...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider font-mono">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@kwabosports.com"
                  className="w-full bg-[#141417] border border-[#27272A] rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#A3E635] font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider font-mono">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#141417] border border-[#27272A] rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#A3E635] font-mono text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-[#A3E635] hover:bg-[#8fd624] text-black font-black text-xs uppercase tracking-wider rounded-lg transition-all shadow-[0_0_15px_rgba(163,230,53,0.2)] flex items-center justify-center gap-2 font-sport cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Admin Command</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>

            {/* Dedicated /admin/login Gateway Link */}
            <div className="pt-2 border-t border-[#27272A] text-center">
              <button
                type="button"
                onClick={handleRedirectToAdminLogin}
                className="text-xs text-[#A3E635] hover:underline font-mono inline-flex items-center gap-1"
              >
                <span>Open Dedicated /admin/login Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
