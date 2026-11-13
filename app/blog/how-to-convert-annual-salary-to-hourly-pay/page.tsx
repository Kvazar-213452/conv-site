import type { Metadata } from "next";
import HowToConvertAnnualSalaryToHourlyPay from "./HowToConvertAnnualSalaryToHourlyPay";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-convert-annual-salary-to-hourly-pay")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-convert-annual-salary-to-hourly-pay",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-convert-annual-salary-to-hourly-pay"} kind="article" date={article.date}/><HowToConvertAnnualSalaryToHourlyPay/></>;}
