import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToMergePdfFilesOnline() { return <ArticleContent article={expansionArticles.find(a => a.slug === "how-to-merge-pdf-files-online")!} />; }
