// ── URL Encode / Decode utilities ────────────────────────────

type EncodeMode = "component" | "full" | "form";

/** Encode a string using the selected mode, one line at a time */
export function encodeUrl(raw: string, mode: EncodeMode): string {
  const lines = raw.split("\n");
  return lines.map((line) => {
    switch (mode) {
      case "component":
        return encodeURIComponent(line);
      case "full":
        return encodeURI(line);
      case "form":
        // application/x-www-form-urlencoded: spaces → +, rest like encodeURIComponent
        return encodeURIComponent(line).replace(/%20/g, "+");
    }
  }).join("\n");
}

/** Decode a percent-encoded string, one line at a time */
export function decodeUrl(raw: string): string {
  const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) throw new Error("Input is empty.");

  return lines.map((line) => {
    try {
      // Normalize form-encoded + → %20 before decoding
      const normalized = line.replace(/\+/g, "%20");
      return decodeURIComponent(normalized);
    } catch {
      throw new Error(
        `Invalid percent-encoding: "${line}"\nMake sure all % sequences are valid (e.g. %20, %2F).`
      );
    }
  }).join("\n");
}