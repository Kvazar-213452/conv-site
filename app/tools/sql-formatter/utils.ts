// ── SQL Formatter utils ─────────────────────────────────────
// A pragmatic SQL formatter for everyday Postgres / MySQL / SQLite /
// MSSQL queries. Not a full parser — tokens are classified and
// line-broken on major clauses with configurable indentation.

const KEYWORDS = new Set([
  "SELECT", "FROM", "WHERE", "AND", "OR", "NOT", "IN", "IS", "NULL",
  "JOIN", "INNER", "LEFT", "RIGHT", "FULL", "OUTER", "CROSS", "LATERAL",
  "ON", "USING", "GROUP", "BY", "ORDER", "HAVING", "LIMIT", "OFFSET",
  "UNION", "INTERSECT", "EXCEPT", "ALL", "DISTINCT",
  "INSERT", "INTO", "VALUES", "UPDATE", "SET", "DELETE",
  "CREATE", "TABLE", "VIEW", "INDEX", "ALTER", "DROP", "RENAME",
  "CASE", "WHEN", "THEN", "ELSE", "END",
  "AS", "WITH", "RETURNING", "USING", "DEFAULT",
  "PRIMARY", "KEY", "FOREIGN", "REFERENCES", "UNIQUE", "CHECK", "CONSTRAINT",
  "BEGIN", "COMMIT", "ROLLBACK", "TRANSACTION", "SAVEPOINT",
  "TRUE", "FALSE", "LIKE", "ILIKE", "BETWEEN", "EXISTS",
  "ASC", "DESC", "NULLS", "FIRST", "LAST",
  "COUNT", "SUM", "AVG", "MIN", "MAX", "COALESCE", "NULLIF", "CAST",
]);

const BREAK_BEFORE = new Set([
  "FROM", "WHERE", "GROUP", "ORDER", "HAVING", "LIMIT", "OFFSET",
  "UNION", "INTERSECT", "EXCEPT", "RETURNING", "VALUES", "SET",
  "LEFT", "RIGHT", "INNER", "FULL", "OUTER", "CROSS", "JOIN",
  "ON", "AND", "OR",
]);

type Token = { type: "ws" | "str" | "num" | "ident" | "punct" | "comment"; value: string };

function tokenize(sql: string): Token[] {
  const out: Token[] = [];
  let i = 0;
  const n = sql.length;

  while (i < n) {
    const ch = sql[i];

    if (/\s/.test(ch)) {
      let buf = "";
      while (i < n && /\s/.test(sql[i])) buf += sql[i++];
      out.push({ type: "ws", value: buf });
      continue;
    }
    if (ch === "-" && sql[i + 1] === "-") {
      let buf = "";
      while (i < n && sql[i] !== "\n") buf += sql[i++];
      out.push({ type: "comment", value: buf });
      continue;
    }
    if (ch === "/" && sql[i + 1] === "*") {
      let buf = "";
      while (i < n && !(sql[i] === "*" && sql[i + 1] === "/")) buf += sql[i++];
      if (i < n) { buf += sql[i++]; buf += sql[i++]; }
      out.push({ type: "comment", value: buf });
      continue;
    }
    if (ch === "'" || ch === '"' || ch === "`") {
      const quote = ch;
      let buf = quote;
      i++;
      while (i < n) {
        if (sql[i] === "\\" && i + 1 < n) { buf += sql[i] + sql[i + 1]; i += 2; continue; }
        if (sql[i] === quote && sql[i + 1] === quote) { buf += quote + quote; i += 2; continue; }
        buf += sql[i];
        if (sql[i] === quote) { i++; break; }
        i++;
      }
      out.push({ type: "str", value: buf });
      continue;
    }
    if (/[0-9]/.test(ch) || (ch === "." && /[0-9]/.test(sql[i + 1] ?? ""))) {
      let buf = "";
      while (i < n && /[0-9.eE+\-]/.test(sql[i])) buf += sql[i++];
      out.push({ type: "num", value: buf });
      continue;
    }
    if (/[A-Za-z_@$#]/.test(ch)) {
      let buf = "";
      while (i < n && /[A-Za-z0-9_@$#.]/.test(sql[i])) buf += sql[i++];
      out.push({ type: "ident", value: buf });
      continue;
    }
    out.push({ type: "punct", value: sql[i++] });
  }
  return out;
}

export type FormatOptions = {
  indent: string;
  uppercase: boolean;
};

export const DEFAULT_FORMAT_OPTIONS: FormatOptions = {
  indent: "  ",
  uppercase: true,
};

export function formatSql(sql: string, opts: FormatOptions = DEFAULT_FORMAT_OPTIONS): string {
  const tokens = tokenize(sql).filter((t) => t.type !== "ws");
  const parts: string[] = [];
  let indent = 0;
  let newlinePending = true;
  let inSelectList = false;
  let parenDepth = 0;

  const pad = () => opts.indent.repeat(Math.max(indent, 0));

  const push = (s: string) => {
    if (newlinePending) {
      if (parts.length) parts.push("\n");
      parts.push(pad());
      newlinePending = false;
    }
    parts.push(s);
  };

  for (let idx = 0; idx < tokens.length; idx++) {
    const t = tokens[idx];
    const prev = parts[parts.length - 1] ?? "";
    const upper = t.type === "ident" ? t.value.toUpperCase() : "";
    const isKeyword = t.type === "ident" && KEYWORDS.has(upper);
    const value = isKeyword && opts.uppercase ? upper : t.value;

    if (t.type === "comment") {
      newlinePending = true;
      push(t.value);
      newlinePending = true;
      continue;
    }

    if (t.type === "punct") {
      if (t.value === "(") { parenDepth++; push("("); continue; }
      if (t.value === ")") { parenDepth = Math.max(0, parenDepth - 1); push(")"); continue; }
      if (t.value === ",") {
        if (inSelectList && parenDepth === 0) {
          parts.push(",");
          newlinePending = true;
        } else {
          parts.push(", ");
        }
        continue;
      }
      if (t.value === ";") {
        parts.push(";");
        newlinePending = true;
        indent = 0;
        inSelectList = false;
        continue;
      }
      if (/[=<>!+\-*/%]/.test(t.value)) {
        parts.push(t.value);
        continue;
      }
      push(t.value);
      continue;
    }

    if (isKeyword && BREAK_BEFORE.has(upper) && parenDepth === 0) {
      newlinePending = true;
    }

    if (isKeyword && upper === "SELECT") { inSelectList = true; indent = 0; }
    if (isKeyword && (upper === "FROM" || upper === "WHERE")) { inSelectList = false; indent = 0; }
    if (isKeyword && (upper === "AND" || upper === "OR")) { indent = 1; }
    if (isKeyword && upper === "ON") { indent = 1; }
    if (isKeyword && upper === "VALUES") { indent = 0; }

    if (prev && /[A-Za-z0-9_)\]'"`]/.test(prev[prev.length - 1]) && !newlinePending) {
      parts.push(" ");
    }
    push(value);

    if (isKeyword && upper === "SELECT") {
      indent = 1;
      newlinePending = true;
    }
  }

  return parts.join("").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}
