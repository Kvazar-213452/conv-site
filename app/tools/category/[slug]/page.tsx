import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { notFound } from 'next/navigation';
import { toolCategories } from '@/lib/tool-categories';
import { toolCatalog } from '@/lib/tool-catalog';
import { pageMetadata } from '@/component/ContentSeo';
import { MAIN_DOMEN_NO, NAME_MAKE } from '@/lib/config';
import '@/style/main.css';
import '@/style/catalog.css';

type Props = { params: Promise<{ slug: string }> };

const seoTitles: Record<string, string> = {
  files: 'Free Online PDF, Photo & Media Tools',
  numbers: 'Free Online Calculators & Everyday Math Tools',
  data: 'Free Online JSON & Data Conversion Tools',
  code: 'Free Online Code Generators & Database Tools',
  text: 'Free Online Text Editing & List Tools',
  encoding: 'Free Online Encoding & Decoding Tools',
  security: 'Free Online Security, Hash & ID Generator Tools',
  web: 'Free Online Web & SEO Tools',
  live: 'Free Online Live Lookup Tools',
  ai: 'Free AI Writing Helpers & Content Generators',
  css: 'Free Online CSS Generators & Design Tools',
};

const seoDescriptions: Record<string, string> = {
  files: 'Merge, compress and convert PDFs. Resize, crop and convert images. Trim and normalize WAV audio. All free, no sign-up required.',
  numbers: 'Calculate loans, tips, grades, calories, mortgages, conversions and everyday math. Free online calculators with instant results.',
  data: 'Format, validate, convert and transform JSON, CSV, XML, YAML and other structured data formats. Free browser-based tools.',
  code: 'Generate TypeScript interfaces, Go structs, Python dataclasses, SQL schemas and more from JSON. Free code generation tools.',
  text: 'Count words, compare text, find and replace, sort lines, remove duplicates and clean up text. Free online text utilities.',
  encoding: 'Convert between Base64, hex, binary, URL encoding, Unicode escapes and more. Free encoding and decoding tools.',
  security: 'Generate UUIDs, decode JWTs, create hashes, check password strength and inspect certificates. Free security tools.',
  web: 'Build meta tags, generate robots.txt, test regex, parse URLs, create QR codes and optimize for SEO. Free web tools.',
  live: 'Look up weather, DNS records, IP geolocation, npm packages, ISBN books and more. Free live data lookups.',
  ai: 'Write emails, generate content, create outlines, summarize text and draft business documents with AI. Free AI writing tools.',
  css: 'Generate gradients, shadows, grids, flexbox layouts, animations and color palettes. Free CSS generator tools.',
};

export function generateStaticParams() {
  return toolCategories.map(c => ({ slug: c.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = toolCategories.find(c => c.id === slug);
  if (!cat) return {};
  const title = seoTitles[slug] ?? `Free ${cat.name} Tools`;
  const description = seoDescriptions[slug] ?? cat.description;
  return pageMetadata(title, description, `/tools/category/${slug}`);
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const cat = toolCategories.find(c => c.id === slug);
  if (!cat) notFound();

  const tools = toolCatalog.filter(t => t.category === slug).sort((a, b) => a.title.localeCompare(b.title, 'en'));
  const otherCategories = toolCategories.filter(c => c.id !== slug);

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${MAIN_DOMEN_NO}/tools/category/${slug}#page`,
        name: seoTitles[slug] ?? cat.name,
        description: seoDescriptions[slug] ?? cat.description,
        url: `${MAIN_DOMEN_NO}/tools/category/${slug}`,
        isPartOf: { '@id': `${MAIN_DOMEN_NO}/#website` },
        numberOfItems: tools.length,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: MAIN_DOMEN_NO },
          { '@type': 'ListItem', position: 2, name: 'Tools', item: `${MAIN_DOMEN_NO}/#tools` },
          { '@type': 'ListItem', position: 3, name: cat.name, item: `${MAIN_DOMEN_NO}/tools/category/${slug}` },
        ],
      },
    ],
  };

  return (
    <div className="catalog-home">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
      />

      <section className="category-hero">
        <nav className="category-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/#tools">Tools</Link>
          <span>/</span>
          <span>{cat.name}</span>
        </nav>

        <div className="category-heading">
          <span className="directory-kicker" aria-hidden="true">{cat.symbol} {cat.name.toUpperCase()}</span>
          <h1>{seoTitles[slug] ?? `Free ${cat.name} Tools`}</h1>
          <p>{seoDescriptions[slug] ?? cat.description}</p>
          <p className="category-count">{tools.length} free tools in this category. No sign-up required.</p>
        </div>
      </section>

      <section className="category-tools" aria-label="Tools in this category">
        <div className="directory-card-grid category-grid">
          {tools.map(tool => (
            <Link prefetch={false} className="directory-card" key={tool.slug} href={tool.href}>
              <div>
                <h2>{tool.title}</h2>
                {tool.recent && <span className="directory-new">NEW</span>}
              </div>
              <p>{tool.description}</p>
              <span className="directory-open">Open tool <ArrowRight size={14} aria-hidden="true" /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="category-related" aria-labelledby="related-categories">
        <h2 id="related-categories">Browse other categories</h2>
        <div className="category-related-grid">
          {otherCategories.map(c => (
            <Link key={c.id} href={`/tools/category/${c.id}`} className="category-related-card">
              <span className="category-related-symbol" aria-hidden="true">{c.symbol}</span>
              <div>
                <h3>{c.name}</h3>
                <p>{c.description}</p>
              </div>
              <span className="category-related-count">{toolCatalog.filter(t => t.category === c.id).length} tools</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="category-about">
        <h2>About {cat.name.toLowerCase()} tools</h2>
        <p>{seoDescriptions[slug] ?? cat.description} Browse all {tools.length} tools above or use the <Link href="/#tools">main tool directory</Link> to search across every category. Each tool works in your browser and is free to use without creating an account.</p>
      </section>
    </div>
  );
}
