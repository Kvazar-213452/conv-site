// ── JWT Generator utils ────────────────────────────────────
// Signs JWTs using the browser's Web Crypto API (HS256/HS384/HS512).
// Asymmetric algorithms (RS256, ES256) are not supported from pure text
// secrets — those need a real key import flow.

export type HsAlg = "HS256" | "HS384" | "HS512";

function b64urlFromBytes(bytes: Uint8Array): string {
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s).replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function b64url(str: string): string {
  return b64urlFromBytes(new TextEncoder().encode(str));
}

const HASH_FOR: Record<HsAlg, string> = {
  HS256: "SHA-256",
  HS384: "SHA-384",
  HS512: "SHA-512",
};

export async function signJwt(
  payload: Record<string, unknown>,
  secret: string,
  alg: HsAlg,
): Promise<string> {
  const header = { alg, typ: "JWT" };
  const headerPart  = b64url(JSON.stringify(header));
  const payloadPart = b64url(JSON.stringify(payload));
  const signingInput = `${headerPart}.${payloadPart}`;

  const keyBytes = new TextEncoder().encode(secret);
  const key = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "HMAC", hash: HASH_FOR[alg] },
    false,
    ["sign"],
  );
  const sig = new Uint8Array(
    await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(signingInput)),
  );
  return `${signingInput}.${b64urlFromBytes(sig)}`;
}
