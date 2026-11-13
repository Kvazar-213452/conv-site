import type { Metadata } from "next";
import HowToAddPageNumbersToPdf from "./HowToAddPageNumbersToPdf";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-add-page-numbers-to-pdf")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-add-page-numbers-to-pdf",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-add-page-numbers-to-pdf"} kind="article" date={article.date}/><HowToAddPageNumbersToPdf/></>;}
