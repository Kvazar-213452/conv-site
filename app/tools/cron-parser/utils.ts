// ── Cron Expression Parser utils ────────────────────────────

export type CronField = {
  min: number;
  max: number;
  values: number[];
  isWildcard: boolean;
};

export type ParsedCron = {
  seconds?: CronField;
  minute: CronField;
  hour: CronField;
  dayOfMonth: CronField;
  month: CronField;
  dayOfWeek: CronField;
};

const RANGES: { min: number; max: number }[] = [
  { min: 0, max: 59 }, // seconds / minute
  { min: 0, max: 23 }, // hour
  { min: 1, max: 31 }, // day of month
  { min: 1, max: 12 }, // month
  { min: 0, max: 6 },  // day of week (0 or 7 = Sunday)
];

const MONTH_NAMES: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};
const DOW_NAMES: Record<string, number> = {
  sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6,
};

function normalizeAliases(token: string, idx: number): string {
  const t = token.toLowerCase();
  if (idx === 4 && MONTH_NAMES[t] !== undefined) return String(MONTH_NAMES[t]);
  if (idx === 5 && DOW_NAMES[t] !== undefined)   return String(DOW_NAMES[t]);
  return token;
}

function parseField(raw: string, idx: number, min: number, max: number): CronField {
  const isWildcard = raw === "*";
  const parts = raw.split(",");
  const values = new Set<number>();

  for (const part of parts) {
    let [range, stepStr] = part.split("/");
    const step = stepStr ? parseInt(stepStr, 10) : 1;
    if (stepStr !== undefined && (!Number.isFinite(step) || step < 1)) {
      throw new Error(`Invalid step "/${stepStr}"`);
    }

    let lo = min;
    let hi = max;
    if (range !== "*") {
      const [a, b] = range.split("-").map((v) => normalizeAliases(v, idx));
      lo = parseInt(a, 10);
      hi = b !== undefined ? parseInt(b, 10) : lo;
      if (!Number.isFinite(lo) || !Number.isFinite(hi)) {
        throw new Error(`Invalid number "${range}"`);
      }
      // Day-of-week 7 → 0
      if (idx === 5) {
        if (lo === 7) lo = 0;
        if (hi === 7) hi = 0;
      }
      if (lo < min || hi > max) {
        throw new Error(`Value out of range (${min}–${max}): "${range}"`);
      }
      if (b === undefined && stepStr !== undefined) hi = max;
    }

    for (let v = lo; v <= hi; v += step) values.add(v);
  }

  return {
    min,
    max,
    values: [...values].sort((a, b) => a - b),
    isWildcard,
  };
}

export function parseCron(expr: string): ParsedCron {
  const tokens = expr.trim().split(/\s+/);
  if (tokens.length !== 5 && tokens.length !== 6) {
    throw new Error("Expected 5 fields (minute hour dom month dow) or 6 fields with seconds");
  }
  const hasSeconds = tokens.length === 6;

  const fieldSpec = hasSeconds
    ? [RANGES[0], RANGES[0], RANGES[1], RANGES[2], RANGES[3], RANGES[4]]
    : [RANGES[0], RANGES[1], RANGES[2], RANGES[3], RANGES[4]];

  const fields = tokens.map((tok, i) =>
    parseField(tok, hasSeconds ? i : i + 1, fieldSpec[i].min, fieldSpec[i].max),
  );

  return hasSeconds
    ? { seconds: fields[0], minute: fields[1], hour: fields[2], dayOfMonth: fields[3], month: fields[4], dayOfWeek: fields[5] }
    : { minute: fields[0], hour: fields[1], dayOfMonth: fields[2], month: fields[3], dayOfWeek: fields[4] };
}

export function describeCron(parsed: ParsedCron): string {
  const parts: string[] = ["At"];

  const timePart = `${describeHour(parsed.hour)}:${describeMinute(parsed.minute)}`;
  parts.push(timePart);

  if (parsed.seconds && !parsed.seconds.isWildcard) {
    parts.push(`, second ${listToText(parsed.seconds.values)}`);
  }

  if (!parsed.dayOfMonth.isWildcard) {
    parts.push(`on day ${listToText(parsed.dayOfMonth.values)}`);
  }
  if (!parsed.month.isWildcard) {
    parts.push(`in ${parsed.month.values.map(monthName).join(", ")}`);
  }
  if (!parsed.dayOfWeek.isWildcard) {
    parts.push(`on ${parsed.dayOfWeek.values.map(dowName).join(", ")}`);
  }
  return parts.join(" ");
}

function describeMinute(f: CronField): string {
  if (f.isWildcard) return "every minute";
  if (f.values.length === 1) return String(f.values[0]).padStart(2, "0");
  return listToText(f.values);
}

function describeHour(f: CronField): string {
  if (f.isWildcard) return "every hour";
  if (f.values.length === 1) return String(f.values[0]).padStart(2, "0");
  return listToText(f.values);
}

function listToText(nums: number[]): string {
  if (nums.length <= 6) return nums.join(", ");
  return `${nums.slice(0, 3).join(", ")} … ${nums[nums.length - 1]}`;
}

function monthName(n: number): string {
  return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][n - 1];
}
function dowName(n: number): string {
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][n];
}

export function nextRuns(parsed: ParsedCron, from: Date, count: number): Date[] {
  const out: Date[] = [];
  const useSeconds = Boolean(parsed.seconds);
  const d = new Date(from.getTime());
  if (useSeconds) d.setMilliseconds(0);
  else { d.setSeconds(0, 0); }
  d.setTime(d.getTime() + (useSeconds ? 1000 : 60 * 1000));

  const limit = 60 * 60 * 24 * 366 * 4; // guard: at most 4 years of iterations
  for (let i = 0; i < limit && out.length < count; i++) {
    if (matches(parsed, d)) {
      out.push(new Date(d.getTime()));
    }
    d.setTime(d.getTime() + (useSeconds ? 1000 : 60 * 1000));
  }
  return out;
}

function matches(parsed: ParsedCron, d: Date): boolean {
  if (parsed.seconds && !parsed.seconds.values.includes(d.getSeconds())) return false;
  if (!parsed.minute.values.includes(d.getMinutes())) return false;
  if (!parsed.hour.values.includes(d.getHours())) return false;
  if (!parsed.month.values.includes(d.getMonth() + 1)) return false;

  const domMatch = parsed.dayOfMonth.values.includes(d.getDate());
  const dowMatch = parsed.dayOfWeek.values.includes(d.getDay());

  // Vixie cron rule: if both dom and dow are restricted, match if either matches
  if (!parsed.dayOfMonth.isWildcard && !parsed.dayOfWeek.isWildcard) {
    return domMatch || dowMatch;
  }
  return domMatch && dowMatch;
}

export const COMMON_EXAMPLES: { expr: string; label: string }[] = [
  { expr: "* * * * *",       label: "Every minute" },
  { expr: "*/5 * * * *",     label: "Every 5 minutes" },
  { expr: "0 * * * *",       label: "Every hour, on the hour" },
  { expr: "0 0 * * *",       label: "Every day at midnight" },
  { expr: "0 9 * * 1-5",     label: "Weekdays at 9 AM" },
  { expr: "0 0 1 * *",       label: "First of every month at midnight" },
  { expr: "0 0 * * 0",       label: "Sundays at midnight" },
  { expr: "30 2 * * 6",      label: "Saturdays at 2:30 AM" },
];
