export const dynamic = "force-static";

import type { Metadata } from "next";
import JsonToGoStruct from "./JsonToGoStruct";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

export const metadata: Metadata = {
  title: "JSON to Go Struct – Generate Go Structs from JSON Online",
  description: "Convert JSON to Go struct definitions with json tags, type inference, and nested struct support. Handles arrays, objects, and all Go types. Free, client-side, and private.",
  keywords: [
    "json to go",
    "json to go struct",
    "json to golang",
    "go struct generator",
    "json to go type",
    "golang struct from json",
    "go code generator",
    "json go converter",
    "go struct online",
    "free go tool"
  ],
  authors: [{ name: NAME_MAKE }],
  alternates: { canonical: "/tools/json-to-go-struct" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "JSON to Go Struct Converter Online",
    description: "Generate Go struct definitions from JSON with type inference and json tags. Runs in your browser.",
    url: `${MAIN_DOMEN}tools/json-to-go-struct`,
    type: "website",
    images: [{ url: `${MAIN_DOMEN}og-image.png`, width: 1024, height: 1024, alt: "JSON to Go Struct Online Tool" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON to Go Struct Online",
    description: "Convert JSON to Go structs with json tags and nested type inference. Fully private and client-side."
  },
};

export default function JsonToGoStructPage() {
  return <JsonToGoStruct />;
}
