import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToCreateAStrongPasswordYouCanActuallyRemember() { return <ArticleContent article={expansionArticles.find(a => a.slug === "how-to-create-a-strong-password-you-can-actually-remember")!} />; }
