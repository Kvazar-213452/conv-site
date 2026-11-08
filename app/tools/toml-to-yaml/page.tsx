import GeneratedGrowthPage, { generatedGrowthMetadata } from "@/component/GeneratedGrowthPage";
const slug = "toml-to-yaml";
export const dynamic = "force-static";
export const metadata = generatedGrowthMetadata(slug);
export default function Page() { return <GeneratedGrowthPage slug={slug} />; }
