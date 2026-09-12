"use client";

import { useState } from "react";
import { Task, AttributeName } from "@/types/database.types";
import TaskCard from "./TaskCard";
import { Scroll, Filter, Plus } from "lucide-react";

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

  return (
    <div className="space-y-4">
      
      {/* Filters & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
        
        {/* Status Tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          {(["active", "completed", "all"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider transition-all ${
                statusFilter === tab
                  ? "bg-amber-500 text-slate-950 font-pixel text-[10px]"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab === "active" ? "Active" : tab === "completed" ? "Completed" : "All"}
            </button>
          ))}
        </div>

        {/* Category Dropdown & Add Quest Button */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-amber-500"
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
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider font-pixel pixel-btn flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>New Quest</span>
          </button>
        </div>

      </div>

      {/* Task Grid */}
      {filteredTasks.length === 0 ? (
        <div className="p-8 rounded-xl bg-slate-900/40 border-2 border-dashed border-slate-800 text-center space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-800 text-slate-500">
            <Scroll className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-semibold text-slate-300">No Quests Found</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto font-body">
            {statusFilter === "active"
              ? "Your quest log is clear! Forge a new quest to level up your attributes and earn gold."
              : "No quests match your current filter settings."}
          </p>
          <button
            onClick={onOpenCreateModal}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 text-xs font-semibold transition-colors"
          >
            + Forge Your First Quest
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
