/**
 * Sprawling Multi-District City Map Data (Valoria Metropolis)
 * 3200 x 2400 px world space — 6 distinct districts, rich interactables, NPCs.
 */

export const WORLD_WIDTH = 3200;
export const WORLD_HEIGHT = 2400;
export const TILE_SIZE = 32;

export interface Building {
  id: string;
  name: string;
  district: string;
  subtitle: string;
  type: "house" | "guild" | "shop" | "dojo" | "observatory" | "cafe" | "inn" | "blacksmith" | "library" | "shrine";
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
  floors?: number;
}

export interface EasterEgg {
  id: string;
  name: string;
  type: "cat" | "wishing_well" | "chest" | "monolith" | "dummy" | "campfire" | "fishing_spot" | "fox" | "telescope" | "bard";
  x: number;
  y: number;
  width: number;
  height: number;
  icon: string;
  hint: string;
  claimed?: boolean;
}

export interface NPC {
  id: string;
  name: string;
  role: string;
  x: number;
  y: number;
  color: string;
  hairColor: string;
  walkPattern: "horizontal" | "vertical" | "circle" | "idle";
  walkRange: number;
  speed: number;
  dialogue: string;
}

export interface WorldDecor {
  type:
    | "tree_oak" | "tree_pine" | "tree_dead" | "tree_cherry"
    | "lamp_post" | "bench" | "barrel" | "sign" | "mailbox"
    | "flower_red" | "flower_blue" | "flower_yellow" | "flower_patch"
    | "bush" | "rock_small" | "rock_large" | "mushroom"
    | "fence_h" | "fence_v" | "fence_corner"
    | "market_stall_red" | "market_stall_blue" | "market_stall_yellow"
    | "fountain_small" | "statue" | "well" | "trough"
    | "hay_bale" | "cart" | "lantern" | "crate" | "torch"
    | "path_stone" | "water_lily" | "pond" | "bridge_h" | "bridge_v"
    | "garden_bed" | "archway" | "windmill" | "tower_small"
    | "ruins_wall" | "moss_rock" | "ancient_pillar";
  x: number;
  y: number;
  w?: number;
  h?: number;
  variant?: number;
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
  groundColor: string;
  accentColor: string;
}

// 6 Expansive City Districts
export const DISTRICT_ZONES: DistrictZone[] = [
  {
    id: "residential",
    name: "Hero's Quarter & Meadows",
    subtitle: "Peaceful residential cottages and hero sanctuary",
    x: 0, y: 0, width: 1067, height: 933,
    ambientColor: "#0D2818",
    groundColor: "#166534",
    accentColor: "#22C55E",
  },
  {
    id: "arcane",
    name: "Arcane Academy & Spire",
    subtitle: "Sanctuary of Intellect, ancient grimoires & celestial observatory",
    x: 1067, y: 0, width: 1067, height: 933,
    ambientColor: "#170F2E",
    groundColor: "#1E1B4B",
    accentColor: "#8B5CF6",
  },
  {
    id: "forest",
    name: "Whispering Woods & Ruins",
    subtitle: "Ancient pines, hidden ruins, and forgotten treasure",
    x: 2134, y: 0, width: 1066, height: 933,
    ambientColor: "#071B11",
    groundColor: "#052E16",
    accentColor: "#16A34A",
  },
  {
    id: "market",
    name: "Central Guild & Market Square",
    subtitle: "Bustling capital hub, quest board & merchant bazaar",
    x: 533, y: 933, width: 1600, height: 800,
    ambientColor: "#1E293B",
    groundColor: "#334155",
    accentColor: "#F59E0B",
  },
  {
    id: "colosseum",
    name: "Iron Colosseum & Dojo",
    subtitle: "Warrior arena, combat drills & Strength discipline",
    x: 0, y: 1467, width: 1067, height: 933,
    ambientColor: "#2A1414",
    groundColor: "#451A03",
    accentColor: "#EF4444",
  },
  {
    id: "artisan",
    name: "Artisan Plaza & Cafe Tavern",
    subtitle: "Creativity music stage, wishing well & social terrace",
    x: 1867, y: 1467, width: 1333, height: 933,
    ambientColor: "#261505",
    groundColor: "#37271E",
    accentColor: "#F97316",
  },
];

