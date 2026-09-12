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

  // Player position: spawn in open Central Market Piazza (clear of all obstacles)
  const playerPosRef = useRef({ x: 980, y: 1040 });
  const playerDirRef = useRef<Direction>("down");
  const isMovingRef = useRef(false);
  const frameRef = useRef(0);
  const animTimerRef = useRef(0);

  // Click-to-walk target
  const targetPosRef = useRef<{ x: number; y: number } | null>(null);

  // Active GPS Waypoint
  const [activeWaypoint, setActiveWaypoint] = useState<Building | null>(null);
  const [hasBlessing, setHasBlessing] = useState(false);

  // State exposed to React HUD / Radar
  const [playerCoords, setPlayerCoords] = useState({ x: 980, y: 1040, dir: "down" as Direction });
  const [currentDistrict, setCurrentDistrict] = useState<DistrictZone>(getCurrentDistrict(980, 1040));
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

  // Keyboard Event Listeners (Global window tracking for maximum responsiveness)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const code = e.code;

      if (["arrowup", "arrowdown", "arrowleft", "arrowright", " ", "space"].includes(key) || ["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(code)) {
        e.preventDefault();
      }

      keysPressed.current[key] = true;
      keysPressed.current[code] = true;
      targetPosRef.current = null; // Keyboard movement cancels click-to-walk

      if (key === "e" || key === " " || code === "Space" || key === "enter") {
        handleInteract();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const code = e.code;
      keysPressed.current[key] = false;
      keysPressed.current[code] = false;
    };

    window.addEventListener("keydown", handleKeyDown, { passive: false });
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleInteract]);

  // Canvas Click / Tap Handler (Click-to-Walk & Tap-to-Interact)
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clickViewportX = (e.clientX - rect.left) * scaleX;
    const clickViewportY = (e.clientY - rect.top) * scaleY;

    // Viewport camera offset
    const VIEWPORT_WIDTH = 960;
    const VIEWPORT_HEIGHT = 600;
    const cameraX = Math.max(0, Math.min(playerPosRef.current.x - VIEWPORT_WIDTH / 2, WORLD_WIDTH - VIEWPORT_WIDTH));
    const cameraY = Math.max(0, Math.min(playerPosRef.current.y - VIEWPORT_HEIGHT / 2, WORLD_HEIGHT - VIEWPORT_HEIGHT));

    const worldClickX = clickViewportX + cameraX;
    const worldClickY = clickViewportY + cameraY;

    // Check if clicked near player to interact
    const distToPlayer = Math.hypot(worldClickX - playerPosRef.current.x, worldClickY - playerPosRef.current.y);
    if (distToPlayer < 48) {
      handleInteract();
      return;
    }

    // Set Click-to-walk target destination
    targetPosRef.current = { x: worldClickX, y: worldClickY };
  };

  // Main 60 FPS Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let tick = 0;
    const SPEED = 4.0;

    const VIEWPORT_WIDTH = 960;
    const VIEWPORT_HEIGHT = 600;

    canvas.width = VIEWPORT_WIDTH;
    canvas.height = VIEWPORT_HEIGHT;

    // Ambient particles
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

      const kp = keysPressed.current;
      const isUp = kp["arrowup"] || kp["w"] || kp["keyw"];
      const isDown = kp["arrowdown"] || kp["s"] || kp["keys"];
      const isLeft = kp["arrowleft"] || kp["a"] || kp["keya"];
      const isRight = kp["arrowright"] || kp["d"] || kp["keyd"];

      if (isUp) {
        dy -= SPEED;
        playerDirRef.current = "up";
      }
      if (isDown) {
        dy += SPEED;
        playerDirRef.current = "down";
      }
      if (isLeft) {
        dx -= SPEED;
        playerDirRef.current = "left";
      }
      if (isRight) {
        dx += SPEED;
        playerDirRef.current = "right";
      }

      // Handle Click-to-Walk navigation if no keyboard key pressed
      if (dx === 0 && dy === 0 && targetPosRef.current) {
        const tx = targetPosRef.current.x;
        const ty = targetPosRef.current.y;
        const dist = Math.hypot(tx - playerPosRef.current.x, ty - playerPosRef.current.y);

        if (dist > 8) {
          const angle = Math.atan2(ty - playerPosRef.current.y, tx - playerPosRef.current.x);
          dx = Math.cos(angle) * SPEED;
          dy = Math.sin(angle) * SPEED;

          if (Math.abs(dx) > Math.abs(dy)) {
            playerDirRef.current = dx > 0 ? "right" : "left";
          } else {
            playerDirRef.current = dy > 0 ? "down" : "up";
          }
        } else {
          targetPosRef.current = null;
        }
      }

      const isMoving = dx !== 0 || dy !== 0;
      isMovingRef.current = isMoving;

      if (isMoving) {
        if (dx !== 0 && dy !== 0 && !targetPosRef.current) {
          dx *= 0.7071;
          dy *= 0.7071;
        }

        const nextX = playerPosRef.current.x + dx;
        const nextY = playerPosRef.current.y + dy;

        // Try moving X
        if (!checkCollision(nextX, playerPosRef.current.y)) {
          playerPosRef.current.x = nextX;
        }
        // Try moving Y
        if (!checkCollision(playerPosRef.current.x, nextY)) {
          playerPosRef.current.y = nextY;
        }

        animTimerRef.current += 1;
        if (animTimerRef.current % 6 === 0) {
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

      // 2. Camera Clamping (Centers smoothly on Player)
      const cameraX = Math.max(0, Math.min(px - VIEWPORT_WIDTH / 2, WORLD_WIDTH - VIEWPORT_WIDTH));
      const cameraY = Math.max(0, Math.min(py - VIEWPORT_HEIGHT / 2, WORLD_HEIGHT - VIEWPORT_HEIGHT));

      ctx.save();
      ctx.clearRect(0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
      ctx.translate(-cameraX, -cameraY);

      // 3. Render Sprawling Ground & District Biomes
      const groundColor = theme === "cyberpunk" ? "#070913" : "#0D2818";
      ctx.fillStyle = groundColor;
      ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

      // Distinct District Pavements
      // Hero's Quarter
      ctx.fillStyle = theme === "cyberpunk" ? "#090D1A" : "#14532D";
      ctx.fillRect(40, 40, 720, 620);

      // Arcane Academy
      ctx.fillStyle = theme === "cyberpunk" ? "#1A103C" : "#1E1B4B";
      ctx.fillRect(840, 40, 720, 620);
      ctx.strokeStyle = "#8B5CF6";
      ctx.lineWidth = 3;
      ctx.strokeRect(840, 40, 720, 620);

      // Whispering Woods
      ctx.fillStyle = theme === "cyberpunk" ? "#051A1F" : "#052E16";
      ctx.fillRect(1640, 40, 720, 620);

      // Central Market
      ctx.fillStyle = theme === "cyberpunk" ? "#111827" : "#334155";
      ctx.fillRect(440, 700, 1120, 560);
      ctx.strokeStyle = theme === "cyberpunk" ? "#06B6D4" : "#64748B";
      ctx.lineWidth = 4;
      ctx.strokeRect(440, 700, 1120, 560);

      // Colosseum
      ctx.fillStyle = theme === "cyberpunk" ? "#2B1116" : "#451A03";
      ctx.fillRect(40, 1140, 720, 620);

      // Artisan Plaza
      ctx.fillStyle = theme === "cyberpunk" ? "#1F152B" : "#37271E";
      ctx.fillRect(1440, 1140, 920, 620);

      // Avenues & Connecting Highways
      ctx.fillStyle = theme === "cyberpunk" ? "#1F2937" : "#475569";
      ctx.fillRect(940, 0, 80, WORLD_HEIGHT);
      ctx.fillRect(0, 880, WORLD_WIDTH, 80);

      // 4. Central Grand Fountain
      ctx.fillStyle = theme === "cyberpunk" ? "#0E1A38" : "#1E293B";
      ctx.fillRect(930, 1200, 100, 100);
      ctx.strokeStyle = theme === "cyberpunk" ? "#F43F5E" : "#38BDF8";
      ctx.lineWidth = 3;
      ctx.strokeRect(930, 1200, 100, 100);

      const ripple = (tick % 40) / 40;
      ctx.fillStyle = theme === "cyberpunk" ? "#06B6D4" : "#0284C7";
      ctx.beginPath();
      ctx.arc(980, 1250, 36, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = `rgba(255, 255, 255, ${1 - ripple})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(980, 1250, 12 + ripple * 24, 0, Math.PI * 2);
      ctx.stroke();

      // 5. Render Buildings
      BUILDINGS.forEach((b) => {
        // Drop Shadow
        ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
        ctx.fillRect(b.x + 6, b.y + 6, b.width, b.height);

        // Facade
        ctx.fillStyle = theme === "cyberpunk" ? "#0E1224" : b.color;
        ctx.fillRect(b.x, b.y, b.width, b.height);
        ctx.strokeStyle = b.trimColor;
        ctx.lineWidth = 3;
        ctx.strokeRect(b.x, b.y, b.width, b.height);

        // Roof
        ctx.fillStyle = theme === "cyberpunk" ? "#1E1B4B" : b.roofColor;
        ctx.fillRect(b.x, b.y, b.width, 56);
        ctx.strokeStyle = b.trimColor;
        ctx.lineWidth = 4;
        ctx.strokeRect(b.x, b.y, b.width, 56);

        // Door
        ctx.fillStyle = "#0F172A";
        ctx.fillRect(b.doorX - 20, b.doorY - 36, 40, 36);
        ctx.strokeStyle = b.trimColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(b.doorX - 20, b.doorY - 36, 40, 36);

        const isNear = nearbyBuilding?.id === b.id;
        ctx.fillStyle = isNear ? "rgba(245, 158, 11, 0.45)" : "rgba(255, 255, 255, 0.1)";
        ctx.fillRect(b.doorX - 20, b.doorY, 40, 14);

        // Windows
        ctx.fillStyle = isNear ? "#FEF08A" : "#FDE047";
        ctx.fillRect(b.x + 20, b.y + 72, 28, 28);
        ctx.fillRect(b.x + b.width - 48, b.y + 72, 28, 28);
        ctx.strokeStyle = "#0F172A";
        ctx.lineWidth = 2;
        ctx.strokeRect(b.x + 20, b.y + 72, 28, 28);
        ctx.strokeRect(b.x + b.width - 48, b.y + 72, 28, 28);

        // Sign
        ctx.fillStyle = "#F8FAFC";
        ctx.font = "bold 13px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`${b.signIcon} ${b.name}`, b.x + b.width / 2, b.y + 36);
      });

      // 6. Easter Eggs
      EASTER_EGGS.forEach((egg) => {
        drawEasterEgg(ctx, egg, tick);
      });

      // 7. GPS Waypoint Beam
      if (activeWaypoint) {
        const wx = activeWaypoint.doorX;
        const wy = activeWaypoint.doorY;

        const pulse = Math.abs(Math.sin(tick * 0.08)) * 0.3 + 0.7;
        const grad = ctx.createLinearGradient(wx, wy - 180, wx, wy);
        grad.addColorStop(0, "rgba(245, 158, 11, 0)");
        grad.addColorStop(1, `rgba(245, 158, 11, ${0.5 * pulse})`);

        ctx.fillStyle = grad;
        ctx.fillRect(wx - 16, wy - 180, 32, 180);

        ctx.strokeStyle = "#F59E0B";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(wx, wy, 18 * pulse, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 8. Player Sprite
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

      // 9. Particles
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

  // Mobile D-Pad Touch Handlers
  const handleMobileMoveStart = (dir: Direction) => {
    targetPosRef.current = null;
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
      tabIndex={0}
      className="relative w-full flex flex-col items-center justify-center select-none overflow-hidden rounded-2xl pixel-box bg-slate-950 border-2 border-slate-700 shadow-2xl focus:outline-none focus:ring-2 focus:ring-amber-400"
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

      {/* Main 2D World Canvas with Click-to-Walk & Key navigation */}
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="w-full max-w-[960px] h-auto aspect-[16/10] image-pixelated cursor-crosshair"
      />

      {/* Controls Bar */}
      <div className="w-full p-2 bg-slate-900/95 border-t border-slate-800 text-center flex items-center justify-between text-[11px] text-slate-400 font-pixel px-4">
        <span className="hidden sm:inline">Controls: [WASD] / [Arrows] or Click/Tap to walk • [Space] / [E] to interact</span>
        <span className="sm:hidden">Explore Valoria with Virtual D-Pad or Tap</span>
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
