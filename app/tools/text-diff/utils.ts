// ── Text Diff utils ─────────────────────────────────────────

export type DiffOp = "equal" | "add" | "remove";

export type DiffLine = {
  op: DiffOp;
  value: string;
  aIndex: number | null;
  bIndex: number | null;
};

/**
 * Classic longest-common-subsequence line diff.
 * Suitable for a few thousand lines of text.
 */
export function diffLines(a: string, b: string): DiffLine[] {
  const linesA = a.split("\n");
  const linesB = b.split("\n");
  const n = linesA.length;
  const m = linesB.length;

  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = linesA[i] === linesB[j]
        ? dp[i + 1][j + 1] + 1
        : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const result: DiffLine[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (linesA[i] === linesB[j]) {
      result.push({ op: "equal", value: linesA[i], aIndex: i + 1, bIndex: j + 1 });
      i++; j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      result.push({ op: "remove", value: linesA[i], aIndex: i + 1, bIndex: null });
      i++;
    } else {
      result.push({ op: "add", value: linesB[j], aIndex: null, bIndex: j + 1 });
      j++;
    }
  }
  while (i < n) {
    result.push({ op: "remove", value: linesA[i], aIndex: i + 1, bIndex: null });
    i++;
  }
  while (j < m) {
    result.push({ op: "add", value: linesB[j], aIndex: null, bIndex: j + 1 });
    j++;
  }

  return result;
}

export type DiffStats = {
  added: number;
  removed: number;
  unchanged: number;
};

export function diffStats(diff: DiffLine[]): DiffStats {
  const stats: DiffStats = { added: 0, removed: 0, unchanged: 0 };
  for (const line of diff) {
    if (line.op === "add") stats.added++;
    else if (line.op === "remove") stats.removed++;
    else stats.unchanged++;
  }
  return stats;
}
