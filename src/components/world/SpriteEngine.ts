/**
 * 4-Directional 16-Bit Pixel Character Sprite Engine
 * Generates and draws retro walking animation cycles on HTML5 2D Canvas.
 */

export type Direction = "down" | "up" | "left" | "right";

interface DrawSpriteOptions {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  direction: Direction;
  isMoving: boolean;
  frame: number; // 0, 1, 2, 3
  hasCrown?: boolean;
  hasHood?: boolean;
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
  theme = "default",
}: DrawSpriteOptions) {
  ctx.save();
  ctx.translate(x, y);

  // 1. Player Drop Shadow
  ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
  ctx.beginPath();
  ctx.ellipse(16, 30, 10, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Walking Bob calculation
  const bobY = isMoving ? (frame % 2 === 1 ? -1 : 0) : 0;
  const legOffset = isMoving ? (frame === 1 ? 2 : frame === 3 ? -2 : 0) : 0;

  // Colors
  const tunicColor = theme === "cyberpunk" ? "#06B6D4" : "#2563EB";
  const pantsColor = theme === "cyberpunk" ? "#1E1B4B" : "#1E293B";
  const skinColor = "#FCD34D";
  const hairColor = theme === "cyberpunk" ? "#EC4899" : "#B45309";
  const eyeColor = "#0F172A";
  const bootColor = "#0F172A";

  // 2. Legs / Boots (32x32 pixel coordinate space)
  if (direction === "down" || direction === "up") {
    // Left Leg
    ctx.fillStyle = pantsColor;
    ctx.fillRect(10, 22 + bobY, 4, 5);
    ctx.fillStyle = bootColor;
    ctx.fillRect(10, 27 + bobY + (legOffset > 0 ? 1 : 0), 4, 3);

    // Right Leg
    ctx.fillStyle = pantsColor;
    ctx.fillRect(18, 22 + bobY, 4, 5);
    ctx.fillStyle = bootColor;
    ctx.fillRect(18, 27 + bobY + (legOffset < 0 ? 1 : 0), 4, 3);
  } else if (direction === "left") {
    ctx.fillStyle = pantsColor;
    ctx.fillRect(13 + legOffset, 22 + bobY, 6, 5);
    ctx.fillStyle = bootColor;
    ctx.fillRect(12 + legOffset, 27 + bobY, 7, 3);
  } else if (direction === "right") {
    ctx.fillStyle = pantsColor;
    ctx.fillRect(13 - legOffset, 22 + bobY, 6, 5);
    ctx.fillStyle = bootColor;
    ctx.fillRect(13 - legOffset, 27 + bobY, 7, 3);
  }

  // 3. Torso / Tunic
  ctx.fillStyle = tunicColor;
  ctx.fillRect(9, 14 + bobY, 14, 9);

  // Belt & Gold Buckle
  ctx.fillStyle = "#78350F";
  ctx.fillRect(9, 20 + bobY, 14, 2);
  ctx.fillStyle = "#F59E0B";
  ctx.fillRect(14, 20 + bobY, 4, 2);

  // 4. Arms (directional animation)
  ctx.fillStyle = skinColor;
  if (direction === "down") {
    ctx.fillRect(7, 15 + bobY + (isMoving ? legOffset : 0), 2, 6);
    ctx.fillRect(23, 15 + bobY - (isMoving ? legOffset : 0), 2, 6);
  } else if (direction === "up") {
    ctx.fillRect(7, 15 + bobY - (isMoving ? legOffset : 0), 2, 6);
    ctx.fillRect(23, 15 + bobY + (isMoving ? legOffset : 0), 2, 6);
  } else if (direction === "left") {
    ctx.fillRect(11 + legOffset, 15 + bobY, 3, 6);
  } else if (direction === "right") {
    ctx.fillRect(18 - legOffset, 15 + bobY, 3, 6);
  }

  // 5. Head / Face
  ctx.fillStyle = skinColor;
  ctx.fillRect(10, 6 + bobY, 12, 9);

  // Eyes & Hair according to direction
  if (direction === "down") {
    // Hair
    ctx.fillStyle = hairColor;
    ctx.fillRect(9, 4 + bobY, 14, 4);
    ctx.fillRect(9, 6 + bobY, 2, 4);
    ctx.fillRect(21, 6 + bobY, 2, 4);

    // Eyes
    ctx.fillStyle = eyeColor;
    ctx.fillRect(12, 10 + bobY, 2, 2);
    ctx.fillRect(18, 10 + bobY, 2, 2);
  } else if (direction === "up") {
    // Full Back Hair
    ctx.fillStyle = hairColor;
    ctx.fillRect(9, 4 + bobY, 14, 9);
  } else if (direction === "left") {
    // Side Hair
    ctx.fillStyle = hairColor;
    ctx.fillRect(10, 4 + bobY, 13, 4);
    ctx.fillRect(17, 6 + bobY, 5, 6);

    // One Eye
    ctx.fillStyle = eyeColor;
    ctx.fillRect(11, 10 + bobY, 2, 2);
  } else if (direction === "right") {
    // Side Hair
    ctx.fillStyle = hairColor;
    ctx.fillRect(9, 4 + bobY, 13, 4);
    ctx.fillRect(10, 6 + bobY, 5, 6);

    // One Eye
    ctx.fillStyle = eyeColor;
    ctx.fillRect(19, 10 + bobY, 2, 2);
  }

  // 6. Equipped Cosmetic: Golden Crown
  if (hasCrown) {
    ctx.fillStyle = "#F59E0B";
    ctx.fillRect(10, 1 + bobY, 12, 4);
    ctx.fillStyle = "#FEF08A";
    ctx.fillRect(10, 0 + bobY, 2, 2);
    ctx.fillRect(15, 0 + bobY, 2, 2);
    ctx.fillRect(20, 0 + bobY, 2, 2);
    // Ruby gem in crown center
    ctx.fillStyle = "#EF4444";
    ctx.fillRect(15, 2 + bobY, 2, 2);
  }

  // 7. Equipped Cosmetic: Mage Hood Aura
  if (hasHood) {
    ctx.strokeStyle = "rgba(168, 85, 247, 0.7)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(8, 2 + bobY, 16, 26);
  }

  ctx.restore();
}
