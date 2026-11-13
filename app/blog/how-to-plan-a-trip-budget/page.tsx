import type { Metadata } from "next";
import HowToPlanATripBudget from "./HowToPlanATripBudget";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-plan-a-trip-budget")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-plan-a-trip-budget",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-plan-a-trip-budget"} kind="article" date={article.date}/><HowToPlanATripBudget/></>;}
