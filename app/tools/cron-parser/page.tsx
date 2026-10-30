export const dynamic = "force-static";

import type { Metadata } from "next";
import Script from "next/script";
import CronParser from "./CronParser";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

const PAGE_URL = `${MAIN_DOMEN}tools/cron-parser`;

export const metadata: Metadata = {
  title: "Cron Expression Parser – Explain & Preview Next Runs",
  description: "Decode any Unix-style cron expression to plain English and preview the next five scheduled executions. Supports 5-field and 6-field cron, ranges, lists, and steps. 100% client-side.",
  keywords: [
    "cron parser",
    "cron expression",
    "crontab explainer",
    "cron schedule",
    "cron next run",
    "kubernetes cronjob",
    "github actions schedule",
    "quartz cron",
    "vercel cron",
    "aws eventbridge",
    "cron 6 field",
    "cron seconds",
    "cron online",
    "client-side",
    "private tool",
    "free developer tool"
  ],
  authors: [{ name: NAME_MAKE }],
  alternates: { canonical: "/tools/cron-parser" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Cron Expression Parser Online",
    description: "Translate cron to English and preview the next five runs. 5 and 6 field cron supported.",
    url: PAGE_URL,
    type: "website",
    images: [{ url: `${MAIN_DOMEN}icon.png`, width: 1200, height: 630, alt: "Cron Expression Parser" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cron Expression Parser Online",
    description: "Explain cron and preview next runs — 100% client-side.",
  },
};

const JSONLD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "Cron Expression Parser",
      url: PAGE_URL,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any (browser)",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description: "Decode cron expressions to plain English and preview next executions client-side.",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Does this parser support 6-field cron with seconds?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Both 5-field (minute hour dom month dow) and 6-field (seconds minute hour dom month dow) forms are supported.",
          },
        },
        {
          "@type": "Question",
          name: "How is the day-of-month / day-of-week conflict resolved?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "When both fields are restricted, the parser follows classic Vixie cron: the job runs if EITHER field matches.",
          },
        },
        {
          "@type": "Question",
          name: "What timezone are the next-run previews in?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Your browser's local timezone. Note that most server crons and Kubernetes CronJobs default to UTC.",
          },
        },
      ],
    },
  ],
};

export default function CronParserPage() {
  return (
    <>
      <Script
        id="cron-parser-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }}
      />
      <CronParser />
    </>
  );
}
