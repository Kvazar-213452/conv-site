import Link from 'next/link';
import { expansionArticles } from '@/lib/expansion-articles';
import type { GrowthTool } from '@/lib/growth-tools';
import { toolCategories } from '@/lib/tool-categories';
import { toolCatalog } from '@/lib/tool-catalog';
import '@/style/main.css';
export function GrowthGuide({ tool }: { tool: GrowthTool }) {
  const category = toolCatalog.find(item => item.slug === tool.slug)?.category ?? 'data';
  const categoryName = toolCategories.find(item => item.id === category)?.name ?? 'Tools';
  return <section className="seo-content">
    <nav aria-label="Breadcrumb" style={{ fontSize: '0.875rem', marginBottom: '1.5rem', color: 'var(--text-secondary, #666)' }}>
      <Link href="/" style={{ color: 'inherit' }}>Home</Link>
      <span style={{ margin: '0 0.5rem' }}>/</span>
      <Link href={`/tools/category/${category}`} style={{ color: 'inherit' }}>{categoryName}</Link>
      <span style={{ margin: '0 0.5rem' }}>/</span>
      <span>{tool.title}</span>
    </nav>
    <h2>How to use {tool.title}</h2><ol>{tool.steps.map(step => <li key={step}>{step}</li>)}</ol>
    {tool.sections.map(section => <section key={section.heading}><h2>{section.heading}</h2><p>{section.body}</p></section>)}
    {tool.example && <><h3>Example input</h3><pre className="output-pre">{tool.example}</pre></>}
    <h2>{tool.faq.question}</h2><p>{tool.faq.answer}</p>
    <h3>Is input uploaded?</h3><p>{tool.server ? 'This tool sends input to this site’s conversion API after you select Convert on server. Files use bounded workers and, when needed, private temporary folders deleted after processing or cancellation. No conversion history is saved. The converter does not upload files to a third-party conversion service.' : 'Processing takes place in your browser. This tool does not send your input or selected files to a conversion API.'}</p>
    <h3>Related tools and guides</h3><ul>{tool.related.map(path => <li key={path}><Link href={path}>{path.split('/').at(-1)!.split('-').map(word => word[0].toUpperCase() + word.slice(1)).join(' ')}</Link></li>)}</ul>
    {expansionArticles.some(a => a.tool === tool.slug && !tool.related.includes('/blog/' + a.slug)) && <><h3>Practical guides for this tool</h3><ul>{expansionArticles.filter(a => a.tool === tool.slug && !tool.related.includes('/blog/' + a.slug)).map(article => <li key={article.slug}><Link href={'/blog/' + article.slug}>{article.title}</Link></li>)}</ul></>}
    {tool.reference && <p><a href={tool.reference} target="_blank" rel="noopener noreferrer">Official reference</a></p>}
    <p><Link href="/">Browse all developer tools</Link></p>
  </section>;
}
