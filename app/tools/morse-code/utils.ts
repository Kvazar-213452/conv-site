// ── Morse Code utils ───────────────────────────────────────

const MORSE: Record<string, string> = {
  A:".-", B:"-...", C:"-.-.", D:"-..", E:".", F:"..-.", G:"--.", H:"....",
  I:"..", J:".---", K:"-.-", L:".-..", M:"--", N:"-.", O:"---", P:".--.",
  Q:"--.-", R:".-.", S:"...", T:"-", U:"..-", V:"...-", W:".--", X:"-..-",
  Y:"-.--", Z:"--..",
  "0":"-----","1":".----","2":"..---","3":"...--","4":"....-",
  "5":".....","6":"-....","7":"--...","8":"---..","9":"----.",
  ".":".-.-.-", ",":"--..--", "?":"..--..", "'":".----.", "!":"-.-.--",
  "/":"-..-.", "(":"-.--.", ")":"-.--.-", "&":".-...", ":":"---...",
  ";":"-.-.-.", "=":"-...-", "+":".-.-.", "-":"-....-", "_":"..--.-",
  '"':".-..-.", "$":"...-..-", "@":".--.-.",
};

const DECODE: Record<string, string> = Object.fromEntries(
  Object.entries(MORSE).map(([k, v]) => [v, k])
);

export function textToMorse(input: string): string {
  return input
    .toUpperCase()
    .split("\n")
    .map((line) =>
      line
        .split(/\s+/)
        .map((word) =>
          [...word].map((ch) => MORSE[ch] ?? "").filter(Boolean).join(" ")
        )
        .filter(Boolean)
        .join(" / ")
    )
    .join("\n");
}

export function morseToText(input: string): string {
  return input
    .split("\n")
    .map((line) =>
      line
        .trim()
        .split(/\s*\/\s*/)
        .map((word) =>
          word
            .split(/\s+/)
            .map((sym) => DECODE[sym] ?? "")
            .join("")
        )
        .join(" ")
    )
    .join("\n");
}
