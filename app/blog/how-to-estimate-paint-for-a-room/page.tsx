import type { Metadata } from "next";
import HowToEstimatePaintForARoom from "./HowToEstimatePaintForARoom";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-estimate-paint-for-a-room")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-estimate-paint-for-a-room",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-estimate-paint-for-a-room"} kind="article" date={article.date}/><HowToEstimatePaintForARoom/></>;}
