import type { Metadata } from "next";
import Header from "@/component/Header";
import Footer from "@/component/Footer";

import "./css/global.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://yourdomain.com"),

  title: {
    default: "DevTools Converter – JSON, UUID, Base64 & More",
    template: "%s | DevTools Converter",
  },

  description:
    "Free online developer tools. Convert JSON, YAML, CSV, Prisma, PostgreSQL, UUID, Base64, Markdown and more. Fast, secure and client-side processing.",

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
  ],

  authors: [{ name: "DevTools Converter" }],
  creator: "DevTools Converter",

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "DevTools Converter – Free Online Developer Tools",
    description:
      "Convert JSON, UUID, Base64, Markdown and more. 100% free online tools for developers.",
    url: "https://yourdomain.com",
    siteName: "DevTools Converter",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "DevTools Converter – Free Online Developer Tools",
    description:
      "Convert JSON, UUID, Base64, Markdown and more instantly.",
  },
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
      </body>
    </html>
  );
}