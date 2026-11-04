import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function TsvVsCsv() { return <ArticleContent article={expansionArticles.find(a => a.slug === "tsv-vs-csv")!} />; }
