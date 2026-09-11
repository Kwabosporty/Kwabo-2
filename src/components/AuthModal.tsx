import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdmin?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onOpenAdmin }) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="auth-dialog"
        className="w-full max-w-md bg-[#15181E] border border-[#2B3242] rounded-2xl shadow-2xl overflow-hidden p-6 relative"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-[#202530]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-1 mb-6">
          <span className="text-2xl font-black italic tracking-tighter text-[#A3E635] font-sport">
            KWABO
          </span>
          <span className="text-2xl font-black italic tracking-tighter text-white font-sport">
            SPORTS
          </span>
          <span className="text-xs bg-[#242A38] text-neutral-400 font-mono px-2 py-0.5 rounded ml-2">
            PASSPORT
          </span>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#242A38] mb-5">
          <button
            onClick={() => setTab('login')}
            className={`flex-1 pb-3 text-sm font-bold transition-colors relative ${
              tab === 'login' ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            LOGIN
            {tab === 'login' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A3E635]" />
            )}
          </button>
          <button
            onClick={() => setTab('register')}
            className={`flex-1 pb-3 text-sm font-bold transition-colors relative ${
              tab === 'register' ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            CREATE ACCOUNT
            {tab === 'register' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A3E635]" />
            )}
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#A3E635]/20 text-[#A3E635] flex items-center justify-center mx-auto">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white font-sport">
              {tab === 'login' ? 'Welcome Back!' : 'Account Created!'}
            </h3>
            <p className="text-xs text-neutral-400">
              Personalized Kwabo live sports feed loaded.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Alex Morgan"
                    className="w-full bg-[#1A1E26] border border-[#2B3342] rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#A3E635]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="fan@kwabosports.com"
                  className="w-full bg-[#1A1E26] border border-[#2B3342] rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#A3E635]"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  Password
                </label>
                {tab === 'login' && (
                  <a href="#forgot" className="text-[11px] text-[#A3E635] hover:underline">
                    Forgot?
                  </a>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#1A1E26] border border-[#2B3342] rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#A3E635]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#A3E635] hover:bg-[#8fd624] text-black font-extrabold text-sm py-2.5 rounded-lg uppercase tracking-wider transition-all font-sport shadow-md mt-2"
            >
              {tab === 'login' ? 'SIGN IN TO KWABO' : 'JOIN KWABOSPORTS FREE'}
            </button>

            <div className="text-center pt-2 space-y-2">
              <span className="text-xs text-neutral-500 block">
                By continuing, you agree to KwaboSports Terms of Service & Privacy Policy.
              </span>

              {onOpenAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAdmin();
                  }}
                  className="text-xs text-[#A3E635] hover:text-white font-mono underline inline-block pt-1 cursor-pointer"
                >
                  Editorial staff? Open Super Admin Console →
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
