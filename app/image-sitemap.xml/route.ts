import { toolCatalog } from '@/lib/tool-catalog';
import { blogPosts, blogVisual } from '@/lib/blog-catalog';

const SITE = 'https://utilixio.com';

export function GET() {
  const tools = toolCatalog.map(tool => `  <url>
    <loc>${SITE}${esc(tool.href)}</loc>
    <image:image>
      <image:loc>${SITE}${esc(tool.href)}/opengraph-image</image:loc>
      <image:title>${esc(tool.title)} — Free Online Tool</image:title>
    </image:image>
  </url>`);

  const articles = blogPosts.map(article => {
    const visual = blogVisual(article.slug);
    return `  <url>
    <loc>${SITE}/blog/${esc(article.slug)}</loc>
    <image:image>
      <image:loc>${SITE}${esc(visual.image)}</image:loc>
      <image:title>${esc(article.title)}</image:title>
    </image:image>
  </url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${tools.join('\n')}
${articles.join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
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
