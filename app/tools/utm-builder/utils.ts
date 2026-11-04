// ── UTM Link Builder utils ────────────────────────

export type UtmParams = {
  url: string;
  source: string;
  medium: string;
  campaign: string;
  term: string;
  content: string;
};

export const DEFAULT_UTM: UtmParams = {
  url: "https://example.com/landing-page",
  source: "google",
  medium: "cpc",
  campaign: "spring_sale_2024",
  term: "running shoes",
  content: "hero_banner",
};

export function buildUtmUrl(params: UtmParams): string {
  let base = params.url.trim();
  if (!base) throw new Error("URL is required");
  if (!/^https?:\/\//i.test(base)) base = "https://" + base;

  const url = new URL(base);

  if (params.source.trim()) url.searchParams.set("utm_source", params.source.trim());
  if (params.medium.trim()) url.searchParams.set("utm_medium", params.medium.trim());
  if (params.campaign.trim()) url.searchParams.set("utm_campaign", params.campaign.trim());
  if (params.term.trim()) url.searchParams.set("utm_term", params.term.trim());
  if (params.content.trim()) url.searchParams.set("utm_content", params.content.trim());

  return url.toString();
}

export function parseUtmUrl(fullUrl: string): UtmParams {
  const url = new URL(fullUrl);
  return {
    url: `${url.origin}${url.pathname}`,
    source: url.searchParams.get("utm_source") || "",
    medium: url.searchParams.get("utm_medium") || "",
    campaign: url.searchParams.get("utm_campaign") || "",
    term: url.searchParams.get("utm_term") || "",
    content: url.searchParams.get("utm_content") || "",
  };
}
