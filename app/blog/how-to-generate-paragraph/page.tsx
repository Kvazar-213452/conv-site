import type { Metadata } from "next";
import HowToGenerateParagraph from "./HowToGenerateParagraph";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-generate-paragraph")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-generate-paragraph",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-generate-paragraph"} kind="article" date={article.date}/><HowToGenerateParagraph/></>;}
