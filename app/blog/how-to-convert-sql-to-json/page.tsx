import type { Metadata } from "next";
import HowToConvertSqlToJson from "./HowToConvertSqlToJson";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-convert-sql-to-json")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-convert-sql-to-json",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-convert-sql-to-json"} kind="article" date={article.date}/><HowToConvertSqlToJson/></>;}
