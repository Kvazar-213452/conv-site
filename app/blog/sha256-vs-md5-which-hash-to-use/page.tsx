import type { Metadata } from "next";
import Sha256VsMd5WhichHashToUse from "./Sha256VsMd5WhichHashToUse";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article = expansionArticles.find(a => a.slug === "sha256-vs-md5-which-hash-to-use")!;
export const dynamic = "force-static";
export const metadata: Metadata = pageMetadata(article.title, article.description, "/blog/" + article.slug, true);
export default function Page() { return <><PageSchema title={article.title} description={article.description} path={"/blog/" + article.slug} kind="article" date={article.date} /><Sha256VsMd5WhichHashToUse /></>; }
