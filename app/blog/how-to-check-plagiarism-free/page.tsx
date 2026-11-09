import type { Metadata } from "next";
import HowToCheckPlagiarismFree from "./HowToCheckPlagiarismFree";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-check-plagiarism-free")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-check-plagiarism-free",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-check-plagiarism-free"} kind="article" date={article.date}/><HowToCheckPlagiarismFree/></>;}
