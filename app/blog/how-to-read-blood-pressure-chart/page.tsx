import type { Metadata } from "next";
import HowToReadBloodPressureChart from "./HowToReadBloodPressureChart";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-read-blood-pressure-chart")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-read-blood-pressure-chart",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-read-blood-pressure-chart"} kind="article" date={article.date}/><HowToReadBloodPressureChart/></>;}
