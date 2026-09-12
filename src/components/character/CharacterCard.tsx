"use client";

import { Profile, UserInventory } from "@/types/database.types";
import { calculateLevelProgression } from "@/lib/game/math";
import { Flame, Coins, Shield, Sparkles, Crown } from "lucide-react";

interface CharacterCardProps {
  profile: Profile;
  inventory?: UserInventory[];
}

export default function CharacterCard({ profile, inventory = [] }: CharacterCardProps) {
  const { level, currentLevelXp, xpForNextLevel, progressPercent } = calculateLevelProgression(profile.total_xp);

  // Check equipped cosmetic items
  const equippedCrown = inventory.some((i) => i.equipped && i.item?.asset_key === "gear-golden-crown");
  const equippedHood = inventory.some((i) => i.equipped && i.item?.asset_key === "gear-mage-hood");

  return (
    <div className="p-5 rounded-2xl pixel-box bg-slate-900/90 border-2 border-slate-700 shadow-xl relative overflow-hidden space-y-5">
      
      {/* Background ambient lighting */}
      <div className="absolute -top-10 -right-10 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top Bar: Hero Info & Sprite */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
        
        {/* Animated 16-bit Sprite Container */}
        <div className="relative group shrink-0">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-950 border-2 border-slate-600 flex items-center justify-center relative overflow-hidden shadow-inner">
            
            {/* Equipped Crown Accessory */}
            {equippedCrown && (
              <Crown className="w-6 h-6 text-amber-300 absolute top-1 left-1/2 -translate-x-1/2 drop-shadow-[0_0_8px_rgba(252,211,77,0.8)] z-20 animate-bounce" />
            )}

            {/* Equipped Mage Hood Glow */}
            {equippedHood && (
              <div className="absolute inset-0 bg-purple-500/20 border-2 border-purple-400/40 rounded-2xl z-10 pointer-events-none" />
            )}

            {/* Pixel Character Canvas / SVG Sprite */}
            <div className="flex flex-col items-center justify-center animate-pulse duration-1000">
              <svg width="48" height="48" viewBox="0 0 16 16" className="w-12 h-12 image-pixelated">
                {/* Hair/Helmet */}
                <rect x="5" y="2" width="6" height="3" fill="#D97706" />
                {/* Face */}
                <rect x="5" y="5" width="6" height="4" fill="#FCD34D" />
                {/* Eyes */}
                <rect x="6" y="6" width="1" height="1" fill="#0F172A" />
                <rect x="9" y="6" width="1" height="1" fill="#0F172A" />
                {/* Armor/Tunic */}
                <rect x="4" y="9" width="8" height="5" fill="#3B82F6" />
                {/* Belt & Buckle */}
                <rect x="4" y="11" width="8" height="1" fill="#78350F" />
                <rect x="7" y="11" width="2" height="1" fill="#F59E0B" />
                {/* Boots */}
                <rect x="5" y="14" width="2" height="2" fill="#1E293B" />
                <rect x="9" y="14" width="2" height="2" fill="#1E293B" />
              </svg>
            </div>

            {/* Level Tag on Sprite */}
            <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 font-pixel text-[8px] font-bold">
              L{level}
            </div>
          </div>
        </div>

        {/* Hero Details */}
        <div className="flex-1 text-center sm:text-left space-y-1.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold font-title text-slate-100 flex items-center justify-center sm:justify-start gap-2">
                <span>{profile.username || "Valiant Adventurer"}</span>
                <span className="text-[10px] font-pixel px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">
                  Novice Champion
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-body">
                Mastering the trials of everyday discipline.
              </p>
            </div>

            {/* Currency Badges */}
            <div className="flex items-center justify-center sm:justify-end gap-2">
              
              {/* Gold Counter */}
              <div className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center gap-1.5 shadow-sm">
                <Coins className="w-3.5 h-3.5 text-rpg-gold" />
                <span className="text-xs font-bold text-rpg-goldLight font-pixel">
                  {profile.gold} G
                </span>
              </div>

              {/* Streak Flame */}
              <div className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-1.5 shadow-sm">
                <Flame className="w-3.5 h-3.5 text-red-400 fill-red-500/30 animate-pulse" />
                <span className="text-xs font-bold text-red-300 font-pixel">
                  {profile.streak_count}d
                </span>
              </div>

            </div>
          </div>

          {/* XP Progression Bar (Non-Linear) */}
          <div className="space-y-1 pt-2">
            <div className="flex items-center justify-between text-[11px] font-semibold">
              <span className="text-purple-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span>Level {level} Progress</span>
              </span>
              <span className="text-slate-400 font-pixel text-[9px]">
                {currentLevelXp} / {xpForNextLevel} XP ({progressPercent}%)
              </span>
            </div>

            {/* Animated XP Bar */}
            <div className="w-full h-3.5 bg-slate-950 rounded-full border border-slate-700 overflow-hidden p-0.5 relative shadow-inner">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-600 via-purple-500 to-amber-400 transition-all duration-500 shadow-glowXp"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between text-[10px] text-slate-500">
              <span>Total Realm XP: {profile.total_xp}</span>
              <span>Next Level: {xpForNextLevel - currentLevelXp} XP needed</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
