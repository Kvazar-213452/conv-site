// ── HTML Formatter utils ───────────────────────────────────

const VOID_ELEMENTS = new Set([
  "area","base","br","col","embed","hr","img","input","link",
  "meta","param","source","track","wbr",
]);
const INLINE_ELEMENTS = new Set([
  "a","abbr","b","bdo","br","cite","code","dfn","em","i","img","kbd",
  "label","mark","q","s","samp","small","span","strong","sub","sup","time","u","var",
]);
const PRESERVE_TAGS = new Set(["pre", "textarea", "script", "style"]);

type Token =
  | { kind: "doctype"; raw: string }
  | { kind: "comment"; raw: string }
  | { kind: "open";    name: string; raw: string }
  | { kind: "close";   name: string; raw: string }
  | { kind: "void";    name: string; raw: string }
  | { kind: "preserved"; name: string; raw: string }
  | { kind: "text";    raw: string };

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < input.length) {
    if (input.startsWith("<!--", i)) {
      const end = input.indexOf("-->", i + 4);
      const stop = end < 0 ? input.length : end + 3;
      tokens.push({ kind: "comment", raw: input.slice(i, stop) });
      i = stop; continue;
    }
    if (input.toLowerCase().startsWith("<!doctype", i)) {
      const end = input.indexOf(">", i);
      const stop = end < 0 ? input.length : end + 1;
      tokens.push({ kind: "doctype", raw: input.slice(i, stop) });
      i = stop; continue;
    }
    if (input[i] === "<") {
      const close = input[i + 1] === "/";
      const end = input.indexOf(">", i);
      if (end < 0) { tokens.push({ kind: "text", raw: input.slice(i) }); break; }
      const raw = input.slice(i, end + 1);
      const nameMatch = raw.match(/^<\/?\s*([A-Za-z][A-Za-z0-9-]*)/);
      const name = nameMatch ? nameMatch[1].toLowerCase() : "";

      if (close) {
        tokens.push({ kind: "close", name, raw });
        i = end + 1; continue;
      }
      if (VOID_ELEMENTS.has(name) || raw.endsWith("/>")) {
        tokens.push({ kind: "void", name, raw });
        i = end + 1; continue;
      }
      if (PRESERVE_TAGS.has(name)) {
        const closeIdx = input.toLowerCase().indexOf(`</${name}`, end + 1);
        const stop = closeIdx < 0 ? input.length : input.indexOf(">", closeIdx) + 1;
        tokens.push({ kind: "preserved", name, raw: input.slice(i, stop) });
        i = stop; continue;
      }
      tokens.push({ kind: "open", name, raw });
      i = end + 1; continue;
    }
    const nextTag = input.indexOf("<", i);
    const stop = nextTag < 0 ? input.length : nextTag;
    const text = input.slice(i, stop);
    if (text.trim()) tokens.push({ kind: "text", raw: text.trim() });
    i = stop;
  }
  return tokens;
}

export function formatHtml(input: string, indent = "  "): string {
  const tokens = tokenize(input);
  const out: string[] = [];
  let depth = 0;

  const push = (line: string) => out.push(indent.repeat(depth) + line);

  for (const t of tokens) {
    switch (t.kind) {
      case "doctype":
      case "comment":
      case "void":
        push(t.raw.trim()); break;
      case "preserved":
        // keep inner content verbatim
        push(t.raw.trim()); break;
      case "open":
        push(t.raw.trim());
        if (!INLINE_ELEMENTS.has(t.name)) depth++;
        break;
      case "close":
        if (!INLINE_ELEMENTS.has(t.name)) depth = Math.max(0, depth - 1);
        push(t.raw.trim());
        break;
      case "text":
        push(t.raw.replace(/\s+/g, " "));
        break;
    }
  }
  return out.join("\n");
}
