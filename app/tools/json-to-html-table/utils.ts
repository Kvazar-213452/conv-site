// ── JSON to HTML Table utils ──────────────────────

export type TableOptions = {
  includeIndex: boolean;
  stripHtml: boolean;
  prettify: boolean;
};

export const DEFAULT_OPTIONS: TableOptions = {
  includeIndex: false,
  stripHtml: false,
  prettify: true,
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatValue(val: unknown): string {
  if (val === null || val === undefined) return "";
  if (typeof val === "object") return escapeHtml(JSON.stringify(val));
  return escapeHtml(String(val));
}

export function jsonToHtmlTable(input: string, opts: TableOptions): string {
  const parsed = JSON.parse(input);

  if (!Array.isArray(parsed)) {
    throw new Error("Input must be a JSON array of objects");
  }
  if (parsed.length === 0) {
    throw new Error("Array is empty");
  }

  const allKeys = new Set<string>();
  for (const item of parsed) {
    if (typeof item === "object" && item !== null && !Array.isArray(item)) {
      for (const key of Object.keys(item)) allKeys.add(key);
    }
  }

  if (allKeys.size === 0) {
    throw new Error("No object keys found in array items");
  }

  const headers = [...allKeys];
  const indent = opts.prettify ? "  " : "";
  const nl = opts.prettify ? "\n" : "";

  let html = `<table>${nl}`;
  html += `${indent}<thead>${nl}`;
  html += `${indent}${indent}<tr>${nl}`;
  if (opts.includeIndex) {
    html += `${indent}${indent}${indent}<th>#</th>${nl}`;
  }
  for (const h of headers) {
    html += `${indent}${indent}${indent}<th>${escapeHtml(h)}</th>${nl}`;
  }
  html += `${indent}${indent}</tr>${nl}`;
  html += `${indent}</thead>${nl}`;

  html += `${indent}<tbody>${nl}`;
  for (let i = 0; i < parsed.length; i++) {
    const row = parsed[i];
    html += `${indent}${indent}<tr>${nl}`;
    if (opts.includeIndex) {
      html += `${indent}${indent}${indent}<td>${i + 1}</td>${nl}`;
    }
    for (const h of headers) {
      const val = typeof row === "object" && row !== null ? (row as Record<string, unknown>)[h] : "";
      html += `${indent}${indent}${indent}<td>${formatValue(val)}</td>${nl}`;
    }
    html += `${indent}${indent}</tr>${nl}`;
  }
  html += `${indent}</tbody>${nl}`;
  html += `</table>`;

  return html;
}

export const EXAMPLE_INPUT = `[
  { "name": "Alice", "age": 30, "city": "Austin", "role": "Engineer" },
  { "name": "Bob", "age": 25, "city": "Denver", "role": "Designer" },
  { "name": "Carol", "age": 28, "city": "Portland", "role": "Manager" },
  { "name": "Dave", "age": 35, "city": "Seattle", "role": "Engineer" }
]`;
