import type { Metadata } from "next";
import HowToConvertPngToSvg from "./HowToConvertPngToSvg";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-convert-png-to-svg")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-convert-png-to-svg",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-convert-png-to-svg"} kind="article" date={article.date}/><HowToConvertPngToSvg/></>;}
