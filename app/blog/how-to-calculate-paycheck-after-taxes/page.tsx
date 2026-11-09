import type { Metadata } from "next";
import HowToCalculatePaycheckAfterTaxes from "./HowToCalculatePaycheckAfterTaxes";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-calculate-paycheck-after-taxes")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-calculate-paycheck-after-taxes",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-calculate-paycheck-after-taxes"} kind="article" date={article.date}/><HowToCalculatePaycheckAfterTaxes/></>;}
