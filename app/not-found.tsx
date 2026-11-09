import Link from 'next/link';
import { toolCatalog } from '@/lib/tool-catalog';
import './not-found.css';

const popular = ['pdf-merger', 'json-formatter', 'password-generator', 'qr-code-generator', 'image-resizer', 'word-to-pdf', 'bmi-calculator', 'paraphrasing-tool', 'percentage-calculator', 'uuid-generator', 'string-to-base64', 'csv-to-json'];

export default function NotFound() {
  const tools = popular.map(slug => toolCatalog.find(tool => tool.slug === slug)).filter((tool): tool is NonNullable<typeof tool> => Boolean(tool));
  return <main className="not-found-page">
    <p className="not-found-code">404 · PAGE NOT FOUND</p>
    <h1>This page doesn’t exist.</h1>
    <p className="not-found-intro">Try one of these popular free tools, or browse the complete directory.</p>
    <nav className="not-found-tools" aria-label="Popular tools">
      {tools.map(tool => <Link href={tool.href} key={tool.slug} className="not-found-tool"><span>{tool.title}</span><span aria-hidden="true">↗</span></Link>)}
    </nav>
    <div className="not-found-links"><Link href="/">Browse all tools</Link><Link href="/blog">Read practical guides</Link></div>
  </main>;
}
