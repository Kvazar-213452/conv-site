import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToWriteProfessionalEmail() { return <ArticleContent article={expansionArticles.find(a => a.slug === "how-to-write-professional-email")!} />; }
