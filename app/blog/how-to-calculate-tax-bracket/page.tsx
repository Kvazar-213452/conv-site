import type { Metadata } from "next";
import HowToCalculateTaxBracket from "./HowToCalculateTaxBracket";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-calculate-tax-bracket")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-calculate-tax-bracket",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-calculate-tax-bracket"} kind="article" date={article.date}/><HowToCalculateTaxBracket/></>;}
