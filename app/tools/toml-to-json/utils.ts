// ── TOML ↔ JSON converter utils ─────────────────────────────
// Minimal TOML v1.0 subset: tables, dotted keys, strings, ints,
// floats, booleans, datetimes (as strings), arrays, inline tables,
// and comments. Good enough for typical config files.

export type Json = unknown;

function stripComments(line: string): string {
  let inStr: '"' | "'" | null = null;
  let out = "";
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inStr) {
      out += ch;
      if (ch === "\\" && inStr === '"' && i + 1 < line.length) {
        out += line[++i];
        continue;
      }
      if (ch === inStr) inStr = null;
    } else {
      if (ch === "#") break;
      if (ch === '"' || ch === "'") inStr = ch;
      out += ch;
    }
  }
  return out.trimEnd();
}

function parseKey(raw: string): string[] {
  const parts: string[] = [];
  let i = 0;
  while (i < raw.length) {
    while (i < raw.length && /\s/.test(raw[i])) i++;
    if (i >= raw.length) break;
    const ch = raw[i];
    if (ch === '"' || ch === "'") {
      const q = ch;
      i++;
      let buf = "";
      while (i < raw.length && raw[i] !== q) {
        if (raw[i] === "\\" && q === '"' && i + 1 < raw.length) {
          buf += unescape(raw[++i]); i++;
        } else { buf += raw[i++]; }
      }
      i++; // close quote
      parts.push(buf);
    } else {
      let buf = "";
      while (i < raw.length && /[A-Za-z0-9_\-]/.test(raw[i])) buf += raw[i++];
      if (!buf) throw new Error(`Invalid key near "${raw.slice(i, i + 10)}"`);
      parts.push(buf);
    }
    while (i < raw.length && /\s/.test(raw[i])) i++;
    if (raw[i] === ".") { i++; continue; }
    if (i < raw.length) throw new Error(`Unexpected character in key: "${raw[i]}"`);
  }
  return parts;
}

function unescape(ch: string): string {
  switch (ch) {
    case "n": return "\n";
    case "r": return "\r";
    case "t": return "\t";
    case "\\": return "\\";
    case '"': return '"';
    default: return ch;
  }
}

function parseValue(raw: string): Json {
  const s = raw.trim();
  if (s === "") throw new Error("Empty value");

  if (s === "true") return true;
  if (s === "false") return false;

  if (s[0] === '"') return parseString(s, '"');
  if (s[0] === "'") return parseString(s, "'");

  if (s[0] === "[") return parseArray(s);
  if (s[0] === "{") return parseInlineTable(s);

  if (/^[+-]?\d{4}-\d{2}-\d{2}/.test(s)) return s;

  const num = s.replace(/_/g, "");
  if (/^[+-]?(0|[1-9]\d*)$/.test(num)) return Number(num);
  if (/^0x[0-9a-fA-F]+$/.test(num)) return parseInt(num.slice(2), 16);
  if (/^0o[0-7]+$/.test(num)) return parseInt(num.slice(2), 8);
  if (/^0b[01]+$/.test(num)) return parseInt(num.slice(2), 2);
  if (/^[+-]?(\d+\.\d+|\d+(\.\d+)?[eE][+-]?\d+|inf|nan)$/.test(num)) return Number(num);

  throw new Error(`Cannot parse value: ${s}`);
}

function parseString(s: string, q: string): string {
  let out = "";
  let i = 1;
  while (i < s.length && s[i] !== q) {
    if (s[i] === "\\" && q === '"' && i + 1 < s.length) {
      out += unescape(s[++i]); i++;
    } else {
      out += s[i++];
    }
  }
  return out;
}

