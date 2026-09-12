/**
 * High-Detail 16-Bit Pixel Art Sprite & Environmental Object Rendering Engine
 */

export type Direction = "down" | "up" | "left" | "right";

interface DrawSpriteOptions {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  direction: Direction;
  isMoving: boolean;
  frame: number;
  hasCrown?: boolean;
  hasHood?: boolean;
  hasBlessing?: boolean;
  theme?: string;
}

export function drawPlayerSprite({
  ctx,
  x,
  y,
  direction,
  isMoving,
  frame,
  hasCrown = false,
  hasHood = false,
  hasBlessing = false,
  theme = "default",
}: DrawSpriteOptions) {
  ctx.save();
  ctx.translate(x, y);

  // 1. Blessing Radiance Aura
  if (hasBlessing) {
    ctx.strokeStyle = "rgba(245, 158, 11, 0.6)";
    ctx.fillStyle = "rgba(245, 158, 11, 0.15)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(16, 16, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  // 2. Player Drop Shadow
  ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
  ctx.beginPath();
  ctx.ellipse(16, 30, 11, 4.5, 0, 0, Math.PI * 2);
  ctx.fill();

  const bobY = isMoving ? (frame % 2 === 1 ? -1 : 0) : 0;
  const legOffset = isMoving ? (frame === 1 ? 3 : frame === 3 ? -3 : 0) : 0;

  const tunicColor = theme === "cyberpunk" ? "#06B6D4" : "#2563EB";
  const pantsColor = theme === "cyberpunk" ? "#1E1B4B" : "#1E293B";
  const skinColor = "#FCD34D";
  const hairColor = theme === "cyberpunk" ? "#EC4899" : "#B45309";
  const eyeColor = "#0F172A";
  const bootColor = "#0F172A";

  // 3. Boots & Legs
  if (direction === "down" || direction === "up") {
    // Left Leg
    ctx.fillStyle = pantsColor;
    ctx.fillRect(9, 21 + bobY, 5, 6);
    ctx.fillStyle = bootColor;
    ctx.fillRect(9, 27 + bobY + (legOffset > 0 ? 1 : 0), 5, 4);

    // Right Leg
    ctx.fillStyle = pantsColor;
    ctx.fillRect(18, 21 + bobY, 5, 6);
    ctx.fillStyle = bootColor;
    ctx.fillRect(18, 27 + bobY + (legOffset < 0 ? 1 : 0), 5, 4);
  } else if (direction === "left") {
    ctx.fillStyle = pantsColor;
    ctx.fillRect(12 + legOffset, 21 + bobY, 7, 6);
    ctx.fillStyle = bootColor;
    ctx.fillRect(11 + legOffset, 27 + bobY, 8, 4);
  } else if (direction === "right") {
    ctx.fillStyle = pantsColor;
    ctx.fillRect(13 - legOffset, 21 + bobY, 7, 6);
    ctx.fillStyle = bootColor;
    ctx.fillRect(13 - legOffset, 27 + bobY, 8, 4);
  }

  // 4. Torso & Armor
  ctx.fillStyle = tunicColor;
  ctx.fillRect(8, 13 + bobY, 16, 9);
  // Pauldrons / Shoulder armor
  ctx.fillStyle = "#1E40AF";
  ctx.fillRect(6, 13 + bobY, 3, 4);
  ctx.fillRect(23, 13 + bobY, 3, 4);

  // Belt with Golden Buckle
  ctx.fillStyle = "#78350F";
  ctx.fillRect(8, 19 + bobY, 16, 3);
  ctx.fillStyle = "#F59E0B";
  ctx.fillRect(14, 19 + bobY, 4, 3);

  // 5. Arms
  ctx.fillStyle = skinColor;
  if (direction === "down") {
    ctx.fillRect(6, 14 + bobY + (isMoving ? legOffset : 0), 3, 7);
    ctx.fillRect(23, 14 + bobY - (isMoving ? legOffset : 0), 3, 7);
  } else if (direction === "up") {
    ctx.fillRect(6, 14 + bobY - (isMoving ? legOffset : 0), 3, 7);
    ctx.fillRect(23, 14 + bobY + (isMoving ? legOffset : 0), 3, 7);
  } else if (direction === "left") {
    ctx.fillRect(10 + legOffset, 14 + bobY, 4, 7);
  } else if (direction === "right") {
    ctx.fillRect(18 - legOffset, 14 + bobY, 4, 7);
  }

  // 6. Head & Face
  ctx.fillStyle = skinColor;
  ctx.fillRect(9, 5 + bobY, 14, 9);

  if (direction === "down") {
    // Hair
    ctx.fillStyle = hairColor;
    ctx.fillRect(8, 3 + bobY, 16, 4);
    ctx.fillRect(8, 5 + bobY, 2, 5);
    ctx.fillRect(22, 5 + bobY, 2, 5);
    // Eyes
    ctx.fillStyle = eyeColor;
    ctx.fillRect(11, 9 + bobY, 2, 3);
    ctx.fillRect(19, 9 + bobY, 2, 3);
  } else if (direction === "up") {
    ctx.fillStyle = hairColor;
    ctx.fillRect(8, 3 + bobY, 16, 10);
  } else if (direction === "left") {
    ctx.fillStyle = hairColor;
    ctx.fillRect(9, 3 + bobY, 15, 4);
    ctx.fillRect(17, 5 + bobY, 6, 7);
    ctx.fillStyle = eyeColor;
    ctx.fillRect(10, 9 + bobY, 2, 3);
  } else if (direction === "right") {
    ctx.fillStyle = hairColor;
    ctx.fillRect(8, 3 + bobY, 15, 4);
    ctx.fillRect(9, 5 + bobY, 6, 7);
    ctx.fillStyle = eyeColor;
    ctx.fillRect(20, 9 + bobY, 2, 3);
  }

  // 7. Golden Crown Cosmetic
  if (hasCrown) {
    ctx.fillStyle = "#F59E0B";
    ctx.fillRect(9, 0 + bobY, 14, 4);
    ctx.fillStyle = "#FEF08A";
    ctx.fillRect(9, -1 + bobY, 3, 2);
    ctx.fillRect(14, -1 + bobY, 4, 2);
    ctx.fillRect(20, -1 + bobY, 3, 2);
    ctx.fillStyle = "#EF4444";
    ctx.fillRect(15, 1 + bobY, 2, 2);
  }

  // 8. Mage Hood Cosmetic
  if (hasHood) {
    ctx.strokeStyle = "rgba(168, 85, 247, 0.8)";
    ctx.lineWidth = 2;
    ctx.strokeRect(7, 1 + bobY, 18, 28);
  }

  ctx.restore();
}

/**
 * Renders Easter Egg Objects
 */
export function drawEasterEgg(ctx: CanvasRenderingContext2D, egg: any, tick: number) {
  ctx.save();
  ctx.translate(egg.x, egg.y);

  if (egg.type === "cat") {
    // Drop Shadow
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.beginPath();
    ctx.ellipse(16, 26, 12, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ginger Body
    ctx.fillStyle = "#EA580C";
    ctx.fillRect(6, 14, 20, 12);
    // Head
    ctx.fillRect(16, 8, 12, 10);
    // Ears
    ctx.fillRect(17, 5, 3, 3);
    ctx.fillRect(24, 5, 3, 3);
    // White chest
    ctx.fillStyle = "#FFF7ED";
    ctx.fillRect(14, 16, 6, 6);
    // Sleeping Eyes `u u`
    ctx.fillStyle = "#431407";
    ctx.fillRect(20, 12, 2, 1);
    ctx.fillRect(24, 12, 2, 1);
    // Animated Swishing Tail
    const tailAngle = Math.sin(tick * 0.08) * 4;
    ctx.fillStyle = "#EA580C";
    ctx.fillRect(3, 16 + tailAngle, 4, 4);
  } 
  else if (egg.type === "wishing_well") {
    // Stone Base
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.fillRect(2, 42, 44, 8);

    ctx.fillStyle = "#475569";
    ctx.fillRect(4, 24, 40, 20);
    ctx.strokeStyle = "#94A3B8";
    ctx.lineWidth = 2;
    ctx.strokeRect(4, 24, 40, 20);

    // Glowing Water
    ctx.fillStyle = "#0284C7";
    ctx.fillRect(10, 26, 28, 14);

    // Wooden Pillars & Shingle Roof
    ctx.fillStyle = "#78350F";
    ctx.fillRect(6, 6, 4, 20);
    ctx.fillRect(38, 6, 4, 20);

    ctx.fillStyle = "#B45309";
    ctx.fillRect(2, 2, 44, 8);
    ctx.strokeStyle = "#F59E0B";
    ctx.strokeRect(2, 2, 44, 8);
  }
  else if (egg.type === "chest") {
    // Sparkle pulse
    const pulse = Math.abs(Math.sin(tick * 0.05)) * 0.4 + 0.6;
    ctx.fillStyle = `rgba(245, 158, 11, ${pulse * 0.3})`;
    ctx.beginPath();
    ctx.arc(20, 20, 24, 0, Math.PI * 2);
    ctx.fill();

    // Wooden Chest Body
    ctx.fillStyle = "#78350F";
    ctx.fillRect(4, 12, 32, 22);
    // Golden Bands & Keyhole
    ctx.fillStyle = "#F59E0B";
    ctx.fillRect(4, 18, 32, 4);
    ctx.fillRect(18, 22, 4, 6);
    ctx.strokeStyle = "#FDE68A";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(4, 12, 32, 22);
  }
  else if (egg.type === "monolith") {
    // Ancient Rune Stone
    ctx.fillStyle = "#1E293B";
    ctx.fillRect(6, 6, 36, 60);
    ctx.strokeStyle = "#64748B";
    ctx.lineWidth = 2;
    ctx.strokeRect(6, 6, 36, 60);

    // Glowing Cyan Runes
    ctx.fillStyle = "#38BDF8";
    ctx.font = "bold 10px monospace";
    ctx.fillText("᚛ ᚱ ᚹ ᚜", 12, 26);
    ctx.fillText("⚡ 1 3 3 7", 10, 44);
  }
  else if (egg.type === "dummy") {
    // Straw Punching Dummy
    ctx.fillStyle = "#78350F";
    ctx.fillRect(14, 24, 4, 20); // Stand
    ctx.fillRect(6, 40, 20, 4);

    ctx.fillStyle = "#D97706";
    ctx.fillRect(8, 8, 16, 20); // Straw torso
    ctx.fillStyle = "#B45309";
    ctx.fillRect(10, 2, 12, 8); // Head
    ctx.strokeStyle = "#451A03";
    ctx.strokeRect(8, 8, 16, 20);
  }

  ctx.restore();
}
