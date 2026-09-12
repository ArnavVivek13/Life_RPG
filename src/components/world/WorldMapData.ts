/**
 * Sprawling Multi-District City Map Data (Valoria Metropolis)
 * 2400 x 1800 px world space with 6 distinct districts and interactive waypoints.
 */

export const WORLD_WIDTH = 2400;
export const WORLD_HEIGHT = 1800;
export const TILE_SIZE = 32;

export interface Building {
  id: string;
  name: string;
  district: string;
  subtitle: string;
  type: "house" | "guild" | "shop" | "dojo" | "observatory" | "cafe";
  x: number;
  y: number;
  width: number;
  height: number;
  doorX: number;
  doorY: number;
  color: string;
  roofColor: string;
  trimColor: string;
  signIcon: string;
  blipColor: string;
}

export interface EasterEgg {
  id: string;
  name: string;
  type: "cat" | "wishing_well" | "chest" | "monolith" | "dummy";
  x: number;
  y: number;
  width: number;
  height: number;
  icon: string;
  hint: string;
  claimed?: boolean;
}

export interface DistrictZone {
  id: string;
  name: string;
  subtitle: string;
  x: number;
  y: number;
  width: number;
  height: number;
  ambientColor: string;
}

// 6 Expansive City Districts
export const DISTRICT_ZONES: DistrictZone[] = [
  {
    id: "residential",
    name: "Hero's Quarter & Meadows",
    subtitle: "Peaceful residential cottages and hero sanctuary",
    x: 0,
    y: 0,
    width: 800,
    height: 700,
    ambientColor: "#0D2818",
  },
  {
    id: "arcane",
    name: "Arcane Academy & Spire",
    subtitle: "Sanctuary of Intellect, ancient grimoires & celestial observatory",
    x: 800,
    y: 0,
    width: 800,
    height: 700,
    ambientColor: "#170F2E",
  },
  {
    id: "forest",
    name: "Whispering Woods & Ruins",
    subtitle: "Ancient pines, hidden ruins, and forgotten treasure",
    x: 1600,
    y: 0,
    width: 800,
    height: 700,
    ambientColor: "#071B11",
  },
  {
    id: "market",
    name: "Central Guild & Market Square",
    subtitle: "Bustling capital hub, quest board & merchant bazaar",
    x: 400,
    y: 700,
    width: 1200,
    height: 600,
    ambientColor: "#1E293B",
  },
  {
    id: "colosseum",
    name: "Iron Colosseum & Dojo",
    subtitle: "Warrior arena, combat drills & Strength discipline",
    x: 0,
    y: 1100,
    width: 800,
    height: 700,
    ambientColor: "#2A1414",
  },
  {
    id: "artisan",
    name: "Artisan Plaza & Cafe Tavern",
    subtitle: "Creativity music stage, wishing well & social terrace",
    x: 1400,
    y: 1100,
    width: 1000,
    height: 700,
    ambientColor: "#261505",
  },
];

// Sprawling City Buildings
export const BUILDINGS: Building[] = [
  {
    id: "house",
    name: "Hero's Sanctuary",
    district: "Hero's Quarter",
    subtitle: "Inspect character progression & equip gear",
    type: "house",
    x: 200,
    y: 220,
    width: 220,
    height: 180,
    doorX: 310,
    doorY: 400,
    color: "#334155",
    roofColor: "#991B1B",
    trimColor: "#F59E0B",
    signIcon: "🏠",
    blipColor: "#3B82F6",
  },
  {
    id: "observatory",
    name: "Arcane Spire of Intellect",
    district: "Arcane Academy",
    subtitle: "Study, coding, logic & knowledge mastery",
    type: "observatory",
    x: 1050,
    y: 180,
    width: 260,
    height: 220,
    doorX: 1180,
    doorY: 400,
    color: "#1E1B4B",
    roofColor: "#4C1D95",
    trimColor: "#A855F7",
    signIcon: "🔮",
    blipColor: "#A855F7",
  },
  {
    id: "guild",
    name: "Grand Quest Guildhall",
    district: "Central Market",
    subtitle: "Notice board, active quests & AI quest forge",
    type: "guild",
    x: 820,
    y: 720,
    width: 320,
    height: 200,
    doorX: 980,
    doorY: 920,
    color: "#1E293B",
    roofColor: "#1E3A8A",
    trimColor: "#FCD34D",
    signIcon: "📜",
    blipColor: "#F59E0B",
  },
  {
    id: "shop",
    name: "Guild Armory & Bazaar",
    district: "Central Market",
    subtitle: "Trade gold for themes, avatar cosmetics & badges",
    type: "shop",
    x: 1300,
    y: 740,
    width: 260,
    height: 190,
    doorX: 1430,
    doorY: 930,
    color: "#1E293B",
    roofColor: "#065F46",
    trimColor: "#34D399",
    signIcon: "🛒",
    blipColor: "#10B981",
  },

  {
    id: "dojo",
    name: "Iron Colosseum Arena",
    district: "Warrior's Colosseum",
    subtitle: "Gym workouts, athletics & physical strength drills",
    type: "dojo",
    x: 240,
    y: 1300,
    width: 280,
    height: 210,
    doorX: 380,
    doorY: 1300,
    color: "#3F1F1F",
    roofColor: "#7F1D1D",
    trimColor: "#EF4444",
    signIcon: "⚔️",
    blipColor: "#EF4444",
  },
  {
    id: "cafe",
    name: "The Bard's Artisan Cafe",
    district: "Artisan Plaza",
    subtitle: "Creativity studio, music stage & social gatherings",
    type: "cafe",
    x: 1720,
    y: 1280,
    width: 280,
    height: 200,
    doorX: 1860,
    doorY: 1280,
    color: "#2D1D12",
    roofColor: "#78350F",
    trimColor: "#F59E0B",
    signIcon: "☕",
    blipColor: "#F97316",
  },
];

