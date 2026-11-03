// ── JavaScript Formatter utils ─────────────────────────────
// Brace-depth re-indenter. Preserves literals and comments.
// Not an AST-based formatter — for strict Prettier output use Prettier.

export function formatJs(input: string, indent = "  "): string {
  const PH = "\u0000";
  const preserved: string[] = [];

  // Protect strings, templates, regex-ish, comments.
  let src = input
    .replace(/\/\*[\s\S]*?\*\//g, (m) => `${PH}${preserved.push(m) - 1}${PH}`)
    .replace(/\/\/[^\n]*/g, (m) => `${PH}${preserved.push(m) - 1}${PH}`)
    .replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`/g,
      (m) => `${PH}${preserved.push(m) - 1}${PH}`);

  const out: string[] = [];
  let depth = 0;
  let buf = "";
  const flush = () => {
    const line = buf.trim();
    if (line) out.push(indent.repeat(depth) + line);
    buf = "";
  };

  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
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
      flush();
    } else {
      buf += ch;
    }
  }
  flush();

  return out.join("\n").replace(new RegExp(`${PH}(\\d+)${PH}`, "g"), (_, i) => preserved[Number(i)]);
}
