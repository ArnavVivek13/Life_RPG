/**
 * Pure Game Math Engine for Life RPG
 * Enforces non-linear curves, speed multipliers, and streak bonuses.
 */

/**
 * Calculates XP required to advance from level `n` to `n + 1`.
 * Formula: floor(100 * 1.15^(n-1))
 */
export function getXpRequiredForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.15, Math.max(1, level) - 1));
}

/**
 * Computes current level, current level progress XP, and XP needed for next level
 * given a user's total accumulated XP.
 */
export function calculateLevelProgression(totalXp: number): {
  level: number;
  currentLevelXp: number;
  xpForNextLevel: number;
  progressPercent: number;
} {
  let remainingXp = Math.max(0, totalXp);
  let level = 1;

  while (true) {
    const xpNeeded = getXpRequiredForLevel(level);
    if (remainingXp >= xpNeeded) {
      remainingXp -= xpNeeded;
      level += 1;
    } else {
      const progressPercent = Math.min(100, Math.round((remainingXp / xpNeeded) * 100));
      return {
        level,
        currentLevelXp: remainingXp,
        xpForNextLevel: xpNeeded,
        progressPercent,
      };
    }
  }
}

/**
 * Calculates speed multiplier based on task created time and deadline.
 * Clamped between 0.75x (late completion floor) and 1.5x (speedy finish).
 */
export function calculateSpeedMultiplier(
  createdAtStr: string,
  deadlineStr?: string | null,
  completedAt: Date = new Date()
): { multiplier: number; label: string } {
  if (!deadlineStr) {
    return { multiplier: 1.0, label: "Standard (1.0x)" };
  }

  const createdAt = new Date(createdAtStr).getTime();
  const deadline = new Date(deadlineStr).getTime();
  const now = completedAt.getTime();
  const totalDuration = deadline - createdAt;

  if (totalDuration <= 0) {
    return { multiplier: 1.0, label: "Standard (1.0x)" };
  }

  const remaining = deadline - now;
  const rawMultiplier = 1.0 + (remaining / totalDuration) * 0.5;
  const clampedMultiplier = Math.min(1.5, Math.max(0.75, Number(rawMultiplier.toFixed(2))));

  let label = `${clampedMultiplier}x`;
  if (clampedMultiplier >= 1.25) label += " ⚡ Swift Quest Bonus";
  else if (clampedMultiplier < 1.0) label += " ⏳ Late Completion";

  return { multiplier: clampedMultiplier, label };
}

/**
 * Calculates Gold awarded from XP and daily streak count.
 * Base Gold = round(XP * 0.5)
 * Streak Bonus = min(streak, 10) * 5% (up to +50% bonus)
 */
export function calculateGoldReward(xpAwarded: number, streakCount: number): {
  gold: number;
  streakBonusPercent: number;
} {
  const streakBonusPercent = Math.min(10, Math.max(0, streakCount)) * 5;
  const multiplier = 1 + streakBonusPercent / 100;
  const gold = Math.max(2, Math.round(xpAwarded * 0.5 * multiplier));
  return { gold, streakBonusPercent };
}
