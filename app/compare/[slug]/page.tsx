import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { growthTools } from '@/lib/growth-tools';
import { toolCatalog } from '@/lib/tool-catalog';
import { comparisons } from '@/lib/comparisons';
import { pageMetadata, PageSchema } from '@/component/ContentSeo';
import './compare.css';

export const dynamicParams = false;
export function generateStaticParams() { return comparisons.map(({ slug }) => ({ slug })); }
type Props = { params: Promise<{ slug: string }> };
const getComparison = (slug: string) => comparisons.find(item => item.slug === slug);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const comparison = getComparison(slug);
  if (!comparison) return {};
  const title = `${comparison.keyword.replace(/\b\w/g, char => char.toUpperCase())}: Which Should You Use?`;
  return pageMetadata(title, `Compare ${comparison.keyword}: understand the differences, trade-offs, and best use cases, then try the relevant free tools.`, `/compare/${slug}`);
}

export default async function ComparisonPage({ params }: Props) {
  const { slug } = await params;
  const comparison = getComparison(slug);
  if (!comparison) notFound();
  const itemA = toolCatalog.find(tool => tool.slug === comparison.toolA);
  const itemB = toolCatalog.find(tool => tool.slug === comparison.toolB);
  const titleA = comparison.titleA ?? itemA?.title ?? comparison.toolA.split('-').map(word => word[0].toUpperCase() + word.slice(1)).join(' ');
  const titleB = comparison.titleB ?? itemB?.title ?? comparison.toolB.split('-').map(word => word[0].toUpperCase() + word.slice(1)).join(' ');
  const detailA = growthTools.find(tool => tool.slug === comparison.toolA)?.description ?? comparison.whenA;
  const detailB = growthTools.find(tool => tool.slug === comparison.toolB)?.description ?? comparison.whenB;
  return <>
    <PageSchema title={`${titleA} vs ${titleB}`} description={comparison.summary} path={`/compare/${slug}`} kind="webpage" />
    <main className="comparison-page">
      <nav className="comparison-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span>Comparisons</span></nav>
      <header><p className="comparison-eyebrow">TOOL COMPARISON</p><h1>{titleA} vs {titleB}</h1><p className="comparison-lead">{comparison.summary}</p></header>
      <div className="comparison-grid">
        <article className="comparison-card"><p className="comparison-eyebrow">OPTION A</p><h2>{titleA}</h2><p>{comparison.whenA}</p>{itemA && <Link href={itemA.href} className="comparison-cta">Try {titleA}<span aria-hidden="true"> →</span></Link>}</article>
        <article className="comparison-card"><p className="comparison-eyebrow">OPTION B</p><h2>{titleB}</h2><p>{comparison.whenB}</p>{itemB && <Link href={itemB.href} className="comparison-cta">Try {titleB}<span aria-hidden="true"> →</span></Link>}</article>
      </div>
      <section className="comparison-detail"><h2>What each option does</h2><div className="comparison-detail-grid"><div><h3>{titleA}</h3><p>{detailA}</p></div><div><h3>{titleB}</h3><p>{detailB}</p></div></div></section>
      <section className="comparison-detail"><h2>How to choose</h2><p>{comparison.whenA} {comparison.whenB}</p><p>Before relying on a result, check the output with a small sample and confirm that the format or assumptions match your destination. Keep an original copy when converting files or changing data.</p></section>
      <p className="comparison-back"><Link href="/">Browse all {growthTools.length} tools</Link><span> · </span><Link href="/blog">Read practical guides</Link></p>
    </main>
  </>;
}
