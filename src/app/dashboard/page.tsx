"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Profile, Attribute, Task, UserInventory } from "@/types/database.types";
import { completeTaskAction } from "@/app/actions/game";
import CharacterCard from "@/components/character/CharacterCard";
import AttributeStats from "@/components/character/AttributeStats";
import TaskList from "@/components/tasks/TaskList";
import CreateTaskModal from "@/components/tasks/CreateTaskModal";
import LevelUpModal from "@/components/ui/LevelUpModal";
import Link from "next/link";
import { 
  Sword, 
  ShoppingBag, 
  LogOut, 
  Sparkles, 
  RefreshCw, 
  Plus, 
  ShieldCheck 
} from "lucide-react";

// Mock Fallback Data in case Supabase is fresh/unseeded or guest offline
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

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [attributes, setAttributes] = useState<Attribute[]>(DEFAULT_ATTRIBUTES);
  const [tasks, setTasks] = useState<Task[]>(DEFAULT_TASKS);
  const [inventory, setInventory] = useState<UserInventory[]>([]);

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
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

  // Load User Data
  const loadUserData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // Allow demo mode without throwing
        setLoading(false);
        return;
      }

      // Fetch Profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData);
      }

      // Fetch Attributes
      const { data: attrData } = await supabase
        .from("attributes")
        .select("*")
        .eq("user_id", user.id);

      if (attrData && attrData.length > 0) {
        setAttributes(attrData);
      }

      // Fetch Tasks
      const { data: tasksData } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (tasksData) {
        setTasks(tasksData);
      }

      // Fetch Inventory
      const { data: invData } = await supabase
        .from("user_inventory")
        .select("*, item:shop_items(*)")
        .eq("user_id", user.id);

      if (invData) {
        setInventory(invData);
      }
    } catch (err) {
      console.error("Error loading user data:", err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // Handle Task Completion with Tactile Celebrations
  const handleCompleteTask = async (task: Task) => {
    // 1. Optimistic Task State Update
    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id
          ? { ...t, status: "completed", completed_at: new Date().toISOString() }
          : t
      )
    );

    // 2. Execute Server Action (Anti-Cheat Server Calculation)
    const result = await completeTaskAction(task.id);

    if (result.success && result.data) {
      const { awarded_xp, awarded_gold, new_total_xp, new_level } = result.data;

      // Update Profile
      setProfile((prev) => ({
        ...prev,
        total_xp: new_total_xp || prev.total_xp + awarded_xp,
        gold: prev.gold + awarded_gold,
      }));

      // Update Attribute
      setAttributes((prev) =>
        prev.map((a) =>
          a.name === task.category
            ? { ...a, xp: a.xp + awarded_xp }
            : a
        )
      );

      // Open Level Up / Quest Claim Celebration
      setLevelUpData({
        isOpen: true,
        newLevel: new_level || 1,
        awardedXp: awarded_xp || task.base_xp,
        awardedGold: awarded_gold || 10,
        category: task.category,
      });
    } else {
      // Offline / Local Demo fallback calculation
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0E14] via-[#121722] to-[#0B0E14] text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Navigation Bar */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl pixel-box bg-slate-900/90 border-2 border-slate-700 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sword className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold font-title text-rpg-goldLight">Life RPG Realm</h1>
              <p className="text-[10px] text-slate-400 font-pixel">Real-Time Progression Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadUserData}
              disabled={loading}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Refresh Realm Data"
              aria-label="Refresh data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-amber-400" : ""}`} />
            </button>

            <Link
              href="/shop"
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Armory & Shop</span>
            </Link>

            <button
              onClick={handleSignOut}
              className="px-3 py-2 rounded-lg bg-red-950/60 hover:bg-red-900/60 border border-red-700/40 text-red-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Leave</span>
            </button>
          </div>
        </header>

        {/* Character Card & Non-Linear XP Engine */}
        <CharacterCard profile={profile} inventory={inventory} />

        {/* 5 Core RPG Attributes Breakdown */}
        <AttributeStats attributes={attributes} />

        {/* Quest Log Board */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold font-title text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Active Quests & Trials</span>
            </h2>
            <span className="text-xs text-slate-400 font-body">
              {tasks.filter((t) => t.status === "pending").length} Available Quests
            </span>
          </div>

          <TaskList
            tasks={tasks}
            onCompleteTask={handleCompleteTask}
            onDeleteTask={handleDeleteTask}
            onOpenCreateModal={() => setIsCreateOpen(true)}
          />
        </div>

      </div>

      {/* Create Quest Modal */}
      <CreateTaskModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onTaskCreated={() => {
          loadUserData();
        }}
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
