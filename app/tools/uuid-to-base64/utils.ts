// ── UUID ↔ Base64 conversion utilities ───────────────────────

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const BASE64_UUID_RE = /^[A-Za-z0-9+/]{22}(==)?$|^[A-Za-z0-9_-]{22}(==)?$/;

function uuidToBytes(uuid: string): Uint8Array {
  const hex = uuid.replace(/-/g, "");
  const bytes = new Uint8Array(16);
  for (let i = 0; i < 16; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

function bytesToUuid(bytes: Uint8Array): string {
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20),
  ].join("-");
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

function bytesToBase64Url(bytes: Uint8Array): string {
  return bytesToBase64(bytes)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64ToBytes(b64: string): Uint8Array {
  const std = b64.replace(/-/g, "+").replace(/_/g, "/").replace(/=+$/, "");
  const padded = std + "==".slice(0, (4 - (std.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function uuidsToBase64(raw: string, urlSafe: boolean): string {
  const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) throw new Error("Input is empty.");

  return lines.map((line) => {
    if (!UUID_RE.test(line)) {
      throw new Error(
        `Invalid UUID: "${line}"\nExpected format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
      );
    }
    const bytes = uuidToBytes(line);
    return urlSafe ? bytesToBase64Url(bytes) : bytesToBase64(bytes);
  }).join("\n");
}

export function base64sToUuid(raw: string): string {
  const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) throw new Error("Input is empty.");

  return lines.map((line) => {
    if (!BASE64_UUID_RE.test(line)) {
      throw new Error(
        `Invalid Base64 UUID: "${line}"\nExpected 22-character Base64 string (standard or URL-safe).`
      );
    }
    const bytes = base64ToBytes(line);
    if (bytes.length !== 16) {
      throw new Error(`"${line}" does not decode to 16 bytes (got ${bytes.length}).`);
    }
    return bytesToUuid(bytes);
  }).join("\n");
}