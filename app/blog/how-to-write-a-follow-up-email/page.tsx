import type { Metadata } from "next";
import HowToWriteAFollowUpEmail from "./HowToWriteAFollowUpEmail";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-write-a-follow-up-email")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-write-a-follow-up-email",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-write-a-follow-up-email"} kind="article" date={article.date}/><HowToWriteAFollowUpEmail/></>;}
