import type { Metadata } from "next";
import HowToCreateAnEmailSignature from "./HowToCreateAnEmailSignature";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-create-an-email-signature")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-create-an-email-signature",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-create-an-email-signature"} kind="article" date={article.date}/><HowToCreateAnEmailSignature/></>;}
