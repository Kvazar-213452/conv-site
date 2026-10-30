// ── cURL to Fetch converter utils ───────────────────────────

export type Target = "fetch" | "axios" | "xhr";

export type ParsedCurl = {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: string | null;
  isJson: boolean;
};

function tokenizeCurl(input: string): string[] {
  const trimmed = input.trim().replace(/\\\s*\n/g, " ");
  const tokens: string[] = [];
  let i = 0;
  const n = trimmed.length;

  while (i < n) {
    while (i < n && /\s/.test(trimmed[i])) i++;
    if (i >= n) break;

    const ch = trimmed[i];
    if (ch === '"' || ch === "'") {
      const quote = ch;
      i++;
      let buf = "";
      while (i < n && trimmed[i] !== quote) {
        if (trimmed[i] === "\\" && i + 1 < n) {
          buf += trimmed[i + 1];
          i += 2;
        } else {
          buf += trimmed[i];
          i++;
        }
      }
      i++; // closing quote
      tokens.push(buf);
    } else {
      let buf = "";
      while (i < n && !/\s/.test(trimmed[i])) {
        buf += trimmed[i];
        i++;
      }
      tokens.push(buf);
    }
  }
  return tokens;
}

export function parseCurl(input: string): ParsedCurl {
  const tokens = tokenizeCurl(input);
  if (!tokens.length || tokens[0].toLowerCase() !== "curl") {
    throw new Error('Input must start with "curl"');
  }

  let url = "";
  let method = "GET";
  const headers: Record<string, string> = {};
  const dataParts: string[] = [];
  let explicitMethod = false;

  for (let i = 1; i < tokens.length; i++) {
    const t = tokens[i];
    switch (t) {
      case "-X":
      case "--request":
        method = tokens[++i];
        explicitMethod = true;
        break;
      case "-H":
      case "--header": {
        const h = tokens[++i];
        const idx = h.indexOf(":");
        if (idx > 0) {
          const name = h.slice(0, idx).trim();
          const value = h.slice(idx + 1).trim();
          headers[name] = value;
        }
        break;
      }
      case "-d":
      case "--data":
      case "--data-raw":
      case "--data-binary":
        dataParts.push(tokens[++i]);
        if (!explicitMethod) method = "POST";
        break;
      case "--data-urlencode":
        dataParts.push(tokens[++i]);
        if (!explicitMethod) method = "POST";
        break;
      case "-u":
      case "--user": {
        const credentials = tokens[++i];
        headers["Authorization"] = `Basic ${btoa(credentials)}`;
        break;
      }
      case "-A":
      case "--user-agent":
        headers["User-Agent"] = tokens[++i];
        break;
      case "-e":
      case "--referer":
        headers["Referer"] = tokens[++i];
        break;
      case "-b":
      case "--cookie":
        headers["Cookie"] = tokens[++i];
        break;
      case "--compressed":
      case "-k":
      case "--insecure":
      case "-L":
      case "--location":
      case "-s":
      case "--silent":
      case "-v":
      case "--verbose":
      case "-i":
      case "--include":
      case "-I":
      case "--head":
        break;
      default:
        if (!t.startsWith("-") && !url) url = t;
    }
  }

  if (!url) throw new Error("No URL found in cURL command");

  const body = dataParts.length ? dataParts.join("&") : null;
  const contentType = Object.entries(headers).find(([k]) => k.toLowerCase() === "content-type")?.[1] ?? "";
  const isJson =
    (!!body && contentType.toLowerCase().includes("json")) ||
    (!!body && /^\s*[\{\[]/.test(body));

  return { url, method: method.toUpperCase(), headers, body, isJson };
}

export function emitFetch(p: ParsedCurl): string {
  const headerLines = Object.entries(p.headers).map(
    ([k, v]) => `    ${JSON.stringify(k)}: ${JSON.stringify(v)},`,
  );
  const options: string[] = [];
  if (p.method !== "GET") options.push(`  method: ${JSON.stringify(p.method)},`);
  if (headerLines.length) options.push(`  headers: {\n${headerLines.join("\n")}\n  },`);
  if (p.body !== null) {
    if (p.isJson) {
      options.push(`  body: JSON.stringify(${pretty(p.body)}),`);
    } else {
      options.push(`  body: ${JSON.stringify(p.body)},`);
    }
  }

  const call = options.length
    ? `fetch(${JSON.stringify(p.url)}, {\n${options.join("\n")}\n})`
    : `fetch(${JSON.stringify(p.url)})`;

  return `${call}
  .then((res) => res.${p.isJson ? "json" : "text"}())
  .then(console.log)
  .catch(console.error);`;
}

export function emitAxios(p: ParsedCurl): string {
  const config: string[] = [`  url: ${JSON.stringify(p.url)},`];
  config.push(`  method: ${JSON.stringify(p.method.toLowerCase())},`);
  if (Object.keys(p.headers).length) {
    const headerLines = Object.entries(p.headers).map(
      ([k, v]) => `    ${JSON.stringify(k)}: ${JSON.stringify(v)},`,
    );
    config.push(`  headers: {\n${headerLines.join("\n")}\n  },`);
  }
  if (p.body !== null) {
    config.push(`  data: ${p.isJson ? pretty(p.body) : JSON.stringify(p.body)},`);
  }
  return `import axios from "axios";

axios({
${config.join("\n")}
}).then((res) => console.log(res.data))
  .catch(console.error);`;
}

export function emitXhr(p: ParsedCurl): string {
  const lines = [
    `const xhr = new XMLHttpRequest();`,
    `xhr.open(${JSON.stringify(p.method)}, ${JSON.stringify(p.url)});`,
  ];
  for (const [k, v] of Object.entries(p.headers)) {
    lines.push(`xhr.setRequestHeader(${JSON.stringify(k)}, ${JSON.stringify(v)});`);
  }
  lines.push(`xhr.onload = () => console.log(xhr.responseText);`);
  if (p.body !== null) {
    lines.push(
      p.isJson
        ? `xhr.send(JSON.stringify(${pretty(p.body)}));`
        : `xhr.send(${JSON.stringify(p.body)});`,
    );
  } else {
    lines.push(`xhr.send();`);
  }
  return lines.join("\n");
}

function pretty(raw: string): string {
  try {
    return JSON.stringify(JSON.parse(raw), null, 2);
  } catch {
    return JSON.stringify(raw);
  }
}
