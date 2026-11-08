import { growthTools } from "@/lib/growth-tools";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
import { GrowthGuide } from "@/component/GrowthGuide";
import GrowthWorkbench from "@/component/GrowthWorkbench";
const tool = growthTools.find(item => item.slug === "password-strength-checker")!;
export const dynamic = "force-static";
export const metadata = pageMetadata(tool.title + " Online", tool.description, "/tools/" + tool.slug);
export default function Page() { return <><PageSchema title={tool.title} description={tool.description} path={"/tools/" + tool.slug} kind="tool" date={tool.modified} faq={tool.faq} /><GrowthWorkbench slug="password-strength-checker" /><GrowthGuide tool={tool} /></>; }

