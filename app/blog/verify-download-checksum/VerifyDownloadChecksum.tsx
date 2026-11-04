import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function VerifyDownloadChecksum() { return <ArticleContent article={expansionArticles.find(a => a.slug === "verify-download-checksum")!} />; }
