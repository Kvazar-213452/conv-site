import type { Metadata } from "next";
import HowToTestWebsiteSpeed from "./HowToTestWebsiteSpeed";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-test-website-speed")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-test-website-speed",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-test-website-speed"} kind="article" date={article.date}/><HowToTestWebsiteSpeed/></>;}
