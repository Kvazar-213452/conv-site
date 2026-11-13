import type { Metadata } from "next";
import HowToExtractPagesFromPdf from "./HowToExtractPagesFromPdf";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-extract-pages-from-pdf")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-extract-pages-from-pdf",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-extract-pages-from-pdf"} kind="article" date={article.date}/><HowToExtractPagesFromPdf/></>;}
