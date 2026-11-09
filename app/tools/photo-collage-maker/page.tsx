import type { Metadata } from 'next';
import GeneratedGrowthPage, { generatedGrowthMetadata } from '@/component/GeneratedGrowthPage';
const slug = 'photo-collage-maker';
export function generateMetadata(): Metadata { return generatedGrowthMetadata(slug); }
export default function Page() { return <GeneratedGrowthPage slug={slug} />; }
