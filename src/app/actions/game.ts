"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { AttributeName } from "@/types/database.types";

/**
 * Server Action: Complete a quest and calculate XP/Gold server-side.
 * Calls the anti-cheat Postgres RPC function.
 */
export async function completeTaskAction(taskId: string) {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "You must be logged in to complete quests." };
  }

  // Call the server-authoritative RPC function
  const { data, error } = await supabase.rpc("complete_task_rpc", {
    p_task_id: taskId,
  });

  if (error) {
    console.error("Error completing task:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/");
  return { success: true, data };
}

/**
 * Server Action: Create a new Quest
 */
export async function createTaskAction(formData: {
  title: string;
  description?: string;
  category: AttributeName;
  base_xp: number;
  difficulty: "easy" | "medium" | "hard";
  deadline?: string | null;
}) {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "You must be logged in to create quests." };
  }

  if (!formData.title || formData.title.trim().length === 0) {
    return { success: false, error: "Quest title cannot be empty." };
  }

  // Clamp base XP strictly between 5 and 50 to prevent client manipulation
  const safeBaseXp = Math.min(50, Math.max(5, formData.base_xp || 20));

  const { data, error } = await supabase.from("tasks").insert({
    user_id: user.id,
    title: formData.title.trim(),
    description: formData.description?.trim() || null,
    category: formData.category,
    base_xp: safeBaseXp,
    difficulty: formData.difficulty || "medium",
    deadline: formData.deadline || null,
    status: "pending",
  }).select().single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true, task: data };
}

/**
 * Server Action: Delete a Quest
 */
export async function deleteTaskAction(taskId: string) {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "Unauthorized." };
  }

  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", taskId)
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

/**
 * Server Action: Purchase an item from the shop
 */
export async function buyShopItemAction(itemId: string) {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "Unauthorized." };
  }

  // 1. Fetch item
  const { data: item, error: itemError } = await supabase
    .from("shop_items")
    .select("*")
    .eq("id", itemId)
    .single();

  if (itemError || !item) {
    return { success: false, error: "Item not found." };
  }

  // 2. Fetch profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("gold")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return { success: false, error: "Profile not found." };
  }

  if (profile.gold < item.cost) {
    return { success: false, error: "Not enough gold!" };
  }

  // 3. Check already owned
  const { data: existing } = await supabase
    .from("user_inventory")
    .select("id")
    .eq("user_id", user.id)
    .eq("item_id", itemId)
    .maybeSingle();

  if (existing) {
    return { success: false, error: "You already own this item." };
  }

  // 4. Deduct gold and add to inventory
  const { error: deductError } = await supabase
    .from("profiles")
    .update({ gold: profile.gold - item.cost })
    .eq("id", user.id);

  if (deductError) {
    return { success: false, error: deductError.message };
  }

  const { error: invError } = await supabase
    .from("user_inventory")
    .insert({
      user_id: user.id,
      item_id: itemId,
      equipped: false,
    });

  if (invError) {
    return { success: false, error: invError.message };
  }

  revalidatePath("/shop");
  revalidatePath("/dashboard");
  return { success: true, message: `Purchased ${item.name}!` };
}
