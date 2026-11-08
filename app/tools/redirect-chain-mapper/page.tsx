import type { Metadata } from "next";
import GeneratedGrowthPage, { generatedGrowthMetadata } from "@/component/GeneratedGrowthPage";
const slug = "redirect-chain-mapper";
export function generateMetadata(): Metadata { return generatedGrowthMetadata(slug); }
export default function Page() { return <GeneratedGrowthPage slug={slug} />; }
