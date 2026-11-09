import type { Metadata } from "next";
import HowToTestEmailDeliverability from "./HowToTestEmailDeliverability";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-test-email-deliverability")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-test-email-deliverability",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-test-email-deliverability"} kind="article" date={article.date}/><HowToTestEmailDeliverability/></>;}
