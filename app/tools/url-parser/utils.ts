// ── URL Parser utils ──────────────────────────────

export type ParsedUrl = {
  href: string;
  protocol: string;
  host: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  origin: string;
  username: string;
  password: string;
  params: { key: string; value: string }[];
};

export function parseUrl(input: string): ParsedUrl {
  const url = new URL(input);
  const params: { key: string; value: string }[] = [];
  url.searchParams.forEach((value, key) => {
    params.push({ key, value });
  });

  return {
    href: url.href,
    protocol: url.protocol,
    host: url.host,
    hostname: url.hostname,
    port: url.port,
    pathname: url.pathname,
    search: url.search,
    hash: url.hash,
    origin: url.origin,
    username: url.username,
    password: url.password,
    params,
  };
}

export function buildUrl(parts: {
  protocol: string;
  hostname: string;
  port: string;
  pathname: string;
  params: { key: string; value: string }[];
  hash: string;
}): string {
  const proto = parts.protocol.endsWith(":") ? parts.protocol : parts.protocol + ":";
  let url = `${proto}//${parts.hostname}`;
  if (parts.port) url += `:${parts.port}`;
  url += parts.pathname || "/";
  if (parts.params.length > 0) {
    const sp = new URLSearchParams();
    for (const { key, value } of parts.params) {
      if (key) sp.append(key, value);
    }
    const qs = sp.toString();
    if (qs) url += `?${qs}`;
  }
  if (parts.hash) url += parts.hash.startsWith("#") ? parts.hash : `#${parts.hash}`;
  return url;
}

export const EXAMPLE_URLS = [
  "https://example.com/search?q=hello+world&lang=en&page=1#results",
  "https://user:pass@api.example.com:8080/v1/users?limit=50&offset=100",
  "https://www.google.com/search?q=url+parser+online&client=firefox&hl=en",
  "ftp://files.example.com/pub/docs/readme.txt",
];
