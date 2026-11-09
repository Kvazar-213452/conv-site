import type { Metadata } from "next";
import HowToAdjustForInflation from "./HowToAdjustForInflation";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-adjust-for-inflation")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-adjust-for-inflation",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-adjust-for-inflation"} kind="article" date={article.date}/><HowToAdjustForInflation/></>;}
