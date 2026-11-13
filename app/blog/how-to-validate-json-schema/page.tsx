import type { Metadata } from "next";
import HowToValidateJsonSchema from "./HowToValidateJsonSchema";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-validate-json-schema")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-validate-json-schema",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-validate-json-schema"} kind="article" date={article.date}/><HowToValidateJsonSchema/></>;}
