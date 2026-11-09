import type { Metadata } from "next";
import HowToRemoveDuplicateLines from "./HowToRemoveDuplicateLines";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-remove-duplicate-lines")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-remove-duplicate-lines",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-remove-duplicate-lines"} kind="article" date={article.date}/><HowToRemoveDuplicateLines/></>;}
