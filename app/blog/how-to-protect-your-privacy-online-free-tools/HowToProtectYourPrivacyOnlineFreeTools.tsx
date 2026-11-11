import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToProtectYourPrivacyOnlineFreeTools() { return <ArticleContent article={expansionArticles.find(a => a.slug === "how-to-protect-your-privacy-online-free-tools")!} />; }
