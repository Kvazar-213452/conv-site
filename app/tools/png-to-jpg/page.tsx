import { growthTools } from "@/lib/growth-tools";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
import { GrowthGuide } from "@/component/GrowthGuide";
import ImageWorkbench from "@/component/ImageWorkbench";
const tool = growthTools.find(item => item.slug === "png-to-jpg")!;
export const dynamic = "force-static";
export const metadata = pageMetadata(tool.title + " Online", tool.description, "/tools/" + tool.slug);
export default function Page() { return <><PageSchema title={tool.title} description={tool.description} path={"/tools/" + tool.slug} kind="tool" date={tool.modified} faq={tool.faq} /><ImageWorkbench slug="png-to-jpg" /><GrowthGuide tool={tool} /></>; }

