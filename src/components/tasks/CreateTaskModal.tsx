"use client";

import { useState, useEffect, useCallback } from "react";
import { AttributeName } from "@/types/database.types";
import { createTaskAction } from "@/app/actions/game";
import { X, Sparkles, ShieldAlert, CheckCircle2 } from "lucide-react";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: () => void;
}

const CATEGORIES: { name: AttributeName; color: string; bg: string }[] = [
  { name: "Intellect", color: "text-blue-400", bg: "bg-blue-500/20" },
  { name: "Strength", color: "text-red-400", bg: "bg-red-500/20" },
  { name: "Discipline", color: "text-emerald-400", bg: "bg-emerald-500/20" },
  { name: "Creativity", color: "text-purple-400", bg: "bg-purple-500/20" },
  { name: "Social", color: "text-amber-400", bg: "bg-amber-500/20" },
];

export default function CreateTaskModal({ isOpen, onClose, onTaskCreated }: CreateTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<AttributeName>("Discipline");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [baseXp, setBaseXp] = useState(20);
  const [deadline, setDeadline] = useState("");
  const [isClassifying, setIsClassifying] = useState(false);
  const [isGibberish, setIsGibberish] = useState(false);
  const [aiSuggestionMessage, setAiSuggestionMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const handleTitleBlur = async () => {
    if (!title.trim() || title.trim().length < 3) return;

    setIsClassifying(true);
    setIsGibberish(false);
    setError(null);

    try {
      const res = await fetch("/api/classify-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.is_gibberish) {
          setIsGibberish(true);
          setError("That doesn't look like a real quest — please enter a valid task.");
        } else {
          setCategory(data.category);
          setDifficulty(data.difficulty);
          setBaseXp(data.suggested_xp);
          setAiSuggestionMessage(`AI identified category: ${data.category} (${data.difficulty.toUpperCase()} • ${data.suggested_xp} XP)`);
        }
      }
    } catch {
      // Ignore background classification errors
    } finally {
      setIsClassifying(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Quest title is required");
      return;
    }
    if (isGibberish) {
      setError("Please fix the quest title before submitting.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const result = await createTaskAction({
        title,
        description,
        category,
        base_xp: baseXp,
        difficulty,
        deadline: deadline ? new Date(deadline).toISOString() : null,
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to create quest");
      }

      // Reset
      setTitle("");
      setDescription("");
      setDeadline("");
      setAiSuggestionMessage(null);
      onTaskCreated();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to forge quest.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div className="max-w-lg w-full pixel-box p-6 rounded-xl bg-slate-900 border-2 border-slate-700 shadow-2xl space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rpg-gold" />
            <h2 id="modal-title" className="text-lg font-bold font-title text-rpg-goldLight">Forge New Quest</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors focus:ring-2 focus:ring-amber-400 focus:outline-none"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error / Gibberish Notice */}
        {error && (
          <div role="alert" className="p-3 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* AI Insight Badge */}
        {aiSuggestionMessage && !isGibberish && (
          <div className="p-2.5 rounded bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-purple-400" />
            <span>{aiSuggestionMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Quest Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleBlur}
              placeholder="e.g. Read 20 pages of Algorithms, Go for 5km run"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-rpg-gold focus:ring-1 focus:ring-rpg-gold"
            />
            {isClassifying && (
              <span className="text-[10px] text-rpg-gold animate-pulse mt-1 inline-block">
                ⚡ Quest Master AI analyzing your intent...
              </span>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Quest Description (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add key milestones or notes for this quest..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-rpg-gold focus:ring-1 focus:ring-rpg-gold"
            />
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Attribute Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat.name}
                  onClick={() => setCategory(cat.name)}
                  className={`p-2 rounded-lg text-xs font-semibold border flex items-center justify-between transition-all focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                    category === cat.name
                      ? `${cat.bg} border-current ${cat.color} ring-1 ring-current`
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <span>{cat.name}</span>
                  {category === cat.name && <span className="text-[10px]">✔</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty & Base XP */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => {
                  const diff = e.target.value as "easy" | "medium" | "hard";
                  setDifficulty(diff);
                  setBaseXp(diff === "easy" ? 10 : diff === "medium" ? 20 : 35);
                }}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-rpg-gold focus:ring-1 focus:ring-rpg-gold"
              >
                <option value="easy">Easy (10 XP)</option>
                <option value="medium">Medium (20 XP)</option>
                <option value="hard">Hard (35 XP)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Base XP ({baseXp} XP)
              </label>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={baseXp}
                onChange={(e) => setBaseXp(Number(e.target.value))}
                className="w-full mt-2 accent-amber-500 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400 rounded"
              />
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Deadline (For Speed Multiplier Bonus)
            </label>
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-rpg-gold focus:ring-1 focus:ring-rpg-gold [color-scheme:dark]"
            />
            <span className="text-[10px] text-slate-500 mt-1 inline-block">
              Finishing before deadline awards up to 1.5x speed multiplier XP bonus.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold font-pixel uppercase tracking-wider pixel-btn disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              {submitting ? "Forging..." : "Forge Quest"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
