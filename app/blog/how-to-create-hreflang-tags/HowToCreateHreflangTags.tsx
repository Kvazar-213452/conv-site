import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToCreateHreflangTags() { return <ArticleContent article={expansionArticles.find(a => a.slug === "how-to-create-hreflang-tags")!} />; }
