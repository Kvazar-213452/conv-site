// ── JSON Sorter utils ─────────────────────────────

export type SortOrder = "asc" | "desc";

export type SortOptions = {
  order: SortOrder;
  recursive: boolean;
  sortArrays: boolean;
};

export const DEFAULT_OPTIONS: SortOptions = {
  order: "asc",
  recursive: true,
  sortArrays: false,
};

function sortKeys(obj: unknown, opts: SortOptions): unknown {
  if (Array.isArray(obj)) {
    const mapped = opts.recursive ? obj.map((v) => sortKeys(v, opts)) : obj;
    if (opts.sortArrays && mapped.every((v) => typeof v === "string" || typeof v === "number")) {
      return [...mapped].sort((a, b) => {
        const sa = String(a);
        const sb = String(b);
        return opts.order === "asc" ? sa.localeCompare(sb) : sb.localeCompare(sa);
      });
    }
    return mapped;
  }
  if (obj !== null && typeof obj === "object") {
    const keys = Object.keys(obj as Record<string, unknown>).sort((a, b) =>
      opts.order === "asc" ? a.localeCompare(b) : b.localeCompare(a)
    );
    const result: Record<string, unknown> = {};
    for (const key of keys) {
      const val = (obj as Record<string, unknown>)[key];
      result[key] = opts.recursive ? sortKeys(val, opts) : val;
    }
    return result;
  }
  return obj;
}

export function sortJson(input: string, opts: SortOptions, indent: number): string {
  const parsed = JSON.parse(input);
  const sorted = sortKeys(parsed, opts);
  return JSON.stringify(sorted, null, indent);
}

export const EXAMPLE_INPUT = `{
  "zebra": 1,
  "apple": {
    "cherry": true,
    "banana": [3, 1, 2]
  },
  "mango": "hello",
  "date": {
    "fig": 42,
    "elderberry": null
  }
}`;
