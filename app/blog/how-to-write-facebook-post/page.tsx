import type { Metadata } from "next";
import HowToWriteFacebookPost from "./HowToWriteFacebookPost";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-write-facebook-post")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-write-facebook-post",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-write-facebook-post"} kind="article" date={article.date}/><HowToWriteFacebookPost/></>;}
