import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToCalculateTheRealCostOfMeetings() { return <ArticleContent article={expansionArticles.find(a => a.slug === "how-to-calculate-the-real-cost-of-meetings")!} />; }
