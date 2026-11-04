// ── Byte Converter utils ──────────────────────────

export type ByteUnit = "b" | "kb" | "mb" | "gb" | "tb" | "pb";
export type ByteStandard = "binary" | "decimal";

export type ConversionResult = {
  bytes: string;
  kilobytes: string;
  megabytes: string;
  gigabytes: string;
  terabytes: string;
  petabytes: string;
  bits: string;
};

const BINARY_FACTORS: Record<ByteUnit, number> = {
  b: 1,
  kb: 1024,
  mb: 1024 ** 2,
  gb: 1024 ** 3,
  tb: 1024 ** 4,
  pb: 1024 ** 5,
};

const DECIMAL_FACTORS: Record<ByteUnit, number> = {
  b: 1,
  kb: 1000,
  mb: 1000 ** 2,
  gb: 1000 ** 3,
  tb: 1000 ** 4,
  pb: 1000 ** 5,
};

function formatNum(n: number): string {
  if (n === 0) return "0";
  if (n >= 1) return n.toLocaleString("en-US", { maximumFractionDigits: 6 });
  return n.toPrecision(6);
}

export function convertBytes(
  value: number,
  fromUnit: ByteUnit,
  standard: ByteStandard
): ConversionResult {
  const factors = standard === "binary" ? BINARY_FACTORS : DECIMAL_FACTORS;
  const bytes = value * factors[fromUnit];

  return {
    bytes: formatNum(bytes),
    kilobytes: formatNum(bytes / factors.kb),
    megabytes: formatNum(bytes / factors.mb),
    gigabytes: formatNum(bytes / factors.gb),
    terabytes: formatNum(bytes / factors.tb),
    petabytes: formatNum(bytes / factors.pb),
    bits: formatNum(bytes * 8),
  };
}

export const UNIT_LABELS: Record<ByteUnit, { binary: string; decimal: string }> = {
  b: { binary: "Bytes (B)", decimal: "Bytes (B)" },
  kb: { binary: "Kibibytes (KiB)", decimal: "Kilobytes (KB)" },
  mb: { binary: "Mebibytes (MiB)", decimal: "Megabytes (MB)" },
  gb: { binary: "Gibibytes (GiB)", decimal: "Gigabytes (GB)" },
  tb: { binary: "Tebibytes (TiB)", decimal: "Terabytes (TB)" },
  pb: { binary: "Pebibytes (PiB)", decimal: "Petabytes (PB)" },
};
