// ── HTML to JSX utils ─────────────────────────────

const ATTR_MAP: Record<string, string> = {
  class: "className",
  for: "htmlFor",
  tabindex: "tabIndex",
  readonly: "readOnly",
  maxlength: "maxLength",
  cellpadding: "cellPadding",
  cellspacing: "cellSpacing",
  rowspan: "rowSpan",
  colspan: "colSpan",
  usemap: "useMap",
  frameborder: "frameBorder",
  contenteditable: "contentEditable",
  crossorigin: "crossOrigin",
  accesskey: "accessKey",
  charset: "charSet",
  formaction: "formAction",
  formenctype: "formEncType",
  formmethod: "formMethod",
  formnovalidate: "formNoValidate",
  formtarget: "formTarget",
  hreflang: "hrefLang",
  inputmode: "inputMode",
  minlength: "minLength",
  novalidate: "noValidate",
  srcset: "srcSet",
  autofocus: "autoFocus",
  autoplay: "autoPlay",
  enctype: "encType",
  datetime: "dateTime",
  srcdoc: "srcDoc",
  srclang: "srcLang",
};

const SELF_CLOSING = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input",
  "link", "meta", "param", "source", "track", "wbr",
]);

function convertStyleString(style: string): string {
  const props: string[] = [];
  const parts = style.split(";").filter((s) => s.trim());
  for (const part of parts) {
    const colonIdx = part.indexOf(":");
    if (colonIdx === -1) continue;
    const prop = part.substring(0, colonIdx).trim();
    const val = part.substring(colonIdx + 1).trim();
    const camelProp = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    const isNumber = /^-?\d+(\.\d+)?$/.test(val) && prop !== "font-weight" && prop !== "z-index" && prop !== "opacity" && prop !== "line-height";
    if (/^-?\d+(\.\d+)?px$/.test(val)) {
      props.push(`${camelProp}: "${val}"`);
    } else if (isNumber) {
      props.push(`${camelProp}: ${val}`);
    } else {
      props.push(`${camelProp}: "${val}"`);
    }
  }
  return `{{ ${props.join(", ")} }}`;
}

export function htmlToJsx(html: string): string {
  let result = html;

  result = result.replace(/<!--[\s\S]*?-->/g, (comment) => {
    return `{/* ${comment.replace(/^<!--\s*/, "").replace(/\s*-->$/, "")} */}`;
  });

  result = result.replace(/style="([^"]*)"/g, (_, styleStr) => {
    return `style={${convertStyleString(styleStr)}}`;
  });

  result = result.replace(
    /\b([a-z][a-z-]*)\s*=\s*"([^"]*)"/gi,
    (match, attr, val) => {
      const lower = attr.toLowerCase();
      if (lower === "style") return match;
      const jsx = ATTR_MAP[lower] || attr;
      return `${jsx}="${val}"`;
    }
  );

  for (const tag of SELF_CLOSING) {
    const regex = new RegExp(`<(${tag})\\b([^>]*?)\\s*/?>`, "gi");
    result = result.replace(regex, (_, name, attrs) => `<${name}${attrs} />`);
  }

  return result;
}

export function jsxToHtml(jsx: string): string {
  let result = jsx;

  result = result.replace(/\{\/\*[\s\S]*?\*\/\}/g, (comment) => {
    const inner = comment.replace(/^\{\/\*\s*/, "").replace(/\s*\*\/\}$/, "");
    return `<!-- ${inner} -->`;
  });

  for (const [html, jsxAttr] of Object.entries(ATTR_MAP)) {
    const regex = new RegExp(`\\b${jsxAttr}=`, "g");
    result = result.replace(regex, `${html}=`);
  }

  result = result.replace(/style=\{\{([^}]*)\}\}/g, (_, propsStr) => {
    const pairs = propsStr.split(",").map((p: string) => p.trim()).filter(Boolean);
    const cssProps: string[] = [];
    for (const pair of pairs) {
      const colonIdx = pair.indexOf(":");
      if (colonIdx === -1) continue;
      const prop = pair.substring(0, colonIdx).trim();
      const val = pair.substring(colonIdx + 1).trim().replace(/^"|"$/g, "");
      const cssProp = prop.replace(/[A-Z]/g, (c: string) => `-${c.toLowerCase()}`);
      cssProps.push(`${cssProp}: ${val}`);
    }
    return `style="${cssProps.join("; ")}"`;
  });

  for (const tag of SELF_CLOSING) {
    const regex = new RegExp(`<(${tag})\\b([^>]*?)\\s*/>`, "gi");
    result = result.replace(regex, (_, name, attrs) => `<${name}${attrs}>`);
  }

  return result;
}

export const EXAMPLE_HTML = `<div class="container">
  <h1 class="title">Hello World</h1>
  <label for="email">Email:</label>
  <input type="email" id="email" readonly tabindex="1" autofocus>
  <img src="/logo.png" alt="Logo">
  <p style="color: red; font-size: 16px; margin-top: 10px">
    Welcome to our site!
  </p>
  <br>
  <!-- Navigation links -->
  <a href="/about" class="nav-link">About</a>
</div>`;

export const EXAMPLE_JSX = `<div className="container">
  <h1 className="title">Hello World</h1>
  <label htmlFor="email">Email:</label>
  <input type="email" id="email" readOnly tabIndex="1" autoFocus />
  <img src="/logo.png" alt="Logo" />
  <p style={{ color: "red", fontSize: "16px", marginTop: "10px" }}>
    Welcome to our site!
  </p>
  <br />
  {/* Navigation links */}
  <a href="/about" className="nav-link">About</a>
</div>`;
