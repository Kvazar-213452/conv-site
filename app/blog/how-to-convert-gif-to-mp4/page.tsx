import type { Metadata } from "next";
import HowToConvertGifToMp4 from "./HowToConvertGifToMp4";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-convert-gif-to-mp4")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-convert-gif-to-mp4",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-convert-gif-to-mp4"} kind="article" date={article.date}/><HowToConvertGifToMp4/></>;}
