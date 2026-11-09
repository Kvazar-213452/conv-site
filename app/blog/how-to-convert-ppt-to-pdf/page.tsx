import type { Metadata } from "next";
import HowToConvertPptToPdf from "./HowToConvertPptToPdf";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-convert-ppt-to-pdf")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-convert-ppt-to-pdf",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-convert-ppt-to-pdf"} kind="article" date={article.date}/><HowToConvertPptToPdf/></>;}
