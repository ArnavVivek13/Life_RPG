/**
 * Life RPG — GBA Gen III Pixel Art Sprite & Environmental Rendering Engine
 * Strictly NO gradients, NO shadowBlur, NO smooth arcs — flat stepped tile colors only.
 * All coordinates are integer-snapped with Math.floor() for crisp pixel rendering.
 */

export type Direction = "down" | "up" | "left" | "right";

export interface ThemePalette {
  name: string;
  grassBase: string; grassDark: string; grassTuft: string;
  pathBase: string; pathDark: string; pathEdge: string;
  waterBase: string; waterLight: string; waterDeep: string;
  treeOutline: string; treeMid: string; treeLight: string; treeTrunk: string;
  roofCenter: string; roofCenterLight: string; roofCenterShadow: string;
  roofHouse: string; roofHouseLight: string; roofHouseShadow: string;
  roofMart: string;
  wallBase: string; wallLight: string; wallShadow: string;
  windowLight: string;
  flowerRed: string; flowerYellow: string;
  fencePost: string; fenceRail: string;
  roadBase: string; roadLine: string;
  playerTunic: string; playerPants: string;
  ambientParticle: string; nearbyGlow: string;
}

export const PALETTES: Record<string, ThemePalette> = {
  classic_firered: {
    name: "Kanto Day",
    grassBase: "#78C860", grassDark: "#509840", grassTuft: "#387830",
    pathBase: "#E0D098", pathDark: "#C8B878", pathEdge: "#986848",
    waterBase: "#5898D0", waterLight: "#78B8E8", waterDeep: "#3868A0",
    treeOutline: "#285830", treeMid: "#387840", treeLight: "#80C860", treeTrunk: "#885838",
    roofCenter: "#E84848", roofCenterLight: "#F87878", roofCenterShadow: "#A82828",
    roofHouse: "#D87038", roofHouseLight: "#F09858", roofHouseShadow: "#984018",
    roofMart: "#3888D8",
    wallBase: "#F8F0D8", wallLight: "#FFFFFF", wallShadow: "#C8B898",
    windowLight: "#98D0F8",
    flowerRed: "#E83030", flowerYellow: "#F8C820",
    fencePost: "#D89858", fenceRail: "#F0B878",
    roadBase: "#C8B880", roadLine: "#E8D898",
    playerTunic: "#3060D0", playerPants: "#283860",
    ambientParticle: "#A8E888", nearbyGlow: "#F8C820",
  },
  emerald_night: {
    name: "Emerald Night",
    grassBase: "#284850", grassDark: "#183038", grassTuft: "#102028",
    pathBase: "#403830", pathDark: "#302820", pathEdge: "#483828",
    waterBase: "#183048", waterLight: "#284868", waterDeep: "#101828",
    treeOutline: "#102018", treeMid: "#183028", treeLight: "#204030", treeTrunk: "#402818",
    roofCenter: "#983030", roofCenterLight: "#C84040", roofCenterShadow: "#601820",
    roofHouse: "#704830", roofHouseLight: "#906050", roofHouseShadow: "#402818",
    roofMart: "#204868",
    wallBase: "#2A3040", wallLight: "#384060", wallShadow: "#181820",
    windowLight: "#FFD060",
    flowerRed: "#880820", flowerYellow: "#C08010",
    fencePost: "#503828", fenceRail: "#604838",
    roadBase: "#302820", roadLine: "#483828",
    playerTunic: "#183870", playerPants: "#101828",
    ambientParticle: "#304858", nearbyGlow: "#FFD060",
  },
  johto_autumn: {
    name: "Johto Autumn",
    grassBase: "#C88848", grassDark: "#A86830", grassTuft: "#885020",
    pathBase: "#E0C890", pathDark: "#C8A868", pathEdge: "#A07840",
    waterBase: "#5888B8", waterLight: "#70A0D0", waterDeep: "#386890",
    treeOutline: "#602818", treeMid: "#A83018", treeLight: "#D05828", treeTrunk: "#703820",
    roofCenter: "#C04030", roofCenterLight: "#E06848", roofCenterShadow: "#801820",
    roofHouse: "#986028", roofHouseLight: "#C08040", roofHouseShadow: "#603018",
    roofMart: "#487898",
    wallBase: "#F0E0B8", wallLight: "#FFF0D0", wallShadow: "#D0B888",
    windowLight: "#F8D890",
    flowerRed: "#C83018", flowerYellow: "#E8A028",
    fencePost: "#C08048", fenceRail: "#D8A060",
    roadBase: "#D8B870", roadLine: "#EAD098",
    playerTunic: "#904820", playerPants: "#502818",
    ambientParticle: "#E89858", nearbyGlow: "#F8C030",
  },
  lavender_ghost: {
    name: "Lavender Town",
    grassBase: "#8878A8", grassDark: "#685890", grassTuft: "#504070",
    pathBase: "#C8B8D8", pathDark: "#A898B8", pathEdge: "#887898",
    waterBase: "#587898", waterLight: "#78A0B8", waterDeep: "#385870",
    treeOutline: "#302840", treeMid: "#504068", treeLight: "#706888", treeTrunk: "#504038",
    roofCenter: "#806888", roofCenterLight: "#A888A8", roofCenterShadow: "#504058",
    roofHouse: "#687088", roofHouseLight: "#8898A8", roofHouseShadow: "#405068",
    roofMart: "#587098",
    wallBase: "#D8C8E8", wallLight: "#F0E0F8", wallShadow: "#B0A0C0",
    windowLight: "#C8F0F8",
    flowerRed: "#B85898", flowerYellow: "#D0C8F0",
    fencePost: "#988898", fenceRail: "#B0A0B8",
    roadBase: "#A898B8", roadLine: "#C0B0D0",
    playerTunic: "#806898", playerPants: "#403858",
    ambientParticle: "#C0A8D8", nearbyGlow: "#E0C8F8",
  },
  cyberpunk_gba: {
    name: "Neon Byte",
    grassBase: "#1A1C2E", grassDark: "#12141E", grassTuft: "#0A0C14",
    pathBase: "#2A2C3E", pathDark: "#1A1C2E", pathEdge: "#3A3C50",
    waterBase: "#001828", waterLight: "#003040", waterDeep: "#000810",
    treeOutline: "#003820", treeMid: "#005030", treeLight: "#00FFA3", treeTrunk: "#402020",
    roofCenter: "#FF007F", roofCenterLight: "#FF60AF", roofCenterShadow: "#A00050",
    roofHouse: "#C000A0", roofHouseLight: "#E030C0", roofHouseShadow: "#800070",
    roofMart: "#0060FF",
    wallBase: "#0E1020", wallLight: "#181A30", wallShadow: "#080810",
    windowLight: "#00FFF8",
    flowerRed: "#FF0050", flowerYellow: "#FFD800",
    fencePost: "#303050", fenceRail: "#404060",
    roadBase: "#1A1C2E", roadLine: "#00FFA3",
    playerTunic: "#0080FF", playerPants: "#001040",
    ambientParticle: "#00FFA3", nearbyGlow: "#FF007F",
  },
};

/** Get canonical palette safely without polluting PALETTES keys */
export function getPalette(themeKey?: string): ThemePalette {
  if (!themeKey) return PALETTES.classic_firered;
  if (PALETTES[themeKey]) return PALETTES[themeKey];
  if (themeKey === "cyberpunk" || themeKey === "theme-cyberpunk") return PALETTES.cyberpunk_gba;
  if (themeKey === "emerald" || themeKey === "night" || themeKey === "theme-emerald") return PALETTES.emerald_night;
  if (themeKey === "autumn" || themeKey === "johto" || themeKey === "theme-autumn") return PALETTES.johto_autumn;
  if (themeKey === "lavender" || themeKey === "ghost" || themeKey === "theme-lavender") return PALETTES.lavender_ghost;
  return PALETTES.classic_firered;
}

const fp = (n: number) => Math.floor(n);

// ─── GBA TREE ───────────────────────────────────────────────────────────────
export function drawGBATree(ctx: CanvasRenderingContext2D, x: number, y: number, pal: ThemePalette, variant = 0) {
  const bx = fp(x), by = fp(y);
  ctx.fillStyle = pal.grassDark;
  ctx.fillRect(bx+4,by+42,24,6); ctx.fillRect(bx+2,by+43,28,4);
  ctx.fillStyle = pal.treeTrunk;
  ctx.fillRect(bx+13,by+30,6,14); ctx.fillRect(bx+12,by+38,8,6);
  // Canopy — 3 tiers: outline → mid → highlight
  ctx.fillStyle = pal.treeOutline;
  ctx.fillRect(bx+2,by+20,28,14); ctx.fillRect(bx,by+22,32,10); ctx.fillRect(bx+4,by+16,24,6);
  ctx.fillStyle = pal.treeMid;
  ctx.fillRect(bx+4,by+21,24,12); ctx.fillRect(bx+2,by+23,28,8); ctx.fillRect(bx+6,by+17,20,5);
  ctx.fillStyle = pal.treeOutline;
  ctx.fillRect(bx+6,by+10,20,14); ctx.fillRect(bx+4,by+12,24,10);
  ctx.fillStyle = pal.treeMid;
  ctx.fillRect(bx+8,by+11,16,12); ctx.fillRect(bx+6,by+13,20,8);
  ctx.fillStyle = pal.treeLight;
  ctx.fillRect(bx+10,by+4,12,10); ctx.fillRect(bx+8,by+6,16,8); ctx.fillRect(bx+12,by+2,8,4);
  ctx.fillStyle = pal.treeOutline;
  ctx.fillRect(bx+10,by+3,12,2); ctx.fillRect(bx+8,by+5,2,2); ctx.fillRect(bx+22,by+5,2,2);
}

export function drawGBAPine(ctx: CanvasRenderingContext2D, x: number, y: number, pal: ThemePalette) {
  const bx = fp(x), by = fp(y);
  ctx.fillStyle = pal.grassDark; ctx.fillRect(bx+6,by+46,12,4);
  ctx.fillStyle = pal.treeTrunk; ctx.fillRect(bx+10,by+36,4,12);
  const tiers = [{ty:by,w:8,base:12},{ty:by+10,w:14,base:9},{ty:by+20,w:20,base:8}];
  for (const t of tiers) {
    ctx.fillStyle = pal.treeOutline; ctx.fillRect(bx+12-t.w/2-2,t.ty+t.base-2,t.w+4,2);
    ctx.fillStyle = pal.treeMid;
    for (let r=0;r<t.base;r++){const rw=Math.round((r/t.base)*t.w);ctx.fillRect(bx+12-rw/2,t.ty+r,rw,1);}
    ctx.fillStyle = pal.treeLight;
    for (let r=0;r<t.base-2;r++){const rw=Math.round((r/t.base)*t.w);ctx.fillRect(bx+12-rw/2,t.ty+r,2,1);}
  }
}

// ─── GBA WATER ──────────────────────────────────────────────────────────────
export function drawGBAWater(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, pal: ThemePalette, tick: number) {
  const bx=fp(x),by=fp(y),bw=fp(w),bh=fp(h);
  ctx.fillStyle=pal.waterDeep; ctx.fillRect(bx,by,bw,bh);
  ctx.fillStyle=pal.waterBase; ctx.fillRect(bx+2,by+2,bw-4,bh-4);
  ctx.fillStyle=pal.waterLight;
  const shift=Math.floor(tick*0.4)%8;
  for (let ry=by+4;ry<by+bh-4;ry+=16) {
    for (let rx=bx+4+(Math.floor((ry-by)/16)%2)*8+shift;rx<bx+bw-4;rx+=16) ctx.fillRect(fp(rx),fp(ry),8,2);
  }
  ctx.fillStyle=pal.waterLight; ctx.fillRect(bx+2,by+2,bw-4,2);
}

