// ── CSV to JSON utils ──────────────────────────────────────

export type CsvOptions = {
  delimiter: "," | ";" | "\t";
  hasHeader: boolean;
  typeInference: boolean;
};

export const DEFAULT_OPTIONS: CsvOptions = {
  delimiter: ",",
  hasHeader: true,
  typeInference: true,
};

function parseCsvRows(input: string, delimiter: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (inQuotes) {
      if (ch === '"' && input[i + 1] === '"') { cell += '"'; i++; continue; }
      if (ch === '"') { inQuotes = false; continue; }
      cell += ch;
    } else {
      if (ch === '"') { inQuotes = true; continue; }
      if (ch === delimiter) { row.push(cell); cell = ""; continue; }
      if (ch === "\r") continue;
      if (ch === "\n") { row.push(cell); rows.push(row); row = []; cell = ""; continue; }
      cell += ch;
    }
  }
  if (cell.length || row.length) { row.push(cell); rows.push(row); }
  return rows.filter((r) => r.length !== 1 || r[0] !== "");
}

function coerce(value: string): unknown {
  if (value === "") return null;
  if (value === "true") return true;
  if (value === "false") return false;
  if (value === "null") return null;
  if (/^-?\d+$/.test(value)) {
    const n = Number(value);
    if (Number.isSafeInteger(n)) return n;
  }
  if (/^-?\d*\.\d+([eE][+-]?\d+)?$/.test(value)) return Number(value);
  return value;
}

export function csvToJson(input: string, opts: CsvOptions): unknown[] {
  const rows = parseCsvRows(input, opts.delimiter);
  if (!rows.length) return [];
  const header = opts.hasHeader ? rows[0] : rows[0].map((_, i) => `col${i + 1}`);
  const body = opts.hasHeader ? rows.slice(1) : rows;
  return body.map((row) => {
    const obj: Record<string, unknown> = {};
    for (let i = 0; i < header.length; i++) {
      const key = header[i] || `col${i + 1}`;
      const raw = row[i] ?? "";
      obj[key] = opts.typeInference ? coerce(raw) : raw;
    }
    return obj;
  });
}
