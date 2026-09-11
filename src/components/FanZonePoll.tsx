import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  Radio,
  Vote,
  Sparkles,
  Users,
  Flame,
  Check,
  RotateCcw,
} from 'lucide-react';
import { supabase } from '../services/supabaseService';
import { Poll, PollOption } from '../types';

export interface FanZonePollProps {
  pollId?: string;
  initialQuestion?: string;
  className?: string;
  onVoteCast?: (optionId: string, updatedPoll: Poll) => void;
}

// Default Seed Poll Data matching KwaboSports Ballon d'Or Fan Poll
const DEFAULT_POLL: Poll = {
  id: 'ballon-dor-2026',
  question: "Who will win the Ballon d'Or?",
  category: 'FAN ZONE POLL',
  total_votes: 1240,
  options: [
    {
      id: 'haaland',
      poll_id: 'ballon-dor-2026',
      name: 'Erling Haaland',
      image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=200&auto=format&fit=crop&q=80',
      votes: 434,
      percentage: 35,
    },
    {
      id: 'mbappe',
      poll_id: 'ballon-dor-2026',
      name: 'Kylian Mbappé',
      image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=200&auto=format&fit=crop&q=80',
      votes: 360,
      percentage: 29,
    },
    {
      id: 'vinicius',
      poll_id: 'ballon-dor-2026',
      name: 'Vinicius Jr',
      image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=200&auto=format&fit=crop&q=80',
      votes: 272,
      percentage: 22,
    },
    {
      id: 'bellingham',
      poll_id: 'ballon-dor-2026',
      name: 'Jude Bellingham',
      image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=200&auto=format&fit=crop&q=80',
      votes: 174,
      percentage: 14,
    },
  ],
  is_active: true,
};

// Helper to get or generate persistent visitor id (fingerprint)
const getOrCreateVisitorId = (): string => {
  try {
    let vid = localStorage.getItem('kwabo_visitor_id');
    if (!vid) {
      vid = `kwabo_vis_${Math.random().toString(36).substring(2, 10)}_${Date.now().toString(36)}`;
      localStorage.setItem('kwabo_visitor_id', vid);
    }
    return vid;
  } catch {
    return `kwabo_vis_${Date.now()}`;
  }
};

