import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToTrackMacrosForFitnessGoals() { return <ArticleContent article={expansionArticles.find(a => a.slug === "how-to-track-macros-for-fitness-goals")!} />; }
