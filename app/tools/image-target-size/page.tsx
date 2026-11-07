import ImageTargetSize from "./ImageTargetSize";
import {growthTools} from "@/lib/growth-tools";
import {pageMetadata,PageSchema} from "@/component/ContentSeo";
import {GrowthGuide} from "@/component/GrowthGuide";
const tool=growthTools.find(t=>t.slug==="image-target-size")!;
export const dynamic="force-static";
export const metadata=pageMetadata(tool.title+" Online",tool.description,"/tools/"+tool.slug);
export default function Page(){return <><PageSchema title={tool.title} description={tool.description} path={"/tools/"+tool.slug} kind="tool" date={tool.modified}/><ImageTargetSize/><GrowthGuide tool={tool}/></>;}
