import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Braces, Check, Image as ImageIcon, Lock, Zap } from 'lucide-react';
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
      <div className="catalog-hero-copy"><div className="catalog-eyebrow"><span /> YOUR EVERYDAY TOOLBOX</div><h1 id="home-heading">Free developer tools.<br /><em>Less busywork.</em></h1><p>Convert data, clean up code, work with images, and solve the little tasks that interrupt your day. Find the right tool and get back to building.</p><div className="catalog-hero-actions"><a className="catalog-primary" href="#tools">Find a tool <ArrowRight size={17} aria-hidden="true" /></a><Link href="/blog" className="catalog-guide-link">Explore the guides <ArrowUpRight size={16} aria-hidden="true" /></Link></div><div className="catalog-promises"><span><Check size={14} aria-hidden="true" /> No sign-up</span><span><Lock size={14} aria-hidden="true" /> Local processing</span><span><Zap size={14} aria-hidden="true" /> Free to use</span></div></div>
      <div className="catalog-hero-panel"><div className="catalog-panel-top"><span><i /><i /><i /></span><span>READY WHEN YOU ARE</span></div><div className="catalog-count"><strong>{toolCatalog.length}</strong><span>small tools.<br />A lot of time saved.</span></div><div className="catalog-panel-tags"><span><Braces size={16} aria-hidden="true" /> Data & code</span><span><ImageIcon size={16} aria-hidden="true" /> Images & design</span></div><p>{toolCategories.length} categories · One useful place</p></div>
    </section>
    <ToolDirectory tools={toolCatalog} />
    <section className="catalog-quick" aria-labelledby="quick-heading"><div className="catalog-section-heading"><h2 id="quick-heading">A few useful starting points</h2><a href="#tools">Browse all {toolCatalog.length} <ArrowRight size={15} aria-hidden="true" /></a></div><div className="catalog-quick-grid">{quickPicks.map((tool, i) => <Link prefetch={false} href={tool.href} key={tool.slug}><span className="catalog-quick-index">0{i + 1}</span><span>{tool.title}</span><ArrowUpRight size={16} aria-hidden="true" /></Link>)}</div></section>
    <section className="catalog-guides" aria-labelledby="guides-heading"><div className="catalog-section-heading"><div><span className="directory-kicker">A LITTLE CONTEXT HELPS</span><h2 id="guides-heading">Practical guides for the work behind the tools.</h2></div><Link href="/blog">All guides <ArrowRight size={15} aria-hidden="true" /></Link></div><div className="catalog-guide-grid">{guides.map(article => <Link href={'/blog/' + article.slug} key={article.slug}><span>DEVELOPER GUIDE <ArrowUpRight size={16} aria-hidden="true" /></span><h3>{article.title}</h3><p>{article.description}</p></Link>)}</div></section>
    <section className="catalog-about"><h2>One place for everyday developer tasks</h2><p>Browse {toolCatalog.length} free tools for JSON, CSV, SQL, Base64, CSS, images, security, text and calculations. Each tool includes format notes, examples and related resources. Transformations run in your browser, and the tools work without an account.</p><p>Use the category sections to explore the whole collection, or search for a format or task. For explanations and worked examples, visit the <Link href="/blog">developer blog</Link>.</p></section>
  </div>;
}
