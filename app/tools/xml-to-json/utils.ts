// ── XML to JSON utils ──────────────────────────────────────
// Pragmatic XML → JSON. Uses DOMParser (ubiquitous in browsers) and
// collapses single children into values. Not full XSD / namespaces.

export type Options = {
  attributePrefix: string;
  textKey: string;
  typeInference: boolean;
};

export const DEFAULT_OPTIONS: Options = {
  attributePrefix: "@",
  textKey: "#text",
  typeInference: true,
};

function coerce(v: string, enabled: boolean): unknown {
  if (!enabled) return v;
  const s = v.trim();
  if (s === "") return v;
  if (s === "true")  return true;
  if (s === "false") return false;
  if (s === "null")  return null;
  if (/^-?\d+$/.test(s)) {
    const n = Number(s);
    if (Number.isSafeInteger(n)) return n;
  }
  if (/^-?\d*\.\d+([eE][+-]?\d+)?$/.test(s)) return Number(s);
  return v;
}

function elementToJson(el: Element, opts: Options): unknown {
  const obj: Record<string, unknown> = {};

  // Attributes
  for (const attr of Array.from(el.attributes)) {
    obj[`${opts.attributePrefix}${attr.name}`] = coerce(attr.value, opts.typeInference);
  }

  const childElements = Array.from(el.children);
  const textContent = Array.from(el.childNodes)
    .filter((n) => n.nodeType === 3)
    .map((n) => n.textContent ?? "")
    .join("")
    .trim();

  if (childElements.length === 0) {
    if (Object.keys(obj).length === 0) return coerce(textContent, opts.typeInference);
    if (textContent) obj[opts.textKey] = coerce(textContent, opts.typeInference);
    return obj;
  }

  const groups: Record<string, unknown[]> = {};
  for (const child of childElements) {
    const name = child.tagName;
    (groups[name] ||= []).push(elementToJson(child, opts));
  }

  for (const [name, values] of Object.entries(groups)) {
    obj[name] = values.length === 1 ? values[0] : values;
  }

  if (textContent) obj[opts.textKey] = coerce(textContent, opts.typeInference);
  return obj;
}

export function xmlToJson(input: string, opts: Options): unknown {
  const trimmed = input.trim();
  if (!trimmed) throw new Error("Input is empty");

  const parser = new DOMParser();
  const doc = parser.parseFromString(trimmed, "application/xml");
  const err = doc.querySelector("parsererror");
  if (err) throw new Error(err.textContent?.split("\n")[0] ?? "Invalid XML");

  const root = doc.documentElement;
  if (!root) throw new Error("No root element");
  return { [root.tagName]: elementToJson(root, opts) };
}
