import type { Metadata } from "next";
import FreeInvoiceTemplateForFreelancers from "./FreeInvoiceTemplateForFreelancers";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="free-invoice-template-for-freelancers")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/free-invoice-template-for-freelancers",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/free-invoice-template-for-freelancers"} kind="article" date={article.date}/><FreeInvoiceTemplateForFreelancers/></>;}
