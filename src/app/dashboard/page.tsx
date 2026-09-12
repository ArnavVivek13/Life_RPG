"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Profile, Attribute, Task, UserInventory, ShopItem } from "@/types/database.types";
import { completeTaskAction } from "@/app/actions/game";
import WorldMap from "@/components/world/WorldMap";
import WorldHUD from "@/components/world/WorldHUD";
import { Building, EasterEgg, DistrictZone, DISTRICT_ZONES, BUILDINGS } from "@/components/world/WorldMapData";
import CharacterCard from "@/components/character/CharacterCard";
import AttributeStats from "@/components/character/AttributeStats";
import TaskList from "@/components/tasks/TaskList";
import CreateTaskModal from "@/components/tasks/CreateTaskModal";
import ShopGrid from "@/components/shop/ShopGrid";
import InventoryGrid from "@/components/shop/InventoryGrid";
import LevelUpModal from "@/components/ui/LevelUpModal";
import confetti from "canvas-confetti";
import { 
  X, 
  Sparkles, 
  ShoppingBag, 
  Package, 
  Heart, 
  Coins, 
  BookOpen, 
  Hammer, 
  Flame, 
  ShieldCheck, 
  Beer, 
  CheckCircle2, 
  ShieldAlert 
} from "lucide-react";

// Mock Fallback Data
const DEFAULT_PROFILE: Profile = {
  id: "guest-user",
  username: "Hero of Valoria",
  avatar_url: null,
  total_xp: 140,
  gold: 150,
  current_theme: "default",
  streak_count: 3,
  last_active_date: new Date().toISOString().split("T")[0],
  created_at: new Date().toISOString(),
};

const DEFAULT_ATTRIBUTES: Attribute[] = [
  { user_id: "guest-user", name: "Intellect", xp: 60, level: 1 },
  { user_id: "guest-user", name: "Strength", xp: 40, level: 1 },
  { user_id: "guest-user", name: "Discipline", xp: 30, level: 1 },
  { user_id: "guest-user", name: "Creativity", xp: 10, level: 1 },
  { user_id: "guest-user", name: "Social", xp: 0, level: 1 },
];

const DEFAULT_TASKS: Task[] = [
  {
    id: "demo-task-1",
    user_id: "guest-user",
    title: "Read 25 pages of Computer Science literature",
    description: "Focus on non-linear algorithms and system architecture",
    category: "Intellect",
    base_xp: 20,
    difficulty: "medium",
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 4).toISOString(),
    status: "pending",
    completed_at: null,
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: "demo-task-2",
    user_id: "guest-user",
    title: "Complete 45 min strength training workout",
    description: "Push-ups, squats, and core conditioning",
    category: "Strength",
    base_xp: 35,
    difficulty: "hard",
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    status: "pending",
    completed_at: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: "demo-task-3",
    user_id: "guest-user",
    title: "Clean and organize work sanctuary",
    description: "Tidy up study desk and file papers",
    category: "Discipline",
    base_xp: 10,
    difficulty: "easy",
    deadline: null,
    status: "completed",
    completed_at: new Date().toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
];

