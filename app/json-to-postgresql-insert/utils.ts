// ── helpers ───────────────────────────────────────────────────

/** Convert camelCase / PascalCase key to snake_case */
function toSnakeCase(key: string): string {
  return key
    .replace(/([A-Z])/g, "_$1")
    .toLowerCase()
    .replace(/^_/, "");
}

/** Derive a table name from the JSON root */
function guessTableName(json: unknown): string {
  if (
    typeof json === "object" &&
    json !== null &&
    !Array.isArray(json)
  ) {
    const keys = Object.keys(json as object);
    if (keys.length === 1) return toSnakeCase(keys[0]) + "s";
  }
  return "records";
}

/** Escape a single-quoted SQL string value */
function escapeSqlString(val: string): string {
  return val.replace(/'/g, "''").replace(/\\/g, "\\\\");
}

/** Format a single JS value as a PostgreSQL literal */
function formatValue(val: unknown): string {
  if (val === null || val === undefined) return "NULL";

  if (typeof val === "boolean") return val ? "TRUE" : "FALSE";

  if (typeof val === "number") return String(val);

  if (typeof val === "string") {
    // ISO date → cast to timestamptz
    if (/^\d{4}-\d{2}-\d{2}(T[\d:.Z+-]+)?$/.test(val)) {
      return `'${escapeSqlString(val)}'::timestamptz`;
    }
    return `'${escapeSqlString(val)}'`;
  }

  // Arrays → PostgreSQL array literal
  if (Array.isArray(val)) {
    const inner = val.map(formatValue).join(", ");
    return `ARRAY[${inner}]`;
  }

  // Nested object → JSONB
  return `'${escapeSqlString(JSON.stringify(val))}'::jsonb`;
}

// ── JSON → PostgreSQL INSERT ──────────────────────────────────

export function jsonToPostgres(json: unknown): string {
  // Normalize to array of flat-ish objects
  let rows: Record<string, unknown>[];
  let tableName: string;

  if (Array.isArray(json)) {
    if (json.length === 0) throw new Error("Array is empty — nothing to insert.");
    rows = json.map((item, i) => {
      if (typeof item !== "object" || item === null || Array.isArray(item)) {
        throw new Error(`Item at index ${i} is not an object.`);
      }
      return item as Record<string, unknown>;
    });
    tableName = "records";
  } else if (typeof json === "object" && json !== null) {
    const obj = json as Record<string, unknown>;
    const entries = Object.entries(obj);

    // If top-level keys map to arrays of objects → named tables
    const allArraysOfObjects = entries.every(
      ([, v]) =>
        Array.isArray(v) &&
        (v as unknown[]).length > 0 &&
        typeof (v as unknown[])[0] === "object" &&
        (v as unknown[])[0] !== null
    );

    if (allArraysOfObjects) {
      // Multi-table mode: generate one INSERT per key
      return entries
        .map(([key, val]) => {
          const tableRows = val as Record<string, unknown>[];
          const tName = toSnakeCase(key);
          return buildInsert(tName, tableRows);
        })
        .join("\n\n");
    }

    // Single object → single-row insert
    tableName = guessTableName(json);
    rows = [obj];
  } else {
    throw new Error("Input must be a JSON object or array of objects.");
  }

  return buildInsert(tableName, rows);
}

function buildInsert(
  tableName: string,
  rows: Record<string, unknown>[]
): string {
  // Collect union of all column names (snake_case)
  const colSet = new Set<string>();
  for (const row of rows) {
    for (const key of Object.keys(row)) colSet.add(key);
  }
  const columns = Array.from(colSet);
  const snakeCols = columns.map(toSnakeCase);

  const quotedTable = `"${tableName}"`;
  const quotedCols = snakeCols.map((c) => `"${c}"`).join(", ");

  const valueLines = rows.map((row) => {
    const vals = columns.map((col) => formatValue(row[col] ?? null));
    return `  (${vals.join(", ")})`;
  });

  const lines = [
    `-- Table: ${tableName}`,
    `-- Generated: ${new Date().toISOString()}`,
    ``,
    `INSERT INTO ${quotedTable} (${quotedCols})`,
    `VALUES`,
    valueLines.join(",\n") + ";",
  ];

  return lines.join("\n");
}

// ── PostgreSQL INSERT → JSON ──────────────────────────────────

export function postgresInsertToJson(sql: string): unknown {
  // Strip comments
  const clean = sql.replace(/--[^\n]*/g, "").trim();

  // Match: INSERT INTO "table" (cols) VALUES (row), (row);
  const insertRe =
    /INSERT\s+INTO\s+["']?([\w]+)["']?\s*\(([^)]+)\)\s*VALUES\s*([\s\S]+?)(?:;|$)/gi;

  const allResults: Record<string, unknown>[] = [];
  let match: RegExpExecArray | null;

  while ((match = insertRe.exec(clean)) !== null) {
    const colsPart = match[2];
    const valuesPart = match[3];

    const columns = colsPart
      .split(",")
      .map((c) => c.trim().replace(/^["']|["']$/g, ""));

    // Parse individual row tuples
    const rows = parseValueTuples(valuesPart);

    for (const rawVals of rows) {
      const obj: Record<string, unknown> = {};
      columns.forEach((col, i) => {
        obj[col] = parseSqlValue(rawVals[i]?.trim() ?? "NULL");
      });
      allResults.push(obj);
    }
  }

  if (allResults.length === 0) {
    throw new Error(
      'No valid INSERT statement found. Expected: INSERT INTO "table" (cols) VALUES (...).'
    );
  }

  return allResults.length === 1 ? allResults[0] : allResults;
}

/**
 * Split the VALUES portion into individual row tuples.
 * Handles nested parentheses (e.g. ARRAY[...]) and quoted strings.
 */
function parseValueTuples(valuesPart: string): string[][] {
  const tuples: string[][] = [];
  let depth = 0;
  let inSingleQuote = false;
  let current = "";
  let currentTuple: string[] = [];
  let inTuple = false;

  for (let i = 0; i < valuesPart.length; i++) {
    const ch = valuesPart[i];
    const next = valuesPart[i + 1];

    if (inSingleQuote) {
      if (ch === "'" && next === "'") {
        current += "''";
        i++;
      } else if (ch === "'") {
        inSingleQuote = false;
        current += ch;
      } else {
        current += ch;
      }
      continue;
    }

    if (ch === "'") { inSingleQuote = true; current += ch; continue; }

    if (ch === "(" && depth === 0) {
      inTuple = true;
      depth++;
      current = "";
      currentTuple = [];
      continue;
    }

    if (inTuple) {
      if (ch === "(" ) { depth++; current += ch; continue; }
      if (ch === ")") {
        depth--;
        if (depth === 0) {
          currentTuple.push(current.trim());
          tuples.push(currentTuple);
          inTuple = false;
          current = "";
          continue;
        }
        current += ch;
        continue;
      }
      if (ch === "," && depth === 1) {
        currentTuple.push(current.trim());
        current = "";
        continue;
      }
      current += ch;
    }
  }

  return tuples;
}

/**
 * Parse a single SQL value token back to a JS primitive.
 */
function parseSqlValue(raw: string): unknown {
  const v = raw.trim();

  if (/^null$/i.test(v)) return null;
  if (/^true$/i.test(v)) return true;
  if (/^false$/i.test(v)) return false;

  // Quoted string (strip ::cast suffix)
  const quotedMatch = v.match(/^'([\s\S]*)'(?:::.+)?$/);
  if (quotedMatch) {
    return quotedMatch[1].replace(/''/g, "'").replace(/\\\\/g, "\\");
  }

  // ARRAY[...] → JS array
  const arrayMatch = v.match(/^ARRAY\[(.*)?\]$/i);
  if (arrayMatch) {
    const inner = arrayMatch[1].trim();
    if (!inner) return [];
    return inner.split(",").map((item) => parseSqlValue(item.trim()));
  }

  // Number
  if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);

  // Fallback: return as-is
  return v;
}