"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { ShopItem, UserInventory, Profile } from "@/types/database.types";
import ShopGrid from "@/components/shop/ShopGrid";
import InventoryGrid from "@/components/shop/InventoryGrid";
import Link from "next/link";
import { 
  ShoppingBag, 
  Package, 
  ArrowLeft, 
  Coins, 
  RefreshCw,
  Sparkles,
  ShieldAlert
} from "lucide-react";
import { DEFAULT_SHOP_ITEMS } from "@/lib/game/items";

export default function ShopPage() {
  const router = useRouter();
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState<"shop" | "inventory">("shop");
  const [shopItems, setShopItems] = useState<ShopItem[]>(DEFAULT_SHOP_ITEMS);
  const [inventory, setInventory] = useState<UserInventory[]>([]);
  const [userGold, setUserGold] = useState(150);
  const [loading, setLoading] = useState(true);

  const loadShopData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      // Fetch public shop items
      const { data: items } = await supabase.from("shop_items").select("*");
      if (items && items.length > 0) {
        setShopItems(items);
      }

      if (user) {
        // Fetch Profile Gold
        const { data: profile } = await supabase
          .from("profiles")
          .select("gold")
          .eq("id", user.id)
          .maybeSingle();

        if (profile) {
          setUserGold(profile.gold);
        }

        // Fetch User Inventory
        const { data: userInv } = await supabase
          .from("user_inventory")
          .select("*, item:shop_items(*)")
          .eq("user_id", user.id);

        if (userInv) {
          setInventory(userInv);
        }
      }
    } catch (err) {
      console.error("Error loading shop data:", err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    loadShopData();
  }, [loadShopData]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0E14] via-[#121722] to-[#0B0E14] text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Top Nav */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl pixel-box bg-slate-900/90 border-2 border-slate-700 shadow-xl">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              aria-label="Return to Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-base font-bold font-title text-rpg-goldLight">Guild Bazaar & Armory</h1>
              <p className="text-[10px] text-slate-400 font-pixel">Trade Your Hard-Earned Gold</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2 shadow-sm">
              <Coins className="w-4 h-4 text-rpg-gold" />
              <span className="text-sm font-bold text-rpg-goldLight font-pixel">
                {userGold} G
              </span>
            </div>

            <button
              onClick={loadShopData}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Refresh inventory"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-amber-400" : ""}`} />
            </button>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab("shop")}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider font-pixel flex items-center gap-2 transition-all ${
              activeTab === "shop"
                ? "bg-amber-500 text-slate-950 shadow-glowGold"
                : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Guild Armory</span>
          </button>

          <button
            onClick={() => setActiveTab("inventory")}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider font-pixel flex items-center gap-2 transition-all ${
              activeTab === "inventory"
                ? "bg-amber-500 text-slate-950 shadow-glowGold"
                : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>My Backpack ({inventory.length})</span>
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === "shop" ? (
          <ShopGrid
            shopItems={shopItems}
            inventory={inventory}
            userGold={userGold}
            onItemPurchased={loadShopData}
          />
        ) : (
          <InventoryGrid
            inventory={inventory}
            onEquipChanged={loadShopData}
          />
        )}

      </div>
    </div>
  );
}
