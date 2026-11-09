import type { Metadata } from "next";
import HowToGenerateFakeDataForTesting from "./HowToGenerateFakeDataForTesting";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-generate-fake-data-for-testing")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-generate-fake-data-for-testing",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-generate-fake-data-for-testing"} kind="article" date={article.date}/><HowToGenerateFakeDataForTesting/></>;}
