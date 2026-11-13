import type { Metadata } from "next";
import HowToWriteProductDescriptions from "./HowToWriteProductDescriptions";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-write-product-descriptions")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-write-product-descriptions",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-write-product-descriptions"} kind="article" date={article.date}/><HowToWriteProductDescriptions/></>;}
