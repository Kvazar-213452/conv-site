import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToCompressPdfForEmailAttachments() { return <ArticleContent article={expansionArticles.find(a => a.slug === "how-to-compress-pdf-for-email-attachments")!} />; }
