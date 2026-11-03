// ── Meta Tag Generator utils ───────────────────────────────

export type MetaInput = {
  title: string;
  description: string;
  url: string;
  siteName: string;
  author: string;
  keywords: string;
  image: string;
  twitterHandle: string;
  robots: string;
  type: string;
  locale: string;
};

export const DEFAULT_INPUT: MetaInput = {
  title: "My Awesome Page",
  description: "A short, keyword-rich description under 160 characters.",
  url: "https://example.com/page",
  siteName: "Example",
  author: "Jane Doe",
  keywords: "example, demo, meta tags",
  image: "https://example.com/og-image.png",
  twitterHandle: "@example",
  robots: "index, follow",
  type: "website",
  locale: "en_US",
};

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function generateMetaTags(m: MetaInput): string {
  const lines: string[] = [];
  lines.push(`<title>${esc(m.title)}</title>`);
  lines.push(`<meta name="description" content="${esc(m.description)}">`);
  if (m.keywords) lines.push(`<meta name="keywords" content="${esc(m.keywords)}">`);
  if (m.author)   lines.push(`<meta name="author" content="${esc(m.author)}">`);
  if (m.robots)   lines.push(`<meta name="robots" content="${esc(m.robots)}">`);
  if (m.url)      lines.push(`<link rel="canonical" href="${esc(m.url)}">`);
  lines.push("");
  lines.push("<!-- Open Graph / Facebook -->");
  lines.push(`<meta property="og:type" content="${esc(m.type)}">`);
  lines.push(`<meta property="og:title" content="${esc(m.title)}">`);
  lines.push(`<meta property="og:description" content="${esc(m.description)}">`);
  if (m.url)      lines.push(`<meta property="og:url" content="${esc(m.url)}">`);
  if (m.siteName) lines.push(`<meta property="og:site_name" content="${esc(m.siteName)}">`);
  if (m.image)    lines.push(`<meta property="og:image" content="${esc(m.image)}">`);
  if (m.locale)   lines.push(`<meta property="og:locale" content="${esc(m.locale)}">`);
  lines.push("");
  lines.push("<!-- Twitter / X -->");
  lines.push(`<meta name="twitter:card" content="${m.image ? "summary_large_image" : "summary"}">`);
  lines.push(`<meta name="twitter:title" content="${esc(m.title)}">`);
  lines.push(`<meta name="twitter:description" content="${esc(m.description)}">`);
  if (m.image)         lines.push(`<meta name="twitter:image" content="${esc(m.image)}">`);
  if (m.twitterHandle) lines.push(`<meta name="twitter:site" content="${esc(m.twitterHandle)}">`);
  return lines.join("\n");
}
