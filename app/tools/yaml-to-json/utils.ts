// ── YAML to JSON utils ─────────────────────────────────────
// Minimal YAML 1.2 subset: scalars (string, int, float, bool, null),
// block maps, block sequences, flow sequences [a, b], flow maps {a: b},
// comments (#), and nested indentation. Not a full spec implementation
// but enough for typical config files.

type Node = unknown;

function parseScalar(raw: string): Node {
  const s = raw.trim();
  if (s === "" || s === "~" || s === "null" || s === "Null" || s === "NULL") return null;
  if (s === "true" || s === "True" || s === "TRUE") return true;
  if (s === "false" || s === "False" || s === "FALSE") return false;

  if (s[0] === '"' && s[s.length - 1] === '"') {
    return s.slice(1, -1).replace(/\\n/g, "\n").replace(/\\t/g, "\t").replace(/\\"/g, '"').replace(/\\\\/g, "\\");
  }
  if (s[0] === "'" && s[s.length - 1] === "'") {
    return s.slice(1, -1).replace(/''/g, "'");
  }

  if (/^-?\d+$/.test(s)) {
    const n = Number(s);
    if (Number.isSafeInteger(n)) return n;
  }
  if (/^-?\d*\.\d+([eE][+-]?\d+)?$/.test(s)) return Number(s);
  if (/^-?\d+[eE][+-]?\d+$/.test(s))         return Number(s);
  if (s === ".inf" || s === "+.inf") return Infinity;
  if (s === "-.inf") return -Infinity;
  if (s === ".nan") return NaN;

  if (s[0] === "[") return parseFlowSeq(s);
  if (s[0] === "{") return parseFlowMap(s);

  return s;
}

function splitTop(inner: string): string[] {
  const parts: string[] = [];
  let depth = 0, inStr: string | null = null, buf = "";
  for (let i = 0; i < inner.length; i++) {
    const ch = inner[i];
    if (inStr) {
      buf += ch;
      if (ch === "\\" && i + 1 < inner.length) { buf += inner[++i]; continue; }
      if (ch === inStr) inStr = null;
      continue;
    }
    if (ch === '"' || ch === "'") { inStr = ch; buf += ch; continue; }
    if (ch === "[" || ch === "{") depth++;
    if (ch === "]" || ch === "}") depth--;
    if (ch === "," && depth === 0) { parts.push(buf); buf = ""; continue; }
    buf += ch;
  }
  if (buf.trim()) parts.push(buf);
  return parts.map((p) => p.trim());
}

function parseFlowSeq(s: string): Node[] {
  if (!s.endsWith("]")) throw new Error("Unterminated [sequence]");
  return splitTop(s.slice(1, -1)).map(parseScalar);
}

function parseFlowMap(s: string): Record<string, Node> {
  if (!s.endsWith("}")) throw new Error("Unterminated {mapping}");
  const out: Record<string, Node> = {};
  for (const kv of splitTop(s.slice(1, -1))) {
    const idx = kv.indexOf(":");
    if (idx < 0) throw new Error(`Expected key:value in flow map: ${kv}`);
    out[kv.slice(0, idx).trim()] = parseScalar(kv.slice(idx + 1));
  }
  return out;
}

function stripComment(line: string): string {
  let inStr: string | null = null;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inStr) {
      if (ch === "\\") { i++; continue; }
      if (ch === inStr) inStr = null;
      continue;
    }
    if (ch === '"' || ch === "'") inStr = ch;
    if (ch === "#" && (i === 0 || line[i - 1] === " " || line[i - 1] === "\t")) return line.slice(0, i).trimEnd();
  }
  return line;
}

type Line = { indent: number; text: string };

function tokenize(input: string): Line[] {
  return input.split("\n").map((raw) => {
    const cleaned = stripComment(raw);
    const text = cleaned.replace(/^\s+/, "");
    if (!text) return null;
    const indent = cleaned.length - text.length;
    return { indent, text };
  }).filter((l): l is Line => l !== null);
}

