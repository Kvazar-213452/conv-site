import type { Metadata } from "next";
import HowToCalculateDiscountPercentage from "./HowToCalculateDiscountPercentage";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-calculate-discount-percentage")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-calculate-discount-percentage",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-calculate-discount-percentage"} kind="article" date={article.date}/><HowToCalculateDiscountPercentage/></>;}
