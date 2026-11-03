// ── HTML Minifier utils ────────────────────────────────────

export type Options = {
  collapseWhitespace: boolean;
  removeComments: boolean;
  shortenAttrs: boolean;
};

export const DEFAULT_OPTIONS: Options = {
  collapseWhitespace: true,
  removeComments: true,
  shortenAttrs: true,
};

const PRESERVE_TAGS = /(<(?:pre|textarea|script|style)\b[^>]*>[\s\S]*?<\/(?:pre|textarea|script|style)>)/gi;

export function minifyHtml(input: string, opts: Options): string {
  let out = input;

  const preserved: string[] = [];
  out = out.replace(PRESERVE_TAGS, (m) => {
    preserved.push(m);
    return `\u0000__PRESERVED${preserved.length - 1}__\u0000`;
  });

  if (opts.removeComments) {
    out = out.replace(/<!--(?!<!)[\s\S]*?-->/g, "");
  }
  if (opts.collapseWhitespace) {
    out = out.replace(/>\s+</g, "><")
             .replace(/\s{2,}/g, " ")
             .replace(/\s+(\/?>)/g, "$1")
             .trim();
  }
  if (opts.shortenAttrs) {
    out = out.replace(/\s(disabled|checked|readonly|required|autoplay|controls|defer|async|multiple|open|hidden|selected)=["']\1["']/gi,
      " $1");
    out = out.replace(/\s(disabled|checked|readonly|required|autoplay|controls|defer|async|multiple|open|hidden|selected)=["'](?:true|)["']/gi,
      " $1");
  }

  out = out.replace(/\u0000__PRESERVED(\d+)__\u0000/g, (_, i) => preserved[Number(i)]);
  return out;
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}
