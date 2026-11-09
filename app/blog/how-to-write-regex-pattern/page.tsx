import type { Metadata } from "next";
import HowToWriteRegexPattern from "./HowToWriteRegexPattern";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-write-regex-pattern")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-write-regex-pattern",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-write-regex-pattern"} kind="article" date={article.date}/><HowToWriteRegexPattern/></>;}
