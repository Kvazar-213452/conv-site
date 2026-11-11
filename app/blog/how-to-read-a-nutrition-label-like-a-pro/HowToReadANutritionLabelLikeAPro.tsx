import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToReadANutritionLabelLikeAPro() { return <ArticleContent article={expansionArticles.find(a => a.slug === "how-to-read-a-nutrition-label-like-a-pro")!} />; }
