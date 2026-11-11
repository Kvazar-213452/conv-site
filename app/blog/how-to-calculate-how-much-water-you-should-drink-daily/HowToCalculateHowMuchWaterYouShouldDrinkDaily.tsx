import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToCalculateHowMuchWaterYouShouldDrinkDaily() { return <ArticleContent article={expansionArticles.find(a => a.slug === "how-to-calculate-how-much-water-you-should-drink-daily")!} />; }
