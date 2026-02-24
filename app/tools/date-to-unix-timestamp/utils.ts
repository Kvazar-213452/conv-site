// ── Date ↔ Unix Timestamp utilities ──────────────────────────

export type TimestampUnit = "seconds" | "milliseconds";

/** Parse a human date string → Unix timestamp */
export function dateToTimestamp(raw: string, unit: TimestampUnit): string {
  const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) throw new Error("Input is empty.");

  return lines.map((line) => {
    const ms = Date.parse(line);
    if (isNaN(ms)) {
      throw new Error(
        `Cannot parse date: "${line}"\nTry formats like: 2024-01-15, 2024-01-15T08:00:00Z, Jan 15 2024`
      );
    }
    return String(unit === "seconds" ? Math.floor(ms / 1000) : ms);
  }).join("\n");
}

/** Parse Unix timestamps → human-readable date strings */
export function timestampToDate(raw: string, unit: TimestampUnit, fmt: DateFormat): string {
  const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) throw new Error("Input is empty.");

  return lines.map((line) => {
    const num = Number(line);
    if (isNaN(num)) {
      throw new Error(`Invalid timestamp: "${line}"\nExpected a numeric Unix timestamp.`);
    }
    const ms = unit === "seconds" ? num * 1000 : num;
    const date = new Date(ms);
    if (isNaN(date.getTime())) {
      throw new Error(`Timestamp "${line}" is out of valid range.`);
    }
    return formatDate(date, fmt);
  }).join("\n");
}

export type DateFormat = "iso" | "iso-local" | "utc" | "locale" | "rfc2822";

export const FORMAT_OPTIONS: { value: DateFormat; label: string; example: string }[] = [
  { value: "iso",       label: "ISO 8601 UTC",  example: "2024-01-15T08:00:00.000Z" },
  { value: "iso-local", label: "ISO 8601 Local", example: "2024-01-15T10:00:00+02:00" },
  { value: "utc",       label: "UTC String",    example: "Mon, 15 Jan 2024 08:00:00 GMT" },
  { value: "locale",    label: "Locale",        example: "1/15/2024, 10:00:00 AM" },
  { value: "rfc2822",   label: "RFC 2822",      example: "Mon, 15 Jan 2024 08:00:00 +0000" },
];

function formatDate(date: Date, fmt: DateFormat): string {
  switch (fmt) {
    case "iso":       return date.toISOString();
    case "iso-local": return toIsoLocal(date);
    case "utc":       return date.toUTCString();
    case "locale":    return date.toLocaleString();
    case "rfc2822":   return date.toUTCString().replace("GMT", "+0000");
  }
}

function toIsoLocal(date: Date): string {
  const off = -date.getTimezoneOffset();
  const sign = off >= 0 ? "+" : "-";
  const pad = (n: number) => String(Math.abs(n)).padStart(2, "0");
  const hh = pad(Math.floor(Math.abs(off) / 60));
  const mm = pad(Math.abs(off) % 60);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().replace("Z", `${sign}${hh}:${mm}`);
}

/** Quick helper: what is the timestamp for "now" */
export function nowTimestamp(unit: TimestampUnit): string {
  const ms = Date.now();
  return String(unit === "seconds" ? Math.floor(ms / 1000) : ms);
}