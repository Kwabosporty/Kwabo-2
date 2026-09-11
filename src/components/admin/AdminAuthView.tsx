import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  ArrowRight,
  Sparkles,
  Zap,
  ChevronLeft,
} from 'lucide-react';
import { AdminProfile } from '../../types';

interface AdminAuthViewProps {
  onLoginSuccess: (user: AdminProfile) => void;
  onViewPublicSite: () => void;
  onLogin: (email: string, pass: string) => Promise<AdminProfile>;
  onSignup: (data: { email: string; fullName: string; username: string; password?: string }) => Promise<AdminProfile>;
}

export const AdminAuthView: React.FC<AdminAuthViewProps> = ({
  onLoginSuccess,
  onViewPublicSite,
  onLogin,
  onSignup,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('elena.rostova@kwabosports.com');
  const [password, setPassword] = useState('••••••••••••');
  const [fullName, setFullName] = useState('Elena Rostova');
  const [username, setUsername] = useState('erostova');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      if (mode === 'login') {
        const profile = await onLogin(email, password);
        onLoginSuccess(profile);
      } else {
        const profile = await onSignup({
          email,
          fullName,
          username,
          password,
        });
        onLoginSuccess(profile);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSuperAdmin = async () => {
    setIsLoading(true);
    try {
      const profile = await onLogin('elena.rostova@kwabosports.com', 'adminpass');
      onLoginSuccess(profile);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="admin-auth-screen"
      className="relative min-h-screen w-full flex items-center justify-center p-4 bg-[#0A0C0F] select-none overflow-hidden"
    >
      {/* Blurred Stadium Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1600&auto=format&fit=crop&q=80"
          alt="Stadium Atmosphere"
          className="w-full h-full object-cover filter blur-md scale-105 opacity-25 brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C0F] via-[#0A0C0F]/85 to-[#0A0C0F]/90" />
      </div>

      {/* Back to Live Site button */}
      <button
        onClick={onViewPublicSite}
        className="absolute top-6 left-6 z-20 flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white bg-[#161920]/80 backdrop-blur-md border border-[#272E3B] px-3.5 py-2 rounded-xl transition-colors font-mono"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Return to KwaboSports Public Site</span>
      </button>

      {/* Centered Modal Card */}
      <div className="relative z-10 w-full max-w-md bg-[#161920]/95 backdrop-blur-xl border border-[#293242] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Brand & Security Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center tracking-tighter">
            <span className="text-2xl sm:text-3xl font-black italic tracking-tighter text-[#A3E635] font-sport">
              KWABO
            </span>
            <span className="text-2xl sm:text-3xl font-black italic tracking-tighter text-white font-sport ml-0.5">
              SPORTS
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1E2E1E] border border-[#A3E635]/40 text-[#A3E635] text-xs font-mono font-bold shadow-[0_0_12px_rgba(163,230,53,0.2)]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#A3E635]" />
            <span>SUPER_ADMIN ACCESS GATEWAY</span>
          </div>

          <p className="text-xs text-neutral-400 max-w-xs mx-auto">
            Authorized sports editorial management with Supabase Auth & role enforcement.
          </p>
        </div>

        {/* Tab Switcher: Sign In vs Sign Up */}
        <div className="flex bg-[#101217] p-1 rounded-xl border border-[#232936]">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 text-xs font-bold py-2 rounded-lg transition-all uppercase tracking-wider font-sport ${
              mode === 'login'
                ? 'bg-[#1C212B] text-[#A3E635] shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Admin Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 text-xs font-bold py-2 rounded-lg transition-all uppercase tracking-wider font-sport ${
              mode === 'signup'
                ? 'bg-[#1C212B] text-[#00E5FF] shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Create Admin
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 bg-[#EF4444]/15 border border-[#EF4444]/30 rounded-xl text-xs text-[#EF4444] font-medium">
            {errorMsg}
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <>
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-neutral-300 uppercase">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Elena Rostova"
                    className="w-full bg-[#101217] border border-[#262C38] focus:border-[#A3E635] text-xs text-white rounded-xl pl-9 pr-3 py-2.5 outline-none font-sans"
                  />
                </div>
              </div>

              {/* Username */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-neutral-300 uppercase">
                  Staff Username
                </label>
                <div className="relative">
                  <span className="text-neutral-500 font-mono text-xs absolute left-3 top-1/2 -translate-y-1/2">
                    @
                  </span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="erostova"
                    className="w-full bg-[#101217] border border-[#262C38] focus:border-[#A3E635] text-xs text-white rounded-xl pl-9 pr-3 py-2.5 outline-none font-mono"
                  />
                </div>
              </div>
            </>
          )}

          {/* Email Address */}
          <div className="space-y-1">
            <label className="text-xs font-mono text-neutral-300 uppercase">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@kwabosports.com"
                className="w-full bg-[#101217] border border-[#262C38] focus:border-[#A3E635] text-xs text-white rounded-xl pl-9 pr-3 py-2.5 outline-none font-sans"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs font-mono text-neutral-300 uppercase">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#101217] border border-[#262C38] focus:border-[#A3E635] text-xs text-white rounded-xl pl-9 pr-3 py-2.5 outline-none font-mono"
              />
            </div>
          </div>

          {/* Role Claim Indicator */}
          <div className="p-2.5 rounded-xl bg-[#11141A] border border-[#242A36] text-[11px] text-neutral-400 font-mono flex items-center justify-between">
            <span>Supabase User Metadata:</span>
            <span className="text-[#A3E635] font-bold">role: &apos;SUPER_ADMIN&apos;</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#A3E635] hover:bg-[#8fd624] text-black font-black text-xs uppercase tracking-wider py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(163,230,53,0.25)] flex items-center justify-center gap-2 font-sport cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{mode === 'login' ? 'AUTHENTICATE & ENTER DASHBOARD' : 'REGISTER & INJECT SUPER_ADMIN'}</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </>
            )}
          </button>
        </form>

        {/* Fast-Track Instant Demo Super Admin Button */}
        <div className="pt-2 border-t border-[#232936]">
          <button
            type="button"
            onClick={handleQuickSuperAdmin}
            disabled={isLoading}
            className="w-full bg-[#1B202A] hover:bg-[#232A37] border border-[#2F384A] hover:border-[#00E5FF] text-[#00E5FF] text-xs font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 font-mono"
          >
            <Zap className="w-3.5 h-3.5 text-[#00E5FF] fill-[#00E5FF]" />
            <span>Instant Demo: Launch as Super Admin</span>
          </button>
        </div>
      </div>
    </div>
  );
};
