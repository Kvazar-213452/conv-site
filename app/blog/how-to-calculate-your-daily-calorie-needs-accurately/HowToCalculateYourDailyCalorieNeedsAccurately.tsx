import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToCalculateYourDailyCalorieNeedsAccurately() { return <ArticleContent article={expansionArticles.find(a => a.slug === "how-to-calculate-your-daily-calorie-needs-accurately")!} />; }
