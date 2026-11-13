import type { Metadata } from "next";
import HowToBuildAnEmergencyFund from "./HowToBuildAnEmergencyFund";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-build-an-emergency-fund")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-build-an-emergency-fund",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-build-an-emergency-fund"} kind="article" date={article.date}/><HowToBuildAnEmergencyFund/></>;}
