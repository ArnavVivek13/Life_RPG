export type AttributeName = "Intellect" | "Strength" | "Discipline" | "Creativity" | "Social";

export interface Profile {
  id: string;
  username: string;
  avatar_url?: string | null;
  total_xp: number;
  gold: number;
  current_theme: string;
  streak_count: number;
  last_active_date?: string | null;
  created_at: string;
}

export interface Attribute {
  user_id: string;
  name: AttributeName;
  xp: number;
  level: number;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string | null;
  category: AttributeName;
  base_xp: number;
  difficulty: "easy" | "medium" | "hard";
  deadline?: string | null;
  status: "pending" | "completed" | "expired";
  completed_at?: string | null;
  created_at: string;
}

export interface ShopItem {
  id: string;
  name: string;
  type: "theme" | "avatar_item" | "badge";
  cost: number;
  asset_key: string;
  description: string;
}

export interface UserInventory {
  user_id: string;
  item_id: string;
  purchased_at: string;
  equipped: boolean;
  item?: ShopItem;
}

export interface TaskClassificationResult {
  category: AttributeName;
  difficulty: "easy" | "medium" | "hard";
  suggested_xp: number;
  is_gibberish: boolean;
  reason?: string;
}
