"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Direction, drawPlayerSprite, drawEasterEgg } from "./SpriteEngine";
import { 
  WORLD_WIDTH, 
  WORLD_HEIGHT, 
  BUILDINGS, 
  EASTER_EGGS, 
  checkCollision, 
  getNearbyBuilding, 
  getNearbyEasterEgg,
  getCurrentDistrict,
  Building,
  EasterEgg,
  DistrictZone
} from "./WorldMapData";
import MiniMapRadar from "./MiniMapRadar";
import MobileControls from "./MobileControls";

interface WorldMapProps {
  theme?: string;
  hasCrown?: boolean;
  hasHood?: boolean;
  userGold: number;
  onEnterBuilding: (building: Building) => void;
  onEasterEggTrigger: (egg: EasterEgg) => void;
  onNearbyBuildingChange?: (building: Building | null) => void;
  onNearbyEasterEggChange?: (egg: EasterEgg | null) => void;
  onDistrictChange?: (district: DistrictZone) => void;
}

export default function WorldMap({
  theme = "default",
  hasCrown = false,
  hasHood = false,
  userGold,
  onEnterBuilding,
  onEasterEggTrigger,
  onNearbyBuildingChange,
  onNearbyEasterEggChange,
  onDistrictChange,
}: WorldMapProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Player position: spawn in Central Market
  const playerPosRef = useRef({ x: 980, y: 1080 });
  const playerDirRef = useRef<Direction>("up");
  const isMovingRef = useRef(false);
  const frameRef = useRef(0);
  const animTimerRef = useRef(0);

  // Active GPS Waypoint
  const [activeWaypoint, setActiveWaypoint] = useState<Building | null>(null);
  const [hasBlessing, setHasBlessing] = useState(false);

  // State exposed to React HUD / Radar
  const [playerCoords, setPlayerCoords] = useState({ x: 980, y: 1080, dir: "up" as Direction });
  const [currentDistrict, setCurrentDistrict] = useState<DistrictZone>(getCurrentDistrict(980, 1080));
  const [nearbyBuilding, setNearbyBuilding] = useState<Building | null>(null);
  const [nearbyEgg, setNearbyEgg] = useState<EasterEgg | null>(null);

  // Key tracking
  const keysPressed = useRef<{ [key: string]: boolean }>({});

  // Trigger Interaction (Building Entrance or Easter Egg)
  const handleInteract = useCallback(() => {
    const px = playerPosRef.current.x;
    const py = playerPosRef.current.y;

    const building = getNearbyBuilding(px, py);
    if (building) {
      onEnterBuilding(building);
      return;
    }

    const egg = getNearbyEasterEgg(px, py);
    if (egg) {
      if (egg.type === "wishing_well") {
        setHasBlessing(true);
        setTimeout(() => setHasBlessing(false), 15000); // 15s blessing aura
      }
      onEasterEggTrigger(egg);
    }
  }, [onEnterBuilding, onEasterEggTrigger]);

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space", " "].includes(e.key)) {
        e.preventDefault();
      }
      keysPressed.current[e.key.toLowerCase()] = true;
      keysPressed.current[e.code] = true;

      if (e.key === "e" || e.key === "E" || e.key === " " || e.code === "Space" || e.key === "Enter") {
        handleInteract();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false;
      keysPressed.current[e.code] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleInteract]);

  // Main 60 FPS Game Loop with Clamped Scrolling Camera
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let tick = 0;
    const SPEED = 3.6;

    // Relativistic Viewport sizing (adapts to container size)
    const VIEWPORT_WIDTH = 960;
    const VIEWPORT_HEIGHT = 600;

    canvas.width = VIEWPORT_WIDTH;
    canvas.height = VIEWPORT_HEIGHT;

    // Ambient smoke & leaves particles
    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * WORLD_WIDTH,
      y: Math.random() * WORLD_HEIGHT,
      size: Math.random() * 2.5 + 1,
      speedX: Math.random() * 0.8 - 0.4,
      speedY: Math.random() * -0.6 - 0.2,
      opacity: Math.random() * 0.6 + 0.2,
    }));

    const gameLoop = () => {
      tick++;

      // 1. Process Movement Inputs
      let dx = 0;
      let dy = 0;

      if (keysPressed.current["arrowup"] || keysPressed.current["w"] || keysPressed.current["KeyW"]) {
        dy -= SPEED;
        playerDirRef.current = "up";
      }
      if (keysPressed.current["arrowdown"] || keysPressed.current["s"] || keysPressed.current["KeyS"]) {
        dy += SPEED;
        playerDirRef.current = "down";
      }
      if (keysPressed.current["arrowleft"] || keysPressed.current["a"] || keysPressed.current["KeyA"]) {
        dx -= SPEED;
        playerDirRef.current = "left";
      }
      if (keysPressed.current["arrowright"] || keysPressed.current["d"] || keysPressed.current["KeyD"]) {
        dx += SPEED;
        playerDirRef.current = "right";
      }

      const isMoving = dx !== 0 || dy !== 0;
      isMovingRef.current = isMoving;

      if (isMoving) {
        if (dx !== 0 && dy !== 0) {
          dx *= 0.7071;
          dy *= 0.7071;
        }

        const nextX = playerPosRef.current.x + dx;
        const nextY = playerPosRef.current.y + dy;

        if (!checkCollision(nextX, playerPosRef.current.y)) {
          playerPosRef.current.x = nextX;
        }
        if (!checkCollision(playerPosRef.current.x, nextY)) {
          playerPosRef.current.y = nextY;
        }

        animTimerRef.current += 1;
        if (animTimerRef.current % 7 === 0) {
          frameRef.current = (frameRef.current + 1) % 4;
        }
      } else {
        frameRef.current = 0;
      }

      const px = playerPosRef.current.x;
      const py = playerPosRef.current.y;

      // Update React state periodically
      if (tick % 6 === 0) {
        setPlayerCoords({ x: px, y: py, dir: playerDirRef.current });

        const newDistrict = getCurrentDistrict(px, py);
        setCurrentDistrict(newDistrict);
        if (onDistrictChange) onDistrictChange(newDistrict);

        const bld = getNearbyBuilding(px, py);
        setNearbyBuilding(bld);
        if (onNearbyBuildingChange) onNearbyBuildingChange(bld);

        const egg = getNearbyEasterEgg(px, py);
        setNearbyEgg(egg);
        if (onNearbyEasterEggChange) onNearbyEasterEggChange(egg);
      }

      // 2. Camera Clamping (Centers on Player)
      const cameraX = Math.max(0, Math.min(px - VIEWPORT_WIDTH / 2, WORLD_WIDTH - VIEWPORT_WIDTH));
      const cameraY = Math.max(0, Math.min(py - VIEWPORT_HEIGHT / 2, WORLD_HEIGHT - VIEWPORT_HEIGHT));

      ctx.save();
      ctx.clearRect(0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
      ctx.translate(-cameraX, -cameraY);

      // 3. Render Sprawling Ground & District Biomes
      // Background base
      const groundColor = theme === "cyberpunk" ? "#070913" : "#0D2818";
      ctx.fillStyle = groundColor;
      ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

      // Distinct District Pavements
      // Hero's Quarter (Lush green meadow & wood chips)
      ctx.fillStyle = theme === "cyberpunk" ? "#090D1A" : "#14532D";
      ctx.fillRect(40, 40, 720, 620);

      // Arcane Academy (Deep mystic stone plaza)
      ctx.fillStyle = theme === "cyberpunk" ? "#1A103C" : "#1E1B4B";
      ctx.fillRect(840, 40, 720, 620);
      ctx.strokeStyle = "#8B5CF6";
      ctx.lineWidth = 3;
      ctx.strokeRect(840, 40, 720, 620);

      // Whispering Woods (Dark deep pine moss)
      ctx.fillStyle = theme === "cyberpunk" ? "#051A1F" : "#052E16";
      ctx.fillRect(1640, 40, 720, 620);

      // Central Market (Grand Cobblestone Piazza)
      ctx.fillStyle = theme === "cyberpunk" ? "#111827" : "#334155";
      ctx.fillRect(440, 720, 1120, 540);
      ctx.strokeStyle = theme === "cyberpunk" ? "#06B6D4" : "#64748B";
      ctx.lineWidth = 4;
      ctx.strokeRect(440, 720, 1120, 540);

      // Colosseum (Red Arena Sand)
      ctx.fillStyle = theme === "cyberpunk" ? "#2B1116" : "#451A03";
      ctx.fillRect(40, 1140, 720, 620);

      // Artisan Plaza (Warm Terracotta Square)
      ctx.fillStyle = theme === "cyberpunk" ? "#1F152B" : "#37271E";
      ctx.fillRect(1440, 1140, 920, 620);

      // Inter-District Connecting Highways & Cobblestone Avenues
      ctx.fillStyle = theme === "cyberpunk" ? "#1F2937" : "#475569";
      // Vertical central avenue
      ctx.fillRect(940, 0, 80, WORLD_HEIGHT);
      // Horizontal central highway
      ctx.fillRect(0, 880, WORLD_WIDTH, 80);

      // 4. Render Central Grand Fountain & Water Ripples
      ctx.fillStyle = theme === "cyberpunk" ? "#0E1A38" : "#1E293B";
      ctx.fillRect(930, 1100, 100, 100);
      ctx.strokeStyle = theme === "cyberpunk" ? "#F43F5E" : "#38BDF8";
      ctx.lineWidth = 3;
      ctx.strokeRect(930, 1100, 100, 100);

      // Animated Water Pool
      const ripple = (tick % 40) / 40;
      ctx.fillStyle = theme === "cyberpunk" ? "#06B6D4" : "#0284C7";
      ctx.beginPath();
      ctx.arc(980, 1150, 36, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = `rgba(255, 255, 255, ${1 - ripple})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(980, 1150, 12 + ripple * 24, 0, Math.PI * 2);
      ctx.stroke();

      // 5. Render Buildings with Rich Silhouettes
      BUILDINGS.forEach((b) => {
        // Drop Shadow
        ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
        ctx.fillRect(b.x + 6, b.y + 6, b.width, b.height);

        // Building Facade
        ctx.fillStyle = theme === "cyberpunk" ? "#0E1224" : b.color;
        ctx.fillRect(b.x, b.y, b.width, b.height);
        ctx.strokeStyle = b.trimColor;
        ctx.lineWidth = 3;
        ctx.strokeRect(b.x, b.y, b.width, b.height);

        // Roof Canopy with layered trim
        ctx.fillStyle = theme === "cyberpunk" ? "#1E1B4B" : b.roofColor;
        ctx.fillRect(b.x, b.y, b.width, 56);
        ctx.strokeStyle = b.trimColor;
        ctx.lineWidth = 4;
        ctx.strokeRect(b.x, b.y, b.width, 56);

        // Door / Entrance
        ctx.fillStyle = "#0F172A";
        ctx.fillRect(b.doorX - 20, b.doorY - 36, 40, 36);
        ctx.strokeStyle = b.trimColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(b.doorX - 20, b.doorY - 36, 40, 36);

        // Door Mat Glow if nearby
        const isNear = nearbyBuilding?.id === b.id;
        ctx.fillStyle = isNear ? "rgba(245, 158, 11, 0.45)" : "rgba(255, 255, 255, 0.1)";
        ctx.fillRect(b.doorX - 20, b.doorY, 40, 14);

        // Lit Windows
        ctx.fillStyle = isNear ? "#FEF08A" : "#FDE047";
        ctx.fillRect(b.x + 20, b.y + 72, 28, 28);
        ctx.fillRect(b.x + b.width - 48, b.y + 72, 28, 28);
        ctx.strokeStyle = "#0F172A";
        ctx.lineWidth = 2;
        ctx.strokeRect(b.x + 20, b.y + 72, 28, 28);
        ctx.strokeRect(b.x + b.width - 48, b.y + 72, 28, 28);

        // Hanging District Sign
        ctx.fillStyle = "#F8FAFC";
        ctx.font = "bold 13px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`${b.signIcon} ${b.name}`, b.x + b.width / 2, b.y + 36);
      });

      // 6. Render Easter Egg Objects & NPCs
      EASTER_EGGS.forEach((egg) => {
        drawEasterEgg(ctx, egg, tick);
      });

      // 7. Render GPS Waypoint Beam (if active)
      if (activeWaypoint) {
        const wx = activeWaypoint.doorX;
        const wy = activeWaypoint.doorY;

        // Glowing beacon beam from sky
        const pulse = Math.abs(Math.sin(tick * 0.08)) * 0.3 + 0.7;
        const grad = ctx.createLinearGradient(wx, wy - 180, wx, wy);
        grad.addColorStop(0, "rgba(245, 158, 11, 0)");
        grad.addColorStop(1, `rgba(245, 158, 11, ${0.5 * pulse})`);

        ctx.fillStyle = grad;
        ctx.fillRect(wx - 16, wy - 180, 32, 180);

        // Ground beacon ring
        ctx.strokeStyle = "#F59E0B";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(wx, wy, 18 * pulse, 0, Math.PI * 2);
        ctx.stroke();

        // Arrow Marker
        ctx.fillStyle = "#F59E0B";
        ctx.beginPath();
        ctx.moveTo(wx, wy - 24);
        ctx.lineTo(wx - 10, wy - 44);
        ctx.lineTo(wx + 10, wy - 44);
        ctx.closePath();
        ctx.fill();
      }

      // 8. Render Player Sprite
      drawPlayerSprite({
        ctx,
        x: px,
        y: py,
        direction: playerDirRef.current,
        isMoving: isMovingRef.current,
        frame: frameRef.current,
        hasCrown,
        hasHood,
        hasBlessing,
        theme,
      });

      // 9. Render Atmospheric Particles (Floating Leaves & Chimney Sparks)
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = WORLD_WIDTH;
        if (p.x > WORLD_WIDTH) p.x = 0;
        if (p.y < 0) p.y = WORLD_HEIGHT;

        ctx.fillStyle = theme === "cyberpunk" ? `rgba(6, 182, 212, ${p.opacity})` : `rgba(252, 211, 77, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme, hasCrown, hasHood, hasBlessing, activeWaypoint, nearbyBuilding, onDistrictChange, onNearbyBuildingChange, onNearbyEasterEggChange]);


  // Touch Handlers for Mobile D-Pad
  const handleMobileMoveStart = (dir: Direction) => {
    keysPressed.current = {
      arrowup: dir === "up",
      arrowdown: dir === "down",
      arrowleft: dir === "left",
      arrowright: dir === "right",
    };
  };

  const handleMobileMoveEnd = () => {
    keysPressed.current = {};
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full flex flex-col items-center justify-center select-none overflow-hidden rounded-2xl pixel-box bg-slate-950 border-2 border-slate-700 shadow-2xl"
    >
      {/* GTA V Style Radar in Top-Right Corner */}
      <div className="absolute top-4 right-4 z-30 pointer-events-auto">
        <MiniMapRadar
          playerX={playerCoords.x}
          playerY={playerCoords.y}
          playerDir={playerCoords.dir}
          districtName={currentDistrict.name}
          activeWaypoint={activeWaypoint}
          onSelectWaypoint={(bld) => setActiveWaypoint(bld)}
        />
      </div>

      {/* District Entrance Banner */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700 text-xs font-title text-amber-300 shadow-lg flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
        <span>{currentDistrict.name}</span>
      </div>

      {/* Main 2D World Canvas */}
      <canvas
        ref={canvasRef}
        onClick={handleInteract}
        className="w-full max-w-[960px] h-auto aspect-[16/10] image-pixelated cursor-pointer"
      />

      {/* Controls Bar */}
      <div className="w-full p-2 bg-slate-900/95 border-t border-slate-800 text-center flex items-center justify-between text-[11px] text-slate-400 font-pixel px-4">
        <span className="hidden sm:inline">Controls: [WASD] or [Arrows] to explore • [Space] / [E] to interact</span>
        <span className="sm:hidden">Explore Valoria with Virtual D-Pad</span>
        <span className="text-cyan-400">GTA-Style GPS Active</span>
      </div>

      {/* Mobile Touch Controls */}
      <div className="sm:hidden w-full">
        <MobileControls
          onMoveStart={handleMobileMoveStart}
          onMoveEnd={handleMobileMoveEnd}
          onAction={handleInteract}
          canInteract={!!nearbyBuilding || !!nearbyEgg}
          nearbyBuildingName={nearbyBuilding?.name || nearbyEgg?.name}
        />
      </div>

    </div>
  );
}
