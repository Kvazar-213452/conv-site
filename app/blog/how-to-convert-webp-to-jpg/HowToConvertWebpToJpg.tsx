import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToConvertWebpToJpg() { return <ArticleContent article={expansionArticles.find(a => a.slug === "how-to-convert-webp-to-jpg")!} />; }
