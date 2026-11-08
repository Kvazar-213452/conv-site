import type { Metadata } from 'next';
import { growthTools } from '@/lib/growth-tools';
import GrowthWorkbench from './GrowthWorkbench';
import ServerWorkbench from './ServerWorkbench';
import { GrowthGuide } from './GrowthGuide';
import { pageMetadata, PageSchema } from './ContentSeo';
import ApiLookupWorkbench from './ApiLookupWorkbench';
import DeepSeekWorkbench from './DeepSeekWorkbench';
import RequestedImageWorkbench from './RequestedImageWorkbench';
import PdfPasswordWorkbench from './PdfPasswordWorkbench';

export function generatedGrowthMetadata(slug: string): Metadata {
  const tool = growthTools.find(item => item.slug === slug);
  if (!tool) throw new Error(`Unknown generated tool route: ${slug}`);
  return pageMetadata(`${tool.title} Online`, tool.description, `/tools/${slug}`);
}

export default function GeneratedGrowthPage({ slug }: { slug: string }) {
  const tool = growthTools.find(item => item.slug === slug);
  if (!tool) throw new Error(`Unknown generated tool route: ${slug}`);
  const imageTool = ['color-palette-from-image','favicon-from-image','image-background-remover'].includes(slug);
  return <><PageSchema title={tool.title} description={tool.description} path={`/tools/${slug}`} kind="tool" date={tool.modified} faq={tool.faq} />{slug==='pdf-password-protector'?<PdfPasswordWorkbench/>:imageTool ? <RequestedImageWorkbench slug={slug} /> : tool.ai ? <DeepSeekWorkbench slug={slug} /> : tool.api ? <ApiLookupWorkbench slug={slug} /> : tool.server ? <ServerWorkbench slug={slug} /> : <GrowthWorkbench slug={slug} />}<GrowthGuide tool={tool} /></>;
}
