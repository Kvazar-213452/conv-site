import type { Metadata } from "next";
import HowToResizeImagesForInstagram from "./HowToResizeImagesForInstagram";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-resize-images-for-instagram")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-resize-images-for-instagram",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-resize-images-for-instagram"} kind="article" date={article.date}/><HowToResizeImagesForInstagram/></>;}