// City Buildings (more buildings, accessible doors)
export const BUILDINGS: Building[] = [
  // HERO'S QUARTER
  {
    id: "house",
    name: "Hero's Sanctuary",
    district: "Hero's Quarter",
    subtitle: "Inspect character progression & equip gear",
    type: "house",
    x: 180, y: 200, width: 200, height: 160,
    doorX: 280, doorY: 360, // door at bottom center
    color: "#334155", roofColor: "#991B1B", trimColor: "#F59E0B",
    signIcon: "🏠", blipColor: "#3B82F6", floors: 2,
  },
  {
    id: "inn",
    name: "The Weary Boot Inn",
    district: "Hero's Quarter",
    subtitle: "Rest & restore energy — recover daily tasks",
    type: "inn",
    x: 500, y: 180, width: 220, height: 170,
    doorX: 610, doorY: 350,
    color: "#44403C", roofColor: "#A16207", trimColor: "#FCD34D",
    signIcon: "🍺", blipColor: "#A16207", floors: 2,
  },
  {
    id: "library",
    name: "Grand Library of Lore",
    district: "Hero's Quarter",
    subtitle: "Browse knowledge quests & reading challenges",
    type: "library",
    x: 750, y: 220, width: 220, height: 150,
    doorX: 860, doorY: 370,
    color: "#1C1917", roofColor: "#44403C", trimColor: "#D97706",
    signIcon: "📚", blipColor: "#D97706",
  },

  // ARCANE ACADEMY
  {
    id: "observatory",
    name: "Arcane Spire of Intellect",
    district: "Arcane Academy",
    subtitle: "Study, coding, logic & knowledge mastery",
    type: "observatory",
    x: 1300, y: 160, width: 240, height: 200,
    doorX: 1420, doorY: 360,
    color: "#1E1B4B", roofColor: "#4C1D95", trimColor: "#A855F7",
    signIcon: "🔮", blipColor: "#A855F7", floors: 3,
  },
  {
    id: "shrine",
    name: "Mindfulness Shrine",
    district: "Arcane Academy",
    subtitle: "Meditate for wisdom & mental stat boosts",
    type: "shrine",
    x: 1700, y: 280, width: 180, height: 140,
    doorX: 1790, doorY: 420,
    color: "#0F0A1E", roofColor: "#312E81", trimColor: "#818CF8",
    signIcon: "🧘", blipColor: "#818CF8",
  },

  // WHISPERING WOODS
  {
    id: "forest_hut",
    name: "Ranger's Outpost",
    district: "Whispering Woods",
    subtitle: "Nature quests & outdoor challenge tracking",
    type: "house",
    x: 2350, y: 250, width: 190, height: 150,
    doorX: 2445, doorY: 400,
    color: "#1A2E1A", roofColor: "#365314", trimColor: "#86EFAC",
    signIcon: "🌲", blipColor: "#22C55E",
  },

  // CENTRAL MARKET
  {
    id: "guild",
    name: "Grand Quest Guildhall",
    district: "Central Market",
    subtitle: "Notice board, active quests & AI quest forge",
    type: "guild",
    x: 1000, y: 980, width: 320, height: 210,
    doorX: 1160, doorY: 1190,
    color: "#1E293B", roofColor: "#1E3A8A", trimColor: "#FCD34D",
    signIcon: "📜", blipColor: "#F59E0B", floors: 2,
  },
  {
    id: "shop",
    name: "Guild Armory & Bazaar",
    district: "Central Market",
    subtitle: "Trade gold for themes, avatar cosmetics & badges",
    type: "shop",
    x: 1600, y: 990, width: 260, height: 190,
    doorX: 1730, doorY: 1180,
    color: "#1E293B", roofColor: "#065F46", trimColor: "#34D399",
    signIcon: "🛒", blipColor: "#10B981",
  },
  {
    id: "blacksmith",
    name: "Anvil & Flame Smithy",
    district: "Central Market",
    subtitle: "Forge upgrades & equipment improvements",
    type: "blacksmith",
    x: 700, y: 1000, width: 220, height: 180,
    doorX: 810, doorY: 1180,
    color: "#1C1917", roofColor: "#7C2D12", trimColor: "#FB923C",
    signIcon: "⚒️", blipColor: "#F97316",
  },

  // COLOSSEUM
  {
    id: "dojo",
    name: "Iron Colosseum Arena",
    district: "Warrior's Colosseum",
    subtitle: "Gym workouts, athletics & physical strength drills",
    type: "dojo",
    x: 280, y: 1700, width: 300, height: 230,
    doorX: 430, doorY: 1930,
    color: "#3F1F1F", roofColor: "#7F1D1D", trimColor: "#EF4444",
    signIcon: "⚔️", blipColor: "#EF4444", floors: 2,
  },
  {
    id: "barracks",
    name: "Steel Barracks",
    district: "Warrior's Colosseum",
    subtitle: "Daily workout log & combat challenge board",
    type: "house",
    x: 700, y: 1680, width: 220, height: 160,
    doorX: 810, doorY: 1840,
    color: "#292524", roofColor: "#57534E", trimColor: "#D97706",
    signIcon: "🛡️", blipColor: "#EAB308",
  },

  // ARTISAN PLAZA
  {
    id: "cafe",
    name: "The Bard's Artisan Cafe",
    district: "Artisan Plaza",
    subtitle: "Creativity studio, music stage & social gatherings",
    type: "cafe",
    x: 2200, y: 1680, width: 280, height: 210,
    doorX: 2340, doorY: 1890,
    color: "#2D1D12", roofColor: "#78350F", trimColor: "#F59E0B",
    signIcon: "☕", blipColor: "#F97316", floors: 2,
  },
  {
    id: "studio",
    name: "Canvas & Code Studio",
    district: "Artisan Plaza",
    subtitle: "Creative projects, art & digital skills",
    type: "house",
    x: 2700, y: 1720, width: 240, height: 180,
    doorX: 2820, doorY: 1900,
    color: "#1E1017", roofColor: "#6B21A8", trimColor: "#E879F9",
    signIcon: "🎨", blipColor: "#A855F7",
  },
];

