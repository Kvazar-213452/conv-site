import type { Metadata } from "next";
import HowToCalculateRunningPace from "./HowToCalculateRunningPace";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-calculate-running-pace")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-calculate-running-pace",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-calculate-running-pace"} kind="article" date={article.date}/><HowToCalculateRunningPace/></>;}
