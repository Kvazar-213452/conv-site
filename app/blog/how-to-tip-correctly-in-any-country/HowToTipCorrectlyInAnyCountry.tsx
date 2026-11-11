import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToTipCorrectlyInAnyCountry() { return <ArticleContent article={expansionArticles.find(a => a.slug === "how-to-tip-correctly-in-any-country")!} />; }
