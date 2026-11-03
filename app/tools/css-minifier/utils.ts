// ── CSS Minifier utils ─────────────────────────────────────

export function minifyCss(input: string): string {
  return input
    .replace(/\/\*[\s\S]*?\*\//g, "")        // comments
    .replace(/\s*([{};:,>+~])\s*/g, "$1")    // whitespace around tokens
    .replace(/;}/g, "}")                     // last semicolon
    .replace(/\s+/g, " ")
    .replace(/#([0-9a-fA-F])\1([0-9a-fA-F])\2([0-9a-fA-F])\3\b/g, "#$1$2$3") // short hex
    .replace(/\b0(\.\d)/g, "$1")             // 0.5 → .5
    .replace(/\b0px\b/g, "0")                // 0px → 0
    .replace(/\b0em\b/g, "0")
    .replace(/\b0rem\b/g, "0")
    .trim();
}
