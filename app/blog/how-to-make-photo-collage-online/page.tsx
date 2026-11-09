import type { Metadata } from "next";
import HowToMakePhotoCollageOnline from "./HowToMakePhotoCollageOnline";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-make-photo-collage-online")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-make-photo-collage-online",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-make-photo-collage-online"} kind="article" date={article.date}/><HowToMakePhotoCollageOnline/></>;}
