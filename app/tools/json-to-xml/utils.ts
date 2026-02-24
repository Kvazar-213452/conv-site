// ── JSON → XML ────────────────────────────────────────────────
function sanitizeTag(key: string): string {
  // XML tag не може починатися з цифри або містити пробіли
  let tag = key.replace(/[^a-zA-Z0-9_\-.:]/g, "_");
  if (/^[^a-zA-Z_]/.test(tag)) tag = "_" + tag;
  return tag || "_";
}

function valueToXml(val: unknown, tag: string, indent: number): string {
  const pad = "  ".repeat(indent);
  const t = sanitizeTag(tag);

  if (val === null || val === undefined) return `${pad}<${t}/>`;

  if (Array.isArray(val)) {
    return val
      .map((item) => valueToXml(item, tag, indent))
      .join("\n");
  }

  if (typeof val === "object") {
    const inner = Object.entries(val as Record<string, unknown>)
      .map(([k, v]) => valueToXml(v, k, indent + 1))
      .join("\n");
    return `${pad}<${t}>\n${inner}\n${pad}</${t}>`;
  }

  const escaped = String(val)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
  return `${pad}<${t}>${escaped}</${t}>`;
}

export function jsonToXml(obj: unknown): string {
  const declaration = `<?xml version="1.0" encoding="UTF-8"?>`;
  const body = valueToXml(obj, "root", 0);
  return `${declaration}\n${body}`;
}

// ── XML → JSON ────────────────────────────────────────────────
export function xmlToJson(xml: string): unknown {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml.trim(), "application/xml");

  const parserError = doc.querySelector("parsererror");
  if (parserError) throw new Error(parserError.textContent ?? "Invalid XML");

  function nodeToObj(node: Element): unknown {
    const children = Array.from(node.children);

    // Leaf node — return text content
    if (children.length === 0) {
      const text = node.textContent ?? "";
      // Type inference
      if (text === "") return null;
      if (text === "true") return true;
      if (text === "false") return false;
      if (/^-?\d+(\.\d+)?$/.test(text)) return Number(text);
      return text;
    }

    // Check if all children share the same tag → treat as array
    const tags = children.map((c) => c.tagName);
    const allSameTag = tags.every((t) => t === tags[0]);

    if (allSameTag && children.length > 1) {
      return children.map(nodeToObj);
    }

    // Otherwise → object
    const obj: Record<string, unknown> = {};

    // Include attributes
    Array.from(node.attributes).forEach((attr) => {
      obj[`@${attr.name}`] = attr.value;
    });

    for (const child of children) {
      const key = child.tagName;
      const val = nodeToObj(child);
      if (key in obj) {
        // Already exists — coerce to array
        const existing = obj[key];
        obj[key] = Array.isArray(existing) ? [...existing, val] : [existing, val];
      } else {
        obj[key] = val;
      }
    }

    return obj;
  }

  return nodeToObj(doc.documentElement);
}
