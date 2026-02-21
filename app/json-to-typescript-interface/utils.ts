// ── helpers ───────────────────────────────────────────────────

/** Convert snake_case / camelCase key to PascalCase for interface name */
function toPascalCase(key: string): string {
  return key
    .replace(/_([a-z])/g, (_, c) => c.toUpperCase())
    .replace(/^(.)/, (c) => c.toUpperCase());
}

/** Convert key to camelCase for property names */
function toCamelCase(key: string): string {
  return key
    .replace(/_([a-z])/g, (_, c) => c.toUpperCase())
    .replace(/^(.)/, (c) => c.toLowerCase());
}

/** Guess if a string looks like a date */
function isDateString(val: string): boolean {
  return /^\d{4}-\d{2}-\d{2}(T[\d:.Z+-]+)?$/.test(val);
}

/** Infer TypeScript type from a JS value */
function inferType(
  val: unknown,
  key: string,
  interfaces: Map<string, string>,
  depth = 0
): string {
  if (val === null || val === undefined) return "null";

  if (typeof val === "boolean") return "boolean";
  if (typeof val === "number") return Number.isInteger(val) ? "number" : "number";

  if (typeof val === "string") {
    if (isDateString(val)) return "Date";
    return "string";
  }

  if (Array.isArray(val)) {
    if (val.length === 0) return "unknown[]";
    const itemType = inferType(val[0], key, interfaces, depth);
    return `${itemType}[]`;
  }

  if (typeof val === "object" && val !== null) {
    const nestedName = toPascalCase(key);
    const nestedInterface = buildInterface(
      nestedName,
      val as Record<string, unknown>,
      interfaces,
      depth + 1
    );
    interfaces.set(nestedName, nestedInterface);
    return nestedName;
  }

  return "unknown";
}

/** Check if a key is optional across all rows (present and non-null in some but not all) */
function isOptional(rows: Record<string, unknown>[], key: string): boolean {
  return rows.some((row) => !(key in row) || row[key] === null || row[key] === undefined);
}

/** Build a TypeScript interface string for a given object */
function buildInterface(
  name: string,
  obj: Record<string, unknown>,
  interfaces: Map<string, string>,
  depth = 0
): string {
  const lines: string[] = [`interface ${name} {`];

  for (const [rawKey, val] of Object.entries(obj)) {
    const propName = toCamelCase(rawKey);
    const type = inferType(val, rawKey, interfaces, depth);
    const optional = val === null || val === undefined ? "?" : "";
    const comment = rawKey !== propName ? ` // original: "${rawKey}"` : "";
    lines.push(`  ${propName}${optional}: ${type};${comment}`);
  }

  lines.push("}");
  return lines.join("\n");
}

// ── JSON → TypeScript Interfaces ─────────────────────────────

export function jsonToTypescript(json: unknown): string {
  const interfaces = new Map<string, string>();

  if (Array.isArray(json)) {
    if (json.length === 0) throw new Error("Array is empty — cannot infer types.");

    const rows = json as Record<string, unknown>[];

    // Merge all keys across rows for a complete picture
    const mergedRow: Record<string, unknown> = {};
    for (const row of rows) {
      for (const [key, val] of Object.entries(row)) {
        // prefer a non-null value to infer the best type
        if (!(key in mergedRow) || mergedRow[key] === null) {
          mergedRow[key] = val;
        }
      }
    }

    // Detect optional keys
    const allKeys = Object.keys(mergedRow);
    const optionalKeys = new Set(
      allKeys.filter((k) => isOptional(rows, k))
    );

    const rootInterface = buildArrayInterface("Record", mergedRow, optionalKeys, interfaces);
    interfaces.set("Record", rootInterface);

  } else if (typeof json === "object" && json !== null) {
    const obj = json as Record<string, unknown>;
    const entries = Object.entries(obj);

    // Multi-table: top-level keys are arrays of objects
    const allArraysOfObjects = entries.every(
      ([, v]) =>
        Array.isArray(v) &&
        (v as unknown[]).length > 0 &&
        typeof (v as unknown[])[0] === "object"
    );

    if (allArraysOfObjects) {
      for (const [key, val] of entries) {
        const name = toPascalCase(key.replace(/s$/, "")); // singularize naive
        const rows = val as Record<string, unknown>[];
        const mergedRow: Record<string, unknown> = {};
        for (const row of rows) {
          for (const [k, v] of Object.entries(row)) {
            if (!(k in mergedRow) || mergedRow[k] === null) mergedRow[k] = v;
          }
        }
        const optionalKeys = new Set(
          Object.keys(mergedRow).filter((k) => isOptional(rows, k))
        );
        const iface = buildArrayInterface(name, mergedRow, optionalKeys, interfaces);
        interfaces.set(name, iface);
      }
    } else {
      const rootIface = buildInterface("Root", obj, interfaces, 0);
      interfaces.set("Root", rootIface);
    }
  } else {
    throw new Error("Input must be a JSON object or array of objects.");
  }

  // Output nested interfaces first, then root last
  const names = Array.from(interfaces.keys());
  const rootName = names[names.length - 1];
  const nested = names.slice(0, -1).map((n) => interfaces.get(n)!);
  const root = interfaces.get(rootName)!;

  const header = [
    `// Generated: ${new Date().toISOString()}`,
    `// TypeScript interfaces inferred from JSON`,
    ``,
  ].join("\n");

  return header + [...nested, root].join("\n\n");
}

