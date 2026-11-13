import type { Metadata } from "next";
import HowToCompressImagesForEmail from "./HowToCompressImagesForEmail";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-compress-images-for-email")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-compress-images-for-email",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-compress-images-for-email"} kind="article" date={article.date}/><HowToCompressImagesForEmail/></>;}
