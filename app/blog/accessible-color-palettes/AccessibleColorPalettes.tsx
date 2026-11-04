import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function AccessibleColorPalettes() { return <ArticleContent article={expansionArticles.find(a => a.slug === "accessible-color-palettes")!} />; }