function parseBlock(lines: Line[], start: number, indent: number): [Node, number] {
  if (start >= lines.length) return [null, start];
  const first = lines[start];
  if (first.indent < indent) return [null, start];

  // sequence?
  if (first.text.startsWith("- ") || first.text === "-") {
    const arr: Node[] = [];
    let i = start;
    while (i < lines.length && lines[i].indent === indent && (lines[i].text.startsWith("- ") || lines[i].text === "-")) {
      const value = lines[i].text === "-" ? "" : lines[i].text.slice(2).trim();
      if (value === "" || (value.endsWith(":") && !/^".*":$/.test(value))) {
        // nested block
        if (value.endsWith(":")) {
          // inline map starting on same line
          const key = value.slice(0, -1).trim();
          const [sub, next] = parseBlock(lines, i + 1, indent + 2);
          arr.push({ [key]: sub });
          i = next;
        } else {
          const [sub, next] = parseBlock(lines, i + 1, indent + 2);
          arr.push(sub);
          i = next;
        }
      } else if (value.endsWith(":")) {
        const key = value.slice(0, -1).trim();
        const [sub, next] = parseBlock(lines, i + 1, indent + 2);
        arr.push({ [key]: sub });
        i = next;
      } else if (/^[^"'[\{]+:\s/.test(value)) {
        // "- key: value" inline map, continue reading more keys at increased indent
        const colon = value.indexOf(":");
        const k = value.slice(0, colon).trim();
        const v = value.slice(colon + 1).trim();
        const obj: Record<string, Node> = { [k]: parseScalar(v) };
        i++;
        // continue absorbing extra keys at indent + 2 as part of this list item
        while (i < lines.length && lines[i].indent === indent + 2 && !lines[i].text.startsWith("- ")) {
          const l = lines[i].text;
          const c = l.indexOf(":");
          if (c < 0) break;
          const k2 = l.slice(0, c).trim();
          const rest = l.slice(c + 1).trim();
          if (rest === "") {
            const [sub, next] = parseBlock(lines, i + 1, indent + 4);
            obj[k2] = sub;
            i = next;
          } else {
            obj[k2] = parseScalar(rest);
            i++;
          }
        }
        arr.push(obj);
      } else {
        arr.push(parseScalar(value));
        i++;
      }
    }
    return [arr, i];
  }

  // mapping
  const map: Record<string, Node> = {};
  let i = start;
  while (i < lines.length && lines[i].indent === indent) {
    const line = lines[i].text;
    const colon = findColon(line);
    if (colon < 0) throw new Error(`Expected key: value — got "${line}"`);
    const key = parseKey(line.slice(0, colon));
    const rest = line.slice(colon + 1).trim();
    if (rest === "") {
      const [sub, next] = parseBlock(lines, i + 1, indent + 2);
      map[key] = sub;
      i = next;
    } else {
      map[key] = parseScalar(rest);
      i++;
    }
  }
  return [map, i];
}

function findColon(line: string): number {
  let inStr: string | null = null, depth = 0;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inStr) {
      if (ch === "\\") { i++; continue; }
      if (ch === inStr) inStr = null;
      continue;
    }
    if (ch === '"' || ch === "'") inStr = ch;
    if (ch === "[" || ch === "{") depth++;
    if (ch === "]" || ch === "}") depth--;
    if (ch === ":" && depth === 0) return i;
  }
  return -1;
}

function parseKey(raw: string): string {
  const k = raw.trim();
  if (k.startsWith('"') && k.endsWith('"')) return k.slice(1, -1);
  if (k.startsWith("'") && k.endsWith("'")) return k.slice(1, -1);
  return k;
}

export function yamlToJson(input: string): Node {
  const lines = tokenize(input);
  if (!lines.length) return null;
  const [node] = parseBlock(lines, 0, lines[0].indent);
  return node;
}
