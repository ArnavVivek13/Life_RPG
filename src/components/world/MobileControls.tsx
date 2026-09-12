"use client";

import { useState } from "react";
import { Direction } from "./SpriteEngine";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Sparkles, Gamepad2, MousePointerClick } from "lucide-react";

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
  const [showDpad, setShowDpad] = useState(true);

  return (
    <div className="fixed bottom-3 left-0 right-0 z-40 px-3 pointer-events-none flex items-end justify-between max-w-lg mx-auto">
      
      {/* Virtual D-Pad Container */}
      <div className="pointer-events-auto flex flex-col items-start gap-1.5">
        {/* Toggle Mode Button: D-Pad vs Tap to Walk */}
        <button
          onClick={() => setShowDpad((v) => !v)}
          className="px-2 py-1 rounded-lg bg-slate-950/80 hover:bg-slate-900 border border-slate-700/80 text-[10px] font-pixel text-slate-300 hover:text-amber-300 backdrop-blur-md shadow-md flex items-center gap-1 transition-all active:scale-95"
          title={showDpad ? "Switch to Tap-to-Walk" : "Show D-Pad"}
        >
          {showDpad ? (
            <>
              <MousePointerClick className="w-3 h-3 text-cyan-400" />
              <span>Tap Walk</span>
            </>
          ) : (
            <>
              <Gamepad2 className="w-3 h-3 text-amber-400" />
              <span>D-Pad</span>
            </>
          )}
        </button>

        {/* Compact Translucent D-Pad */}
        {showDpad && (
          <div className="bg-slate-950/75 p-1.5 rounded-2xl border border-slate-700/70 shadow-xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
            <div className="grid grid-cols-3 gap-1 w-28 h-28">
              <div />
              <button
                onPointerDown={() => onMoveStart("up")}
                onPointerUp={onMoveEnd}
                onPointerLeave={onMoveEnd}
                style={{ touchAction: "none" }}
                className="rounded-lg bg-slate-800/90 active:bg-amber-500 border border-slate-700/80 flex items-center justify-center text-slate-200 active:text-slate-950 transition-colors shadow-sm"
                aria-label="Move Up"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <div />

              <button
                onPointerDown={() => onMoveStart("left")}
                onPointerUp={onMoveEnd}
                onPointerLeave={onMoveEnd}
                style={{ touchAction: "none" }}
                className="rounded-lg bg-slate-800/90 active:bg-amber-500 border border-slate-700/80 flex items-center justify-center text-slate-200 active:text-slate-950 transition-colors shadow-sm"
                aria-label="Move Left"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="rounded-md bg-slate-900/60 border border-slate-800 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-slate-600" />
              </div>
              <button
                onPointerDown={() => onMoveStart("right")}
                onPointerUp={onMoveEnd}
                onPointerLeave={onMoveEnd}
                style={{ touchAction: "none" }}
                className="rounded-lg bg-slate-800/90 active:bg-amber-500 border border-slate-700/80 flex items-center justify-center text-slate-200 active:text-slate-950 transition-colors shadow-sm"
                aria-label="Move Right"
              >
                <ArrowRight className="w-4 h-4" />
              </button>

              <div />
              <button
                onPointerDown={() => onMoveStart("down")}
                onPointerUp={onMoveEnd}
                onPointerLeave={onMoveEnd}
                style={{ touchAction: "none" }}
                className="rounded-lg bg-slate-800/90 active:bg-amber-500 border border-slate-700/80 flex items-center justify-center text-slate-200 active:text-slate-950 transition-colors shadow-sm"
                aria-label="Move Down"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
              <div />
            </div>
          </div>
        )}
      </div>

      {/* Action / Interact Button */}
      <div className="pointer-events-auto flex flex-col items-center gap-1.5 pb-0.5">
        {canInteract && nearbyBuildingName && (
          <div className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-pixel text-[9px] font-bold shadow-glowGold animate-bounce">
            Enter {nearbyBuildingName}
          </div>
        )}

        <button
          onClick={onAction}
          style={{ touchAction: "none" }}
          className={`w-14 h-14 rounded-full border-2 font-pixel font-bold text-xs shadow-xl flex flex-col items-center justify-center transition-transform active:scale-95 ${
            canInteract
              ? "bg-gradient-to-tr from-amber-500 to-amber-400 border-amber-200 text-slate-950 shadow-glowGold animate-pulse"
              : "bg-slate-900/85 border-slate-700 text-slate-400 active:bg-slate-800 backdrop-blur-md"
          }`}
          aria-label="Interact Button"
        >
          <Sparkles className="w-3.5 h-3.5 mb-0.5" />
          <span>( A )</span>
        </button>
      </div>

    </div>
  );
}
