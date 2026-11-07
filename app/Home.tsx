import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Timer, Check, FileText, Lock, Zap } from 'lucide-react';
import ToolDirectory from '@/component/ToolDirectory';
import { quickPickSlugs, toolCatalog, toolCategories } from '@/lib/tool-catalog';
import { expansionArticles } from '@/lib/expansion-articles';
import '@/style/main.css';
import '@/style/catalog.css';
const quickPicks = quickPickSlugs.map(slug => toolCatalog.find(tool => tool.slug === slug)!);
const guides = expansionArticles.slice(-10).filter((_, i) => [0, 2, 4, 8].includes(i));
export default function HomePage() {
  return <div className="catalog-home">
    <section className="catalog-hero" aria-labelledby="home-heading">
      <div className="catalog-hero-copy"><div className="catalog-eyebrow"><span /> YOUR EVERYDAY TOOLBOX</div><h1 id="home-heading">Free online tools.<br /><em>Less busywork.</em></h1><p>Merge and compress PDFs, convert HEIC photos, extract text from images, trim WAV audio, and handle everyday files in one place.</p><div className="catalog-hero-actions"><a className="catalog-primary" href="#tools">Find a tool <ArrowRight size={17} aria-hidden="true" /></a><Link href="/blog" className="catalog-guide-link">Explore the guides <ArrowUpRight size={16} aria-hidden="true" /></Link></div><div className="catalog-promises"><span><Check size={14} aria-hidden="true" /> No sign-up</span><span><Lock size={14} aria-hidden="true" /> Clear processing notices</span><span><Zap size={14} aria-hidden="true" /> Free to use</span></div></div>
      <div className="catalog-hero-panel"><div className="catalog-panel-top"><span><i /><i /><i /></span><span>READY WHEN YOU ARE</span></div><div className="catalog-count"><strong>{toolCatalog.length}</strong><span>small tools.<br />A lot of time saved.</span></div><div className="catalog-panel-tags"><span><FileText size={16} aria-hidden="true" /> PDF & photos</span><span><Timer size={16} aria-hidden="true" /> Audio & timers</span></div><p>{toolCategories.length} categories · One useful place</p></div>
    </section>
    <section className="catalog-quick" aria-labelledby="quick-heading"><div className="catalog-section-heading"><h2 id="quick-heading">Start with an everyday task</h2><a href="#tools">Browse all {toolCatalog.length} <ArrowRight size={15} aria-hidden="true" /></a></div><div className="catalog-quick-grid">{quickPicks.map((tool, i) => <Link prefetch={false} href={tool.href} key={tool.slug}><span className="catalog-quick-index">0{i + 1}</span><span>{tool.title}</span><ArrowUpRight size={16} aria-hidden="true" /></Link>)}</div></section>
    <ToolDirectory tools={toolCatalog} />
    <section className="catalog-guides" aria-labelledby="guides-heading"><div className="catalog-section-heading"><div><span className="directory-kicker">A LITTLE CONTEXT HELPS</span><h2 id="guides-heading">Practical guides for the work behind the tools.</h2></div><Link href="/blog">All guides <ArrowRight size={15} aria-hidden="true" /></Link></div><div className="catalog-guide-grid">{guides.map(article => <Link href={'/blog/' + article.slug} key={article.slug}><span>DEVELOPER GUIDE <ArrowUpRight size={16} aria-hidden="true" /></span><h3>{article.title}</h3><p>{article.description}</p></Link>)}</div></section>
    <section className="catalog-about"><h2>One place for everyday tasks</h2><p>Browse {toolCatalog.length} free tools for PDFs, photos, documents, audio, JSON, code, text and everyday calculations. Each tool includes format notes, examples and related resources. Many transformations run in your browser. File converters marked Server conversion upload input only after you select Convert on server. Tools work without an account.</p><p>Use the category sections to explore the whole collection, or search for a format or task. For explanations and worked examples, visit the <Link href="/blog">developer blog</Link>.</p></section>
  </div>;
}
