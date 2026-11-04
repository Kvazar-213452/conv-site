// ── Aspect Ratio Calculator utils ─────────────────

export type RatioResult = {
  ratio: string;
  decimal: string;
  width: number;
  height: number;
  gcd: number;
};

function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

export function calculateRatio(width: number, height: number): RatioResult {
  if (width <= 0 || height <= 0) throw new Error("Width and height must be positive");
  const g = gcd(width, height);
  return {
    ratio: `${width / g}:${height / g}`,
    decimal: (width / height).toFixed(4),
    width,
    height,
    gcd: g,
  };
}

export function scaleToWidth(
  origWidth: number,
  origHeight: number,
  newWidth: number
): { width: number; height: number } {
  const ratio = origHeight / origWidth;
  return { width: newWidth, height: Math.round(newWidth * ratio) };
}

export function scaleToHeight(
  origWidth: number,
  origHeight: number,
  newHeight: number
): { width: number; height: number } {
  const ratio = origWidth / origHeight;
  return { width: Math.round(newHeight * ratio), height: newHeight };
}

export const COMMON_RATIOS = [
  { label: "16:9 (Widescreen)", width: 1920, height: 1080 },
  { label: "4:3 (Standard)", width: 1024, height: 768 },
  { label: "1:1 (Square)", width: 1080, height: 1080 },
  { label: "21:9 (Ultrawide)", width: 2560, height: 1080 },
  { label: "9:16 (Mobile Portrait)", width: 1080, height: 1920 },
  { label: "3:2 (Photo)", width: 1500, height: 1000 },
  { label: "2:3 (Portrait Photo)", width: 1000, height: 1500 },
  { label: "5:4 (Large Format)", width: 1280, height: 1024 },
];
