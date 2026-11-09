import type { Metadata } from "next";
import HowToOptimizeAmazonListing from "./HowToOptimizeAmazonListing";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-optimize-amazon-listing")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-optimize-amazon-listing",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-optimize-amazon-listing"} kind="article" date={article.date}/><HowToOptimizeAmazonListing/></>;}
