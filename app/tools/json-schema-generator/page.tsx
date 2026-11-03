export const dynamic = "force-static";
import type { Metadata } from "next";
import Script from "next/script";
import JsonSchemaGenerator from "./JsonSchemaGenerator";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

const PAGE_URL = `${MAIN_DOMEN}tools/json-schema-generator`;

export const metadata: Metadata = {
  title: "JSON Schema Generator – Infer Schema from JSON",
  description: "Generate a Draft 2020-12 JSON Schema from any sample JSON. Perfect for OpenAPI, Ajv/zod validators, and API documentation. 100% client-side.",
  keywords: ["json schema generator", "infer json schema", "openapi schema", "draft 2020-12", "ajv schema", "online tool", "client-side", "free developer tool"],
  authors: [{ name: NAME_MAKE }],
  alternates: { canonical: "/tools/json-schema-generator" },
  robots: { index: true, follow: true },
  openGraph: { title: "JSON Schema Generator", description: "Infer JSON Schema from sample JSON — client-side.", url: PAGE_URL, type: "website", images: [{ url: `${MAIN_DOMEN}icon.png`, width: 1200, height: 630, alt: "JSON Schema Generator" }] },
  twitter: { card: "summary_large_image", title: "JSON Schema Generator", description: "Draft 2020-12 schema from JSON." },
};

const JSONLD = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: "JSON Schema Generator", url: PAGE_URL, applicationCategory: "DeveloperApplication", operatingSystem: "Any (browser)", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, description: "Infer a Draft 2020-12 JSON Schema from sample JSON." };

export default function JsonSchemaGeneratorPage() {
  return (<>
    <Script id="json-schema-generator-jsonld" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }} />
    <JsonSchemaGenerator />
  </>);
}
