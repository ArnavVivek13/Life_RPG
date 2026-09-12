"use client";

import { Attribute, AttributeName } from "@/types/database.types";
import { BookOpen, Dumbbell, CheckSquare, Palette, Users } from "lucide-react";

interface AttributeStatsProps {
  attributes: Attribute[];
}

const ATTR_CONFIG: Record<
  AttributeName,
  { icon: any; color: string; barColor: string; bg: string; border: string; desc: string }
> = {
  Intellect: {
    icon: BookOpen,
    color: "text-blue-400",
    barColor: "bg-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    desc: "Study, coding, reading, science",
  },
  Strength: {
    icon: Dumbbell,
    color: "text-red-400",
    barColor: "bg-red-500",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    desc: "Gym, workout, sports, cardio",
  },
  Discipline: {
    icon: CheckSquare,
    color: "text-emerald-400",
    barColor: "bg-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    desc: "Chores, routine, hygiene, habits",
  },
  Creativity: {
    icon: Palette,
    color: "text-purple-400",
    barColor: "bg-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    desc: "Art, writing, music, design",
  },
  Social: {
    icon: Users,
    color: "text-amber-400",
    barColor: "bg-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    desc: "Friends, family, networking",
  },
};

export default function AttributeStats({ attributes }: AttributeStatsProps) {
  // Map or fallback to 5 attributes
  const allAttrs: AttributeName[] = ["Intellect", "Strength", "Discipline", "Creativity", "Social"];

  return (
    <div className="p-5 rounded-2xl pixel-box bg-slate-900/90 border-2 border-slate-700 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <h3 className="text-sm font-bold font-title text-slate-200">
          Core Attributes & Mastery
        </h3>
        <span className="text-[10px] font-pixel text-slate-400 uppercase">5 Disciplines</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {allAttrs.map((attrName) => {
          const attr = attributes.find((a) => a.name === attrName) || {
            user_id: "",
            name: attrName,
            xp: 0,
            level: 1,
          };
          const config = ATTR_CONFIG[attrName];
          const Icon = config.icon;

          // Attribute XP required for next rank: 80 * 1.15^(level - 1)
          const xpNeededForLevel = Math.floor(80 * Math.pow(1.15, attr.level - 1));
          const progressPercent = Math.min(100, Math.round(((attr.xp % xpNeededForLevel) / xpNeededForLevel) * 100));

          return (
            <div
              key={attrName}
              className={`p-3 rounded-xl border ${config.border} ${config.bg} flex flex-col justify-between gap-2 pixel-box`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <Icon className={`w-4 h-4 ${config.color}`} />
                  <span className={`text-xs font-bold ${config.color}`}>{attrName}</span>
                </div>
                <span className="text-[10px] font-pixel px-1.5 py-0.5 rounded bg-slate-950 text-slate-300">
                  LVL {attr.level}
                </span>
              </div>

              <div className="space-y-1">
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full ${config.barColor} transition-all duration-300`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[9px] text-slate-400 font-pixel">
                  <span>{attr.xp} XP</span>
                  <span>{progressPercent}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
