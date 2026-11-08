import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToWriteMetaDescriptions() { return <ArticleContent article={expansionArticles.find(a => a.slug === "how-to-write-meta-descriptions")!} />; }
