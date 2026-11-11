import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToPickAccessibleColorCombinations() { return <ArticleContent article={expansionArticles.find(a => a.slug === "how-to-pick-accessible-color-combinations")!} />; }
