// ── ULID Generator utils ───────────────────────────────────
// 128-bit identifier: 48-bit ms timestamp + 80 random bits,
// encoded in Crockford's Base32 (26 chars, URL-safe, lexicographically sortable).

const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

function encodeTime(ms: number, len: number): string {
  let out = "";
  for (let i = len - 1; i >= 0; i--) {
    const mod = ms % 32;
    out = ALPHABET[mod] + out;
    ms = (ms - mod) / 32;
  }
  return out;
}

function encodeRandom(len: number): string {
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  let out = "";
  for (let i = 0; i < len; i++) out += ALPHABET[bytes[i] % 32];
  return out;
}

export function ulid(): string {
  return encodeTime(Date.now(), 10) + encodeRandom(16);
}

export function generateBatch(count: number): string[] {
  const n = Math.max(1, Math.min(count, 1000));
  const out: string[] = [];
  for (let i = 0; i < n; i++) out.push(ulid());
  return out;
}
