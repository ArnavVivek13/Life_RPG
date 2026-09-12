"use client";

import { useState } from "react";
import { UserInventory } from "@/types/database.types";
import { equipItemAction } from "@/app/actions/game";
import { Crown, Shield, Sparkles, Shirt, Award, Check, PackageOpen } from "lucide-react";

interface InventoryGridProps {
  inventory: UserInventory[];
  onEquipChanged: () => void;
}

const ITEM_ICONS: Record<string, any> = {
  "gear-golden-crown": Crown,
  "gear-mage-hood": Shield,
  "theme-cyberpunk": Sparkles,
  "theme-default": Shirt,
  "badge-early-quester": Award,
};

export default function InventoryGrid({ inventory, onEquipChanged }: InventoryGridProps) {
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleToggleEquip = async (inv: UserInventory) => {
    setTogglingId(inv.item_id);
    try {
      await equipItemAction(inv.item_id, !inv.equipped);
      onEquipChanged();
    } finally {
      setTogglingId(null);
    }
  };

  if (inventory.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-slate-900/40 border-2 border-dashed border-slate-800 text-center space-y-3">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-800 text-slate-500">
          <PackageOpen className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-semibold text-slate-300">Your Backpack is Empty</h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto font-body">
          Visit the Guild Armory to spend your hard-earned gold on custom themes, avatar cosmetics, and badges.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {inventory.map((inv) => {
        const item = inv.item;
        if (!item) return null;
        const Icon = ITEM_ICONS[item.asset_key] || Sparkles;

        return (
          <div
            key={inv.id || inv.item_id}
            className={`p-5 rounded-2xl pixel-box bg-slate-900/90 border-2 flex flex-col justify-between gap-4 transition-all ${
              inv.equipped
                ? "border-amber-500/60 bg-amber-950/10 shadow-glowGold"
                : "border-slate-700 hover:border-slate-500"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-700 flex items-center justify-center text-amber-400 shadow-inner">
                  <Icon className="w-6 h-6" />
                </div>
                {inv.equipped && (
                  <span className="text-[10px] font-pixel px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-bold">
                    EQUIPPED
                  </span>
                )}
              </div>

              <div>
                <h4 className="text-sm font-bold font-title text-slate-100">{item.name}</h4>
                <p className="text-xs text-slate-400 mt-1 font-body">{item.description}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <span className="text-[11px] text-slate-400">
                Purchased {new Date(inv.purchased_at).toLocaleDateString()}
              </span>

              <button
                onClick={() => handleToggleEquip(inv)}
                disabled={togglingId === inv.item_id}
                className={`px-3.5 py-1.5 rounded-lg text-[11px] uppercase tracking-wider font-pixel pixel-btn ${
                  inv.equipped
                    ? "bg-slate-800 hover:bg-slate-700 text-slate-300"
                    : "bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold"
                }`}
              >
                {togglingId === inv.item_id
                  ? "Updating..."
                  : inv.equipped
                  ? "Unequip"
                  : "Equip"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
