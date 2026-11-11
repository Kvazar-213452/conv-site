import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToCalculateIfRentingOrBuyingIsCheaper() { return <ArticleContent article={expansionArticles.find(a => a.slug === "how-to-calculate-if-renting-or-buying-is-cheaper")!} />; }
