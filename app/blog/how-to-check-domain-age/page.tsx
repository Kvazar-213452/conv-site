import type { Metadata } from "next";
import HowToCheckDomainAge from "./HowToCheckDomainAge";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-check-domain-age")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-check-domain-age",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-check-domain-age"} kind="article" date={article.date}/><HowToCheckDomainAge/></>;}
