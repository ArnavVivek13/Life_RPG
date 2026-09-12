"use client";

import { useState } from "react";
import { ShopItem, UserInventory } from "@/types/database.types";
import { buyShopItemAction } from "@/app/actions/game";
import { ShoppingBag, Sparkles, Check, Crown, Shield, Shirt, Award } from "lucide-react";

interface ShopGridProps {
  shopItems: ShopItem[];
  inventory: UserInventory[];
  userGold: number;
  onItemPurchased: () => void;
}

const ITEM_ICONS: Record<string, any> = {
  "gear-golden-crown": Crown,
  "gear-mage-hood": Shield,
  "theme-cyberpunk": Sparkles,
  "theme-default": Shirt,
  "badge-early-quester": Award,
};

export default function ShopGrid({ shopItems, inventory, userGold, onItemPurchased }: ShopGridProps) {
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const ownedItemIds = new Set(inventory.map((inv) => inv.item_id));

  const handlePurchase = async (item: ShopItem) => {
    if (userGold < item.cost) {
      setError(`Not enough gold! You need ${item.cost} G (Current: ${userGold} G).`);
      return;
    }

    setPurchasingId(item.id);
    setError(null);
    setFeedback(null);

    try {
      const res = await buyShopItemAction(item.id);
      if (!res.success) {
        throw new Error(res.error || "Purchase failed.");
      }
      setFeedback(`Acquired ${item.name}! Check your inventory.`);
      onItemPurchased();
    } catch (err: any) {
      setError(err.message || "Failed to complete transaction.");
    } finally {
      setPurchasingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Toast Messages */}
      {feedback && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
          <span>{error}</span>
        </div>
      )}

      {/* Shop Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {shopItems.map((item) => {
          const isOwned = ownedItemIds.has(item.id);
          const Icon = ITEM_ICONS[item.asset_key] || Sparkles;

          return (
            <div
              key={item.id}
              className={`p-5 rounded-2xl pixel-box bg-slate-900/90 border-2 flex flex-col justify-between gap-4 transition-all ${
                isOwned
                  ? "border-emerald-500/40 bg-emerald-950/10"
                  : "border-slate-700 hover:border-amber-500/50"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-800 to-slate-950 border border-slate-700 flex items-center justify-center text-amber-400 shadow-inner">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-pixel px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400 uppercase">
                    {item.type.replace("_", " ")}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold font-title text-slate-100">{item.name}</h4>
                  <p className="text-xs text-slate-400 mt-1 font-body">{item.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-pixel text-amber-400">🪙 {item.cost} G</span>
                </div>

                {isOwned ? (
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Owned
                  </span>
                ) : (
                  <button
                    onClick={() => handlePurchase(item)}
                    disabled={purchasingId === item.id || userGold < item.cost}
                    className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-[11px] uppercase tracking-wider font-pixel pixel-btn disabled:opacity-40"
                  >
                    {purchasingId === item.id ? "Forging..." : "Acquire"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
