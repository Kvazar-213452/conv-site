// ── Hash Generator utils ─────────────────────────────────────

export type HashAlgorithm = "MD5" | "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";

export const HASH_ALGORITHMS: HashAlgorithm[] = [
  "MD5",
  "SHA-1",
  "SHA-256",
  "SHA-384",
  "SHA-512",
];

export type HashResult = {
  algorithm: HashAlgorithm;
  hex: string;
};

function toHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let out = "";
  for (let i = 0; i < bytes.length; i++) {
    out += bytes[i].toString(16).padStart(2, "0");
  }
  return out;
}

// Minimal MD5 implementation (RFC 1321) — WebCrypto doesn't support MD5.
function md5(message: string): string {
  const bytes = new TextEncoder().encode(message);
  const len = bytes.length;
  const bitLen = len * 8;

  const padLen = (len % 64 < 56 ? 56 : 120) - (len % 64);
  const total = new Uint8Array(len + padLen + 8);
  total.set(bytes);
  total[len] = 0x80;

  const view = new DataView(total.buffer);
  view.setUint32(total.length - 8, bitLen >>> 0, true);
  view.setUint32(total.length - 4, Math.floor(bitLen / 0x100000000), true);

  const K = new Int32Array(64);
  for (let i = 0; i < 64; i++) {
    K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 0x100000000);
  }
  const S = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
  ];

  let a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476;

  const rotl = (x: number, n: number) => (x << n) | (x >>> (32 - n));

  for (let chunk = 0; chunk < total.length; chunk += 64) {
    const M = new Int32Array(16);
    for (let i = 0; i < 16; i++) {
      M[i] = view.getUint32(chunk + i * 4, true);
    }

    let a = a0, b = b0, c = c0, d = d0;
    for (let i = 0; i < 64; i++) {
      let f = 0, g = 0;
      if (i < 16) { f = (b & c) | (~b & d); g = i; }
      else if (i < 32) { f = (d & b) | (~d & c); g = (5 * i + 1) % 16; }
      else if (i < 48) { f = b ^ c ^ d; g = (3 * i + 5) % 16; }
      else { f = c ^ (b | ~d); g = (7 * i) % 16; }

      const temp = d;
      d = c;
      c = b;
      b = (b + rotl((a + f + K[i] + M[g]) | 0, S[i])) | 0;
      a = temp;
    }

    a0 = (a0 + a) | 0;
    b0 = (b0 + b) | 0;
    c0 = (c0 + c) | 0;
    d0 = (d0 + d) | 0;
  }

  const result = new ArrayBuffer(16);
  const resultView = new DataView(result);
  resultView.setUint32(0, a0 >>> 0, true);
  resultView.setUint32(4, b0 >>> 0, true);
  resultView.setUint32(8, c0 >>> 0, true);
  resultView.setUint32(12, d0 >>> 0, true);
  return toHex(result);
}

export async function hashText(
  text: string,
  algorithm: HashAlgorithm,
): Promise<string> {
  if (algorithm === "MD5") return md5(text);

  const data = new TextEncoder().encode(text);
  const buffer = await crypto.subtle.digest(algorithm, data);
  return toHex(buffer);
}

export async function hashAll(text: string): Promise<HashResult[]> {
  const results = await Promise.all(
    HASH_ALGORITHMS.map(async (algorithm) => ({
      algorithm,
      hex: await hashText(text, algorithm),
    })),
  );
  return results;
}