const DEFAULT_SHOP_ITEMS: ShopItem[] = [
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
    description: "A mysterious hood woven from enchanted starlight silk.",
  },
  {
    id: "b2222222-2222-2222-2222-222222222222",
    name: "Golden Crown",
    type: "avatar_item",
    cost: 500,
    asset_key: "gear-golden-crown",
    description: "Forged from pure aurum for true champions of discipline.",
  },
  {
    id: "b3333333-3333-3333-3333-333333333333",
    name: "Dragonfang Broadsword",
    type: "avatar_item",
    cost: 350,
    asset_key: "gear-dragon-blade",
    description: "A legendary blade forged in dragon flame, sheathed at your hip ready for battle.",
  },
  {
    id: "b4444444-4444-4444-4444-444444444444",
    name: "Lionheart Aegis Shield",
    type: "avatar_item",
    cost: 275,
    asset_key: "gear-knight-shield",
    description: "An ornate royal heater shield bearing the golden lion crest of the high kingdom.",
  },
  {
    id: "b5555555-5555-5555-5555-555555555555",
    name: "Shadowstalker Ranger Cowl",
    type: "avatar_item",
    cost: 220,
    asset_key: "gear-ranger-cowl",
    description: "A stealthy forest ranger cowl fitted with an emerald hawk plume feather.",
  },
  {
    id: "b6666666-6666-6666-6666-666666666666",
    name: "Celestial Archmage Cape",
    type: "avatar_item",
    cost: 400,
    asset_key: "gear-celestial-cape",
    description: "A flowing royal midnight-blue cape lined with starlight embroidery and gold trims.",
  },

  // ── BADGES & RELICS ──
  {
    id: "c1111111-1111-1111-1111-111111111111",
    name: "Early Quester Badge",
    type: "badge",
    cost: 50,
    asset_key: "badge-early-quester",
    description: "Conferred upon the brave souls who embark on their life journey.",
  },
  {
    id: "c2222222-2222-2222-2222-222222222222",
    name: "Iron Will Discipline Crest",
    type: "badge",
    cost: 120,
    asset_key: "badge-iron-will",
    description: "Proof of unshakeable mental discipline and consecutive habit completion.",
  },
  {
    id: "c3333333-3333-3333-3333-333333333333",
    name: "Dragon Slayer Champion Seal",
    type: "badge",
    cost: 450,
    asset_key: "badge-dragon-slayer",
    description: "The highest medal of honor, awarded only to conquerors of the realm's fiercest trials.",
  },
  {
    id: "c4444444-4444-4444-4444-444444444444",
    name: "Grandmaster Scholar Seal",
    type: "badge",
    cost: 250,
    asset_key: "badge-grandmaster",
    description: "Bestowed upon scholarly adventurers who unlock great wisdom in the arcane library.",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  const [viewMode, setViewMode] = useState<"world" | "classic">("world");
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [attributes, setAttributes] = useState<Attribute[]>(DEFAULT_ATTRIBUTES);
  const [tasks, setTasks] = useState<Task[]>(DEFAULT_TASKS);
  const [inventory, setInventory] = useState<UserInventory[]>([]);
  const [shopItems, setShopItems] = useState<ShopItem[]>(DEFAULT_SHOP_ITEMS);

  // Active Building & Easter Egg states
  const [activeBuilding, setActiveBuilding] = useState<Building | null>(null);
  const [nearbyBuilding, setNearbyBuilding] = useState<Building | null>(null);
  const [nearbyEgg, setNearbyEgg] = useState<EasterEgg | null>(null);
  const [currentDistrict, setCurrentDistrict] = useState<DistrictZone>(DISTRICT_ZONES[3]);
  const [activeEasterEggDialog, setActiveEasterEggDialog] = useState<EasterEgg | null>(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [shopTab, setShopTab] = useState<"armory" | "backpack">("armory");

  // Easter Egg claim tracker
  const [claimedEggs, setClaimedEggs] = useState<{ [key: string]: boolean }>({});

  // Level up celebrate modal
  const [levelUpData, setLevelUpData] = useState<{
    isOpen: boolean;
    newLevel: number;
    awardedXp: number;
    awardedGold: number;
    category?: string;
  }>({
    isOpen: false,
    newLevel: 1,
    awardedXp: 0,
    awardedGold: 0,
  });

  // Anvil & Flame Smithy state
  const [anvilStrikes, setAnvilStrikes] = useState(0);
  const [forgeBuffs, setForgeBuffs] = useState<{
    honedBlade: boolean;
    streakShield: boolean;
    dragonfire: boolean;
  }>({
    honedBlade: false,
    streakShield: false,
    dragonfire: false,
  });
  const [forgeFeedback, setForgeFeedback] = useState<string | null>(null);
  const [innRestored, setInnRestored] = useState(false);
  const [libraryStudied, setLibraryStudied] = useState(false);
  const [shrineBlessed, setShrineBlessed] = useState(false);

  // Synthesize metallic anvil strike ring
  const playAnvilSound = useCallback(() => {
    if (typeof window === "undefined") return;
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    try {
      const ctx = new AudioCtx();
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(1400, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.18);
      gain1.gain.setValueAtTime(0.25, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.28);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(2600, ctx.currentTime);
      gain2.gain.setValueAtTime(0.15, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start();
      osc2.stop(ctx.currentTime + 0.35);
    } catch {}
  }, []);

  const handleAnvilStrike = () => {
    playAnvilSound();
    confetti({
      particleCount: 25,
      spread: 55,
      origin: { y: 0.6 },
      colors: ["#F97316", "#F59E0B", "#EF4444", "#FDE047"],
    });
    setAnvilStrikes((prev) => {
      const next = prev + 1;
      if (next % 3 === 0) {
        setForgeFeedback("🔥 Masterwork Strike! The metal rings true with expert craftsmanship!");
      } else {
        setForgeFeedback("⚒️ *CLANG!* White-hot sparks scatter across the anvil!");
      }
      return next;
    });
  };

  const handleBuyForgeBuff = (
    buffType: "honedBlade" | "streakShield" | "dragonfire",
    cost: number,
    description: string
  ) => {
    if (profile.gold < cost) {
      setForgeFeedback(`❌ Not enough gold! You need ${cost} G.`);
      return;
    }
    setProfile((prev) => ({ ...prev, gold: prev.gold - cost }));
    setForgeBuffs((prev) => ({ ...prev, [buffType]: true }));
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.5 },
      colors: ["#F59E0B", "#F97316", "#EF4444", "#FFFFFF"],
    });
    setForgeFeedback(`✨ ${description}`);
  };

  // Load User Data
  const loadUserData = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { data: items } = await supabase.from("shop_items").select("*");
      if (items && items.length > 0) setShopItems(items);

      if (!user) return;

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (profileData) setProfile(profileData);

      const { data: attrData } = await supabase
        .from("attributes")
        .select("*")
        .eq("user_id", user.id);

      if (attrData && attrData.length > 0) setAttributes(attrData);

      const { data: tasksData } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (tasksData) setTasks(tasksData);

      const { data: invData } = await supabase
        .from("user_inventory")
        .select("*, item:shop_items(*)")
        .eq("user_id", user.id);

      if (invData) setInventory(invData);
    } catch (err) {
      console.error("Error loading user data:", err);
    }
  }, [supabase]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // Handle Quest Completion
  const handleCompleteTask = async (task: Task) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id
          ? { ...t, status: "completed", completed_at: new Date().toISOString() }
          : t
      )
    );

    const result = await completeTaskAction(task.id);

    if (result.success && result.data) {
      const { awarded_xp, awarded_gold, new_total_xp, new_level } = result.data;
      setProfile((prev) => ({
        ...prev,
        total_xp: new_total_xp || prev.total_xp + awarded_xp,
        gold: prev.gold + awarded_gold,
      }));

      setAttributes((prev) =>
        prev.map((a) =>
          a.name === task.category ? { ...a, xp: a.xp + awarded_xp } : a
        )
      );

      setLevelUpData({
        isOpen: true,
        newLevel: new_level || 1,
        awardedXp: awarded_xp || task.base_xp,
        awardedGold: awarded_gold || 10,
        category: task.category,
      });
    } else {
      const xp = task.base_xp;
      const gold = Math.max(5, Math.round(xp * 0.5));
      const newTotal = profile.total_xp + xp;
      const newLvl = Math.floor(1 + Math.log(1 + (newTotal * 0.15) / 100) / Math.log(1.15));

      setProfile((prev) => ({
        ...prev,
        total_xp: newTotal,
        gold: prev.gold + gold,
      }));

      setLevelUpData({
        isOpen: true,
        newLevel: Math.max(1, newLvl),
        awardedXp: xp,
        awardedGold: gold,
        category: task.category,
      });
    }
  };

  // Easter Egg Interaction
  const handleEasterEggTrigger = (egg: EasterEgg) => {
    setActiveEasterEggDialog(egg);

    if (egg.type === "cat") {
      // Petting Mochi gives cute heart confetti, no free XP
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 }, colors: ["#EC4899", "#F43F5E"] });
    } else if (egg.type === "dummy") {
      // Striking dummy gives battle spark confetti, no free XP
      confetti({ particleCount: 20, spread: 40, origin: { y: 0.7 }, colors: ["#EF4444", "#F59E0B"] });
    } else if (egg.type === "chest" && !claimedEggs[egg.id]) {
      // Award +30 Gold
      setProfile((prev) => ({ ...prev, gold: prev.gold + 30 }));
      setClaimedEggs((prev) => ({ ...prev, [egg.id]: true }));
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 }, colors: ["#F59E0B", "#FDE68A"] });
    } else if (egg.type === "wishing_well") {
      if (profile.gold >= 5) {
        setProfile((prev) => ({ ...prev, gold: prev.gold - 5 }));
      }
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const hasCrown = inventory.some((i) => i.equipped && i.item?.asset_key === "gear-golden-crown");
  const hasHood = inventory.some((i) => i.equipped && i.item?.asset_key === "gear-mage-hood");
  const hasSword = inventory.some((i) => i.equipped && i.item?.asset_key === "gear-dragon-blade");
  const hasShield = inventory.some((i) => i.equipped && i.item?.asset_key === "gear-knight-shield");
  const hasCape = inventory.some((i) => i.equipped && i.item?.asset_key === "gear-celestial-cape");
  const hasCowl = inventory.some((i) => i.equipped && i.item?.asset_key === "gear-ranger-cowl");

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0E14] via-[#121722] to-[#0B0E14] text-slate-100 p-3 sm:p-6 select-none">
      <div className="max-w-6xl mx-auto space-y-4">
        
        {/* Top HUD Bar */}
        <WorldHUD
          profile={profile}
          viewMode={viewMode}
          onToggleViewMode={() => setViewMode((v) => (v === "world" ? "classic" : "world"))}
          nearbyBuilding={nearbyBuilding}
          nearbyEasterEgg={nearbyEgg}
          currentDistrict={currentDistrict}
          activeWaypoint={null}
          onInteract={() => {
            if (nearbyBuilding) setActiveBuilding(nearbyBuilding);
            else if (nearbyEgg) handleEasterEggTrigger(nearbyEgg);
          }}
          onOpenShop={() => {
            const shopBld = BUILDINGS.find((b) => b.id === "shop") || BUILDINGS[3];
            setActiveBuilding(shopBld);
          }}
          onSignOut={handleSignOut}
        />

        {/* VIEW 1: Sprawling 2D World Map with Scrolling Viewport & GTA Radar */}
        {viewMode === "world" ? (
          <div className="w-full flex justify-center animate-in fade-in duration-300">
            <WorldMap
              theme={profile.current_theme}
              hasCrown={hasCrown}
              hasHood={hasHood}
              hasSword={hasSword}
              hasShield={hasShield}
              hasCape={hasCape}
              hasCowl={hasCowl}
              userGold={profile.gold}
              onEnterBuilding={(bld) => setActiveBuilding(bld)}
              onEasterEggTrigger={handleEasterEggTrigger}
              onNearbyBuildingChange={(bld) => setNearbyBuilding(bld)}
              onNearbyEasterEggChange={(egg) => setNearbyEgg(egg)}
              onDistrictChange={(dist) => setCurrentDistrict(dist)}
            />
          </div>
        ) : (
          /* VIEW 2: Classic Tabbed Dashboard */
          <div className="space-y-6 animate-in fade-in duration-300">
            <CharacterCard profile={profile} inventory={inventory} />
            <AttributeStats attributes={attributes} />
            <div className="space-y-3">
              <h2 className="text-base font-bold font-title text-slate-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Active Quests & Notice Board</span>
              </h2>
              <TaskList
                tasks={tasks}
                onCompleteTask={handleCompleteTask}
                onDeleteTask={handleDeleteTask}
                onOpenCreateModal={() => setIsCreateOpen(true)}
              />
            </div>
          </div>
        )}

      </div>

      {/* BUILDING INTERACTION MODAL */}
      {activeBuilding && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-150"
        >
          <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto pixel-box p-5 sm:p-7 rounded-2xl bg-slate-900 border-2 border-slate-700 shadow-2xl space-y-5 relative">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{activeBuilding.signIcon}</span>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold font-title text-rpg-goldLight">
                    {activeBuilding.name}
                  </h2>
                  <p className="text-xs text-slate-400 font-body">
                    {activeBuilding.district} • {activeBuilding.subtitle}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveBuilding(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors focus:ring-2 focus:ring-amber-400"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            {activeBuilding.type === "guild" && (
              <div className="space-y-4">
                <TaskList
                  tasks={tasks}
                  onCompleteTask={handleCompleteTask}
                  onDeleteTask={handleDeleteTask}
                  onOpenCreateModal={() => setIsCreateOpen(true)}
                />
              </div>
            )}

            {activeBuilding.type === "house" && (
              <div className="space-y-5">
                <CharacterCard profile={profile} inventory={inventory} />
                <div className="border-t border-slate-800 pt-4">
                  <h3 className="text-sm font-bold font-title text-slate-200 mb-3">
                    Equipped Gear & Cosmetics
                  </h3>
                  <InventoryGrid inventory={inventory} onEquipChanged={loadUserData} />
                </div>
              </div>
            )}

            {activeBuilding.type === "shop" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  <button
                    onClick={() => setShopTab("armory")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-pixel uppercase font-bold flex items-center gap-1.5 ${
                      shopTab === "armory"
                        ? "bg-amber-500 text-slate-950"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Guild Armory</span>
                  </button>
                  <button
                    onClick={() => setShopTab("backpack")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-pixel uppercase font-bold flex items-center gap-1.5 ${
                      shopTab === "backpack"
                        ? "bg-amber-500 text-slate-950"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    <Package className="w-3.5 h-3.5" />
                    <span>Backpack ({inventory.length})</span>
                  </button>
                </div>

                {shopTab === "armory" ? (
                  <ShopGrid
                    shopItems={shopItems}
                    inventory={inventory}
                    userGold={profile.gold}
                    onItemPurchased={loadUserData}
                  />
                ) : (
                  <InventoryGrid inventory={inventory} onEquipChanged={loadUserData} />
                )}
              </div>
            )}

            {activeBuilding.type === "observatory" && (
              <div className="space-y-4 text-center p-4">
                <div className="w-16 h-16 rounded-2xl bg-purple-950/60 border-2 border-purple-500/50 flex items-center justify-center text-3xl mx-auto animate-pulse">
                  🔮
                </div>
                <h3 className="text-base font-bold font-title text-purple-300">
                  Arcane Spire of Intellect
                </h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto font-body">
                  Study routines, coding projects, and reading challenges channel here to sharpen your intellect attribute.
                </p>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 max-w-md mx-auto text-left space-y-1">
                  <span className="text-xs font-semibold text-purple-300">Active Intellect Bonus:</span>
                  <p className="text-xs text-slate-400">
                    Completing Intellect quests before their deadline awards up to +1.5x Speed XP!
                  </p>
                </div>
              </div>
            )}

            {activeBuilding.type === "dojo" && (
              <div className="space-y-4">
                <AttributeStats attributes={attributes} />
              </div>
            )}

            {activeBuilding.type === "cafe" && (
              <div className="space-y-4 text-center p-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-950/60 border-2 border-amber-500/50 flex items-center justify-center text-3xl mx-auto">
                  ☕
                </div>
                <h3 className="text-base font-bold font-title text-amber-300">
                  The Bard&apos;s Artisan Lounge
                </h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto font-body">
                  A gathering ground for creative arts, music production, writing, and social camaraderie.
                </p>
              </div>
            )}

            {/* ANVIL & FLAME SMITHY MODAL */}
            {activeBuilding.type === "blacksmith" && (
              <div className="space-y-5 animate-in fade-in duration-200">
                {/* Smith Gorrik Greeting Banner */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-orange-950/70 via-stone-900 to-amber-950/60 border-2 border-orange-500/40 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-600/20 border border-orange-500/50 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                    ⚒️
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-pixel text-orange-400">Master Smith Gorrik</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-orange-950 border border-orange-700/60 text-orange-300">Grand Forge Master</span>
                    </div>
                    <p className="text-xs text-slate-300 italic font-body">
                      &ldquo;Welcome to the Anvil &amp; Flame, adventurer! Real steel for real heroes. Strike the forge anvil to build discipline, or invest your hard-won gold into masterwork weapon buffs!&rdquo;
                    </p>
                  </div>
                </div>

                {/* Feedback Toast */}
                {forgeFeedback && (
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs flex items-center gap-2 animate-in fade-in duration-150">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{forgeFeedback}</span>
                  </div>
                )}

                {/* Interactive Anvil Station */}
                <div className="p-5 rounded-2xl bg-gradient-to-b from-stone-900 to-stone-950 border-2 border-stone-700 shadow-xl text-center space-y-4">
                  <div className="flex items-center justify-center gap-2 text-stone-400 text-xs uppercase tracking-wider font-pixel">
                    <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
                    <span>Forge Master&apos;s Anvil</span>
                    <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
                  </div>

                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Channel your focus and physical grit. Every 3 anvil strikes grants +5 Strength XP!
                  </p>

                  <div className="flex flex-col items-center justify-center gap-3">
                    <button
                      onClick={handleAnvilStrike}
                      className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 hover:from-orange-500 hover:to-amber-400 text-slate-950 font-bold font-pixel text-xs tracking-wider uppercase pixel-btn shadow-lg transform active:scale-95 transition-all flex items-center gap-2.5"
                    >
                      <Hammer className="w-5 h-5 text-slate-950" />
                      <span>Strike the Anvil!</span>
                    </button>

                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-800/80 border border-stone-700 text-stone-300 text-xs">
                      <span>Total Strikes:</span>
                      <span className="font-bold text-amber-400 font-pixel">{anvilStrikes}</span>
                    </div>
                  </div>
                </div>

                {/* Forge Upgrade Services */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold font-title text-orange-300 flex items-center gap-2">
                    <Hammer className="w-4 h-4 text-orange-400" />
                    <span>Masterwork Forge Services (Spend Gold)</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Buff 1: Hone Weapon */}
                    <div className="p-4 rounded-xl bg-stone-900/90 border border-stone-700 space-y-3 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-lg">⚔️</span>
                          <span className="text-[10px] font-pixel text-amber-400">20 Gold</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-200">Hone Weapon&apos;s Edge</h4>
                        <p className="text-[11px] text-slate-400">
                          Sharpens blade for +10% Speed XP bonus on your quests.
                        </p>
                      </div>

                      {forgeBuffs.honedBlade ? (
                        <div className="p-2 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-[11px] font-semibold text-center flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Honed Edge Active</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleBuyForgeBuff("honedBlade", 20, "Weapon honed to razor sharpness! +10% speed XP bonus active.")}
                          className="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold font-pixel uppercase pixel-btn"
                        >
                          Sharpen (20 G)
                        </button>
                      )}
                    </div>

                    {/* Buff 2: Reinforce Armor */}
                    <div className="p-4 rounded-xl bg-stone-900/90 border border-stone-700 space-y-3 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-lg">🛡️</span>
                          <span className="text-[10px] font-pixel text-amber-400">35 Gold</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-200">Steel-Riveted Armor</h4>
                        <p className="text-[11px] text-slate-400">
                          Streak Aegis — Protects daily quest streaks against a missed day.
                        </p>
                      </div>

                      {forgeBuffs.streakShield ? (
                        <div className="p-2 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-[11px] font-semibold text-center flex items-center justify-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Streak Aegis Active</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleBuyForgeBuff("streakShield", 35, "Armor reinforced with tempered steel rivets! Streak Aegis granted.")}
                          className="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold font-pixel uppercase pixel-btn"
                        >
                          Reinforce (35 G)
                        </button>
                      )}
                    </div>

                    {/* Buff 3: Dragonfire Imbue */}
                    <div className="p-4 rounded-xl bg-stone-900/90 border border-stone-700 space-y-3 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-lg">🔥</span>
                          <span className="text-[10px] font-pixel text-amber-400">50 Gold</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-200">Dragonfire Tempering</h4>
                        <p className="text-[11px] text-slate-400">
                          Quenches gear in mythical dragon oil. Awards +15 Strength &amp; +15 Discipline XP!
                        </p>
                      </div>

                      {forgeBuffs.dragonfire ? (
                        <div className="p-2 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-[11px] font-semibold text-center flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Dragonfire Imbued</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleBuyForgeBuff("dragonfire", 50, "Gear imbued with blazing Dragonfire! +15 Strength & Discipline XP awarded!")}
                          className="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold font-pixel uppercase pixel-btn"
                        >
                          Imbue (50 G)
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* THE WEARY BOOT INN MODAL */}
            {activeBuilding.type === "inn" && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/60 via-stone-900 to-amber-900/40 border-2 border-amber-600/40 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl shrink-0">
                    🍺
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold font-pixel text-amber-400">Innkeeper Barnaby</span>
                    <p className="text-xs text-slate-300 italic font-body">
                      &ldquo;Warm your boots by the hearth fire! We serve the finest spiced cider in all of Valoria. Take a rest and regain your vigor.&rdquo;
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-amber-300 flex items-center gap-2">
                      <Beer className="w-4 h-4 text-amber-400" />
                      <span>Hearthside Spiced Cider (5 Gold)</span>
                    </h4>
                    <p className="text-xs text-slate-400">
                      Enjoy a warm spiced drink and hear rumors from traveling adventurers.
                    </p>
                    <button
                      onClick={() => {
                        if (profile.gold >= 5) {
                          setProfile((p) => ({ ...p, gold: p.gold - 5 }));
                          setInnRestored(true);
                          confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
                        }
                      }}
                      className="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold font-pixel uppercase pixel-btn"
                    >
                      Drink Cider (5 G)
                    </button>
                    {innRestored && (
                      <p className="text-[11px] text-emerald-400 font-semibold">✨ Warmed and refreshed by the hearthside cider!</p>
                    )}
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-amber-300">Tavern Rumor Mill</h4>
                    <p className="text-xs text-slate-400 italic">
                      &ldquo;They say a sleepy ginger cat rests near the Hero&apos;s Quarter flowers, and a hidden cache is tucked away in the Whispering Woods pines!&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* GRAND LIBRARY OF LORE MODAL */}
            {activeBuilding.type === "library" && (
              <div className="space-y-5 animate-in fade-in duration-200 text-center p-2">
                <div className="w-16 h-16 rounded-2xl bg-indigo-950/60 border-2 border-indigo-500/50 flex items-center justify-center text-3xl mx-auto">
                  📚
                </div>
                <h3 className="text-base font-bold font-title text-indigo-300">
                  Grand Library of Ancient Lore
                </h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto font-body">
                  Shelves stretching into vaulted stone ceilings hold centuries of algorithms, philosophy, and history.
                </p>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 max-w-md mx-auto space-y-3 text-left">
                  <h4 className="text-xs font-bold text-indigo-300">Study Ancient Grimoires</h4>
                  <p className="text-xs text-slate-400">
                    Review historical tomes and ancient wisdom preserved by kingdom scholars.
                  </p>
                  <button
                    onClick={() => {
                      if (!libraryStudied) {
                        setLibraryStudied(true);
                        confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 }, colors: ["#6366F1", "#818CF8"] });
                      }
                    }}
                    className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold font-pixel uppercase pixel-btn"
                  >
                    {libraryStudied ? "Studied for Today" : "Browse Lore Grimoires"}
                  </button>
                  {libraryStudied && (
                    <p className="text-[11px] text-indigo-400 font-semibold text-center">✨ Your mind is enlightened by ancient lore!</p>
                  )}
                </div>
              </div>
            )}

            {/* SHRINE OF WISDOM MODAL */}
            {activeBuilding.type === "shrine" && (
              <div className="space-y-5 animate-in fade-in duration-200 text-center p-2">
                <div className="w-16 h-16 rounded-2xl bg-cyan-950/60 border-2 border-cyan-500/50 flex items-center justify-center text-3xl mx-auto animate-pulse">
                  🧘
                </div>
                <h3 className="text-base font-bold font-title text-cyan-300">
                  Shrine of Inner Serenity
                </h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto font-body">
                  A tranquil sanctuary with burning sandalwood incense and crystal chimes. Centering your mind brings peace to your adventures.
                </p>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 max-w-md mx-auto space-y-3 text-left">
                  <h4 className="text-xs font-bold text-cyan-300">Deep Focus Meditation</h4>
                  <p className="text-xs text-slate-400">
                    Take a deep breath and clear your mind of daily stress and distractions.
                  </p>
                  <button
                    onClick={() => {
                      if (!shrineBlessed) {
                        setShrineBlessed(true);
                        confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 }, colors: ["#06B6D4", "#22D3EE", "#A5F3FC"] });
                      }
                    }}
                    className="w-full py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-bold font-pixel uppercase pixel-btn"
                  >
                    {shrineBlessed ? "Mind Centered" : "Meditate & Center Mind"}
                  </button>
                  {shrineBlessed && (
                    <p className="text-[11px] text-cyan-400 font-semibold text-center">✨ Serenity embraces you! Spirit peaceful and centered.</p>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* EASTER EGG DIALOG MODAL */}
      {activeEasterEggDialog && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
        >
          <div className="max-w-md w-full pixel-box p-6 rounded-2xl bg-slate-900 border-2 border-amber-500/70 shadow-2xl space-y-4 text-center">
            <span className="text-4xl">{activeEasterEggDialog.icon}</span>
            <h3 className="text-base font-bold font-title text-amber-300">
              {activeEasterEggDialog.name}
            </h3>

            {activeEasterEggDialog.type === "cat" && (
              <div className="space-y-2">
                <p className="text-xs text-slate-300 font-body">
                  You gently pet Mochi behind the ears. The cat lets out a warm, soothing purr and rubs against your boots.
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-semibold">
                  <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
                  <span>Mochi purrs happily!</span>
                </div>
              </div>
            )}

            {activeEasterEggDialog.type === "wishing_well" && (
              <div className="space-y-2">
                <p className="text-xs text-slate-300 font-body">
                  You toss 5 Gold into the crystal waters. The well glows with celestial radiance and whispers a fortune:
                </p>
                <blockquote className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs italic text-amber-200">
                  &ldquo;Consistency in small quests conquers the greatest dragons in reality.&rdquo;
                </blockquote>
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Granted 15s Radiant Aura</span>
                </div>
              </div>
            )}

            {activeEasterEggDialog.type === "chest" && (
              <div className="space-y-2">
                <p className="text-xs text-slate-300 font-body">
                  You discovered a concealed pirate cache hidden between the whispering pine roots!
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold">
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  <span>Claimed +30 Gold!</span>
                </div>
              </div>
            )}

            {activeEasterEggDialog.type === "monolith" && (
              <div className="space-y-2 text-left">
                <p className="text-xs text-slate-300 font-body">
                  You trace the glowing runes etched upon the ancient monolith:
                </p>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-cyan-300 font-mono space-y-1">
                  <p>&ldquo;To all adventurers of Valoria: Every task checked is a step toward true mastery.&rdquo;</p>
                  <p className="text-slate-500">— Archmage TechZephyr, Year 2026</p>
                </div>
              </div>
            )}

            {activeEasterEggDialog.type === "dummy" && (
              <div className="space-y-2">
                <p className="text-xs text-slate-300 font-body">
                  *WHACK!* You deliver a powerful combination strike to the straw dummy, honing your form.
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold">
                  <span>🥊 Sharp Strike Combination!</span>
                </div>
              </div>
            )}

            <button
              onClick={() => setActiveEasterEggDialog(null)}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider font-pixel pixel-btn"
            >
              Continue Exploring
            </button>
          </div>
        </div>
      )}

      {/* Create Quest Modal */}
      <CreateTaskModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onTaskCreated={loadUserData}
      />

      {/* Celebratory Level-Up Burst Modal */}
      <LevelUpModal
        isOpen={levelUpData.isOpen}
        onClose={() => setLevelUpData((prev) => ({ ...prev, isOpen: false }))}
        newLevel={levelUpData.newLevel}
        awardedXp={levelUpData.awardedXp}
        awardedGold={levelUpData.awardedGold}
        category={levelUpData.category}
      />

    </div>
  );
}
