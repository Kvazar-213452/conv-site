import DuplicateUrlSlugs from "./DuplicateUrlSlugs";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article = expansionArticles.find(a => a.slug === "duplicate-url-slugs")!;
export const dynamic = "force-static";
export const metadata = pageMetadata(article.title, article.description, "/blog/" + article.slug, true);
export default function Page() { return <><PageSchema title={article.title} description={article.description} path={"/blog/" + article.slug} kind="article" date={article.date} /><DuplicateUrlSlugs /></>; }
