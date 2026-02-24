// ── String ↔ Base64 conversion utilities ─────────────────────

/** Encode a UTF-8 string to Base64 */
export function stringToBase64(raw: string, urlSafe: boolean): string {
  const lines = raw.split("\n");
  return lines.map((line) => {
    const b64 = btoa(unescape(encodeURIComponent(line)));
    return urlSafe
      ? b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
      : b64;
  }).join("\n");
}

/** Decode Base64 (standard or URL-safe) back to UTF-8 string */
export function base64ToString(raw: string): string {
  const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) throw new Error("Input is empty.");

  return lines.map((line) => {
    try {
      const std = line.replace(/-/g, "+").replace(/_/g, "/");
      const padded = std + "==".slice(0, (4 - (std.length % 4)) % 4);
      return decodeURIComponent(escape(atob(padded)));
    } catch {
      throw new Error(
        `Invalid Base64: "${line}"\nMake sure the string is valid standard or URL-safe Base64.`
      );
    }
  }).join("\n");
}