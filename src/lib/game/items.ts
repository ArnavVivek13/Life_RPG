import { UserInventory, AttributeName, ShopItem } from "@/types/database.types";

export const DEFAULT_SHOP_ITEMS: ShopItem[] = [
  // ── THEMES ──
  {
    id: "a1111111-1111-1111-1111-111111111111",
    name: "Dungeon Tavern Theme",
    type: "theme",
    cost: 0,
    asset_key: "theme-default",
    description: "The classic cozy medieval tavern where all legendary adventurers gather.",
  },
  {
    id: "a2222222-2222-2222-2222-222222222222",
    name: "Cyberpunk Neon Theme",
    type: "theme",
    cost: 300,
    asset_key: "theme-cyberpunk",
    description: "Sleek neon grid theme from the neon underworld of 2099.",
  },
  {
    id: "a3333333-3333-3333-3333-333333333333",
    name: "Emerald Forest Sanctuary",
    type: "theme",
    cost: 250,
    asset_key: "theme-emerald",
    description: "Deep twilight emerald forest canopy with mystical teal waters and glowing night flora.",
  },
  {
    id: "a4444444-4444-4444-4444-444444444444",
    name: "Golden Autumn Citadel",
    type: "theme",
    cost: 250,
    asset_key: "theme-autumn",
    description: "Warm Johto-inspired autumn foliage, golden pathways, and russet-tile roofs.",
  },
  {
    id: "a5555555-5555-5555-5555-555555555555",
    name: "Lavender Spirit Realm",
    type: "theme",
    cost: 280,
    asset_key: "theme-lavender",
    description: "An ethereal twilight realm of soft violet paths, haunted blossoms, and spiritual mist.",
  },

  // ── AVATAR GEAR & COSMETICS ──
  {
    id: "b1111111-1111-1111-1111-111111111111",
    name: "Mage Hood",
    type: "avatar_item",
    cost: 150,
    asset_key: "gear-mage-hood",
    description: "A mysterious hood woven from enchanted starlight silk (+15% Intellect XP).",
  },
  {
    id: "b2222222-2222-2222-2222-222222222222",
    name: "Golden Crown",
    type: "avatar_item",
    cost: 500,
    asset_key: "gear-golden-crown",
    description: "Forged from pure aurum for true champions of discipline (+20% Gold Bounty).",
  },
  {
    id: "b3333333-3333-3333-3333-333333333333",
    name: "Dragonfang Broadsword",
    type: "avatar_item",
    cost: 350,
    asset_key: "gear-dragon-blade",
    description: "A legendary blade forged in dragon flame, sheathed at your hip (+15% Strength XP).",
  },
  {
    id: "b4444444-4444-4444-4444-444444444444",
    name: "Lionheart Aegis Shield",
    type: "avatar_item",
    cost: 275,
    asset_key: "gear-knight-shield",
    description: "An ornate royal heater shield bearing the golden lion crest (Streak Aegis: Protects 1 missed day).",
  },
  {
    id: "b5555555-5555-5555-5555-555555555555",
    name: "Shadowstalker Ranger Cowl",
    type: "avatar_item",
    cost: 220,
    asset_key: "gear-ranger-cowl",
    description: "A stealthy forest ranger cowl fitted with an emerald hawk plume feather (+15% Speed XP).",
  },
  {
    id: "b6666666-6666-6666-6666-666666666666",
    name: "Celestial Archmage Cape",
    type: "avatar_item",
    cost: 400,
    asset_key: "gear-celestial-cape",
    description: "A flowing royal midnight-blue cape lined with starlight embroidery (+15% Creative & Social XP).",
  },

  // ── BADGES & RELICS ──
  {
    id: "c1111111-1111-1111-1111-111111111111",
    name: "Early Quester Badge",
    type: "badge",
    cost: 50,
    asset_key: "badge-early-quester",
    description: "Conferred upon the brave souls who embark on their life journey (+10% Gold Bounty).",
  },
  {
    id: "c2222222-2222-2222-2222-222222222222",
    name: "Iron Will Discipline Crest",
    type: "badge",
    cost: 120,
    asset_key: "badge-iron-will",
    description: "Proof of unshakeable mental discipline and consecutive habit completion (+20% Discipline XP).",
  },
  {
    id: "c3333333-3333-3333-3333-333333333333",
    name: "Dragon Slayer Champion Seal",
    type: "badge",
    cost: 450,
    asset_key: "badge-dragon-slayer",
    description: "The highest medal of honor, awarded only to conquerors of the realm's fiercest trials (+25% Strength XP).",
  },
  {
    id: "c4444444-4444-4444-4444-444444444444",
    name: "Grandmaster Scholar Seal",
    type: "badge",
    cost: 250,
    asset_key: "badge-grandmaster",
    description: "Bestowed upon scholarly adventurers who unlock great wisdom in the arcane library (+25% Intellect XP).",
  },
];

export interface ItemPerk {
  badgeLabel: string;
  effectDescription: string;
  category?: "Intellect" | "Strength" | "Discipline" | "Creativity" | "Social" | "all";
  xpBonusPercent?: number;
  goldBonusPercent?: number;
  streakProtection?: boolean;
  speedBonusPercent?: number;
}

