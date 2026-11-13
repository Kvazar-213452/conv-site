import type { Metadata } from "next";
import HowToConvertPdfToWord from "./HowToConvertPdfToWord";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-convert-pdf-to-word")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-convert-pdf-to-word",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-convert-pdf-to-word"} kind="article" date={article.date}/><HowToConvertPdfToWord/></>;}
