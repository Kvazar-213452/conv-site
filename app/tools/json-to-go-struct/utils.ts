// ── JSON to Go Struct utils ───────────────────────

export type GoOptions = {
  structName: string;
  omitempty: boolean;
  inlineJSON: boolean;
};

export const DEFAULT_OPTIONS: GoOptions = {
  structName: "Root",
  omitempty: false,
  inlineJSON: true,
};

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function toGoName(key: string): string {
  return key
    .replace(/[^a-zA-Z0-9_]/g, "_")
    .split(/[_\-\s]+/)
    .map(capitalize)
    .join("")
    .replace(/^[^a-zA-Z]/, (c) => "_" + c);
}

function jsonTag(key: string, omitempty: boolean): string {
  return omitempty ? `\`json:"${key},omitempty"\`` : `\`json:"${key}"\``;
}

function inferGoType(val: unknown, key: string, opts: GoOptions, structs: Map<string, string>): string {
  if (val === null) return "interface{}";
  if (typeof val === "string") return "string";
  if (typeof val === "boolean") return "bool";
  if (typeof val === "number") {
    return Number.isInteger(val) ? "int" : "float64";
  }
  if (Array.isArray(val)) {
    if (val.length === 0) return "[]interface{}";
    const elemType = inferGoType(val[0], key, opts, structs);
    return `[]${elemType}`;
  }
  if (typeof val === "object") {
    const structName = toGoName(key);
    const structCode = generateStruct(val as Record<string, unknown>, structName, opts, structs);
    structs.set(structName, structCode);
    return structName;
  }
  return "interface{}";
}

function generateStruct(
  obj: Record<string, unknown>,
  name: string,
  opts: GoOptions,
  structs: Map<string, string>
): string {
  const fields: string[] = [];
  for (const [key, val] of Object.entries(obj)) {
    const goName = toGoName(key);
    const goType = inferGoType(val, key, opts, structs);
    const tag = opts.inlineJSON ? ` ${jsonTag(key, opts.omitempty)}` : "";
    fields.push(`\t${goName} ${goType}${tag}`);
  }
  return `type ${name} struct {\n${fields.join("\n")}\n}`;
}

export function jsonToGoStruct(input: string, opts: GoOptions): string {
  const parsed = JSON.parse(input);
  const structs = new Map<string, string>();

  if (Array.isArray(parsed)) {
    if (parsed.length === 0) return `type ${opts.structName} struct {}`;
    const first = parsed[0];
    if (typeof first === "object" && first !== null && !Array.isArray(first)) {
      const main = generateStruct(first as Record<string, unknown>, opts.structName, opts, structs);
      const nested = [...structs.entries()]
        .filter(([n]) => n !== opts.structName)
        .map(([, code]) => code);
      structs.set(opts.structName, main);
      return [main, ...nested].join("\n\n");
    }
  }

  if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
    const main = generateStruct(parsed as Record<string, unknown>, opts.structName, opts, structs);
    structs.set(opts.structName, main);
    const nested = [...structs.entries()]
      .filter(([n]) => n !== opts.structName)
      .map(([, code]) => code);
    return [main, ...nested].join("\n\n");
  }

  throw new Error("Input must be a JSON object or array of objects");
}

export const EXAMPLE_INPUT = `{
  "id": 1,
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "age": 30,
  "is_active": true,
  "score": 95.5,
  "tags": ["admin", "user"],
  "address": {
    "street": "123 Main St",
    "city": "Austin",
    "zip_code": "78701"
  }
}`;
