// ── Number Base Converter utils ─────────────────────────────

export type Base = 2 | 8 | 10 | 16;

export const BASES: { value: Base; label: string; prefix?: string }[] = [
  { value: 2,  label: "Binary",      prefix: "0b" },
  { value: 8,  label: "Octal",       prefix: "0o" },
  { value: 10, label: "Decimal" },
  { value: 16, label: "Hexadecimal", prefix: "0x" },
];

const BASE_PATTERNS: Record<Base, RegExp> = {
  2:  /^-?[01]+$/,
  8:  /^-?[0-7]+$/,
  10: /^-?\d+$/,
  16: /^-?[0-9a-fA-F]+$/,
};

function stripPrefix(input: string, base: Base): string {
  const trimmed = input.trim();
  const sign = trimmed.startsWith("-") ? "-" : "";
  const body = sign ? trimmed.slice(1) : trimmed;
  if (base === 2 && /^0b/i.test(body))  return sign + body.slice(2);
  if (base === 8 && /^0o/i.test(body))  return sign + body.slice(2);
  if (base === 16 && /^0x/i.test(body)) return sign + body.slice(2);
  return trimmed;
}

export function parseBase(input: string, base: Base): bigint {
  const cleaned = stripPrefix(input, base).replace(/_/g, "");
  if (!cleaned) throw new Error("Input is empty");
  if (!BASE_PATTERNS[base].test(cleaned)) {
    throw new Error(`"${cleaned}" is not a valid base-${base} number`);
  }
  const negative = cleaned.startsWith("-");
  const body = negative ? cleaned.slice(1) : cleaned;
  let n = 0n;
  for (const ch of body) {
    const digit = BigInt(parseInt(ch, 16));
    n = n * BigInt(base) + digit;
  }
  return negative ? -n : n;
}

export function toBase(value: bigint, base: Base): string {
  if (base === 10) return value.toString(10);
  const negative = value < 0n;
  const abs = negative ? -value : value;
  const body = abs.toString(base);
  return negative ? "-" + body : body;
}

export function convertAll(input: string, from: Base): Record<Base, string> {
  const n = parseBase(input, from);
  return {
    2:  toBase(n, 2),
    8:  toBase(n, 8),
    10: toBase(n, 10),
    16: toBase(n, 16).toUpperCase(),
  };
}
