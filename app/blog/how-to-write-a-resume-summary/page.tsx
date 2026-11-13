import type { Metadata } from "next";
import HowToWriteAResumeSummary from "./HowToWriteAResumeSummary";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-write-a-resume-summary")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-write-a-resume-summary",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-write-a-resume-summary"} kind="article" date={article.date}/><HowToWriteAResumeSummary/></>;}
