import type { Metadata } from "next";
import HowToProtectPdfWithPassword from "./HowToProtectPdfWithPassword";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-protect-pdf-with-password")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-protect-pdf-with-password",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-protect-pdf-with-password"} kind="article" date={article.date}/><HowToProtectPdfWithPassword/></>;}
