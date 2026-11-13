import type { Metadata } from "next";
import HowToCalculateFuelCostForARoadTrip from "./HowToCalculateFuelCostForARoadTrip";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-calculate-fuel-cost-for-a-road-trip")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-calculate-fuel-cost-for-a-road-trip",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-calculate-fuel-cost-for-a-road-trip"} kind="article" date={article.date}/><HowToCalculateFuelCostForARoadTrip/></>;}
