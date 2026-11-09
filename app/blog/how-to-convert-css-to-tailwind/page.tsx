import type { Metadata } from "next";
import HowToConvertCssToTailwind from "./HowToConvertCssToTailwind";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-convert-css-to-tailwind")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-convert-css-to-tailwind",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-convert-css-to-tailwind"} kind="article" date={article.date}/><HowToConvertCssToTailwind/></>;}
