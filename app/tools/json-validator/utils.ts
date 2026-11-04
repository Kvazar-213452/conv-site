// ── JSON Validator utils ──────────────────────────

export type ValidationResult = {
  valid: boolean;
  error?: string;
  line?: number;
  column?: number;
  parsed?: unknown;
  stats: {
    keys: number;
    values: number;
    depth: number;
    arrays: number;
    objects: number;
    strings: number;
    numbers: number;
    booleans: number;
    nulls: number;
    bytes: number;
  };
};

function countStats(val: unknown, depth = 0): ValidationResult["stats"] {
  const s: ValidationResult["stats"] = { keys: 0, values: 0, depth, arrays: 0, objects: 0, strings: 0, numbers: 0, booleans: 0, nulls: 0, bytes: 0 };
  if (val === null) { s.nulls = 1; s.values = 1; return s; }
  if (typeof val === "string") { s.strings = 1; s.values = 1; return s; }
  if (typeof val === "number") { s.numbers = 1; s.values = 1; return s; }
  if (typeof val === "boolean") { s.booleans = 1; s.values = 1; return s; }
  if (Array.isArray(val)) {
    s.arrays = 1;
    for (const item of val) {
      const c = countStats(item, depth + 1);
      s.keys += c.keys; s.values += c.values; s.depth = Math.max(s.depth, c.depth);
      s.arrays += c.arrays; s.objects += c.objects; s.strings += c.strings;
      s.numbers += c.numbers; s.booleans += c.booleans; s.nulls += c.nulls;
    }
    return s;
  }
  if (typeof val === "object") {
    s.objects = 1;
    const entries = Object.entries(val as Record<string, unknown>);
    s.keys = entries.length;
    for (const [, v] of entries) {
      const c = countStats(v, depth + 1);
      s.keys += c.keys; s.values += c.values; s.depth = Math.max(s.depth, c.depth);
      s.arrays += c.arrays; s.objects += c.objects; s.strings += c.strings;
      s.numbers += c.numbers; s.booleans += c.booleans; s.nulls += c.nulls;
    }
    return s;
  }
  return s;
}

function parseErrorPosition(msg: string): { line: number; column: number } | null {
  const posMatch = msg.match(/position\s+(\d+)/i);
  if (!posMatch) return null;
  return { line: 0, column: parseInt(posMatch[1], 10) };
}

export function validateJson(input: string): ValidationResult {
  const bytes = new TextEncoder().encode(input).length;
  try {
    const parsed = JSON.parse(input);
    const stats = countStats(parsed);
    stats.bytes = bytes;
    return { valid: true, parsed, stats };
  } catch (e) {
    const msg = (e as Error).message;
    const pos = parseErrorPosition(msg);
    return {
      valid: false,
      error: msg,
      line: pos?.line,
      column: pos?.column,
      stats: { keys: 0, values: 0, depth: 0, arrays: 0, objects: 0, strings: 0, numbers: 0, booleans: 0, nulls: 0, bytes },
    };
  }
}

export const EXAMPLE_VALID = `{
  "name": "my-app",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.2.0",
    "next": "14.0.0"
  },
  "scripts": {
    "dev": "next dev",
    "build": "next build"
  },
  "private": true
}`;

export const EXAMPLE_INVALID = `{
  "name": "my-app",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.2.0",
    "next": "14.0.0",
  },
  "private": true,
}`;
