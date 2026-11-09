import type { Metadata } from "next";
import HowToCheckGoogleCache from "./HowToCheckGoogleCache";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-check-google-cache")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-check-google-cache",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-check-google-cache"} kind="article" date={article.date}/><HowToCheckGoogleCache/></>;}
