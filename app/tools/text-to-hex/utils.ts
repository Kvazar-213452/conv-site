// ── Text to Hex utils ─────────────────────────────

export type HexSeparator = "space" | "none" | "0x" | "colon";
export type HexCase = "lower" | "upper";

export type HexOptions = {
  separator: HexSeparator;
  hexCase: HexCase;
};

export const DEFAULT_OPTIONS: HexOptions = {
  separator: "space",
  hexCase: "lower",
};

export function textToHex(text: string, opts: HexOptions): string {
  const bytes = new TextEncoder().encode(text);
  const hexArr = Array.from(bytes).map((b) => {
    const h = b.toString(16).padStart(2, "0");
    return opts.hexCase === "upper" ? h.toUpperCase() : h;
  });

  switch (opts.separator) {
    case "space":
      return hexArr.join(" ");
    case "none":
      return hexArr.join("");
    case "0x":
      return hexArr.map((h) => "0x" + h).join(" ");
    case "colon":
      return hexArr.join(":");
  }
}

export function hexToText(hex: string): string {
  const cleaned = hex
    .replace(/0x/gi, "")
    .replace(/[^0-9a-fA-F]/g, "");

  if (cleaned.length % 2 !== 0) {
    throw new Error("Invalid hex string: odd number of characters");
  }

  const bytes = new Uint8Array(cleaned.length / 2);
  for (let i = 0; i < cleaned.length; i += 2) {
    bytes[i / 2] = parseInt(cleaned.substring(i, i + 2), 16);
  }

  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

export const EXAMPLE_TEXT = `Hello, World! 🌍
UTF-8 handles all Unicode.`;

export const EXAMPLE_HEX = `48 65 6c 6c 6f 2c 20 57 6f 72 6c 64 21 20 f0 9f 8c 8d 0a 55 54 46 2d 38 20 68 61 6e 64 6c 65 73 20 61 6c 6c 20 55 6e 69 63 6f 64 65 2e`;
