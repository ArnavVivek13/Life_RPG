"use client";

import { useEffect, useRef } from "react";
import { WORLD_WIDTH, WORLD_HEIGHT, BUILDINGS, EASTER_EGGS, Building } from "./WorldMapData";
import { Direction } from "./SpriteEngine";
import { Navigation, MapPin, X } from "lucide-react";

interface MiniMapRadarProps {
  playerX: number;
  playerY: number;
  playerDir: Direction;
  districtName: string;
  activeWaypoint: Building | null;
  onSelectWaypoint: (building: Building | null) => void;
}

export default function MiniMapRadar({
  playerX,
  playerY,
  playerDir,
  districtName,
  activeWaypoint,
  onSelectWaypoint,
}: MiniMapRadarProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Calculate distance to active waypoint in game meters
  const distanceToWaypoint = activeWaypoint
    ? Math.round(Math.hypot(playerX - activeWaypoint.doorX, playerY - activeWaypoint.doorY) / 10)
    : null;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = canvas.width;
    const radius = size / 2;

    ctx.clearRect(0, 0, size, size);

    // 1. Radar Disc Clip Mask
    ctx.save();
    ctx.beginPath();
    ctx.arc(radius, radius, radius - 4, 0, Math.PI * 2);
    ctx.clip();

    // Radar Background
    ctx.fillStyle = "rgba(11, 14, 20, 0.92)";
    ctx.fillRect(0, 0, size, size);

    // Radar Grid Lines
    ctx.strokeStyle = "rgba(6, 182, 212, 0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(radius, radius, radius * 0.35, 0, Math.PI * 2);
    ctx.arc(radius, radius, radius * 0.7, 0, Math.PI * 2);
    ctx.moveTo(radius, 0);
    ctx.lineTo(radius, size);
    ctx.moveTo(0, radius);
    ctx.lineTo(size, radius);
    ctx.stroke();

    // 2. Coordinate Transformation (Radar Centers on Player)
    // Radar Zoom Scale
    const scale = 0.08;

    // Draw Buildings on Radar
    BUILDINGS.forEach((b) => {
      const bx = radius + (b.doorX - playerX) * scale;
      const by = radius + (b.doorY - playerY) * scale;

      // Check if within radar disc
      const distFromCenter = Math.hypot(bx - radius, by - radius);
      if (distFromCenter < radius - 8) {
        ctx.fillStyle = b.blipColor;
        ctx.beginPath();
        ctx.arc(bx, by, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });

    // Draw Easter Eggs on Radar
    EASTER_EGGS.forEach((egg) => {
      const ex = radius + (egg.x - playerX) * scale;
      const ey = radius + (egg.y - playerY) * scale;
      const distFromCenter = Math.hypot(ex - radius, ey - radius);
      if (distFromCenter < radius - 8) {
        ctx.fillStyle = "#F59E0B";
        ctx.beginPath();
        ctx.arc(ex, ey, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Draw GPS Waypoint Route Line
    if (activeWaypoint) {
      const targetX = radius + (activeWaypoint.doorX - playerX) * scale;
      const targetY = radius + (activeWaypoint.doorY - playerY) * scale;

      ctx.strokeStyle = "rgba(245, 158, 11, 0.85)";
      ctx.lineWidth = 2.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(radius, radius);
      ctx.lineTo(targetX, targetY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Glowing Waypoint Beacon
      ctx.fillStyle = "#F59E0B";
      ctx.beginPath();
      ctx.arc(targetX, targetY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#FEF08A";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // 3. Player Arrow at Center (Rotates to Direction)
    ctx.save();
    ctx.translate(radius, radius);

    let angle = 0;
    if (playerDir === "up") angle = -Math.PI / 2;
    else if (playerDir === "down") angle = Math.PI / 2;
    else if (playerDir === "left") angle = Math.PI;
    else if (playerDir === "right") angle = 0;

    ctx.rotate(angle);

    // Player Directional Triangle
    ctx.fillStyle = "#38BDF8";
    ctx.beginPath();
    ctx.moveTo(7, 0);
    ctx.lineTo(-6, -5);
    ctx.lineTo(-4, 0);
    ctx.lineTo(-6, 5);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore();
    ctx.restore();

    // 4. Outer Radar Border (GTA V Style Glowing Cyan Ring)
    ctx.strokeStyle = activeWaypoint ? "#F59E0B" : "rgba(6, 182, 212, 0.7)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(radius, radius, radius - 2, 0, Math.PI * 2);
    ctx.stroke();
  }, [playerX, playerY, playerDir, activeWaypoint]);

  return (
    <div className="relative flex flex-col items-center select-none">
      
      {/* Radar Container */}
      <div className="relative group">
        <canvas
          ref={canvasRef}
          width={150}
          height={150}
          className="w-28 h-28 sm:w-36 sm:h-36 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.3)] backdrop-blur-md"
        />

        {/* GPS Waypoint Tag Bar */}
        {activeWaypoint && distanceToWaypoint !== null ? (
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-900/95 border border-amber-500/80 text-[10px] font-pixel text-amber-300 flex items-center gap-1.5 shadow-lg">
            <MapPin className="w-3 h-3 text-amber-400 animate-bounce" />
            <span>{activeWaypoint.name.split(" ")[0]}: {distanceToWaypoint}m</span>
            <button
              onClick={() => onSelectWaypoint(null)}
              className="p-0.5 hover:text-white rounded"
              title="Clear Waypoint"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-full bg-slate-900/90 border border-cyan-500/40 text-[9px] font-pixel text-cyan-300">
            {districtName.split(" ")[0]}
          </div>
        )}
      </div>

      {/* Quick GPS Destination Picker Drawer */}
      <div className="mt-8 flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-700 shadow-xl overflow-x-auto max-w-[280px]">
        {BUILDINGS.map((b) => (
          <button
            key={b.id}
            onClick={() => onSelectWaypoint(activeWaypoint?.id === b.id ? null : b)}
            className={`p-1.5 rounded-lg text-xs transition-all ${
              activeWaypoint?.id === b.id
                ? "bg-amber-500 text-slate-950 scale-110 shadow-glowGold"
                : "hover:bg-slate-800 text-slate-300"
            }`}
            title={`Set GPS Waypoint: ${b.name}`}
          >
            <span>{b.signIcon}</span>
          </button>
        ))}
      </div>

    </div>
  );
}
