import type { Metadata } from "next";
import HowToCalculateFlooringForARoom from "./HowToCalculateFlooringForARoom";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-calculate-flooring-for-a-room")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-calculate-flooring-for-a-room",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-calculate-flooring-for-a-room"} kind="article" date={article.date}/><HowToCalculateFlooringForARoom/></>;}