function drawGBAWaterLily(ctx: CanvasRenderingContext2D, x: number, y: number, pal: ThemePalette) {
  const bx=fp(x),by=fp(y);
  ctx.fillStyle=pal.treeOutline; ctx.fillRect(bx+2,by+6,12,8); ctx.fillRect(bx+4,by+4,8,12);
  ctx.fillStyle=pal.treeMid; ctx.fillRect(bx+4,by+6,8,8);
  ctx.fillStyle=pal.waterBase; ctx.fillRect(bx+7,by+4,2,4);
  ctx.fillStyle=pal.flowerRed; ctx.fillRect(bx+6,by+7,4,4);
  ctx.fillStyle="#FFFFFF"; ctx.fillRect(bx+7,by+8,2,2);
}

// ─── GBA PATH ───────────────────────────────────────────────────────────────
export function drawGBAPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, pal: ThemePalette, horizontal=true) {
  const bx=fp(x),by=fp(y),bw=fp(w),bh=fp(h);
  ctx.fillStyle=pal.pathBase; ctx.fillRect(bx,by,bw,bh);
  ctx.fillStyle=pal.pathEdge;
  if(horizontal){ctx.fillRect(bx,by,bw,4);ctx.fillRect(bx,by+bh-4,bw,4);}
  else{ctx.fillRect(bx,by,4,bh);ctx.fillRect(bx+bw-4,by,4,bh);}
  ctx.fillStyle=pal.pathDark;
  if(horizontal){ctx.fillRect(bx,by+4,bw,2);ctx.fillRect(bx,by+bh-6,bw,2);}
  else{ctx.fillRect(bx+4,by,2,bh);ctx.fillRect(bx+bw-6,by,2,bh);}
  ctx.fillStyle=pal.roadLine;
  if(horizontal){for(let rx=bx+8;rx<bx+bw;rx+=32)ctx.fillRect(fp(rx),by+Math.floor(bh/2)-1,20,2);}
  else{for(let ry=by+8;ry<by+bh;ry+=32)ctx.fillRect(bx+Math.floor(bw/2)-1,fp(ry),2,20);}
}

