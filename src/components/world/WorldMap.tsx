"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Direction, drawPlayerSprite } from "./SpriteEngine";
import { 
  WORLD_WIDTH, 
  WORLD_HEIGHT, 
  BUILDINGS, 
  checkCollision, 
  getNearbyBuilding, 
  Building 
} from "./WorldMapData";
import MobileControls from "./MobileControls";

interface WorldMapProps {
  theme?: string;
  hasCrown?: boolean;
  hasHood?: boolean;
  onEnterBuilding: (building: Building) => void;
  onNearbyBuildingChange?: (building: Building | null) => void;
}

export default function WorldMap({
  theme = "default",
  hasCrown = false,
  hasHood = false,
  onEnterBuilding,
  onNearbyBuildingChange,
}: WorldMapProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Player state: Spawn in front of Quest Guild
  const playerPosRef = useRef({ x: 400, y: 260 });
  const playerDirRef = useRef<Direction>("down");
  const isMovingRef = useRef(false);
  const frameRef = useRef(0);
  const animTimerRef = useRef(0);

  // Key state tracking
  const keysPressed = useRef<{ [key: string]: boolean }>({});

  const [nearbyBuilding, setNearbyBuilding] = useState<Building | null>(null);

  // Handle interaction trigger
  const triggerInteract = useCallback(() => {
    const nearby = getNearbyBuilding(playerPosRef.current.x, playerPosRef.current.y);
    if (nearby) {
      onEnterBuilding(nearby);
    }
  }, [onEnterBuilding]);

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling on arrow keys and space
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space", " "].includes(e.key)) {
        e.preventDefault();
      }

      keysPressed.current[e.key.toLowerCase()] = true;
      keysPressed.current[e.code] = true;

      // Check interaction key
      if (e.key === "e" || e.key === "E" || e.key === " " || e.code === "Space" || e.key === "Enter") {
        triggerInteract();
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
  }, [triggerInteract]);

  // Main 60 FPS Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const SPEED = 2.8;

    const gameLoop = () => {
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
        // Normalize diagonal speed
        if (dx !== 0 && dy !== 0) {
          dx *= 0.7071;
          dy *= 0.7071;
        }

        const nextX = playerPosRef.current.x + dx;
        const nextY = playerPosRef.current.y + dy;

        // Collision Check X
        if (!checkCollision(nextX, playerPosRef.current.y)) {
          playerPosRef.current.x = nextX;
        }
        // Collision Check Y
        if (!checkCollision(playerPosRef.current.x, nextY)) {
          playerPosRef.current.y = nextY;
        }

        // Animation frame cycle
        animTimerRef.current += 1;
        if (animTimerRef.current % 8 === 0) {
          frameRef.current = (frameRef.current + 1) % 4;
        }
      } else {
        frameRef.current = 0;
      }

      // Check proximity to building entrance
      const currentNearby = getNearbyBuilding(playerPosRef.current.x, playerPosRef.current.y);
      setNearbyBuilding((prev) => {
        if (prev?.id !== currentNearby?.id) {
          if (onNearbyBuildingChange) onNearbyBuildingChange(currentNearby);
          return currentNearby;
        }
        return prev;
      });

      // 2. Render World Background
      ctx.clearRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

      // Grass / Ground base
      const groundColor = theme === "cyberpunk" ? "#070913" : "#0D2818";
      ctx.fillStyle = groundColor;
      ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

      // Subtle ground grid texture
      ctx.strokeStyle = theme === "cyberpunk" ? "rgba(43, 31, 84, 0.4)" : "rgba(16, 185, 129, 0.08)";
      ctx.lineWidth = 1;
      for (let x = 0; x < WORLD_WIDTH; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, WORLD_HEIGHT);
        ctx.stroke();
      }
      for (let y = 0; y < WORLD_HEIGHT; y += 32) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(WORLD_WIDTH, y);
        ctx.stroke();
      }

      // Cobblestone / Neon Pathway
      const pathColor = theme === "cyberpunk" ? "#181433" : "#334155";
      const pathBorder = theme === "cyberpunk" ? "#06B6D4" : "#64748B";

      // Horizontal central highway
      ctx.fillStyle = pathColor;
      ctx.fillRect(48, 224, WORLD_WIDTH - 96, 64);
      ctx.strokeStyle = pathBorder;
      ctx.lineWidth = 2;
      ctx.strokeRect(48, 224, WORLD_WIDTH - 96, 64);

      // Pathway connectors to buildings
      ctx.fillRect(128, 192, 32, 32); // House
      ctx.fillRect(400, 192, 32, 32); // Guild
      ctx.fillRect(672, 192, 32, 32); // Shop
      ctx.fillRect(160, 288, 32, 64); // Dojo
      ctx.fillRect(640, 288, 32, 64); // Shrine

      // Central Plaza Fountain / Landmark
      ctx.fillStyle = theme === "cyberpunk" ? "#0E1A38" : "#1E293B";
      ctx.fillRect(384, 320, 64, 64);
      ctx.strokeStyle = theme === "cyberpunk" ? "#F43F5E" : "#38BDF8";
      ctx.lineWidth = 2;
      ctx.strokeRect(384, 320, 64, 64);
      // Fountain Core
      ctx.fillStyle = theme === "cyberpunk" ? "#06B6D4" : "#0284C7";
      ctx.beginPath();
      ctx.arc(416, 352, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "14px monospace";
      ctx.fillText("✨", 408, 357);

      // 3. Render Buildings
      BUILDINGS.forEach((b) => {
        // Building Base Shadow
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(b.x + 4, b.y + 4, b.width, b.height);

        // Building Walls
        ctx.fillStyle = theme === "cyberpunk" ? "#0E1224" : b.color;
        ctx.fillRect(b.x, b.y, b.width, b.height);
        ctx.strokeStyle = theme === "cyberpunk" ? b.trimColor : "#475569";
        ctx.lineWidth = 2;
        ctx.strokeRect(b.x, b.y, b.width, b.height);

        // Roof
        ctx.fillStyle = theme === "cyberpunk" ? "#1E1B4B" : b.roofColor;
        ctx.fillRect(b.x, b.y, b.width, 48);
        ctx.strokeStyle = b.trimColor;
        ctx.lineWidth = 3;
        ctx.strokeRect(b.x, b.y, b.width, 48);

        // Door / Entrance
        ctx.fillStyle = theme === "cyberpunk" ? "#312E81" : "#0F172A";
        ctx.fillRect(b.doorX - 16, b.doorY - 32, 32, 32);
        ctx.strokeStyle = b.trimColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(b.doorX - 16, b.doorY - 32, 32, 32);

        // Door Mat / Welcome zone glow
        const isPlayerNear = currentNearby?.id === b.id;
        ctx.fillStyle = isPlayerNear ? "rgba(245, 158, 11, 0.4)" : "rgba(255, 255, 255, 0.1)";
        ctx.fillRect(b.doorX - 16, b.doorY, 32, 12);

        // Windows
        ctx.fillStyle = isPlayerNear ? "#FEF08A" : "#FDE047";
        ctx.fillRect(b.x + 16, b.y + 64, 24, 24);
        ctx.fillRect(b.x + b.width - 40, b.y + 64, 24, 24);
        ctx.strokeStyle = "#0F172A";
        ctx.lineWidth = 1;
        ctx.strokeRect(b.x + 16, b.y + 64, 24, 24);
        ctx.strokeRect(b.x + b.width - 40, b.y + 64, 24, 24);

        // Sign & Building Label
        ctx.fillStyle = "#F8FAFC";
        ctx.font = "bold 11px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`${b.signIcon} ${b.name}`, b.x + b.width / 2, b.y + 30);
      });

      // 4. Render Player Sprite
      drawPlayerSprite({
        ctx,
        x: playerPosRef.current.x,
        y: playerPosRef.current.y,
        direction: playerDirRef.current,
        isMoving: isMovingRef.current,
        frame: frameRef.current,
        hasCrown,
        hasHood,
        theme,
      });

      // 5. Next animation frame
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme, hasCrown, hasHood, onNearbyBuildingChange]);

  // Mobile D-Pad Handlers
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
    <div className="relative w-full flex flex-col items-center justify-center select-none overflow-hidden rounded-2xl pixel-box bg-slate-950 border-2 border-slate-700 shadow-2xl">
      
      {/* 2D HTML5 Game Canvas */}
      <canvas
        ref={canvasRef}
        width={WORLD_WIDTH}
        height={WORLD_HEIGHT}
        onClick={triggerInteract}
        className="w-full max-w-[832px] h-auto aspect-[832/576] image-pixelated cursor-pointer rounded-xl"
      />

      {/* Retro Bottom Info Tag */}
      <div className="w-full p-2 bg-slate-900/90 border-t border-slate-800 text-center flex items-center justify-between text-[11px] text-slate-400 font-pixel px-4">
        <span className="hidden sm:inline">Controls: [WASD] or [Arrows] to walk • [Space] / [E] to interact</span>
        <span className="sm:hidden">Use Virtual D-Pad to explore realm</span>
        <span className="text-amber-400">Realm: Valoria Village</span>
      </div>

      {/* Mobile Touch Controls */}
      <div className="sm:hidden w-full">
        <MobileControls
          onMoveStart={handleMobileMoveStart}
          onMoveEnd={handleMobileMoveEnd}
          onAction={triggerInteract}
          canInteract={!!nearbyBuilding}
          nearbyBuildingName={nearbyBuilding?.name}
        />
      </div>

    </div>
  );
}
