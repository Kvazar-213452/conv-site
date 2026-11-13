import type { Metadata } from "next";
import HowToRemoveBackgroundFromImage from "./HowToRemoveBackgroundFromImage";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-remove-background-from-image")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-remove-background-from-image",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-remove-background-from-image"} kind="article" date={article.date}/><HowToRemoveBackgroundFromImage/></>;}
