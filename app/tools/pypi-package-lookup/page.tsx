import GeneratedGrowthPage, { generatedGrowthMetadata } from "@/component/GeneratedGrowthPage";
const slug = "pypi-package-lookup";
export const dynamic = "force-static";
export const metadata = generatedGrowthMetadata(slug);
export default function Page() { return <GeneratedGrowthPage slug={slug} />; }
