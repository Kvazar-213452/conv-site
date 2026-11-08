import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToCalculateGpa() { return <ArticleContent article={expansionArticles.find(a => a.slug === "how-to-calculate-gpa")!} />; }
