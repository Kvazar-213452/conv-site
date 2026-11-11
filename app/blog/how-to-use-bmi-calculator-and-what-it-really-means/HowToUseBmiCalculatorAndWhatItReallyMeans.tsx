import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToUseBmiCalculatorAndWhatItReallyMeans() { return <ArticleContent article={expansionArticles.find(a => a.slug === "how-to-use-bmi-calculator-and-what-it-really-means")!} />; }
