import type { Metadata } from "next";
import HowToCalculateAutoLoanPayment from "./HowToCalculateAutoLoanPayment";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-calculate-auto-loan-payment")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-calculate-auto-loan-payment",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-calculate-auto-loan-payment"} kind="article" date={article.date}/><HowToCalculateAutoLoanPayment/></>;}
