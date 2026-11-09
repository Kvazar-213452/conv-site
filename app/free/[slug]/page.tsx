import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { growthTools } from '@/lib/growth-tools';
import { FREE_TOOL_SLUGS } from '@/lib/free-tool-slugs';
import { pageMetadata, PageSchema } from '@/component/ContentSeo';
import '@/style/free-tool-pages.css';

export const dynamicParams = false;
export function generateStaticParams() { return FREE_TOOL_SLUGS.map(slug => ({ slug })); }

type RouteProps = { params: Promise<{ slug: string }> };
function findTool(slug: string) { return growthTools.find(tool => tool.slug === slug); }
function titleFor(slug: string) { return findTool(slug)?.title ?? slug.split('-').map(word => word[0]?.toUpperCase() + word.slice(1)).join(' '); }

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { slug } = await params;
  if (!(FREE_TOOL_SLUGS as readonly string[]).includes(slug)) return {};
  const name = titleFor(slug);
  const description = `Use ${name} free online with no sign-up or download. Follow the steps, check the format limits, and open the tool in your browser.`;
  return pageMetadata(`Free Online ${name} – No Sign-Up`, description, `/free/${slug}`);
}

export default async function Page({ params }: RouteProps) {
  const { slug } = await params;
  if (!(FREE_TOOL_SLUGS as readonly string[]).includes(slug)) notFound();
  const tool = findTool(slug);
  const name = titleFor(slug);
  const description = tool?.description ?? `Use ${name} online with a clear workflow and an instant result.`;
  const processing = tool?.ai ? 'The text you submit is sent to the configured AI provider to create a draft.' : tool?.server ? 'Your file is sent to this site for the selected conversion and is processed for this request.' : tool?.api ? 'This tool queries its connected public data source when you submit a lookup.' : 'Your input is processed in your browser and is not uploaded by this tool.';
  const related = (tool?.related ?? []).map(value => value.replace(/^\/tools\//, '')).filter((value, index, list) => list.indexOf(value) === index && value !== slug && findTool(value)).slice(0, 3);
  const faq = tool?.faq ?? { question: `How do I use ${name} online?`, answer: `Open ${name}, enter the requested information, and review the result before using it.` };
  return <>
    <PageSchema title={`Free Online ${name}`} description={description} path={`/free/${slug}`} kind="tool" faq={faq} />
    <main className="free-tool-page">
      <nav className="free-tool-crumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/tools">Tools</Link><span aria-hidden="true">/</span><span>Free online</span></nav>
      <header className="free-tool-hero"><span className="free-tool-kicker">Free online tool</span><h1>Free Online {name}</h1><p>{description}</p><Link className="btn-convert free-tool-cta" href={`/tools/${slug}`}>Open {name} <span aria-hidden="true">→</span></Link></header>
      <section className="free-tool-section"><h2>How to use {name}</h2><ol>{(tool?.steps ?? [`Open the ${name} tool.`, 'Enter or upload your information.', 'Review and save the result.']).map((step,index)=><li key={`${index}-${step}`}>{step}</li>)}</ol></section>
      <section className="free-tool-section"><h2>What this tool does</h2><p>{description}</p><p>{processing}</p>{tool?.sections?.[0]&&<p>{tool.sections[0].body}</p>}</section>
      <section className="free-tool-section"><h2>Before you start</h2><ul><li>No account is required to open the tool.</li><li>Check the supported input formats and limits on the tool page.</li><li>Review generated or estimated results before relying on them.</li></ul></section>
      <section className="free-tool-faq"><h2>{faq.question}</h2><p>{faq.answer}</p></section>
      {related.length>0&&<nav className="free-tool-related" aria-label="Related tools"><h2>Related tools</h2><ul>{related.map(other=><li key={other}><Link href={`/tools/${other}`}>{titleFor(other)} →</Link></li>)}</ul></nav>}
      <p className="free-tool-back"><Link href="/tools">Browse all tools</Link></p>
    </main>
  </>;
}
