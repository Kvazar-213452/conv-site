import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function SalaryToHourlyConversion() { return <ArticleContent article={expansionArticles.find(a => a.slug === "salary-to-hourly-conversion")!} />; }
