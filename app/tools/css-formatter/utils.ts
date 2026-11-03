// ── CSS Formatter utils ────────────────────────────────────
// Simple brace-depth re-indenter that handles rules, nested at-rules,
// and selector lists. Not a full CSS parser — media queries and nested
// Sass-like rules work; complex interpolations may not.

export function formatCss(input: string, indent = "  "): string {
  const out: string[] = [];
  let depth = 0;
  let buf = "";
  const flush = () => {
    const line = buf.trim();
    if (line) out.push(indent.repeat(depth) + line);
    buf = "";
  };

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (ch === "{") {
      buf += " {";
      flush();
      depth++;
    } else if (ch === "}") {
      flush();
      depth = Math.max(0, depth - 1);
      out.push(indent.repeat(depth) + "}");
    } else if (ch === ";") {
      buf += ";";
      flush();
    } else if (ch === "\n") {
      // Skip inherited newlines — we rebuild them from brace structure.
    } else {
      buf += ch;
    }
  }
  flush();

  return out
    .join("\n")
    .replace(/\s*:\s*/g, ": ")
    .replace(/\s*,\s*/g, ", ")
    .replace(/\n{2,}/g, "\n");
}
