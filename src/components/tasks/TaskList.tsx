"use client";

import { useState } from "react";
import { Task, AttributeName } from "@/types/database.types";
import TaskCard from "./TaskCard";
import { Scroll, Filter, Plus, Flame, Sparkles } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
  onCompleteTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenCreateModal: () => void;
}

export default function TaskList({
  tasks,
  onCompleteTask,
  onDeleteTask,
  onOpenCreateModal,
}: TaskListProps) {
  const [statusFilter, setStatusFilter] = useState<"active" | "completed" | "all">("active");
  const [categoryFilter, setCategoryFilter] = useState<AttributeName | "all">("all");

  const filteredTasks = tasks.filter((t) => {
    if (statusFilter === "active" && t.status === "completed") return false;
    if (statusFilter === "completed" && t.status !== "completed") return false;
    if (categoryFilter !== "all" && t.category !== categoryFilter) return false;
    return true;
  });

  const activeCount = tasks.filter((t) => t.status !== "completed").length;

  return (
    <div className="space-y-4">
      
      {/* Notice Board Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-2 border-slate-700/80 shadow-xl">
        
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          {(["active", "completed", "all"] as const).map((tab) => {
            const isSelected = statusFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                  isSelected
                    ? "bg-amber-400 text-slate-950 font-bold font-pixel text-[10px] shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                {tab === "active" ? `Active (${activeCount})` : tab === "completed" ? "Completed" : "All"}
              </button>
            );
          })}
        </div>

        {/* Category Dropdown & Add Quest Button */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="all">All Attributes</option>
              <option value="Intellect">Intellect</option>
              <option value="Strength">Strength</option>
              <option value="Discipline">Discipline</option>
              <option value="Creativity">Creativity</option>
              <option value="Social">Social</option>
            </select>
          </div>

          <button
            onClick={onOpenCreateModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider font-pixel pixel-btn flex items-center gap-2 shrink-0 shadow-glowGold"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>New Bounty</span>
          </button>
        </div>

      </div>

      {/* Task Grid */}
      {filteredTasks.length === 0 ? (
        <div className="p-10 rounded-2xl bg-slate-900/40 border-2 border-dashed border-slate-800 text-center space-y-3.5">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700 text-amber-400 shadow-inner">
            <Scroll className="w-7 h-7" />
          </div>
          <h4 className="text-base font-bold font-title text-amber-200">No Active Bounties on the Board</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto font-body leading-relaxed">
            {statusFilter === "active"
              ? "All active guild quests have been conquered! Forge a new life quest to gain attribute XP, gold bounties, and advance your rank."
              : "No bounties match your current filter settings."}
          </p>
          <button
            onClick={onOpenCreateModal}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-amber-500/40 text-amber-300 text-xs font-semibold transition-all hover:scale-105 inline-flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Forge New Quest</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={onCompleteTask}
              onDelete={onDeleteTask}
            />
          ))}
        </div>
      )}

    </div>
  );
}
