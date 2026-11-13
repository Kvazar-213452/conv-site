import type { Metadata } from "next";
import HowToCalculateConcreteForASlab from "./HowToCalculateConcreteForASlab";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-calculate-concrete-for-a-slab")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-calculate-concrete-for-a-slab",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-calculate-concrete-for-a-slab"} kind="article" date={article.date}/><HowToCalculateConcreteForASlab/></>;}
