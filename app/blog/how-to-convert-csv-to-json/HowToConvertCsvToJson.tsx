import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToConvertCsvToJson() { return <ArticleContent article={expansionArticles.find(a => a.slug === "how-to-convert-csv-to-json")!} />; }
