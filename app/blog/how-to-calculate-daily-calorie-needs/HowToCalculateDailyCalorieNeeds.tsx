import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToCalculateDailyCalorieNeeds() { return <ArticleContent article={expansionArticles.find(a => a.slug === "how-to-calculate-daily-calorie-needs")!} />; }
