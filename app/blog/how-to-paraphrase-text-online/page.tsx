import type { Metadata } from "next";
import HowToParaphraseTextOnline from "./HowToParaphraseTextOnline";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-paraphrase-text-online")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-paraphrase-text-online",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-paraphrase-text-online"} kind="article" date={article.date}/><HowToParaphraseTextOnline/></>;}
