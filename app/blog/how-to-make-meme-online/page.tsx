import type { Metadata } from "next";
import HowToMakeMemeOnline from "./HowToMakeMemeOnline";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-make-meme-online")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-make-meme-online",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-make-meme-online"} kind="article" date={article.date}/><HowToMakeMemeOnline/></>;}
