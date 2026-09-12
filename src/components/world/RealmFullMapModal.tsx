"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import {
  WORLD_WIDTH,
  WORLD_HEIGHT,
  BUILDINGS,
  EASTER_EGGS,
  DISTRICT_ZONES,
  Building,
  EasterEgg,
  DistrictZone,
} from "./WorldMapData";
import { Direction } from "./SpriteEngine";
import {
  X,
  MapPin,
  Compass,
  Search,
  Navigation,
  Sparkles,
  Zap,
  Crosshair,
  Layers,
} from "lucide-react";

interface RealmFullMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerX: number;
  playerY: number;
  playerDir: Direction;
  activeWaypoint: Building | null;
  onSelectWaypoint: (bld: Building | null) => void;
  onFastTravel?: (x: number, y: number) => void;
}

type FilterCategory = "all" | "quests" | "services" | "combat" | "secrets";

interface POIItem {
  id: string;
  name: string;
  category: FilterCategory;
  categoryLabel: string;
  district: string;
  icon: string;
  x: number;
  y: number;
  doorX: number;
  doorY: number;
  color: string;
  description: string;
  isBuilding: boolean;
  rawBuilding?: Building;
  rawEgg?: EasterEgg;
}

export default function RealmFullMapModal({
  isOpen,
  onClose,
  playerX,
  playerY,
  playerDir,
  activeWaypoint,
  onSelectWaypoint,
  onFastTravel,
}: RealmFullMapModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>("all");
  const [selectedPOI, setSelectedPOI] = useState<POIItem | null>(null);
  const [hoveredPOI, setHoveredPOI] = useState<POIItem | null>(null);

  // Compile all POIs into a unified list
  const allPOIs = useMemo<POIItem[]>(() => {
    const list: POIItem[] = [];

    BUILDINGS.forEach((b) => {
      let cat: FilterCategory = "services";
      let catLabel = "City Service";
      if (b.type === "guild" || b.id === "guild") {
        cat = "quests";
        catLabel = "Quest Guild";
      } else if (b.type === "dojo" || b.id === "barracks" || b.id === "colosseum") {
        cat = "combat";
        catLabel = "Combat Arena";
      } else if (b.type === "observatory" || b.type === "shrine" || b.type === "library") {
        cat = "quests";
        catLabel = "Lore & Academy";
      } else if (b.type === "shop" || b.type === "blacksmith" || b.type === "inn" || b.type === "cafe") {
        cat = "services";
        catLabel = "Shop & Service";
      }

      list.push({
        id: b.id,
        name: b.name,
        category: cat,
        categoryLabel: catLabel,
        district: b.district,
        icon: b.signIcon,
        x: b.x + b.width / 2,
        y: b.y + b.height / 2,
        doorX: b.doorX,
        doorY: b.doorY,
        color: b.blipColor || "#38BDF8",
        description: b.subtitle,
        isBuilding: true,
        rawBuilding: b,
      });
    });

    EASTER_EGGS.forEach((egg) => {
      list.push({
        id: egg.id,
        name: egg.name,
        category: "secrets",
        categoryLabel: "Secret / Easter Egg",
        district: "Overworld Landmark",
        icon: egg.icon,
        x: egg.x + egg.width / 2,
        y: egg.y + egg.height / 2,
        doorX: egg.x + egg.width / 2,
        doorY: egg.y + egg.height + 10,
        color: "#F59E0B",
        description: egg.hint,
        isBuilding: false,
        rawEgg: egg,
      });
    });

    return list;
  }, []);

  // Filtered POIs
  const filteredPOIs = useMemo(() => {
    return allPOIs.filter((poi) => {
      if (selectedCategory !== "all" && poi.category !== selectedCategory) return false;
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        return (
          poi.name.toLowerCase().includes(q) ||
          poi.district.toLowerCase().includes(q) ||
          poi.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [allPOIs, selectedCategory, searchQuery]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "m" || e.key === "M") {
        if (isOpen) {
          e.preventDefault();
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Render Full Tactical Map Canvas
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const CW = canvas.width;
    const CH = canvas.height;
    const scaleX = CW / WORLD_WIDTH;
    const scaleY = CH / WORLD_HEIGHT;

    ctx.clearRect(0, 0, CW, CH);

    // 1. Base terrain background
    ctx.fillStyle = "#0A101D";
    ctx.fillRect(0, 0, CW, CH);

    // 2. District biome zones
    DISTRICT_ZONES.forEach((dz) => {
      const zx = dz.x * scaleX;
      const zy = dz.y * scaleY;
      const zw = dz.width * scaleX;
      const zh = dz.height * scaleY;

      // Biome zone fill
      ctx.fillStyle = dz.groundColor + "40";
      ctx.fillRect(zx, zy, zw, zh);

      // Biome boundary line
      ctx.strokeStyle = dz.accentColor + "80";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(zx + 1, zy + 1, zw - 2, zh - 2);

      // District label
      ctx.fillStyle = dz.accentColor + "B0";
      ctx.font = "bold 10px monospace";
      ctx.textAlign = "left";
      ctx.fillText(dz.name.split("&")[0].trim().toUpperCase(), zx + 8, zy + 16);
    });

    // 3. Roads & Avenues
    ctx.fillStyle = "#E0D09844";
    // Horizontal central avenue
    ctx.fillRect(0, 1040 * scaleY, CW, 100 * scaleY);
    // Vertical central avenue
    ctx.fillRect(1200 * scaleX, 0, 100 * scaleX, CH);
    // Connectors
    ctx.fillRect(0, 880 * scaleY, 1200 * scaleX, 60 * scaleY);
    ctx.fillRect(1300 * scaleX, 880 * scaleY, (WORLD_WIDTH - 1300) * scaleX, 60 * scaleY);

    // 4. Rivers & Ponds
    ctx.fillStyle = "#3868A0AA";
    ctx.fillRect(60 * scaleX, 1100 * scaleY, 140 * scaleX, 80 * scaleY);

    // 5. Central Plaza Fountain
    ctx.fillStyle = "#5898D0";
    ctx.beginPath();
    ctx.arc(1250 * scaleX, 1390 * scaleY, 8, 0, Math.PI * 2);
    ctx.fill();

    // 6. Active GPS Waypoint Route Line
    if (activeWaypoint) {
      const wx = activeWaypoint.doorX * scaleX;
      const wy = activeWaypoint.doorY * scaleY;
      const px = playerX * scaleX;
      const py = playerY * scaleY;

      // Dashed Route Line
      ctx.strokeStyle = "#F59E0B";
      ctx.lineWidth = 2.5;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(wx, wy);
      ctx.stroke();
      ctx.setLineDash([]);

      // Waypoint Target Marker
      ctx.fillStyle = "rgba(245, 158, 11, 0.3)";
      ctx.beginPath();
      ctx.arc(wx, wy, 16, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "#F59E0B";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(wx, wy, 8, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 7. Render POI Pins on the Map
    filteredPOIs.forEach((poi) => {
      const mx = poi.x * scaleX;
      const my = poi.y * scaleY;
      const isSelected = selectedPOI?.id === poi.id || activeWaypoint?.id === poi.id;
      const isHovered = hoveredPOI?.id === poi.id;

      // Pin Aura
      if (isSelected || isHovered) {
        ctx.fillStyle = isSelected ? "rgba(245, 158, 11, 0.4)" : "rgba(56, 189, 248, 0.4)";
        ctx.beginPath();
        ctx.arc(mx, my, 14, 0, Math.PI * 2);
        ctx.fill();
      }

      // Pin Disc
      ctx.fillStyle = isSelected ? "#F59E0B" : poi.color;
      ctx.beginPath();
      ctx.arc(mx, my, isSelected || isHovered ? 7 : 5, 0, Math.PI * 2);
      ctx.fill();

      // Pin Border
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(mx, my, isSelected || isHovered ? 7 : 5, 0, Math.PI * 2);
      ctx.stroke();

      // Small Label
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "8px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(poi.icon, mx, my - 9);
    });

    // 8. Player Location Marker (Pulsing Cyan Arrow)
    const px = playerX * scaleX;
    const py = playerY * scaleY;

    // Player pulse ring
    ctx.strokeStyle = "#38BDF8";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(px, py, 11, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "rgba(56, 189, 248, 0.25)";
    ctx.beginPath();
    ctx.arc(px, py, 11, 0, Math.PI * 2);
    ctx.fill();

    // Player Directional Arrow
    ctx.save();
    ctx.translate(px, py);
    let angle = 0;
    if (playerDir === "up") angle = -Math.PI / 2;
    else if (playerDir === "down") angle = Math.PI / 2;
    else if (playerDir === "left") angle = Math.PI;
    else if (playerDir === "right") angle = 0;
    ctx.rotate(angle);

    ctx.fillStyle = "#38BDF8";
    ctx.beginPath();
    ctx.moveTo(8, 0);
    ctx.lineTo(-6, -5);
    ctx.lineTo(-3, 0);
    ctx.lineTo(-6, 5);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();

    // "YOU" Label
    ctx.fillStyle = "#38BDF8";
    ctx.font = "bold 8px monospace";
    ctx.textAlign = "center";
    ctx.fillText("YOU", px, py + 18);
  }, [
    isOpen,
    playerX,
    playerY,
    playerDir,
    activeWaypoint,
    filteredPOIs,
    selectedPOI,
    hoveredPOI,
  ]);

  // Click on Canvas to Select POI or Set Waypoint
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    const CW = canvas.width;
    const CH = canvas.height;
    const worldScaleX = CW / WORLD_WIDTH;
    const worldScaleY = CH / WORLD_HEIGHT;

    // Find closest POI within 24 pixels
    let closest: POIItem | null = null;
    let minDist = 24;

    filteredPOIs.forEach((poi) => {
      const mx = poi.x * worldScaleX;
      const my = poi.y * worldScaleY;
      const dist = Math.hypot(clickX - mx, clickY - my);
      if (dist < minDist) {
        minDist = dist;
        closest = poi;
      }
    });

    if (closest) {
      setSelectedPOI(closest);
      if ((closest as POIItem).rawBuilding) {
        onSelectWaypoint((closest as POIItem).rawBuilding || null);
      }
    }
  };

  // Hover on Canvas
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    const CW = canvas.width;
    const CH = canvas.height;
    const worldScaleX = CW / WORLD_WIDTH;
    const worldScaleY = CH / WORLD_HEIGHT;

    let closest: POIItem | null = null;
    let minDist = 20;

    filteredPOIs.forEach((poi) => {
      const mx = poi.x * worldScaleX;
      const my = poi.y * worldScaleY;
      const dist = Math.hypot(mouseX - mx, mouseY - my);
      if (dist < minDist) {
        minDist = dist;
        closest = poi;
      }
    });

    setHoveredPOI(closest);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="max-w-6xl w-full h-[92vh] flex flex-col rounded-2xl bg-slate-950 border-2 border-slate-700 shadow-2xl overflow-hidden relative">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold font-title text-amber-300 flex items-center gap-2">
                <span>REALM OF VALORIA — WORLD MAP</span>
                <span className="text-[10px] font-pixel px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  GTA V POI RADAR
                </span>
              </h2>
              <p className="text-[11px] text-slate-400 font-body">
                Click any Landmark or POI on the map to set an active GPS Waypoint. Press <kbd className="px-1 py-0.2 bg-slate-800 rounded text-slate-300">ESC</kbd> or <kbd className="px-1 py-0.2 bg-slate-800 rounded text-slate-300">M</kbd> to return.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {activeWaypoint && (
              <button
                onClick={() => onSelectWaypoint(null)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-pixel transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear GPS Route</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close Map"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content Area: Map Canvas + Interactive POI Drawer */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
          
          {/* Map Canvas Section */}
          <div className="flex-1 flex items-center justify-center p-3 sm:p-5 bg-slate-950 relative overflow-hidden">
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              onClick={handleCanvasClick}
              onMouseMove={handleCanvasMouseMove}
              onMouseLeave={() => setHoveredPOI(null)}
              className="w-full max-w-[800px] h-auto aspect-[4/3] rounded-xl border-2 border-slate-800 cursor-crosshair shadow-2xl"
              style={{ imageRendering: "pixelated" }}
            />

            {/* Hover Tooltip Overlay */}
            {hoveredPOI && (
              <div
                className="absolute top-6 left-6 pointer-events-none p-3 rounded-xl bg-slate-900/95 border border-amber-500/60 shadow-xl backdrop-blur-md max-w-xs space-y-1 animate-in fade-in duration-100"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{hoveredPOI.icon}</span>
                  <div>
                    <h4 className="text-xs font-bold text-amber-300 font-title">{hoveredPOI.name}</h4>
                    <p className="text-[10px] text-slate-400">{hoveredPOI.district}</p>
                  </div>
                </div>
                <p className="text-[11px] text-slate-300">{hoveredPOI.description}</p>
                <p className="text-[10px] text-cyan-400 font-pixel">
                  📍 Click to set GPS Waypoint ({Math.round(Math.hypot(playerX - hoveredPOI.doorX, playerY - hoveredPOI.doorY) / 10)}m)
                </p>
              </div>
            )}

            {/* In-Map Active GPS Badge */}
            {activeWaypoint && (
              <div className="absolute bottom-5 left-5 p-2.5 rounded-xl bg-slate-900/90 border border-amber-400/80 text-xs text-amber-300 font-pixel shadow-xl flex items-center gap-2 backdrop-blur-sm">
                <Navigation className="w-4 h-4 text-amber-400 animate-spin" />
                <span>
                  Route Active: <strong className="text-white">{activeWaypoint.name}</strong> (
                  {Math.round(Math.hypot(playerX - activeWaypoint.doorX, playerY - activeWaypoint.doorY) / 10)}m)
                </span>
                <button
                  onClick={() => onSelectWaypoint(null)}
                  className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 ml-1"
                >
                  Clear
                </button>
              </div>
            )}
          </div>

          {/* Right Side: POI Directory & Controls */}
          <div className="w-full md:w-80 bg-slate-900/95 border-t md:border-t-0 md:border-l border-slate-800 flex flex-col shrink-0 h-64 md:h-auto overflow-hidden">
            
            {/* Search & Category Tabs */}
            <div className="p-3 border-b border-slate-800 space-y-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search landmarks & POIs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Categories */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10px] font-pixel">
                {[
                  { id: "all", label: "All" },
                  { id: "quests", label: "Quests" },
                  { id: "services", label: "Services" },
                  { id: "combat", label: "Combat" },
                  { id: "secrets", label: "Secrets" },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id as FilterCategory)}
                    className={`px-2 py-1 rounded-md transition-colors shrink-0 ${
                      selectedCategory === c.id
                        ? "bg-amber-500 text-slate-950 font-bold"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* POI List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1.5 divide-y divide-slate-800/50">
              {filteredPOIs.map((poi) => {
                const isSelected = activeWaypoint?.id === poi.id || selectedPOI?.id === poi.id;
                const dist = Math.round(Math.hypot(playerX - poi.doorX, playerY - poi.doorY) / 10);

                return (
                  <div
                    key={poi.id}
                    onClick={() => {
                      setSelectedPOI(poi);
                      if (poi.rawBuilding) {
                        onSelectWaypoint(activeWaypoint?.id === poi.id ? null : poi.rawBuilding);
                      }
                    }}
                    onMouseEnter={() => setHoveredPOI(poi)}
                    onMouseLeave={() => setHoveredPOI(null)}
                    className={`p-2.5 rounded-xl cursor-pointer transition-all flex items-start justify-between gap-2.5 ${
                      isSelected
                        ? "bg-amber-500/15 border border-amber-500/80 shadow-md"
                        : "hover:bg-slate-800/70 border border-transparent"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="text-xl shrink-0 mt-0.5">{poi.icon}</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-slate-100 font-title">{poi.name}</h4>
                          {isSelected && (
                            <span className="text-[9px] font-pixel text-amber-400">WAYPOINT</span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400">{poi.district} • {poi.categoryLabel}</p>
                        <p className="text-[11px] text-slate-300 mt-1 leading-tight">{poi.description}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-[10px] font-pixel text-cyan-400">{dist}m</span>
                      {onFastTravel && poi.isBuilding && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onFastTravel(poi.doorX, poi.doorY);
                            onClose();
                          }}
                          className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 text-[9px] font-pixel flex items-center gap-0.5"
                          title="Teleport to entrance"
                        >
                          <Zap className="w-2.5 h-2.5" />
                          <span>Warp</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Controls / Legend */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 text-[10px] font-pixel text-slate-400 flex items-center justify-between">
              <span>{filteredPOIs.length} POIs Found</span>
              <span className="text-amber-400">Click to Route GPS</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
