import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToTrackSubscriptionCostsAndSaveHundreds() { return <ArticleContent article={expansionArticles.find(a => a.slug === "how-to-track-subscription-costs-and-save-hundreds")!} />; }