// NPCs roaming the world
export const NPCS: NPC[] = [
  { id: "npc-villager-1", name: "Elara", role: "Village Elder", x: 400, y: 500, color: "#8B5CF6", hairColor: "#F59E0B", walkPattern: "horizontal", walkRange: 200, speed: 0.5, dialogue: "Welcome to Hero's Quarter, brave soul!" },
  { id: "npc-villager-2", name: "Bramble", role: "Farmer", x: 620, y: 620, color: "#65A30D", hairColor: "#92400E", walkPattern: "vertical", walkRange: 150, speed: 0.4, dialogue: "The harvest is good this season." },
  { id: "npc-merchant", name: "Casha", role: "Traveling Merchant", x: 1200, y: 1100, color: "#F59E0B", hairColor: "#7C3AED", walkPattern: "horizontal", walkRange: 300, speed: 0.8, dialogue: "Rare wares from distant lands! Step right up!" },
  { id: "npc-guard-1", name: "Theron", role: "City Guard", x: 1400, y: 1050, color: "#475569", hairColor: "#1C1917", walkPattern: "vertical", walkRange: 100, speed: 0.3, dialogue: "Keep the peace, citizen." },
  { id: "npc-scholar", name: "Lyss", role: "Arcane Scholar", x: 1500, y: 400, color: "#6D28D9", hairColor: "#FDE68A", walkPattern: "circle", walkRange: 80, speed: 0.6, dialogue: "The stars whisper secrets tonight..." },
  { id: "npc-warrior", name: "Grimholt", role: "Arena Champion", x: 450, y: 1800, color: "#B91C1C", hairColor: "#1C1917", walkPattern: "horizontal", walkRange: 180, speed: 0.7, dialogue: "Only the strong endure." },
  { id: "npc-bard-npc", name: "Pip", role: "Wandering Bard", x: 2300, y: 1900, color: "#EC4899", hairColor: "#FCD34D", walkPattern: "circle", walkRange: 120, speed: 1.0, dialogue: "🎵 La la la, adventures await! 🎵" },
  { id: "npc-ranger", name: "Fern", role: "Forest Ranger", x: 2500, y: 500, color: "#16A34A", hairColor: "#A16207", walkPattern: "vertical", walkRange: 200, speed: 0.5, dialogue: "The woods hold ancient secrets." },
  { id: "npc-smith", name: "Gorrik", role: "Blacksmith", x: 810, y: 1210, color: "#78350F", hairColor: "#292524", walkPattern: "idle", walkRange: 0, speed: 0, dialogue: "Finest steel in all of Valoria!" },
  { id: "npc-child", name: "Tomo", role: "Village Kid", x: 320, y: 600, color: "#FCD34D", hairColor: "#92400E", walkPattern: "circle", walkRange: 80, speed: 1.2, dialogue: "Race you to the fountain!" },
];

