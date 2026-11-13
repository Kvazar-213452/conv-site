import type { Metadata } from "next";
import HowToConvertJpgToPdf from "./HowToConvertJpgToPdf";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-convert-jpg-to-pdf")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-convert-jpg-to-pdf",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-convert-jpg-to-pdf"} kind="article" date={article.date}/><HowToConvertJpgToPdf/></>;}
