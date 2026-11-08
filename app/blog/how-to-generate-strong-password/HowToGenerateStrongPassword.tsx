import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToGenerateStrongPassword() { return <ArticleContent article={expansionArticles.find(a => a.slug === "how-to-generate-strong-password")!} />; }
