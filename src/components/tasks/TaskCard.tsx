"use client";

import { useState } from "react";
import { Task, AttributeName } from "@/types/database.types";
import { calculateSpeedMultiplier } from "@/lib/game/math";
import { deleteTaskAction } from "@/app/actions/game";
import { 
  BookOpen, 
  Dumbbell, 
  CheckSquare, 
  Palette, 
  Users, 
  Clock, 
  Check, 
  Trash2, 
  Zap,
  CheckCircle2,
  Coins
} from "lucide-react";

interface TaskCardProps {
  task: Task;
  onComplete: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const CATEGORY_CONFIG: Record<
  AttributeName,
  { icon: any; color: string; bg: string; border: string; borderHover: string }
> = {
  Intellect: { icon: BookOpen, color: "text-blue-400", bg: "bg-blue-950/25", border: "border-blue-500/30", borderHover: "hover:border-blue-400/60" },
  Strength: { icon: Dumbbell, color: "text-red-400", bg: "bg-red-950/25", border: "border-red-500/30", borderHover: "hover:border-red-400/60" },
  Discipline: { icon: CheckSquare, color: "text-emerald-400", bg: "bg-emerald-950/25", border: "border-emerald-500/30", borderHover: "hover:border-emerald-400/60" },
  Creativity: { icon: Palette, color: "text-purple-400", bg: "bg-purple-950/25", border: "border-purple-500/30", borderHover: "hover:border-purple-400/60" },
  Social: { icon: Users, color: "text-amber-400", bg: "bg-amber-950/25", border: "border-amber-500/30", borderHover: "hover:border-amber-400/60" },
};

export default function TaskCard({ task, onComplete, onDelete }: TaskCardProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const config = CATEGORY_CONFIG[task.category] || CATEGORY_CONFIG.Discipline;
  const Icon = config.icon;

  const speedInfo = calculateSpeedMultiplier(task.created_at, task.deadline);
  const isCompleted = task.status === "completed";

  const handleComplete = async () => {
    if (isCompleted || isCompleting) return;
    setIsCompleting(true);
    onComplete(task);
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    await deleteTaskAction(task.id);
    onDelete(task.id);
  };

  return (
    <div
      className={`p-4 sm:p-4.5 rounded-2xl border-2 pixel-box transition-all duration-200 flex flex-col justify-between gap-3.5 relative overflow-hidden ${
        isCompleted
          ? "bg-slate-950/50 border-slate-800/80 opacity-60"
          : `${config.bg} ${config.border} ${config.borderHover} hover:-translate-y-0.5 hover:shadow-xl`
      }`}
    >
      <div className="space-y-2.5">
        
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={`w-7 h-7 rounded-lg ${config.bg} ${config.color} border border-white/10 flex items-center justify-center shrink-0`}>
              <Icon className="w-3.5 h-3.5" />
            </span>
            <span className={`text-[11px] font-bold font-title uppercase tracking-wider ${config.color}`}>
              {task.category}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-pixel px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold flex items-center gap-1">
              <span>+{task.base_xp} XP</span>
              <Coins className="w-2.5 h-2.5 text-amber-400" />
            </span>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800/80 transition-colors"
              aria-label="Delete quest"
              title="Abandon Quest"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Title & Description */}
        <div>
          <h3 className={`text-sm font-bold font-title text-slate-100 leading-snug ${isCompleted ? "line-through text-slate-400" : ""}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className="text-xs text-slate-400 mt-1 font-body line-clamp-2">
              {task.description}
            </p>
          )}
        </div>

      </div>

      {/* Footer Info: Deadline & Complete Button */}
      <div className="flex items-center justify-between pt-2.5 border-t border-slate-800/80 text-xs">
        
        {task.deadline ? (
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{new Date(task.deadline).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
            {speedInfo.multiplier > 1.0 && !isCompleted && (
              <span className="text-[10px] text-amber-400 font-pixel font-bold flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-amber-500/10 border border-amber-500/30">
                <Zap className="w-2.5 h-2.5" /> {speedInfo.multiplier}x
              </span>
            )}
          </div>
        ) : (
          <span className="text-[10px] text-slate-500 font-mono">No time constraint</span>
        )}

        {isCompleted ? (
          <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-semibold font-pixel text-[10px]">
            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
          </span>
        ) : (
          <button
            onClick={handleComplete}
            disabled={isCompleting}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-bold text-[10px] uppercase tracking-wider font-pixel pixel-btn flex items-center gap-1.5 transition-transform shadow-md disabled:opacity-50"
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>{isCompleting ? "Claiming..." : "Claim"}</span>
          </button>
        )}

      </div>
    </div>
  );
}
