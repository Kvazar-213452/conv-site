// ── Markdown Table Generator utils ────────────────

export type Alignment = "left" | "center" | "right";

export type TableData = {
  headers: string[];
  rows: string[][];
  alignments: Alignment[];
};

export function createEmptyTable(cols: number, rows: number): TableData {
  return {
    headers: Array.from({ length: cols }, (_, i) => `Header ${i + 1}`),
    rows: Array.from({ length: rows }, () => Array.from({ length: cols }, () => "")),
    alignments: Array.from({ length: cols }, () => "left" as Alignment),
  };
}

function escapeCell(text: string): string {
  return text.replace(/\|/g, "\\|").replace(/\n/g, " ");
}

function alignmentSeparator(align: Alignment): string {
  switch (align) {
    case "left": return ":---";
    case "center": return ":---:";
    case "right": return "---:";
  }
}

export function generateMarkdownTable(data: TableData): string {
  const { headers, rows, alignments } = data;

  const headerLine = `| ${headers.map(escapeCell).join(" | ")} |`;
  const separatorLine = `| ${alignments.map(alignmentSeparator).join(" | ")} |`;

  const dataLines = rows
    .filter((row) => row.some((cell) => cell.trim() !== ""))
    .map((row) => `| ${row.map(escapeCell).join(" | ")} |`);

  return [headerLine, separatorLine, ...dataLines].join("\n");
}

export function parseMarkdownTable(md: string): TableData | null {
  const lines = md.trim().split("\n").filter((l) => l.trim());
  if (lines.length < 2) return null;

  const parseLine = (line: string): string[] =>
    line.replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());

  const headers = parseLine(lines[0]);
  const sepCells = parseLine(lines[1]);

  const alignments: Alignment[] = sepCells.map((cell) => {
    const trimmed = cell.trim();
    if (trimmed.startsWith(":") && trimmed.endsWith(":")) return "center";
    if (trimmed.endsWith(":")) return "right";
    return "left";
  });

  const rows = lines.slice(2).map(parseLine);

  return { headers, rows, alignments };
}
