/**
 * CyberBonsai SVG Generator
 * Generates responsive, theme-aware pixel-art SVGs of the bonsai tree.
 */

interface BonsaiState {
  username: string;
  level: number; // 0 to 4
  xp: number;
  maxXp: number;
  commitCount: number;
  lastUpdated: string;
  isDry?: boolean; // True if inactive (no commits in last 14 days)
}

interface Pixel {
  x: number;
  y: number;
  color: string;
}

export function generateBonsaiSVG(state: BonsaiState): string {
  const width = 320;
  const height = 340;
  const pixelSize = 8;
  const xOffset = 40; // Center the drawing area (240x240)
  const yOffset = 50;

  // Colors Palette
  const colors = {
    pot: "#b2593f",      // Clay red
    potShadow: "#8a402a",// Dark clay
    potRim: "#c96a4f",   // Light clay
    soil: "#3d251e",     // Dark brown soil
    trunk: "#634731",    // Tree trunk
    trunkHighlight: "#7d5d45",
    leavesDark: "#1b4d22",
    leavesMed: "#2e7d32",
    leavesLight: "#4caf50",
    leavesDryDark: "#8d6e63",
    leavesDryMed: "#a1887f",
    leavesDryLight: "#d7ccc8",
    flowerPink: "#ff80ab",
    flowerWhite: "#fff0f5",
    textMuted: "#888888",
  };

  const pixels: Pixel[] = [];

  // Helper to draw a pixel block
  const drawBlock = (x: number, y: number, color: string) => {
    pixels.push({ x, y, color });
  };

  // Helper to draw a rectangle of blocks
  const drawRect = (startX: number, startY: number, w: number, h: number, color: string) => {
    for (let dx = 0; dx < w; dx++) {
      for (let dy = 0; dy < h; dy++) {
        drawBlock(startX + dx, startY + dy, color);
      }
    }
  };

  // 1. Draw the Pot & Soil (constant for all levels)
  // Soil top line
  drawRect(6, 23, 18, 1, colors.soil);
  // Pot Rim
  drawRect(5, 24, 20, 1, colors.potRim);
  drawBlock(5, 24, colors.pot);
  drawBlock(24, 24, colors.potShadow);
  // Pot Body
  drawRect(6, 25, 18, 2, colors.pot);
  // Pot shadow side
  drawRect(18, 25, 6, 2, colors.potShadow);
  // Pot highlights/details
  drawRect(7, 25, 3, 1, colors.potRim);
  // Pot Feet
  drawRect(7, 27, 2, 1, colors.potShadow);
  drawRect(21, 27, 2, 1, colors.potShadow);

  // 2. Draw the Tree based on Level & State
  const leavesColor = state.isDry
    ? { dark: colors.leavesDryDark, med: colors.leavesDryMed, light: colors.leavesDryLight }
    : { dark: colors.leavesDark, med: colors.leavesMed, light: colors.leavesLight };

  if (state.level === 0) {
    // LEVEL 0: Sprout (A tiny stem and two leaves)
    // Small stem
    drawRect(14, 21, 2, 2, colors.trunk);
    drawBlock(14, 20, colors.trunkHighlight);
    // Left leaf
    drawBlock(13, 19, leavesColor.med);
    drawBlock(12, 19, leavesColor.light);
    // Right leaf
    drawBlock(16, 19, leavesColor.dark);
    drawBlock(17, 18, leavesColor.med);
  } 
  else if (state.level === 1) {
    // LEVEL 1: Sapling (A straight trunk and small canopy)
    // Trunk
    drawRect(14, 17, 2, 6, colors.trunk);
    drawRect(14, 17, 1, 4, colors.trunkHighlight);
    
    // Foliage
    drawRect(12, 14, 6, 3, leavesColor.dark);
    drawRect(13, 13, 4, 3, leavesColor.med);
    drawRect(14, 12, 2, 2, leavesColor.light);
    drawBlock(12, 15, leavesColor.light);
    drawBlock(17, 15, leavesColor.med);
  }
  else if (state.level === 2) {
    // LEVEL 2: Curved growing tree
    // Curved Trunk
    drawRect(14, 20, 2, 3, colors.trunk);
    drawRect(14, 20, 1, 2, colors.trunkHighlight);
    drawRect(13, 17, 2, 3, colors.trunk);
    drawBlock(13, 18, colors.trunkHighlight);
    drawRect(12, 15, 2, 2, colors.trunk);
    drawBlock(12, 15, colors.trunkHighlight);

    // Left branch
    drawBlock(11, 18, colors.trunk);
    // Left Foliage
    drawRect(8, 16, 4, 2, leavesColor.dark);
    drawRect(9, 15, 3, 2, leavesColor.med);
    drawBlock(10, 14, leavesColor.light);

    // Top Foliage
    drawRect(11, 12, 5, 3, leavesColor.dark);
    drawRect(12, 11, 4, 2, leavesColor.med);
    drawRect(13, 10, 2, 2, leavesColor.light);
  }
  else if (state.level >= 3) {
    // LEVEL 3 & 4: Mature winding Bonsai
    // Winding Trunk
    drawRect(14, 20, 2, 3, colors.trunk);
    drawRect(14, 20, 1, 2, colors.trunkHighlight);
    
    // First bend
    drawRect(13, 18, 2, 2, colors.trunk);
    drawBlock(13, 19, colors.trunkHighlight);
    
    // Second bend to the left
    drawRect(11, 16, 3, 2, colors.trunk);
    drawBlock(11, 16, colors.trunkHighlight);
    drawBlock(12, 16, colors.trunkHighlight);
    
    // Winding up and right
    drawRect(12, 14, 2, 2, colors.trunk);
    drawBlock(12, 14, colors.trunkHighlight);
    drawRect(13, 12, 2, 2, colors.trunk);
    drawBlock(13, 12, colors.trunkHighlight);

    // Left Branch & Foliage
    drawRect(9, 17, 2, 1, colors.trunk);
    drawRect(7, 15, 4, 2, leavesColor.dark);
    drawRect(8, 14, 3, 2, leavesColor.med);
    drawBlock(9, 13, leavesColor.light);

    // Right Branch & Foliage
    drawRect(14, 15, 3, 1, colors.trunk);
    drawRect(16, 13, 5, 2, leavesColor.dark);
    drawRect(17, 12, 4, 2, leavesColor.med);
    drawBlock(18, 11, leavesColor.light);

    // Top Foliage
    drawRect(11, 9, 6, 3, leavesColor.dark);
    drawRect(12, 8, 4, 2, leavesColor.med);
    drawRect(13, 7, 2, 2, leavesColor.light);

    // LEVEL 4 special: Flowers
    if (state.level === 4 && !state.isDry) {
      // Top foliage flowers
      drawBlock(12, 9, colors.flowerPink);
      drawBlock(15, 8, colors.flowerWhite);
      drawBlock(13, 10, colors.flowerPink);
      // Left foliage flowers
      drawBlock(8, 15, colors.flowerWhite);
      drawBlock(10, 14, colors.flowerPink);
      // Right foliage flowers
      drawBlock(18, 13, colors.flowerPink);
      drawBlock(20, 12, colors.flowerWhite);
    }
  }

  // Generate pixels representation in XML
  const renderPixels = pixels
    .map(
      (p) =>
        `<rect x="${p.x * pixelSize + xOffset}" y="${p.y * pixelSize + yOffset}" width="${pixelSize}" height="${pixelSize}" fill="${p.color}" />`
    )
    .join("\n    ");

  // Calculate EXP percentage
  const xpPercent = Math.min(100, Math.floor((state.xp / state.maxXp) * 100));
  const expBarWidth = 120;
  const expFilledWidth = Math.floor((xpPercent / 100) * expBarWidth);

  // Growth Level name
  const levelNames = ["种子 (Sprout)", "幼苗 (Sapling)", "成长中 (Growing)", "成熟盆景 (Bonsai)", "繁花似锦 (Blooming)"];
  const currentLevelName = state.isDry ? "缺水休眠 (Dormant)" : levelNames[state.level] || "未知";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <style>
    .card {
      fill: none;
    }
    .text-title {
      font-family: 'Courier New', Courier, monospace, sans-serif;
      font-size: 14px;
      font-weight: bold;
    }
    .text-sub {
      font-family: 'Courier New', Courier, monospace, sans-serif;
      font-size: 11px;
    }
    .bg-grid {
      stroke-width: 1;
    }
    .border-frame {
      fill: none;
      stroke-width: 1.5;
    }
    @media (prefers-color-scheme: dark) {
      .text-title { fill: #f3f4f6; }
      .text-sub { fill: #9ca3af; }
      .bg-grid { stroke: rgba(255, 255, 255, 0.05); }
      .border-frame { stroke: rgba(255, 255, 255, 0.15); }
      .bar-bg { fill: #374151; }
      .bar-fill { fill: #10b981; }
    }
    @media (prefers-color-scheme: light) {
      .text-title { fill: #111827; }
      .text-sub { fill: #4b5563; }
      .bg-grid { stroke: rgba(0, 0, 0, 0.05); }
      .border-frame { stroke: rgba(0, 0, 0, 0.15); }
      .bar-bg { fill: #e5e7eb; }
      .bar-fill { fill: #059669; }
    }
  </style>

  <!-- Card Background & Border -->
  <rect class="card" width="100%" height="100%" rx="8" />
  <rect class="border-frame" x="4" y="4" width="${width - 8}" height="${height - 8}" rx="6" />

  <!-- Grid lines (Archive Style) -->
  <g class="bg-grid">
    <!-- Vertical lines -->
    ${Array.from({ length: Math.floor(width / 20) })
      .map((_, i) => `<line x1="${(i + 1) * 20}" y1="4" x2="${(i + 1) * 20}" y2="${height - 4}" />`)
      .join("")}
    <!-- Horizontal lines -->
    ${Array.from({ length: Math.floor(height / 20) })
      .map((_, i) => `<line x1="4" y1="${(i + 1) * 20}" x2="${width - 4}" y2="${(i + 1) * 20}" />`)
      .join("")}
  </g>

  <!-- Pixel Art Tree -->
  <g>
    ${renderPixels}
  </g>

  <!-- Title & Info Text -->
  <text x="20" y="32" class="text-title">🌱 @${state.username}'s CyberBonsai</text>
  
  <text x="20" y="280" class="text-sub">状态: ${currentLevelName}</text>
  <text x="20" y="296" class="text-sub">14天 Commits: ${state.commitCount}</text>
  
  <!-- EXP Bar -->
  <text x="20" y="318" class="text-sub">EXP</text>
  <rect x="50" y="309" width="${expBarWidth}" height="10" rx="2" class="bar-bg" />
  <rect x="50" y="309" width="${expFilledWidth}" height="10" rx="2" class="bar-fill" />
  <text x="180" y="318" class="text-sub">${xpPercent}%</text>

  <!-- Footer Timestamp -->
  <text x="${width - 20}" y="320" class="text-sub" text-anchor="end" fill="${colors.textMuted}" opacity="0.6" style="font-size: 8px;">
    更新于: ${state.lastUpdated.substring(0, 10)}
  </text>
</svg>`;
}
