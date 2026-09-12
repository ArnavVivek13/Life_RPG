"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  Direction,
  drawPlayerSprite,
  drawNPC,
  drawEasterEgg,
  drawDecor,
  drawBuilding,
  drawGBAPath,
  PALETTES,
  ThemePalette,
} from "./SpriteEngine";
import {
  WORLD_WIDTH,
  WORLD_HEIGHT,
  BUILDINGS,
  EASTER_EGGS,
  NPCS,
  WORLD_DECOR,
  DISTRICT_ZONES,
  checkCollision,
  getNearbyBuilding,
  getNearbyEasterEgg,
  getCurrentDistrict,
  Building,
  EasterEgg,
  DistrictZone,
  NPC,
} from "./WorldMapData";
import MiniMapRadar from "./MiniMapRadar";
import MobileControls from "./MobileControls";
import RealmFullMapModal from "./RealmFullMapModal";

interface WorldMapProps {
  theme?: string;
  hasCrown?: boolean;
  hasHood?: boolean;
  hasSword?: boolean;
  hasShield?: boolean;
  hasCape?: boolean;
  hasCowl?: boolean;
  userGold: number;
  onEnterBuilding: (building: Building) => void;
  onEasterEggTrigger: (egg: EasterEgg) => void;
  onNearbyBuildingChange?: (building: Building | null) => void;
  onNearbyEasterEggChange?: (egg: EasterEgg | null) => void;
  onDistrictChange?: (district: DistrictZone) => void;
}

/** NPC runtime state (position, walk offset, direction, frame) */
interface NPCState {
  npc: NPC;
  x: number;
  y: number;
  dir: Direction;
  frame: number;
  animTimer: number;
  walkPhase: number;
  moving: boolean;
}

function normalizeTheme(t?: string): string {
  if (!t) return "classic_firered";
  if (PALETTES[t]) return t;
  if (t === "cyberpunk") return "cyberpunk_gba";
  if (t === "emerald" || t === "night") return "emerald_night";
  if (t === "autumn" || t === "johto") return "johto_autumn";
  if (t === "lavender" || t === "ghost") return "lavender_ghost";
  return "classic_firered";
}

const THEME_ICONS: Record<string, string> = {
  classic_firered: "🌿",
  emerald_night: "🌙",
  johto_autumn: "🍂",
  lavender_ghost: "👻",
  cyberpunk_gba: "⚡",
};

const CANONICAL_THEMES = [
  { key: "classic_firered", name: "Kanto Day", icon: "🌿" },
  { key: "emerald_night", name: "Emerald Night", icon: "🌙" },
  { key: "johto_autumn", name: "Johto Autumn", icon: "🍂" },
  { key: "lavender_ghost", name: "Lavender Town", icon: "👻" },
  { key: "cyberpunk_gba", name: "Neon Byte", icon: "⚡" },
] as const;

