import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToPrepareImagesForTheWebCompleteGuide() { return <ArticleContent article={expansionArticles.find(a => a.slug === "how-to-prepare-images-for-the-web-complete-guide")!} />; }
