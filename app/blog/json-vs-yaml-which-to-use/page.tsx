import type { Metadata } from "next";
import JsonVsYamlWhichToUse from "./JsonVsYamlWhichToUse";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article = expansionArticles.find(a => a.slug === "json-vs-yaml-which-to-use")!;
export const dynamic = "force-static";
export const metadata: Metadata = pageMetadata(article.title, article.description, "/blog/" + article.slug, true);
export default function Page() { return <><PageSchema title={article.title} description={article.description} path={"/blog/" + article.slug} kind="article" date={article.date} /><JsonVsYamlWhichToUse /></>; }
