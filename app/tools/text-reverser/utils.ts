// ── Text Reverser utils ────────────────────────────────────

export type Mode = "characters" | "words" | "lines" | "lines-each";

export function reverseText(input: string, mode: Mode): string {
  switch (mode) {
    case "characters":
      return [...input].reverse().join("");
    case "words":
      return input.split(/(\s+)/).reverse().join("");
    case "lines":
      return input.split("\n").reverse().join("\n");
    case "lines-each":
      return input.split("\n").map((l) => [...l].reverse().join("")).join("\n");
  }
}
