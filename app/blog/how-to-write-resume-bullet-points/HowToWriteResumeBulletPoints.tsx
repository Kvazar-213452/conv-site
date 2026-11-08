import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToWriteResumeBulletPoints() { return <ArticleContent article={expansionArticles.find(a => a.slug === "how-to-write-resume-bullet-points")!} />; }
