"use client";

import { Direction } from "./SpriteEngine";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Sparkles } from "lucide-react";

interface MobileControlsProps {
  onMoveStart: (direction: Direction) => void;
  onMoveEnd: () => void;
  onAction: () => void;
  canInteract: boolean;
  nearbyBuildingName?: string;
}

export default function MobileControls({
  onMoveStart,
  onMoveEnd,
  onAction,
  canInteract,
  nearbyBuildingName,
}: MobileControlsProps) {
  return (
    <div className="fixed bottom-4 left-0 right-0 z-40 px-4 pointer-events-none flex items-end justify-between max-w-5xl mx-auto">
      
      {/* Retro GBA D-Pad */}
      <div className="pointer-events-auto bg-slate-900/90 p-2 rounded-2xl border-2 border-slate-700 shadow-2xl backdrop-blur-md">
        <div className="grid grid-cols-3 gap-1 w-36 h-36">
          <div />
          <button
            onPointerDown={() => onMoveStart("up")}
            onPointerUp={onMoveEnd}
            onPointerLeave={onMoveEnd}
            className="rounded-xl bg-slate-800 active:bg-amber-500 border border-slate-700 flex items-center justify-center text-slate-200 active:text-slate-950 transition-colors"
            aria-label="Move Up"
          >
            <ArrowUp className="w-6 h-6" />
          </button>
          <div />

          <button
            onPointerDown={() => onMoveStart("left")}
            onPointerUp={onMoveEnd}
            onPointerLeave={onMoveEnd}
            className="rounded-xl bg-slate-800 active:bg-amber-500 border border-slate-700 flex items-center justify-center text-slate-200 active:text-slate-950 transition-colors"
            aria-label="Move Left"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-slate-700" />
          </div>
          <button
            onPointerDown={() => onMoveStart("right")}
            onPointerUp={onMoveEnd}
            onPointerLeave={onMoveEnd}
            className="rounded-xl bg-slate-800 active:bg-amber-500 border border-slate-700 flex items-center justify-center text-slate-200 active:text-slate-950 transition-colors"
            aria-label="Move Right"
          >
            <ArrowRight className="w-6 h-6" />
          </button>

          <div />
          <button
            onPointerDown={() => onMoveStart("down")}
            onPointerUp={onMoveEnd}
            onPointerLeave={onMoveEnd}
            className="rounded-xl bg-slate-800 active:bg-amber-500 border border-slate-700 flex items-center justify-center text-slate-200 active:text-slate-950 transition-colors"
            aria-label="Move Down"
          >
            <ArrowDown className="w-6 h-6" />
          </button>
          <div />
        </div>
      </div>

      {/* Retro GBA (A) Action / Interact Button */}
      <div className="pointer-events-auto flex flex-col items-center gap-2">
        {canInteract && nearbyBuildingName && (
          <div className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-pixel text-[10px] font-bold shadow-glowGold animate-bounce">
            Enter {nearbyBuildingName}
          </div>
        )}

        <button
          onClick={onAction}
          className={`w-20 h-20 rounded-full border-4 font-pixel font-bold text-sm shadow-2xl flex flex-col items-center justify-center transition-transform active:scale-95 ${
            canInteract
              ? "bg-gradient-to-tr from-amber-500 to-amber-400 border-amber-300 text-slate-950 shadow-glowGold animate-pulse"
              : "bg-slate-800/90 border-slate-600 text-slate-400 active:bg-slate-700"
          }`}
          aria-label="Interact Button"
        >
          <Sparkles className="w-4 h-4 mb-0.5" />
          <span>( A )</span>
        </button>
      </div>

    </div>
  );
}
