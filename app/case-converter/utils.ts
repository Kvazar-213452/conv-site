// ── Case Converter utils ─────────────────────────────

export type CaseType =
  | "upper"
  | "lower"
  | "title"
  | "sentence"
  | "camel"
  | "pascal"
  | "snake"
  | "kebab"
  | "constant"
  | "alternating"
  | "inverse";

export type CaseOptions = {
  preserveNewlines: boolean;
  trimLines: boolean;
};

export type CaseResult = {
  output: string;
  charCount: number;
  wordCount: number;
  lineCount: number;
};

export const DEFAULT_OPTIONS: CaseOptions = {
  preserveNewlines: true,
  trimLines: false,
};

export const CASE_LABELS: Record<CaseType, string> = {
  upper: "UPPER CASE",
  lower: "lower case",
  title: "Title Case",
  sentence: "Sentence case",
  camel: "camelCase",
  pascal: "PascalCase",
  snake: "snake_case",
  kebab: "kebab-case",
  constant: "CONSTANT_CASE",
  alternating: "aLtErNaTiNg",
  inverse: "iNVERSE cASE",
};

function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, (word) =>
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );
}

function toSentenceCase(str: string): string {
  return str
    .split(/([.!?]\s+)/)
    .map((segment, i) =>
      i % 2 === 0
        ? segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase()
        : segment
    )
    .join("");
}

function toCamelCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase());
}

function toPascalCase(str: string): string {
  const camel = toCamelCase(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

function toSnakeCase(str: string): string {
  return str
    .trim()
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[\s\-]+/g, "_")
    .toLowerCase();
}

function toKebabCase(str: string): string {
  return str
    .trim()
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

function toConstantCase(str: string): string {
  return toSnakeCase(str).toUpperCase();
}

function toAlternatingCase(str: string): string {
  return str
    .split("")
    .map((char, i) => (i % 2 === 0 ? char.toLowerCase() : char.toUpperCase()))
    .join("");
}

function toInverseCase(str: string): string {
  return str
    .split("")
    .map((char) =>
      char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
    )
    .join("");
}

export function convertCase(
  text: string,
  caseType: CaseType,
  opts: CaseOptions
): CaseResult {
  const processLine = (line: string): string => {
    const l = opts.trimLines ? line.trim() : line;
    switch (caseType) {
      case "upper":      return l.toUpperCase();
      case "lower":      return l.toLowerCase();
      case "title":      return toTitleCase(l);
      case "sentence":   return toSentenceCase(l);
      case "camel":      return toCamelCase(l);
      case "pascal":     return toPascalCase(l);
      case "snake":      return toSnakeCase(l);
      case "kebab":      return toKebabCase(l);
      case "constant":   return toConstantCase(l);
      case "alternating":return toAlternatingCase(l);
      case "inverse":    return toInverseCase(l);
      default:           return l;
    }
  };

  let output: string;
  if (opts.preserveNewlines) {
    output = text.split("\n").map(processLine).join("\n");
  } else {
    output = processLine(text.replace(/\n/g, " "));
  }

  const lineCount = text.split("\n").length;
  const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const charCount = text.length;

  return { output, charCount, wordCount, lineCount };
}

export const EXAMPLE_INPUTS = [
  `the quick brown fox jumps over the lazy dog`,
  `Hello World\nThis is a Test\nFoo Bar Baz`,
  `myVariableName = someFunction(paramOne, paramTwo)`,
  `BREAKING NEWS: Scientists Discover New Species\nMore details to follow`,
];