// Interactive Easter Eggs & Secrets in the World
export const EASTER_EGGS: EasterEgg[] = [
  {
    id: "egg-cat",
    name: "Mochi the Village Cat",
    type: "cat",
    x: 460,
    y: 360,
    width: 32,
    height: 32,
    icon: "🐱",
    hint: "Pet the sleepy ginger cat (+5 Social XP)",
  },
  {
    id: "egg-wishing-well",
    name: "Mystic Wishing Well",
    type: "wishing_well",
    x: 1540,
    y: 1400,
    width: 48,
    height: 48,
    icon: "🪙",
    hint: "Toss 5 Gold for a fortune & blessing aura",
  },
  {
    id: "egg-chest",
    name: "Forgotten Forest Cache",
    type: "chest",
    x: 2120,
    y: 280,
    width: 40,
    height: 40,
    icon: "🎁",
    hint: "Open the hidden golden chest (+30 Gold)",
  },
  {
    id: "egg-monolith",
    name: "Ancient Lore Obelisk",
    type: "monolith",
    x: 1860,
    y: 380,
    width: 48,
    height: 72,
    icon: "🗿",
    hint: "Decipher the ancient runes of Valoria",
  },
  {
    id: "egg-dummy",
    name: "Sparring Dummy",
    type: "dummy",
    x: 120,
    y: 1420,
    width: 32,
    height: 48,
    icon: "🥊",
    hint: "Punch the straw dummy (+5 Strength XP)",
  },
];

// Solid Obstacles for Collision
export const OBSTACLES = [
  // World Outer Bounds
  { x: 0, y: 0, width: WORLD_WIDTH, height: 24 },
  { x: 0, y: WORLD_HEIGHT - 24, width: WORLD_WIDTH, height: 24 },
  { x: 0, y: 0, width: 24, height: WORLD_HEIGHT },
  { x: WORLD_WIDTH - 24, y: 0, width: 24, height: WORLD_HEIGHT },

  // Buildings
  ...BUILDINGS.map((b) => ({
    x: b.x,
    y: b.y,
    width: b.width,
    height: b.height,
  })),

  // Central Grand Fountain
  { x: 930, y: 1200, width: 100, height: 100 },

  // Garden Fences in Hero's Quarter
  { x: 100, y: 440, width: 340, height: 16 },
  { x: 100, y: 220, width: 16, height: 220 },

  // Arcane Stargazing Terrace Walls
  { x: 960, y: 140, width: 16, height: 300 },
  { x: 1380, y: 140, width: 16, height: 300 },

  // Colosseum Arena Walls
  { x: 140, y: 1240, width: 480, height: 16 },
  { x: 620, y: 1240, width: 16, height: 340 },

  // Forest Natural Rocks & River
  { x: 1950, y: 0, width: 64, height: 500 },
  { x: 2240, y: 120, width: 120, height: 80 },
];

export function checkCollision(x: number, y: number, playerSize: number = 24): boolean {
  if (x < 24 || x + playerSize > WORLD_WIDTH - 24 || y < 24 || y + playerSize > WORLD_HEIGHT - 24) {
    return true;
  }

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

export function getNearbyBuilding(x: number, y: number, radius: number = 64): Building | null {
  const px = x + 16;
  const py = y + 16;

  for (const b of BUILDINGS) {
    const dist = Math.hypot(px - b.doorX, py - b.doorY);
    if (dist <= radius) {
      return b;
    }
  }
  return null;
}

export function getNearbyEasterEgg(x: number, y: number, radius: number = 48): EasterEgg | null {
  const px = x + 16;
  const py = y + 16;

  for (const egg of EASTER_EGGS) {
    const eggCenterX = egg.x + egg.width / 2;
    const eggCenterY = egg.y + egg.height / 2;
    const dist = Math.hypot(px - eggCenterX, py - eggCenterY);
    if (dist <= radius) {
      return egg;
    }
  }
  return null;
}

export function getCurrentDistrict(x: number, y: number): DistrictZone {
  for (const d of DISTRICT_ZONES) {
    if (x >= d.x && x < d.x + d.width && y >= d.y && y < d.y + d.height) {
      return d;
    }
  }
  return DISTRICT_ZONES[3]; // Central Market default
}
