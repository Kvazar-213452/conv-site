import type { Metadata } from "next";
import HowToRotatePdfPages from "./HowToRotatePdfPages";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-rotate-pdf-pages")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-rotate-pdf-pages",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-rotate-pdf-pages"} kind="article" date={article.date}/><HowToRotatePdfPages/></>;}
