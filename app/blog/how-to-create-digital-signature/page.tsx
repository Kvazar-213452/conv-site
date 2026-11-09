import type { Metadata } from "next";
import HowToCreateDigitalSignature from "./HowToCreateDigitalSignature";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-create-digital-signature")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-create-digital-signature",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-create-digital-signature"} kind="article" date={article.date}/><HowToCreateDigitalSignature/></>;}
