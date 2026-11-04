import type { Metadata } from 'next';
import Link from 'next/link';
import { MAIN_DOMEN_NO, NAME_MAKE } from '@/lib/config';
import { expansionArticles, type ExpansionArticle } from '@/lib/expansion-articles';
import { type ExpansionTool } from '@/lib/expansion-tools';
import '@/style/main.css';
export function pageMetadata(title: string, description: string, path: string, article = false): Metadata {
  return {
    title, description, alternates: { canonical: path },
    robots: { index: true, follow: true },
    openGraph: { title, description, url: MAIN_DOMEN_NO + path, type: article ? 'article' : 'website', images: [{ url: '/og-image.png', width: 1024, height: 1024, alt: title }], ...(article ? { publishedTime: '2026-11-03T00:00:00Z', modifiedTime: '2026-11-03T00:00:00Z' } : {}) },
    twitter: { card: 'summary_large_image', title, description, images: ['/og-image.png'] },
  };
}
export function PageSchema({ title, description, path, kind, date }: { title: string; description: string; path: string; kind: 'article' | 'tool'; date?: string }) {
  const url = MAIN_DOMEN_NO + path;
  const organization = { '@type': 'Organization', name: NAME_MAKE, url: MAIN_DOMEN_NO };
  const section = kind === 'tool' ? { name: 'Developer tools', path: '/' } : { name: 'Developer blog', path: '/blog' };
  const data = {
    '@context': 'https://schema.org', '@graph': [
      kind === 'tool' ? { '@type': 'WebApplication', '@id': url + '#app', name: title, description, url, ...(date ? { dateModified: date } : {}), applicationCategory: 'DeveloperApplication', operatingSystem: 'Any', browserRequirements: 'Requires JavaScript and a modern browser', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } } : { '@type': 'BlogPosting', '@id': url + '#article', headline: title, description, url, mainEntityOfPage: url, image: MAIN_DOMEN_NO + '/og-image.png', datePublished: date, dateModified: date, author: organization, publisher: organization, inLanguage: 'en' },
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: section.name, item: MAIN_DOMEN_NO + section.path }, { '@type': 'ListItem', position: 2, name: title, item: url }] },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}
export function ToolGuide({ tool }: { tool: ExpansionTool }) {
  const articles = expansionArticles.filter(a => (tool.articles as readonly string[]).includes(a.slug));
  return <section className="seo-content">
    <h2>How to use {tool.title}</h2>
    <ol><li>Paste your input or load the included example.</li><li>{tool.reverse ? 'Choose the conversion direction and check the expected format.' : 'Check the input format described above the editor.'}</li><li>Select {tool.forward}, then inspect the result or any validation message.</li><li>Copy or download the output for your workflow.</li></ol>
    <h3>Format and limitations</h3><p>{tool.note}</p>
    <h3>Example input</h3><pre className="output-pre">{tool.example}</pre>
    <h3>Practical guides</h3><ul>{articles.map(a => <li key={a.slug}><Link href={'/blog/' + a.slug}>{a.title}</Link> — {a.description}</li>)}</ul>
    <h3>Does this tool upload my input?</h3><p>The transformation runs in your browser. This tool does not send input to a conversion API. Browser memory limits still apply; split very large inputs into manageable batches.</p>
    <p><Link href="/">Browse all developer tools</Link></p>
  </section>;
}
export function ArticleContent({ article }: { article: ExpansionArticle }) {
  const related = expansionArticles.filter(a => a.tool === article.tool && a.slug !== article.slug);
  return <article>
    <nav aria-label="Breadcrumb"><Link href="/">Home</Link> / <Link href="/blog">Blog</Link> / <span>{article.title}</span></nav>
    <header className="hero"><div className="hero-eyebrow">Practical developer guide</div><h1>{article.title}</h1><p>{article.description}</p><p>By {NAME_MAKE} · <time dateTime={article.date}>November 3, 2026</time></p></header>
    <div className="seo-content">
      <p>{article.intro}</p>
      <nav aria-label="Table of contents"><h2>In this guide</h2><ul>{article.sections.map((s, i) => <li key={s.heading}><a href={'#section-' + i}>{s.heading}</a></li>)}</ul></nav>
      {article.sections.map((s, i) => <section key={s.heading} aria-labelledby={'section-' + i}><h2 id={'section-' + i}>{s.heading}</h2><p>{s.body}</p></section>)}
      <h2>Worked example</h2><pre className="output-pre">{article.example}</pre>
      <p><Link className="btn-secondary" href={'/tools/' + article.tool}>Try the related tool</Link></p>
      <h2>{article.question}</h2><p>{article.answer}</p>
      <h2>Reference and further reading</h2><p><a href={article.source} target="_blank" rel="noopener noreferrer">Official specification or documentation</a></p>
      <ul>{related.map(a => <li key={a.slug}><Link href={'/blog/' + a.slug}>{a.title}</Link></li>)}</ul>
      <p><Link href="/blog">Browse all developer guides</Link></p>
    </div>
  </article>;
}
