import DiscountCalculator from "./DiscountCalculator";
import {growthTools} from "@/lib/growth-tools";
import {pageMetadata,PageSchema} from "@/component/ContentSeo";
import {GrowthGuide} from "@/component/GrowthGuide";
const tool=growthTools.find(t=>t.slug==="discount-calculator")!;
export const dynamic="force-static";
export const metadata=pageMetadata(tool.title+" Online",tool.description,"/tools/"+tool.slug);
export default function Page(){return <><PageSchema title={tool.title} description={tool.description} path={"/tools/"+tool.slug} kind="tool" date={tool.modified} faq={tool.faq}/><DiscountCalculator/><GrowthGuide tool={tool}/></>;}
