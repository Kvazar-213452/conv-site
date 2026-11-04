import JsonFlattener from "./JsonFlattener";
import { expansionTools } from "@/lib/expansion-tools";
import { pageMetadata, PageSchema, ToolGuide } from "@/component/ContentSeo";
const tool = expansionTools.find(t => t.slug === "json-flattener")!;
export const dynamic = "force-static";
export const metadata = pageMetadata(tool.title + " Online", tool.description, "/tools/" + tool.slug);
export default function Page() { return <><PageSchema title={tool.title} description={tool.description} path={"/tools/" + tool.slug} kind="tool" /><JsonFlattener /><ToolGuide tool={tool} /></>; }
