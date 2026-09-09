import React from 'react';

interface TeamBadgeProps {
  code: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const TeamBadge: React.FC<TeamBadgeProps> = ({ code, size = 'sm', className = '' }) => {
  const sizeMap = {
    xs: 'w-4 h-4 text-[9px]',
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm',
  };

  const badgeMap: Record<string, { bg: string; border: string; text: string; label: string; icon?: string }> = {
    ARS: { bg: 'bg-[#EF0107]', border: 'border-[#9C824A]', text: 'text-white', label: 'ARS' },
    CHE: { bg: 'bg-[#034694]', border: 'border-[#EE242C]', text: 'text-white', label: 'CFC' },
    RMA: { bg: 'bg-[#FFFFFF]', border: 'border-[#FEBE10]', text: 'text-[#00529F]', label: 'RMA' },
    FCB: { bg: 'bg-gradient-to-br from-[#A50044] to-[#004D98]', border: 'border-[#EDBB00]', text: 'text-white', label: 'FCB' },
    MCI: { bg: 'bg-[#6CABDD]', border: 'border-[#1C2C5B]', text: 'text-white', label: 'MCI' },
    LIV: { bg: 'bg-[#C8102E]', border: 'border-[#00B2A9]', text: 'text-white', label: 'LFC' },
    AVL: { bg: 'bg-[#95BFE5]', border: 'border-[#670E36]', text: 'text-[#670E36]', label: 'AVL' },
    TOT: { bg: 'bg-[#132257]', border: 'border-white', text: 'text-white', label: 'SPURS' },
    RSD: { bg: 'bg-[#00519E]', border: 'border-white', text: 'text-white', label: 'RSD' },
    LAL: { bg: 'bg-[#552583]', border: 'border-[#FDB927]', text: 'text-[#FDB927]', label: 'LAL' },
    GSW: { bg: 'bg-[#1D428A]', border: 'border-[#FFC72C]', text: 'text-[#FFC72C]', label: 'GSW' },
    FER: { bg: 'bg-[#DC0000]', border: 'border-[#FFF200]', text: 'text-white', label: 'F1' },
  };

  const current = badgeMap[code] || {
    bg: 'bg-neutral-800',
    border: 'border-neutral-600',
    text: 'text-white',
    label: code.substring(0, 3),
  };

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full font-bold shadow-sm select-none shrink-0 border ${current.bg} ${current.border} ${current.text} ${sizeMap[size]} ${className}`}
      title={code}
    >
      <span className="leading-none tracking-tighter">{current.label}</span>
    </div>
  );
};
