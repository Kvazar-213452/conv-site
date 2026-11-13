import type { Metadata } from "next";
import HowToCreateAWifiQrCode from "./HowToCreateAWifiQrCode";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-create-a-wifi-qr-code")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-create-a-wifi-qr-code",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-create-a-wifi-qr-code"} kind="article" date={article.date}/><HowToCreateAWifiQrCode/></>;}
