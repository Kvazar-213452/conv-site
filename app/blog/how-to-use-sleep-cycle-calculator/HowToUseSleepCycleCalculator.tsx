import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToUseSleepCycleCalculator() { return <ArticleContent article={expansionArticles.find(a => a.slug === "how-to-use-sleep-cycle-calculator")!} />; }
