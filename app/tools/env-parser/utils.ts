// ── .env Parser & Serializer ──────────────────────────────────
// Follows dotenv spec: https://github.com/motdotla/dotenv#rules

export interface EnvEntry {
  type: "pair" | "comment" | "blank";
  key?: string;
  value?: string;
  raw?: string;       // original raw value (with quotes)
  comment?: string;   // inline comment
  line: number;
}

export interface ParseResult {
  entries: EnvEntry[];
  errors: { line: number; message: string }[];
}

// ── Parser ────────────────────────────────────────────────────

export function parseEnv(src: string): ParseResult {
  const lines = src.split("\n");
  const entries: EnvEntry[] = [];
  const errors: { line: number; message: string }[] = [];

  for (let i = 0; i < lines.length; i++) {
    const lineNum = i + 1;
    const line = lines[i];
    const trimmed = line.trim();

    // Blank line
    if (trimmed === "") {
      entries.push({ type: "blank", line: lineNum });
      continue;
    }

    // Full-line comment
    if (trimmed.startsWith("#")) {
      entries.push({ type: "comment", raw: trimmed, line: lineNum });
      continue;
    }

    // KEY=VALUE
    const eqIdx = line.indexOf("=");
    if (eqIdx === -1) {
      errors.push({ line: lineNum, message: `Missing "=" in: "${line}"` });
      continue;
    }

    const rawKey = line.slice(0, eqIdx).trim();

    // Validate key: letters, digits, underscore; optional "export " prefix
    const cleanKey = rawKey.replace(/^export\s+/, "");
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(cleanKey)) {
      errors.push({ line: lineNum, message: `Invalid key name: "${cleanKey}"` });
      continue;
    }

    const rawValue = line.slice(eqIdx + 1); // everything after =
    const { value, comment } = parseValue(rawValue);

    entries.push({
      type: "pair",
      key: cleanKey,
      value,
      raw: rawValue.trimEnd(),
      comment,
      line: lineNum,
    });
  }

  return { entries, errors };
}

/** Parse a raw .env value — handles quoted strings, inline comments */
function parseValue(raw: string): { value: string; comment?: string } {
  const trimmed = raw.trim();

  // Double-quoted: "value" — interprets escape sequences
  if (trimmed.startsWith('"')) {
    const end = findClosingQuote(trimmed, '"');
    const inner = trimmed.slice(1, end);
    const after = trimmed.slice(end + 1).trim();
    const comment = after.startsWith("#") ? after.slice(1).trim() : undefined;
    return {
      value: inner
        .replace(/\\n/g, "\n")
        .replace(/\\r/g, "\r")
        .replace(/\\t/g, "\t")
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, "\\"),
      comment,
    };
  }

  // Single-quoted: 'value' — no escape interpretation
  if (trimmed.startsWith("'")) {
    const end = findClosingQuote(trimmed, "'");
    const inner = trimmed.slice(1, end);
    const after = trimmed.slice(end + 1).trim();
    const comment = after.startsWith("#") ? after.slice(1).trim() : undefined;
    return { value: inner, comment };
  }

  // Unquoted: strip inline comment, trim whitespace
  const hashIdx = trimmed.indexOf(" #");
  if (hashIdx !== -1) {
    return {
      value: trimmed.slice(0, hashIdx).trim(),
      comment: trimmed.slice(hashIdx + 2).trim(),
    };
  }

  return { value: trimmed };
}

function findClosingQuote(str: string, quote: string): number {
  for (let i = 1; i < str.length; i++) {
    if (str[i] === "\\" && quote === '"') { i++; continue; }
    if (str[i] === quote) return i;
  }
  return str.length; // unclosed — treat rest as value
}

// ── Serializer: EnvEntry[] → .env string ─────────────────────

export function serializeEnv(entries: EnvEntry[]): string {
  return entries.map((e) => {
    if (e.type === "blank") return "";
    if (e.type === "comment") return e.raw ?? "";
    if (e.type === "pair") {
      const needsQuotes = /[\s#"'`\\]/.test(e.value ?? "") || e.value === "";
      const quoted = needsQuotes ? `"${(e.value ?? "").replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n")}"` : (e.value ?? "");
      const inlineComment = e.comment ? ` # ${e.comment}` : "";
      return `${e.key}=${quoted}${inlineComment}`;
    }
    return "";
  }).join("\n");
}

// ── Converter: .env → JSON object ────────────────────────────

export function envToJson(src: string): string {
  const { entries, errors } = parseEnv(src);
  if (errors.length > 0) {
    throw new Error(errors.map((e) => `Line ${e.line}: ${e.message}`).join("\n"));
  }
  const obj: Record<string, string> = {};
  for (const e of entries) {
    if (e.type === "pair" && e.key !== undefined) {
      obj[e.key] = e.value ?? "";
    }
  }
  return JSON.stringify(obj, null, 2);
}

// ── Converter: JSON object → .env ────────────────────────────

export function jsonToEnv(src: string): string {
  let obj: unknown;
  try {
    obj = JSON.parse(src);
  } catch {
    throw new Error("Invalid JSON. Expected a flat key-value object.");
  }
  if (typeof obj !== "object" || obj === null || Array.isArray(obj)) {
    throw new Error("Expected a flat JSON object like { \"KEY\": \"value\" }.");
  }
  const entries: EnvEntry[] = [
    { type: "comment", raw: `# Generated: ${new Date().toISOString()}`, line: 0 },
    { type: "blank", line: 0 },
  ];
  for (const [key, val] of Object.entries(obj as Record<string, unknown>)) {
    entries.push({
      type: "pair",
      key,
      value: String(val ?? ""),
      line: 0,
    });
  }
  return serializeEnv(entries);
}