// ── CSV to Markdown Table utils ─────────────────────────────

export type Align = "left" | "right" | "center" | "none";

export type Options = {
  delimiter: "," | ";" | "\t";
  hasHeader: boolean;
  align: Align;
  trimCells: boolean;
};

export const DEFAULT_OPTIONS: Options = {
  delimiter: ",",
  hasHeader: true,
  align: "left",
  trimCells: true,
};

function parseCsv(input: string, delimiter: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;
  let i = 0;
  const n = input.length;

  while (i < n) {
    const ch = input[i];
    if (inQuotes) {
      if (ch === '"' && input[i + 1] === '"') { cell += '"'; i += 2; continue; }
      if (ch === '"') { inQuotes = false; i++; continue; }
      cell += ch; i++; continue;
    }
    if (ch === '"') { inQuotes = true; i++; continue; }
    if (ch === delimiter) { row.push(cell); cell = ""; i++; continue; }
    if (ch === "\r") { i++; continue; }
    if (ch === "\n") { row.push(cell); rows.push(row); row = []; cell = ""; i++; continue; }
    cell += ch; i++;
  }
  if (cell.length || row.length) { row.push(cell); rows.push(row); }
  return rows.filter((r) => r.length !== 1 || r[0] !== "");
}

function escapeCell(value: string): string {
  return value
    .replace(/\|/g, "\\|")
    .replace(/\n/g, " ")
    .replace(/\r/g, "");
}

function alignBar(align: Align, width: number): string {
  const base = "-".repeat(Math.max(width, 3));
  switch (align) {
    case "left":   return `:${base.slice(1)}`;
    case "right":  return `${base.slice(0, -1)}:`;
    case "center": return `:${base.slice(1, -1)}:`;
    default:       return base;
  }
}

export function csvToMarkdown(input: string, opts: Options): string {
  if (!input.trim()) return "";
  const rows = parseCsv(input, opts.delimiter);
  if (!rows.length) return "";

  const cleaned = rows.map((r) =>
    r.map((c) => (opts.trimCells ? c.trim() : c)).map(escapeCell),
  );

  const header = opts.hasHeader
    ? cleaned[0]
    : cleaned[0].map((_, i) => `Column ${i + 1}`);
  const body = opts.hasHeader ? cleaned.slice(1) : cleaned;

  const colCount = header.length;
  const colWidths = new Array<number>(colCount).fill(0);
  for (let c = 0; c < colCount; c++) {
    colWidths[c] = Math.max(colWidths[c], header[c]?.length ?? 0);
    for (const row of body) {
      colWidths[c] = Math.max(colWidths[c], (row[c] ?? "").length);
    }
    colWidths[c] = Math.max(colWidths[c], 3);
  }

  const padCell = (val: string, width: number) => {
    const v = val ?? "";
    if (opts.align === "right")  return v.padStart(width, " ");
    if (opts.align === "center") {
      const extra = width - v.length;
      const left = Math.floor(extra / 2);
      return " ".repeat(left) + v + " ".repeat(extra - left);
    }
    return v.padEnd(width, " ");
  };

  const renderRow = (r: string[]) =>
    "| " + colWidths.map((w, c) => padCell(r[c] ?? "", w)).join(" | ") + " |";

  const headerLine = renderRow(header);
  const barLine = "| " + colWidths.map((w) => alignBar(opts.align, w)).join(" | ") + " |";
  const bodyLines = body.map(renderRow);

  return [headerLine, barLine, ...bodyLines].join("\n");
}
