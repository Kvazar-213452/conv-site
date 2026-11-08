import { growthTools } from "@/lib/growth-tools";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
import { GrowthGuide } from "@/component/GrowthGuide";
import PopularUtilityWorkbench from "@/component/PopularUtilityWorkbench";
const tool = growthTools.find(item => item.slug === "qr-code-reader")!;
export const dynamic = "force-static";
export const metadata = pageMetadata(tool.title + " Online", tool.description, "/tools/" + tool.slug);
export default function Page() { return <><PageSchema title={tool.title} description={tool.description} path={"/tools/" + tool.slug} kind="tool" date={tool.modified} faq={tool.faq} /><PopularUtilityWorkbench slug="qr-code-reader" /><GrowthGuide tool={tool} /></>; }

