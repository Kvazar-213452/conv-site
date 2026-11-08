import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function SerpPreviewToolHowToCheck() { return <ArticleContent article={expansionArticles.find(a => a.slug === "serp-preview-tool-how-to-check")!} />; }
