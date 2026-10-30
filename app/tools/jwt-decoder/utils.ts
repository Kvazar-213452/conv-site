// ── JWT Decoder utils ─────────────────────────────────────

export type JwtDecoded = {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
  raw: {
    header: string;
    payload: string;
    signature: string;
  };
};

function base64UrlDecode(input: string): string {
  let b64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64.length % 4;
  if (pad) b64 += "=".repeat(4 - pad);
  try {
    const binary = atob(b64);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    return new TextDecoder("utf-8").decode(bytes);
  } catch {
    throw new Error("Invalid Base64URL segment");
  }
}

export function decodeJwt(token: string): JwtDecoded {
  const trimmed = token.trim();
  if (!trimmed) throw new Error("Token is empty");

  const parts = trimmed.split(".");
  if (parts.length !== 3) {
    throw new Error("JWT must have 3 parts separated by dots (header.payload.signature)");
  }

  const [rawHeader, rawPayload, rawSignature] = parts;

  let header: Record<string, unknown>;
  let payload: Record<string, unknown>;
  try {
    header = JSON.parse(base64UrlDecode(rawHeader));
  } catch (e) {
    throw new Error(`Invalid header: ${(e as Error).message}`);
  }
  try {
    payload = JSON.parse(base64UrlDecode(rawPayload));
  } catch (e) {
    throw new Error(`Invalid payload: ${(e as Error).message}`);
  }

  return {
    header,
    payload,
    signature: rawSignature,
    raw: { header: rawHeader, payload: rawPayload, signature: rawSignature },
  };
}

export function formatTimestampClaim(value: unknown): string | null {
  if (typeof value !== "number") return null;
  try {
    const date = new Date(value * 1000);
    if (Number.isNaN(date.getTime())) return null;
    return date.toISOString();
  } catch {
    return null;
  }
}

export const TIMESTAMP_CLAIMS = ["iat", "exp", "nbf", "auth_time"] as const;
