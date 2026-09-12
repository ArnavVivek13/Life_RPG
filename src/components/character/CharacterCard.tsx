"use client";

import { useEffect, useRef } from "react";
import { Profile, UserInventory } from "@/types/database.types";
import { calculateLevelProgression } from "@/lib/game/math";
import { drawPlayerSprite, getPalette } from "@/components/world/SpriteEngine";
import { getItemPerk } from "@/lib/game/items";
import { Flame, Coins, Shield, Sparkles, Crown, Award, Sword, Heart } from "lucide-react";

interface CharacterCardProps {
  profile: Profile;
  inventory?: UserInventory[];
}

function getHeroTitle(lvl: number): string {
  if (lvl >= 15) return "Grand Master of Valoria";
  if (lvl >= 10) return "Paladin of Discipline";
  if (lvl >= 6) return "Knight of the Realm";
  if (lvl >= 3) return "Valiant Adventurer";
  return "Apprentice Quester";
}

export default function CharacterCard({ profile, inventory = [] }: CharacterCardProps) {
  const { level, currentLevelXp, xpForNextLevel, progressPercent } = calculateLevelProgression(profile.total_xp);
  const avatarCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Check equipped cosmetic items
  const equippedCrown = inventory.some((i) => i.equipped && i.item?.asset_key === "gear-golden-crown");
  const equippedHood = inventory.some((i) => i.equipped && i.item?.asset_key === "gear-mage-hood");
  const equippedSword = inventory.some((i) => i.equipped && i.item?.asset_key === "gear-dragon-blade");
  const equippedShield = inventory.some((i) => i.equipped && i.item?.asset_key === "gear-knight-shield");
  const equippedCape = inventory.some((i) => i.equipped && i.item?.asset_key === "gear-celestial-cape");
  const equippedCowl = inventory.some((i) => i.equipped && i.item?.asset_key === "gear-ranger-cowl");

  useEffect(() => {
    const canvas = avatarCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, 72, 72);
    ctx.save();
    ctx.scale(2.1, 2.1);
    drawPlayerSprite({
      ctx,
      x: 1,
      y: 1,
      direction: "down",
      isMoving: false,
      frame: 0,
      hasCrown: equippedCrown,
      hasHood: equippedHood,
      hasSword: equippedSword,
      hasShield: equippedShield,
      hasCape: equippedCape,
      hasCowl: equippedCowl,
      palette: getPalette(profile.current_theme),
    });
    ctx.restore();
  }, [equippedCrown, equippedHood, equippedSword, equippedShield, equippedCape, equippedCowl, profile.current_theme]);

  const heroTitle = getHeroTitle(level);

  return (
    <div className="p-5 sm:p-6 rounded-2xl pixel-box bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950 border-2 border-amber-500/30 shadow-2xl relative overflow-hidden space-y-5">
      
      {/* Subtle fantasy background aura */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Top Bar: Hero Info & Live Sprite */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
        
        {/* Animated GBA Sprite Canvas Frame */}
        <div className="relative group shrink-0">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-950 border-2 border-amber-400/60 flex items-center justify-center relative overflow-hidden shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)]">
            
            {/* Live GBA Pixel Sprite Canvas */}
            <canvas
              ref={avatarCanvasRef}
              width={72}
              height={72}
              className="w-16 h-16 image-pixelated animate-pulse duration-1000"
              style={{ imageRendering: "pixelated" }}
            />

            {/* Level Tag on Sprite */}
            <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-pixel text-[8px] font-bold shadow">
              LV.{level}
            </div>
          </div>
        </div>

        {/* Hero Details */}
        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h2 className="text-lg sm:text-xl font-bold font-title text-amber-200">
                  {profile.username || "Hero of Valoria"}
                </h2>
                <span className="text-[10px] font-pixel px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/40 text-amber-300">
                  {heroTitle}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-body mt-0.5">
                Forging destiny through daily discipline and heroic consistency.
              </p>
            </div>

            {/* Currency Badges */}
            <div className="flex items-center justify-center sm:justify-end gap-2.5">
              
              {/* Gold Counter */}
              <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-center gap-1.5 shadow-sm">
                <Coins className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-amber-300 font-pixel">
                  {profile.gold} G
                </span>
              </div>

              {/* Streak Flame */}
              <div className="px-3.5 py-1.5 rounded-xl bg-red-500/10 border border-red-500/40 flex items-center gap-1.5 shadow-sm">
                <Flame className="w-4 h-4 text-red-400 fill-red-500/30 animate-pulse" />
                <span className="text-xs font-bold text-red-300 font-pixel">
                  {profile.streak_count}d Streak
                </span>
              </div>

            </div>
          </div>

          {/* XP Progression Bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px] font-semibold">
              <span className="text-purple-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span className="font-title">Level {level} Experience</span>
              </span>
              <span className="text-amber-300 font-pixel text-[9px]">
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
            
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>Lifetime Realm XP: {profile.total_xp.toLocaleString()}</span>
              <span>Next Level: {xpForNextLevel - currentLevelXp} XP remaining</span>
            </div>

            {/* Active Equipped Perks & Relics */}
            {inventory.some((i) => i.equipped && i.item) && (
              <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-pixel text-amber-400 uppercase tracking-wider flex items-center gap-1 shrink-0">
                  <Award className="w-3 h-3 text-amber-400" />
                  <span>Active Relics:</span>
                </span>
                {inventory
                  .filter((i) => i.equipped && i.item)
                  .map((inv) => {
                    const perk = getItemPerk(inv.item!.asset_key);
                    return (
                      <span
                        key={inv.id || inv.item_id}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-950 border border-amber-500/40 text-amber-200 text-[10px] font-pixel shadow-sm"
                        title={perk ? `${inv.item!.name}: ${perk.effectDescription}` : inv.item!.name}
                      >
                        <span>{inv.item!.name}</span>
                        {perk?.badgeLabel && (
                          <span className="text-emerald-400 font-bold">({perk.badgeLabel})</span>
                        )}
                      </span>
                    );
                  })}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
