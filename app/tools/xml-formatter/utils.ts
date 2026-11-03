// ── XML Formatter utils ────────────────────────────────────

export function formatXml(input: string, indent = "  "): string {
  // Collapse whitespace between tags, then re-indent based on tag depth.
  let xml = input.replace(/>\s+</g, "><").trim();
  // Split at tag boundaries, keep separators.
  const tokens = xml.split(/(<[^>]+>)/).filter(Boolean);

  const out: string[] = [];
  let depth = 0;
  for (const t of tokens) {
    if (!t.startsWith("<")) {
      out.push(indent.repeat(depth) + t.trim());
      continue;
    }
    const isComment = t.startsWith("<!--");
    const isDecl    = t.startsWith("<?") || t.startsWith("<!DOCTYPE") || t.startsWith("<!doctype");
    const isSelf    = t.endsWith("/>");
    const isClose   = t.startsWith("</");
    const isOpen    = !isClose && !isSelf && !isComment && !isDecl;

    if (isClose) depth = Math.max(0, depth - 1);
    out.push(indent.repeat(depth) + t);
    if (isOpen) depth++;
  }
  return out.join("\n");
}
