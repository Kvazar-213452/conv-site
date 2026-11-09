import type { Metadata } from "next";
import HowToCalculateOvulationDate from "./HowToCalculateOvulationDate";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-calculate-ovulation-date")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-calculate-ovulation-date",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-calculate-ovulation-date"} kind="article" date={article.date}/><HowToCalculateOvulationDate/></>;}
