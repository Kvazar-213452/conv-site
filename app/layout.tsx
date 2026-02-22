import type { Metadata } from "next";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";
import Header from "@/component/Header";
import Footer from "@/component/Footer";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "./css/global.css";

export const metadata: Metadata = {
  metadataBase: new URL(MAIN_DOMEN),

  title: {
    default: "DevTools Converter – JSON, UUID, Base64 & More",
    template: "%s | DevTools Converter",
  },

  description:
    "Free online developer tools. Convert JSON, YAML, CSV, Prisma, PostgreSQL, UUID, Base64, Markdown and more. Fast, secure, client-side, and fully online. Perfect for developers, programmers, and data engineers.",

  keywords: [
    "json to yaml",
    "json to csv",
    "json to xml",
    "json to prisma",
    "json to postgresql insert",
    "uuid to base64",
    "markdown to html",
    "case converter",
    "unix timestamp converter",
    "developer tools online",
    "online json converter",
    "free developer tools",
    "json validator",
    "yaml converter",
    "csv parser",
    "prisma schema generator",
  ],

  authors: [{ name: NAME_MAKE }],
  creator: NAME_MAKE,

  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },

  openGraph: {
    title: "DevTools Converter – Free Online Developer Tools",
    description:
      "Convert JSON, UUID, Base64, Markdown and more. 100% free online tools for developers, programmers, and data engineers. No installation required.",
    url: MAIN_DOMEN,
    siteName: NAME_MAKE,
    type: "website",
    images: [
      {
        url: `${MAIN_DOMEN}icon.png`,
        width: 1200,
        height: 630,
        alt: "DevTools Converter - Online Developer Tools",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "DevTools Converter – Free Online Developer Tools",
    description:
      "Convert JSON, UUID, Base64, Markdown and more instantly. Fast, secure, client-side tools."
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <div className="page-wrapper">
          <main>{children}</main>
        </div>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}