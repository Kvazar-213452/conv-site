import type { Metadata } from "next";
import HowToCalculateInvestmentReturns from "./HowToCalculateInvestmentReturns";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-calculate-investment-returns")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-calculate-investment-returns",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-calculate-investment-returns"} kind="article" date={article.date}/><HowToCalculateInvestmentReturns/></>;}
