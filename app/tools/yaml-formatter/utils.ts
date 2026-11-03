// ── YAML Formatter utils ──────────────────────────

export type YamlIndent = 2 | 4 | 8;

export function formatYaml(input: string, indent: YamlIndent): string {
  const lines = input.split("\n");
  const result: string[] = [];

  let currentIndent = 0;

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      result.push(trimmed);
      continue;
    }

    const existingSpaces = rawLine.search(/\S/);
    if (existingSpaces < 0) {
      result.push("");
      continue;
    }

    const oldIndent = existingSpaces;
    const isList = trimmed.startsWith("- ");
    const isKey = /^[\w"'][^:]*:/.test(trimmed) && !trimmed.startsWith("- ");

    if (oldIndent === 0) {
      currentIndent = 0;
    } else {
      const prevLine = result.length > 0 ? result[result.length - 1] : "";
      const prevTrimmed = prevLine.trim();
      const prevIndentLen = prevLine.search(/\S/) < 0 ? 0 : prevLine.search(/\S/);

      if (oldIndent > (lines.indexOf(rawLine) > 0 ? lines[lines.indexOf(rawLine) - 1].search(/\S/) : 0)) {
        currentIndent = prevIndentLen + indent;
      } else if (oldIndent < (lines.indexOf(rawLine) > 0 ? lines[lines.indexOf(rawLine) - 1].search(/\S/) : 0)) {
        currentIndent = Math.max(0, currentIndent - indent);
      }
    }

    result.push(" ".repeat(currentIndent) + trimmed);
  }

  return result.join("\n");
}

export function minifyYaml(input: string): string {
  return input
    .split("\n")
    .filter((line) => {
      const trimmed = line.trim();
      return trimmed.length > 0 && !trimmed.startsWith("#");
    })
    .map((line) => line.trim())
    .join("\n");
}

export const EXAMPLE_YAML = `# Application config
server:
    host: localhost
    port: 8080
    ssl:
        enabled: true
        cert: /etc/ssl/cert.pem
        key: /etc/ssl/key.pem

database:
    driver: postgres
    connection:
        host: db.example.com
        port: 5432
        name: myapp
    pool:
        min: 2
        max: 10

logging:
    level: info
    outputs:
        - console
        - file
    file:
        path: /var/log/app.log
        rotate: daily`;
