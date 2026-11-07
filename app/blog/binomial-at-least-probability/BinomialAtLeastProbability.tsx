import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function BinomialAtLeastProbability() { return <ArticleContent article={expansionArticles.find(a => a.slug === "binomial-at-least-probability")!} />; }
