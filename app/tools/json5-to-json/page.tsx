import Json5ToJson from "./Json5ToJson";
import { growthTools } from "@/lib/growth-tools";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
import { GrowthGuide } from "@/component/GrowthGuide";
const tool = growthTools.find(t => t.slug === "json5-to-json")!;
export const dynamic = "force-static";
export const metadata = pageMetadata(tool.title + " Online", tool.description, "/tools/" + tool.slug);
export default function Page() { return <><PageSchema title={tool.title} description={tool.description} path={"/tools/" + tool.slug} kind="tool" date={tool.modified} /><Json5ToJson /><GrowthGuide tool={tool} /></>; }
