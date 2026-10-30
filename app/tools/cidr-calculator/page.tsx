export const dynamic = "force-static";

import type { Metadata } from "next";
import Script from "next/script";
import CidrCalculator from "./CidrCalculator";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

const PAGE_URL = `${MAIN_DOMEN}tools/cidr-calculator`;

export const metadata: Metadata = {
  title: "CIDR Calculator – IPv4 Subnet, Mask, Range",
  description: "Parse any IPv4 CIDR block for netmask, wildcard, network and broadcast addresses, usable host range, host count, and RFC-1918 classification. 100% client-side.",
  keywords: [
    "cidr calculator",
    "ipv4 subnet",
    "subnet calculator",
    "ipv4 netmask",
    "cidr to netmask",
    "network address",
    "broadcast address",
    "rfc 1918",
    "vpc subnet",
    "aws subnet",
    "firewall rules",
    "online tool",
    "client-side",
    "private tool",
    "no sign-up",
    "free developer tool"
  ],
  authors: [{ name: NAME_MAKE }],
  alternates: { canonical: "/tools/cidr-calculator" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "CIDR Calculator Online",
    description: "IPv4 subnet math — mask, range, host count, RFC-1918 classification.",
    url: PAGE_URL,
    type: "website",
    images: [{ url: `${MAIN_DOMEN}icon.png`, width: 1200, height: 630, alt: "CIDR Calculator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CIDR Calculator Online",
    description: "IPv4 subnet info — fully client-side.",
  },
};

const JSONLD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "CIDR Calculator",
      url: PAGE_URL,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any (browser)",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description: "Parse IPv4 CIDR blocks for netmask, wildcard, network, broadcast, usable host range, and classification.",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Why do /31 and /32 have different host counts?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A /32 is a single-host route. A /31 under RFC 3021 is used for point-to-point links and treats both addresses as usable. Subnets of /30 and larger reserve the network and broadcast addresses.",
          },
        },
        {
          "@type": "Question",
          name: "Does it support IPv6?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Not in this release — the calculator currently covers IPv4 subnets.",
          },
        },
        {
          "@type": "Question",
          name: "Is anything resolved against my network?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. The calculator operates on text only — nothing is probed or sent to a server.",
          },
        },
      ],
    },
  ],
};

export default function CidrCalculatorPage() {
  return (
    <>
      <Script
        id="cidr-calculator-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }}
      />
      <CidrCalculator />
    </>
  );
}
