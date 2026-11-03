// ── UUID Generator utils ───────────────────────────────────

export type UuidVersion = "v4" | "v7" | "nil";

function toHex(buf: Uint8Array): string {
  let s = "";
  for (let i = 0; i < buf.length; i++) s += buf[i].toString(16).padStart(2, "0");
  return s;
}

function format(hex: string): string {
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

export function uuidV4(): string {
  const b = new Uint8Array(16);
  crypto.getRandomValues(b);
  b[6] = (b[6] & 0x0f) | 0x40; // version 4
  b[8] = (b[8] & 0x3f) | 0x80; // variant RFC 4122
  return format(toHex(b));
}

export function uuidV7(): string {
  const b = new Uint8Array(16);
  crypto.getRandomValues(b);
  const ts = Date.now();
  // 48-bit unix ms timestamp (big-endian) in first 6 bytes
  b[0] = (ts / 2 ** 40) & 0xff;
  b[1] = (ts / 2 ** 32) & 0xff;
  b[2] = (ts / 2 ** 24) & 0xff;
  b[3] = (ts / 2 ** 16) & 0xff;
  b[4] = (ts / 2 ** 8)  & 0xff;
  b[5] = ts & 0xff;
  b[6] = (b[6] & 0x0f) | 0x70; // version 7
  b[8] = (b[8] & 0x3f) | 0x80; // variant RFC 4122
  return format(toHex(b));
}

export function uuidNil(): string {
  return "00000000-0000-0000-0000-000000000000";
}

export function generateBatch(version: UuidVersion, count: number): string[] {
  const n = Math.max(1, Math.min(count, 1000));
  const out: string[] = [];
  for (let i = 0; i < n; i++) {
    out.push(version === "v4" ? uuidV4() : version === "v7" ? uuidV7() : uuidNil());
  }
  return out;
}
