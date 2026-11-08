import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToPickAccessibleColors() { return <ArticleContent article={expansionArticles.find(a => a.slug === "how-to-pick-accessible-colors")!} />; }
