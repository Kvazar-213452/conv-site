import type { Metadata } from "next";
import HowToCheckPageSize from "./HowToCheckPageSize";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-check-page-size")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-check-page-size",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-check-page-size"} kind="article" date={article.date}/><HowToCheckPageSize/></>;}
