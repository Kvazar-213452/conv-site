import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToGenerateUuid() { return <ArticleContent article={expansionArticles.find(a => a.slug === "how-to-generate-uuid")!} />; }