export const ITEM_PERKS: Record<string, ItemPerk> = {
  // ── THEMES ──
  "theme-default": {
    badgeLabel: "Classic Theme",
    effectDescription: "Applies the classic cozy daylight Kanto Day theme to the world and sprite.",
  },
  "theme-cyberpunk": {
    badgeLabel: "Neon Byte Theme",
    effectDescription: "Applies the sleek cyberpunk neon night theme to the world and sprite.",
  },
  "theme-emerald": {
    badgeLabel: "Emerald Theme",
    effectDescription: "Applies the mystical emerald night canopy theme to the world and sprite.",
  },
  "theme-autumn": {
    badgeLabel: "Autumn Theme",
    effectDescription: "Applies the warm Johto golden autumn theme to the world and sprite.",
  },
  "theme-lavender": {
    badgeLabel: "Lavender Theme",
    effectDescription: "Applies the ethereal lavender twilight realm theme to the world and sprite.",
  },

  // ── AVATAR GEAR & COSMETICS ──
  "gear-mage-hood": {
    badgeLabel: "+15% Intellect XP",
    effectDescription: "Enchanted starlight hood grants +15% XP on all Intellect quests.",
    category: "Intellect",
    xpBonusPercent: 15,
  },
  "gear-golden-crown": {
    badgeLabel: "+20% Gold Bounty",
    effectDescription: "Forged pure aurum crown grants +20% Gold bounty on all quests.",
    category: "all",
    goldBonusPercent: 20,
  },
  "gear-dragon-blade": {
    badgeLabel: "+15% Strength XP",
    effectDescription: "Legendary broadsword forged in dragon flame grants +15% XP on Strength quests.",
    category: "Strength",
    xpBonusPercent: 15,
  },
  "gear-knight-shield": {
    badgeLabel: "Streak Aegis",
    effectDescription: "Lionheart heater shield protects your daily quest streak from resetting for 1 missed day.",
    category: "all",
    streakProtection: true,
  },
  "gear-ranger-cowl": {
    badgeLabel: "+15% Speed XP",
    effectDescription: "Emerald ranger cowl with hawk plume feather grants +15% Speed bonus XP on prompt completions.",
    category: "all",
    speedBonusPercent: 15,
  },
  "gear-celestial-cape": {
    badgeLabel: "+15% Creative & Social XP",
    effectDescription: "Flowing midnight-blue cape grants +15% XP on Creativity and Social quests.",
    category: "Creativity",
    xpBonusPercent: 15,
  },

  // ── BADGES & RELICS ──
  "badge-early-quester": {
    badgeLabel: "+10% Gold Bounty",
    effectDescription: "Medal of honor granting +10% Gold bounty on all completed quests.",
    category: "all",
    goldBonusPercent: 10,
  },
  "badge-iron-will": {
    badgeLabel: "+20% Discipline XP",
    effectDescription: "Proof of unshakeable will granting +20% XP on all Discipline quests.",
    category: "Discipline",
    xpBonusPercent: 20,
  },
  "badge-dragon-slayer": {
    badgeLabel: "+25% Strength XP",
    effectDescription: "Champion seal of dragonslayers granting +25% XP on all Strength quests.",
    category: "Strength",
    xpBonusPercent: 25,
  },
  "badge-grandmaster": {
    badgeLabel: "+25% Intellect XP",
    effectDescription: "Arcane library seal granting +25% XP on all Intellect quests.",
    category: "Intellect",
    xpBonusPercent: 25,
  },
};

export function getItemPerk(assetKey: string): ItemPerk | undefined {
  return ITEM_PERKS[assetKey];
}

/**
 * Computes active XP and Gold multipliers based on equipped items and current quest category
 */
export function calculateEquippedBonuses(
  inventory: UserInventory[],
  taskCategory: AttributeName,
  hasSpeedBonus: boolean = false
): {
  totalXpMultiplier: number;
  totalGoldMultiplier: number;
  streakProtected: boolean;
  appliedPerks: string[];
} {
  let xpBonusTotal = 0;
  let goldBonusTotal = 0;
  let streakProtected = false;
  const appliedPerks: string[] = [];

  const equippedItems = inventory.filter((inv) => inv.equipped && inv.item);

  for (const inv of equippedItems) {
    const perk = ITEM_PERKS[inv.item!.asset_key];
    if (!perk) continue;

    // Check category XP bonuses
    if (perk.xpBonusPercent) {
      if (perk.category === "all" || perk.category === taskCategory) {
        xpBonusTotal += perk.xpBonusPercent;
        appliedPerks.push(`${inv.item!.name}: +${perk.xpBonusPercent}% XP`);
      } else if (
        inv.item!.asset_key === "gear-celestial-cape" &&
        (taskCategory === "Creativity" || taskCategory === "Social")
      ) {
        xpBonusTotal += perk.xpBonusPercent;
        appliedPerks.push(`${inv.item!.name}: +${perk.xpBonusPercent}% XP`);
      }
    }

    // Speed bonus
    if (perk.speedBonusPercent && hasSpeedBonus) {
      xpBonusTotal += perk.speedBonusPercent;
      appliedPerks.push(`${inv.item!.name}: +${perk.speedBonusPercent}% Speed XP`);
    }

    // Gold bonus
    if (perk.goldBonusPercent) {
      goldBonusTotal += perk.goldBonusPercent;
      appliedPerks.push(`${inv.item!.name}: +${perk.goldBonusPercent}% Gold`);
    }

    // Streak protection
    if (perk.streakProtection) {
      streakProtected = true;
      appliedPerks.push(`${inv.item!.name}: Streak Aegis Active`);
    }
  }

  return {
    totalXpMultiplier: 1 + xpBonusTotal / 100,
    totalGoldMultiplier: 1 + goldBonusTotal / 100,
    streakProtected,
    appliedPerks,
  };
}
