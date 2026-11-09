import type { Metadata } from "next";
import HowToConvertTextToSpeechOnline from "./HowToConvertTextToSpeechOnline";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-convert-text-to-speech-online")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-convert-text-to-speech-online",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-convert-text-to-speech-online"} kind="article" date={article.date}/><HowToConvertTextToSpeechOnline/></>;}
