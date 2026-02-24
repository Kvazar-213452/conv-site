import { MAIN_DOMEN_NO } from "@/lib/config";

const CONVERTERS = [
  "/tools/json-to-yaml",
  "/tools/json-to-csv",
  "/tools/json-to-xml",
  "/tools/json-to-prisma",
  "/tools/json-to-postgresql",
  "/tools/word-counter",
  "/tools/uuid-to-base64",
  "/tools/url-encode-or-decode",
  "/tools/string-to-base64",
  "/tools/remove-duplicate-lines",
  "/tools/markdown-to-html",
  "/tools/case-converter",
  "/tools/date-to-unix-timestamp",
  "/tools/json-to-prisma-schema",
  "/tools/json-to-typescript-interface",
  "/contacts",
  "/privacy-policy",
  "/terms-of-service",
];

export default function sitemap() {
  const urls = [{ url: MAIN_DOMEN_NO, priority: 1 }];
  
  CONVERTERS.forEach((path) => {
    urls.push({ url: `${MAIN_DOMEN_NO}${path}`, priority: 0.8 });
  });

  return urls;
}