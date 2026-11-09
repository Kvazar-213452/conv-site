import { expansionArticles } from '@/lib/expansion-articles';

const SITE = 'https://utilixio.com';

export function GET() {
  const items = [...expansionArticles]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 50)
    .map(article => `    <item>
      <title>${esc(article.title)}</title>
      <link>${SITE}/blog/${esc(article.slug)}</link>
      <guid isPermaLink="true">${SITE}/blog/${esc(article.slug)}</guid>
      <description>${esc(article.description)}</description>
      <pubDate>${new Date(`${article.date}T00:00:00Z`).toUTCString()}</pubDate>
    </item>`)
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Utilixio — Practical Guides</title>
    <link>${SITE}/blog</link>
    <description>How-to guides for everyday online tools: PDF, calculators, SEO, coding, AI writing and more.</description>
    <language>en</language>
    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

function esc(value: string) {
  return value
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\ufffe\uffff]/g, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
