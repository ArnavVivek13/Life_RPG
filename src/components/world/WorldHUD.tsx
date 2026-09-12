"use client";

import { Profile } from "@/types/database.types";
import { calculateLevelProgression } from "@/lib/game/math";
import { 
  Flame, 
  Coins, 
  Sparkles, 
  LayoutDashboard, 
  Compass, 
  Volume2, 
  VolumeX, 
  LogOut,
  ShoppingBag
} from "lucide-react";

interface WorldHUDProps {
  profile: Profile;
  viewMode: "world" | "classic";
  onToggleViewMode: () => void;
  nearbyBuildingName?: string | null;
  onInteract: () => void;
  onOpenShop: () => void;
  onSignOut: () => void;
}

export default function WorldHUD({
  profile,
  viewMode,
  onToggleViewMode,
  nearbyBuildingName,
  onInteract,
  onOpenShop,
  onSignOut,
}: WorldHUDProps) {
  const { level, currentLevelXp, xpForNextLevel, progressPercent } = calculateLevelProgression(profile.total_xp);

  return (
    <div className="w-full space-y-3">
      {/* Top GBA HUD Bar */}
      <div className="p-3 sm:p-4 rounded-2xl pixel-box bg-slate-900/90 border-2 border-slate-700 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Left: Player Profile & Level */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 border-2 border-amber-300 flex items-center justify-center font-bold text-slate-950 font-pixel text-xs shadow-md">
            L{level}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs sm:text-sm font-title text-slate-100">
                {profile.username || "Hero of Valoria"}
              </span>
              <span className="text-[9px] font-pixel px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                {profile.current_theme === "cyberpunk" ? "CYBERPUNK" : "MEDIEVAL"}
              </span>
            </div>
            {/* XP Mini Bar */}
            <div className="flex items-center gap-2 mt-1">
              <div className="w-28 sm:w-36 h-2 bg-slate-950 rounded-full border border-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-amber-400 transition-all duration-300 shadow-glowXp"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[9px] font-pixel text-slate-400">
                {currentLevelXp}/{xpForNextLevel} XP
              </span>
            </div>
          </div>
        </div>

        {/* Center: Currencies */}
        <div className="flex items-center gap-3">
          {/* Gold */}
          <div className="px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-bold text-amber-300 font-pixel">
              {profile.gold} G
            </span>
          </div>

          {/* Streak */}
          <div className="px-3 py-1 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-red-400 fill-red-500/30 animate-pulse" />
            <span className="text-xs font-bold text-red-300 font-pixel">
              {profile.streak_count}d Streak
            </span>
          </div>
        </div>

        {/* Right: View Mode Toggle & Navigation */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={onOpenShop}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Shop</span>
          </button>

          <button
            onClick={onToggleViewMode}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider font-pixel pixel-btn flex items-center gap-1.5 transition-transform"
          >
            {viewMode === "world" ? (
              <>
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard View</span>
              </>
            ) : (
              <>
                <Compass className="w-3.5 h-3.5" />
                <span>Overworld Map</span>
              </>
            )}
          </button>

          <button
            onClick={onSignOut}
            className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/60 border border-red-800/40 text-red-300 transition-colors"
            title="Leave Realm"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Proximity Interaction Prompt Banner */}
      {viewMode === "world" && nearbyBuildingName && (
        <div className="p-2.5 rounded-xl pixel-box bg-gradient-to-r from-amber-950/90 via-slate-900 to-amber-950/90 border-2 border-amber-400/80 text-center animate-bounce shadow-glowGold flex items-center justify-center gap-3">
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
          <span className="text-xs font-pixel text-amber-200">
            Press <kbd className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-bold">Space</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-bold">E</kbd> to inspect <strong>{nearbyBuildingName}</strong>
          </span>
          <button
            onClick={onInteract}
            className="px-3 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px] font-pixel uppercase tracking-wider"
          >
            Enter Now
          </button>
        </div>
      )}
    </div>
  );
}
