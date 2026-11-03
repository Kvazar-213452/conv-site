// ── Line Sorter utils ──────────────────────────────────────

export type Order = "asc" | "desc" | "shuffle" | "reverse";
export type Compare = "alpha" | "natural" | "length" | "numeric";

const naturalCollator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });

export function sortLines(
  input: string,
  order: Order,
  compare: Compare,
  dedupe: boolean,
  caseInsensitive: boolean,
): string {
  let lines = input.split("\n");

  if (order === "reverse") {
    lines.reverse();
  } else if (order === "shuffle") {
    for (let i = lines.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [lines[i], lines[j]] = [lines[j], lines[i]];
    }
  } else {
    const cmp = (a: string, b: string): number => {
      const x = caseInsensitive ? a.toLowerCase() : a;
      const y = caseInsensitive ? b.toLowerCase() : b;
      switch (compare) {
        case "alpha":   return x < y ? -1 : x > y ? 1 : 0;
        case "natural": return naturalCollator.compare(x, y);
        case "length":  return x.length - y.length;
        case "numeric": return (parseFloat(x) || 0) - (parseFloat(y) || 0);
      }
    };
    lines.sort((a, b) => (order === "asc" ? 1 : -1) * cmp(a, b));
  }

  if (dedupe) {
    const seen = new Set<string>();
    lines = lines.filter((l) => {
      const key = caseInsensitive ? l.toLowerCase() : l;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  return lines.join("\n");
}