function buildArrayInterface(
  name: string,
  mergedRow: Record<string, unknown>,
  optionalKeys: Set<string>,
  interfaces: Map<string, string>
): string {
  const lines: string[] = [`interface ${name} {`];

  for (const [rawKey, val] of Object.entries(mergedRow)) {
    const propName = toCamelCase(rawKey);
    const type = inferType(val, rawKey, interfaces, 0);
    const optional = optionalKeys.has(rawKey) ? "?" : "";
    const comment = rawKey !== propName ? ` // original: "${rawKey}"` : "";
    lines.push(`  ${propName}${optional}: ${type};${comment}`);
  }

  lines.push("}");
  return lines.join("\n");
}

// ── TypeScript Interface → JSON skeleton ─────────────────────

export function typescriptToJson(tsInput: string): unknown {
  const clean = tsInput
    .replace(/\/\/[^\n]*/g, "")   // strip line comments
    .replace(/\/\*[\s\S]*?\*\//g, "") // strip block comments
    .trim();

  const interfaceRe = /interface\s+(\w+)\s*\{([^}]*)\}/g;
  const interfaces: Record<string, Record<string, string>> = {};

  let match: RegExpExecArray | null;
  while ((match = interfaceRe.exec(clean)) !== null) {
    const name = match[1];
    const body = match[2];
    const props: Record<string, string> = {};

    const propRe = /(\w+)\??\s*:\s*([^;]+);/g;
    let pm: RegExpExecArray | null;
    while ((pm = propRe.exec(body)) !== null) {
      props[pm[1]] = pm[2].trim();
    }
    interfaces[name] = props;
  }

  const names = Object.keys(interfaces);
  if (names.length === 0) {
    throw new Error(
      'No valid interface found. Expected: interface Name { key: type; }'
    );
  }

  // Build skeleton for the last (root) interface
  const rootName = names[names.length - 1];
  const skeleton = buildJsonSkeleton(rootName, interfaces);
  return skeleton;
}

function buildJsonSkeleton(
  name: string,
  interfaces: Record<string, Record<string, string>>
): Record<string, unknown> {
  const props = interfaces[name];
  if (!props) return {};

  const result: Record<string, unknown> = {};

  for (const [key, rawType] of Object.entries(props)) {
    const type = rawType.replace(/\s+/g, " ").trim();
    result[key] = resolveType(type, interfaces);
  }

  return result;
}

function resolveType(type: string, interfaces: Record<string, Record<string, string>>): unknown {
  if (type.endsWith("[]") || type.endsWith("| null")) {
    const inner = type.replace(/\[\]$/, "").replace(/\s*\|\s*null$/, "").trim();
    if (type.endsWith("[]")) return [resolveType(inner, interfaces)];
  }
  if (type === "string") return "";
  if (type === "number") return 0;
  if (type === "boolean") return false;
  if (type === "null") return null;
  if (type === "Date") return new Date().toISOString();
  if (type === "unknown") return null;
  if (type in interfaces) return buildJsonSkeleton(type, interfaces);
  if (type.includes("|")) return null; // union → null
  return null;
}