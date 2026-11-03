// ── Base64 to Hex utils ───────────────────────────

export type HexCase = "lower" | "upper";
export type HexSeparator = "space" | "none" | "colon" | "0x";

export type ConvertOptions = {
  hexCase: HexCase;
  separator: HexSeparator;
};

export const DEFAULT_OPTIONS: ConvertOptions = {
  hexCase: "lower",
  separator: "space",
};

export function base64ToHex(b64: string, opts: ConvertOptions): string {
  const binary = atob(b64.trim());
  const hexArr: string[] = [];
  for (let i = 0; i < binary.length; i++) {
    const h = binary.charCodeAt(i).toString(16).padStart(2, "0");
    hexArr.push(opts.hexCase === "upper" ? h.toUpperCase() : h);
  }

  switch (opts.separator) {
    case "space":
      return hexArr.join(" ");
    case "none":
      return hexArr.join("");
    case "colon":
      return hexArr.join(":");
    case "0x":
      return hexArr.map((h) => "0x" + h).join(" ");
  }
}

export function hexToBase64(hex: string): string {
  const cleaned = hex
    .replace(/0x/gi, "")
    .replace(/[^0-9a-fA-F]/g, "");

  if (cleaned.length % 2 !== 0) {
    throw new Error("Invalid hex string: odd number of characters");
  }

  let binary = "";
  for (let i = 0; i < cleaned.length; i += 2) {
    binary += String.fromCharCode(parseInt(cleaned.substring(i, i + 2), 16));
  }

  return btoa(binary);
}

export const EXAMPLE_BASE64 = `SGVsbG8sIFdvcmxkIQ==`;
export const EXAMPLE_HEX = `48 65 6c 6c 6f 2c 20 57 6f 72 6c 64 21`;
