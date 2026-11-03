// ── Binary ↔ Text utils ────────────────────────────────────

export function textToBinary(text: string): string {
  const bytes = new TextEncoder().encode(text);
  return [...bytes].map((b) => b.toString(2).padStart(8, "0")).join(" ");
}

export function binaryToText(bits: string): string {
  const cleaned = bits.replace(/[^01]/g, "");
  if (cleaned.length === 0) return "";
  if (cleaned.length % 8 !== 0) throw new Error(`Length ${cleaned.length} is not a multiple of 8`);
  const bytes = new Uint8Array(cleaned.length / 8);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(cleaned.slice(i * 8, i * 8 + 8), 2);
  }
  return new TextDecoder("utf-8", { fatal: false }).decode(bytes);
}
