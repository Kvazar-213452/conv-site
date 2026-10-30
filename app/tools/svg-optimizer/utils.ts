// ── SVG Optimizer utils ─────────────────────────────────────
// Pragmatic SVG minifier — safe regex-based cleanups that cover
// the vast majority of hand-written and exported SVGs. Not SVGO.

export type SvgOptions = {
  removeComments: boolean;
  removeMetadata: boolean;
  removeXmlDecl: boolean;
  removeEditorAttrs: boolean;
  shortenHexColors: boolean;
  roundNumbers: boolean;
  decimals: number;
  collapseWhitespace: boolean;
};

export const DEFAULT_SVG_OPTIONS: SvgOptions = {
  removeComments: true,
  removeMetadata: true,
  removeXmlDecl: true,
  removeEditorAttrs: true,
  shortenHexColors: true,
  roundNumbers: true,
  decimals: 2,
  collapseWhitespace: true,
};

export type OptimizeResult = {
  output: string;
  before: number;
  after: number;
  savedPercent: number;
};

const EDITOR_ATTRS = /\s+(?:xmlns:(?:dc|cc|rdf|sodipodi|inkscape|xlink)|sodipodi:[a-zA-Z-]+|inkscape:[a-zA-Z-]+|dc:[a-zA-Z-]+|cc:[a-zA-Z-]+|rdf:[a-zA-Z-]+|xml:space|data-name)="[^"]*"/g;

function roundNumber(value: string, decimals: number): string {
  return value.replace(/-?\d+\.\d+/g, (m) => {
    const n = Number(m);
    if (!Number.isFinite(n)) return m;
    const rounded = Number(n.toFixed(decimals));
    return rounded.toString();
  });
}

export function optimizeSvg(input: string, opts: SvgOptions): OptimizeResult {
  const before = new Blob([input]).size;
  let out = input;

  if (opts.removeXmlDecl) {
    out = out.replace(/<\?xml[^>]*\?>\s*/g, "");
    out = out.replace(/<!DOCTYPE[^>]*>\s*/g, "");
  }
  if (opts.removeComments) {
    out = out.replace(/<!--[\s\S]*?-->/g, "");
  }
  if (opts.removeMetadata) {
    out = out.replace(/<metadata\b[\s\S]*?<\/metadata>/g, "");
    out = out.replace(/<title\b[\s\S]*?<\/title>/g, "");
    out = out.replace(/<desc\b[\s\S]*?<\/desc>/g, "");
    out = out.replace(/<sodipodi:[\s\S]*?\/>/g, "");
  }
  if (opts.removeEditorAttrs) {
    out = out.replace(EDITOR_ATTRS, "");
  }
  if (opts.shortenHexColors) {
    out = out.replace(/#([0-9a-fA-F])\1([0-9a-fA-F])\2([0-9a-fA-F])\3\b/g, "#$1$2$3");
  }
  if (opts.roundNumbers) {
    out = roundNumber(out, Math.max(0, Math.min(opts.decimals, 6)));
  }
  if (opts.collapseWhitespace) {
    out = out
      .replace(/>\s+</g, "><")
      .replace(/\s{2,}/g, " ")
      .replace(/\s+(\/?>)/g, "$1")
      .trim();
  }

  const after = new Blob([out]).size;
  const savedPercent = before === 0 ? 0 : Math.round(((before - after) / before) * 100);

  return { output: out, before, after, savedPercent };
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}
