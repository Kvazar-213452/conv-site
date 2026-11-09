import type { Metadata } from "next";
import HowToUnlockPdfWithoutPassword from "./HowToUnlockPdfWithoutPassword";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-unlock-pdf-without-password")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-unlock-pdf-without-password",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-unlock-pdf-without-password"} kind="article" date={article.date}/><HowToUnlockPdfWithoutPassword/></>;}
