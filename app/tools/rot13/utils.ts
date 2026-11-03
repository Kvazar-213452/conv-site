// ── ROT13 / ROT47 utils ────────────────────────────────────

export type Variant = "rot13" | "rot47" | "caesar";

function rotAt(ch: string, shift: number): string {
  const code = ch.charCodeAt(0);
  if (code >= 65 && code <= 90)  return String.fromCharCode(((code - 65 + shift) % 26 + 26) % 26 + 65);
  if (code >= 97 && code <= 122) return String.fromCharCode(((code - 97 + shift) % 26 + 26) % 26 + 97);
  return ch;
}

export function rot13(input: string): string {
  return [...input].map((c) => rotAt(c, 13)).join("");
}

export function caesar(input: string, shift: number): string {
  return [...input].map((c) => rotAt(c, shift)).join("");
}

export function rot47(input: string): string {
  let out = "";
  for (let i = 0; i < input.length; i++) {
    const c = input.charCodeAt(i);
    if (c >= 33 && c <= 126) out += String.fromCharCode(33 + ((c - 33 + 47) % 94));
    else out += input[i];
  }
  return out;
}
