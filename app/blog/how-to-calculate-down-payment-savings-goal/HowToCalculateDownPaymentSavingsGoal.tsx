import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToCalculateDownPaymentSavingsGoal() { return <ArticleContent article={expansionArticles.find(a => a.slug === "how-to-calculate-down-payment-savings-goal")!} />; }
