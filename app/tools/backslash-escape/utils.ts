// ── Backslash Escape utils ─────────────────────────

export type EscapeMode = "json" | "javascript" | "python" | "html" | "url";

const JSON_MAP: Record<string, string> = {
  '"': '\\"',
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "\t": "\\t",
};

const JS_MAP: Record<string, string> = {
  ...JSON_MAP,
  "'": "\\'",
  "`": "\\`",
  "\0": "\\0",
};

const PYTHON_MAP: Record<string, string> = {
  ...JSON_MAP,
  "'": "\\'",
  "\0": "\\0",
  "\x1b": "\\x1b",
};

export function escapeString(input: string, mode: EscapeMode): string {
  switch (mode) {
    case "json":
      return input.replace(/[\\"\\\/\b\f\n\r\t]/g, (ch) => JSON_MAP[ch] ?? ch);
    case "javascript":
      return input.replace(/[\\'"` \b\f\n\r\t\0]/g, (ch) => JS_MAP[ch] ?? ch);
    case "python":
      return input.replace(/[\\'"  \b\f\n\r\t\0\x1b]/g, (ch) => PYTHON_MAP[ch] ?? ch);
    case "html":
      return input
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    case "url":
      return encodeURIComponent(input);
  }
}

export function unescapeString(input: string, mode: EscapeMode): string {
  switch (mode) {
    case "json":
    case "javascript":
    case "python":
      return input
        .replace(/\\n/g, "\n")
        .replace(/\\r/g, "\r")
        .replace(/\\t/g, "\t")
        .replace(/\\b/g, "\b")
        .replace(/\\f/g, "\f")
        .replace(/\\0/g, "\0")
        .replace(/\\'/g, "'")
        .replace(/\\`/g, "`")
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, "\\");
    case "html":
      return input
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&gt;/g, ">")
        .replace(/&lt;/g, "<")
        .replace(/&amp;/g, "&");
    case "url":
      return decodeURIComponent(input);
  }
}

export const MODE_LABELS: Record<EscapeMode, string> = {
  json: "JSON",
  javascript: "JavaScript",
  python: "Python",
  html: "HTML",
  url: "URL",
};

export const EXAMPLE_INPUTS: Record<EscapeMode, string> = {
  json: 'Hello "World"\nLine two\tTabbed',
  javascript: "It's a \"test\"\nPath: C:\\Users\\name",
  python: "Line 1\nLine 2\t\"quoted\" and 'single'",
  html: '<script>alert("XSS")</script> & "quotes"',
  url: "hello world?foo=bar&baz=qux#section",
};
