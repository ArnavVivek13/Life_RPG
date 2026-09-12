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
  CheckCircle2
} from "lucide-react";

interface TaskCardProps {
  task: Task;
  onComplete: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const CATEGORY_CONFIG: Record<AttributeName, { icon: any; color: string; bg: string; border: string }> = {
  Intellect: { icon: BookOpen, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30" },
  Strength: { icon: Dumbbell, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30" },
  Discipline: { icon: CheckSquare, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
  Creativity: { icon: Palette, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30" },
  Social: { icon: Users, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30" },
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
      className={`p-4 rounded-xl border pixel-box transition-all duration-200 flex flex-col justify-between gap-3 ${
        isCompleted
          ? "bg-slate-950/40 border-slate-800 opacity-60 line-through"
          : `${config.bg} ${config.border} hover:border-slate-500`
      }`}
    >
      <div className="space-y-2">
        
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={`p-1.5 rounded-md ${config.bg} ${config.color} border ${config.border}`}>
              <Icon className="w-3.5 h-3.5" />
            </span>
            <span className={`text-[11px] font-bold uppercase tracking-wider ${config.color}`}>
              {task.category}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-pixel px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-rpg-gold">
              +{task.base_xp} XP
            </span>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors"
              aria-label="Delete quest"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Title & Description */}
        <div>
          <h3 className={`text-sm font-semibold text-slate-100 ${isCompleted ? "line-through text-slate-400" : ""}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className="text-xs text-slate-400 mt-1 font-body">
              {task.description}
            </p>
          )}
        </div>

      </div>

      {/* Footer Info: Deadline & Complete Button */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
        
        {task.deadline ? (
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>{new Date(task.deadline).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
            {speedInfo.multiplier > 1.0 && !isCompleted && (
              <span className="text-[10px] text-amber-400 font-semibold flex items-center gap-0.5">
                <Zap className="w-2.5 h-2.5" /> {speedInfo.multiplier}x
              </span>
            )}
          </div>
        ) : (
          <span className="text-[10px] text-slate-500">No time limit</span>
        )}

        {isCompleted ? (
          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
          </span>
        ) : (
          <button
            onClick={handleComplete}
            disabled={isCompleting}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-[11px] uppercase tracking-wider font-pixel pixel-btn flex items-center gap-1.5 transition-transform disabled:opacity-50"
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>{isCompleting ? "Claiming..." : "Claim"}</span>
          </button>
        )}

      </div>
    </div>
  );
}
