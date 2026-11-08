import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToBuildUtmLinks() { return <ArticleContent article={expansionArticles.find(a => a.slug === "how-to-build-utm-links")!} />; }