// ─── GBA BUILDING ────────────────────────────────────────────────────────────
// ─── MEDIEVAL KINGDOM BUILDING ENGINE ──────────────────────────────────────────
export function drawGBABuilding(
  ctx: CanvasRenderingContext2D,
  b: any,
  tick: number,
  pal: ThemePalette,
  isNearby: boolean
) {
  const bx = fp(b.x), by = fp(b.y), bw = fp(b.width), bh = fp(b.height);
  const doorX = fp(b.doorX), doorY = fp(b.doorY), floors = b.floors ?? 1;
  const bType = b.type || "house";

  // Use building's custom theme colors or fall back to palette
  const roofCol = b.roofColor || pal.roofHouse;
  const roofLight = b.trimColor || pal.roofHouseLight;
  const roofShadow = "#1E1208";

  // 1. Building Cast Shadow on Ground
  ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
  ctx.fillRect(bx + 4, by + bh - 6, bw + 12, 14);

  // 2. Main Building Wall Structure (Authentic Medieval Stone / Half-Timber)
  const isFortress = bType === "dojo" || bType === "barracks";
  const isGuild = bType === "guild";
  const isSmithy = bType === "blacksmith";
  const isArcane = bType === "observatory" || bType === "shrine";
  const isTavern = bType === "cafe" || bType === "inn";
  const isShop = bType === "shop";

  // Wall Base: Stone Plinth (Lower 25%) + Half-Timbered Stucco Upper
  const plinthH = Math.min(32, Math.floor(bh * 0.3));

  // Medieval Stone Foundation / Full Stone Body
  ctx.fillStyle = isFortress ? "#3E3835" : isGuild ? "#4A4642" : isSmithy ? "#2D2926" : "#3F3B36";
  ctx.fillRect(bx, by, bw, bh);

  // Upper Wall (Stucco / Plaster with Medieval Timber Framing for houses/taverns/shops)
  if (!isFortress && !isArcane) {
    ctx.fillStyle = isSmithy ? "#4A3E35" : "#E8DFC8"; // Medieval aged plaster
    ctx.fillRect(bx + 3, by + 3, bw - 6, bh - plinthH - 3);

    // Dark Oak Timber Framing (Half-Timbered Tudor style)
    ctx.fillStyle = "#2D1B0E"; // Dark aged oak timber
    // Corner posts
    ctx.fillRect(bx + 2, by + 2, 6, bh - plinthH - 2);
    ctx.fillRect(bx + bw - 8, by + 2, 6, bh - plinthH - 2);
    // Horizontal cross-beams
    ctx.fillRect(bx + 2, by + 2, bw - 4, 5);
    const midBeamY = by + Math.floor((bh - plinthH) / 2);
    ctx.fillRect(bx + 2, midBeamY, bw - 4, 5);
    ctx.fillRect(bx + 2, by + bh - plinthH, bw - 4, 6);

    // Diagonal bracing beams
    const segW = Math.floor((bw - 12) / 3);
    for (let s = 0; s < 3; s++) {
      const sx = bx + 6 + s * segW;
      ctx.fillRect(sx + Math.floor(segW / 2) - 2, by + 4, 4, bh - plinthH - 4);
    }
  } else if (isArcane) {
    // Arcane Mystical Stone (Porphyry & Indigo Granite)
    ctx.fillStyle = "#1E1838";
    ctx.fillRect(bx + 3, by + 3, bw - 6, bh - 6);
    // Glowing Arcane Runes etched on stone
    const runeGlow = tick % 90 < 45 ? "#A855F7" : "#7C3AED";
    ctx.fillStyle = runeGlow;
    for (let r = 0; r < 4; r++) {
      const ry = by + 20 + r * 34;
      ctx.fillRect(bx + 8, ry, 6, 2);
      ctx.fillRect(bx + 10, ry - 3, 2, 8);
      ctx.fillRect(bx + bw - 14, ry, 6, 2);
      ctx.fillRect(bx + bw - 12, ry - 3, 2, 8);
    }
  } else {
    // Fortress Stone Ashlar Blocks
    ctx.fillStyle = "#57534E";
    ctx.fillRect(bx + 3, by + 3, bw - 6, bh - 6);
    // Stone block mortar lines
    ctx.fillStyle = "#292524";
    for (let row = 16; row < bh - 6; row += 16) {
      ctx.fillRect(bx + 3, by + row, bw - 6, 2);
      const shift = (row / 16) % 2 === 0 ? 0 : 16;
      for (let col = shift; col < bw - 6; col += 32) {
        ctx.fillRect(bx + 3 + col, by + row - 14, 2, 14);
      }
    }
  }

  // Stone foundation texture on lower plinth
  ctx.fillStyle = "#262320";
  ctx.fillRect(bx + 2, by + bh - plinthH, bw - 4, 3);
  for (let s = 12; s < bw - 6; s += 24) {
    ctx.fillRect(bx + s, by + bh - plinthH, 2, plinthH);
  }

  // 3. Symmetrical Medieval Roof Architecture
  const roofH = Math.max(38, Math.floor(bw * 0.26) + (floors - 1) * 10);
  const eaves = 10;
  const peakX = fp(bx + bw / 2);
  const peakY = fp(by - roofH);
  const baseLeftX = fp(bx - eaves);
  const baseRightX = fp(bx + bw + eaves);
  const baseY = fp(by + 6);

  if (isFortress) {
    // ── CASTELLATED BATTLEMENTS (Crenels & Merlons) ──
    const battlementH = 22;
    const merlonW = 16;
    const crenelW = 12;
    ctx.fillStyle = "#292524";
    ctx.fillRect(bx - 4, by - battlementH, bw + 8, battlementH + 6);
    ctx.fillStyle = "#44403C";
    ctx.fillRect(bx - 2, by - battlementH + 2, bw + 4, battlementH + 2);

    // Cut out crenel gaps
    for (let mx = bx; mx < bx + bw; mx += merlonW + crenelW) {
      ctx.fillStyle = pal.grassDark;
      ctx.fillRect(mx + merlonW, by - battlementH, crenelW, 14);
    }
    // Stone corbel supports under battlements
    ctx.fillStyle = "#292524";
    for (let cx = bx; cx < bx + bw; cx += 20) {
      ctx.fillRect(cx, by + 4, 8, 8);
    }
  } else if (isArcane) {
    // ── MYSTICAL WIZARD'S CONICAL SPIRE ROOF ──
    const spirePeakY = peakY - 18;
    ctx.fillStyle = "#0F0B1E";
    ctx.beginPath();
    ctx.moveTo(peakX, spirePeakY);
    ctx.lineTo(baseRightX, baseY);
    ctx.lineTo(baseLeftX, baseY);
    ctx.closePath();
    ctx.fill();

    // Left lit side / right shadowed side
    ctx.fillStyle = roofCol;
    ctx.beginPath();
    ctx.moveTo(peakX, spirePeakY);
    ctx.lineTo(peakX, baseY);
    ctx.lineTo(baseLeftX, baseY);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#1E1238";
    ctx.beginPath();
    ctx.moveTo(peakX, spirePeakY);
    ctx.lineTo(baseRightX, baseY);
    ctx.lineTo(peakX, baseY);
    ctx.closePath();
    ctx.fill();

    // Celestial Golden Spire Finial (Crescent Moon)
    ctx.fillStyle = "#F59E0B";
    ctx.fillRect(peakX - 1, spirePeakY - 14, 3, 14);
    ctx.beginPath();
    ctx.arc(peakX, spirePeakY - 16, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#0F0B1E";
    ctx.beginPath();
    ctx.arc(peakX + 2, spirePeakY - 17, 4, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // ── SYMMETRICAL MEDIEVAL GABLED SLATE / TILE ROOF ──
    // 1. Dark under-eaves shadow
    ctx.fillStyle = roofShadow;
    ctx.fillRect(baseLeftX - 2, baseY - 2, baseRightX - baseLeftX + 4, 6);

    // 2. Symmetrical Roof Body Polygon
    ctx.fillStyle = roofShadow;
    ctx.beginPath();
    ctx.moveTo(peakX, peakY);
    ctx.lineTo(baseRightX, baseY);
    ctx.lineTo(baseLeftX, baseY);
    ctx.closePath();
    ctx.fill();

    // 3. Lit Side (Left Slope)
    ctx.fillStyle = roofLight;
    ctx.beginPath();
    ctx.moveTo(peakX, peakY);
    ctx.lineTo(peakX, baseY);
    ctx.lineTo(baseLeftX, baseY);
    ctx.closePath();
    ctx.fill();

    // 4. Shadowed Side (Right Slope)
    ctx.fillStyle = roofCol;
    ctx.beginPath();
    ctx.moveTo(peakX, peakY);
    ctx.lineTo(baseRightX, baseY);
    ctx.lineTo(peakX, baseY);
    ctx.closePath();
    ctx.fill();

    // 5. Horizontal Overlapping Shingle / Slate Tile Rows
    const tileRows = 6 + (floors - 1) * 2;
    for (let tr = 1; tr <= tileRows; tr++) {
      const progress = tr / (tileRows + 1);
      const ty = fp(peakY + (baseY - peakY) * progress);
      const leftX = fp(peakX - (peakX - baseLeftX) * progress);
      const rightX = fp(peakX + (baseRightX - peakX) * progress);

      // Tile shadow line
      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      ctx.fillRect(leftX, ty, rightX - leftX, 2);

      // Tile vertical separation notches
      ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
      ctx.fillRect(leftX, ty - 2, rightX - leftX, 1);
    }

    // 6. Roof Ridge Cap (Apex Tiles)
    ctx.fillStyle = "#2D1B0E";
    ctx.fillRect(peakX - 6, peakY - 3, 12, 6);
    ctx.fillStyle = roofLight;
    ctx.fillRect(peakX - 4, peakY - 4, 8, 3);

    // 7. Wooden Fascia Board along the Eaves
    ctx.fillStyle = "#2D1B0E";
    ctx.fillRect(baseLeftX, baseY - 2, baseRightX - baseLeftX, 4);
    ctx.fillStyle = "#1E1208";
    ctx.fillRect(baseLeftX, baseY + 2, baseRightX - baseLeftX, 2);
  }

  // 4. Medieval Chimneys & Smoke
  if (isSmithy) {
    // ── GIANT STONE FORGE CHIMNEY WITH ROARING FIRE & EMBERS ──
    const chX = bx + bw - 38;
    const chY = by - roofH - 12;
    const chW = 28;
    const chH = roofH + 24;

    // Chimney Stone Base
    ctx.fillStyle = "#1C1917";
    ctx.fillRect(chX, chY, chW, chH);
    ctx.fillStyle = "#44403C";
    ctx.fillRect(chX + 2, chY + 2, chW - 4, chH - 4);
    // Chimney Rim
    ctx.fillStyle = "#1C1917";
    ctx.fillRect(chX - 3, chY, chW + 6, 6);

    // Glowing Orange Forge Fire Inside Top
    ctx.fillStyle = "#EA580C";
    ctx.fillRect(chX + 4, chY + 2, chW - 8, 4);
    ctx.fillStyle = "#FDE047";
    ctx.fillRect(chX + 8, chY + 1, chW - 16, 2);

    // Animated Rising Smoke & Spark Embers
    for (let i = 0; i < 4; i++) {
      const st = Math.floor((tick * 0.8 + i * 16) % 36);
      const sway = Math.sin(tick * 0.1 + i) * 6;
      ctx.fillStyle = "rgba(75, 85, 99, " + (1 - st / 36) + ")";
      ctx.beginPath();
      ctx.arc(chX + chW / 2 + sway, chY - st, 4 + st * 0.2, 0, Math.PI * 2);
      ctx.fill();

      // Sparks
      if (i % 2 === 0) {
        ctx.fillStyle = "#F59E0B";
        ctx.fillRect(chX + chW / 2 + sway * 1.5, chY - st * 1.2, 2, 2);
      }
    }
  } else if (!isFortress && !isArcane) {
    // Standard Cottage / Tavern Stone Chimney
    const chX = bx + Math.floor(bw * 0.72);
    const chY = peakY + 8;
    ctx.fillStyle = "#292524";
    ctx.fillRect(chX, chY, 12, by - chY + 4);
    ctx.fillStyle = "#57534E";
    ctx.fillRect(chX + 2, chY + 2, 8, by - chY);
    ctx.fillStyle = "#292524";
    ctx.fillRect(chX - 2, chY, 16, 4);

    // Light cozy puffs
    for (let i = 0; i < 2; i++) {
      const st = Math.floor((tick * 0.4 + i * 18) % 28);
      ctx.fillStyle = "rgba(120, 113, 108, " + (0.7 - st / 28) + ")";
      ctx.beginPath();
      ctx.arc(chX + 6 + Math.sin(tick * 0.08 + i) * 4, chY - st, 3 + st * 0.15, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 5. Special Medieval Architectural Features Per Building Type
  if (isSmithy) {
    // ── ANVIL & FLAME SMITHY OUTDOOR FORGE DETAILS ──
    // Heavy Outdoor Blacksmith Anvil on Tree Stump
    const anvilStumpX = bx + 22;
    const anvilStumpY = by + bh - 26;
    // Oak stump
    ctx.fillStyle = "#3E2723";
    ctx.fillRect(anvilStumpX - 2, anvilStumpY, 18, 18);
    ctx.fillStyle = "#5D4037";
    ctx.fillRect(anvilStumpX, anvilStumpY + 2, 14, 14);
    // Steel Anvil
    ctx.fillStyle = "#1E293B";
    ctx.fillRect(anvilStumpX - 6, anvilStumpY - 8, 22, 6); // horn and base
    ctx.fillRect(anvilStumpX - 2, anvilStumpY - 12, 16, 6); // anvil top face
    ctx.fillStyle = "#94A3B8";
    ctx.fillRect(anvilStumpX - 1, anvilStumpY - 12, 14, 2); // polished steel surface

    // Quenching Water Tub
    ctx.fillStyle = "#3E2723";
    ctx.fillRect(anvilStumpX + 22, anvilStumpY + 2, 16, 16);
    ctx.fillStyle = "#38BDF8";
    ctx.fillRect(anvilStumpX + 24, anvilStumpY + 4, 12, 10);

    // Wall-mounted weapon rack
    ctx.fillStyle = "#5D4037";
    ctx.fillRect(bx + 16, by + 24, 24, 4);
    ctx.fillStyle = "#CBD5E1";
    ctx.fillRect(bx + 20, by + 18, 2, 16); // upright blade
    ctx.fillRect(bx + 28, by + 18, 2, 16); // spear
  }

  if (isShop) {
    // ── GUILD ARMORY & BAZAAR MEDIEVAL STRIPED AWNING ──
    const awnY = by + 28;
    const awnH = 16;
    const awnW = bw - 20;
    const awnX = bx + 10;
    const stripeW = 14;

    for (let sx = 0; sx < awnW; sx += stripeW) {
      const isAlt = Math.floor(sx / stripeW) % 2 === 0;
      ctx.fillStyle = isAlt ? "#DC2626" : "#F59E0B"; // Royal Red & Gold stripes
      ctx.fillRect(awnX + sx, awnY, Math.min(stripeW, awnW - sx), awnH);
      // Scalloped bottom fringe
      ctx.beginPath();
      ctx.arc(awnX + sx + Math.min(stripeW, awnW - sx) / 2, awnY + awnH, 3, 0, Math.PI);
      ctx.fill();
    }
    // Awning wooden support frame
    ctx.fillStyle = "#2D1B0E";
    ctx.fillRect(awnX, awnY, awnW, 3);
    ctx.fillRect(awnX, awnY, 3, 24);
    ctx.fillRect(awnX + awnW - 3, awnY, 3, 24);
  }

  if (isGuild) {
    // ── ROYAL GUILDHALL HERALDRY BANNERS & BRAZIERS ──
    // Flanking Royal Banners (Sapphire & Gold)
    const banW = 12, banH = 34;
    // Left Banner
    ctx.fillStyle = "#1E3A8A";
    ctx.fillRect(bx + 18, by + 20, banW, banH);
    ctx.fillStyle = "#F59E0B";
    ctx.fillRect(bx + 18, by + 20, banW, 3);
    ctx.fillRect(bx + 23, by + 24, 2, 12); // gold cross
    ctx.fillRect(bx + 20, by + 28, 8, 2);
    // Banner swallowtail cutout
    ctx.fillStyle = isGuild ? "#4A4642" : "#262320";
    ctx.beginPath();
    ctx.moveTo(bx + 18, by + 20 + banH);
    ctx.lineTo(bx + 18 + banW / 2, by + 20 + banH - 8);
    ctx.lineTo(bx + 18 + banW, by + 20 + banH);
    ctx.closePath();
    ctx.fill();

    // Right Banner
    ctx.fillStyle = "#1E3A8A";
    ctx.fillRect(bx + bw - 30, by + 20, banW, banH);
    ctx.fillStyle = "#F59E0B";
    ctx.fillRect(bx + bw - 30, by + 20, banW, 3);
    ctx.fillRect(bx + bw - 25, by + 24, 2, 12);
    ctx.fillRect(bx + bw - 28, by + 28, 8, 2);
    ctx.fillStyle = isGuild ? "#4A4642" : "#262320";
    ctx.beginPath();
    ctx.moveTo(bx + bw - 30, by + 20 + banH);
    ctx.lineTo(bx + bw - 30 + banW / 2, by + 20 + banH - 8);
    ctx.lineTo(bx + bw - 30 + banW, by + 20 + banH);
    ctx.closePath();
    ctx.fill();

    // Ornate Round Leaded Rose Window above the door
    const roseX = peakX, roseY = by + 22;
    ctx.fillStyle = "#1E293B";
    ctx.beginPath();
    ctx.arc(roseX, roseY, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#FDE047";
    ctx.beginPath();
    ctx.arc(roseX, roseY, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1E293B";
    ctx.fillRect(roseX - 10, roseY - 1, 20, 2);
    ctx.fillRect(roseX - 1, roseY - 10, 2, 20);
  }

  // 6. Medieval Diamond Lattice Windows with Warm Lantern Glow
  const winFlicker = tick % 180 > 90;
  if (!isSmithy && !isFortress) {
    for (let fl = 0; fl < Math.min(floors, 2); fl++) {
      const wy = by + 18 + fl * 44;
      const winW = 20, winH = 22;
      const winPositions = [bx + 14];
      if (bw > 100) winPositions.push(bx + bw - 34);
      if (bw > 200) winPositions.push(bx + Math.floor(bw * 0.28));

      for (const wx of winPositions) {
        // Wooden window frame with arched top
        ctx.fillStyle = "#2D1B0E";
        ctx.fillRect(wx - 2, wy - 2, winW + 4, winH + 4);

        // Warm glowing yellow interior light
        ctx.fillStyle = winFlicker ? "#FEF08A" : "#FDE047";
        ctx.fillRect(wx, wy, winW, winH);

        // Medieval diamond / criss-cross lattice mullions
        ctx.fillStyle = "#3E2723";
        ctx.fillRect(wx + Math.floor(winW / 2) - 1, wy, 2, winH);
        ctx.fillRect(wx, wy + Math.floor(winH / 2) - 1, winW, 2);

        // Window sill & flower box
        ctx.fillStyle = "#451A03";
        ctx.fillRect(wx - 3, wy + winH, winW + 6, 4);
        ctx.fillStyle = pal.flowerRed;
        ctx.fillRect(wx, wy + winH - 2, 4, 3);
        ctx.fillRect(wx + 8, wy + winH - 2, 4, 3);
        ctx.fillRect(wx + 16, wy + winH - 2, 4, 3);
      }
    }
  }

  // 7. Authentic Medieval Heavy Arched Oak Door
  const dw = isGuild ? 38 : 30;
  const dh = isGuild ? 38 : 32;
  const dx = doorX - Math.floor(dw / 2);
  const dy = doorY - dh;

  // Stone Arched Doorframe
  ctx.fillStyle = "#1C1917";
  ctx.fillRect(dx - 4, dy - 6, dw + 8, dh + 6);
  ctx.fillStyle = "#57534E";
  ctx.fillRect(dx - 2, dy - 4, dw + 4, dh + 4);

  // Door Opening
  ctx.fillStyle = isSmithy ? "#7C2D12" : "#1C1917"; // Smithy shows red forge fire glow inside!
  ctx.fillRect(dx, dy, dw, dh);

  if (isSmithy) {
    // Glowing forge coals inside doorway
    ctx.fillStyle = "#EA580C";
    ctx.fillRect(dx + 4, dy + dh - 14, dw - 8, 12);
    ctx.fillStyle = "#FEF08A";
    ctx.fillRect(dx + 8, dy + dh - 10, dw - 16, 6);
  } else if (isFortress) {
    // Heavy Iron Portcullis Grille
    ctx.fillStyle = "#1E293B";
    ctx.fillRect(dx, dy, dw, dh);
    ctx.fillStyle = "#64748B";
    for (let bar = 4; bar < dw; bar += 6) {
      ctx.fillRect(dx + bar, dy, 2, dh);
    }
    for (let bar = 6; bar < dh; bar += 8) {
      ctx.fillRect(dx, dy + bar, dw, 2);
    }
  } else {
    // Heavy Vertical Oak Planks with Black Iron Studs
    ctx.fillStyle = "#3E2723";
    ctx.fillRect(dx, dy, dw, dh);
    ctx.fillStyle = "#27170E";
    for (let p = 6; p < dw; p += 7) {
      ctx.fillRect(dx + p, dy, 1, dh);
    }
    // Decorative Wrought-Iron Hinges
    ctx.fillStyle = "#0F172A";
    ctx.fillRect(dx + 2, dy + 6, dw - 8, 3);
    ctx.fillRect(dx + 2, dy + dh - 10, dw - 8, 3);
    // Brass Ring Knocker / Handle
    ctx.fillStyle = "#F59E0B";
    ctx.fillRect(dx + dw - 7, dy + Math.floor(dh / 2), 3, 3);
  }

  // 8. Flanking Medieval Torches / Lanterns by the Entrance
  const torchY = dy + 6;
  const leftTorchX = dx - 10;
  const rightTorchX = dx + dw + 6;

  // Left Torch
  ctx.fillStyle = "#2D1B0E";
  ctx.fillRect(leftTorchX, torchY, 4, 12);
  ctx.fillStyle = "#F59E0B";
  ctx.fillRect(leftTorchX - 1, torchY - 3, 6, 5);
  ctx.fillStyle = "#EF4444";
  ctx.fillRect(leftTorchX, torchY - 5 - (tick % 4), 4, 4);

  // Right Torch
  ctx.fillStyle = "#2D1B0E";
  ctx.fillRect(rightTorchX, torchY, 4, 12);
  ctx.fillStyle = "#F59E0B";
  ctx.fillRect(rightTorchX - 1, torchY - 3, 6, 5);
  ctx.fillStyle = "#EF4444";
  ctx.fillRect(rightTorchX, torchY - 5 - ((tick + 2) % 4), 4, 4);

  // 9. Interactive Proximity Indicator (When near door)
  if (isNearby) {
    // Welcome stone mat with golden pulse
    ctx.fillStyle = "#F59E0B";
    ctx.fillRect(dx - 4, doorY, dw + 8, 6);
    ctx.fillStyle = "#FEF08A";
    ctx.fillRect(dx - 2, doorY + 1, dw + 4, 4);

    // Glowing border highlight around entrance
    ctx.fillStyle = "rgba(245, 158, 11, 0.4)";
    ctx.fillRect(bx - 3, by - 3, bw + 6, bh + 6);
  }

  // 10. Medieval Heraldic Crest & High-Resolution Name Banner
  ctx.font = "24px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(b.signIcon, peakX, peakY - 38);

  // Set font first to measure accurately
  ctx.font = "bold 13px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  const nameWidth = Math.ceil(ctx.measureText(b.name).width);
  const bannerW = Math.max(nameWidth + 28, 140);
  const bannerH = 24;
  const bannerX = fp(peakX - bannerW / 2);
  const bannerY = peakY - 30;

  // Outer dark drop shadow
  ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
  ctx.fillRect(bannerX - 2, bannerY - 2, bannerW + 4, bannerH + 4);

  // Gilded golden-amber medieval border
  ctx.fillStyle = "#D97706";
  ctx.fillRect(bannerX - 1, bannerY - 1, bannerW + 2, bannerH + 2);

  // Deep obsidian plaque body
  ctx.fillStyle = "#0F172A";
  ctx.fillRect(bannerX, bannerY, bannerW, bannerH);

  // Corner golden rivet studs
  ctx.fillStyle = "#FDE68A";
  ctx.fillRect(bannerX + 2, bannerY + 2, 2, 2);
  ctx.fillRect(bannerX + bannerW - 4, bannerY + 2, 2, 2);
  ctx.fillRect(bannerX + 2, bannerY + bannerH - 4, 2, 2);
  ctx.fillRect(bannerX + bannerW - 4, bannerY + bannerH - 4, 2, 2);

  // High-contrast warm parchment text
  ctx.fillStyle = "#FFFBEB";
  ctx.textAlign = "center";
  ctx.fillText(b.name, peakX, bannerY + 16);
}

// ─── GBA NPC ────────────────────────────────────────────────────────────────
export function drawNPC(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  direction: Direction,
  isMoving: boolean,
  frame: number,
  bodyColor: string,
  hairColor: string,
  name: string,
  tick: number
) {
  ctx.save();
  ctx.translate(fp(x), fp(y));
  const bobY = isMoving && (frame === 1 || frame === 3) ? -1 : 0;
  const skinColor = "#F8C898", oc = "#301808";

  // Shadow
  ctx.fillStyle = "#285030";
  ctx.fillRect(5, 27, 16, 4);

  const isSide = direction === "left" || direction === "right";

  if (isSide) {
    if (direction === "right") {
      ctx.translate(26, 0);
      ctx.scale(-1, 1);
    }

    const stride = isMoving ? (frame === 1 ? 1 : frame === 3 ? 2 : 0) : 0;

    // Legs
    ctx.fillStyle = oc;
    if (stride === 0) {
      ctx.fillRect(9, 20 + bobY, 8, 8);
      ctx.fillStyle = "#4A3020";
      ctx.fillRect(10, 21 + bobY, 6, 5);
      ctx.fillStyle = oc;
      ctx.fillRect(8, 25 + bobY, 9, 3);
    } else if (stride === 1) {
      ctx.fillRect(7, 20 + bobY, 6, 8);
      ctx.fillRect(14, 20 + bobY, 5, 6);
      ctx.fillStyle = "#4A3020";
      ctx.fillRect(8, 21 + bobY, 4, 5);
      ctx.fillStyle = oc;
      ctx.fillRect(6, 25 + bobY, 7, 3);
    } else {
      ctx.fillRect(13, 20 + bobY, 6, 8);
      ctx.fillRect(8, 20 + bobY, 5, 6);
      ctx.fillStyle = "#4A3020";
      ctx.fillRect(14, 21 + bobY, 4, 5);
      ctx.fillStyle = oc;
      ctx.fillRect(12, 25 + bobY, 7, 3);
    }

    // Torso
    ctx.fillStyle = oc;
    ctx.fillRect(8, 12 + bobY, 11, 9);
    ctx.fillStyle = bodyColor;
    ctx.fillRect(9, 13 + bobY, 9, 7);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(9, 13 + bobY, 3, 2);

    // Arm
    const armSwing = isMoving ? (frame === 1 ? -2 : frame === 3 ? 2 : 0) : 0;
    ctx.fillStyle = oc;
    ctx.fillRect(11 + armSwing, 13 + bobY, 4, 7);
    ctx.fillStyle = bodyColor;
    ctx.fillRect(12 + armSwing, 13 + bobY, 2, 5);
    ctx.fillStyle = skinColor;
    ctx.fillRect(12 + armSwing, 18 + bobY, 2, 2);

    // Head profile
    ctx.fillStyle = oc;
    ctx.fillRect(7, 2 + bobY, 12, 11);
    ctx.fillStyle = skinColor;
    ctx.fillRect(7, 5 + bobY, 7, 7);
    ctx.fillStyle = hairColor;
    ctx.fillRect(8, 2 + bobY, 11, 4);
    ctx.fillRect(13, 4 + bobY, 6, 8);
    // Eye
    ctx.fillStyle = oc;
    ctx.fillRect(9, 7 + bobY, 2, 2);
  } else {
    // Front / Back
    const legSwing = isMoving ? (frame === 1 ? 2 : frame === 3 ? -2 : 0) : 0;
    ctx.fillStyle = oc;
    ctx.fillRect(5, 20 + bobY, 5, 8);
    ctx.fillRect(14, 20 + bobY, 5, 8);
    ctx.fillStyle = "#4A3020";
    ctx.fillRect(6, 21 + bobY, 3, 5);
    ctx.fillRect(15, 21 + bobY + (legSwing > 0 ? 1 : 0), 3, 5);
    ctx.fillStyle = oc;
    ctx.fillRect(5, 25 + bobY + (legSwing > 0 ? 1 : 0), 5, 3);
    ctx.fillRect(14, 25 + bobY + (legSwing < 0 ? 1 : 0), 5, 3);

    // Torso
    ctx.fillStyle = oc;
    ctx.fillRect(4, 12 + bobY, 16, 9);
    ctx.fillStyle = bodyColor;
    ctx.fillRect(5, 13 + bobY, 14, 7);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(5, 13 + bobY, 14, 1);
    ctx.fillRect(5, 13 + bobY, 1, 7);

    // Arms
    ctx.fillStyle = oc;
    ctx.fillRect(2, 13 + bobY + legSwing, 3, 7);
    ctx.fillRect(19, 13 + bobY - legSwing, 3, 7);

    // Head
    ctx.fillStyle = oc;
    ctx.fillRect(4, 1 + bobY, 16, 12);
    ctx.fillStyle = direction === "up" ? hairColor : skinColor;
    ctx.fillRect(5, 2 + bobY, 14, 10);
    if (direction !== "up") {
      ctx.fillStyle = "#FDD8B0";
      ctx.fillRect(5, 2 + bobY, 14, 2);
      ctx.fillRect(5, 2 + bobY, 2, 10);
      ctx.fillStyle = hairColor;
      ctx.fillRect(4, 1 + bobY, 16, 4);
      ctx.fillRect(4, 1 + bobY, 3, 10);
      ctx.fillRect(17, 1 + bobY, 3, 10);
      // Eyes
      ctx.fillStyle = oc;
      ctx.fillRect(8, 8 + bobY, 2, 2);
      ctx.fillRect(14, 8 + bobY, 2, 2);
    } else {
      ctx.fillStyle = hairColor;
      ctx.fillRect(4, 1 + bobY, 16, 12);
    }
  }

  // High-Resolution NPC Name Tag (always facing upright)
  ctx.restore();
  ctx.save();
  ctx.translate(fp(x), fp(y));

  ctx.font = "bold 11px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  const nameW = Math.ceil(ctx.measureText(name).width);
  const tagW = Math.max(nameW + 16, 44);
  const tagH = 18;
  const tagX = 12 - Math.floor(tagW / 2);
  const tagY = -28;

  // Dark shadow & border
  ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
  ctx.fillRect(tagX - 1, tagY - 1, tagW + 2, tagH + 2);

  // Plaque body
  ctx.fillStyle = "#0F172A";
  ctx.fillRect(tagX, tagY, tagW, tagH);

  // Top highlight rim
  ctx.fillStyle = "#334155";
  ctx.fillRect(tagX, tagY, tagW, 1);

  // Role / hair accent bottom bar
  ctx.fillStyle = hairColor || "#F59E0B";
  ctx.fillRect(tagX, tagY + tagH - 2, tagW, 2);

  // High contrast white text
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "center";
  ctx.fillText(name, 12, tagY + 13);
  ctx.restore();
}

// ─── PLAYER SPRITE ──────────────────────────────────────────────────────────
interface DrawSpriteOptions {
  ctx: CanvasRenderingContext2D; x: number; y: number;
  direction: Direction; isMoving: boolean; frame: number;
  hasCrown?: boolean; hasHood?: boolean; hasBlessing?: boolean;
  hasSword?: boolean; hasShield?: boolean; hasCape?: boolean; hasCowl?: boolean;
  palette?: ThemePalette; theme?: string;
}
export function drawPlayerSprite({
  ctx,x,y,direction,isMoving,frame,
  hasCrown=false,hasHood=false,hasBlessing=false,
  hasSword=false,hasShield=false,hasCape=false,hasCowl=false,
  palette,theme
}:DrawSpriteOptions) {
  ctx.save();
  ctx.translate(fp(x), fp(y));
  const pal = palette ?? PALETTES.classic_firered;
  const bobY = isMoving && (frame === 1 || frame === 3) ? -1 : 0;
  const skinColor = "#F8C898", hairColor = "#583010", oc = "#201008";

  if (hasBlessing) {
    ctx.fillStyle = pal.flowerYellow;
    for (let i = 0; i < 8; i++) {
      const ang = (i / 8) * Math.PI * 2 + frame * 0.2;
      ctx.fillRect(fp(16 + Math.cos(ang) * 20), fp(16 + Math.sin(ang) * 20), 3, 3);
    }
  }

  // Shadow
  ctx.fillStyle = pal.grassDark;
  ctx.fillRect(7, 30, 18, 3);
  ctx.fillRect(9, 31, 14, 2);

  const isSide = direction === "left" || direction === "right";

  if (isSide) {
    // Mirror for facing right
    if (direction === "right") {
      ctx.translate(32, 0);
      ctx.scale(-1, 1);
    }

    // ── SIDE PROFILE (Canonical Left-Facing) ──
    const stride = isMoving ? (frame === 1 ? 1 : frame === 3 ? 2 : 0) : 0;

    // 1. Legs / Pants / Shoes
    ctx.fillStyle = oc;
    if (stride === 0) {
      // Standing neutral profile
      ctx.fillRect(11, 21 + bobY, 10, 8);
      ctx.fillStyle = pal.playerPants;
      ctx.fillRect(12, 22 + bobY, 8, 5);
      // Shoes
      ctx.fillStyle = oc;
      ctx.fillRect(9, 27 + bobY, 10, 4);
      ctx.fillStyle = "#382820";
      ctx.fillRect(10, 27 + bobY, 8, 3);
    } else if (stride === 1) {
      // Front leg strides forward (left), back leg extends back (right)
      // Back leg
      ctx.fillRect(17, 21 + bobY, 6, 7);
      ctx.fillStyle = pal.playerPants;
      ctx.fillRect(18, 22 + bobY, 4, 4);
      ctx.fillStyle = oc;
      ctx.fillRect(18, 26 + bobY, 6, 3);
      // Front leg
      ctx.fillStyle = oc;
      ctx.fillRect(9, 21 + bobY, 7, 7);
      ctx.fillStyle = pal.playerPants;
      ctx.fillRect(10, 22 + bobY, 5, 5);
      ctx.fillStyle = oc;
      ctx.fillRect(7, 27 + bobY, 9, 4);
      ctx.fillStyle = "#382820";
      ctx.fillRect(8, 27 + bobY, 7, 3);
    } else {
      // Reverse stride (frame 3)
      // Front leg back
      ctx.fillRect(16, 21 + bobY, 7, 8);
      ctx.fillStyle = pal.playerPants;
      ctx.fillRect(17, 22 + bobY, 5, 5);
      ctx.fillStyle = oc;
      ctx.fillRect(15, 27 + bobY, 8, 4);
      // Back leg swings forward
      ctx.fillStyle = oc;
      ctx.fillRect(10, 21 + bobY, 6, 7);
      ctx.fillStyle = pal.playerPants;
      ctx.fillRect(11, 22 + bobY, 4, 4);
      ctx.fillStyle = oc;
      ctx.fillRect(8, 26 + bobY, 7, 3);
    }

    // 2. Backpack (Back of torso, right side)
    ctx.fillStyle = oc;
    ctx.fillRect(19, 14 + bobY, 5, 8);
    ctx.fillStyle = "#783818";
    ctx.fillRect(20, 15 + bobY, 3, 6);
    ctx.fillStyle = pal.flowerYellow;
    ctx.fillRect(20, 17 + bobY, 2, 2);

    // 3. Torso (Side profile)
    ctx.fillStyle = oc;
    ctx.fillRect(10, 13 + bobY, 11, 9);
    ctx.fillStyle = pal.playerTunic;
    ctx.fillRect(11, 14 + bobY, 9, 7);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(11, 14 + bobY, 3, 2); // collar edge
    ctx.fillStyle = oc;
    ctx.fillRect(11, 20 + bobY, 9, 2); // belt
    ctx.fillStyle = pal.flowerYellow;
    ctx.fillRect(11, 20 + bobY, 2, 2); // buckle

    // 4. Arm / Sleeve (Swings with walking)
    const armSwing = isMoving ? (frame === 1 ? -2 : frame === 3 ? 2 : 0) : 0;
    ctx.fillStyle = oc;
    ctx.fillRect(13 + armSwing, 14 + bobY, 5, 7);
    ctx.fillStyle = pal.playerTunic;
    ctx.fillRect(14 + armSwing, 14 + bobY, 3, 5);
    ctx.fillStyle = skinColor;
    ctx.fillRect(14 + armSwing, 19 + bobY, 3, 2); // hand

    // 5. Head (Authentic GBA side-profile)
    // Head base outline
    ctx.fillStyle = oc;
    ctx.fillRect(9, 2 + bobY, 13, 12);
    // Face skin (front half)
    ctx.fillStyle = skinColor;
    ctx.fillRect(9, 5 + bobY, 8, 8);
    ctx.fillStyle = "#FDD8B0";
    ctx.fillRect(10, 5 + bobY, 6, 2);
    // Hair (top, back and nape of neck)
    ctx.fillStyle = hairColor;
    ctx.fillRect(10, 2 + bobY, 12, 4); // top hair
    ctx.fillRect(16, 4 + bobY, 6, 9); // back hair
    ctx.fillRect(14, 11 + bobY, 6, 3); // nape of neck
    // Cap visor protruding forward!
    ctx.fillStyle = pal.playerTunic;
    ctx.fillRect(7, 4 + bobY, 8, 3);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(8, 4 + bobY, 6, 1);
    // Eye (facing forward/left)
    ctx.fillStyle = oc;
    ctx.fillRect(11, 8 + bobY, 2, 2);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(11, 8 + bobY, 1, 1);

    // Crown accessory
    if (hasCrown) {
      ctx.fillStyle = pal.flowerYellow;
      ctx.fillRect(10, -1 + bobY, 10, 4);
      ctx.fillRect(9, -3 + bobY, 3, 3);
      ctx.fillRect(14, -4 + bobY, 3, 4);
      ctx.fillRect(18, -3 + bobY, 3, 3);
      ctx.fillStyle = pal.flowerRed;
      ctx.fillRect(14, -2 + bobY, 2, 2);
    }

    if (hasCape) {
      ctx.fillStyle = "#1E1B4B";
      ctx.fillRect(19, 13 + bobY, 4, 13);
      ctx.fillStyle = "#F59E0B";
      ctx.fillRect(22, 14 + bobY, 1, 12);
    }
    if (hasSword) {
      ctx.fillStyle = "#D97706";
      ctx.fillRect(11, 15 + bobY, 2, 2);
      ctx.fillStyle = "#E2E8F0";
      ctx.fillRect(10, 17 + bobY, 4, 1);
      ctx.fillStyle = "#64748B";
      ctx.fillRect(11, 18 + bobY, 2, 8);
      ctx.fillStyle = "#F59E0B";
      ctx.fillRect(11, 26 + bobY, 2, 1);
    }
    if (hasShield) {
      ctx.fillStyle = "#0F172A";
      ctx.fillRect(13, 15 + bobY, 4, 8);
      ctx.fillStyle = "#DC2626";
      ctx.fillRect(14, 16 + bobY, 2, 6);
      ctx.fillStyle = "#F59E0B";
      ctx.fillRect(14, 17 + bobY, 2, 2);
    }
    if (hasCowl) {
      ctx.fillStyle = "#059669";
      ctx.fillRect(15, 0 + bobY, 3, 2);
      ctx.fillRect(17, -2 + bobY, 3, 2);
      ctx.fillRect(19, -4 + bobY, 3, 2);
      ctx.fillStyle = "#34D399";
      ctx.fillRect(18, -1 + bobY, 1, 2);
    }
  } else {
    // ── FRONT / BACK VIEW ──
    const legOffset = isMoving ? (frame === 1 ? 2 : frame === 3 ? -2 : 0) : 0;
    ctx.fillStyle = oc;
    ctx.fillRect(8, 22 + bobY, 6, 9);
    ctx.fillRect(18, 22 + bobY, 6, 9);
    ctx.fillStyle = pal.playerPants;
    ctx.fillRect(9, 23 + bobY, 4, 5);
    ctx.fillRect(19, 23 + bobY + (legOffset > 0 ? 1 : 0), 4, 5);
    ctx.fillStyle = oc;
    ctx.fillRect(8, 28 + bobY + (legOffset > 0 ? 1 : 0), 6, 3);
    ctx.fillRect(18, 28 + bobY + (legOffset < 0 ? 1 : 0), 6, 3);

    // Torso
    ctx.fillStyle = oc;
    ctx.fillRect(6, 13 + bobY, 20, 10);
    ctx.fillStyle = pal.playerTunic;
    ctx.fillRect(7, 14 + bobY, 18, 8);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(7, 14 + bobY, 18, 1);
    ctx.fillRect(7, 14 + bobY, 1, 8);
    ctx.fillStyle = oc;
    ctx.fillRect(7, 20 + bobY, 18, 3);
    ctx.fillStyle = pal.flowerYellow;
    ctx.fillRect(14, 20 + bobY, 4, 3);

    // Arms
    ctx.fillStyle = oc;
    ctx.fillRect(4, 14 + bobY + legOffset, 4, 8);
    ctx.fillRect(24, 14 + bobY - legOffset, 4, 8);
    ctx.fillStyle = pal.playerTunic;
    ctx.fillRect(5, 14 + bobY + legOffset, 2, 5);
    ctx.fillRect(25, 14 + bobY - legOffset, 2, 5);

    // Head
    ctx.fillStyle = oc;
    ctx.fillRect(7, 2 + bobY, 18, 12);
    ctx.fillStyle = direction === "up" ? hairColor : skinColor;
    ctx.fillRect(8, 3 + bobY, 16, 10);
    if (direction === "down") {
      ctx.fillStyle = "#FDD8B0";
      ctx.fillRect(8, 3 + bobY, 16, 2);
      ctx.fillRect(8, 3 + bobY, 2, 10);
      ctx.fillStyle = hairColor;
      ctx.fillRect(7, 2 + bobY, 18, 4);
      ctx.fillRect(7, 2 + bobY, 3, 10);
      ctx.fillRect(22, 2 + bobY, 3, 10);
      // Eyes
      ctx.fillStyle = oc;
      ctx.fillRect(11, 9 + bobY, 2, 2);
      ctx.fillRect(19, 9 + bobY, 2, 2);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(11, 9 + bobY, 1, 1);
      ctx.fillRect(19, 9 + bobY, 1, 1);
      ctx.fillStyle = "#A06040";
      ctx.fillRect(14, 12 + bobY, 4, 1);
    } else {
      // Back of head
      ctx.fillStyle = hairColor;
      ctx.fillRect(8, 3 + bobY, 16, 10);
      ctx.fillStyle = "#381808";
      ctx.fillRect(9, 10 + bobY, 14, 2);
    }

    if (hasCrown) {
      ctx.fillStyle = oc;
      ctx.fillRect(7, -2 + bobY, 18, 6);
      ctx.fillStyle = pal.flowerYellow;
      ctx.fillRect(8, -1 + bobY, 16, 4);
      ctx.fillRect(8, -4 + bobY, 3, 4);
      ctx.fillRect(14, -5 + bobY, 4, 5);
      ctx.fillRect(21, -4 + bobY, 3, 4);
      ctx.fillStyle = pal.flowerRed;
      ctx.fillRect(15, -4 + bobY, 2, 2);
    }

    if (hasCape) {
      if (direction === "up") {
        ctx.fillStyle = "#1E1B4B";
        ctx.fillRect(5, 13 + bobY, 22, 14);
        ctx.fillStyle = "#F59E0B";
        ctx.fillRect(5, 26 + bobY, 22, 1);
      } else {
        ctx.fillStyle = "#1E1B4B";
        ctx.fillRect(3, 14 + bobY, 3, 13);
        ctx.fillRect(26, 14 + bobY, 3, 13);
        ctx.fillStyle = "#F59E0B";
        ctx.fillRect(5, 13 + bobY, 2, 2);
        ctx.fillRect(25, 13 + bobY, 2, 2);
      }
    }
    if (hasSword) {
      ctx.fillStyle = "#D97706";
      ctx.fillRect(3, 15 + bobY, 2, 2);
      ctx.fillStyle = "#E2E8F0";
      ctx.fillRect(2, 17 + bobY, 4, 1);
      ctx.fillStyle = "#475569";
      ctx.fillRect(3, 18 + bobY, 2, 9);
      ctx.fillStyle = "#F59E0B";
      ctx.fillRect(3, 27 + bobY, 2, 1);
    }
    if (hasShield) {
      ctx.fillStyle = "#0F172A";
      ctx.fillRect(24, 15 + bobY, 6, 9);
      ctx.fillStyle = "#DC2626";
      ctx.fillRect(25, 16 + bobY, 4, 7);
      ctx.fillStyle = "#F59E0B";
      ctx.fillRect(26, 17 + bobY, 2, 3);
    }
    if (hasCowl) {
      ctx.fillStyle = "#064E3B";
      ctx.fillRect(6, 12 + bobY, 20, 2);
      ctx.fillStyle = "#059669";
      ctx.fillRect(20, 0 + bobY, 2, 3);
      ctx.fillRect(22, -2 + bobY, 2, 3);
      ctx.fillRect(23, -4 + bobY, 2, 2);
      ctx.fillStyle = "#34D399";
      ctx.fillRect(21, 1 + bobY, 1, 1);
    }
  }

  if (hasHood) {
    ctx.fillStyle = "#A855F7";
    ctx.fillRect(5, 1 + bobY, 2, 26);
    ctx.fillRect(25, 1 + bobY, 2, 26);
    ctx.fillRect(5, 1 + bobY, 22, 2);
  }

  ctx.restore();
}

// ─── DECOR ──────────────────────────────────────────────────────────────────
export function drawDecor(ctx: CanvasRenderingContext2D,decor: any,tick: number,theme: string,pal?: ThemePalette) {
  const palette=pal??PALETTES.classic_firered;
  const {type,x,y,w=0,h=0,variant=0}=decor;
  ctx.save(); ctx.translate(fp(x),fp(y));
  switch(type){
    case "tree_oak": drawGBATree(ctx,0,0,palette,variant); break;
    case "tree_pine": drawGBAPine(ctx,0,0,palette); break;
    case "tree_dead":{
      ctx.fillStyle=palette.grassDark;ctx.fillRect(4,50,16,4);
      ctx.fillStyle=palette.treeTrunk;ctx.fillRect(9,14,6,38);
      ctx.fillRect(0,18,10,3);ctx.fillRect(0,15,4,4);ctx.fillRect(14,24,10,3);ctx.fillRect(20,21,4,4);
      ctx.fillRect(4,30,6,3);ctx.fillRect(1,27,4,4);
      ctx.fillStyle="#504040";ctx.fillRect(9,14,3,38);break;
    }
    case "tree_cherry":{
      ctx.fillStyle=palette.grassDark;ctx.fillRect(6,44,20,4);
      ctx.fillStyle=palette.treeTrunk;ctx.fillRect(13,28,6,18);ctx.fillRect(12,38,8,6);
      ctx.fillStyle="#701840";ctx.fillRect(2,18,28,14);ctx.fillRect(0,20,32,10);ctx.fillRect(4,14,24,6);
      ctx.fillStyle="#C04878";ctx.fillRect(4,19,24,12);ctx.fillRect(2,21,28,8);
      ctx.fillStyle="#F080A8";ctx.fillRect(8,12,16,10);ctx.fillRect(6,14,20,8);
      ctx.fillStyle="#FFC0D8";ctx.fillRect(10,8,12,8);ctx.fillRect(8,10,16,6);ctx.fillRect(12,6,8,4);
      for(let i=0;i<4;i++){const px2=fp(Math.sin(tick*0.04+i*1.5)*8)+12,py2=fp(Math.cos(tick*0.035+i)*5)+14;ctx.fillStyle="#FFC0D8";ctx.fillRect(px2,py2,2,2);}
      break;
    }
    case "lamp_post":{
      ctx.fillStyle="#303038";ctx.fillRect(6,8,4,40);ctx.fillRect(4,44,8,4);ctx.fillRect(2,8,12,4);ctx.fillRect(1,7,4,6);
      ctx.fillStyle="#F0D060";ctx.fillRect(0,4,6,8);
      ctx.fillStyle="#A09020";ctx.fillRect(0,4,6,2);ctx.fillRect(0,10,6,2);
      ctx.fillStyle="#303038";ctx.fillRect(-1,3,8,2);ctx.fillRect(-1,11,8,2);
      ctx.fillStyle="#F8E890";ctx.fillRect(-3,7,2,2);ctx.fillRect(7,7,2,2);ctx.fillRect(2,0,2,3);break;
    }
    case "bench":{
      ctx.fillStyle="#583818";ctx.fillRect(0,18,36,4);ctx.fillRect(0,8,36,4);
      ctx.fillStyle="#784828";ctx.fillRect(1,9,34,2);ctx.fillRect(1,19,34,2);
      ctx.fillStyle="#583818";ctx.fillRect(2,18,5,12);ctx.fillRect(29,18,5,12);ctx.fillRect(0,8,5,6);ctx.fillRect(31,8,5,6);break;
    }
    case "barrel":{
      ctx.fillStyle="#583818";ctx.fillRect(4,0,18,28);ctx.fillStyle="#784828";ctx.fillRect(4,0,8,28);
      ctx.fillStyle="#303010";ctx.fillRect(0,4,26,4);ctx.fillRect(0,18,26,4);
      ctx.fillStyle="#583818";ctx.fillRect(4,0,18,3);ctx.fillRect(4,25,18,3);break;
    }
    case "crate":{
      ctx.fillStyle="#784828";ctx.fillRect(0,0,24,24);
      ctx.fillStyle="#583818";ctx.fillRect(0,0,24,2);ctx.fillRect(0,0,2,24);ctx.fillRect(22,0,2,24);ctx.fillRect(0,22,24,2);
      ctx.fillRect(11,0,2,24);ctx.fillRect(0,11,24,2);break;
    }
    case "market_stall_red": case "market_stall_blue": case "market_stall_yellow":{
      const ac=type==="market_stall_red"?"#D02020":type==="market_stall_blue"?"#2040B0":"#C09010";
      const al=type==="market_stall_red"?"#E04040":type==="market_stall_blue"?"#4068D8":"#E0C020";
      ctx.fillStyle="#583818";ctx.fillRect(2,18,4,30);ctx.fillRect(50,18,4,30);
      ctx.fillStyle=ac;ctx.fillRect(0,0,56,20);ctx.fillStyle=al;ctx.fillRect(0,0,56,4);
      ctx.fillStyle=ac;for(let i=0;i<5;i++)ctx.fillRect(i*12,18,8,8);
      ctx.fillStyle=al;for(let i=0;i<5;i++)ctx.fillRect(i*12,18,4,4);
      ctx.fillStyle="#784828";ctx.fillRect(4,28,48,10);ctx.fillStyle="#583818";ctx.fillRect(4,28,48,2);
      const items=[palette.flowerYellow,palette.flowerRed,palette.windowLight];
      for(let i=0;i<3;i++){ctx.fillStyle=items[i];ctx.fillRect(10+i*14,22,6,6);ctx.fillStyle="#181008";ctx.fillRect(10+i*14,22,6,1);ctx.fillRect(10+i*14,22,1,6);}
      break;
    }
    case "flower_red": case "flower_blue": case "flower_yellow": case "flower_patch":{
      const cfm: Record<string,string[]>={flower_red:[palette.flowerRed,"#FFFFFF"],flower_blue:[palette.windowLight,"#F8F8D0"],flower_yellow:[palette.flowerYellow,"#FFFFFF"],flower_patch:[palette.flowerRed,palette.flowerYellow,"#F080C0",palette.windowLight]};
      const count=type==="flower_patch"?6:1,fw2=w||64;
      for(let i=0;i<count;i++){
        const fx=type==="flower_patch"?((i*Math.floor(fw2/count))%fw2):2,fy=type==="flower_patch"?((i*7)%14):0;
        const c=cfm[type][i%cfm[type].length];
        ctx.fillStyle=palette.treeMid;ctx.fillRect(fx+4,fy+8,2,10);
        ctx.fillStyle=c;ctx.fillRect(fx+3,fy+4,2,2);ctx.fillRect(fx+7,fy+4,2,2);ctx.fillRect(fx+5,fy+2,2,2);ctx.fillRect(fx+5,fy+6,2,2);
        ctx.fillStyle="#F8F8A0";ctx.fillRect(fx+5,fy+4,2,2);
      }
      break;
    }
    case "bush":{
      ctx.fillStyle=palette.treeOutline;ctx.fillRect(0,8,28,10);ctx.fillRect(2,6,24,14);
      ctx.fillStyle=palette.treeMid;ctx.fillRect(2,8,24,10);ctx.fillRect(4,6,20,14);
      ctx.fillStyle=palette.treeLight;ctx.fillRect(4,7,10,4);ctx.fillRect(18,7,8,4);break;
    }
    case "rock_small":{ctx.fillStyle="#484038";ctx.fillRect(2,6,16,10);ctx.fillRect(0,8,20,6);ctx.fillStyle="#685848";ctx.fillRect(2,6,8,5);ctx.fillStyle="#302820";ctx.fillRect(2,14,16,2);break;}
    case "rock_large":{ctx.fillStyle="#383028";ctx.fillRect(4,8,32,18);ctx.fillRect(0,12,40,12);ctx.fillStyle="#584840";ctx.fillRect(4,8,16,10);ctx.fillStyle="#282018";ctx.fillRect(4,24,32,2);break;}
    case "moss_rock":{
      ctx.fillStyle="#383028";ctx.fillRect(4,10,24,16);ctx.fillRect(0,14,32,10);
      ctx.fillStyle=palette.treeOutline;ctx.fillRect(4,10,14,8);ctx.fillStyle=palette.treeMid;ctx.fillRect(6,11,8,5);
      ctx.fillStyle="#282018";ctx.fillRect(4,24,24,2);break;
    }
    case "mushroom":{
      ctx.fillStyle="#583818";ctx.fillRect(7,16,6,10);ctx.fillStyle="#C03020";ctx.fillRect(2,10,16,8);ctx.fillRect(4,8,12,4);ctx.fillRect(6,6,8,4);
      ctx.fillStyle="#E84040";ctx.fillRect(2,10,6,4);ctx.fillStyle="#F8F8F8";ctx.fillRect(4,11,3,3);ctx.fillRect(12,10,2,2);ctx.fillRect(9,9,2,2);
      ctx.fillStyle="#301808";ctx.fillRect(2,16,16,2);break;
    }
    case "fence_h":{
      const fw2=w||64;
      ctx.fillStyle="#1E1208"; ctx.fillRect(0,2,fw2,6); ctx.fillRect(0,12,fw2,6); // Strong outline
      ctx.fillStyle="#8D6E63"; ctx.fillRect(0,3,fw2,4); ctx.fillRect(0,13,fw2,4); // Rustic wood rail
      ctx.fillStyle="#BCAAA4"; ctx.fillRect(0,3,fw2,1); ctx.fillRect(0,13,fw2,1); // Rail top highlight
      for(let i=0;i<=fw2;i+=18){
        ctx.fillStyle="#1E1208"; ctx.fillRect(i-1,-2,7,26); // Post outline with pointed top
        ctx.fillStyle="#A1887F"; ctx.fillRect(i,-1,5,24); // Wood post
        ctx.fillStyle="#D7CCC8"; ctx.fillRect(i,-1,2,24); // Post edge highlight
        ctx.fillStyle="#1E1208"; ctx.fillRect(i+1,4,3,2); ctx.fillRect(i+1,14,3,2); // Wrought iron nails
      }
      break;
    }
    case "fence_v":{
      const fh=h||64;
      ctx.fillStyle="#1E1208"; ctx.fillRect(2,0,6,fh); ctx.fillRect(12,0,6,fh);
      ctx.fillStyle="#8D6E63"; ctx.fillRect(3,0,4,fh); ctx.fillRect(13,0,4,fh);
      ctx.fillStyle="#BCAAA4"; ctx.fillRect(3,0,1,fh); ctx.fillRect(13,0,1,fh);
      for(let i=0;i<=fh;i+=18){
        ctx.fillStyle="#1E1208"; ctx.fillRect(-2,i-1,26,7);
        ctx.fillStyle="#A1887F"; ctx.fillRect(-1,i,24,5);
        ctx.fillStyle="#D7CCC8"; ctx.fillRect(-1,i,24,2);
        ctx.fillStyle="#1E1208"; ctx.fillRect(4,i+1,2,3); ctx.fillRect(14,i+1,2,3);
      }
      break;
    }
    case "fence_corner":{
      ctx.fillStyle="#1E1208"; ctx.fillRect(-2,-2,26,26);
      ctx.fillStyle="#A1887F"; ctx.fillRect(0,0,22,22);
      ctx.fillStyle="#D7CCC8"; ctx.fillRect(0,0,22,3); ctx.fillRect(0,0,3,22);
      ctx.fillStyle="#8D6E63"; ctx.fillRect(3,3,16,16);
      break;
    }
    case "mailbox":{ctx.fillStyle="#181818";ctx.fillRect(4,0,4,20);ctx.fillStyle=palette.roofMart;ctx.fillRect(0,0,16,12);ctx.fillStyle="#001888";ctx.fillRect(0,0,16,2);ctx.fillRect(0,0,2,12);ctx.fillStyle=palette.flowerYellow;ctx.fillRect(6,4,4,2);break;}
    case "sign":{ctx.fillStyle="#583818";ctx.fillRect(10,12,4,24);ctx.fillStyle="#784828";ctx.fillRect(0,0,28,14);ctx.fillStyle="#381808";ctx.fillRect(0,0,28,2);ctx.fillRect(0,0,2,14);ctx.fillStyle="#F8F0D0";ctx.font="bold 5px monospace";ctx.textAlign="center";ctx.fillText("VALORIA",14,10);break;}
    case "statue":{
      ctx.fillStyle="#383838";ctx.fillRect(8,36,48,20);ctx.fillRect(4,28,56,12);ctx.fillStyle="#585858";ctx.fillRect(8,36,12,4);
      ctx.fillStyle="#484848";ctx.fillRect(20,4,24,28);ctx.fillStyle="#686868";ctx.fillRect(24,0,16,10);ctx.fillRect(10,10,12,6);
      ctx.fillStyle="#909090";ctx.fillRect(8,2,3,14);break;
    }
    case "well":{
      ctx.fillStyle="#383828";ctx.fillRect(4,22,28,20);ctx.fillStyle="#585840";ctx.fillRect(6,24,24,16);
      ctx.fillStyle=palette.waterBase;ctx.fillRect(8,26,20,10);ctx.fillStyle=palette.waterLight;ctx.fillRect(8,26,20,2);
      ctx.fillStyle="#583818";ctx.fillRect(5,5,4,18);ctx.fillRect(27,5,4,18);
      ctx.fillStyle="#784828";ctx.fillRect(2,2,32,6);ctx.fillStyle="#381808";ctx.fillRect(2,2,32,2);break;
    }
    case "trough":{
      ctx.fillStyle="#583818";ctx.fillRect(0,8,40,16);ctx.fillStyle="#383028";ctx.fillRect(4,10,32,10);
      ctx.fillStyle=palette.waterBase;ctx.fillRect(6,12,28,6);ctx.fillStyle=palette.waterLight;ctx.fillRect(6,12,28,2);
      ctx.fillStyle="#583818";ctx.fillRect(0,24,6,8);ctx.fillRect(34,24,6,8);break;
    }
    case "hay_bale":{
      ctx.fillStyle="#784818";ctx.fillRect(4,6,32,24);ctx.fillRect(0,10,40,16);
      ctx.fillStyle="#A07828";ctx.fillRect(6,8,28,20);ctx.fillRect(2,12,36,12);
      ctx.fillStyle="#C8A040";ctx.fillRect(8,10,24,16);
      ctx.fillStyle="#784818";for(let i=0;i<4;i++)ctx.fillRect(4,10+i*4,32,1);break;
    }
    case "cart":{
      ctx.fillStyle="#381808";ctx.fillRect(4,26,12,12);ctx.fillRect(6,24,8,16);ctx.fillRect(40,26,12,12);ctx.fillRect(42,24,8,16);
      ctx.fillStyle="#784828";ctx.fillRect(7,29,6,6);ctx.fillRect(43,29,6,6);
      ctx.fillStyle="#381808";ctx.fillRect(10,28,36,4);ctx.fillStyle="#784828";ctx.fillRect(4,4,48,24);
      ctx.fillStyle="#583818";for(let i=0;i<5;i++)ctx.fillRect(4+i*12,4,2,24);ctx.fillRect(4,4,48,2);
      ctx.fillStyle="#381808";ctx.fillRect(-16,10,20,4);ctx.fillRect(-16,8,4,8);break;
    }
    case "torch":{
      ctx.fillStyle="#583818";ctx.fillRect(6,10,4,20);ctx.fillStyle="#784828";ctx.fillRect(5,6,6,8);
      const tf=fp(Math.sin(tick*0.2+variant)*2);
      ctx.fillStyle="#301008";ctx.fillRect(5,2+tf,6,5);ctx.fillStyle="#B02010";ctx.fillRect(6,2+tf,4,4);
      ctx.fillStyle="#E04010";ctx.fillRect(7,1+tf,2,3);ctx.fillStyle="#F8C020";ctx.fillRect(7,1+tf,2,1);break;
    }
    case "lantern":{
      ctx.fillStyle="#303038";ctx.fillRect(6,0,4,6);ctx.fillStyle="#484850";ctx.fillRect(2,6,12,16);
      ctx.fillStyle="#303038";ctx.fillRect(2,6,12,2);ctx.fillRect(2,6,2,16);ctx.fillRect(12,6,2,16);ctx.fillRect(2,20,12,2);
      ctx.fillStyle="#F0C840";ctx.fillRect(4,8,8,10);ctx.fillStyle="#F8E890";ctx.fillRect(4,8,4,4);
      ctx.fillStyle="#303038";ctx.fillRect(2,22,12,4);break;
    }
    case "pond":{
      const pw=w||140,ph=h||80;
      drawGBAWater(ctx,0,0,pw,ph,palette,tick);
      for(let i=0;i<3;i++)drawGBAWaterLily(ctx,16+i*30,20+(i%2)*16,palette);break;
    }
    case "water_lily": drawGBAWaterLily(ctx,0,0,palette); break;
    case "bridge_h":{
      const bw2=w||64;ctx.fillStyle=palette.waterBase;ctx.fillRect(0,2,bw2,6);
      for(let i=0;i<bw2;i+=10){ctx.fillStyle=i%20===0?"#784828":"#905838";ctx.fillRect(i,0,9,10);ctx.fillStyle="#381808";ctx.fillRect(i,0,1,10);}
      ctx.fillStyle="#784828";ctx.fillRect(0,-4,bw2,4);ctx.fillRect(0,10,bw2,4);
      ctx.fillStyle="#381808";ctx.fillRect(0,-4,bw2,1);ctx.fillRect(0,13,bw2,1);break;
    }
    case "bridge_v":{
      const bh2=h||64;ctx.fillStyle=palette.waterBase;ctx.fillRect(2,0,6,bh2);
      for(let i=0;i<bh2;i+=10){ctx.fillStyle=i%20===0?"#784828":"#905838";ctx.fillRect(0,i,10,9);ctx.fillStyle="#381808";ctx.fillRect(0,i,10,1);}
      ctx.fillStyle="#784828";ctx.fillRect(-4,0,4,bh2);ctx.fillRect(10,0,4,bh2);
      ctx.fillStyle="#381808";ctx.fillRect(-4,0,1,bh2);ctx.fillRect(13,0,1,bh2);break;
    }
    case "garden_bed":{
      const gbw=w||80;ctx.fillStyle="#583818";ctx.fillRect(0,0,gbw,20);ctx.fillStyle="#301808";ctx.fillRect(2,2,gbw-4,16);
      ctx.fillStyle="#201008";for(let i=0;i<gbw;i+=12)ctx.fillRect(4+i,4,8,12);
      ctx.fillStyle=palette.treeLight;for(let i=0;i<gbw;i+=16)ctx.fillRect(8+i,2,2,4);break;
    }
    case "archway":{
      ctx.fillStyle="#292524";ctx.fillRect(0,12,14,46);ctx.fillRect(42,12,14,46);
      const steps2:Array<[number,number,number,number]>=[[12,4,32,6],[6,8,44,6],[0,12,56,6]];
      for(const s of steps2){ctx.fillStyle="#292524";ctx.fillRect(s[0]-1,s[1]-1,s[2]+2,s[3]+2);ctx.fillStyle="#57534E";ctx.fillRect(...s);}
      ctx.fillStyle="#EAB308";ctx.fillRect(24,12,8,8); // Golden keystone
      break;
    }
    case "ruins_wall":{
      const rw=w||80;
      // High-contrast, clearly visible medieval stone wall
      ctx.fillStyle="#1C1917"; ctx.fillRect(0,-2,rw,26); // Dark outline
      ctx.fillStyle="#78716C"; ctx.fillRect(1,-1,rw-2,24); // Solid stone block fill
      ctx.fillStyle="#A8A29E"; ctx.fillRect(0,-4,rw,5); // Carved top coping stone cap
      ctx.fillStyle="#F5F5F4"; ctx.fillRect(2,-4,rw-4,2); // Coping highlight
      // Ashlar stone block division lines
      ctx.fillStyle="#292524";
      for(let i=0;i<rw;i+=18){
        ctx.fillRect(i,0,2,22);
        ctx.fillRect(i,10,18,2);
      }
      // Ivy and moss patches
      ctx.fillStyle="#65A30D";
      for(let i=6;i<rw;i+=28){
        ctx.fillRect(i,2,8,4);
        ctx.fillRect(i+2,6,4,4);
      }
      break;
    }
    case "ancient_pillar":{
      ctx.fillStyle="#282018";ctx.fillRect(8,0,16,60);ctx.fillStyle="#383028";ctx.fillRect(4,0,24,8);ctx.fillRect(4,52,24,8);
      ctx.fillStyle="#484838";ctx.fillRect(8,8,4,44);ctx.fillStyle="#6858A8";ctx.fillRect(14,15,4,6);ctx.fillRect(14,26,4,6);ctx.fillRect(14,37,4,6);
      if(tick%60<30){ctx.fillStyle="#9878D8";ctx.fillRect(15,16,2,4);ctx.fillRect(15,27,2,4);ctx.fillRect(15,38,2,4);}
      break;
    }
    case "windmill":{
      ctx.fillStyle="#C0B898";ctx.fillRect(20,20,28,60);ctx.fillStyle="#E0D8B8";ctx.fillRect(22,22,12,56);
      ctx.fillStyle="#A09878";for(let row=0;row<60;row+=8)ctx.fillRect(20,20+row,28,1);
      ctx.fillStyle="#583818";ctx.fillRect(28,64,12,16);
      ctx.save();ctx.translate(34,44);ctx.rotate(tick*0.02);
      ctx.fillStyle="#E8E0C8";
      for(let i=0;i<4;i++){ctx.save();ctx.rotate((Math.PI/2)*i);ctx.fillRect(-3,-30,6,28);ctx.fillRect(-8,-30,16,8);ctx.fillStyle="#C8C0A8";ctx.fillRect(0,-30,2,28);ctx.restore();}
      ctx.fillStyle="#787060";ctx.fillRect(-4,-4,8,8);ctx.restore();break;
    }
    case "tower_small":{
      ctx.fillStyle="#282820";ctx.fillRect(8,20,28,60);ctx.fillStyle="#383830";ctx.fillRect(4,16,36,8);
      ctx.fillStyle="#282820";ctx.fillRect(4,4,8,14);ctx.fillRect(20,4,8,14);ctx.fillRect(36,4,8,14);
      ctx.fillStyle=tick%80<40?palette.windowLight:"#886848";ctx.fillRect(18,36,8,12);
      ctx.fillStyle="#383830";ctx.fillRect(18,36,8,2);ctx.fillRect(18,36,2,12);
      ctx.fillStyle="#583818";ctx.fillRect(14,68,16,12);ctx.fillStyle="#383830";ctx.fillRect(8,20,2,60);ctx.fillRect(34,20,2,60);break;
    }
    case "path_stone":{ctx.fillStyle="#687068";ctx.fillRect(0,2,14,8);ctx.fillRect(2,0,10,12);ctx.fillStyle="#909890";ctx.fillRect(2,2,6,4);ctx.fillStyle="#484848";ctx.fillRect(0,9,14,1);break;}
    default: ctx.fillStyle="#888888";ctx.fillRect(0,0,8,8);
  }
  ctx.restore();
}

// ─── EASTER EGGS ────────────────────────────────────────────────────────────
export function drawEasterEgg(ctx: CanvasRenderingContext2D,egg: any,tick: number) {
  ctx.save(); ctx.translate(fp(egg.x),fp(egg.y));
  if(egg.type==="cat"){
    ctx.fillStyle="#301808";ctx.fillRect(4,12,24,16);ctx.fillRect(14,6,14,12);
    ctx.fillStyle="#E05018";ctx.fillRect(5,13,22,14);ctx.fillRect(15,7,12,10);
    ctx.fillStyle="#F87838";ctx.fillRect(5,13,10,6);ctx.fillRect(15,7,5,5);
    ctx.fillStyle="#301808";ctx.fillRect(15,3,4,5);ctx.fillRect(23,3,4,5);
    ctx.fillStyle="#E05018";ctx.fillRect(16,4,2,3);ctx.fillRect(24,4,2,3);
    ctx.fillStyle="#201008";ctx.fillRect(19,10,2,2);ctx.fillRect(24,10,2,2);
    ctx.fillStyle="#F8E800";ctx.fillRect(19,10,1,1);ctx.fillRect(24,10,1,1);
    ctx.fillStyle="#FEF8E8";ctx.fillRect(12,18,8,8);
    const tailY=tick%40<20?2:-2;
    ctx.fillStyle="#301808";ctx.fillRect(2,14+tailY,6,6);ctx.fillStyle="#E05018";ctx.fillRect(3,15+tailY,4,4);ctx.fillStyle="#FEF8E8";ctx.fillRect(2,16+tailY,3,2);
    if(tick%50<25){ctx.fillStyle="#E05018";ctx.font="6px monospace";ctx.textAlign="left";ctx.fillText("z z",26,8);}
  } else if(egg.type==="wishing_well"){
    ctx.fillStyle="#302818";ctx.fillRect(2,40,44,8);ctx.fillStyle="#484030";ctx.fillRect(4,22,40,20);
    ctx.fillStyle="#585848";ctx.fillRect(6,24,36,16);
    ctx.fillStyle=tick%40<20?"#4880B0":"#5898D0";ctx.fillRect(10,26,28,10);
    ctx.fillStyle=tick%40<20?"#78B0D8":"#98C8E8";ctx.fillRect(10,26,28,2);
    ctx.fillStyle="#583818";ctx.fillRect(6,4,4,18);ctx.fillRect(38,4,4,18);
    ctx.fillStyle="#784828";ctx.fillRect(2,2,44,8);ctx.fillStyle="#381808";ctx.fillRect(2,2,44,2);
    if(tick%30<15){ctx.fillStyle="#F8C020";ctx.fillRect(22,30,4,4);ctx.fillStyle="#F8F040";ctx.fillRect(23,30,2,2);}
  } else if(egg.type==="chest"){
    ctx.fillStyle="#381808";ctx.fillRect(4,10,32,22);
    ctx.fillStyle="#784828";ctx.fillRect(4,18,32,4);ctx.fillRect(18,22,4,6);
    ctx.fillStyle="#A06830";ctx.fillRect(6,12,28,18);ctx.fillStyle="#C88840";ctx.fillRect(6,12,12,8);
    ctx.fillStyle="#381808";ctx.fillRect(4,10,32,2);ctx.fillRect(4,10,2,22);ctx.fillRect(34,10,2,22);
    ctx.fillStyle=tick%60<30?"#F8C020":"#C08010";ctx.fillRect(17,19,6,6);ctx.fillStyle="#301008";ctx.fillRect(19,20,2,3);
  } else if(egg.type==="monolith"){
    ctx.fillStyle="#181818";ctx.fillRect(6,6,36,60);ctx.fillStyle="#303030";ctx.fillRect(8,8,18,56);ctx.fillStyle="#404040";ctx.fillRect(8,8,6,56);
    ctx.fillStyle="#4888C8";ctx.fillRect(16,18,16,2);ctx.fillRect(16,28,16,2);ctx.fillRect(16,38,16,2);ctx.fillRect(16,48,16,2);
    ctx.fillStyle=tick%80<40?"#88B8E8":"#4888C8";ctx.fillRect(20,20,8,6);ctx.fillRect(18,30,12,6);
    ctx.fillStyle="#A8D8F8";ctx.font="7px monospace";ctx.textAlign="center";ctx.fillText("X",24,46);
  } else if(egg.type==="dummy"){
    ctx.fillStyle="#381808";ctx.fillRect(14,24,4,20);ctx.fillRect(6,40,20,4);
    ctx.fillStyle="#A87040";ctx.fillRect(8,8,16,20);ctx.fillStyle="#C89050";ctx.fillRect(10,10,8,14);
    ctx.fillStyle="#784820";ctx.fillRect(10,2,12,8);
    ctx.fillStyle="#381808";ctx.fillRect(8,8,16,2);ctx.fillRect(8,8,2,20);ctx.fillRect(22,8,2,20);
    ctx.fillStyle="#601010";ctx.fillRect(10,6,2,2);ctx.fillRect(12,4,2,2);ctx.fillRect(18,6,2,2);ctx.fillRect(16,4,2,2);ctx.fillRect(10,4,2,2);ctx.fillRect(12,6,2,2);ctx.fillRect(18,4,2,2);ctx.fillRect(16,6,2,2);
  } else if(egg.type==="campfire"){
    ctx.fillStyle="#381808";ctx.fillRect(8,28,24,8);ctx.fillRect(4,30,32,5);
    ctx.fillStyle="#583818";ctx.fillRect(10,24,4,6);ctx.fillRect(26,24,4,6);
    const ff=Math.floor(tick/5)%4,fh=[20,18,22,20][ff],fw2=[12,14,12,10][ff];
    const fxc=20-Math.floor(fw2/2);
    ctx.fillStyle="#701010";ctx.fillRect(fxc,8,fw2,fh);ctx.fillStyle="#D02010";ctx.fillRect(fxc+2,10,fw2-4,fh-4);
    ctx.fillStyle="#F84010";ctx.fillRect(fxc+2,8,fw2-4,6);ctx.fillStyle="#F8C020";ctx.fillRect(fxc+4,8,fw2-8,4);
    for(let i=0;i<3;i++){const st=(tick*2+i*15)%24;if(st<12){ctx.fillStyle="#F8C020";ctx.fillRect(14+i*6,8-st,2,2);}}
  } else if(egg.type==="fishing_spot"){
    ctx.fillStyle="#583818";ctx.fillRect(8,18,3,20);ctx.fillRect(11,12,16,3);
    ctx.fillStyle="#D0D0C8";ctx.fillRect(25,14,1,16);
    const fY=28+(tick%30<15?1:0);ctx.fillStyle="#D02020";ctx.fillRect(22,fY,6,5);ctx.fillStyle="#F8F8F8";ctx.fillRect(22,fY,6,2);
    const rp=Math.floor(tick*0.6)%20;ctx.fillStyle="#78B8E8";ctx.fillRect(21-rp,32,rp*2+6,1);ctx.fillRect(21-rp,34,rp*2+6,1);
  } else if(egg.type==="fox"){
    ctx.fillStyle="#301008";ctx.fillRect(4,12,26,16);ctx.fillRect(18,6,16,12);
    ctx.fillStyle="#D04010";ctx.fillRect(5,13,24,14);ctx.fillRect(19,7,14,10);
    ctx.fillStyle="#F07030";ctx.fillRect(5,13,10,7);ctx.fillRect(19,7,6,5);
    ctx.fillStyle="#C01010";ctx.fillRect(19,2,4,6);ctx.fillRect(28,2,4,6);
    ctx.fillStyle="#F8A080";ctx.fillRect(20,3,2,4);ctx.fillRect(29,3,2,4);
    ctx.fillStyle="#F8F0E8";ctx.fillRect(10,18,10,8);ctx.fillStyle="#201008";ctx.fillRect(21,9,2,2);ctx.fillRect(29,9,2,2);
    ctx.fillStyle="#F8E800";ctx.fillRect(21,9,1,1);ctx.fillRect(29,9,1,1);
    const tw2=tick%40<20?2:-2;ctx.fillStyle="#301008";ctx.fillRect(1,14+tw2,8,8);ctx.fillStyle="#D04010";ctx.fillRect(2,15+tw2,6,6);ctx.fillStyle="#F8F0E8";ctx.fillRect(1,17+tw2,5,3);
  } else if(egg.type==="telescope"){
    ctx.fillStyle="#583818";ctx.fillRect(12,46,4,12);ctx.fillRect(28,46,4,12);ctx.fillRect(18,50,8,3);
    ctx.fillStyle="#282820";ctx.fillRect(6,22,36,10);ctx.fillRect(10,26,38,6);ctx.fillStyle="#484840";ctx.fillRect(6,22,14,10);
    ctx.fillStyle="#4888C8";ctx.fillRect(44,25,6,6);ctx.fillStyle="#88C0E8";ctx.fillRect(44,25,6,2);
    ctx.fillStyle="#282828";ctx.fillRect(43,24,1,8);ctx.fillRect(50,24,1,8);
    for(let i=0;i<5;i++){ctx.fillStyle=tick%60<30?"#F8F040":"#C8B820";ctx.fillRect(4+i*10,4+(i%2)*6,2,2);}
  } else if(egg.type==="bard"){
    ctx.fillStyle="#583818";ctx.fillRect(0,36,64,10);ctx.fillStyle="#784828";ctx.fillRect(2,34,60,4);
    ctx.fillStyle="#301008";ctx.fillRect(20,8,20,26);ctx.fillRect(22,2,16,10);
    ctx.fillStyle="#E03880";ctx.fillRect(21,9,18,24);ctx.fillStyle="#F8C890";ctx.fillRect(23,3,14,8);
    ctx.fillStyle="#601888";ctx.fillRect(22,3,14,4);ctx.fillStyle="#A06020";ctx.fillRect(36,12,12,18);
    ctx.fillStyle="#C08030";ctx.fillRect(37,13,6,14);ctx.fillStyle="#F8F0C0";for(let i=0;i<4;i++)ctx.fillRect(36+i*3,12,1,18);
    const nf=tick%40;if(nf<30){ctx.fillStyle="#F8E020";ctx.font="8px sans-serif";ctx.textAlign="left";ctx.fillText("note",50,16-nf*0.3);}
  }
  ctx.restore();
}

export { drawGBABuilding as drawBuilding };
