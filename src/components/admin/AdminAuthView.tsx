import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AlertTriangle,
  CheckCircle2,
  X,
  ArrowRight,
  ShieldAlert,
  Loader2,
  ChevronLeft,
} from 'lucide-react';
import { supabase } from '../../services/supabaseService';
import { AdminProfile } from '../../types';

interface ToastState {
  id: string;
  type: 'error' | 'success';
  message: string;
}

export interface AdminAuthViewProps {
  onLoginSuccess: (user: AdminProfile) => void;
  onViewPublicSite?: () => void;
  onLogin?: (email: string, pass: string) => Promise<AdminProfile>;
  onRegister?: (email: string, pass: string) => Promise<AdminProfile>;
  initialError?: string | null;
  initialMode?: 'login' | 'register';
}

export const AdminAuthView: React.FC<AdminAuthViewProps> = ({
  onLoginSuccess,
  onViewPublicSite,
  onLogin,
  onRegister,
  initialError,
  initialMode = 'login',
}) => {
  // Mode state: 'login' | 'register'
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState<ToastState[]>(() => {
    if (initialError) {
      return [
        {
          id: 'initial-error',
          type: 'error',
          message: initialError,
        },
      ];
    }
    return [];
  });

  const addToast = (type: 'error' | 'success', message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // 1. Validate Form Fields
  const validateInputs = (): boolean => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      addToast('error', 'Invalid email or password');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      addToast('error', 'Please enter a valid email address');
      return false;
    }

    if (trimmedPassword.length < 6) {
      addToast('error', 'Password must be at least 6 characters');
      return false;
    }

    return true;
  };

  // 2. Handle Login Submission
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInputs()) return;

    setIsLoading(true);
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    try {
      // Step A: Attempt Supabase Auth signInWithPassword if client configured
      if (supabase) {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: trimmedEmail,
            password: trimmedPassword,
          });

          if (error) {
            throw new Error(error.message || 'Invalid email or password');
          }

          if (data.user) {
            // Step B: Verify role in public.profiles table
            const { data: profile, error: profileErr } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();

            const role = profile?.role || data.user.user_metadata?.role;

            // If role is NOT SUPER_ADMIN or EDITOR, sign out immediately and deny
            if (role !== 'SUPER_ADMIN' && role !== 'EDITOR') {
              await supabase.auth.signOut();
              throw new Error('Access Denied: Admin Privileges Required');
            }

            const verifiedUser: AdminProfile = {
              id: data.user.id,
              email: data.user.email || trimmedEmail,
              username: profile?.username || trimmedEmail.split('@')[0],
              full_name: profile?.full_name || 'Admin User',
              role: role,
              avatar_url: profile?.avatar_url || 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
              created_at: data.user.created_at,
            };

            addToast('success', 'Sign in verified. Redirecting to dashboard...');
            setTimeout(() => {
              onLoginSuccess(verifiedUser);
              window.location.hash = 'admin/dashboard';
            }, 600);
            return;
          }
        } catch (supabaseErr: any) {
          if (supabaseErr.message === 'Access Denied: Admin Privileges Required') {
            throw supabaseErr;
          }
          // If network / fetch error and onLogin fallback is available, pass through
          if (!onLogin) {
            throw supabaseErr;
          }
        }
      }

      // Step C: Fallback to delegated service onLogin
      if (onLogin) {
        const profile = await onLogin(trimmedEmail, trimmedPassword);
        if (profile.role !== 'SUPER_ADMIN' && profile.role !== 'EDITOR') {
          throw new Error('Access Denied: Admin Privileges Required');
        }
        addToast('success', 'Sign in verified. Redirecting to dashboard...');
        setTimeout(() => {
          onLoginSuccess(profile);
          window.location.hash = 'admin/dashboard';
        }, 600);
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (err: any) {
      const msg = err.message || 'Invalid email or password';
      if (msg.includes('Access Denied') || msg === '403_ACCESS_DENIED') {
        addToast('error', 'Access Denied: Admin Privileges Required');
      } else {
        addToast('error', msg.includes('Invalid') ? msg : 'Invalid email or password');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Handle Registration Submission
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInputs()) return;

    setIsLoading(true);
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    try {
      // Step A: Attempt Supabase Auth signUp with SUPER_ADMIN role metadata
      if (supabase) {
        try {
          const { data, error } = await supabase.auth.signUp({
            email: trimmedEmail,
            password: trimmedPassword,
            options: {
              data: {
                role: 'SUPER_ADMIN',
                full_name: trimmedEmail.split('@')[0],
              },
            },
          });

          if (error) {
            throw new Error(error.message || 'Registration failed');
          }

          if (data.user) {
            // Trigger public.handle_new_user() in Supabase
            try {
              await supabase.rpc('handle_new_user');
            } catch {
              // May trigger automatically on auth.users insert
            }

            // Save profile details into public.profiles table as SUPER_ADMIN
            try {
              await supabase.from('profiles').upsert({
                id: data.user.id,
                email: trimmedEmail,
                role: 'SUPER_ADMIN',
                full_name: trimmedEmail.split('@')[0],
                username: trimmedEmail.split('@')[0],
                created_at: new Date().toISOString(),
              });
            } catch {
              // Handled by trigger
            }

            const newAdmin: AdminProfile = {
              id: data.user.id,
              email: trimmedEmail,
              username: trimmedEmail.split('@')[0],
              full_name: trimmedEmail.split('@')[0] || 'Super Admin',
              role: 'SUPER_ADMIN',
              avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
              created_at: new Date().toISOString(),
            };

            addToast('success', 'Admin account created successfully.');
            setTimeout(() => {
              onLoginSuccess(newAdmin);
              window.location.hash = 'admin/dashboard';
            }, 600);
            return;
          }
        } catch (supabaseErr: any) {
          if (!onRegister) {
            throw supabaseErr;
          }
        }
      }

      // Step B: Fallback to delegated service onRegister
      if (onRegister) {
        const newAdmin = await onRegister(trimmedEmail, trimmedPassword);
        addToast('success', 'Admin account created successfully.');
        setTimeout(() => {
          onLoginSuccess(newAdmin);
          window.location.hash = 'admin/dashboard';
        }, 600);
      } else {
        throw new Error('Registration failed');
      }
    } catch (err: any) {
      addToast('error', err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="admin-auth-screen"
      className="min-h-screen w-full flex items-center justify-center p-4 bg-[#09090B] text-white selection:bg-[#A3E635] selection:text-black font-sans relative"
    >
      {/* Return to Public Site Link */}
      {onViewPublicSite && (
        <button
          onClick={onViewPublicSite}
          className="absolute top-6 left-6 z-20 flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Return to Site</span>
        </button>
      )}

      {/* Floating Error/Success Toasts (Top Right) */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto p-3 rounded-xl border shadow-xl flex items-center justify-between gap-3 text-xs ${
                toast.type === 'error'
                  ? 'bg-[#1C1316] border-red-500/40 text-red-200'
                  : 'bg-[#131C16] border-[#A3E635]/40 text-[#A3E635]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {toast.type === 'error' ? (
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-[#A3E635] shrink-0" />
                )}
                <span className="font-medium">{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-neutral-400 hover:text-white p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Center Auth Card: Modern Dark Mode (#18181B surface, #27272A border) */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-sm bg-[#18181B] border border-[#27272A] rounded-2xl p-6 sm:p-7 shadow-2xl space-y-6 relative"
      >
        {/* BRAND HEADER: Brand Logo ONLY ("KWABOSPORTS") */}
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-black italic tracking-tighter uppercase font-sport">
            <span className="text-white">KWABO</span>
            <span className="text-[#A3E635]">SPORTS</span>
          </h1>
        </div>

        {/* Tab Switcher: Smooth toggle between Login and Create Account */}
        <div className="grid grid-cols-2 p-1 bg-[#121215] border border-[#27272A] rounded-xl text-xs font-mono">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`py-1.5 rounded-lg transition-all font-semibold cursor-pointer ${
              mode === 'login'
                ? 'bg-[#27272A] text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`py-1.5 rounded-lg transition-all font-semibold cursor-pointer ${
              mode === 'register'
                ? 'bg-[#27272A] text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* FORM VIEW: LOGIN OR REGISTRATION */}
        <form onSubmit={mode === 'login' ? handleSignIn : handleRegister} className="space-y-4">
          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-300 block">
              Email Address
            </label>
            <input
              id="admin-auth-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@kwabosports.com"
              className="w-full bg-[#121215] border border-[#27272A] focus:border-[#A3E635] text-sm text-white rounded-xl px-3.5 py-2.5 outline-none transition-colors placeholder:text-neutral-600 font-mono"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-300 block">
              Password
            </label>
            <input
              id="admin-auth-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-[#121215] border border-[#27272A] focus:border-[#A3E635] text-sm text-white rounded-xl px-3.5 py-2.5 outline-none transition-colors placeholder:text-neutral-600 font-mono"
            />
          </div>

          {/* Primary Action Button */}
          {mode === 'login' ? (
            /* Solid Neon Lime Green button reading "Sign In" (bg-[#A3E635] text-black font-bold) */
            <button
              id="admin-auth-sign-in-btn"
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#A3E635] hover:bg-[#92d627] text-black font-bold text-sm py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2 shadow-[0_0_15px_rgba(163,230,53,0.2)]"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-black" />
              ) : (
                <span>Sign In</span>
              )}
            </button>
          ) : (
            /* Solid Electric Cyan button reading "Create Admin Account" (bg-[#00E5FF] text-black font-bold) */
            <button
              id="admin-auth-register-btn"
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#00E5FF] hover:bg-[#00cce6] text-black font-bold text-sm py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2 shadow-[0_0_15px_rgba(0,229,255,0.2)]"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-black" />
              ) : (
                <span>Create Admin Account</span>
              )}
            </button>
          )}
        </form>

        {/* FOOTER LINK: Minimal text link */}
        <div className="text-center pt-1 border-t border-[#27272A]/50">
          {mode === 'login' ? (
            <button
              type="button"
              onClick={() => setMode('register')}
              className="text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              No account yet? <span className="underline underline-offset-4 text-neutral-300 hover:text-[#A3E635]">Create an account</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setMode('login')}
              className="text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              Already have an account? <span className="underline underline-offset-4 text-neutral-300 hover:text-[#00E5FF]">Sign in</span>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
