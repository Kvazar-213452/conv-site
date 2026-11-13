import type { Metadata } from "next";
import HowToPlanAMovingChecklist from "./HowToPlanAMovingChecklist";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-plan-a-moving-checklist")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-plan-a-moving-checklist",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-plan-a-moving-checklist"} kind="article" date={article.date}/><HowToPlanAMovingChecklist/></>;}
