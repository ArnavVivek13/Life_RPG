"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AttributeName, TaskClassificationResult } from "@/types/database.types";
import { createTaskAction } from "@/app/actions/game";
import { 
  X, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  Brain, 
  Sword, 
  Shield, 
  Palette, 
  Users, 
  Bot, 
  Lock,
  Loader2
} from "lucide-react";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: () => void;
}

const CATEGORY_CONFIG: Record<AttributeName, {
  label: string;
  color: string;
  badgeBg: string;
  border: string;
  icon: typeof Brain;
}> = {
  Intellect: {
    label: "Intellect",
    color: "text-blue-400",
    badgeBg: "bg-blue-500/15 text-blue-300 border-blue-500/40",
    border: "border-blue-500/30 bg-blue-950/20",
    icon: Brain,
  },
  Strength: {
    label: "Strength",
    color: "text-red-400",
    badgeBg: "bg-red-500/15 text-red-300 border-red-500/40",
    border: "border-red-500/30 bg-red-950/20",
    icon: Sword,
  },
  Discipline: {
    label: "Discipline",
    color: "text-emerald-400",
    badgeBg: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40",
    border: "border-emerald-500/30 bg-emerald-950/20",
    icon: Shield,
  },
  Creativity: {
    label: "Creativity",
    color: "text-purple-400",
    badgeBg: "bg-purple-500/15 text-purple-300 border-purple-500/40",
    border: "border-purple-500/30 bg-purple-950/20",
    icon: Palette,
  },
  Social: {
    label: "Social",
    color: "text-amber-400",
    badgeBg: "bg-amber-500/15 text-amber-300 border-amber-500/40",
    border: "border-amber-500/30 bg-amber-950/20",
    icon: Users,
  },
};

export default function CreateTaskModal({ isOpen, onClose, onTaskCreated }: CreateTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [aiCategory, setAiCategory] = useState<AttributeName | null>(null);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [baseXp, setBaseXp] = useState(20);
  const [deadline, setDeadline] = useState("");
  const [isClassifying, setIsClassifying] = useState(false);
  const [isGibberish, setIsGibberish] = useState(false);
  const [aiReason, setAiReason] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

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

  // Execute AI classification
  const classifyQuest = useCallback(async (t: string, d: string): Promise<TaskClassificationResult | null> => {
    if (!t.trim() || t.trim().length < 3) {
      setAiCategory(null);
      setAiReason(null);
      setIsGibberish(false);
      return null;
    }

    setIsClassifying(true);
    setIsGibberish(false);
    setError(null);

    try {
      const res = await fetch("/api/classify-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: t, description: d }),
      });

      if (res.ok) {
        const data: TaskClassificationResult = await res.json();
        if (data.is_gibberish) {
          setIsGibberish(true);
          setAiCategory(null);
          setError("Quest Master AI detected nonsensical or invalid quest input.");
        } else {
          setAiCategory(data.category);
          setDifficulty(data.difficulty);
          setBaseXp(data.suggested_xp);
          setAiReason(data.reason || `AI categorized this quest as ${data.category}.`);
        }
        return data;
      }
    } catch {
      // Fallback gracefully
    } finally {
      setIsClassifying(false);
    }
    return null;
  }, []);

  // Real-time debounced auto-classification as the user types title or description
  useEffect(() => {
    if (!isOpen) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!title.trim() || title.trim().length < 3) {
      setAiCategory(null);
      setAiReason(null);
      setIsGibberish(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      classifyQuest(title, description);
    }, 550);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [title, description, isOpen, classifyQuest]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Quest title is required");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Ensure quest is classified before submitting
      let finalCategory = aiCategory;
      let finalDifficulty = difficulty;
      let finalBaseXp = baseXp;

      if (!finalCategory) {
        const classified = await classifyQuest(title, description);
        if (!classified || classified.is_gibberish) {
          throw new Error("Quest Master AI couldn't classify this quest. Please provide a clear title.");
        }
        finalCategory = classified.category;
        finalDifficulty = classified.difficulty;
        finalBaseXp = classified.suggested_xp;
      }

      if (isGibberish) {
        throw new Error("Please enter a genuine quest title before forging.");
      }

      const result = await createTaskAction({
        title: title.trim(),
        description: description.trim() || undefined,
        category: finalCategory,
        base_xp: finalBaseXp,
        difficulty: finalDifficulty,
        deadline: deadline ? new Date(deadline).toISOString() : null,
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to create quest");
      }

      // Reset modal state
      setTitle("");
      setDescription("");
      setDeadline("");
      setAiCategory(null);
      setAiReason(null);
      setIsGibberish(false);
      onTaskCreated();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to forge quest.");
    } finally {
      setSubmitting(false);
    }
  };

  const currentConfig = aiCategory ? CATEGORY_CONFIG[aiCategory] : null;
  const CategoryIcon = currentConfig ? currentConfig.icon : Bot;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div className="max-w-lg w-full max-h-[90vh] overflow-y-auto pixel-box p-6 rounded-xl bg-slate-900 border-2 border-slate-700 shadow-2xl space-y-4">
        
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
              placeholder="e.g. Read 20 pages of Algorithms, Bench press 70kg, Wash dishes"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-rpg-gold focus:ring-1 focus:ring-rpg-gold"
            />
          </div>

          {/* AI Category Classification Card (Handed over completely to LLM) */}
          <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                <Bot className="w-4 h-4 text-purple-400" />
                <span>Attribute Category</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-slate-500">
                <Lock className="w-3 h-3" />
                <span>AI-Assigned</span>
              </div>
            </div>

            {isClassifying ? (
              <div className="flex items-center gap-2 py-2 px-3 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs animate-pulse">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
                <span>Quest Master AI is analyzing quest intent and assigning attribute...</span>
              </div>
            ) : aiCategory && currentConfig ? (
              <div className={`p-2.5 rounded-lg border ${currentConfig.border} flex items-start gap-3`}>
                <div className={`p-2 rounded-md ${currentConfig.badgeBg} border shrink-0`}>
                  <CategoryIcon className={`w-4 h-4 ${currentConfig.color}`} />
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold font-title tracking-wide uppercase ${currentConfig.color}`}>
                      {currentConfig.label}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-pixel">
                      {difficulty.toUpperCase()} • {baseXp} XP
                    </span>
                  </div>
                  {aiReason && (
                    <p className="text-[11px] text-slate-400 leading-tight">
                      {aiReason}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-2.5 px-3 rounded-md bg-slate-900/50 border border-slate-800/80 text-slate-400 text-xs flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-rpg-gold shrink-0" />
                <span>Type your quest title above — Quest Master AI will classify the attribute automatically.</span>
              </div>
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
              disabled={submitting || isClassifying || isGibberish}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold font-pixel uppercase tracking-wider pixel-btn disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-amber-400 flex items-center gap-1.5"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Forging...</span>
                </>
              ) : (
                <span>Forge Quest</span>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

