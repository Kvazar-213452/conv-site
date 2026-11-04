import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function PxVsRem() { return <ArticleContent article={expansionArticles.find(a => a.slug === "px-vs-rem")!} />; }