export default function WorldMap({
  theme = "default",
  hasCrown = false,
  hasHood = false,
  hasSword = false,
  hasShield = false,
  hasCape = false,
  hasCowl = false,
  userGold,
  onEnterBuilding,
  onEasterEggTrigger,
  onNearbyBuildingChange,
  onNearbyEasterEggChange,
  onDistrictChange,
}: WorldMapProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Active theme selection
  const [activeTheme, setActiveTheme] = useState<string>(() => normalizeTheme(theme));

  useEffect(() => {
    if (theme) {
      setActiveTheme(normalizeTheme(theme));
    }
  }, [theme]);

  const activePalette: ThemePalette = PALETTES[activeTheme] || PALETTES.classic_firered;

  // Player spawns in Central Market open plaza
  const playerPosRef = useRef({ x: 1260, y: 1380 });
  const playerDirRef = useRef<Direction>("down");
  const isMovingRef = useRef(false);
  const frameRef = useRef(0);
  const animTimerRef = useRef(0);

  // Click-to-walk target
  const targetPosRef = useRef<{ x: number; y: number } | null>(null);

  // Active GPS Waypoint & Full Tactical Map
  const [activeWaypoint, setActiveWaypoint] = useState<Building | null>(null);
  const [hasBlessing, setHasBlessing] = useState(false);
  const [isFullMapOpen, setIsFullMapOpen] = useState(false);

  // Fast Travel handler from map modal
  const handleFastTravel = useCallback((tx: number, ty: number) => {
    playerPosRef.current = { x: tx, y: ty };
    setPlayerCoords({ x: tx, y: ty, dir: "down" });
    targetPosRef.current = null;
  }, []);

  // Reactive HUD state
  const [playerCoords, setPlayerCoords] = useState({
    x: 1260, y: 1380, dir: "down" as Direction,
  });
  const [currentDistrict, setCurrentDistrict] = useState<DistrictZone>(
    getCurrentDistrict(1260, 1380)
  );
  const [nearbyBuilding, setNearbyBuilding] = useState<Building | null>(null);
  const [nearbyEgg, setNearbyEgg] = useState<EasterEgg | null>(null);

  // Key tracking
  const keysPressed = useRef<{ [key: string]: boolean }>({});

  // NPC states
  const npcStates = useRef<NPCState[]>(
    NPCS.map((npc) => ({
      npc,
      x: npc.x,
      y: npc.y,
      dir: "down" as Direction,
      frame: 0,
      animTimer: 0,
      walkPhase: Math.random() * Math.PI * 2,
      moving: npc.walkPattern !== "idle",
    }))
  );

  // ── Interact ──────────────────────────────────────────────────────────────
  const handleInteract = useCallback(() => {
    const px = playerPosRef.current.x;
    const py = playerPosRef.current.y;

    const building = getNearbyBuilding(px, py);
    if (building) { onEnterBuilding(building); return; }

    const egg = getNearbyEasterEgg(px, py);
    if (egg) {
      if (egg.type === "wishing_well") {
        setHasBlessing(true);
        setTimeout(() => setHasBlessing(false), 15000);
      }
      onEasterEggTrigger(egg);
    }
  }, [onEnterBuilding, onEasterEggTrigger]);

  // ── Keyboard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const code = e.code;
      if (
        ["arrowup","arrowdown","arrowleft","arrowright"," ","space"].includes(key) ||
        ["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(code)
      ) { e.preventDefault(); }
      keysPressed.current[key] = true;
      keysPressed.current[code] = true;
      targetPosRef.current = null;
      if (key === "m" || code === "KeyM") {
        setIsFullMapOpen((prev) => !prev);
      }
      if (key === "e" || key === " " || code === "Space" || key === "enter") {
        handleInteract();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false;
      keysPressed.current[e.code] = false;
    };
    window.addEventListener("keydown", handleKeyDown, { passive: false });
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleInteract]);

  // ── Canvas Click / Tap ────────────────────────────────────────────────────
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickVX = (e.clientX - rect.left) * scaleX;
    const clickVY = (e.clientY - rect.top) * scaleY;

    const VW = canvas.width;
    const VH = canvas.height;
    const camX = Math.max(0, Math.min(playerPosRef.current.x - VW / 2, WORLD_WIDTH - VW));
    const camY = Math.max(0, Math.min(playerPosRef.current.y - VH / 2, WORLD_HEIGHT - VH));
    const worldX = clickVX + camX;
    const worldY = clickVY + camY;

    const distToPlayer = Math.hypot(worldX - playerPosRef.current.x, worldY - playerPosRef.current.y);
    if (distToPlayer < 48) { handleInteract(); return; }
    targetPosRef.current = { x: worldX, y: worldY };
  };

  // ── Main Game Loop ────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let tick = 0;
    const SPEED = 4.0;
    const VW = 960;
    const VH = 600;
    canvas.width = VW;
    canvas.height = VH;

    // Ambient particles (GBA motes)
    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * WORLD_WIDTH,
      y: Math.random() * WORLD_HEIGHT,
      speedX: Math.random() * 0.6 - 0.3,
      speedY: Math.random() * -0.5 - 0.1,
      districtIdx: Math.floor(Math.random() * 6),
    }));

    // Cherry blossom petals (crisp GBA flakes)
    const petals = Array.from({ length: 25 }, () => ({
      x: Math.random() * WORLD_WIDTH,
      y: Math.random() * WORLD_HEIGHT,
      speedX: Math.random() * 1.0 - 0.5,
      speedY: Math.random() * 0.8 + 0.3,
    }));

    const gameLoop = () => {
      tick++;

      // ── 1. Player Movement ──────────────────────────────────────────────
      let dx = 0, dy = 0;
      const kp = keysPressed.current;
      const isUp = kp["arrowup"] || kp["w"] || kp["keyw"];
      const isDown = kp["arrowdown"] || kp["s"] || kp["keys"];
      const isLeft = kp["arrowleft"] || kp["a"] || kp["keya"];
      const isRight = kp["arrowright"] || kp["d"] || kp["keyd"];

      if (isUp) { dy -= SPEED; playerDirRef.current = "up"; }
      if (isDown) { dy += SPEED; playerDirRef.current = "down"; }
      if (isLeft) { dx -= SPEED; playerDirRef.current = "left"; }
      if (isRight) { dx += SPEED; playerDirRef.current = "right"; }

      // Click-to-walk
      if (dx === 0 && dy === 0 && targetPosRef.current) {
        const tx = targetPosRef.current.x;
        const ty = targetPosRef.current.y;
        const dist = Math.hypot(tx - playerPosRef.current.x, ty - playerPosRef.current.y);
        if (dist > 6) {
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
        if (dx !== 0 && dy !== 0 && !targetPosRef.current) { dx *= 0.7071; dy *= 0.7071; }
        const nx = playerPosRef.current.x + dx;
        const ny = playerPosRef.current.y + dy;
        // Collision checked against feet footprint (x+4, y+16, size 20)
        if (!checkCollision(nx + 4, playerPosRef.current.y + 16, 20)) { playerPosRef.current.x = nx; }
        if (!checkCollision(playerPosRef.current.x + 4, ny + 16, 20)) { playerPosRef.current.y = ny; }
        animTimerRef.current++;
        if (animTimerRef.current % 6 === 0) { frameRef.current = (frameRef.current + 1) % 4; }
      } else {
        frameRef.current = 0;
      }

      // ── 2. NPC Movement (with Collision) ────────────────────────────────
      npcStates.current.forEach((ns) => {
        if (ns.npc.walkPattern === "idle") return;
        ns.walkPhase += ns.npc.speed * 0.008;
        const { walkPattern, walkRange, x: ox, y: oy } = ns.npc;
        let nextX = ns.x;
        let nextY = ns.y;
        if (walkPattern === "horizontal") {
          nextX = ox + Math.sin(ns.walkPhase) * walkRange;
          if (!checkCollision(nextX + 4, ns.y + 16, 18)) {
            ns.dir = nextX > ns.x ? "right" : "left";
            ns.x = nextX;
          }
        } else if (walkPattern === "vertical") {
          nextY = oy + Math.sin(ns.walkPhase) * walkRange;
          if (!checkCollision(ns.x + 4, nextY + 16, 18)) {
            ns.dir = nextY > ns.y ? "down" : "up";
            ns.y = nextY;
          }
        } else if (walkPattern === "circle") {
          nextX = ox + Math.cos(ns.walkPhase) * walkRange * 0.5;
          nextY = oy + Math.sin(ns.walkPhase) * walkRange * 0.4;
          if (!checkCollision(nextX + 4, nextY + 16, 18)) {
            const cos = Math.cos(ns.walkPhase);
            const sin = Math.sin(ns.walkPhase);
            if (Math.abs(cos) > Math.abs(sin)) { ns.dir = cos > 0 ? "right" : "left"; }
            else { ns.dir = sin > 0 ? "down" : "up"; }
            ns.x = nextX;
            ns.y = nextY;
          }
        }
        ns.moving = true;
        ns.animTimer++;
        if (ns.animTimer % 8 === 0) { ns.frame = (ns.frame + 1) % 4; }
      });

      // ── 3. Update React HUD (throttled) ─────────────────────────────────
      const px = playerPosRef.current.x;
      const py = playerPosRef.current.y;
      if (tick % 6 === 0) {
        setPlayerCoords({ x: px, y: py, dir: playerDirRef.current });
        const newDist = getCurrentDistrict(px, py);
        setCurrentDistrict(newDist);
        if (onDistrictChange) onDistrictChange(newDist);
        const bld = getNearbyBuilding(px, py);
        setNearbyBuilding(bld);
        if (onNearbyBuildingChange) onNearbyBuildingChange(bld);
        const egg = getNearbyEasterEgg(px, py);
        setNearbyEgg(egg);
        if (onNearbyEasterEggChange) onNearbyEasterEggChange(egg);
      }

      // ── 4. Camera ────────────────────────────────────────────────────────
      const camX = Math.max(0, Math.min(px - VW / 2, WORLD_WIDTH - VW));
      const camY = Math.max(0, Math.min(py - VH / 2, WORLD_HEIGHT - VH));

      ctx.save();
      ctx.clearRect(0, 0, VW, VH);
      ctx.translate(-Math.floor(camX), -Math.floor(camY));

      // ── 5. Ground Layers (Strict GBA Gen 3 Flat Pixel Art) ────────────────
      // Base grass
      ctx.fillStyle = activePalette.grassBase;
      ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

      // Distinct GBA grass tufts (2x2 / 3x2 stepped pixel blades)
      ctx.fillStyle = activePalette.grassTuft;
      for (let gx = 32; gx < WORLD_WIDTH; gx += 64) {
        for (let gy = 32; gy < WORLD_HEIGHT; gy += 64) {
          const shift = ((gx * 7 + gy * 13) % 28);
          const px2 = gx + shift;
          const py2 = gy + (shift % 16);
          ctx.fillRect(px2, py2, 2, 4);
          ctx.fillRect(px2 + 2, py2 - 1, 2, 5);
          ctx.fillRect(px2 + 4, py2 + 1, 2, 3);
        }
      }

      // Draw district biome zones with flat stepped borders & accents
      DISTRICT_ZONES.forEach((dz) => {
        // Flat stepped border outline
        ctx.fillStyle = activePalette.grassDark;
        ctx.fillRect(dz.x + 20, dz.y + 20, dz.width - 40, 2);
        ctx.fillRect(dz.x + 20, dz.y + dz.height - 22, dz.width - 40, 2);
        ctx.fillRect(dz.x + 20, dz.y + 20, 2, dz.height - 40);
        ctx.fillRect(dz.x + dz.width - 22, dz.y + 20, 2, dz.height - 40);

        // Biome accent scatters (pixelated)
        if (dz.id === "nature_reserve") {
          ctx.fillStyle = activePalette.grassDark;
          for (let fx = dz.x + 40; fx < dz.x + dz.width - 40; fx += 96) {
            for (let fy = dz.y + 40; fy < dz.y + dz.height - 40; fy += 96) {
              ctx.fillRect(fx, fy, 4, 4);
              ctx.fillRect(fx + 2, fy + 4, 3, 3);
            }
          }
        }

        // District name watermark (high-resolution crisp badge)
        const dcx = Math.floor(dz.x + dz.width / 2);
        const dcy = Math.floor(dz.y + 36);
        const shortName = dz.name.split("&")[0].trim().toUpperCase();
        ctx.font = "bold 12px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        const tagW = Math.ceil(ctx.measureText(shortName).width) + 24;
        const tagH = 22;
        ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
        ctx.fillRect(dcx - Math.floor(tagW / 2), dcy, tagW, tagH);
        ctx.fillStyle = dz.accentColor || "#F59E0B";
        ctx.fillRect(dcx - Math.floor(tagW / 2), dcy + tagH - 2, tagW, 2);
        ctx.fillStyle = "#FFFFFF";
        ctx.textAlign = "center";
        ctx.fillText(shortName, dcx, dcy + 15);
      });

      // ── 6. Roads & Paths (Authentic GBA Sandy Paths) ──────────────────────
      // Horizontal central avenue
      drawGBAPath(ctx, 0, 1040, WORLD_WIDTH, 100, activePalette, true);
      // Vertical central avenue  
      drawGBAPath(ctx, 1200, 0, 100, WORLD_HEIGHT, activePalette, false);
      // District connecting roads
      drawGBAPath(ctx, 0, 880, 1200, 60, activePalette, true);
      drawGBAPath(ctx, 1300, 880, WORLD_WIDTH - 1300, 60, activePalette, true);

      // Central avenue intersection
      ctx.fillStyle = activePalette.pathBase;
      ctx.fillRect(1200, 1040, 100, 100);
      ctx.fillStyle = activePalette.pathEdge;
      ctx.fillRect(1200, 1040, 100, 4);
      ctx.fillRect(1200, 1136, 100, 4);
      ctx.fillRect(1200, 1040, 4, 100);
      ctx.fillRect(1296, 1040, 4, 100);

      // ── 7. Central Grand Fountain (GBA Pixel Art) ────────────────────────
      const fx = 1250, fy = 1390;
      // Stone plaza rim (stepped octagon)
      ctx.fillStyle = activePalette.wallShadow;
      ctx.fillRect(fx - 70, fy - 50, 140, 100);
      ctx.fillRect(fx - 50, fy - 70, 100, 140);
      ctx.fillStyle = activePalette.wallBase;
      ctx.fillRect(fx - 66, fy - 46, 132, 92);
      ctx.fillRect(fx - 46, fy - 66, 92, 132);
      // Water basin
      ctx.fillStyle = activePalette.waterDeep;
      ctx.fillRect(fx - 56, fy - 38, 112, 76);
      ctx.fillRect(fx - 38, fy - 56, 76, 112);
      ctx.fillStyle = activePalette.waterBase;
      ctx.fillRect(fx - 52, fy - 34, 104, 68);
      ctx.fillRect(fx - 34, fy - 52, 68, 104);
      // Animated GBA water surface ripples
      ctx.fillStyle = activePalette.waterLight;
      const fShift = Math.floor(tick * 0.4) % 12;
      for (let ry = fy - 30; ry <= fy + 30; ry += 16) {
        for (let rx = fx - 40 + fShift; rx <= fx + 40; rx += 24) {
          ctx.fillRect(Math.floor(rx), ry, 10, 2);
        }
      }
      // Center stone fountain pedestal
      ctx.fillStyle = activePalette.wallShadow;
      ctx.fillRect(fx - 14, fy - 14, 28, 28);
      ctx.fillStyle = activePalette.wallBase;
      ctx.fillRect(fx - 10, fy - 10, 20, 20);
      ctx.fillStyle = activePalette.wallLight;
      ctx.fillRect(fx - 8, fy - 8, 16, 4);
      // Animated stepped water jet & spray
      const jetFrames = [8, 12, 16, 14, 10];
      const jHeight = jetFrames[Math.floor(tick / 6) % jetFrames.length];
      ctx.fillStyle = activePalette.waterLight;
      ctx.fillRect(fx - 3, fy - 10 - jHeight, 6, jHeight);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(fx - 2, fy - 12 - jHeight, 4, 3);
      // Droplets
      for (let di = 0; di < 4; di++) {
        const dAngle = di * (Math.PI / 2) + (tick * 0.1);
        const dDist = 8 + (tick % 16);
        const ddx = Math.floor(fx + Math.cos(dAngle) * dDist);
        const ddy = Math.floor(fy - 6 + Math.sin(dAngle) * (dDist * 0.6));
        ctx.fillStyle = activePalette.waterLight;
        ctx.fillRect(ddx, ddy, 2, 2);
      }

      // ── 8. Unified Depth-Sorted Entity Rendering Pass (Strict 2.5D GBA Sorting) ─
      type RenderEntity =
        | { kind: "building"; y: number; data: Building }
        | { kind: "npc"; y: number; data: NPCState }
        | { kind: "player"; y: number }
        | { kind: "egg"; y: number; data: EasterEgg }
        | { kind: "decor"; y: number; data: any };

      const entities: RenderEntity[] = [];

      // 1. Buildings (base is at b.y + b.height)
      BUILDINGS.forEach((b) => {
        entities.push({ kind: "building", y: b.y + b.height, data: b });
      });

      // 2. NPCs (feet are at ns.y + 28)
      npcStates.current.forEach((ns) => {
        entities.push({ kind: "npc", y: ns.y + 28, data: ns });
      });

      // 3. Player (feet are at py + 30)
      entities.push({ kind: "player", y: py + 30 });

      // 4. Easter Eggs (base is at egg.y + egg.height)
      EASTER_EGGS.forEach((egg) => {
        entities.push({ kind: "egg", y: egg.y + egg.height, data: egg });
      });

      // 5. Tall Decor (trees, statues, windmills, pillars, etc.)
      WORLD_DECOR.forEach((d) => {
        const h = d.h || (d.type.startsWith("tree") ? 50 : 32);
        entities.push({ kind: "decor", y: d.y + h, data: d });
      });

      // Sort all entities by bottom feet Y — entities higher up the screen are drawn first!
      entities.sort((a, b) => a.y - b.y);

      // Render back-to-front
      entities.forEach((ent) => {
        if (ent.kind === "building") {
          drawBuilding(ctx, ent.data, tick, activePalette, nearbyBuilding?.id === ent.data.id);
        } else if (ent.kind === "npc") {
          const ns = ent.data;
          drawNPC(ctx, ns.x, ns.y, ns.dir, ns.moving, ns.frame, ns.npc.color, ns.npc.hairColor, ns.npc.name, tick);
        } else if (ent.kind === "player") {
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
            hasSword,
            hasShield,
            hasCape,
            hasCowl,
            palette: activePalette,
            theme: activeTheme,
          });

          // Player overhead nametag
          ctx.save();
          ctx.font = "bold 11px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
          const pName = "HERO";
          const pNameW = Math.ceil(ctx.measureText(pName).width);
          const pTagW = pNameW + 16;
          const pTagH = 17;
          const pTagX = px + 16 - Math.floor(pTagW / 2);
          const pTagY = py - 16;
          ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
          ctx.fillRect(pTagX - 1, pTagY - 1, pTagW + 2, pTagH + 2);
          ctx.fillStyle = "#0F172A";
          ctx.fillRect(pTagX, pTagY, pTagW, pTagH);
          ctx.fillStyle = "#F59E0B";
          ctx.fillRect(pTagX, pTagY, pTagW, 2);
          ctx.fillStyle = "#FEF08A";
          ctx.textAlign = "center";
          ctx.fillText(pName, px + 16, pTagY + 12);
          ctx.restore();
        } else if (ent.kind === "egg") {
          drawEasterEgg(ctx, ent.data, tick);
        } else if (ent.kind === "decor") {
          drawDecor(ctx, ent.data, tick, activeTheme, activePalette);
        }
      });

      // ── 13. GPS Waypoint Beacon (Retro Pixel Art) ─────────────────────────
      if (activeWaypoint) {
        const wx = Math.floor(activeWaypoint.doorX);
        const wy = Math.floor(activeWaypoint.doorY);
        // Stepped light pillar
        for (let py2 = wy - 160; py2 < wy; py2 += 4) {
          if ((py2 + tick * 2) % 16 < 8) {
            ctx.fillStyle = "#F59E0B";
            ctx.fillRect(wx - 8, py2, 16, 3);
            ctx.fillStyle = "#FEF08A";
            ctx.fillRect(wx - 3, py2, 6, 3);
          }
        }
        // Stepped ground target
        ctx.fillStyle = "#B45309";
        ctx.fillRect(wx - 16, wy - 4, 32, 8);
        ctx.fillStyle = "#F59E0B";
        ctx.fillRect(wx - 12, wy - 2, 24, 4);
        ctx.fillStyle = "#FEF08A";
        ctx.fillRect(wx - 6, wy - 1, 12, 2);
        // Floating pixel arrow
        const bounce = Math.floor(Math.sin(tick * 0.12) * 4);
        const ay = wy - 180 + bounce;
        ctx.fillStyle = "#F59E0B";
        ctx.fillRect(wx - 6, ay, 12, 6);
        ctx.fillRect(wx - 10, ay + 6, 20, 5);
        ctx.fillRect(wx - 4, ay + 11, 8, 4);
        ctx.fillRect(wx - 1, ay + 15, 2, 4);
      }

      // ── 14. Ambient Particles (Crisp GBA Pixel Motes) ─────────────────────
      petals.forEach((p) => {
        p.x += p.speedX + Math.sin(tick * 0.02) * 0.3;
        p.y += p.speedY;
        if (p.y > WORLD_HEIGHT) { p.y = -10; p.x = Math.random() * WORLD_WIDTH; }
        const fpx = Math.floor(p.x);
        const fpy = Math.floor(p.y);
        ctx.fillStyle = "#FBCFE8";
        ctx.fillRect(fpx, fpy, 3, 2);
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(fpx + 1, fpy, 1, 1);
      });

      particles.forEach((p) => {
        p.x += p.speedX; p.y += p.speedY;
        if (p.x < 0) p.x = WORLD_WIDTH;
        if (p.x > WORLD_WIDTH) p.x = 0;
        if (p.y < 0) p.y = WORLD_HEIGHT;
        if (p.y > WORLD_HEIGHT) p.y = 0;
        ctx.fillStyle = activePalette.ambientParticle;
        ctx.fillRect(Math.floor(p.x), Math.floor(p.y), 2, 2);
      });

      // ── 15. Click-to-walk target indicator (Pixel Reticle) ────────────────
      if (targetPosRef.current) {
        const itx = Math.floor(targetPosRef.current.x);
        const ity = Math.floor(targetPosRef.current.y);
        const blink = tick % 20 < 10;
        if (blink) {
          ctx.fillStyle = "#FBBF24";
          ctx.fillRect(itx - 6, ity - 1, 12, 2);
          ctx.fillRect(itx - 1, ity - 6, 2, 12);
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(itx - 2, ity - 1, 4, 2);
          ctx.fillRect(itx - 1, ity - 2, 2, 4);
        }
      }

      // ── 16. Screen Finish (Strict GBA - NO dark modern vignette) ──────────
      ctx.restore();

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [
    activeTheme, activePalette, hasCrown, hasHood, hasSword, hasShield, hasCape, hasCowl, hasBlessing,
    activeWaypoint, nearbyBuilding,
    onDistrictChange, onNearbyBuildingChange, onNearbyEasterEggChange,
  ]);

  // ── Mobile D-Pad ──────────────────────────────────────────────────────────
  const handleMobileMoveStart = (dir: Direction) => {
    targetPosRef.current = null;
    keysPressed.current = {
      arrowup: dir === "up",
      arrowdown: dir === "down",
      arrowleft: dir === "left",
      arrowright: dir === "right",
    };
  };
  const handleMobileMoveEnd = () => { keysPressed.current = {}; };

  return (
    <div
      tabIndex={0}
      className="relative w-full flex flex-col items-center justify-center select-none overflow-hidden rounded-2xl bg-slate-950 border-2 border-slate-700 shadow-2xl focus:outline-none focus:ring-2 focus:ring-amber-400"
      style={{ touchAction: "none" }}
    >
      {/* GTA V Style Radar */}
      <div className="absolute top-4 right-4 z-30 pointer-events-auto">
        <MiniMapRadar
          playerX={playerCoords.x}
          playerY={playerCoords.y}
          playerDir={playerCoords.dir}
          districtName={currentDistrict.name}
          activeWaypoint={activeWaypoint}
          onSelectWaypoint={(bld) => setActiveWaypoint(bld)}
          onOpenFullMap={() => setIsFullMapOpen(true)}
        />
      </div>

      {/* District Badge */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700 text-xs font-title text-amber-300 shadow-lg flex items-center gap-2">
        <span
          className="w-2.5 h-2.5 rounded-full animate-pulse"
          style={{ backgroundColor: currentDistrict.accentColor }}
        />
        <span>{currentDistrict.name}</span>
      </div>

      {/* GBA Theme Palette Selector Bar (Fixed non-repeating themes) */}
      <div className="absolute top-14 left-4 z-20 flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/95 border border-slate-700 shadow-lg backdrop-blur-sm">
        {CANONICAL_THEMES.map((themeItem) => {
          const isSelected = activeTheme === themeItem.key;
          return (
            <button
              key={themeItem.key}
              onClick={(e) => {
                e.stopPropagation();
                setActiveTheme(themeItem.key);
              }}
              title={`Switch Theme: ${themeItem.name}`}
              className={`px-2 py-1 rounded-lg text-xs font-pixel flex items-center gap-1 transition-all ${
                isSelected
                  ? "bg-amber-400 text-slate-950 font-bold shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              <span>{themeItem.icon}</span>
              <span className="hidden sm:inline text-[10px]">{themeItem.name}</span>
            </button>
          );
        })}
      </div>

      {/* Nearby prompt */}
      {(nearbyBuilding || nearbyEgg) && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 pointer-events-none px-4 py-2 rounded-xl bg-amber-400/20 border border-amber-400/60 text-amber-300 text-sm font-pixel shadow-lg flex items-center gap-2 backdrop-blur-sm">
          <span className="animate-bounce">⬆</span>
          <span>Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-xs">E</kbd> / <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-xs">Space</kbd> to enter</span>
          <span className="font-bold text-amber-200">{nearbyBuilding?.name ?? nearbyEgg?.name}</span>
        </div>
      )}

      {/* World Canvas */}
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="w-full max-w-[960px] h-auto aspect-[16/10] cursor-crosshair"
        style={{ imageRendering: "pixelated" }}
      />

      {/* Controls Bar */}
      <div className="w-full p-2 bg-slate-900/95 border-t border-slate-800 text-center flex items-center justify-between text-[11px] text-slate-400 font-pixel px-4">
        <span className="hidden sm:inline">
          [WASD] / [Arrows] to walk • Click/Tap destination • [E] / [Space] interact
        </span>
        <span className="sm:hidden">Tap to walk • D-Pad below</span>
        <span className="text-amber-400 text-xs flex items-center gap-1.5">
          <span>{THEME_ICONS[activeTheme] || "🎨"}</span>
          <span>{activePalette.name}</span>
          <span className="text-slate-500">|</span>
          <span className="text-cyan-400">📍 {currentDistrict.name.split("&")[0].trim()}</span>
        </span>
      </div>

      {/* Mobile Controls */}
      <div className="sm:hidden w-full">
        <MobileControls
          onMoveStart={handleMobileMoveStart}
          onMoveEnd={handleMobileMoveEnd}
          onAction={handleInteract}
          canInteract={!!nearbyBuilding || !!nearbyEgg}
          nearbyBuildingName={nearbyBuilding?.name ?? nearbyEgg?.name}
        />
      </div>

      {/* GTA V Full World Map Modal */}
      <RealmFullMapModal
        isOpen={isFullMapOpen}
        onClose={() => setIsFullMapOpen(false)}
        playerX={playerCoords.x}
        playerY={playerCoords.y}
        playerDir={playerCoords.dir}
        activeWaypoint={activeWaypoint}
        onSelectWaypoint={(bld) => setActiveWaypoint(bld)}
        onFastTravel={handleFastTravel}
      />
    </div>
  );
}
