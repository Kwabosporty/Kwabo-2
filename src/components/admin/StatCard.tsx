import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  accentColor?: 'lime' | 'cyan' | 'yellow' | 'purple';
  trend?: {
    value: string;
    isPositive: boolean;
  };
  badge?: string;
  isLive?: boolean;
  loading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  accentColor = 'lime',
  trend,
  badge,
  isLive = false,
  loading = false,
}) => {
  const colorMap = {
    lime: {
      text: 'text-[#A3E635]',
      border: 'border-[#A3E635]/30',
      bg: 'bg-[#A3E635]/10',
      shadow: 'shadow-[0_0_15px_rgba(163,230,53,0.1)]',
      glow: '#A3E635',
    },
    cyan: {
      text: 'text-[#00E5FF]',
      border: 'border-[#00E5FF]/30',
      bg: 'bg-[#00E5FF]/10',
      shadow: 'shadow-[0_0_15px_rgba(0,229,255,0.1)]',
      glow: '#00E5FF',
    },
    yellow: {
      text: 'text-[#FACC15]',
      border: 'border-[#FACC15]/30',
      bg: 'bg-[#FACC15]/10',
      shadow: 'shadow-[0_0_15px_rgba(250,204,21,0.1)]',
      glow: '#FACC15',
    },
    purple: {
      text: 'text-purple-400',
      border: 'border-purple-500/30',
      bg: 'bg-purple-500/10',
      shadow: 'shadow-[0_0_15px_rgba(168,85,247,0.1)]',
      glow: '#c084fc',
    },
  };

  const currentTheme = colorMap[accentColor];

  if (loading) {
    return (
      <div className="p-4 rounded-xl bg-[#121215] border border-[#27272A] animate-pulse space-y-3">
        <div className="flex justify-between items-center">
          <div className="h-3 w-24 bg-[#27272A] rounded" />
          <div className="h-7 w-7 bg-[#27272A] rounded-lg" />
        </div>
        <div className="h-7 w-28 bg-[#27272A] rounded" />
        <div className="h-3 w-36 bg-[#27272A] rounded" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className={`p-4 rounded-xl bg-[#121215] border border-[#27272A] hover:border-neutral-700 transition-all relative overflow-hidden group ${currentTheme.shadow}`}
    >
      {/* Subtle background ambient gradient on hover */}
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity"
        style={{ backgroundColor: currentTheme.glow }}
      />

      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-neutral-400 tracking-wider uppercase font-mono">
          {title}
        </span>

        <div className="flex items-center gap-1.5">
          {badge && (
            <span
              className={`text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase font-bold tracking-wider ${currentTheme.bg} ${currentTheme.text} ${currentTheme.border}`}
            >
              {badge}
            </span>
          )}

          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center border ${currentTheme.bg} ${currentTheme.border}`}
          >
            <Icon className={`w-3.5 h-3.5 ${currentTheme.text}`} />
          </div>
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-2 mt-1">
        <div className="flex items-center gap-2">
          {isLive && (
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A3E635] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#A3E635]" />
            </span>
          )}
          <span className="text-2xl font-bold tracking-tight text-white font-sport">
            {value}
          </span>
        </div>

        {trend && (
          <span
            className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
              trend.isPositive
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>

      {subtitle && (
        <div className="mt-2 text-[11px] text-neutral-400 font-mono truncate flex items-center gap-1.5">
          <span>{subtitle}</span>
        </div>
      )}
    </motion.div>
  );
};
