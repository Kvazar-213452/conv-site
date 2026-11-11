import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToUnderstandLoanAmortizationSchedules() { return <ArticleContent article={expansionArticles.find(a => a.slug === "how-to-understand-loan-amortization-schedules")!} />; }
