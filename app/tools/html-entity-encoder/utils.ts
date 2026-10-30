// ── HTML Entity Encoder utils ───────────────────────────────

const NAMED_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "¢": "&cent;",
  "£": "&pound;",
  "¥": "&yen;",
  "€": "&euro;",
  "©": "&copy;",
  "®": "&reg;",
  "™": "&trade;",
  "§": "&sect;",
  "¶": "&para;",
  "·": "&middot;",
  "†": "&dagger;",
  "‡": "&Dagger;",
  "•": "&bull;",
  "…": "&hellip;",
  "«": "&laquo;",
  "»": "&raquo;",
  "‹": "&lsaquo;",
  "›": "&rsaquo;",
  "“": "&ldquo;",
  "”": "&rdquo;",
  "‘": "&lsquo;",
  "’": "&rsquo;",
  "–": "&ndash;",
  "—": "&mdash;",
  "±": "&plusmn;",
  "×": "&times;",
  "÷": "&divide;",
  "°": "&deg;",
  "µ": "&micro;",
  "∞": "&infin;",
  "≈": "&asymp;",
  "≠": "&ne;",
  "≤": "&le;",
  "≥": "&ge;",
  "←": "&larr;",
  "→": "&rarr;",
  "↑": "&uarr;",
  "↓": "&darr;",
  "⇐": "&lArr;",
  "⇒": "&rArr;",
  " ": "&nbsp;", // U+00A0 non-breaking space
};

export type EncodeMode = "named" | "numeric" | "hex" | "minimal";

const MINIMAL = new Set(["&", "<", ">", '"', "'"]);

export function encodeHtml(input: string, mode: EncodeMode): string {
  let out = "";
  for (const ch of input) {
    if (mode === "minimal") {
      if (MINIMAL.has(ch)) {
        out += NAMED_ENTITIES[ch];
      } else {
        out += ch;
      }
      continue;
    }

    const code = ch.codePointAt(0) ?? 0;
    const isAscii = code >= 0x20 && code < 0x7f;
    if (isAscii && !MINIMAL.has(ch)) {
      out += ch;
      continue;
    }
    if (mode === "named" && NAMED_ENTITIES[ch]) {
      out += NAMED_ENTITIES[ch];
      continue;
    }
    if (mode === "hex") {
      out += `&#x${code.toString(16).toUpperCase()};`;
      continue;
    }
    out += `&#${code};`;
  }
  return out;
}

const NAMED_LOOKUP: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'",
  nbsp: " ", copy: "©", reg: "®", trade: "™",
  cent: "¢", pound: "£", yen: "¥", euro: "€",
  sect: "§", para: "¶", middot: "·", dagger: "†", Dagger: "‡", bull: "•", hellip: "…",
  laquo: "«", raquo: "»", lsaquo: "‹", rsaquo: "›",
  ldquo: "“", rdquo: "”", lsquo: "‘", rsquo: "’",
  ndash: "–", mdash: "—", plusmn: "±", times: "×", divide: "÷",
  deg: "°", micro: "µ", infin: "∞", asymp: "≈", ne: "≠", le: "≤", ge: "≥",
  larr: "←", rarr: "→", uarr: "↑", darr: "↓", lArr: "⇐", rArr: "⇒",
};

export function decodeHtml(input: string): string {
  return input.replace(/&(#x[0-9a-fA-F]+|#[0-9]+|[A-Za-z][A-Za-z0-9]+);/g, (match, body) => {
    if (body[0] === "#") {
      const num = body[1] === "x" || body[1] === "X"
        ? parseInt(body.slice(2), 16)
        : parseInt(body.slice(1), 10);
      if (!Number.isFinite(num)) return match;
      try { return String.fromCodePoint(num); } catch { return match; }
    }
    return NAMED_LOOKUP[body] ?? match;
  });
}
