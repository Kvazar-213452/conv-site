import type { Metadata } from "next";
import HowToCalculateSalesTaxOnAPurchase from "./HowToCalculateSalesTaxOnAPurchase";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-calculate-sales-tax-on-a-purchase")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-calculate-sales-tax-on-a-purchase",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-calculate-sales-tax-on-a-purchase"} kind="article" date={article.date}/><HowToCalculateSalesTaxOnAPurchase/></>;}
