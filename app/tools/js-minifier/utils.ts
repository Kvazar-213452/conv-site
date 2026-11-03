// ── JavaScript Minifier utils ──────────────────────────────
// Comment- and whitespace-level minifier. No AST, no identifier mangling.
// Produces safe, debuggable output suitable for inline <script> blocks
// where you want smaller bytes without build tooling.

export function minifyJs(input: string): string {
  const PH = "\u0000";
  const strings: string[] = [];

  // Preserve string literals and regex literals.
  let src = input.replace(/\/\*[\s\S]*?\*\//g, "")                       // block comments
                 .replace(/(^|[^\\:])\/\/[^\n]*/g, "$1");                // line comments

  src = src.replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`/g, (m) => {
    strings.push(m);
    return `${PH}${strings.length - 1}${PH}`;
  });

  src = src
    .replace(/\s*([{};:,=()<>+\-*/%&|!?\[\]])\s*/g, "$1")
    .replace(/\s+/g, " ")
    .replace(/;}/g, "}")
    .replace(/;\s*$/, ";")
    .trim();

  src = src.replace(new RegExp(`${PH}(\\d+)${PH}`, "g"), (_, i) => strings[Number(i)]);
  return src;
}
