import type { Metadata } from "next";
import HowToMergeCsvFiles from "./HowToMergeCsvFiles";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-merge-csv-files")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-merge-csv-files",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-merge-csv-files"} kind="article" date={article.date}/><HowToMergeCsvFiles/></>;}
