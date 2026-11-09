import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { growthTools } from '@/lib/growth-tools';
import GrowthWorkbench from './GrowthWorkbench';
import { GrowthGuide } from './GrowthGuide';
import { pageMetadata, PageSchema } from './ContentSeo';

const ServerWorkbench = dynamic(() => import('./ServerWorkbench'));
const ApiLookupWorkbench = dynamic(() => import('./ApiLookupWorkbench'));
const DeepSeekWorkbench = dynamic(() => import('./DeepSeekWorkbench'));
const RequestedImageWorkbench = dynamic(() => import('./RequestedImageWorkbench'));
const PdfPasswordWorkbench = dynamic(() => import('./PdfPasswordWorkbench'));
const ImageWorkbench = dynamic(() => import('./ImageWorkbench'));
const RequestedInteractiveWorkbench = dynamic(() => import('./RequestedInteractiveWorkbench'));
const PhotoCollageWorkbench = dynamic(() => import('./PhotoCollageWorkbench'));

export function generatedGrowthMetadata(slug: string): Metadata {
  const tool = growthTools.find(item => item.slug === slug);
  if (!tool) throw new Error(`Unknown generated tool route: ${slug}`);
  return pageMetadata(`${tool.title} Online`, tool.description, `/tools/${slug}`);
}

export default function GeneratedGrowthPage({ slug }: { slug: string }) {
  const tool = growthTools.find(item => item.slug === slug);
  if (!tool) throw new Error(`Unknown generated tool route: ${slug}`);
  const imageTool = ['color-palette-from-image','favicon-from-image','image-background-remover'].includes(slug);
  const interactive=['text-to-speech','html-to-pdf','meme-generator','youtube-thumbnail-maker','signature-generator','gif-to-mp4','invoice-template','receipt-maker'].includes(slug);
  return <><PageSchema title={tool.title} description={tool.description} path={`/tools/${slug}`} kind="tool" date={tool.modified} faq={tool.faq} />{slug==='pdf-password-protector'?<PdfPasswordWorkbench/>:imageTool ? <RequestedImageWorkbench slug={slug} /> : slug==='image-upscaler' ? <ImageWorkbench slug={slug} /> : slug==='photo-collage-maker' ? <PhotoCollageWorkbench/> : interactive ? <RequestedInteractiveWorkbench slug={slug} /> : tool.ai ? <DeepSeekWorkbench slug={slug} /> : tool.api ? <ApiLookupWorkbench slug={slug} /> : tool.server ? <ServerWorkbench slug={slug} /> : <GrowthWorkbench slug={slug} />}<GrowthGuide tool={tool} /></>;
}
