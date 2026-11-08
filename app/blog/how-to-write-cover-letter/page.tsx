import type { Metadata } from "next";
import HowToWriteCoverLetter from "./HowToWriteCoverLetter";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article = expansionArticles.find(a => a.slug === "how-to-write-cover-letter")!;
export const dynamic = "force-static";
export const metadata: Metadata = pageMetadata(article.title, article.description, "/blog/" + article.slug, true);
export default function Page() { return <><PageSchema title={article.title} description={article.description} path={"/blog/" + article.slug} kind="article" date={article.date} /><HowToWriteCoverLetter /></>; }
