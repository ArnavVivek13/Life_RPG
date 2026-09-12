"use client";

import { Profile, UserInventory } from "@/types/database.types";
import { Building, DistrictZone } from "./WorldMapData";
import { calculateLevelProgression } from "@/lib/game/math";
import { 
  Flame, 
  Coins, 
  Sparkles, 
  LayoutDashboard, 
  Compass, 
  LogOut,
  ShoppingBag,
  MapPin,
  ShieldAlert,
  Award
} from "lucide-react";

interface WorldHUDProps {
  profile: Profile;
  inventory?: UserInventory[];
  viewMode: "world" | "classic";
  onToggleViewMode: () => void;
  nearbyBuilding?: Building | null;
  nearbyEasterEgg?: any | null;
  currentDistrict: DistrictZone;
  activeWaypoint: Building | null;
  onInteract: () => void;
  onOpenShop: () => void;
  onSignOut: () => void;
}

export default function WorldHUD({
  profile,
  inventory = [],
  viewMode,
  onToggleViewMode,
  currentDistrict,
  onOpenShop,
  onSignOut,
}: WorldHUDProps) {
  const { level, currentLevelXp, xpForNextLevel, progressPercent } = calculateLevelProgression(profile.total_xp);

  return (
    <div className="w-full select-none">
      
      {/* ── MOBILE COMPACT STATUS BAR (md:hidden) ── */}
      <div className="md:hidden p-2 px-3 rounded-xl pixel-box bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-amber-500/40 shadow-lg flex items-center justify-between gap-2">
        {/* Left: Avatar Badge & Info */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 border border-amber-200 flex items-center justify-center font-bold text-slate-950 font-pixel text-[11px] shadow-sm shrink-0">
            L{level}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs font-title text-amber-200 truncate max-w-[90px]">
                {profile.username || "Hero"}
              </span>
              <span className="text-[8px] font-pixel px-1.5 py-0.2 rounded bg-slate-800 text-amber-400 border border-amber-500/30 shrink-0">
                R{Math.min(10, Math.floor(level / 2) + 1)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-pixel text-slate-400 mt-0.5">
              <span className="text-amber-300 font-bold flex items-center gap-0.5">
                <Coins className="w-2.5 h-2.5 text-amber-400" />
                <span>{profile.gold}G</span>
              </span>
              <span className="text-red-300 font-bold flex items-center gap-0.5">
                <Flame className="w-2.5 h-2.5 text-red-400 fill-red-500/30" />
                <span>{profile.streak_count}d</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onOpenShop}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 text-[11px] font-semibold flex items-center gap-1 shadow-sm transition-colors"
          >
            <ShoppingBag className="w-3 h-3 text-amber-400" />
            <span>Shop</span>
          </button>

          <button
            onClick={onToggleViewMode}
            className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-[10px] uppercase font-pixel flex items-center gap-1 shadow-sm transition-transform"
          >
            {viewMode === "world" ? (
              <>
                <LayoutDashboard className="w-3 h-3" />
                <span>Tasks</span>
              </>
            ) : (
              <>
                <Compass className="w-3 h-3" />
                <span>Map</span>
              </>
            )}
          </button>

          <button
            onClick={onSignOut}
            className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/60 border border-red-800/40 text-red-300 transition-colors"
            title="Leave Realm"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── LAPTOP/DESKTOP FULL STATUS BAR (hidden md:flex) ── */}
      <div className="hidden md:flex p-3 sm:p-4 rounded-2xl pixel-box bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-2 border-amber-500/40 shadow-2xl items-center justify-between gap-3">
        
        {/* Left: Player Profile & Level Crest */}
        <div className="flex items-center gap-3.5 w-full md:w-auto">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 border-2 border-amber-200 flex items-center justify-center font-bold text-slate-950 font-pixel text-xs shadow-glowGold shrink-0">
            L{level}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm font-title text-amber-200">
                {profile.username || "Hero of Valoria"}
              </span>
              <span className="text-[9px] font-pixel px-2 py-0.5 rounded-full bg-slate-800/90 text-amber-400 border border-amber-500/30">
                RANK {Math.min(10, Math.floor(level / 2) + 1)}
              </span>
              {inventory
                .filter((i) => i.equipped && i.item?.type === "badge")
                .map((b) => (
                  <span
                    key={b.id || b.item_id}
                    className="text-[9px] font-pixel px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/50 flex items-center gap-1 shadow-sm"
                    title={`${b.item?.name}: ${b.item?.description}`}
                  >
                    <span>🎖️</span>
                    <span className="hidden sm:inline">{b.item?.name}</span>
                  </span>
                ))}
            </div>
            
            {/* XP Bar */}
            <div className="flex items-center gap-2.5 mt-1.5">
              <div className="w-32 sm:w-44 h-2.5 bg-slate-950 rounded-full border border-slate-700 overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-600 via-purple-500 to-amber-400 transition-all duration-300 shadow-glowXp"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[9px] font-pixel text-slate-400">
                {currentLevelXp}/{xpForNextLevel} XP
              </span>
            </div>
          </div>
        </div>

        {/* Center: Currencies & Current District */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-center gap-1.5 shadow-sm">
            <Coins className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-amber-300 font-pixel">
              {profile.gold} G
            </span>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-red-500/10 border border-red-500/40 flex items-center gap-1.5 shadow-sm">
            <Flame className="w-4 h-4 text-red-400 fill-red-500/30 animate-pulse" />
            <span className="text-xs font-bold text-red-300 font-pixel">
              {profile.streak_count}d Streak
            </span>
          </div>

          {/* District Tag */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-semibold text-cyan-300 shadow">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>{currentDistrict.name.split("&")[0].trim()}</span>
          </div>
        </div>

        {/* Right: View Mode Toggle & Navigation */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <button
            onClick={onOpenShop}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-amber-400/50 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Shop</span>
          </button>

          <button
            onClick={onToggleViewMode}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider font-pixel pixel-btn flex items-center gap-1.5 transition-transform shadow-glowGold"
          >
            {viewMode === "world" ? (
              <>
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </>
            ) : (
              <>
                <Compass className="w-3.5 h-3.5" />
                <span>Overworld</span>
              </>
            )}
          </button>

          <button
            onClick={onSignOut}
            className="p-2 rounded-xl bg-red-950/60 hover:bg-red-900/60 border border-red-800/40 text-red-300 transition-colors"
            title="Leave Realm"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
