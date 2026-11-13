import type { Metadata } from "next";
import HowToCalculateOvertimePay from "./HowToCalculateOvertimePay";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-calculate-overtime-pay")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-calculate-overtime-pay",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-calculate-overtime-pay"} kind="article" date={article.date}/><HowToCalculateOvertimePay/></>;}
