import type { Metadata } from 'next';
import Link from 'next/link';
import { MAIN_DOMEN_NO, NAME_MAKE } from '@/lib/config';
import { expansionArticles, type ExpansionArticle } from '@/lib/expansion-articles';
import { type ExpansionTool } from '@/lib/expansion-tools';
import '@/style/main.css';
import Image from 'next/image';
import { blogVisual, blogDate, articleMinutes } from '@/lib/blog-catalog';
export function pageMetadata(title: string, description: string, path: string, article = false): Metadata {
  const post = article ? expansionArticles.find(a => path === '/blog/' + a.slug) : undefined;
  const visual = article ? blogVisual(path.split('/').pop()!) : undefined;
  const image = visual?.image ?? '/og-image.png';
  return {
    title, description, alternates: { canonical: path },
    robots: { index: true, follow: true },
    openGraph: { title, description, url: MAIN_DOMEN_NO + path, type: article ? 'article' : 'website', images: [{ url: image, width: article ? 1440 : 1024, height: article ? 900 : 1024, alt: visual?.alt ?? title }], ...(post ? { publishedTime: post.date + 'T00:00:00Z', modifiedTime: post.date + 'T00:00:00Z' } : {}) },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}
export function PageSchema({ title, description, path, kind, date, faq }: { title: string; description: string; path: string; kind: 'article' | 'tool'; date?: string; faq?: { question: string; answer: string } }) {
  const url = MAIN_DOMEN_NO + path;
  const organization = { '@type': 'Organization', name: NAME_MAKE, url: MAIN_DOMEN_NO };
  const section = kind === 'tool' ? { name: 'Developer tools', path: '/' } : { name: 'Developer blog', path: '/blog' };
  const graph: Record<string, unknown>[] = [
    kind === 'tool' ? { '@type': 'WebApplication', '@id': url + '#app', name: title, description, url, ...(date ? { dateModified: date } : {}), applicationCategory: 'DeveloperApplication', operatingSystem: 'Any', browserRequirements: 'Requires JavaScript and a modern browser', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } } : { '@type': 'BlogPosting', '@id': url + '#article', headline: title, description, url, mainEntityOfPage: url, image: MAIN_DOMEN_NO + blogVisual(path.split('/').pop()!).image, datePublished: date, dateModified: date, author: organization, publisher: organization, inLanguage: 'en' },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: section.name, item: MAIN_DOMEN_NO + section.path }, { '@type': 'ListItem', position: 2, name: title, item: url }] },
  ];
  if (faq) {
    graph.push({ '@type': 'FAQPage', '@id': url + '#faq', mainEntity: [{ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } }] });
  }
  const data = { '@context': 'https://schema.org', '@graph': graph };
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
  const related = expansionArticles.filter(a => a.slug !== article.slug).map(a=>({article:a,score:(a.tool===article.tool?2:0)+(blogVisual(a.slug).topic===blogVisual(article.slug).topic?1:0)})).sort((a,b)=>b.score-a.score).slice(0,3).map(a=>a.article);
  const visual=blogVisual(article.slug);
  return <article className="journal-article">
    <nav className="journal-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/blog">Journal</Link><span>/</span><span>{visual.topic}</span></nav>
    <header className="journal-article-header"><span className="journal-tag">{visual.topic}</span><h1>{article.title}</h1><p className="journal-deck">{article.description}</p><div className="journal-byline"><span className="journal-avatar" aria-hidden="true">U</span><span>By {NAME_MAKE}<small><time dateTime={article.date}>{blogDate(article.date)}</time><span> · {articleMinutes(article)} min read</span></small></span></div></header>
    <figure className="journal-cover"><Image src={visual.image} alt={visual.alt} width={1440} height={900} sizes="(max-width: 800px) 100vw, 1100px" preload/><figcaption>{visual.topic} · Practical ideas for your next build</figcaption></figure>
    <div className="journal-reading-layout"><aside className="journal-toc"><nav aria-label="Table of contents"><p className="journal-kicker">IN THIS GUIDE</p><ol>{article.sections.map((section,i)=><li key={section.heading}><a href={'#section-'+i}>{section.heading}</a></li>)}<li><a href="#worked-example">Worked example</a></li><li><a href="#common-question">Common question</a></li></ol></nav><Link className="journal-tool-link" href={'/tools/'+article.tool}>Try the related tool ↗</Link></aside>
    <div className="journal-prose"><p className="journal-lead">{article.intro}</p>{article.sections.map((section,i)=><section key={section.heading} aria-labelledby={'section-'+i}><h2 id={'section-'+i}>{section.heading}</h2><p>{section.body}</p></section>)}
    <section aria-labelledby="worked-example"><h2 id="worked-example">Worked example</h2><div className="journal-code"><div>EXAMPLE</div><pre tabIndex={0}><code>{article.example}</code></pre></div></section>
    <aside className="journal-callout"><span>PUT IT INTO PRACTICE</span><h3>See the result with your own data.</h3><p>Open the matching tool, load its example, then try a small sample.</p><Link href={'/tools/'+article.tool}>Open the tool <span aria-hidden="true">↗</span></Link></aside>
    <section aria-labelledby="common-question"><h2 id="common-question">{article.question}</h2><p>{article.answer}</p></section><section><h2>Reference and further reading</h2><p><a href={article.source} target="_blank" rel="noopener noreferrer">Read the official documentation ↗</a></p></section></div></div>
    <section className="journal-related"><p className="journal-kicker">KEEP EXPLORING</p><h2>Another useful idea.</h2><div className="journal-grid">{related.map(a=>{const v=blogVisual(a.slug);return <Link className="journal-card" key={a.slug} href={'/blog/'+a.slug}><div className="journal-card-image"><Image src={v.image} alt={v.alt} width={720} height={450} sizes="(max-width: 640px) 100vw, 33vw"/></div><div className="journal-card-copy"><span className="journal-topic">{v.topic}</span><h3>{a.title}</h3><p>{a.description}</p></div></Link>;})}</div></section>
    <footer className="journal-article-footer"><Link href="/blog">← Explore all guides</Link><span>AI-generated editorial photo</span></footer>
  </article>;
}
