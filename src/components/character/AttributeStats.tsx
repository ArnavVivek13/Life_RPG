"use client";

import { Attribute, AttributeName } from "@/types/database.types";
import { BookOpen, Dumbbell, CheckSquare, Palette, Users, Gem } from "lucide-react";

interface AttributeStatsProps {
  attributes: Attribute[];
}

const ATTR_CONFIG: Record<
  AttributeName,
  { icon: any; color: string; barColor: string; bg: string; border: string; desc: string; gemColor: string }
> = {
  Intellect: {
    icon: BookOpen,
    color: "text-blue-400",
    barColor: "bg-gradient-to-r from-blue-600 to-cyan-400",
    bg: "bg-blue-950/20",
    border: "border-blue-500/30 hover:border-blue-400/60",
    desc: "Study, coding, logic & reading",
    gemColor: "bg-blue-500",
  },
  Strength: {
    icon: Dumbbell,
    color: "text-red-400",
    barColor: "bg-gradient-to-r from-red-600 to-amber-500",
    bg: "bg-red-950/20",
    border: "border-red-500/30 hover:border-red-400/60",
    desc: "Gym workouts, sports & endurance",
    gemColor: "bg-red-500",
  },
  Discipline: {
    icon: CheckSquare,
    color: "text-emerald-400",
    barColor: "bg-gradient-to-r from-emerald-600 to-teal-400",
    bg: "bg-emerald-950/20",
    border: "border-emerald-500/30 hover:border-emerald-400/60",
    desc: "Routines, daily habits & order",
    gemColor: "bg-emerald-500",
  },
  Creativity: {
    icon: Palette,
    color: "text-purple-400",
    barColor: "bg-gradient-to-r from-purple-600 to-fuchsia-400",
    bg: "bg-purple-950/20",
    border: "border-purple-500/30 hover:border-purple-400/60",
    desc: "Art, music, writing & design",
    gemColor: "bg-purple-500",
  },
  Social: {
    icon: Users,
    color: "text-amber-400",
    barColor: "bg-gradient-to-r from-amber-600 to-yellow-400",
    bg: "bg-amber-950/20",
    border: "border-amber-500/30 hover:border-amber-400/60",
    desc: "Friends, family & networking",
    gemColor: "bg-amber-500",
  },
};

export default function AttributeStats({ attributes }: AttributeStatsProps) {
  const allAttrs: AttributeName[] = ["Intellect", "Strength", "Discipline", "Creativity", "Social"];

  return (
    <div className="p-5 sm:p-6 rounded-2xl pixel-box bg-gradient-to-b from-slate-900/90 to-slate-950 border-2 border-slate-700/80 shadow-2xl space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Gem className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold font-title text-amber-200">
            Core Character Attributes & Mastery
          </h3>
        </div>
        <span className="text-[10px] font-pixel text-slate-400 uppercase tracking-wider">
          5 Pillars of Life
        </span>
      </div>

      {/* Grid of 5 Attribute Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {allAttrs.map((attrName) => {
          const attr = attributes.find((a) => a.name === attrName) || {
            user_id: "",
            name: attrName,
            xp: 0,
            level: 1,
          };
          const config = ATTR_CONFIG[attrName];
          const Icon = config.icon;

          const xpNeededForLevel = Math.floor(80 * Math.pow(1.15, attr.level - 1));
          const progressPercent = Math.min(100, Math.round(((attr.xp % xpNeededForLevel) / xpNeededForLevel) * 100));

          return (
            <div
              key={attrName}
              className={`p-3.5 rounded-xl border ${config.border} ${config.bg} flex flex-col justify-between gap-3 pixel-box transition-all hover:-translate-y-0.5 hover:shadow-lg relative overflow-hidden group`}
            >
              {/* Header inside Card */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-lg ${config.bg} border border-white/10 flex items-center justify-center ${config.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className={`text-xs font-bold font-title ${config.color}`}>
                    {attrName}
                  </span>
                </div>
                <span className="text-[9px] font-pixel px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-200 font-bold shadow-inner">
                  LV.{attr.level}
                </span>
              </div>

              {/* Description */}
              <p className="text-[10px] text-slate-400 leading-tight">
                {config.desc}
              </p>

              {/* XP Progress Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5 shadow-inner">
                  <div
                    className={`h-full rounded-full ${config.barColor} transition-all duration-500`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono">
                  <span>{attr.xp} XP</span>
                  <span className="text-slate-300 font-bold">{progressPercent}%</span>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
