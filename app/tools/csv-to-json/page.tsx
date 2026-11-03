export const dynamic = "force-static";
import type { Metadata } from "next";
import Script from "next/script";
import CsvToJson from "./CsvToJson";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

const PAGE_URL = `${MAIN_DOMEN}tools/csv-to-json`;

export const metadata: Metadata = {
  title: "CSV to JSON Converter – Type Inference, 100% Client-Side",
  description: "Convert CSV, TSV, or semicolon-separated spreadsheet data to JSON with intelligent type inference. Handles quoted fields, embedded commas, newlines. Private and free.",
  keywords: ["csv to json", "csv parser", "tsv to json", "spreadsheet to json", "excel to json", "convert csv", "online tool", "client-side", "no sign-up", "free developer tool"],
  authors: [{ name: NAME_MAKE }],
  alternates: { canonical: "/tools/csv-to-json" },
  robots: { index: true, follow: true },
  openGraph: { title: "CSV to JSON Converter", description: "Type-aware CSV → JSON in your browser.", url: PAGE_URL, type: "website", images: [{ url: `${MAIN_DOMEN}icon.png`, width: 1200, height: 630, alt: "CSV to JSON" }] },
  twitter: { card: "summary_large_image", title: "CSV to JSON Converter", description: "Spreadsheet to JSON — client-side." },
};

const JSONLD = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "SoftwareApplication", name: "CSV to JSON Converter", url: PAGE_URL, applicationCategory: "DeveloperApplication", operatingSystem: "Any (browser)", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, description: "Parse CSV, TSV, or semicolon-separated data into JSON with type inference, client-side." },
    { "@type": "FAQPage", mainEntity: [
      { "@type": "Question", name: "Does it handle quoted multi-line cells?", acceptedAnswer: { "@type": "Answer", text: "Yes. Cells enclosed in double quotes may span multiple lines; the parser preserves them." } },
      { "@type": "Question", name: "Is my data uploaded?", acceptedAnswer: { "@type": "Answer", text: "No. Parsing happens entirely in your browser — safe for internal spreadsheets and confidential exports." } },
    ]},
  ],
};

export default function CsvToJsonPage() {
  return (<>
    <Script id="csv-to-json-jsonld" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }} />
    <CsvToJson />
  </>);
}
