import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToWriteCoverLetter() { return <ArticleContent article={expansionArticles.find(a => a.slug === "how-to-write-cover-letter")!} />; }
