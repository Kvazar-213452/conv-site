import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToUseThePomodoroTechniqueEffectively() { return <ArticleContent article={expansionArticles.find(a => a.slug === "how-to-use-the-pomodoro-technique-effectively")!} />; }
