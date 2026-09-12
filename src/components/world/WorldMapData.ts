/**
 * World Map Layout, Buildings, Collision Grid and Theming Data
 */

export const TILE_SIZE = 32;
export const MAP_COLS = 26;
export const MAP_ROWS = 18;
export const WORLD_WIDTH = MAP_COLS * TILE_SIZE; // 832px
export const WORLD_HEIGHT = MAP_ROWS * TILE_SIZE; // 576px

export interface Building {
  id: string;
  name: string;
  subtitle: string;
  type: "house" | "guild" | "shop" | "dojo" | "shrine";
  x: number; // in pixels
  y: number;
  width: number;
  height: number;
  doorX: number;
  doorY: number;
  color: string;
  roofColor: string;
  trimColor: string;
  signIcon: string;
}

export const BUILDINGS: Building[] = [
  {
    id: "house",
    name: "Hero's Sanctuary",
    subtitle: "Inspect character stats & equip gear",
    type: "house",
    x: 64,
    y: 64,
    width: 160,
    height: 128,
    doorX: 144,
    doorY: 192,
    color: "#1E293B",
    roofColor: "#991B1B",
    trimColor: "#F59E0B",
    signIcon: "🏠",
  },
  {
    id: "guild",
    name: "Quest Notice Board",
    subtitle: "Active quests, AI creation & XP rewards",
    type: "guild",
    x: 320,
    y: 48,
    width: 192,
    height: 144,
    doorX: 416,
    doorY: 192,
    color: "#1E293B",
    roofColor: "#1E3A8A",
    trimColor: "#60A5FA",
    signIcon: "📜",
  },
  {
    id: "shop",
    name: "Guild Bazaar & Armory",
    subtitle: "Trade gold for themes, hats & badges",
    type: "shop",
    x: 608,
    y: 64,
    width: 160,
    height: 128,
    doorX: 688,
    doorY: 192,
    color: "#1E293B",
    roofColor: "#065F46",
    trimColor: "#34D399",
    signIcon: "🛒",
  },
  {
    id: "dojo",
    name: "Mastery Training Dojo",
    subtitle: "5 Attribute Disciplines progress",
    type: "dojo",
    x: 96,
    y: 352,
    width: 160,
    height: 128,
    doorX: 176,
    doorY: 352,
    color: "#1E293B",
    roofColor: "#581C87",
    trimColor: "#C084FC",
    signIcon: "⚔️",
  },
  {
    id: "shrine",
    name: "Eternal Streak Shrine",
    subtitle: "Daily activity flame & bonus multipliers",
    type: "shrine",
    x: 576,
    y: 352,
    width: 160,
    height: 128,
    doorX: 656,
    doorY: 352,
    color: "#1E293B",
    roofColor: "#9A3412",
    trimColor: "#FB923C",
    signIcon: "🔥",
  },
];

export interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const OBSTACLES: Obstacle[] = [
  // Outer Borders
  { x: 0, y: 0, width: WORLD_WIDTH, height: 16 },
  { x: 0, y: WORLD_HEIGHT - 16, width: WORLD_WIDTH, height: 16 },
  { x: 0, y: 0, width: 16, height: WORLD_HEIGHT },
  { x: WORLD_WIDTH - 16, y: 0, width: 16, height: WORLD_HEIGHT },

  // Buildings as Solid Collisions
  ...BUILDINGS.map((b) => ({
    x: b.x,
    y: b.y,
    width: b.width,
    height: b.height,
  })),

  // Central Fountain / Landmark
  { x: 384, y: 320, width: 64, height: 64 },

  // Trees / Nature patches
  { x: 256, y: 64, width: 32, height: 64 },
  { x: 544, y: 64, width: 32, height: 64 },
  { x: 32, y: 240, width: 48, height: 48 },
  { x: 752, y: 240, width: 48, height: 48 },
];

/**
 * Checks if a coordinate is walkable (no collision with world borders or buildings).
 */
export function checkCollision(x: number, y: number, playerSize: number = 24): boolean {
  // Boundary check
  if (x < 16 || x + playerSize > WORLD_WIDTH - 16 || y < 16 || y + playerSize > WORLD_HEIGHT - 16) {
    return true;
  }

  // Obstacle checks
  for (const obs of OBSTACLES) {
    if (
      x < obs.x + obs.width &&
      x + playerSize > obs.x &&
      y < obs.y + obs.height &&
      y + playerSize > obs.y
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Checks if player is near any building entrance / interaction hotspot.
 */
export function getNearbyBuilding(x: number, y: number, interactionRadius: number = 44): Building | null {
  const playerCenterX = x + 16;
  const playerCenterY = y + 16;

  for (const b of BUILDINGS) {
    const dist = Math.hypot(playerCenterX - b.doorX, playerCenterY - b.doorY);
    if (dist <= interactionRadius) {
      return b;
    }
  }

  return null;
}
