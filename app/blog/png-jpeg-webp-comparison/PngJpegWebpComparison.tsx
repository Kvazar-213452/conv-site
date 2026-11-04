import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function PngJpegWebpComparison() { return <ArticleContent article={expansionArticles.find(a => a.slug === "png-jpeg-webp-comparison")!} />; }
