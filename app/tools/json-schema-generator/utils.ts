// ── JSON Schema Generator utils ────────────────────────────
// Infers a JSON Schema (Draft 2020-12 compatible subset) from a
// sample JSON document.

type Schema = Record<string, unknown>;

function typeOf(value: unknown): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  if (typeof value === "number") return Number.isInteger(value) ? "integer" : "number";
  return typeof value;
}

function mergeTypes(a: string, b: string): string | string[] {
  if (a === b) return a;
  if ((a === "integer" && b === "number") || (a === "number" && b === "integer")) return "number";
  return [a, b].sort();
}

function infer(value: unknown): Schema {
  const t = typeOf(value);
  if (t === "array") {
    const arr = value as unknown[];
    if (arr.length === 0) return { type: "array" };
    let itemSchema = infer(arr[0]);
    for (let i = 1; i < arr.length; i++) itemSchema = merge(itemSchema, infer(arr[i]));
    return { type: "array", items: itemSchema };
  }
  if (t === "object") {
    const obj = value as Record<string, unknown>;
    const props: Record<string, Schema> = {};
    const required: string[] = [];
    for (const [k, v] of Object.entries(obj)) {
      props[k] = infer(v);
      required.push(k);
    }
    const schema: Schema = { type: "object", properties: props };
    if (required.length) schema.required = required;
    return schema;
  }
  return { type: t };
}

function merge(a: Schema, b: Schema): Schema {
  const ta = a.type as string;
  const tb = b.type as string;

  if (ta === "array" && tb === "array") {
    if (!a.items) return b;
    if (!b.items) return a;
    return { type: "array", items: merge(a.items as Schema, b.items as Schema) };
  }
  if (ta === "object" && tb === "object") {
    const propsA = (a.properties || {}) as Record<string, Schema>;
    const propsB = (b.properties || {}) as Record<string, Schema>;
    const allKeys = new Set([...Object.keys(propsA), ...Object.keys(propsB)]);
    const props: Record<string, Schema> = {};
    for (const k of allKeys) {
      if (propsA[k] && propsB[k]) props[k] = merge(propsA[k], propsB[k]);
      else props[k] = propsA[k] || propsB[k];
    }
    const reqA = new Set((a.required as string[]) || []);
    const reqB = new Set((b.required as string[]) || []);
    const required = [...reqA].filter((k) => reqB.has(k));
    const out: Schema = { type: "object", properties: props };
    if (required.length) out.required = required;
    return out;
  }
  const merged = mergeTypes(ta, tb);
  return { type: merged };
}

export function jsonToSchema(input: unknown, title = "GeneratedSchema"): Schema {
  const schema = infer(input);
  return {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    title,
    ...schema,
  };
}
