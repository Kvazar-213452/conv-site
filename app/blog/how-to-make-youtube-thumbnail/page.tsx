import type { Metadata } from "next";
import HowToMakeYoutubeThumbnail from "./HowToMakeYoutubeThumbnail";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-make-youtube-thumbnail")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-make-youtube-thumbnail",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-make-youtube-thumbnail"} kind="article" date={article.date}/><HowToMakeYoutubeThumbnail/></>;}
