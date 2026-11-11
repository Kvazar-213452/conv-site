import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToSleepBetterUsingSleepCycleCalculator() { return <ArticleContent article={expansionArticles.find(a => a.slug === "how-to-sleep-better-using-sleep-cycle-calculator")!} />; }
