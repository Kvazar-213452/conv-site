import type { Metadata } from "next";
import HowToConvertPdfToJpg from "./HowToConvertPdfToJpg";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-convert-pdf-to-jpg")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-convert-pdf-to-jpg",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-convert-pdf-to-jpg"} kind="article" date={article.date}/><HowToConvertPdfToJpg/></>;}
