export const expansionTools = [
  {
    "slug": "json-flattener",
    "title": "JSON Flattener",
    "description": "Flatten nested JSON into JSON Pointer paths and restore the original structure, including arrays and empty containers.",
    "example": "{\"user\":{\"name\":\"Ada\",\"roles\":[\"admin\"]}}",
    "forward": "Flatten",
    "reverse": "Unflatten",
    "note": "JSON Pointer paths avoid collisions between dots in keys and nested properties. Empty objects and arrays remain intact.",
    "articles": [
      "json-flattening-guide",
      "json-pointer-explained"
    ]
  },
  {
    "slug": "json-to-ndjson",
    "title": "JSON to NDJSON Converter",
    "description": "Convert a JSON array to newline-delimited JSON or turn JSON Lines back into a formatted array.",
    "example": "[{\"id\":1},{\"id\":2}]",
    "forward": "JSON to NDJSON",
    "reverse": "NDJSON to JSON",
    "note": "Each output line is one complete JSON value. Blank lines are ignored when importing; malformed lines report their line number.",
    "articles": [
      "json-vs-ndjson",
      "parse-json-lines"
    ]
  },
  {
    "slug": "tsv-to-json",
    "title": "TSV to JSON Converter",
    "description": "Convert tab-separated spreadsheet data to JSON and export an array of objects as TSV.",
    "example": "name\tcity\nAda\tLondon\nLinus\tHelsinki",
    "forward": "TSV to JSON",
    "reverse": "JSON to TSV",
    "note": "The first row supplies unique column names. Cells stay strings to preserve leading zeros and identifiers. Quoted tabs and line breaks are supported.",
    "articles": [
      "tsv-vs-csv",
      "spreadsheet-to-json"
    ]
  },
  {
    "slug": "px-to-rem",
    "title": "PX to REM Converter",
    "description": "Convert CSS pixels to rem and rem to pixels with a configurable root font size.",
    "example": "24",
    "forward": "PX to REM",
    "reverse": "REM to PX",
    "note": "Set the root font size to match your page. The default 16px is a common browser setting, not a universal constant.",
    "articles": [
      "px-vs-rem",
      "responsive-type-with-rem"
    ]
  },
  {
    "slug": "color-contrast-checker",
    "title": "Color Contrast Checker",
    "description": "Check two HEX colors for WCAG AA and AAA text contrast using the relative luminance formula.",
    "example": "#ffffff\n#111827",
    "forward": "Check contrast",
    "reverse": null,
    "note": "Enter foreground and background on separate lines. Supports opaque 3-digit and 6-digit HEX; alpha, gradients and images need separate evaluation.",
    "articles": [
      "wcag-color-contrast",
      "accessible-color-palettes"
    ]
  },
  {
    "slug": "html-to-text",
    "title": "HTML to Text Converter",
    "description": "Extract readable plain text from HTML, remove scripts and styles, and preserve useful line breaks.",
    "example": "<h1>Hello</h1><p>Read <strong>this</strong> &amp; learn.</p>",
    "forward": "Extract text",
    "reverse": null,
    "note": "HTML is parsed in an inert document and never inserted into the visible page. This extracts text; it does not sanitize HTML for reuse.",
    "articles": [
      "html-to-plain-text",
      "html-textcontent-vs-innertext"
    ]
  },
  {
    "slug": "unicode-escape",
    "title": "Unicode Escape Converter",
    "description": "Encode text as JavaScript Unicode escape sequences and decode Unicode escapes, including emoji surrogate pairs.",
    "example": "Hello 👋",
    "forward": "Escape Unicode",
    "reverse": "Unescape Unicode",
    "note": "Encoding uses JavaScript UTF-16 escape sequences. Decoding also accepts brace-style code points such as \\u{1F44B}. Other escapes are left unchanged.",
    "articles": [
      "unicode-escape-sequences",
      "unicode-code-points"
    ]
  },
  {
    "slug": "sri-generator",
    "title": "SRI Hash Generator",
    "description": "Generate SHA-256, SHA-384 and SHA-512 Subresource Integrity values from exact file bytes or UTF-8 text.",
    "example": "console.log(\"Hello\");",
    "forward": "Generate SRI",
    "reverse": null,
    "note": "Upload the exact deployed file for byte-accurate hashes. Any whitespace, encoding or line-ending change produces a different integrity value.",
    "articles": [
      "subresource-integrity-guide",
      "sri-hash-mismatch"
    ]
  },
  {
    "slug": "basic-auth-generator",
    "title": "Basic Auth Header Generator",
    "description": "Generate an HTTP Basic Authorization header from a username and password, or decode a header locally.",
    "example": "demo\nexample-password",
    "forward": "Generate header",
    "reverse": "Decode header",
    "note": "First line is username; all remaining text is the password. Encoding uses UTF-8. Basic authentication requires HTTPS and does not encrypt credentials.",
    "articles": [
      "http-basic-auth-guide",
      "basic-auth-with-fetch"
    ]
  },
  {
    "slug": "text-to-slug-list",
    "title": "URL Slug List Generator",
    "description": "Generate one URL slug per line for bulk product names, category titles and content migrations.",
    "example": "Red Running Shoes\nCafé Travel Mug\nSummer Sale 2026",
    "forward": "Generate slug list",
    "reverse": null,
    "note": "Batch processing preserves row order and flags duplicate output slugs. Latin accents are normalized; unsupported scripts require a transliteration workflow.",
    "articles": [
      "bulk-slug-migration",
      "duplicate-url-slugs"
    ]
  }
] as const;
export type ExpansionTool = (typeof expansionTools)[number];