// Interactive Easter Eggs & Secrets
export const EASTER_EGGS: EasterEgg[] = [
  { id: "egg-cat", name: "Mochi the Village Cat", type: "cat", x: 520, y: 480, width: 32, height: 32, icon: "🐱", hint: "Pet the friendly ginger cat (Purrs happily!)" },
  { id: "egg-wishing-well", name: "Mystic Wishing Well", type: "wishing_well", x: 2020, y: 1900, width: 48, height: 48, icon: "🪙", hint: "Toss 5 Gold for a fortune & blessing aura" },
  { id: "egg-chest", name: "Forgotten Forest Cache", type: "chest", x: 2800, y: 380, width: 40, height: 40, icon: "🎁", hint: "Open the hidden forest chest (+30 Gold)" },
  { id: "egg-monolith", name: "Ancient Lore Obelisk", type: "monolith", x: 2500, y: 500, width: 48, height: 72, icon: "🗿", hint: "Decipher the ancient runes of Valoria" },
  { id: "egg-dummy", name: "Sparring Dummy", type: "dummy", x: 170, y: 1900, width: 32, height: 48, icon: "🥊", hint: "Practice strike combinations on the training dummy" },
  { id: "egg-campfire", name: "Adventurer's Campfire", type: "campfire", x: 2850, y: 650, width: 40, height: 40, icon: "🔥", hint: "Rest by the warm crackling campfire" },
  { id: "egg-fishing", name: "Tranquil Fishing Spot", type: "fishing_spot", x: 180, y: 1200, width: 48, height: 48, icon: "🎣", hint: "Enjoy the peaceful river currents" },
  { id: "egg-fox", name: "Ember the Magic Fox", type: "fox", x: 2100, y: 780, width: 40, height: 32, icon: "🦊", hint: "Follow the playful fox along the forest path" },
  { id: "egg-telescope", name: "Celestial Telescope", type: "telescope", x: 1600, y: 200, width: 48, height: 56, icon: "🔭", hint: "Gaze at the constellations in the clear night sky" },
  { id: "egg-bard", name: "Wandering Bard Stage", type: "bard", x: 2450, y: 1850, width: 64, height: 48, icon: "🎸", hint: "Listen to an inspiring ballad played by the wandering bard" },
];

