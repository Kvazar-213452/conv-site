export const dynamic = "force-static";

import type { Metadata } from "next";
import Script from "next/script";
import UnixPermissions from "./UnixPermissions";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

const PAGE_URL = `${MAIN_DOMEN}tools/unix-permissions`;

export const metadata: Metadata = {
  title: "Unix Permissions Calculator – chmod 755 ↔ rwxr-xr-x",
  description: "Translate between chmod numeric notation (755) and symbolic notation (rwxr-xr-x) with a live permission matrix. setuid, setgid, and sticky bit support. 100% client-side.",
  keywords: [
    "chmod calculator",
    "unix permissions",
    "linux permissions",
    "chmod 755",
    "chmod 644",
    "rwx permissions",
    "setuid",
    "setgid",
    "sticky bit",
    "file permissions",
    "online tool",
    "client-side",
    "private tool",
    "no sign-up",
    "free developer tool"
  ],
  authors: [{ name: NAME_MAKE }],
  alternates: { canonical: "/tools/unix-permissions" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Unix Permissions Calculator",
    description: "chmod numeric ↔ symbolic translator with setuid, setgid, and sticky bit support.",
    url: PAGE_URL,
    type: "website",
    images: [{ url: `${MAIN_DOMEN}og-image.png`, width: 1024, height: 1024, alt: "Unix Permissions Calculator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Unix Permissions Calculator",
    description: "chmod 755 ↔ rwxr-xr-x in your browser.",
  },
};

const JSONLD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "Unix Permissions Calculator",
      url: PAGE_URL,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any (browser)",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description: "Translate chmod numeric notation to symbolic notation with setuid, setgid, and sticky bit support.",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What does chmod 755 mean?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Owner gets read + write + execute (7), group gets read + execute (5), everyone else gets read + execute (5). It is the typical setting for scripts, directories, and binaries.",
          },
        },
        {
          "@type": "Question",
          name: "What is the sticky bit for?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "On a directory, the sticky bit restricts deletion so only the file's owner can remove it. /tmp uses this to prevent users from deleting each other's files.",
          },
        },
        {
          "@type": "Question",
          name: "Does this read my local files?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. The calculator operates on text only — nothing is probed, read, or sent to a server.",
          },
        },
      ],
    },
  ],
};

export default function UnixPermissionsPage() {
  return (
    <>
      <Script
        id="unix-permissions-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }}
      />
      <UnixPermissions />
    </>
  );
}
