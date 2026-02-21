export function jsonToYaml(obj: unknown, indent = 0): string {
  const pad = "  ".repeat(indent);
  if (obj === null) return "null";
  if (typeof obj === "boolean") return obj ? "true" : "false";
  if (typeof obj === "number") return String(obj);
  if (typeof obj === "string") {
    if (
      obj.includes("\n") || obj.includes(":") || obj.includes("#") ||
      obj.includes('"') || obj.includes("'") || obj.startsWith(" ") ||
      obj.endsWith(" ") || obj === "" ||
      /^(true|false|null|yes|no|on|off)$/i.test(obj) || /^[\d.]+$/.test(obj)
    ) {
      return `"${obj.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n")}"`;
    }
    return obj;
  }
  if (Array.isArray(obj)) {
    if (obj.length === 0) return "[]";
    return obj.map((item) => {
      const val = jsonToYaml(item, indent + 1);
      if (typeof item === "object" && item !== null && !Array.isArray(item)) {
        const lines = val.split("\n");
        return `${pad}- ${lines[0]}\n${lines.slice(1).map((l) => `${pad}  ${l}`).join("\n")}`;
      }
      return `${pad}- ${val}`;
    }).join("\n");
  }
  if (typeof obj === "object") {
    const entries = Object.entries(obj as Record<string, unknown>);
    if (entries.length === 0) return "{}";
    return entries.map(([key, val]) => {
      const safeKey = /[:#\[\]{},&*?|\-<>=!%@`]/.test(key) || key.includes(" ") ? `"${key}"` : key;
      if (val !== null && typeof val === "object") {
        const nested = jsonToYaml(val, indent + 1);
        if (Array.isArray(val) && (val as unknown[]).length === 0) return `${pad}${safeKey}: []`;
        if (!Array.isArray(val) && Object.keys(val as object).length === 0) return `${pad}${safeKey}: {}`;
        return `${pad}${safeKey}:\n${nested}`;
      }
      return `${pad}${safeKey}: ${jsonToYaml(val, indent + 1)}`;
    }).join("\n");
  }
  return String(obj);
}

export function yamlToJson(yaml: string): unknown {
  const lines = yaml.split(/\r?\n/);

  function parseValue(val: string): unknown {
    const v = val.trim();
    if (v === "null" || v === "~" || v === "") return null;
    if (v === "true" || v === "yes" || v === "on") return true;
    if (v === "false" || v === "no" || v === "off") return false;
    if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
    // Quoted strings
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      return v.slice(1, -1).replace(/\\n/g, "\n").replace(/\\"/g, '"');
    }
    return v;
  }

  function getIndent(line: string) {
    return line.match(/^(\s*)/)?.[1].length ?? 0;
  }

  function parse(lineArr: string[], baseIndent: number): [unknown, number] {
    // Skip empty lines
    while (lineArr.length && lineArr[0].trim() === "") lineArr.shift();
    if (!lineArr.length) return [null, 0];

    const firstIndent = getIndent(lineArr[0]);

    // Detect if block is a list
    if (lineArr[0].trimStart().startsWith("- ")) {
      const arr: unknown[] = [];
      while (lineArr.length) {
        if (lineArr[0].trim() === "") { lineArr.shift(); continue; }
        const ind = getIndent(lineArr[0]);
        if (ind < firstIndent) break;
        const line = lineArr.shift()!;
        const itemStr = line.trimStart().slice(2); // remove "- "
        if (itemStr.trim() === "") {
          // next lines are nested
          const [val] = parse(lineArr, firstIndent + 2);
          arr.push(val);
        } else if (itemStr.includes(":")) {
          // inline object start
          lineArr.unshift(" ".repeat(firstIndent + 2) + itemStr);
          const [val] = parse(lineArr, firstIndent + 2);
          arr.push(val);
        } else {
          arr.push(parseValue(itemStr));
        }
      }
      return [arr, firstIndent];
    }

    // Otherwise it's a mapping
    const obj: Record<string, unknown> = {};
    while (lineArr.length) {
      if (lineArr[0].trim() === "") { lineArr.shift(); continue; }
      const ind = getIndent(lineArr[0]);
      if (ind < firstIndent) break;
      const line = lineArr.shift()!;
      const trimmed = line.trimStart();

      // Skip comments
      if (trimmed.startsWith("#")) continue;

      const colonIdx = trimmed.indexOf(": ");
      const colonEnd = trimmed.endsWith(":");

      if (colonIdx === -1 && !colonEnd) continue;

      const key = colonEnd ? trimmed.slice(0, -1) : trimmed.slice(0, colonIdx);
      const rawVal = colonEnd ? "" : trimmed.slice(colonIdx + 2);

      if (rawVal.trim() === "" || colonEnd) {
        // Nested block
        const [val] = parse(lineArr, ind + 2);
        obj[key] = val;
      } else {
        obj[key] = parseValue(rawVal);
      }
    }
    return [obj, firstIndent];
  }

  const lineArr = lines.slice();
  const [result] = parse(lineArr, 0);
  return result;
}