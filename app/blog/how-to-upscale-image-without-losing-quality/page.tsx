import type { Metadata } from "next";
import HowToUpscaleImageWithoutLosingQuality from "./HowToUpscaleImageWithoutLosingQuality";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-upscale-image-without-losing-quality")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-upscale-image-without-losing-quality",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-upscale-image-without-losing-quality"} kind="article" date={article.date}/><HowToUpscaleImageWithoutLosingQuality/></>;}
