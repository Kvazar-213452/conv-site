import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // One canonical URL per page: no trailing slash, no www.
  // Keeps every link in sitemap.xml identical to what Google crawls,
  // which avoids "Page with redirect" and "Duplicate without canonical"
  // in Search Console coverage reports.
  trailingSlash: false,

  async redirects() {
    return [
      // ── Domain migration: old → new ──────────────────────────────
      // Permanent 301 from the previous domain so Google transfers the
      // existing ranking signals to utilixio.com. Both www. and apex
      // forms of the old domain map to the new apex. Keep these rules
      // in place for at least 6–12 months after the migration.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.converterdevtools.com" }],
        destination: "https://utilixio.com/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "converterdevtools.com" }],
        destination: "https://utilixio.com/:path*",
        permanent: true,
      },

      // ── Host normalization on the new domain ─────────────────────
      // Force non-www on utilixio.com to match the canonical in
      // MAIN_DOMEN and avoid duplicate-canonical warnings in GSC.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.utilixio.com" }],
        destination: "https://utilixio.com/:path*",
        permanent: true,
      },

      // ── Legacy URLs that still carry inbound links ───────────────
      // Redirect to the real pages so they stop returning 404 in GSC.
      { source: "/tools/json-to-prisma",            destination: "/tools/json-to-prisma-schema", permanent: true },
      { source: "/tools/json-to-postgresql-insert", destination: "/tools/json-to-postgresql",    permanent: true },
      { source: "/tools/url-encode-or-decode",      destination: "/tools/url-encode",            permanent: true },
    ];
  },
};

export default nextConfig;
