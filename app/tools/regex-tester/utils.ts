// ── Regex Tester utils ─────────────────────────────────────

export type RegexMatch = {
  index: number;
  length: number;
  match: string;
  groups: string[];
  namedGroups: Record<string, string>;
};

export const ALLOWED_FLAGS = "gimsuy";

export function validateFlags(flags: string): string {
  const seen = new Set<string>();
  for (const f of flags) {
    if (!ALLOWED_FLAGS.includes(f)) {
      throw new Error(`Unknown flag "${f}". Allowed: ${ALLOWED_FLAGS}`);
    }
    if (seen.has(f)) {
      throw new Error(`Duplicate flag "${f}"`);
    }
    seen.add(f);
  }
  return flags;
}

export function findMatches(
  pattern: string,
  flags: string,
  text: string,
): RegexMatch[] {
  const effectiveFlags = flags.includes("g") ? flags : flags + "g";
  validateFlags(effectiveFlags);

  const regex = new RegExp(pattern, effectiveFlags);
  const results: RegexMatch[] = [];
  let last = -1;

  for (const m of text.matchAll(regex)) {
    if (m.index === undefined) continue;
    if (m[0] === "" && m.index === last) break;
    last = m.index;
    results.push({
      index: m.index,
      length: m[0].length,
      match: m[0],
      groups: m.slice(1),
      namedGroups: { ...(m.groups ?? {}) },
    });
    if (results.length > 1000) break;
  }

  return results;
}

export type HighlightSegment =
  | { kind: "text"; value: string }
  | { kind: "match"; value: string; index: number };

export function highlightMatches(text: string, matches: RegexMatch[]): HighlightSegment[] {
  if (!matches.length) return [{ kind: "text", value: text }];
  const segments: HighlightSegment[] = [];
  let cursor = 0;
  matches.forEach((m, i) => {
    if (m.index > cursor) {
      segments.push({ kind: "text", value: text.slice(cursor, m.index) });
    }
    segments.push({ kind: "match", value: m.match, index: i });
    cursor = m.index + Math.max(m.length, 1);
  });
  if (cursor < text.length) {
    segments.push({ kind: "text", value: text.slice(cursor) });
  }
  return segments;
}
