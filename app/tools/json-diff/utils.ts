// ── JSON Diff utils ─────────────────────────────────────────

export type DiffKind = "add" | "remove" | "change" | "equal";

export type JsonDiffEntry = {
  path: string;
  kind: DiffKind;
  before?: unknown;
  after?: unknown;
};

export function parseJson(input: string, label: "A" | "B"): unknown {
  try {
    return JSON.parse(input);
  } catch (e) {
    throw new Error(`Input ${label} is not valid JSON: ${(e as Error).message}`);
  }
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function equals(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (!equals(a[i], b[i])) return false;
    return true;
  }
  if (isObject(a) && isObject(b)) {
    const ka = Object.keys(a);
    const kb = Object.keys(b);
    if (ka.length !== kb.length) return false;
    for (const k of ka) if (!equals(a[k], b[k])) return false;
    return true;
  }
  return false;
}

function joinPath(base: string, key: string | number): string {
  if (typeof key === "number") return `${base}[${key}]`;
  if (!base) return key;
  if (/^[A-Za-z_$][\w$]*$/.test(key)) return `${base}.${key}`;
  return `${base}[${JSON.stringify(key)}]`;
}

export function diffJson(a: unknown, b: unknown): JsonDiffEntry[] {
  const out: JsonDiffEntry[] = [];
  walk("", a, b, out);
  return out;
}

function walk(path: string, a: unknown, b: unknown, out: JsonDiffEntry[]): void {
  if (equals(a, b)) {
    out.push({ path: path || "(root)", kind: "equal", before: a, after: b });
    return;
  }

  if (isObject(a) && isObject(b)) {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const key of keys) {
      const sub = joinPath(path, key);
      if (!(key in a)) {
        out.push({ path: sub, kind: "add", after: b[key] });
      } else if (!(key in b)) {
        out.push({ path: sub, kind: "remove", before: a[key] });
      } else {
        walk(sub, a[key], b[key], out);
      }
    }
    return;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    const max = Math.max(a.length, b.length);
    for (let i = 0; i < max; i++) {
      const sub = joinPath(path, i);
      if (i >= a.length) out.push({ path: sub, kind: "add",    after: b[i] });
      else if (i >= b.length) out.push({ path: sub, kind: "remove", before: a[i] });
      else walk(sub, a[i], b[i], out);
    }
    return;
  }

  out.push({ path: path || "(root)", kind: "change", before: a, after: b });
}

export function formatValue(v: unknown): string {
  if (v === undefined) return "undefined";
  return JSON.stringify(v);
}

export type JsonDiffStats = {
  added: number;
  removed: number;
  changed: number;
  equal: number;
};

export function diffStats(entries: JsonDiffEntry[]): JsonDiffStats {
  const stats: JsonDiffStats = { added: 0, removed: 0, changed: 0, equal: 0 };
  for (const e of entries) {
    if (e.kind === "add") stats.added++;
    else if (e.kind === "remove") stats.removed++;
    else if (e.kind === "change") stats.changed++;
    else stats.equal++;
  }
  return stats;
}
