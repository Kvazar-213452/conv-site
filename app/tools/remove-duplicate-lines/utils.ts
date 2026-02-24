// ── Remove Duplicate Lines utils ─────────────────────────────

export type DedupeOptions = {
  caseSensitive: boolean;
  trimLines: boolean;
  removeEmpty: boolean;
  keepOrder: "first" | "last";
  sortResult: boolean;
};

export type DedupeResult = {
  output: string;
  originalCount: number;
  uniqueCount: number;
  removedCount: number;
};

export const DEFAULT_OPTIONS: DedupeOptions = {
  caseSensitive: true,
  trimLines: true,
  removeEmpty: false,
  keepOrder: "first",
  sortResult: false,
};

export function dedupeLines(text: string, opts: DedupeOptions): DedupeResult {
  const raw = text.split("\n");
  const originalCount = raw.length;

  const processed = raw.map((line) => (opts.trimLines ? line.trim() : line));

  const seen = new Map<string, number>(); // key → last index
  processed.forEach((line, i) => {
    const key = opts.caseSensitive ? line : line.toLowerCase();
    seen.set(key, i);
  });

  let result: string[];

  if (opts.keepOrder === "first") {
    const seenKeys = new Set<string>();
    result = processed.filter((line) => {
      if (opts.removeEmpty && line === "") return false;
      const key = opts.caseSensitive ? line : line.toLowerCase();
      if (seenKeys.has(key)) return false;
      seenKeys.add(key);
      return true;
    });
  } else {
    // keep last occurrence — iterate in reverse, then reverse back
    const seenKeys = new Set<string>();
    result = processed
      .slice()
      .reverse()
      .filter((line) => {
        if (opts.removeEmpty && line === "") return false;
        const key = opts.caseSensitive ? line : line.toLowerCase();
        if (seenKeys.has(key)) return false;
        seenKeys.add(key);
        return true;
      })
      .reverse();
  }

  if (opts.sortResult) {
    result = [...result].sort((a, b) =>
      opts.caseSensitive ? a.localeCompare(b) : a.toLowerCase().localeCompare(b.toLowerCase())
    );
  }

  const uniqueCount = result.length;
  const removedCount = originalCount - uniqueCount;

  return {
    output: result.join("\n"),
    originalCount,
    uniqueCount,
    removedCount,
  };
}

export const EXAMPLE_INPUTS = [
  `apple\nbanana\napple\norange\nbanana\ngrape\norange`,
  `line one\nLine One\nline one\nLINE ONE\nunique line\nline one`,
  `  hello  \nhello\n  hello  \nworld\nworld\n\n\nhello`,
  `error: not found\nwarning: low memory\nerror: not found\ninfo: started\nwarning: low memory\ninfo: started`,
];