export const FanZonePoll: React.FC<FanZonePollProps> = ({
  pollId = 'ballon-dor-2026',
  initialQuestion = "Who will win the Ballon d'Or?",
  className = '',
  onVoteCast,
}) => {
  // STATE MANAGEMENT
  const [poll, setPoll] = useState<Poll | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [votedOptionId, setVotedOptionId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showVotedToast, setShowVotedToast] = useState<boolean>(false);

  // Storage Keys
  const voteStorageKey = `voted_poll_${pollId}`;
  const localPollCacheKey = `kwabo_poll_cache_${pollId}`;

  // Recalculate percentages accurately across all options
  const recalculatePercentages = useCallback(
    (options: PollOption[]): { options: PollOption[]; totalVotes: number } => {
      const total = options.reduce((sum, opt) => sum + (Number(opt.votes) || 0), 0);
      if (total === 0) {
        return {
          options: options.map((opt) => ({ ...opt, percentage: 0 })),
          totalVotes: 0,
        };
      }

      const updated = options.map((opt) => ({
        ...opt,
        percentage: Math.round(((Number(opt.votes) || 0) / total) * 100),
      }));

      return { options: updated, totalVotes: total };
    },
    []
  );

  // 1. Initial Data Fetch & Visitor Fingerprint Check
  useEffect(() => {
    let isMounted = true;

    const initializePoll = async () => {
      setIsLoading(true);

      // Check visitor localStorage vote history
      try {
        const existingVote = localStorage.getItem(voteStorageKey);
        if (existingVote) {
          setHasVoted(true);
          setVotedOptionId(existingVote);
        }
      } catch (err) {
        console.warn('LocalStorage access warning:', err);
      }

      // Check cached local poll data first for snappy rendering
      let loadedPoll: Poll = DEFAULT_POLL;
      try {
        const cached = localStorage.getItem(localPollCacheKey);
        if (cached) {
          loadedPoll = JSON.parse(cached);
        }
      } catch (e) {
        console.warn('Failed to parse cached poll:', e);
      }

      // Try fetching active poll options from Supabase if client exists
      if (supabase) {
        try {
          const { data: remoteOptions, error } = await supabase
            .from('poll_options')
            .select('*')
            .eq('poll_id', pollId)
            .order('votes', { ascending: false });

          if (!error && remoteOptions && remoteOptions.length > 0) {
            const mappedOptions: PollOption[] = remoteOptions.map((row: any) => ({
              id: row.id || row.option_id,
              poll_id: row.poll_id || pollId,
              name: row.name || row.option_name,
              image: row.image || row.image_url,
              votes: Number(row.votes) || 0,
              percentage: 0,
            }));

            const calculated = recalculatePercentages(mappedOptions);
            loadedPoll = {
              id: pollId,
              question: initialQuestion,
              total_votes: calculated.totalVotes,
              options: calculated.options,
              is_active: true,
            };
          }
        } catch (supabaseErr) {
          console.warn('Supabase fetch error, falling back to local dataset:', supabaseErr);
        }
      }

      if (isMounted) {
        const calculated = recalculatePercentages(loadedPoll.options);
        const finalPoll: Poll = {
          ...loadedPoll,
          question: loadedPoll.question || initialQuestion,
          total_votes: calculated.totalVotes,
          options: calculated.options,
        };
        setPoll(finalPoll);
        setIsLoading(false);
      }
    };

    initializePoll();

    return () => {
      isMounted = false;
    };
  }, [pollId, initialQuestion, voteStorageKey, localPollCacheKey, recalculatePercentages]);

  // 2. Real-Time Supabase Channel Subscription + Multi-Tab Broadcast Sync
  useEffect(() => {
    if (!pollId) return;

    // A. Multi-tab BroadcastChannel sync for instant preview feedback across windows
    let broadcast: BroadcastChannel | null = null;
    try {
      broadcast = new BroadcastChannel(`kwabo_fanzone_poll_${pollId}`);
      broadcast.onmessage = (event) => {
        if (event.data && event.data.type === 'POLL_VOTE_CAST') {
          const updatedOptions: PollOption[] = event.data.options;
          setPoll((prev) => {
            if (!prev) return null;
            const recalculated = recalculatePercentages(updatedOptions);
            return {
              ...prev,
              total_votes: recalculated.totalVotes,
              options: recalculated.options,
            };
          });
        }
      };
    } catch {
      // BroadcastChannel unsupported in some restricted environments
    }

    // B. Supabase Realtime Subscription: supabase.channel('realtime_poll_[pollId]')
    let realtimeChannel: any = null;
    if (supabase) {
      try {
        realtimeChannel = supabase
          .channel(`realtime_poll_${pollId}`)
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'poll_options',
              filter: `poll_id=eq.${pollId}`,
            },
            (payload: any) => {
              const updatedRow = payload.new;
              if (!updatedRow || !updatedRow.id) return;

              setPoll((currentPoll) => {
                if (!currentPoll) return null;
                const nextOptions = currentPoll.options.map((opt) => {
                  if (opt.id === updatedRow.id) {
                    return {
                      ...opt,
                      votes: Number(updatedRow.votes) || opt.votes + 1,
                    };
                  }
                  return opt;
                });

                const recalculated = recalculatePercentages(nextOptions);
                return {
                  ...currentPoll,
                  total_votes: recalculated.totalVotes,
                  options: recalculated.options,
                };
              });
            }
          )
          .subscribe();
      } catch (realtimeErr) {
        console.warn('Realtime subscription warning:', realtimeErr);
      }
    }

    return () => {
      if (broadcast) broadcast.close();
      if (supabase && realtimeChannel) {
        supabase.removeChannel(realtimeChannel);
      }
    };
  }, [pollId, recalculatePercentages]);

  // 3. Frictionless Zero-Auth Voting Handler with RPC Execution
  const handleVoteClick = async (optionId: string) => {
    if (hasVoted || isSubmitting || !poll) return;

    setIsSubmitting(true);
    const visitorId = getOrCreateVisitorId();

    // 1. Instantly update local state for seamless UI responsiveness
    const previousOptions = poll.options;
    const targetOption = previousOptions.find((o) => o.id === optionId);
    if (!targetOption) {
      setIsSubmitting(false);
      return;
    }

    const updatedOptions = previousOptions.map((opt) => {
      if (opt.id === optionId) {
        return { ...opt, votes: opt.votes + 1 };
      }
      return opt;
    });

    const recalculated = recalculatePercentages(updatedOptions);
    const updatedPoll: Poll = {
      ...poll,
      total_votes: recalculated.totalVotes,
      options: recalculated.options,
    };

    setPoll(updatedPoll);
    setHasVoted(true);
    setVotedOptionId(optionId);
    setShowVotedToast(true);

    // 2. Persist vote locally to prevent duplicate votes
    try {
      localStorage.setItem(voteStorageKey, optionId);
      localStorage.setItem(localPollCacheKey, JSON.stringify(updatedPoll));
    } catch (err) {
      console.warn('Storage write error:', err);
    }

    // 3. Broadcast to other open tabs in real-time
    try {
      const bc = new BroadcastChannel(`kwabo_fanzone_poll_${pollId}`);
      bc.postMessage({ type: 'POLL_VOTE_CAST', options: updatedOptions });
      bc.close();
    } catch {
      // Ignore broadcast errors
    }

    // 4. Trigger Supabase RPC: supabase.rpc('cast_poll_vote', { p_poll_id, p_option_id, p_visitor_id })
    if (supabase) {
      try {
        const { error } = await supabase.rpc('cast_poll_vote', {
          p_poll_id: poll.id,
          p_option_id: optionId,
          p_visitor_id: visitorId,
        });

        if (error) {
          console.warn('Supabase cast_poll_vote RPC notice:', error.message);
          // Fallback update if RPC table trigger is custom
          try {
            await supabase
              .from('poll_options')
              .update({ votes: targetOption.votes + 1 })
              .eq('id', optionId);
          } catch {
            // Ignored in preview environment
          }
        }
      } catch (rpcErr) {
        console.warn('RPC execution exception (handled gracefully):', rpcErr);
      }
    }

    if (onVoteCast) {
      onVoteCast(optionId, updatedPoll);
    }

    setIsSubmitting(false);
    setTimeout(() => {
      setShowVotedToast(false);
    }, 3500);
  };

  // Find leader option for subtle aesthetic badge
  const leaderOption = useMemo(() => {
    if (!poll?.options || poll.options.length === 0) return null;
    return [...poll.options].sort((a, b) => b.votes - a.votes)[0];
  }, [poll?.options]);

  // RENDER LOADING SKELETON STATE
  if (isLoading || !poll) {
    return (
      <div
        id="fan-zone-poll-loading-skeleton"
        className={`bg-[#1A1A1A] border border-[#27272A] rounded-2xl p-5 shadow-xl flex flex-col justify-between h-full min-h-[360px] animate-pulse ${className}`}
      >
        <div className="space-y-4">
          {/* Header Row Skeleton */}
          <div className="flex items-center justify-between">
            <div className="w-28 h-5 rounded-full bg-[#27272A]" />
            <div className="w-24 h-5 rounded-full bg-[#27272A]" />
          </div>

          {/* Question Skeleton */}
          <div className="w-3/4 h-7 rounded-lg bg-[#27272A] mt-1" />

          {/* Options Skeleton List */}
          <div className="space-y-2.5 pt-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-full h-12 rounded-xl bg-[#222225] border border-[#2B2B30]"
              />
            ))}
          </div>
        </div>

        {/* Footer Skeleton */}
        <div className="w-1/2 h-3.5 rounded bg-[#27272A] mt-4" />
      </div>
    );
  }

  return (
    <div
      id="fan-zone-poll-component"
      className={`bg-[#1A1A1A] border border-[#27272A] hover:border-[#38383E] transition-all rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col justify-between h-full relative overflow-hidden group select-none ${className}`}
    >
      {/* Stadium dark subtle ambient lighting effect */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-[#00E5FF]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#A3E635]/5 rounded-full blur-3xl pointer-events-none" />

      <div>
        {/* ========================================================= */}
        {/* 1. HEADER ROW: Category Pill & Real-Time Vote Counter     */}
        {/* ========================================================= */}
        <div className="flex items-center justify-between gap-2 mb-3">
          {/* Left: Small neon green category pill (#A3E635) labeled "FAN ZONE POLL" */}
          <div className="flex items-center gap-1.5">
            <span
              id="fan-zone-poll-category-pill"
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#A3E635] text-black font-sport font-black text-[10px] sm:text-[11px] uppercase tracking-wider shadow-[0_0_12px_rgba(163,230,53,0.35)]"
            >
              <Flame className="w-3 h-3 fill-black" />
              <span>FAN ZONE POLL</span>
            </span>
          </div>

          {/* Right: Total vote counter badge showing real-time vote count */}
          <div
            id="fan-zone-poll-vote-counter-badge"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#121212] border border-[#2A2A2F] text-[11px] font-mono font-bold text-neutral-300 shadow-inner"
            title="Real-time verified community votes"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A3E635] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#A3E635]" />
            </span>
            <span className="text-white font-mono">
              {poll.total_votes.toLocaleString()}
            </span>
            <span className="text-neutral-500 font-normal">votes</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. POLL QUESTION: Bold white text                         */}
        {/* ========================================================= */}
        <h2
          id="fan-zone-poll-question-title"
          className="text-lg sm:text-xl font-black text-white font-sport uppercase tracking-tight leading-snug mb-4 drop-shadow-sm"
        >
          {poll.question}
        </h2>

        {/* ========================================================= */}
        {/* 3. POLL OPTIONS LIST WITH DYNAMIC CYAN FILL BARS         */}
        {/* ========================================================= */}
        <div id="fan-zone-poll-options-list" className="space-y-2.5">
          {poll.options.map((option) => {
            const isSelected = votedOptionId === option.id;
            const isLeader = leaderOption?.id === option.id;

            return (
              <motion.button
                key={option.id}
                id={`fan-zone-poll-option-${option.id}`}
                type="button"
                disabled={hasVoted || isSubmitting}
                onClick={() => handleVoteClick(option.id)}
                whileTap={!hasVoted ? { scale: 0.98 } : {}}
                className={`w-full text-left relative overflow-hidden rounded-xl border p-3 flex items-center justify-between transition-all duration-300 cursor-pointer disabled:cursor-default group ${
                  isSelected
                    ? 'border-[#00E5FF] bg-[#141A22] shadow-[0_0_15px_rgba(0,229,255,0.25)]'
                    : hasVoted
                    ? 'border-[#27272A] bg-[#141414] hover:border-[#38383E]'
                    : 'border-[#27272A] bg-[#161616] hover:bg-[#1E1E1E] hover:border-[#3F3F46]'
                }`}
              >
                {/* DYNAMIC FILL BAR: #00E5FF cyan accent with partial opacity */}
                {/* Animates its width smoothly from 0% to 100% using Tailwind duration-500 */}
                <div
                  className={`absolute inset-y-0 left-0 transition-all duration-500 ease-out pointer-events-none ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#00E5FF]/35 via-[#00E5FF]/25 to-[#00E5FF]/15 border-r-2 border-[#00E5FF]'
                      : isLeader && hasVoted
                      ? 'bg-gradient-to-r from-[#00E5FF]/20 via-[#00E5FF]/12 to-transparent'
                      : 'bg-[#00E5FF]/10'
                  }`}
                  style={{
                    width: hasVoted ? `${Math.max(4, option.percentage)}%` : '0%',
                  }}
                />

                {/* Left Side: Headshot/Avatar + Option Name */}
                <div className="relative z-10 flex items-center gap-3 min-w-0 pr-2">
                  {/* Optional player headshot or radio indicator */}
                  {option.image ? (
                    <div
                      className={`relative w-8 h-8 rounded-full overflow-hidden border shrink-0 bg-[#222] transition-colors ${
                        isSelected
                          ? 'border-[#00E5FF] ring-2 ring-[#00E5FF]/30'
                          : 'border-[#333] group-hover:border-neutral-500'
                      }`}
                    >
                      <img
                        src={option.image}
                        alt={option.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                          // Fallback to initial circle if image fails
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                        isSelected
                          ? 'border-[#00E5FF] bg-[#00E5FF]'
                          : 'border-[#444] group-hover:border-neutral-400'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-black stroke-[3]" />}
                    </div>
                  )}

                  {/* Option Name Text */}
                  <div className="truncate">
                    <span
                      className={`font-sport font-bold text-sm tracking-wide uppercase block truncate transition-colors ${
                        isSelected
                          ? 'text-white drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]'
                          : 'text-neutral-200 group-hover:text-white'
                      }`}
                    >
                      {option.name}
                    </span>
                  </div>
                </div>

                {/* Right Side: Vote Percentage & Status */}
                <div className="relative z-10 flex items-center gap-2 shrink-0">
                  {/* Selected checkmark indicator badge */}
                  {isSelected && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-[#00E5FF] bg-[#00E5FF]/15 px-1.5 py-0.5 rounded border border-[#00E5FF]/30">
                      <CheckCircle2 className="w-3 h-3 text-[#00E5FF]" />
                      <span className="hidden sm:inline">VOTED</span>
                    </span>
                  )}

                  {/* Vote Percentage display (Live when hasVoted) */}
                  <span
                    className={`font-mono text-xs sm:text-sm font-black transition-all ${
                      isSelected
                        ? 'text-[#00E5FF]'
                        : hasVoted
                        ? 'text-neutral-300'
                        : 'text-neutral-400 group-hover:text-neutral-200'
                    }`}
                  >
                    {hasVoted ? `${option.percentage}%` : 'Vote'}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. FOOTER STATUS BAR & ZERO-AUTH INFO                     */}
      {/* ========================================================= */}
      <div className="mt-4 pt-3 border-t border-[#27272A] flex items-center justify-between text-[11px] font-mono text-neutral-400">
        <div className="flex items-center gap-1.5">
          <Radio className="w-3 h-3 text-[#A3E635] animate-pulse" />
          <span className="text-neutral-300 font-medium">
            {hasVoted ? 'Vote registered' : 'Tap any player to cast vote'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {hasVoted && (
            <span className="text-[10px] text-[#00E5FF] bg-[#00E5FF]/10 px-2 py-0.5 rounded border border-[#00E5FF]/20">
              Live Real-Time Sync
            </span>
          )}
        </div>
      </div>

      {/* SUCCESS VOTE NOTIFICATION TOAST */}
      <AnimatePresence>
        {showVotedToast && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="absolute bottom-3 left-3 right-3 bg-[#00E5FF] text-black p-2.5 rounded-xl text-xs font-mono font-black flex items-center justify-between gap-2 shadow-2xl z-30"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 fill-black text-[#00E5FF]" />
              <span>Vote counted! Real-time percentages updated.</span>
            </div>
            <span className="text-[10px] bg-black/15 px-1.5 py-0.5 rounded uppercase tracking-wider">
              Kwabo Fan Zone
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
