import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToCalculatePercentageIncreaseDecrease() { return <ArticleContent article={expansionArticles.find(a => a.slug === "how-to-calculate-percentage-increase-decrease")!} />; }
