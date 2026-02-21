export const dynamic = "force-static";

import type { Metadata } from "next";
import JSON_TO_YAML from "./JSON_TO_YAML";

export const metadata: Metadata = {
  title: "JSON to YAML Converter & YAML to JSON Online Tool",
  description: "Instantly convert JSON to YAML or YAML to JSON. Free online, client-side, handles nested objects, arrays, nulls, and booleans.",
  keywords: ["json to yaml", "yaml to json", "yaml converter", "json converter", "online yaml"],
  alternates: { canonical: "https://yoursite.com/json-to-yaml" },
  openGraph: {
    title: "JSON ⇄ YAML Converter",
    description: "Convert JSON objects to YAML or YAML to JSON instantly, with proper indentation and nested structures.",
    url: "https://yoursite.com/json-to-yaml",
    type: "website"
  },
  robots: { index: true, follow: true }
};

export default function JSON_TO_YAMLPage() {
  return (
    <JSON_TO_YAML />
  );
}