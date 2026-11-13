import type { Metadata } from "next";
import HowToCreateAPdfFromAWebpage from "./HowToCreateAPdfFromAWebpage";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-create-a-pdf-from-a-webpage")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-create-a-pdf-from-a-webpage",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-create-a-pdf-from-a-webpage"} kind="article" date={article.date}/><HowToCreateAPdfFromAWebpage/></>;}
