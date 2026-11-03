export const dynamic = "force-static";
import type { Metadata } from "next";
import Script from "next/script";
import YamlToJson from "./YamlToJson";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

const PAGE_URL = `${MAIN_DOMEN}tools/yaml-to-json`;

export const metadata: Metadata = {
  title: "YAML to JSON Converter – Kubernetes, Compose, Actions",
  description: "Parse YAML configuration files (Kubernetes, GitHub Actions, docker-compose, Ansible) into clean JSON. 100% client-side with type inference.",
  keywords: ["yaml to json", "yaml parser", "kubernetes yaml", "github actions", "docker compose", "ansible", "convert yaml", "online tool", "client-side", "free developer tool"],
  authors: [{ name: NAME_MAKE }],
  alternates: { canonical: "/tools/yaml-to-json" },
  robots: { index: true, follow: true },
  openGraph: { title: "YAML to JSON Converter", description: "Parse YAML to JSON — client-side.", url: PAGE_URL, type: "website", images: [{ url: `${MAIN_DOMEN}icon.png`, width: 1200, height: 630, alt: "YAML to JSON" }] },
  twitter: { card: "summary_large_image", title: "YAML to JSON Converter", description: "YAML → JSON in your browser." },
};

const JSONLD = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "SoftwareApplication", name: "YAML to JSON Converter", url: PAGE_URL, applicationCategory: "DeveloperApplication", operatingSystem: "Any (browser)", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, description: "Parse YAML configs into JSON in the browser." },
    { "@type": "FAQPage", mainEntity: [
      { "@type": "Question", name: "What is the Norway problem?", acceptedAnswer: { "@type": "Answer", text: "In YAML 1.1, 'country: NO' parsed as false. This converter follows YAML 1.2 where NO stays a string." } },
      { "@type": "Question", name: "Is my YAML sent to a server?", acceptedAnswer: { "@type": "Answer", text: "No. Parsing is 100% client-side — safe for configs containing API keys and secrets." } },
    ]},
  ],
};

export default function YamlToJsonPage() {
  return (<>
    <Script id="yaml-to-json-jsonld" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }} />
    <YamlToJson />
  </>);
}
