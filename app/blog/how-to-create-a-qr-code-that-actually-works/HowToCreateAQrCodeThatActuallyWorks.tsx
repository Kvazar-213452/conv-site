import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToCreateAQrCodeThatActuallyWorks() { return <ArticleContent article={expansionArticles.find(a => a.slug === "how-to-create-a-qr-code-that-actually-works")!} />; }
