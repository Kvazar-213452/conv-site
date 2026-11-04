// ── HMAC Generator utils ──────────────────────────

export type HmacAlgorithm = "SHA-256" | "SHA-384" | "SHA-512" | "SHA-1";

export type HmacResult = {
  algorithm: HmacAlgorithm;
  hex: string;
  base64: string;
};

export async function generateHmac(
  message: string,
  secret: string,
  algorithm: HmacAlgorithm
): Promise<HmacResult> {
  const enc = new TextEncoder();
  const keyData = enc.encode(secret);
  const msgData = enc.encode(message);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: algorithm },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", cryptoKey, msgData);
  const bytes = new Uint8Array(signature);

  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const base64 = btoa(String.fromCharCode(...bytes));

  return { algorithm, hex, base64 };
}

export async function generateAllHmacs(
  message: string,
  secret: string
): Promise<HmacResult[]> {
  const algos: HmacAlgorithm[] = ["SHA-256", "SHA-384", "SHA-512", "SHA-1"];
  return Promise.all(algos.map((alg) => generateHmac(message, secret, alg)));
}

export const EXAMPLE_MESSAGE = "Hello, World!";
export const EXAMPLE_SECRET = "my-secret-key-2024";
