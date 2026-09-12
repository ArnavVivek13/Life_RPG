"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { AttributeName } from "@/types/database.types";
import { DEFAULT_SHOP_ITEMS, calculateEquippedBonuses } from "@/lib/game/items";

/**
 * Server Action: Complete a quest and calculate XP/Gold server-side.
 * Calls the anti-cheat Postgres RPC function and applies equipped gear & badge perks.
 */
export async function completeTaskAction(taskId: string) {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "You must be logged in to complete quests." };
  }

  // Fetch task first to check category and deadline for speed bonuses
  const { data: task } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", taskId)
    .single();

  // Call the server-authoritative RPC function
  const { data, error } = await supabase.rpc("complete_task_rpc", {
    p_task_id: taskId,
  });

  if (error) {
    console.error("Error completing task:", error);
    return { success: false, error: error.message };
  }

  let awarded_xp = data.awarded_xp;
  let awarded_gold = data.awarded_gold;
  let new_total_xp = data.new_total_xp;
  let applied_perks: string[] = [];

  // Apply equipped gear and badge bonuses if task exists
  if (task) {
    const { data: equippedInv } = await supabase
      .from("user_inventory")
      .select("*, item:shop_items(*)")
      .eq("user_id", user.id)
      .eq("equipped", true);

    if (equippedInv && equippedInv.length > 0) {
      const hasSpeed = !!(task.deadline && new Date(task.deadline).getTime() > Date.now());
      const bonus = calculateEquippedBonuses(equippedInv, task.category, hasSpeed);
      applied_perks = bonus.appliedPerks;

      const extraXp = Math.round(data.awarded_xp * (bonus.totalXpMultiplier - 1.0));
      const extraGold = Math.round(data.awarded_gold * (bonus.totalGoldMultiplier - 1.0));

      if (extraXp > 0 || extraGold > 0) {
        awarded_xp += extraXp;
        awarded_gold += extraGold;
        new_total_xp += extraXp;

        // Apply bonus to user's profile in database
        const { data: currentProfile } = await supabase
          .from("profiles")
          .select("total_xp, gold")
          .eq("id", user.id)
          .single();

        if (currentProfile) {
          await supabase
            .from("profiles")
            .update({
              total_xp: currentProfile.total_xp + extraXp,
              gold: currentProfile.gold + extraGold,
            })
            .eq("id", user.id);
        }

        // Apply bonus to specific attribute
        if (extraXp > 0) {
          const { data: currentAttr } = await supabase
            .from("attributes")
            .select("xp")
            .eq("user_id", user.id)
            .eq("name", task.category)
            .single();

          if (currentAttr) {
            await supabase
              .from("attributes")
              .update({ xp: currentAttr.xp + extraXp })
              .eq("user_id", user.id)
              .eq("name", task.category);
          }
        }
      }
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/");
  return { 
    success: true, 
    data: {
      ...data,
      awarded_xp,
      awarded_gold,
      new_total_xp,
      applied_perks,
    }
  };
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

  // 1. Fetch item from DB or fallback from DEFAULT_SHOP_ITEMS
  let { data: item, error: itemError } = await supabase
    .from("shop_items")
    .select("*")
    .eq("id", itemId)
    .maybeSingle();

  if (!item) {
    const fallback = DEFAULT_SHOP_ITEMS.find((i) => i.id === itemId);
    if (fallback) {
      await supabase.from("shop_items").upsert(fallback);
      item = fallback;
    } else {
      return { success: false, error: "Item not found." };
    }
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

/**
 * Server Action: Equip or Unequip an item from inventory
 */
export async function equipItemAction(itemId: string, equip: boolean) {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "Unauthorized." };
  }

  // 1. Fetch item details
  const { data: inventoryItem, error: invError } = await supabase
    .from("user_inventory")
    .select("*, item:shop_items(*)")
    .eq("user_id", user.id)
    .eq("item_id", itemId)
    .single();

  if (invError || !inventoryItem) {
    return { success: false, error: "Item not in your inventory." };
  }

  // 2. If it's a theme, enforce mutual exclusion and update profile
  if (inventoryItem.item?.type === "theme") {
    if (equip) {
      // Unequip all other themes for this user
      const themeIds = DEFAULT_SHOP_ITEMS.filter((i) => i.type === "theme").map((t) => t.id);
      await supabase
        .from("user_inventory")
        .update({ equipped: false })
        .eq("user_id", user.id)
        .in("item_id", themeIds);

      const themeName = inventoryItem.item.asset_key.replace("theme-", "") || "default";
      await supabase
        .from("profiles")
        .update({ current_theme: themeName })
        .eq("id", user.id);
    } else {
      await supabase
        .from("profiles")
        .update({ current_theme: "default" })
        .eq("id", user.id);
    }
  }

  // 3. Update inventory equip status for this item
  const { error: updateError } = await supabase
    .from("user_inventory")
    .update({ equipped: equip })
    .eq("user_id", user.id)
    .eq("item_id", itemId);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  revalidatePath("/shop");
  revalidatePath("/dashboard");
  return { success: true };
}

