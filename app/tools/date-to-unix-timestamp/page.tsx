export const dynamic = "force-static";

import type { Metadata } from "next";
import DateToTimestamp from "./DateToTimestamp";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Date to Unix Timestamp Converter (Seconds & Milliseconds)",
  description:
    "Free online Date to Unix Timestamp converter. Convert ISO 8601, RFC 2822, and other date formats to Unix time (seconds or milliseconds) and back. Works 100% in your browser.",
  keywords: [
    "date to timestamp",
    "unix timestamp converter",
    "timestamp to date",
    "epoch converter",
    "unix time seconds",
    "milliseconds to date",
    "iso 8601 converter",
  ],
  authors: [{ name: NAME_MAKE }],
  creator: NAME_MAKE,
  metadataBase: new URL(MAIN_DOMEN),
  alternates: {
    canonical: "/tools/date-to-unix-timestamp",
  },
  openGraph: {
    title: "Date ↔ Unix Timestamp Converter",
    description:
      "Convert dates to Unix timestamps and timestamps back to readable dates. Supports seconds & milliseconds. Free and instant.",
    url: `${MAIN_DOMEN}tools/date-to-unix-timestamp`,
    siteName: NAME_MAKE,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Date ↔ Unix Timestamp Converter",
    description:
      "Free online Unix timestamp converter. Seconds & milliseconds supported.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function DateToTimestampPage() {
  return (
    <DateToTimestamp />
  );
}