function splitTop(s: string, open: string, close: string): string[] {
  const inner = s.slice(1, -1);
  const parts: string[] = [];
  let depth = 0, inStr: string | null = null, buf = "";
  for (let i = 0; i < inner.length; i++) {
    const ch = inner[i];
    if (inStr) {
      buf += ch;
      if (ch === "\\" && inStr === '"' && i + 1 < inner.length) { buf += inner[++i]; continue; }
      if (ch === inStr) inStr = null;
      continue;
    }
    if (ch === '"' || ch === "'") { inStr = ch; buf += ch; continue; }
    if (ch === open) depth++;
    if (ch === close) depth--;
    if (ch === "," && depth === 0) { parts.push(buf); buf = ""; continue; }
    buf += ch;
  }
  if (buf.trim()) parts.push(buf);
  return parts.map((p) => p.trim());
}

function parseArray(s: string): Json[] {
  if (!s.endsWith("]")) throw new Error("Unterminated array");
  const parts = splitTop(s, "[", "]");
  return parts.map(parseValue);
}

function parseInlineTable(s: string): Record<string, Json> {
  if (!s.endsWith("}")) throw new Error("Unterminated inline table");
  const parts = splitTop(s, "{", "}");
  const obj: Record<string, Json> = {};
  for (const kv of parts) {
    const eq = findTopLevelEq(kv);
    if (eq < 0) throw new Error(`Invalid inline table entry: ${kv}`);
    const keyParts = parseKey(kv.slice(0, eq));
    assignPath(obj, keyParts, parseValue(kv.slice(eq + 1)));
  }
  return obj;
}

function findTopLevelEq(line: string): number {
  let inStr: string | null = null;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inStr) {
      if (ch === "\\" && inStr === '"' && i + 1 < line.length) { i++; continue; }
      if (ch === inStr) inStr = null;
      continue;
    }
    if (ch === '"' || ch === "'") { inStr = ch; continue; }
    if (ch === "=") return i;
  }
  return -1;
}

function assignPath(root: Record<string, Json>, keys: string[], value: Json): void {
  let cur: Record<string, Json> = root;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    if (!(k in cur) || typeof cur[k] !== "object" || cur[k] === null || Array.isArray(cur[k])) {
      cur[k] = {};
    }
    cur = cur[k] as Record<string, Json>;
  }
  cur[keys[keys.length - 1]] = value;
}

export function tomlToJson(input: string): Record<string, Json> {
  const root: Record<string, Json> = {};
  let current: Record<string, Json> = root;
  let currentIsArrayTable = false;

  const lines = input.split("\n");
  for (let i = 0; i < lines.length; i++) {
    let line = stripComments(lines[i]).trim();
    if (!line) continue;

    const arrTable = line.match(/^\[\[(.+)\]\]$/);
    const table = !arrTable && line.match(/^\[(.+)\]$/);

    if (arrTable) {
      const keys = parseKey(arrTable[1].trim());
      let obj: Record<string, Json> = root;
      for (let j = 0; j < keys.length - 1; j++) {
        const k = keys[j];
        if (!(k in obj) || typeof obj[k] !== "object" || obj[k] === null || Array.isArray(obj[k])) {
          obj[k] = {};
        }
        obj = obj[k] as Record<string, Json>;
      }
      const last = keys[keys.length - 1];
      if (!(last in obj)) obj[last] = [];
      if (!Array.isArray(obj[last])) throw new Error(`Key "${last}" is not an array`);
      const entry: Record<string, Json> = {};
      (obj[last] as Json[]).push(entry);
      current = entry;
      currentIsArrayTable = true;
      continue;
    }

    if (table) {
      const keys = parseKey(table[1].trim());
      let obj: Record<string, Json> = root;
      for (let j = 0; j < keys.length - 1; j++) {
        const k = keys[j];
        if (!(k in obj) || typeof obj[k] !== "object" || obj[k] === null || Array.isArray(obj[k])) {
          obj[k] = {};
        }
        obj = obj[k] as Record<string, Json>;
      }
      const last = keys[keys.length - 1];
      if (!(last in obj)) obj[last] = {};
      current = obj[last] as Record<string, Json>;
      currentIsArrayTable = false;
      continue;
    }

    // key = value (possibly spanning lines for arrays/inline tables with open bracket)
    const eq = findTopLevelEq(line);
    if (eq < 0) throw new Error(`Line ${i + 1}: expected key = value`);
    const keyParts = parseKey(line.slice(0, eq).trim());
    let rawValue = line.slice(eq + 1).trim();

    if (rawValue.startsWith("[") || rawValue.startsWith("{")) {
      const open = rawValue[0];
      const close = open === "[" ? "]" : "}";
      let depth = 0;
      let inStr: string | null = null;
      let combined = "";
      let done = false;
      let scanIdx = 0;
      let currentLine = rawValue;
      let lineOffset = 0;
      while (!done) {
        for (let s = 0; s < currentLine.length; s++) {
          const ch = currentLine[s];
          combined += ch;
          if (inStr) {
            if (ch === "\\" && inStr === '"' && s + 1 < currentLine.length) {
              combined += currentLine[++s]; continue;
            }
            if (ch === inStr) inStr = null;
            continue;
          }
          if (ch === '"' || ch === "'") { inStr = ch; continue; }
          if (ch === open)  depth++;
          if (ch === close) depth--;
          if (depth === 0) { done = true; break; }
        }
        if (!done) {
          i++;
          if (i >= lines.length) throw new Error("Unterminated multi-line structure");
          combined += "\n";
          currentLine = stripComments(lines[i]);
          lineOffset++;
        }
        scanIdx++;
        if (scanIdx > 10000) break;
      }
      rawValue = combined;
    }

    assignPath(current, keyParts, parseValue(rawValue));
    void currentIsArrayTable;
  }

  return root;
}

