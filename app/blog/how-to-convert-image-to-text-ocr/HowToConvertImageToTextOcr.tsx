import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToConvertImageToTextOcr() { return <ArticleContent article={expansionArticles.find(a => a.slug === "how-to-convert-image-to-text-ocr")!} />; }
