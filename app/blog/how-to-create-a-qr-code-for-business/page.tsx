import type { Metadata } from "next";
import HowToCreateAQrCodeForBusiness from "./HowToCreateAQrCodeForBusiness";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-create-a-qr-code-for-business")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-create-a-qr-code-for-business",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-create-a-qr-code-for-business"} kind="article" date={article.date}/><HowToCreateAQrCodeForBusiness/></>;}
