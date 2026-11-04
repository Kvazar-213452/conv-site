import TextToSlugList from "./TextToSlugList";
import { expansionTools } from "@/lib/expansion-tools";
import { pageMetadata, PageSchema, ToolGuide } from "@/component/ContentSeo";
const tool = expansionTools.find(t => t.slug === "text-to-slug-list")!;
export const dynamic = "force-static";
export const metadata = pageMetadata(tool.title + " Online", tool.description, "/tools/" + tool.slug);
export default function Page() { return <><PageSchema title={tool.title} description={tool.description} path={"/tools/" + tool.slug} kind="tool" /><TextToSlugList /><ToolGuide tool={tool} /></>; }
