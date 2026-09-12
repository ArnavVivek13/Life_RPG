"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Profile, Attribute, Task, UserInventory, ShopItem } from "@/types/database.types";
import { completeTaskAction } from "@/app/actions/game";
import WorldMap from "@/components/world/WorldMap";
import WorldHUD from "@/components/world/WorldHUD";
import { Building } from "@/components/world/WorldMapData";
import CharacterCard from "@/components/character/CharacterCard";
import AttributeStats from "@/components/character/AttributeStats";
import TaskList from "@/components/tasks/TaskList";
import CreateTaskModal from "@/components/tasks/CreateTaskModal";
import ShopGrid from "@/components/shop/ShopGrid";
import InventoryGrid from "@/components/shop/InventoryGrid";
import LevelUpModal from "@/components/ui/LevelUpModal";
import { X, Sparkles, ShoppingBag, Package } from "lucide-react";

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
    id: "c1111111-1111-1111-1111-111111111111",
    name: "Early Quester Badge",
    type: "badge",
    cost: 50,
    asset_key: "badge-early-quester",
    description: "Conferred upon the brave souls who embark on their life journey.",
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

  // Active Building Modal state
  const [activeBuilding, setActiveBuilding] = useState<Building | null>(null);
  const [nearbyBuilding, setNearbyBuilding] = useState<Building | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [shopTab, setShopTab] = useState<"armory" | "backpack">("armory");

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

  // Load User Data from Supabase
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

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  // Check equipped cosmetics
  const hasCrown = inventory.some((i) => i.equipped && i.item?.asset_key === "gear-golden-crown");
  const hasHood = inventory.some((i) => i.equipped && i.item?.asset_key === "gear-mage-hood");

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0E14] via-[#121722] to-[#0B0E14] text-slate-100 p-3 sm:p-6 select-none">
      <div className="max-w-5xl mx-auto space-y-4">
        
        {/* Top GBA HUD Bar */}
        <WorldHUD
          profile={profile}
          viewMode={viewMode}
          onToggleViewMode={() => setViewMode((v) => (v === "world" ? "classic" : "world"))}
          nearbyBuildingName={nearbyBuilding?.name}
          onInteract={() => {
            if (nearbyBuilding) setActiveBuilding(nearbyBuilding);
          }}
          onOpenShop={() => {
            const shopBld = {
              id: "shop",
              name: "Guild Bazaar & Armory",
              subtitle: "Trade gold for themes, hats & badges",
              type: "shop" as const,
              x: 0,
              y: 0,
              width: 0,
              height: 0,
              doorX: 0,
              doorY: 0,
              color: "",
              roofColor: "",
              trimColor: "",
              signIcon: "🛒",
            };
            setActiveBuilding(shopBld);
          }}
          onSignOut={handleSignOut}
        />

        {/* VIEW 1: Pokémon GBA Interactive 2D World Map */}
        {viewMode === "world" ? (
          <div className="w-full flex justify-center animate-in fade-in duration-300">
            <WorldMap
              theme={profile.current_theme}
              hasCrown={hasCrown}
              hasHood={hasHood}
              onEnterBuilding={(bld) => setActiveBuilding(bld)}
              onNearbyBuildingChange={(bld) => setNearbyBuilding(bld)}
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
                  <p className="text-xs text-slate-400 font-body">{activeBuilding.subtitle}</p>
                </div>
              </div>

              <button
                onClick={() => setActiveBuilding(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors focus:ring-2 focus:ring-amber-400"
                aria-label="Close building modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body Based on Building Type */}
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
                  <InventoryGrid
                    inventory={inventory}
                    onEquipChanged={loadUserData}
                  />
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
                  <InventoryGrid
                    inventory={inventory}
                    onEquipChanged={loadUserData}
                  />
                )}
              </div>
            )}

            {activeBuilding.type === "dojo" && (
              <div className="space-y-4">
                <AttributeStats attributes={attributes} />
                <p className="text-xs text-slate-400 text-center font-body">
                  Complete specialized quests in Intellect, Strength, Discipline, Creativity, or Social to level up each discipline.
                </p>
              </div>
            )}

            {activeBuilding.type === "shrine" && (
              <div className="space-y-4 text-center p-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-red-500/20 border-2 border-amber-500/50 flex items-center justify-center text-3xl mx-auto animate-pulse">
                  🔥
                </div>
                <h3 className="text-base font-bold font-title text-amber-300">
                  {profile.streak_count}-Day Flame of Discipline
                </h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto font-body">
                  Your daily streak grants an automatic <strong>+{(Math.min(10, profile.streak_count) * 5)}% Gold Multiplier</strong> on every completed quest!
                </p>
                <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto pt-2 text-[10px] font-pixel">
                  <div className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-400">3d: +15%</div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-400">7d: +35%</div>
                  <div className="p-2 rounded bg-slate-950 border border-amber-500/50 text-amber-300">10d: +50%</div>
                  <div className="p-2 rounded bg-slate-950 border border-purple-500/50 text-purple-300">30d: Badge</div>
                </div>
              </div>
            )}

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
