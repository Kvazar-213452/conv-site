import type { Metadata } from "next";
import HowToConvertJpgToPdfOnPhone from "./HowToConvertJpgToPdfOnPhone";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-convert-jpg-to-pdf-on-phone")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-convert-jpg-to-pdf-on-phone",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-convert-jpg-to-pdf-on-phone"} kind="article" date={article.date}/><HowToConvertJpgToPdfOnPhone/></>;}
