import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // One canonical URL per page: no trailing slash, no www.
  // This keeps every link in sitemap.xml identical to what Google crawls,
  // which avoids "Page with redirect" and "Duplicate without canonical"
  // being flagged in Search Console coverage reports.
  trailingSlash: false,

  async redirects() {
    return [
      // Force non-www. The sitemap and canonical tags all use the apex host;
      // this permanent redirect makes www.converterdevtools.com → converterdevtools.com
      // a one-hop normalization that Google follows and consolidates.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.converterdevtools.com" }],
        destination: "https://converterdevtools.com/:path*",
        permanent: true,
      },
      // Legacy URLs that still carry inbound links or appear in the old
      // sitemap — redirect them to the real pages so they stop returning 404
      // in Search Console.
      { source: "/tools/json-to-prisma",            destination: "/tools/json-to-prisma-schema", permanent: true },
      { source: "/tools/json-to-postgresql-insert", destination: "/tools/json-to-postgresql",    permanent: true },
      { source: "/tools/url-encode-or-decode",      destination: "/tools/url-encode",            permanent: true },
    ];
  },
};

export default nextConfig;
