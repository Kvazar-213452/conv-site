import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function SubresourceIntegrityGuide() { return <ArticleContent article={expansionArticles.find(a => a.slug === "subresource-integrity-guide")!} />; }
