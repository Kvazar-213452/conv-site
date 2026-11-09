import type { Metadata } from "next";
import HowToCountSentencesInText from "./HowToCountSentencesInText";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-count-sentences-in-text")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-count-sentences-in-text",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-count-sentences-in-text"} kind="article" date={article.date}/><HowToCountSentencesInText/></>;}
