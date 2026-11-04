import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function SpreadsheetToJson() { return <ArticleContent article={expansionArticles.find(a => a.slug === "spreadsheet-to-json")!} />; }
