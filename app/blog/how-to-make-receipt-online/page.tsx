import type { Metadata } from "next";
import HowToMakeReceiptOnline from "./HowToMakeReceiptOnline";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-make-receipt-online")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-make-receipt-online",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-make-receipt-online"} kind="article" date={article.date}/><HowToMakeReceiptOnline/></>;}
