import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/_next/'] }],
    sitemap: ['https://utilixio.com/sitemap.xml', 'https://utilixio.com/image-sitemap.xml'],
  };
}
