"use client";

import { useEffect, useCallback } from "react";
import confetti from "canvas-confetti";
import { Sparkles, Trophy, ArrowUp, Star, X } from "lucide-react";

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  newLevel: number;
  awardedXp: number;
  awardedGold: number;
  category?: string;
}

// Synthesize pleasant RPG 8-bit fanfare using Web Audio API
function playFanfareSound() {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const notes = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99]; // C4, E4, G4, C5, E5, G5
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = freq;
      
      const startTime = ctx.currentTime + idx * 0.08;
      const duration = 0.25;

      gain.gain.setValueAtTime(0.15, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  } catch {
    // Ignore audio context autoplay restriction gracefully
  }
}

export default function LevelUpModal({
  isOpen,
  onClose,
  newLevel,
  awardedXp,
  awardedGold,
  category,
}: LevelUpModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      playFanfareSound();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#F59E0B", "#9333EA", "#3B82F6", "#10B981", "#EF4444"],
      });

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="levelup-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="max-w-md w-full pixel-box p-6 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/40 border-2 border-amber-500 shadow-[0_0_50px_rgba(245,158,11,0.4)] text-center space-y-6 relative overflow-hidden focus:outline-none">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Level Up modal"
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors focus:ring-2 focus:ring-amber-400 focus:outline-none"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Glow Particles */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Title */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-pixel uppercase tracking-widest animate-bounce">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Hero Level Up!</span>
          </div>

          <h2 id="levelup-title" className="text-3xl sm:text-4xl font-black font-title text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 drop-shadow-[0_2px_15px_rgba(245,158,11,0.5)]">
            LEVEL UP!
          </h2>
          <p className="text-xs text-slate-300 font-body">
            Your spirit grows stronger as you overcome the trials of reality.
          </p>
        </div>

        {/* Level Emblem */}
        <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-600 to-amber-800 p-1 shadow-2xl mx-auto border-2 border-amber-300">
          <div className="w-full h-full bg-slate-950 rounded-xl flex flex-col items-center justify-center">
            <span className="text-[10px] font-pixel text-amber-400">LVL</span>
            <span className="text-3xl font-black font-title text-amber-300">{newLevel}</span>
          </div>
          <Star className="w-5 h-5 text-amber-300 absolute -top-2 -right-2 fill-amber-300 animate-spin" style={{ animationDuration: "6s" }} />
        </div>

        {/* Rewards Summary Grid */}
        <div className="grid grid-cols-2 gap-3 text-left">
          <div className="p-3 rounded-xl bg-slate-950/80 border border-purple-500/30 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-medium">XP Earned</span>
              <p className="text-sm font-bold text-purple-300 font-pixel">+{awardedXp} XP</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-amber-500/30 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
              <span className="text-lg font-pixel">🪙</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-medium">Gold Claimed</span>
              <p className="text-sm font-bold text-amber-300 font-pixel">+{awardedGold} G</p>
            </div>
          </div>
        </div>

        {category && (
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center justify-center gap-2">
            <ArrowUp className="w-4 h-4 text-emerald-400" />
            <span>Increased <strong>{category}</strong> Attribute Mastery</span>
          </div>
        )}

        {/* Claim Button */}
        <button
          onClick={onClose}
          autoFocus
          className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider font-pixel pixel-btn shadow-lg focus:ring-2 focus:ring-amber-300 focus:outline-none"
        >
          Continue Journey (Space / Enter)
        </button>

      </div>
    </div>
  );
}
