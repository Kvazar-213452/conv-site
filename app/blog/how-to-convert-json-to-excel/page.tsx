import type { Metadata } from "next";
import HowToConvertJsonToExcel from "./HowToConvertJsonToExcel";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-convert-json-to-excel")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-convert-json-to-excel",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-convert-json-to-excel"} kind="article" date={article.date}/><HowToConvertJsonToExcel/></>;}
