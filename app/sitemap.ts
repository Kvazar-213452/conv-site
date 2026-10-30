import { MAIN_DOMEN_NO } from "@/lib/config";

const CONVERTERS = [
  "/tools/json-to-yaml",
  "/tools/json-to-csv",
  "/tools/json-to-xml",
  "/tools/json-to-prisma",
  "/tools/json-to-postgresql",
  "/tools/word-counter",
  "/tools/uuid-to-base64",
  "/tools/url-decode",
  "/tools/url-encode",
  "/tools/string-to-base64",
  "/tools/remove-duplicate-lines",
  "/tools/markdown-to-html",
  "/tools/case-converter",
  "/tools/date-to-unix-timestamp",
  "/tools/json-to-prisma-schema",
  "/tools/json-to-typescript-interface",
  "/tools/hash-generator",
  "/tools/jwt-decoder",
  "/tools/color-converter",
  "/tools/regex-tester",
  "/tools/lorem-ipsum",
  "/tools/password-generator",
  "/tools/text-diff",
  "/tools/number-base-converter",
  "/contacts",
  "/privacy-policy",
  "/terms-of-service",
  "/blog/json-vs-xml",
  "/blog/json-vs-yaml",
  "/blog/base64-explained",
  "/blog/understanding-jwt",
  "/blog/regex-cheatsheet",
  "/blog/md5-vs-sha256",
  "/blog/uuid-vs-nanoid",
  "/blog/markdown-guide",
  "/blog/url-encoding-explained",
  "/"
];

export default function sitemap() {
  const urls = [{ url: MAIN_DOMEN_NO, priority: 1 }];
  
  CONVERTERS.forEach((path) => {
    urls.push({ url: `${MAIN_DOMEN_NO}${path}`, priority: 0.8 });
  });

  return urls;
}