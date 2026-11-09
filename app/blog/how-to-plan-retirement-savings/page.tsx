import type { Metadata } from "next";
import HowToPlanRetirementSavings from "./HowToPlanRetirementSavings";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-plan-retirement-savings")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-plan-retirement-savings",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-plan-retirement-savings"} kind="article" date={article.date}/><HowToPlanRetirementSavings/></>;}