// World decoration objects — the visual richness of the map
export const WORLD_DECOR: WorldDecor[] = [
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // HERO'S QUARTER — Trees, gardens, fences
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { type: "tree_oak", x: 60, y: 60 },
  { type: "tree_oak", x: 120, y: 80 },
  { type: "tree_cherry", x: 80, y: 400 },
  { type: "tree_cherry", x: 140, y: 460 },
  { type: "tree_oak", x: 60, y: 650 },
  { type: "tree_oak", x: 120, y: 700 },
  { type: "tree_oak", x: 60, y: 780 },
  { type: "fence_h", x: 140, y: 560, w: 100 },
  { type: "fence_h", x: 340, y: 560, w: 100 },
  { type: "fence_h", x: 140, y: 220, w: 60 },
  { type: "fence_v", x: 140, y: 220, h: 340 },
  { type: "fence_h", x: 440, y: 220, w: 60 },
  { type: "fence_v", x: 440, y: 220, h: 340 },
  { type: "garden_bed", x: 160, y: 450, w: 120 },
  { type: "garden_bed", x: 300, y: 470, w: 100 },
  { type: "flower_red", x: 170, y: 480 },
  { type: "flower_red", x: 200, y: 460 },
  { type: "flower_blue", x: 230, y: 480 },
  { type: "flower_yellow", x: 320, y: 490 },
  { type: "flower_patch", x: 350, y: 480, w: 80 },
  { type: "bench", x: 430, y: 600 },
  { type: "bench", x: 650, y: 700 },
  { type: "lamp_post", x: 140, y: 350 },
  { type: "lamp_post", x: 440, y: 350 },
  { type: "lamp_post", x: 660, y: 600 },
  { type: "mailbox", x: 160, y: 370 },
  { type: "mailbox", x: 480, y: 375 },
  { type: "mailbox", x: 720, y: 390 },
  { type: "tree_oak", x: 680, y: 140 },
  { type: "tree_oak", x: 730, y: 200 },
  { type: "tree_cherry", x: 690, y: 470 },
  { type: "flower_red", x: 660, y: 550 },
  { type: "flower_blue", x: 700, y: 560 },
  { type: "rock_small", x: 760, y: 700 },
  { type: "rock_small", x: 790, y: 720 },
  { type: "mushroom", x: 780, y: 680 },
  // Path stones through hero's quarter
  { type: "path_stone", x: 220, y: 360, w: 16 },
  { type: "path_stone", x: 240, y: 360, w: 16 },
  { type: "path_stone", x: 260, y: 360, w: 16 },
  { type: "path_stone", x: 280, y: 360, w: 16 },
  { type: "path_stone", x: 300, y: 360, w: 16 },
  { type: "path_stone", x: 320, y: 360, w: 16 },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ARCANE ACADEMY — Mystical atmosphere
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { type: "ancient_pillar", x: 1100, y: 100 },
  { type: "ancient_pillar", x: 1200, y: 100 },
  { type: "ancient_pillar", x: 2050, y: 100 },
  { type: "ancient_pillar", x: 1950, y: 100 },
  { type: "lamp_post", x: 1200, y: 300 },
  { type: "lamp_post", x: 1600, y: 300 },
  { type: "lamp_post", x: 1200, y: 700 },
  { type: "lamp_post", x: 1600, y: 700 },
  { type: "tree_dead", x: 1090, y: 500 },
  { type: "tree_dead", x: 2000, y: 500 },
  { type: "tree_dead", x: 1090, y: 700 },
  { type: "moss_rock", x: 1150, y: 600 },
  { type: "moss_rock", x: 1980, y: 620 },
  { type: "ancient_pillar", x: 1350, y: 780 },
  { type: "ancient_pillar", x: 1850, y: 780 },
  { type: "ruins_wall", x: 1080, y: 800, w: 200 },
  { type: "ruins_wall", x: 1920, y: 800, w: 140 },
  { type: "archway", x: 1200, y: 900 },
  { type: "archway", x: 1800, y: 900 },
  { type: "bench", x: 1400, y: 680 },
  { type: "bench", x: 1700, y: 680 },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // WHISPERING WOODS — Dense forest
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { type: "tree_pine", x: 2160, y: 60 },
  { type: "tree_pine", x: 2220, y: 40 },
  { type: "tree_pine", x: 2280, y: 80 },
  { type: "tree_pine", x: 2160, y: 180 },
  { type: "tree_pine", x: 2220, y: 160 },
  { type: "tree_pine", x: 2660, y: 60 },
  { type: "tree_pine", x: 2720, y: 80 },
  { type: "tree_pine", x: 2780, y: 40 },
  { type: "tree_pine", x: 2840, y: 80 },
  { type: "tree_pine", x: 2900, y: 60 },
  { type: "tree_pine", x: 2960, y: 100 },
  { type: "tree_pine", x: 3020, y: 60 },
  { type: "tree_pine", x: 3080, y: 80 },
  { type: "tree_pine", x: 3140, y: 40 },
  { type: "tree_pine", x: 2660, y: 200 },
  { type: "tree_pine", x: 2720, y: 180 },
  { type: "tree_pine", x: 2780, y: 220 },
  { type: "tree_pine", x: 2840, y: 200 },
  { type: "tree_pine", x: 2900, y: 180 },
  { type: "tree_oak", x: 2440, y: 700 },
  { type: "tree_oak", x: 2500, y: 720 },
  { type: "tree_oak", x: 2560, y: 700 },
  { type: "tree_oak", x: 2200, y: 650 },
  { type: "tree_oak", x: 2250, y: 700 },
  { type: "tree_dead", x: 3050, y: 650 },
  { type: "tree_dead", x: 3100, y: 720 },
  { type: "moss_rock", x: 2200, y: 360 },
  { type: "moss_rock", x: 2600, y: 400 },
  { type: "moss_rock", x: 2900, y: 500 },
  { type: "moss_rock", x: 3000, y: 700 },
  { type: "rock_large", x: 3050, y: 400 },
  { type: "rock_large", x: 3100, y: 450 },
  { type: "mushroom", x: 2250, y: 480 },
  { type: "mushroom", x: 2600, y: 550 },
  { type: "mushroom", x: 2900, y: 430 },
  { type: "ruins_wall", x: 2920, y: 780, w: 200 },
  { type: "ruins_wall", x: 3100, y: 640, w: 100 },
  { type: "ancient_pillar", x: 3020, y: 700 },
  { type: "ancient_pillar", x: 3080, y: 700 },
  { type: "flower_blue", x: 2450, y: 600 },
  { type: "flower_blue", x: 2480, y: 620 },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // CENTRAL MARKET — Busy plaza
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { type: "market_stall_red", x: 600, y: 1050 },
  { type: "market_stall_blue", x: 660, y: 1050 },
  { type: "market_stall_yellow", x: 720, y: 1050 },
  { type: "market_stall_red", x: 1380, y: 1050 },
  { type: "market_stall_blue", x: 1440, y: 1050 },
  { type: "market_stall_yellow", x: 1500, y: 1050 },
  { type: "market_stall_red", x: 1900, y: 1100 },
  { type: "market_stall_blue", x: 1960, y: 1100 },
  { type: "lamp_post", x: 620, y: 950 },
  { type: "lamp_post", x: 900, y: 950 },
  { type: "lamp_post", x: 1400, y: 950 },
  { type: "lamp_post", x: 1900, y: 950 },
  { type: "lamp_post", x: 620, y: 1600 },
  { type: "lamp_post", x: 900, y: 1600 },
  { type: "lamp_post", x: 1400, y: 1600 },
  { type: "lamp_post", x: 1900, y: 1600 },
  { type: "crate", x: 570, y: 1080 },
  { type: "crate", x: 590, y: 1070 },
  { type: "barrel", x: 950, y: 1060 },
  { type: "barrel", x: 970, y: 1070 },
  { type: "barrel", x: 1960, y: 1180 },
  { type: "cart", x: 560, y: 1150 },
  { type: "cart", x: 1380, y: 1150 },
  { type: "bench", x: 1080, y: 1650 },
  { type: "bench", x: 1200, y: 1650 },
  { type: "bench", x: 1600, y: 1650 },
  { type: "statue", x: 1070, y: 1540 },
  { type: "tree_oak", x: 580, y: 1250 },
  { type: "tree_oak", x: 1960, y: 1260 },
  { type: "flower_yellow", x: 1070, y: 1300 },
  { type: "flower_yellow", x: 1090, y: 1310 },
  { type: "flower_red", x: 1700, y: 1300 },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // COLOSSEUM — Warrior zone
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { type: "tree_dead", x: 100, y: 1550 },
  { type: "tree_dead", x: 180, y: 1600 },
  { type: "rock_large", x: 120, y: 1800 },
  { type: "rock_large", x: 170, y: 1850 },
  { type: "hay_bale", x: 680, y: 1750 },
  { type: "hay_bale", x: 720, y: 1760 },
  { type: "hay_bale", x: 200, y: 1900 },
  { type: "barrel", x: 660, y: 1900 },
  { type: "barrel", x: 680, y: 1910 },
  { type: "torch", x: 220, y: 1700 },
  { type: "torch", x: 630, y: 1700 },
  { type: "torch", x: 220, y: 2000 },
  { type: "torch", x: 630, y: 2000 },
  { type: "lamp_post", x: 140, y: 1600 },
  { type: "lamp_post", x: 670, y: 1600 },
  // North entrance gateway
  { type: "fence_h", x: 100, y: 1640, w: 240 },
  { type: "archway", x: 350, y: 1610 },
  { type: "fence_h", x: 460, y: 1640, w: 240 },
  // South entrance gateway
  { type: "fence_h", x: 100, y: 2100, w: 240 },
  { type: "archway", x: 350, y: 2070 },
  { type: "fence_h", x: 460, y: 2100, w: 240 },
  { type: "fence_v", x: 100, y: 1640, h: 460 },
  { type: "fence_v", x: 700, y: 1640, h: 460 },
  { type: "rock_small", x: 860, y: 1700 },
  { type: "rock_small", x: 890, y: 1720 },
  { type: "rock_small", x: 920, y: 1700 },
  { type: "tree_dead", x: 930, y: 1550 },
  { type: "tree_dead", x: 980, y: 1600 },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ARTISAN PLAZA — Creative & cozy
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { type: "tree_cherry", x: 1900, y: 1550 },
  { type: "tree_cherry", x: 1960, y: 1580 },
  { type: "tree_cherry", x: 2020, y: 1560 },
  { type: "tree_cherry", x: 3050, y: 1600 },
  { type: "tree_cherry", x: 3100, y: 1640 },
  { type: "flower_red", x: 1940, y: 1660 },
  { type: "flower_red", x: 1970, y: 1680 },
  { type: "flower_yellow", x: 2000, y: 1670 },
  { type: "flower_patch", x: 3000, y: 1700, w: 120 },
  { type: "bench", x: 2000, y: 2000 },
  { type: "bench", x: 2100, y: 2050 },
  { type: "bench", x: 3000, y: 2050 },
  { type: "lamp_post", x: 1920, y: 1800 },
  { type: "lamp_post", x: 2600, y: 1800 },
  { type: "lamp_post", x: 3150, y: 1800 },
  { type: "market_stall_yellow", x: 2050, y: 1800 },
  { type: "market_stall_red", x: 2680, y: 1850 },
  { type: "crate", x: 2040, y: 1830 },
  { type: "barrel", x: 2060, y: 1840 },
  { type: "trough", x: 3000, y: 1900 },
  { type: "garden_bed", x: 1900, y: 2100, w: 160 },
  { type: "flower_blue", x: 1920, y: 2120 },
  { type: "flower_yellow", x: 1960, y: 2120 },
  { type: "tree_cherry", x: 1900, y: 2200 },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // RIVER / POND — connecting areas
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { type: "pond", x: 60, y: 1100, w: 140, h: 80 },
  { type: "water_lily", x: 90, y: 1120 },
  { type: "water_lily", x: 130, y: 1140 },
  { type: "bridge_h", x: 62, y: 1168, w: 140 },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // WORLD ROADS — connecting districts
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { type: "lamp_post", x: 1060, y: 880 },
  { type: "lamp_post", x: 1060, y: 1460 },
  { type: "lamp_post", x: 2130, y: 880 },
  { type: "lamp_post", x: 2130, y: 1460 },

  // Windmill in hero's quarter
  { type: "windmill", x: 850, y: 680 },

  // Small tower in arcane
  { type: "tower_small", x: 2020, y: 200 },
];

