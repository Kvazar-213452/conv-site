import { growthTools } from "@/lib/growth-tools";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
import { GrowthGuide } from "@/component/GrowthGuide";
import GrowthWorkbench from "@/component/GrowthWorkbench";
const tool = growthTools.find(item => item.slug === "overtime-pay-calculator")!;
export const dynamic = "force-static";
export const metadata = pageMetadata(tool.title + " Online", tool.description, "/tools/" + tool.slug);
export default function Page() { return <><PageSchema title={tool.title} description={tool.description} path={"/tools/" + tool.slug} kind="tool" date={tool.modified} /><GrowthWorkbench slug="overtime-pay-calculator" /><GrowthGuide tool={tool} /></>; }