export function jsonToToml(obj: unknown, prefix = ""): string {
  if (typeof obj !== "object" || obj === null || Array.isArray(obj)) {
    throw new Error("Top-level JSON must be an object");
  }
  const root = obj as Record<string, Json>;
  const scalars: string[] = [];
  const tables: string[] = [];
  const arrayTables: string[] = [];

  for (const key of Object.keys(root)) {
    const val = root[key];
    const path = prefix ? `${prefix}.${quoteKey(key)}` : quoteKey(key);

    if (Array.isArray(val) && val.length > 0 && val.every(isPlainObject)) {
      for (const entry of val as Record<string, Json>[]) {
        arrayTables.push(`[[${path}]]\n${emitTableBody(entry)}`);
      }
    } else if (isPlainObject(val)) {
      tables.push(`[${path}]\n${emitTableBody(val as Record<string, Json>)}`);
      const nested = jsonToToml(val, path);
      if (nested && !nested.startsWith("[")) {
        // tables already included; subtable emission handled recursively below
      }
    } else {
      scalars.push(`${quoteKey(key)} = ${emitValue(val)}`);
    }
  }

  const parts: string[] = [];
  if (scalars.length) parts.push(scalars.join("\n"));
  if (tables.length)  parts.push(tables.join("\n\n"));
  if (arrayTables.length) parts.push(arrayTables.join("\n\n"));
  return parts.join("\n\n");
}

function isPlainObject(v: Json): v is Record<string, Json> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function emitTableBody(obj: Record<string, Json>): string {
  const lines: string[] = [];
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (isPlainObject(val) || (Array.isArray(val) && val.length > 0 && val.every(isPlainObject))) continue;
    lines.push(`${quoteKey(key)} = ${emitValue(val)}`);
  }
  return lines.join("\n");
}

function quoteKey(key: string): string {
  return /^[A-Za-z0-9_\-]+$/.test(key) ? key : JSON.stringify(key);
}

function emitValue(v: Json): string {
  if (v === null) return `""`;
  if (typeof v === "string") return JSON.stringify(v);
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (Array.isArray(v)) return `[${v.map(emitValue).join(", ")}]`;
  if (isPlainObject(v)) {
    const entries = Object.entries(v).map(([k, vv]) => `${quoteKey(k)} = ${emitValue(vv as Json)}`);
    return `{ ${entries.join(", ")} }`;
  }
  return JSON.stringify(v);
}