// Collision obstacles (simplified from buildings + key walls)
export const OBSTACLES = [
  // World Outer Bounds
  { x: 0, y: 0, width: WORLD_WIDTH, height: 24 },
  { x: 0, y: WORLD_HEIGHT - 24, width: WORLD_WIDTH, height: 24 },
  { x: 0, y: 0, width: 24, height: WORLD_HEIGHT },
  { x: WORLD_WIDTH - 24, y: 0, width: 24, height: WORLD_HEIGHT },

  // All building footprints including roofs (preventing walking through roofs or walls)
  ...BUILDINGS.map((b) => {
    const roofH = 32 + ((b.floors || 1) - 1) * 8;
    return {
      x: b.x - 2,
      y: b.y - roofH + 6,
      width: b.width + 4,
      height: b.height + roofH - 16, // allows walking up to the door threshold
    };
  }),

  // Pond
  { x: 60, y: 1100, width: 140, height: 80 },

  // Forest rock cluster (whispering woods)
  { x: 3050, y: 390, width: 110, height: 80 },
  { x: 2900, y: 480, width: 80, height: 60 },

  // Colosseum fence walls — NOTE: gaps left for doorways at y=1640 and y=2100 center (x=340..460)
  { x: 100, y: 1640, width: 240, height: 16 },
  { x: 460, y: 1640, width: 240, height: 16 },
  { x: 100, y: 2100, width: 240, height: 16 },
  { x: 460, y: 2100, width: 240, height: 16 },
  { x: 100, y: 1640, width: 16, height: 460 },
  { x: 700, y: 1640, width: 16, height: 460 },

  // Central fountain (market)
  { x: 1100, y: 1380, width: 130, height: 130 },
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

export function getNearbyBuilding(x: number, y: number, radius: number = 72): Building | null {
  const px = x + 16;
  const py = y + 16;
  for (const b of BUILDINGS) {
    const dist = Math.hypot(px - b.doorX, py - b.doorY);
    if (dist <= radius) return b;
  }
  return null;
}

export function getNearbyEasterEgg(x: number, y: number, radius: number = 56): EasterEgg | null {
  const px = x + 16;
  const py = y + 16;
  for (const egg of EASTER_EGGS) {
    const cx = egg.x + egg.width / 2;
    const cy = egg.y + egg.height / 2;
    if (Math.hypot(px - cx, py - cy) <= radius) return egg;
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
