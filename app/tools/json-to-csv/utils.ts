export function jsonToCsv(obj: unknown): string {
  // Normalize to array of objects
  const rows: Record<string, unknown>[] = [];

  if (Array.isArray(obj)) {
    for (const item of obj) {
      if (item !== null && typeof item === "object" && !Array.isArray(item)) {
        rows.push(item as Record<string, unknown>);
      } else {
        rows.push({ value: item });
      }
    }
  } else if (obj !== null && typeof obj === "object") {
    rows.push(obj as Record<string, unknown>);
  } else {
    rows.push({ value: obj });
  }

  if (rows.length === 0) throw new Error("No data rows found.");

  // Collect all headers (union of all keys)
  const headers = Array.from(
    rows.reduce((set, row) => {
      Object.keys(row).forEach((k) => set.add(k));
      return set;
    }, new Set<string>())
  );

  const escape = (val: unknown): string => {
    if (val === null || val === undefined) return "";
    const str =
      typeof val === "object" ? JSON.stringify(val) : String(val);
    // Wrap in quotes if contains comma, newline, or quote
    if (/[",\n\r]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const headerRow = headers.map(escape).join(",");
  const dataRows = rows.map((row) =>
    headers.map((h) => escape(row[h])).join(",")
  );

  return [headerRow, ...dataRows].join("\n");
}

export function csvToJson(csv: string): Record<string, unknown>[] {
  const lines = csv.split(/\r?\n/).filter((l) => l.trim() !== "");
  if (lines.length < 1) throw new Error("Empty CSV input.");

  // Parse a single CSV line respecting quoted fields
  const parseLine = (line: string): string[] => {
    const fields: string[] = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQuotes) {
        if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
        else if (ch === '"') { inQuotes = false; }
        else { cur += ch; }
      } else {
        if (ch === '"') { inQuotes = true; }
        else if (ch === ",") { fields.push(cur); cur = ""; }
        else { cur += ch; }
      }
    }
    fields.push(cur);
    return fields;
  };

  // Auto-cast: number, boolean, null, or keep string
  const cast = (val: string): unknown => {
    if (val === "") return null;
    if (val === "true") return true;
    if (val === "false") return false;
    if (val === "null") return null;
    if (/^-?\d+(\.\d+)?$/.test(val)) return Number(val);
    return val;
  };

  const headers = parseLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = parseLine(line);
    return Object.fromEntries(headers.map((h, i) => [h, cast(values[i] ?? "")]));
  });
}