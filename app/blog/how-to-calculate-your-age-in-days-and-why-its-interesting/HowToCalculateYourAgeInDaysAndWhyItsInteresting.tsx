import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToCalculateYourAgeInDaysAndWhyItsInteresting() { return <ArticleContent article={expansionArticles.find(a => a.slug === "how-to-calculate-your-age-in-days-and-why-its-interesting")!} />; }
