export type GrowthField = {
  key: string; label: string; default: string;
  type: "number" | "text" | "color" | "checkbox" | "select" | "date" | "password";
  min?: number; max?: number; step?: string;
  options?: { value: string; label: string }[];
};
export type GrowthTool = {
  slug: string; title: string; description: string; kind: "text" | "design" | "image" | "file" | "graphic";
  example: string; exampleB?: string; tableInput?: {headers:string[]}; inputLabel?: string; secondInputLabel?: string; modified?: string; reference?: string; server?: { input: "files" | "text"; accept?: string; multiple?: boolean; textLabel?: string; warning?: string }; action: string; extension: string;
  fields: GrowthField[]; steps: string[];
  sections: { heading: string; body: string }[];
  faq: { question: string; answer: string }; related: string[];
};
export const growthTools: GrowthTool[] = [
  {
    "slug": "file-to-base64",
    "title": "File to Base64 Converter",
    "description": "Encode any file as Base64 or a data URL, or decode Base64 into a downloadable binary file. Files stay in your browser.",
    "kind": "file",
    "example": "",
    "action": "Encode file",
    "extension": "txt",
    "fields": [
      {
        "key": "mode",
        "label": "Direction",
        "default": "encode",
        "type": "select",
        "options": [
          {
            "value": "encode",
            "label": "File to Base64"
          },
          {
            "value": "decode",
            "label": "Base64 to file"
          }
        ]
      },
      {
        "key": "style",
        "label": "Encoded output",
        "default": "raw",
        "type": "select",
        "options": [
          {
            "value": "raw",
            "label": "Raw Base64"
          },
          {
            "value": "data",
            "label": "Data URL"
          }
        ]
      }
    ],
    "steps": [
      "Choose a file to encode, or select Base64 to file and paste encoded data.",
      "Choose raw Base64 or a data URL for encoding.",
      "Run the conversion and copy the text or download the decoded bytes."
    ],
    "sections": [
      {
        "heading": "File encoding without changing bytes",
        "body": "Use this tool for binary API fields, small attachment payloads, and data URLs. Unlike a text encoder, it reads the original file bytes, so image and document contents are preserved. Base64 expands data by roughly one third before any transport compression. Keep large assets as files when the receiving API supports them."
      },
      {
        "heading": "Decode with a neutral filename",
        "body": "The decoder accepts standard Base64 and Base64 data URLs, ignores whitespace, and downloads the result as decoded.bin. Rename it only when you know the original format. It does not execute, render, or open decoded content. URL-safe Base64 is a different alphabet and is rejected. Inputs are limited to about 20 MiB of decoded data."
      }
    ],
    "faq": {
      "question": "Does Base64 encrypt a file?",
      "answer": "No. Anyone with the encoded text can recover the original bytes. Treat encoded confidential files as confidential."
    },
    "related": [
      "/tools/string-to-base64",
      "/tools/base64-to-hex",
      "/blog/base64-explained"
    ]
  },
  {
    "slug": "file-checksum",
    "title": "File Checksum Calculator",
    "description": "Calculate SHA-256, SHA-384 and SHA-512 file hashes locally and compare an expected checksum with the selected file.",
    "kind": "file",
    "example": "",
    "action": "Calculate checksums",
    "extension": "txt",
    "fields": [
      {
        "key": "expected",
        "label": "Expected checksum (optional)",
        "default": "",
        "type": "text"
      }
    ],
    "steps": [
      "Choose the exact downloaded file, up to 100 MiB.",
      "Optionally paste an expected SHA-256, SHA-384 or SHA-512 hexadecimal digest.",
      "Calculate hashes and inspect the match result before using the file."
    ],
    "sections": [
      {
        "heading": "Verify a download against a trusted digest",
        "body": "File checksums help detect corruption and identify byte-for-byte changes. This calculator hashes the original file rather than its name or text representation. Compare the output with a digest supplied through a trusted release channel. A digest delivered by the same compromised source as the file does not independently establish authenticity."
      },
      {
        "heading": "How comparison works",
        "body": "The expected value must be a plain 64-, 96-, or 128-character hexadecimal digest. Uppercase and lowercase are equivalent. The tool reports which algorithm matched, or a mismatch. It reads the selected file into memory using Web Crypto, so the 100 MiB limit keeps ordinary checks manageable; it is not a streaming multi-gigabyte verifier."
      }
    ],
    "faq": {
      "question": "Is this different from the text hash generator?",
      "answer": "Yes. This tool hashes exact binary file bytes and compares a published checksum; the text tool hashes a string encoded as text."
    },
    "related": [
      "/tools/hash-generator",
      "/tools/sri-generator",
      "/blog/md5-vs-sha256"
    ]
  },
  {
    "slug": "image-resizer",
    "title": "Image Resizer",
    "description": "Resize PNG, JPEG and WebP images to exact pixel dimensions, preserve aspect ratio, and download the result without uploading.",
    "kind": "image",
    "example": "",
    "action": "Resize image",
    "extension": "png",
    "fields": [
      {
        "key": "width",
        "label": "Target width (px)",
        "default": "1200",
        "type": "number",
        "min": 1,
        "max": 8192
      },
      {
        "key": "height",
        "label": "Target height (px)",
        "default": "800",
        "type": "number",
        "min": 1,
        "max": 8192
      },
      {
        "key": "lock",
        "label": "Preserve aspect ratio",
        "default": "true",
        "type": "checkbox"
      }
    ],
    "steps": [
      "Select a PNG, JPEG or WebP image.",
      "Set the target width. With aspect ratio locked, height is calculated from the source image.",
      "Turn off the lock for exact width and height, then resize and download the PNG."
    ],
    "sections": [
      {
        "heading": "Resize dimensions rather than just renaming a file",
        "body": "A smaller pixel canvas can reduce page rendering and layout costs. This tool uses browser image decoding and high-quality canvas resampling, then exports PNG so resize settings are independent of lossy compression. Enter both dimensions only when stretching is intentional. It does not crop the image."
      },
      {
        "heading": "Image limits and metadata",
        "body": "Input files are limited to 20 MiB, decoded images to 40 million pixels, and output dimensions to 8192 pixels per side with a 40-million-pixel total cap. Canvas re-encoding does not preserve source EXIF metadata or animation. For a smaller delivery file, pass the resized result to the image compressor or format converter."
      }
    ],
    "faq": {
      "question": "Does locking the ratio use both dimensions?",
      "answer": "No. Width controls the output and height is derived from the source ratio. Unlock it to use both width and height."
    },
    "related": [
      "/tools/image-compressor",
      "/tools/image-format-converter",
      "/tools/aspect-ratio-calculator"
    ]
  },
  {
    "slug": "image-compressor",
    "title": "Image Compressor",
    "description": "Compress JPEG, PNG and WebP images into JPEG or WebP with adjustable quality, file-size comparison and local processing.",
    "kind": "image",
    "example": "",
    "action": "Compress image",
    "extension": "webp",
    "fields": [
      {
        "key": "format",
        "label": "Compressed format",
        "default": "image/webp",
        "type": "select",
        "options": [
          {
            "value": "image/webp",
            "label": "WebP"
          },
          {
            "value": "image/jpeg",
            "label": "JPEG"
          }
        ]
      },
      {
        "key": "quality",
        "label": "Quality (%)",
        "default": "75",
        "type": "number",
        "min": 1,
        "max": 100
      }
    ],
    "steps": [
      "Choose a supported image; its dimensions remain unchanged.",
      "Select WebP or JPEG and adjust quality from 1 to 100.",
      "Compare the before and after byte counts, inspect the preview, and download the result."
    ],
    "sections": [
      {
        "heading": "Reduce transfer size with an explicit quality setting",
        "body": "This tool re-encodes a still image at its original dimensions. WebP and JPEG use lossy compression here, so compare fine detail, gradients and text before publishing. The quality number is an encoder hint, not a percentage of preserved visual information. Results vary with the image and browser encoder."
      },
      {
        "heading": "When compression makes a file larger",
        "body": "Already optimized images can grow after re-encoding. The result reports actual byte sizes and warns when no saving occurred. Lower the quality or resize a very large source instead. JPEG uses a white background for transparent pixels; choose WebP to keep transparency. Animated images and source metadata are not preserved."
      }
    ],
    "faq": {
      "question": "Can it guarantee a particular KB target?",
      "answer": "No. This tool exposes encoder quality and reports actual sizes. Exact file size depends on image content, dimensions and browser encoding."
    },
    "related": [
      "/tools/image-resizer",
      "/tools/image-format-converter",
      "/tools/byte-converter"
    ]
  },
  {
    "slug": "image-format-converter",
    "title": "Image Format Converter",
    "description": "Convert PNG, JPEG and WebP images in your browser with previews, transparent-background handling and downloadable output.",
    "kind": "image",
    "example": "",
    "action": "Convert image",
    "extension": "webp",
    "fields": [
      {
        "key": "format",
        "label": "Output format",
        "default": "image/webp",
        "type": "select",
        "options": [
          {
            "value": "image/webp",
            "label": "WebP"
          },
          {
            "value": "image/jpeg",
            "label": "JPEG"
          },
          {
            "value": "image/png",
            "label": "PNG"
          }
        ]
      }
    ],
    "steps": [
      "Choose a PNG, JPEG or WebP image.",
      "Select PNG for lossless pixel encoding, JPEG for photos, or WebP for a modern delivery format.",
      "Convert, inspect the result, and download a file with the correct extension."
    ],
    "sections": [
      {
        "heading": "Choose a format for the content",
        "body": "PNG works well for flat graphics and alpha transparency. JPEG is useful for photo-like content but does not support alpha. WebP can provide efficient delivery and supports transparency. This converter uses a fixed high-quality setting for JPEG and WebP; use the separate compressor when you want to tune quality."
      },
      {
        "heading": "What conversion preserves",
        "body": "The tool retains pixel dimensions and re-encodes the decoded image. It does not preserve EXIF metadata, layered documents, or animation. Transparent pixels are composited onto white when exporting JPEG. Browser support is checked by the output MIME type so a fallback PNG is never mislabeled as another format. HEIC, SVG and PDF are outside this converter’s supported inputs."
      }
    ],
    "faq": {
      "question": "Does converting a JPEG to PNG recover lost detail?",
      "answer": "No. A lossless output format preserves the decoded pixels, but it cannot restore information discarded by an earlier lossy encoding."
    },
    "related": [
      "/tools/image-resizer",
      "/tools/image-compressor",
      "/tools/file-to-base64"
    ]
  },
  {
    "slug": "css-gradient-generator",
    "title": "CSS Gradient Generator",
    "description": "Build linear, radial and conic CSS gradients with a live preview, two color stops and copyable background CSS.",
    "kind": "design",
    "example": "",
    "action": "Generate gradient",
    "extension": "css",
    "fields": [
      {
        "key": "type",
        "label": "Gradient type",
        "default": "linear",
        "type": "select",
        "options": [
          {
            "value": "linear",
            "label": "Linear"
          },
          {
            "value": "radial",
            "label": "Radial"
          },
          {
            "value": "conic",
            "label": "Conic"
          }
        ]
      },
      {
        "key": "color1",
        "label": "First color",
        "default": "#6366f1",
        "type": "color"
      },
      {
        "key": "color2",
        "label": "Second color",
        "default": "#ec4899",
        "type": "color"
      },
      {
        "key": "angle",
        "label": "Angle (degrees)",
        "default": "135",
        "type": "number",
        "min": 0,
        "max": 360
      },
      {
        "key": "stop1",
        "label": "First stop (%)",
        "default": "0",
        "type": "number",
        "min": 0,
        "max": 100
      },
      {
        "key": "stop2",
        "label": "Second stop (%)",
        "default": "100",
        "type": "number",
        "min": 0,
        "max": 100
      }
    ],
    "steps": [
      "Choose two colors and a gradient type.",
      "Adjust the stop positions; angle applies to linear and conic gradients.",
      "Generate a preview and copy the background declaration into your stylesheet."
    ],
    "sections": [
      {
        "heading": "Understand gradient direction and stops",
        "body": "Linear gradients blend along a line, radial gradients expand outward, and conic gradients rotate around the center. Stop positions determine where each color is anchored. The first stop must not exceed the second. Equal stops create a hard color transition, which can be useful for striped backgrounds."
      },
      {
        "heading": "Use gradients behind readable content",
        "body": "A gradient preview does not check text contrast. Test foreground text against the lightest and darkest portions it touches. Provide a solid background fallback when needed, and keep decorative gradients in CSS rather than exporting an unnecessarily large raster image. The generated snippet uses standard CSS gradient functions."
      }
    ],
    "faq": {
      "question": "Why does the angle not affect radial output?",
      "answer": "A circular radial gradient has no directional angle. Its center and shape are fixed in this two-color generator."
    },
    "related": [
      "/tools/color-converter",
      "/tools/color-contrast-checker",
      "/tools/css-box-shadow-generator"
    ]
  },
  {
    "slug": "css-box-shadow-generator",
    "title": "CSS Box Shadow Generator",
    "description": "Create inset or outer CSS box shadows with adjustable offsets, blur, spread, color and opacity, plus a live preview.",
    "kind": "design",
    "example": "",
    "action": "Generate shadow",
    "extension": "css",
    "fields": [
      {
        "key": "x",
        "label": "Horizontal offset (px)",
        "default": "0",
        "type": "number",
        "min": -200,
        "max": 200
      },
      {
        "key": "y",
        "label": "Vertical offset (px)",
        "default": "12",
        "type": "number",
        "min": -200,
        "max": 200
      },
      {
        "key": "blur",
        "label": "Blur (px)",
        "default": "30",
        "type": "number",
        "min": 0,
        "max": 200
      },
      {
        "key": "spread",
        "label": "Spread (px)",
        "default": "0",
        "type": "number",
        "min": -100,
        "max": 100
      },
      {
        "key": "color",
        "label": "Shadow color",
        "default": "#000000",
        "type": "color"
      },
      {
        "key": "opacity",
        "label": "Opacity (%)",
        "default": "20",
        "type": "number",
        "min": 0,
        "max": 100
      },
      {
        "key": "inset",
        "label": "Inset shadow",
        "default": "false",
        "type": "checkbox"
      }
    ],
    "steps": [
      "Adjust offsets, blur and spread for the desired elevation.",
      "Choose a shadow color, opacity and optional inset mode.",
      "Generate the CSS, inspect it against the preview surface, and copy the declaration."
    ],
    "sections": [
      {
        "heading": "Offsets, blur and spread solve different problems",
        "body": "Horizontal and vertical offsets move the shadow. Blur softens its edges; spread grows or shrinks the underlying shape before blur. Negative spread can make a shadow feel lighter without reducing its color opacity. Inset draws the shadow inside the box rather than outside it."
      },
      {
        "heading": "Test shadows in the real component",
        "body": "A shadow that looks subtle on a white preview may disappear on a dark surface. Inspect both themes and avoid using shadow alone to communicate a control boundary or focus state. This tool generates one shadow layer; combine several comma-separated layers manually when your design needs more complex elevation."
      }
    ],
    "faq": {
      "question": "Can blur be negative?",
      "answer": "No. CSS requires a nonnegative blur radius. Offsets and spread may be negative."
    },
    "related": [
      "/tools/css-gradient-generator",
      "/tools/css-border-radius-generator",
      "/tools/css-formatter"
    ]
  },
  {
    "slug": "css-border-radius-generator",
    "title": "CSS Border Radius Generator",
    "description": "Design asymmetric CSS rounded corners with independent horizontal and vertical radii, a live shape preview and copyable CSS.",
    "kind": "design",
    "example": "",
    "action": "Generate border radius",
    "extension": "css",
    "fields": [
      {
        "key": "tlx",
        "label": "Top-left horizontal (%)",
        "default": "50",
        "type": "number",
        "min": 0,
        "max": 100
      },
      {
        "key": "trx",
        "label": "Top-right horizontal (%)",
        "default": "50",
        "type": "number",
        "min": 0,
        "max": 100
      },
      {
        "key": "brx",
        "label": "Bottom-right horizontal (%)",
        "default": "50",
        "type": "number",
        "min": 0,
        "max": 100
      },
      {
        "key": "blx",
        "label": "Bottom-left horizontal (%)",
        "default": "50",
        "type": "number",
        "min": 0,
        "max": 100
      },
      {
        "key": "tly",
        "label": "Top-left vertical (%)",
        "default": "50",
        "type": "number",
        "min": 0,
        "max": 100
      },
      {
        "key": "try",
        "label": "Top-right vertical (%)",
        "default": "50",
        "type": "number",
        "min": 0,
        "max": 100
      },
      {
        "key": "bry",
        "label": "Bottom-right vertical (%)",
        "default": "50",
        "type": "number",
        "min": 0,
        "max": 100
      },
      {
        "key": "bly",
        "label": "Bottom-left vertical (%)",
        "default": "50",
        "type": "number",
        "min": 0,
        "max": 100
      }
    ],
    "steps": [
      "Set horizontal and vertical percentages for each corner.",
      "Generate the shape preview to see how the eight radii interact.",
      "Copy the slash-separated border-radius declaration to your component."
    ],
    "sections": [
      {
        "heading": "Use the slash syntax for elliptical corners",
        "body": "CSS accepts four horizontal radii followed by a slash and four vertical radii. The order on each side is top-left, top-right, bottom-right, bottom-left. Percentages are relative to the corresponding box dimension, so the same declaration can produce a different silhouette on a tall or wide element."
      },
      {
        "heading": "Understand automatic radius scaling",
        "body": "If adjacent corner radii exceed the available edge length, CSS scales the radii down according to its overlap rules. This generator displays the actual browser result rather than claiming every percentage maps directly to an independent circle. Use it for badges, cards, and decorative shapes, then verify clipping and focus outlines in the final layout."
      }
    ],
    "faq": {
      "question": "Can I make a circle with this tool?",
      "answer": "Use 50% for all radii on a square element. A rectangle with the same values produces an ellipse."
    },
    "related": [
      "/tools/css-box-shadow-generator",
      "/tools/css-gradient-generator",
      "/tools/aspect-ratio-calculator"
    ]
  },
  {
    "slug": "json-to-python-dataclass",
    "title": "JSON to Python Dataclass Converter",
    "description": "Generate Python 3.10+ dataclasses from JSON samples with nested classes, list types, nullable fields and merged record shapes.",
    "kind": "text",
    "example": "[{\"user_id\":1,\"profile\":{\"name\":\"Ada\"},\"tags\":[\"admin\"]},{\"user_id\":2,\"profile\":null}]",
    "action": "Generate Python",
    "extension": "py",
    "fields": [],
    "steps": [
      "Paste one JSON object or a non-empty array of objects.",
      "Generate classes inferred from all supplied records, including fields missing in some samples.",
      "Review the annotations and renamed fields before using the Python code."
    ],
    "sections": [
      {
        "heading": "Infer a useful starting model",
        "body": "The converter examines every sample record, creates nested dataclasses, and combines different observed types with Python union annotations. Null or missing fields receive a None-compatible annotation and a default of None. Classes use keyword-only constructors so required and defaulted fields can coexist. Empty lists use Any because no element type can be inferred."
      },
      {
        "heading": "Generated types are not runtime validation",
        "body": "Dataclasses do not automatically parse dictionaries into nested instances or enforce annotations at runtime. Use a deliberate loading and validation layer. Non-Python field names are normalized and documented in comments; those comments do not implement JSON-key mapping. Numeric precision is limited by browser JSON parsing. The generated model describes samples, not every possible API response."
      }
    ],
    "faq": {
      "question": "Can I pass json.loads output directly into nested classes?",
      "answer": "The root constructor accepts keyword arguments, but nested dictionaries are not automatically converted to dataclass instances. Add explicit deserialization logic."
    },
    "related": [
      "/tools/json-to-typescript-interface",
      "/tools/json-to-go-struct",
      "/tools/json-schema-generator"
    ]
  },
  {
    "slug": "csv-to-sql",
    "title": "CSV to SQL Converter",
    "description": "Turn CSV rows into safely quoted SQL INSERT statements for PostgreSQL, SQLite or MySQL, preserving cells as text.",
    "kind": "text",
    "example": "name,postal_code\nAda,00123\nO'Brien,90210",
    "action": "Generate SQL",
    "extension": "sql",
    "fields": [
      {
        "key": "table",
        "label": "Table name",
        "default": "records",
        "type": "text"
      },
      {
        "key": "dialect",
        "label": "SQL dialect",
        "default": "postgres",
        "type": "select",
        "options": [
          {
            "value": "postgres",
            "label": "PostgreSQL"
          },
          {
            "value": "sqlite",
            "label": "SQLite"
          },
          {
            "value": "mysql",
            "label": "MySQL"
          }
        ]
      },
      {
        "key": "delimiter",
        "label": "Delimiter",
        "default": ",",
        "type": "select",
        "options": [
          {
            "value": ",",
            "label": "Comma"
          },
          {
            "value": ";",
            "label": "Semicolon"
          },
          {
            "value": "\t",
            "label": "Tab"
          }
        ]
      }
    ],
    "steps": [
      "Paste CSV with a unique, non-empty header row.",
      "Choose the destination table, SQL dialect and delimiter.",
      "Generate INSERT statements, review them, and execute only against your intended database."
    ],
    "sections": [
      {
        "heading": "Preserve spreadsheet values during import",
        "body": "All cells are emitted as string values, including numeric-looking identifiers and empty strings. This avoids guessing whether 00123 is a code or a number. Configure destination column types deliberately; an empty cell is not converted to SQL NULL. Quoted delimiters, multiline cells and doubled quotes are supported, and inconsistent row widths are rejected."
      },
      {
        "heading": "Dialect-specific quoting",
        "body": "PostgreSQL and SQLite use double-quoted identifiers; MySQL uses backticks. PostgreSQL escape strings handle backslashes explicitly, and MySQL values use UTF-8 hexadecimal literals to avoid reliance on backslash SQL modes. The table field is one identifier rather than an arbitrary SQL fragment. This tool generates a script but never connects to a database or runs a query."
      }
    ],
    "faq": {
      "question": "Does it infer SQL column types or create tables?",
      "answer": "No. It generates INSERT statements for an existing table. Keeping schema design separate avoids unreliable guesses from small CSV samples."
    },
    "related": [
      "/tools/csv-to-json",
      "/tools/json-to-postgresql",
      "/tools/sql-formatter"
    ]
  },
  {
    "slug": "json-to-query-string",
    "title": "JSON to Query String Converter",
    "description": "Convert JSON parameters into a URL query string or decode query parameters into JSON, including repeated keys and Unicode.",
    "kind": "text",
    "example": "{\"q\":\"hello world\",\"tag\":[\"css\",\"web\"],\"page\":2}",
    "action": "Convert parameters",
    "extension": "txt",
    "fields": [
      {
        "key": "direction",
        "label": "Direction",
        "default": "encode",
        "type": "select",
        "options": [
          {
            "value": "encode",
            "label": "JSON to query string"
          },
          {
            "value": "decode",
            "label": "Query string to JSON"
          }
        ]
      }
    ],
    "steps": [
      "Paste a JSON object of scalar values and arrays, or switch direction and paste a query string.",
      "Convert parameters; arrays become repeated keys when encoding.",
      "Copy the output and verify that your receiving API expects the same parameter convention."
    ],
    "sections": [
      {
        "heading": "Repeated keys rather than invented array syntax",
        "body": "A JSON array such as tag: [\"css\", \"web\"] becomes two tag parameters. Bracket notation and comma-separated arrays are different API conventions and are not added automatically. Nested objects are rejected because there is no universal nested-query representation. Null becomes an empty value and empty arrays contribute no parameters."
      },
      {
        "heading": "Decoding has string semantics",
        "body": "Query strings do not carry JSON number, boolean or null types. Decoding therefore returns strings, or arrays of strings for repeated keys. A plus sign represents a space; a literal plus must be encoded as %2B. Paste only the query part or use the URL Parser for complete URLs. Malformed percent-encoded UTF-8 is rejected rather than silently repaired."
      }
    ],
    "faq": {
      "question": "Will a round trip preserve every JSON type?",
      "answer": "No. Numbers and booleans decode as strings, null becomes an empty string, and empty arrays are omitted. Query parameters are textual."
    },
    "related": [
      "/tools/url-parser",
      "/tools/url-encode",
      "/tools/url-decode"
    ]
  },
  {
    "slug": "html-table-to-csv",
    "title": "HTML Table to CSV Converter",
    "description": "Extract the first HTML table into quoted CSV, preserving cell text and rejecting merged cells that would distort columns.",
    "kind": "text",
    "example": "<table><tr><th>Name</th><th>City</th></tr><tr><td>Ada</td><td>London</td></tr></table>",
    "action": "Extract CSV",
    "extension": "csv",
    "fields": [],
    "steps": [
      "Paste HTML containing a table, including a copied table fragment.",
      "Convert the first table; review messages for merged cells or uneven row widths.",
      "Copy or download the CSV and import it with comma as the delimiter."
    ],
    "sections": [
      {
        "heading": "Extract cell text with a real HTML parser",
        "body": "The converter reads th and td elements from the first table, decodes character references, and quotes commas, quotes and line breaks correctly. Scripts, styles and nested tables are excluded from cell text. HTML stays inside an inert template and is never inserted into the visible page."
      },
      {
        "heading": "Merged cells need an explicit policy",
        "body": "Rowspan and colspan can imply missing or duplicated cells in a flat CSV. This tool rejects spans other than one instead of guessing how to expand them. Every extracted row must have the same number of cells. It does not execute page scripts, apply external styles, or recover data loaded by JavaScript. Spreadsheet software can interpret cells beginning with formula characters; review untrusted data before opening it."
      }
    ],
    "faq": {
      "question": "Can I paste a URL to scrape a table?",
      "answer": "No. Paste the table HTML. The tool does not fetch websites, bypass access controls, or execute page scripts."
    },
    "related": [
      "/tools/csv-to-json",
      "/tools/json-to-html-table",
      "/tools/html-to-text"
    ]
  },
  {
    "slug": "url-extractor",
    "title": "URL Extractor",
    "description": "Extract unique HTTP and HTTPS URLs from text, logs or pasted HTML source with optional duplicate retention.",
    "kind": "text",
    "example": "Read https://example.com/docs and https://example.org/search?q=hello.\nAgain: https://example.com/docs",
    "action": "Extract URLs",
    "extension": "txt",
    "fields": [
      {
        "key": "unique",
        "label": "Remove exact duplicates",
        "default": "true",
        "type": "checkbox"
      }
    ],
    "steps": [
      "Paste text, logs or raw HTML containing absolute HTTP or HTTPS URLs.",
      "Choose whether exact duplicate strings should be removed.",
      "Extract, inspect the candidates, and copy the URL list."
    ],
    "sections": [
      {
        "heading": "Find links in unstructured text",
        "body": "This extractor recognizes explicit http:// and https:// prefixes, removes common trailing sentence punctuation, and retains balanced parentheses within a URL. It validates candidates with the browser URL parser without visiting them. Original spelling and encounter order are retained. Relative paths and bare domain names are not treated as URLs."
      },
      {
        "heading": "Review ambiguous punctuation",
        "body": "A punctuation character may be part of a valid URL or part of surrounding prose. No plain-text heuristic can always distinguish them. Check results containing unusual punctuation or parentheses before using them in a crawler or migration. Pasted HTML is treated as source text, so entity references in attributes are not automatically decoded. This tool extracts addresses; it does not check availability or safety."
      }
    ],
    "faq": {
      "question": "Does it visit the extracted links?",
      "answer": "No. It only finds and validates URL syntax locally. It does not make HTTP requests to the extracted addresses."
    },
    "related": [
      "/tools/url-parser",
      "/tools/list-compare",
      "/tools/utm-builder"
    ]
  },
  {
    "slug": "email-extractor",
    "title": "Email Address Extractor",
    "description": "Extract email address candidates from pasted text and remove exact duplicates without uploading your contact data.",
    "kind": "text",
    "example": "Contact ada@example.com or support@example.org.\nCopy ada@example.com on the message.",
    "action": "Extract emails",
    "extension": "txt",
    "fields": [
      {
        "key": "unique",
        "label": "Remove exact duplicates",
        "default": "true",
        "type": "checkbox"
      }
    ],
    "steps": [
      "Paste text containing email addresses.",
      "Choose whether to retain exact duplicate occurrences.",
      "Extract candidate addresses and review the list before use."
    ],
    "sections": [
      {
        "heading": "A practical extractor, not a mailbox verifier",
        "body": "This tool finds common ASCII email address forms with a dotted domain. It accepts common local-part punctuation and subdomains, then rejects consecutive dots and invalid domain labels. It does not cover quoted local parts, address literals, internationalized local parts or every form permitted by email standards. Review unusual addresses separately."
      },
      {
        "heading": "Preserve address spelling",
        "body": "Deduplication compares exact strings, including case, because local-part handling belongs to the receiving mail system. The tool does not contact mail servers, verify ownership, or confirm deliverability. A syntactically plausible candidate can still be nonexistent. Use the results only in a workflow where you are authorized to process those contacts, and keep confidential lists out of shared output."
      }
    ],
    "faq": {
      "question": "Can this tell whether an email address exists?",
      "answer": "No. Extraction and syntax checks do not establish mailbox existence, ownership or permission to send messages."
    },
    "related": [
      "/tools/list-compare",
      "/tools/remove-duplicate-lines",
      "/tools/whitespace-remover"
    ]
  },
  {
    "slug": "list-compare",
    "title": "Compare Two Lists",
    "description": "Compare two lists for common entries, items only in either list, duplicates and a combined union, with configurable matching.",
    "kind": "text",
    "example": "Ada\nGrace\nLinus\nAda",
    "action": "Compare lists",
    "extension": "json",
    "fields": [
      {
        "key": "trim",
        "label": "Ignore surrounding whitespace",
        "default": "true",
        "type": "checkbox"
      },
      {
        "key": "ignoreCase",
        "label": "Ignore case",
        "default": "false",
        "type": "checkbox"
      }
    ],
    "steps": [
      "Paste one item per line into List A and List B.",
      "Choose whether matching ignores outer whitespace or case.",
      "Compare to obtain shared values, differences, union and duplicate counts."
    ],
    "sections": [
      {
        "heading": "Set comparison instead of a line diff",
        "body": "A text diff compares position and order. This tool compares membership: the same item counts as shared even if it appears on a different line. Blank items are ignored. Results retain the first spelling seen for each normalized value and include input counts, distinct counts and duplicates for each list."
      },
      {
        "heading": "Use explicit matching rules",
        "body": "Case-insensitive matching lowercases values for comparison but keeps the first original representation in output. It does not strip accents, normalize phone numbers, or perform fuzzy name matching. When comparing IDs, keep leading zeros and choose case sensitivity according to the system that issued them. JSON output separates only-in-A, only-in-B, shared and union values for further processing."
      }
    ],
    "faq": {
      "question": "Does changing item order change membership results?",
      "answer": "It changes encounter order in the output, but not which values belong to the shared or distinct sets."
    },
    "related": [
      "/tools/text-diff",
      "/tools/remove-duplicate-lines",
      "/tools/line-sorter"
    ],
    "exampleB": "Grace\nMargaret\nAda"
  },
  {
    "slug": "whitespace-remover",
    "title": "Whitespace Remover",
    "description": "Remove or normalize whitespace in text: trim lines, collapse spaces, remove blank lines or delete all whitespace locally.",
    "kind": "text",
    "example": "  Hello,   world!  \n\n  Clean up copied text.\n",
    "action": "Clean whitespace",
    "extension": "txt",
    "fields": [
      {
        "key": "mode",
        "label": "Cleanup mode",
        "default": "trim",
        "type": "select",
        "options": [
          {
            "value": "trim",
            "label": "Trim each line"
          },
          {
            "value": "collapse",
            "label": "Collapse horizontal spaces"
          },
          {
            "value": "blank",
            "label": "Remove blank lines"
          },
          {
            "value": "all",
            "label": "Remove all whitespace"
          }
        ]
      }
    ],
    "steps": [
      "Paste text and choose the whitespace rule your workflow needs.",
      "Run cleanup and inspect the result before replacing the original.",
      "Copy or download the cleaned text."
    ],
    "sections": [
      {
        "heading": "Choose a narrow cleanup operation",
        "body": "Trimming each line removes outer whitespace while preserving internal spacing. Collapsing horizontal whitespace changes runs of spaces, tabs and nonbreaking spaces into a single space while retaining line boundaries. Removing blank lines preserves nonblank line contents. Removing all whitespace also removes line breaks, so use it only when concatenation is intended."
      },
      {
        "heading": "Whitespace can be meaningful data",
        "body": "Indentation matters in Python, YAML and Markdown, and spaces matter inside string literals. This tool does not parse a programming language and cannot distinguish syntax from prose. Keep an original copy and use a format-aware formatter for source code. Zero-width characters are not all JavaScript whitespace; invisible character cleanup requires a separate, deliberate rule."
      }
    ],
    "faq": {
      "question": "Will it remove zero-width spaces?",
      "answer": "Not necessarily. The cleanup modes use defined whitespace rules, and U+200B is not included in JavaScript’s whitespace character class."
    },
    "related": [
      "/tools/word-counter",
      "/tools/remove-duplicate-lines",
      "/tools/line-sorter"
    ]
  },
  {
    "slug": "nato-phonetic-alphabet",
    "title": "NATO Phonetic Alphabet Converter",
    "description": "Convert letters and numbers into NATO spelling words such as Alfa, Bravo and Charlie for clear verbal communication.",
    "kind": "text",
    "example": "Flight AB-123",
    "action": "Convert to NATO",
    "extension": "txt",
    "fields": [],
    "steps": [
      "Enter text containing Latin letters and digits.",
      "Convert to spelling words; word boundaries appear as slashes.",
      "Read or copy the output when spelling identifiers aloud."
    ],
    "sections": [
      {
        "heading": "Spell identifiers more clearly",
        "body": "The international radiotelephony spelling alphabet assigns a distinctive word to each Latin letter. The official spellings Alfa and Juliett are intentional. This tool is useful for names, booking references and serial numbers shared over a phone call. Letters are case-insensitive, while digits are written using ordinary English number words."
      },
      {
        "heading": "Know what the conversion does not mean",
        "body": "This is a spelling alphabet, not linguistic phonetic transcription or encryption. Punctuation is retained as literal characters, and unsupported non-Latin characters are retained rather than guessed. Digits use plain English words rather than specialized operational pronunciation. Use your organization’s required communication procedure for aviation, maritime or other regulated work."
      }
    ],
    "faq": {
      "question": "Why does the output say Alfa instead of Alpha?",
      "answer": "Alfa is the international spelling used in the radiotelephony alphabet. Juliett similarly uses two final t characters."
    },
    "related": [
      "/tools/morse-code",
      "/tools/unicode-escape",
      "/tools/text-to-hex"
    ]
  },
  {
    "slug": "time-duration-converter",
    "title": "Time Duration Converter",
    "description": "Convert durations between milliseconds, seconds, minutes, hours, days and weeks, with a readable days-hours-minutes-seconds breakdown.",
    "kind": "text",
    "example": "90061",
    "action": "Convert duration",
    "extension": "txt",
    "fields": [
      {
        "key": "unit",
        "label": "Input unit",
        "default": "seconds",
        "type": "select",
        "options": [
          {
            "value": "milliseconds",
            "label": "Milliseconds"
          },
          {
            "value": "seconds",
            "label": "Seconds"
          },
          {
            "value": "minutes",
            "label": "Minutes"
          },
          {
            "value": "hours",
            "label": "Hours"
          },
          {
            "value": "days",
            "label": "Days"
          },
          {
            "value": "weeks",
            "label": "Weeks"
          }
        ]
      }
    ],
    "steps": [
      "Enter a finite nonnegative duration, including a decimal if needed.",
      "Choose the source unit and convert.",
      "Read all unit conversions and the decomposed duration."
    ],
    "sections": [
      {
        "heading": "Duration arithmetic without timezone ambiguity",
        "body": "A duration is an elapsed amount, not a calendar date. This converter treats a minute as 60 seconds, an hour as 3600 seconds, a day as 24 hours, and a week as seven days. It is useful for log timings, cache lifetimes, media lengths and timeout configuration. It does not interpret clock times or daylight-saving transitions."
      },
      {
        "heading": "Avoid pretending months have a fixed duration",
        "body": "Calendar months and years vary, so they are intentionally excluded. Fractional input is supported within ordinary JavaScript floating-point precision; the readable breakdown is rounded to the nearest millisecond. Values too large for a safe millisecond count are rejected. Use the timestamp tool when you need a specific moment in time rather than an elapsed span."
      }
    ],
    "faq": {
      "question": "Why is a calendar day sometimes not 24 hours?",
      "answer": "Local clock changes can make a calendar day shorter or longer. This tool uses fixed elapsed-time units and does not model calendar transitions."
    },
    "related": [
      "/tools/date-to-unix-timestamp",
      "/tools/cron-parser",
      "/tools/number-base-converter"
    ]
  },
  {
    "slug": "percentage-calculator",
    "title": "Percentage Calculator",
    "description": "Calculate a percentage of a number, one value as a percentage of another, or percentage increase and decrease with clear formulas.",
    "kind": "text",
    "example": "",
    "action": "Calculate percentage",
    "extension": "txt",
    "fields": [
      {
        "key": "mode",
        "label": "Calculation",
        "default": "of",
        "type": "select",
        "options": [
          {
            "value": "of",
            "label": "What is A% of B?"
          },
          {
            "value": "ratio",
            "label": "A is what percent of B?"
          },
          {
            "value": "change",
            "label": "Change from A to B (%)"
          }
        ]
      },
      {
        "key": "a",
        "label": "A",
        "default": "20",
        "type": "number",
        "step": "any"
      },
      {
        "key": "b",
        "label": "B",
        "default": "150",
        "type": "number",
        "step": "any"
      }
    ],
    "steps": [
      "Choose the percentage question you want to answer.",
      "Enter A and B as labeled in that question; decimals and negative values are accepted.",
      "Calculate to see the result and formula."
    ],
    "sections": [
      {
        "heading": "Three common percentage questions",
        "body": "Percentage of a number uses A divided by 100 and multiplied by B. A as a percentage of B divides A by B and multiplies by 100. Percentage change divides the difference between B and A by the absolute value of A, then multiplies by 100; this absolute-baseline convention keeps the direction explicit when A is negative."
      },
      {
        "heading": "Check the baseline before interpreting change",
        "body": "A zero denominator makes a ratio undefined, and a change from zero has no finite baseline percentage. Percentage points are different from percentage change: moving from 20% to 25% is five percentage points and a 25% relative increase. Results use browser floating-point arithmetic and are rounded for display, so use a decimal accounting system when exact financial rounding is required."
      }
    ],
    "faq": {
      "question": "What happens when the starting value is zero?",
      "answer": "A relative percentage change from zero is undefined. The calculator reports that instead of inventing a finite percentage."
    },
    "related": [
      "/tools/number-base-converter",
      "/tools/byte-converter",
      "/tools/time-duration-converter"
    ]
  },
  {
    "slug": "http-headers-to-json",
    "title": "HTTP Headers to JSON Converter",
    "description": "Parse raw HTTP request or response headers into JSON while preserving repeated values such as Set-Cookie as arrays.",
    "kind": "text",
    "example": "HTTP/1.1 200 OK\nContent-Type: application/json\nSet-Cookie: session=abc; HttpOnly\nSet-Cookie: theme=dark",
    "action": "Parse headers",
    "extension": "json",
    "fields": [],
    "steps": [
      "Paste one HTTP header block, optionally including an HTTP/1.x request or response start line.",
      "Parse the block; names are normalized to lowercase and repeated fields remain arrays.",
      "Inspect the JSON and remove sensitive header values before sharing."
    ],
    "sections": [
      {
        "heading": "Preserve repeated header fields",
        "body": "Headers can repeat, and combining them with commas is not always valid. Set-Cookie is a familiar example. This parser stores every value in an array, even when a name appears only once. It splits each line at the first colon, so colons inside values remain intact. Header names are validated as HTTP tokens."
      },
      {
        "heading": "Input boundaries and unsupported forms",
        "body": "The tool handles one textual HTTP/1.x-style block. It stops at the empty line before a message body, rejects obsolete folded continuation lines, and does not decode binary HTTP/2 frames or mixed curl verbose transcripts. It records an optional start line separately and checks field syntax, not the semantic rules of every header. Authorization and Cookie contents remain sensitive in the generated JSON."
      }
    ],
    "faq": {
      "question": "Why are single header values arrays too?",
      "answer": "A consistent array shape preserves repetition without changing JSON types when a second occurrence appears."
    },
    "related": [
      "/tools/basic-auth-generator",
      "/tools/curl-to-fetch",
      "/tools/json-formatter"
    ]
  },
  {
    "slug": "json-to-rust",
    "title": "JSON to Rust Struct Converter",
    "description": "Generate Rust structs with Serde derives, renamed fields, nested models and Option types from JSON sample records.",
    "example": "[{\"userId\":1,\"profile\":{\"name\":\"Ada\"},\"tags\":[\"admin\"]},{\"userId\":2,\"profile\":null}]",
    "action": "Generate Rust",
    "extension": "rs",
    "kind": "text",
    "fields": [],
    "steps": [
      "Paste one JSON object or a non-empty array of sample objects.",
      "Generate Serde-ready structs inferred from all records.",
      "Review optional fields and mixed-value fallbacks, then add serde and serde_json to your Rust project."
    ],
    "sections": [
      {
        "heading": "Model JSON with explicit Rust types",
        "body": "The generator infers String, bool, i64 and f64, creates nested structs, and maps arrays to Vec. Null or missing fields become Option. Heterogeneous values that do not share one Rust representation use serde_json::Value. Serde rename attributes preserve original JSON keys even when field names must be normalized or disambiguated."
      },
      {
        "heading": "Review inference before using generated code",
        "body": "A sample cannot prove that a field is always required or that every future array has the same element shape. Empty arrays and null-only fields use a generic Value fallback. Integers outside JavaScript’s safe range are rejected to avoid silently emitting types from already rounded identifiers. The input array represents multiple examples of Root; deserialize an actual array as Vec<Root>. Missing and explicit null both map to None in this model."
      }
    ],
    "faq": {
      "question": "Does this preserve the difference between absent and null fields?",
      "answer": "No. Generated Option fields map both cases to None. Use a custom presence model when your API distinguishes them."
    },
    "related": [
      "/tools/json-to-python-dataclass",
      "/tools/json-to-go-struct",
      "/blog/rust-serde-json-mapping"
    ]
  },
  {
    "slug": "json-to-zod",
    "title": "JSON to Zod Schema Generator",
    "description": "Infer a Zod validation schema from JSON, including nested objects, arrays, unions, nullable values and fields missing in sample records.",
    "example": "[{\"id\":1,\"name\":\"Ada\",\"active\":true},{\"id\":2,\"name\":null}]",
    "action": "Generate Zod schema",
    "extension": "ts",
    "kind": "text",
    "fields": [
      {
        "key": "strict",
        "label": "Reject unknown object keys",
        "type": "checkbox",
        "default": "true"
      }
    ],
    "steps": [
      "Paste a JSON value or an array of representative records.",
      "Choose whether generated object schemas should reject unknown keys.",
      "Generate TypeScript code, install Zod in your own project, and refine validation rules before accepting production input."
    ],
    "sections": [
      {
        "heading": "Infer structure without guessing business rules",
        "body": "The generator uses observed primitive types and merges object shapes across array members. Keys absent from some samples become optional, while explicit null remains nullable. Mixed element types create unions, and empty arrays use z.unknown() for their elements. Strings stay strings: an example that resembles an email or date does not establish a validation contract."
      },
      {
        "heading": "Validate data at the boundary",
        "body": "The output imports Zod and exports schema plus an inferred TypeScript type. It does not add Zod to this website or run arbitrary generated code here. Review required fields, bounds and formats in your application. Strict mode rejects unknown keys; the normal z.object behavior strips unknown keys when parsing. The generated root follows the input shape, so a JSON array produces an array schema."
      }
    ],
    "faq": {
      "question": "Is a TypeScript interface enough to validate an API response?",
      "answer": "No. Type annotations are erased at runtime. A schema parser can check the actual response when your application receives it."
    },
    "related": [
      "/tools/json-to-typescript-interface",
      "/tools/json-schema-generator",
      "/blog/typescript-types-vs-runtime-validation"
    ]
  },
  {
    "slug": "css-clamp-calculator",
    "title": "CSS Clamp Calculator",
    "description": "Calculate fluid typography CSS from minimum and maximum font sizes and viewport widths, with rem bounds and the interpolation formula.",
    "example": "",
    "action": "Calculate clamp",
    "extension": "css",
    "kind": "design",
    "fields": [
      {
        "key": "minSize",
        "label": "Minimum font size (px)",
        "type": "number",
        "default": "16",
        "min": 1,
        "max": 256,
        "step": "any"
      },
      {
        "key": "maxSize",
        "label": "Maximum font size (px)",
        "type": "number",
        "default": "32",
        "min": 1,
        "max": 256,
        "step": "any"
      },
      {
        "key": "minViewport",
        "label": "Minimum viewport (px)",
        "type": "number",
        "default": "320",
        "min": 1,
        "max": 10000,
        "step": "any"
      },
      {
        "key": "maxViewport",
        "label": "Maximum viewport (px)",
        "type": "number",
        "default": "1280",
        "min": 1,
        "max": 10000,
        "step": "any"
      },
      {
        "key": "rootSize",
        "label": "Root font size (px)",
        "type": "number",
        "default": "16",
        "min": 1,
        "max": 128,
        "step": "any"
      }
    ],
    "steps": [
      "Enter font sizes at the narrow and wide ends of your design.",
      "Enter the corresponding viewport widths and expected root font size.",
      "Calculate the clamp declaration and verify the endpoint and midpoint values."
    ],
    "sections": [
      {
        "heading": "Derive the preferred value from two points",
        "body": "The fluid term is a straight line: slope equals the font-size difference divided by the viewport-width difference. Multiply the slope by 100 for the vw coefficient, then convert the pixel intercept to rem. The result includes rem minimum and maximum bounds and a calc expression for the preferred size. Equal font sizes produce a constant size."
      },
      {
        "heading": "Understand the root-size assumption",
        "body": "The formula matches your pixel endpoints at the root font size you provide. A different root size changes the rem terms; viewport terms still depend on viewport width. This is intentional for responsive type but does not prove accessibility. Test browser zoom and text enlargement, long headings, line wrapping and containers that may clip text. The calculator rejects reversed viewport ranges and decreasing size ranges rather than guessing your intent."
      }
    ],
    "faq": {
      "question": "Will this formula work for spacing too?",
      "answer": "Yes, the same interpolation can be used for compatible length properties. Review the generated bounds and replace font-size with the property you intend."
    },
    "related": [
      "/tools/px-to-rem",
      "/blog/css-clamp-formula",
      "/blog/responsive-type-with-rem"
    ]
  },
  {
    "slug": "robots-txt-generator",
    "title": "Robots.txt Generator",
    "description": "Create a robots.txt draft with crawler groups, disallowed paths and a sitemap URL, including clear allow-all and block-all modes.",
    "example": "/admin/\n/private/",
    "action": "Generate robots.txt",
    "extension": "txt",
    "kind": "text",
    "fields": [
      {
        "key": "mode",
        "label": "Crawler policy",
        "type": "select",
        "default": "custom",
        "options": [
          {
            "value": "custom",
            "label": "Disallow listed paths"
          },
          {
            "value": "allow",
            "label": "Allow all paths"
          },
          {
            "value": "block",
            "label": "Disallow all paths"
          }
        ]
      },
      {
        "key": "agent",
        "label": "User-agent",
        "type": "text",
        "default": "*"
      },
      {
        "key": "sitemap",
        "label": "Sitemap URL (optional)",
        "type": "text",
        "default": "https://example.com/sitemap.xml"
      }
    ],
    "steps": [
      "Choose the crawler policy and user-agent token.",
      "For custom policy, enter one disallowed root-relative path per line.",
      "Add your absolute sitemap URL, generate the file, and review it before placing it at your site root."
    ],
    "sections": [
      {
        "heading": "Generate crawler rules deliberately",
        "body": "A robots.txt file is a public instruction to cooperating crawlers. Custom mode adds Disallow rules for the listed paths, allow-all mode writes an empty Disallow rule, and block-all mode disallows the root path. Paths are case-sensitive and belong to the host serving the file. The generator emits one group and an optional Sitemap directive; it does not change this website’s own robots.txt."
      },
      {
        "heading": "Crawling, indexing and access are separate",
        "body": "Disallow prevents compliant crawling; it does not authenticate visitors or reliably remove a discovered URL from search. A noindex directive must be visible to the crawler, so blocking the page can prevent that directive from being read. Keep production assets needed for rendering crawlable and inspect deployed rules carefully, especially after moving a staging configuration to production."
      }
    ],
    "faq": {
      "question": "Can robots.txt keep a private admin page secret?",
      "answer": "No. The file is public and its rules do not enforce access control. Protect private routes with authentication and authorization."
    },
    "related": [
      "/tools/meta-tag-generator",
      "/blog/robots-txt-vs-noindex",
      "/blog/robots-txt-common-mistakes"
    ]
  },
  {
    "slug": "sql-in-clause-generator",
    "title": "SQL IN Clause Generator",
    "description": "Convert a line-separated list into a quoted SQL IN predicate or numbered PostgreSQL parameters, preserving identifiers and handling empty lists.",
    "example": "00123\n00456\nO'Brien",
    "action": "Generate IN clause",
    "extension": "sql",
    "kind": "text",
    "fields": [
      {
        "key": "column",
        "label": "Column name",
        "type": "text",
        "default": "customer_id"
      },
      {
        "key": "mode",
        "label": "Values",
        "type": "select",
        "default": "strings",
        "options": [
          {
            "value": "strings",
            "label": "Quoted text"
          },
          {
            "value": "integers",
            "label": "Integer literals"
          },
          {
            "value": "parameters",
            "label": "PostgreSQL parameters + values"
          }
        ]
      },
      {
        "key": "deduplicate",
        "label": "Remove exact duplicates",
        "type": "checkbox",
        "default": "true"
      }
    ],
    "steps": [
      "Paste one value per line; blank lines are ignored and surrounding whitespace is trimmed.",
      "Set the column name and choose text, integer or PostgreSQL parameter output.",
      "Generate and review the predicate; parameter mode also gives the ordered value array."
    ],
    "sections": [
      {
        "heading": "Build a predicate from a small lookup list",
        "body": "Text mode preserves leading zeros, apostrophes and backslashes through PostgreSQL escape-string literals. Integer mode validates the entire token and normalizes arbitrary-size integers without converting through a floating-point number. The column field is one quoted identifier, not an expression. Empty input produces FALSE instead of invalid IN () syntax. Values containing the word NULL remain strings in text mode."
      },
      {
        "heading": "Prefer parameters in application code",
        "body": "Parameter mode emits $1, $2 and so on plus a JSON array of string values to bind in the same order. Pass those values through your database driver instead of concatenating untrusted input. This tool targets PostgreSQL predicates and does not run SQL. A null column value follows SQL’s three-valued logic; this generator does not append IS NULL or invent null members from blank lines."
      }
    ],
    "faq": {
      "question": "Can I paste comma-separated values?",
      "answer": "Use one value per line. Commas can be part of a string and are preserved instead of being treated as separators."
    },
    "related": [
      "/tools/csv-to-sql",
      "/tools/sql-formatter",
      "/blog/sql-in-null-empty-list"
    ]
  },
  {
    "slug": "qr-code-generator",
    "title": "QR Code Generator",
    "description": "Create static QR codes for URLs or text and download crisp PNG or SVG files, with local generation and no account.",
    "kind": "graphic",
    "example": "https://example.com",
    "action": "Generate QR code",
    "extension": "svg",
    "fields": [
      {
        "key": "level",
        "label": "Error correction",
        "default": "M",
        "type": "select",
        "options": [
          {
            "value": "L",
            "label": "L"
          },
          {
            "value": "M",
            "label": "M"
          },
          {
            "value": "Q",
            "label": "Q"
          },
          {
            "value": "H",
            "label": "H"
          }
        ]
      },
      {
        "key": "size",
        "label": "PNG width (px)",
        "default": "512",
        "type": "number",
        "min": 128,
        "max": 2048
      }
    ],
    "steps": [
      "Paste a complete URL or the text you want to encode.",
      "Choose an error-correction level and PNG size.",
      "Generate, scan-test the preview, and download PNG or SVG."
    ],
    "sections": [
      {
        "heading": "Static codes keep the original content",
        "body": "The QR code stores the supplied text directly. It does not create a hosted redirect, require a subscription, or depend on this website after download. SVG stays sharp when scaled, while PNG has a fixed pixel size. A four-module white quiet zone and black modules are retained for reliable scanning."
      },
      {
        "heading": "Check the code in its final setting",
        "body": "Longer input and stronger error correction can require more modules. Increase the output size when a dense code is hard to scan. Scan the exported image at the intended print or display size before distributing it. The tool does not visit encoded URLs or verify the destination. The UI limits input to 1500 UTF-8 bytes; the QR encoder may reject content that exceeds the selected correction level’s capacity."
      }
    ],
    "faq": {
      "question": "Can I change a downloaded static QR code later?",
      "answer": "Its encoded content is fixed. Generate a new code when the text changes, or encode a stable URL whose destination you control."
    },
    "related": [
      "/tools/url-cleaner",
      "/tools/vcard-generator",
      "/tools/utm-builder"
    ],
    "modified": "2026-11-04"
  },
  {
    "slug": "image-cropper",
    "title": "Image Cropper",
    "description": "Crop PNG, JPEG and WebP images by a precise percentage rectangle and download a transparent PNG preview locally.",
    "kind": "image",
    "example": "",
    "action": "Crop image",
    "extension": "png",
    "fields": [
      {
        "key": "x",
        "label": "Left edge (%)",
        "default": "0",
        "type": "number",
        "min": 0,
        "max": 100,
        "step": "any"
      },
      {
        "key": "y",
        "label": "Top edge (%)",
        "default": "0",
        "type": "number",
        "min": 0,
        "max": 100,
        "step": "any"
      },
      {
        "key": "cropWidth",
        "label": "Crop width (%)",
        "default": "100",
        "type": "number",
        "min": 0.01,
        "max": 100,
        "step": "any"
      },
      {
        "key": "cropHeight",
        "label": "Crop height (%)",
        "default": "100",
        "type": "number",
        "min": 0.01,
        "max": 100,
        "step": "any"
      }
    ],
    "steps": [
      "Choose a PNG, JPEG or WebP image.",
      "Enter the crop rectangle as percentages of the original image; it must stay inside the source.",
      "Crop, inspect the result, and download PNG."
    ],
    "sections": [
      {
        "heading": "Crop a region without stretching it",
        "body": "Left and top specify where the rectangle starts, while width and height describe how much of the original canvas to keep. For example, left 25%, top 0%, width 50%, height 100% keeps the central vertical half. Coordinates are mapped to pixel edges and the output is not rescaled after cropping."
      },
      {
        "heading": "Know the output behavior",
        "body": "The crop preserves decoded transparency and exports PNG, which can be larger than the source JPEG or WebP. File size is a separate concern from pixel dimensions. The same 20 MiB file and 40-million-pixel limits as the other image tools apply. Source metadata and animation are not retained. Use image compression afterward if your delivery file needs fewer bytes."
      }
    ],
    "faq": {
      "question": "Does changing width stretch the cropped region?",
      "answer": "No. It changes the selected rectangle, then exports those pixels at the resulting dimensions."
    },
    "related": [
      "/tools/image-resizer",
      "/tools/image-rotate-flip",
      "/tools/image-compressor"
    ],
    "modified": "2026-11-04"
  },
  {
    "slug": "image-rotate-flip",
    "title": "Rotate and Flip Image",
    "description": "Rotate images by 90, 180 or 270 degrees, flip horizontally or vertically, and download the transformed PNG without uploading.",
    "kind": "image",
    "example": "",
    "action": "Transform image",
    "extension": "png",
    "fields": [
      {
        "key": "rotation",
        "label": "Rotation",
        "default": "90",
        "type": "select",
        "options": [
          {
            "value": "0",
            "label": "0° clockwise"
          },
          {
            "value": "90",
            "label": "90° clockwise"
          },
          {
            "value": "180",
            "label": "180° clockwise"
          },
          {
            "value": "270",
            "label": "270° clockwise"
          }
        ]
      },
      {
        "key": "flip",
        "label": "Flip before rotation",
        "default": "none",
        "type": "select",
        "options": [
          {
            "value": "none",
            "label": "No flip"
          },
          {
            "value": "horizontal",
            "label": "Horizontal"
          },
          {
            "value": "vertical",
            "label": "Vertical"
          },
          {
            "value": "both",
            "label": "Horizontal and vertical"
          }
        ]
      }
    ],
    "steps": [
      "Choose a PNG, JPEG or WebP image.",
      "Set the clockwise rotation and optional mirror operation.",
      "Inspect the preview and download the transformed PNG."
    ],
    "sections": [
      {
        "heading": "Use right-angle rotation without clipping",
        "body": "Quarter-turn rotations swap width and height so the full image remains on the canvas. Horizontal and vertical flips are applied in the source image’s axes before rotation. Combining both flips is equivalent to a half turn before the chosen rotation. The tool does not guess a new orientation from image content."
      },
      {
        "heading": "Preserve a clean working copy",
        "body": "The browser decodes source orientation and the canvas exports the resulting pixels as PNG. Alpha transparency is retained. This is an image transformation, not a promise to shrink the file; a PNG can be larger than a lossy source. Metadata and animation are not preserved. Keep your original file when its EXIF or other source information matters."
      }
    ],
    "faq": {
      "question": "Is horizontal flip the same as rotating 180 degrees?",
      "answer": "No. Horizontal flip mirrors left and right. A 180-degree rotation changes both horizontal and vertical orientation."
    },
    "related": [
      "/tools/image-cropper",
      "/tools/image-resizer",
      "/tools/image-format-converter"
    ],
    "modified": "2026-11-04"
  },
  {
    "slug": "favicon-generator",
    "title": "Favicon Generator",
    "description": "Generate a multi-size favicon.ico plus PNG browser, Apple touch and PWA icons from a local image, with a downloadable ZIP.",
    "kind": "image",
    "example": "",
    "action": "Generate icons",
    "extension": "zip",
    "fields": [
      {
        "key": "fit",
        "label": "Image fitting",
        "default": "contain",
        "type": "select",
        "options": [
          {
            "value": "contain",
            "label": "Contain entire image"
          },
          {
            "value": "cover",
            "label": "Center crop to square"
          }
        ]
      },
      {
        "key": "padding",
        "label": "Inner padding (%)",
        "default": "10",
        "type": "number",
        "min": 0,
        "max": 40
      }
    ],
    "steps": [
      "Choose a PNG, JPEG or WebP source, ideally at least 512 pixels square.",
      "Choose contain or center-crop fitting and optional inner padding.",
      "Generate the ICO and PNG files, download the ZIP, and use the supplied HTML and manifest snippets."
    ],
    "sections": [
      {
        "heading": "Prepare the standard icon sizes together",
        "body": "The package includes PNGs at 16, 32, 180, 192 and 512 pixels, an ICO containing 16-, 32- and 48-pixel PNG layers, a web manifest draft and an HTML head snippet. Every icon uses a square transparent canvas. Contain fitting keeps the whole source; cover fills the inner square and may crop edges."
      },
      {
        "heading": "Review small icons and application metadata",
        "body": "A detailed logo can become unreadable at 16 pixels, so inspect the smallest preview before publishing. Upscaling cannot recover missing detail. The included manifest uses placeholder app names that you should edit. Icons are marked for ordinary use, not as guaranteed maskable artwork. Browser support and caching of ICO variants vary; the PNG links provide explicit alternatives."
      }
    ],
    "faq": {
      "question": "Does this add the icons to my website automatically?",
      "answer": "No. Download the package, place the files at the intended paths, and update your site’s HTML and manifest deliberately."
    },
    "related": [
      "/tools/image-resizer",
      "/tools/svg-to-png",
      "/tools/meta-tag-generator"
    ],
    "modified": "2026-11-04"
  },
  {
    "slug": "svg-to-png",
    "title": "SVG to PNG Converter",
    "description": "Rasterize a self-contained static SVG into PNG at a chosen size, with transparent or white background and a local preview.",
    "kind": "graphic",
    "example": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 120 80\"><rect width=\"120\" height=\"80\" rx=\"12\" fill=\"#6366f1\"/><circle cx=\"60\" cy=\"40\" r=\"22\" fill=\"white\"/></svg>",
    "action": "Convert SVG to PNG",
    "extension": "png",
    "fields": [
      {
        "key": "width",
        "label": "PNG width (px)",
        "default": "1200",
        "type": "number",
        "min": 1,
        "max": 4096
      },
      {
        "key": "height",
        "label": "PNG height (px)",
        "default": "800",
        "type": "number",
        "min": 1,
        "max": 4096
      },
      {
        "key": "background",
        "label": "Background",
        "default": "transparent",
        "type": "select",
        "options": [
          {
            "value": "transparent",
            "label": "Transparent"
          },
          {
            "value": "white",
            "label": "White"
          }
        ]
      }
    ],
    "steps": [
      "Paste a complete SVG document with a viewBox or numeric dimensions.",
      "Choose PNG dimensions and a background.",
      "Convert, inspect the fitted image, and download PNG."
    ],
    "sections": [
      {
        "heading": "Rasterize vector artwork at an explicit size",
        "body": "The SVG is fitted inside the target canvas with its aspect ratio preserved. A larger PNG contains more pixels, while the original SVG remains the editable vector source. Transparent output retains the canvas alpha channel; white output paints an opaque white background first. The output dimensions are limited to 4096 per side."
      },
      {
        "heading": "Use self-contained static SVG input",
        "body": "The converter accepts ordinary SVG geometry, text, gradients and local fragment references. It rejects scripts, event handlers, animation, foreignObject, embedded images, style elements, external links and external URL references. Supply a viewBox when the artwork uses percentage dimensions. System fonts may differ across devices; convert text to paths in your design application when exact lettering is required."
      }
    ],
    "faq": {
      "question": "Can this load fonts or images from an external URL?",
      "answer": "No. Keep the SVG self-contained. External references are rejected rather than fetched."
    },
    "related": [
      "/tools/svg-optimizer",
      "/tools/image-format-converter",
      "/tools/favicon-generator"
    ],
    "modified": "2026-11-04"
  },
  {
    "slug": "json-patch-tester",
    "title": "JSON Patch Tester",
    "description": "Apply RFC 6902 add, remove, replace, move, copy and test operations to a JSON document, with pointer validation and atomic results.",
    "kind": "text",
    "example": "{\"name\":\"Ada\",\"tags\":[\"reader\"],\"active\":false}",
    "action": "Apply JSON Patch",
    "extension": "json",
    "fields": [],
    "steps": [
      "Paste the source document and a JSON Patch operation array into the two editors.",
      "Apply the patch; invalid paths and failed test operations report their operation number.",
      "Copy the complete result only after every operation succeeds."
    ],
    "sections": [
      {
        "heading": "Test ordered changes before sending an API request",
        "body": "JSON Patch expresses a sequence of operations, each using a JSON Pointer path. Array insertion can use the final dash token to append. Copy duplicates a value, while move removes the source before resolving the destination. Test compares JSON values structurally, so object key order does not create a false mismatch."
      },
      {
        "heading": "Failure does not expose a half-applied result",
        "body": "The tool works on a fresh copy and returns output only if the entire operation list succeeds. Missing parents, malformed pointer escapes, invalid array indexes and attempts to move a value into its own descendant are rejected. The source input is left intact. Numbers use the browser’s JSON number representation. This is an operation tester, not a generator that infers a patch from two documents."
      }
    ],
    "faq": {
      "question": "How is JSON Patch different from JSON Merge Patch?",
      "answer": "JSON Patch is an ordered operation array with explicit paths. Merge Patch uses an object-shaped update where null removes a property and arrays are replaced as a whole."
    },
    "related": [
      "/tools/json-merge-patch",
      "/tools/json-diff",
      "/blog/json-pointer-explained"
    ],
    "modified": "2026-11-04",
    "exampleB": "[{\"op\":\"replace\",\"path\":\"/active\",\"value\":true},{\"op\":\"add\",\"path\":\"/tags/-\",\"value\":\"editor\"}]",
    "inputLabel": "Source JSON",
    "secondInputLabel": "JSON Patch operations"
  },
  {
    "slug": "json-merge-patch",
    "title": "JSON Merge Patch Tool",
    "description": "Apply RFC 7396 merge patches to JSON: update nested objects, remove properties with null and replace arrays atomically.",
    "kind": "text",
    "example": "{\"name\":\"Ada\",\"preferences\":{\"theme\":\"dark\",\"legacy\":true},\"tags\":[\"reader\"]}",
    "action": "Apply merge patch",
    "extension": "json",
    "fields": [],
    "steps": [
      "Paste the original JSON and the merge patch in separate editors.",
      "Apply the patch and inspect removed properties and replaced arrays.",
      "Copy or download the merged JSON without changing the source text."
    ],
    "sections": [
      {
        "heading": "Use object-shaped partial updates",
        "body": "An object merge patch visits each supplied property. A null patch value removes that property, while an object value recursively updates the corresponding target. A scalar or array replaces the entire target at that location. A non-object patch at the root replaces the whole document. Missing properties in the patch leave their target values alone."
      },
      {
        "heading": "Choose a patch format that matches the operation",
        "body": "Merge Patch cannot use a null member to assign an explicit null object property, because null is its removal instruction. Arrays are replaced rather than edited by index. Use JSON Patch when you need those distinctions or individual array operations. This tool follows the merge algorithm and does not infer your application’s authorization or schema rules."
      }
    ],
    "faq": {
      "question": "Can I append one array element with Merge Patch?",
      "answer": "Not by an index operation. Supply the complete replacement array, or use a JSON Patch add operation for a single append."
    },
    "related": [
      "/tools/json-patch-tester",
      "/tools/json-diff",
      "/tools/json-validator"
    ],
    "modified": "2026-11-04",
    "exampleB": "{\"preferences\":{\"theme\":\"light\",\"legacy\":null},\"tags\":[\"reader\",\"editor\"]}",
    "inputLabel": "Original JSON",
    "secondInputLabel": "Merge patch"
  },
  {
    "slug": "vcard-generator",
    "title": "vCard Contact Generator",
    "description": "Create a downloadable vCard 4.0 contact file with name, phone, email, organization and website, using proper text escaping and UTF-8 folding.",
    "kind": "design",
    "example": "",
    "action": "Generate vCard",
    "extension": "vcf",
    "fields": [
      {
        "key": "first",
        "label": "Given name",
        "default": "Ada",
        "type": "text"
      },
      {
        "key": "last",
        "label": "Family name",
        "default": "Lovelace",
        "type": "text"
      },
      {
        "key": "company",
        "label": "Organization",
        "default": "Example Studio",
        "type": "text"
      },
      {
        "key": "title",
        "label": "Job title",
        "default": "Developer",
        "type": "text"
      },
      {
        "key": "email",
        "label": "Email",
        "default": "ada@example.com",
        "type": "text"
      },
      {
        "key": "phone",
        "label": "Phone",
        "default": "+44 20 7946 0000",
        "type": "text"
      },
      {
        "key": "url",
        "label": "Website (optional)",
        "default": "https://example.com",
        "type": "text"
      }
    ],
    "steps": [
      "Enter the contact details you intend to share.",
      "Generate and inspect the vCard text.",
      "Download the .vcf file and import it into a contact application that supports vCard 4.0."
    ],
    "sections": [
      {
        "heading": "Share a contact as a structured file",
        "body": "The output includes a formatted name, structured name components and optional organization, title, email, phone and URL. UTF-8 text is escaped for the vCard syntax and long content lines are folded without splitting a Unicode code point. The phone field uses text semantics to preserve your supplied formatting rather than guessing an international dialing plan."
      },
      {
        "heading": "Review compatibility and private details",
        "body": "Different contact applications implement vCard versions differently; this tool emits version 4.0. Check the imported contact on the devices you intend to use. It does not verify mailbox ownership or phone reachability, and it does not send contact data to an address book service. Remove details you do not want recipients to receive before downloading or sharing the file."
      }
    ],
    "faq": {
      "question": "Does downloading a vCard send a message to the contact?",
      "answer": "No. It creates a local contact file. Importing or sharing that file is a separate action."
    },
    "related": [
      "/tools/qr-code-generator",
      "/tools/email-extractor",
      "/tools/unicode-escape"
    ],
    "modified": "2026-11-04"
  },
  {
    "slug": "icalendar-generator",
    "title": "iCalendar Event Generator",
    "description": "Create a downloadable .ics calendar event with explicit timezone offsets, UTC timestamps, location and description, without sending invitations.",
    "kind": "text",
    "example": "Discuss the launch checklist and next steps.",
    "action": "Generate calendar event",
    "extension": "ics",
    "fields": [
      {
        "key": "title",
        "label": "Event title",
        "default": "Project check-in",
        "type": "text"
      },
      {
        "key": "start",
        "label": "Start (ISO time with Z or offset)",
        "default": "2026-11-10T10:00:00Z",
        "type": "text"
      },
      {
        "key": "end",
        "label": "End (ISO time with Z or offset)",
        "default": "2026-11-10T10:30:00Z",
        "type": "text"
      },
      {
        "key": "location",
        "label": "Location",
        "default": "Online",
        "type": "text"
      },
      {
        "key": "uid",
        "label": "Event UID (optional, reuse to identify the same event)",
        "default": "",
        "type": "text"
      }
    ],
    "steps": [
      "Enter start and end times with Z or an explicit offset such as +02:00.",
      "Set a title, location and description; optionally supply a stable event UID.",
      "Generate the .ics file and import it into your calendar application."
    ],
    "sections": [
      {
        "heading": "Use an unambiguous instant for each endpoint",
        "body": "The generator validates the calendar date as well as the offset, converts both endpoints to UTC, and requires the end to follow the start. It writes a single timed VEVENT with a UID and creation timestamp. It does not guess your local timezone, schedule recurrence, or create an all-day event."
      },
      {
        "heading": "A file is different from an invitation workflow",
        "body": "The output has no attendee list and is not sent to any calendar service. Importing it is your choice. A blank UID creates a new event identity each time you generate; provide the same UID when you intend files to refer to the same event, while checking how your calendar handles re-imports. Description and location are escaped, and UTF-8 content lines are folded for interchange."
      }
    ],
    "faq": {
      "question": "Will the event show in the recipient’s timezone?",
      "answer": "The file stores UTC instants. Calendar applications normally display those instants in the viewer’s configured timezone."
    },
    "related": [
      "/tools/date-to-unix-timestamp",
      "/tools/time-duration-converter",
      "/tools/cron-parser"
    ],
    "modified": "2026-11-04",
    "inputLabel": "Event description"
  },
  {
    "slug": "url-cleaner",
    "title": "URL Tracking Parameter Remover",
    "description": "Remove common tracking parameters such as utm_*, fbclid and gclid from URLs while keeping unrelated query values and fragments by default.",
    "kind": "text",
    "example": "https://example.com/product?id=123&utm_source=newsletter&fbclid=abc#details",
    "action": "Clean URLs",
    "extension": "txt",
    "fields": [
      {
        "key": "extra",
        "label": "Additional parameter names (comma separated)",
        "default": "",
        "type": "text"
      },
      {
        "key": "fragment",
        "label": "Also remove #fragment",
        "default": "false",
        "type": "checkbox"
      }
    ],
    "steps": [
      "Paste one absolute HTTP or HTTPS URL per line.",
      "Optionally add parameter names to remove and choose whether fragments should be dropped.",
      "Clean the links and inspect them before sharing or replacing stored URLs."
    ],
    "sections": [
      {
        "heading": "Remove a conservative tracking list",
        "body": "The default list covers UTM names and common advertising or campaign identifiers including fbclid, gclid, dclid, msclkid, igshid, mc_cid, mc_eid, _ga, _gl and yclid. Parameter-name matching is case-insensitive. All occurrences of a matching name are removed, while repeated unrelated values keep their order. The tool does not visit the links."
      },
      {
        "heading": "Preserve application behavior deliberately",
        "body": "Not every query parameter is tracking. Product IDs, search terms, signed URL credentials and application routing data may be required for a link to work. Custom removal is your explicit choice, and the fragment stays unless selected for removal. URLs changed by the browser serializer may use a different but equivalent query encoding. Signed links can be invalidated by any modification, so do not assume cleaning preserves a signature."
      }
    ],
    "faq": {
      "question": "Does this bypass a redirect or reveal the final URL?",
      "answer": "No. It only edits the pasted URL locally and does not follow redirects or make network requests."
    },
    "related": [
      "/tools/utm-builder",
      "/tools/url-parser",
      "/tools/url-extractor"
    ],
    "modified": "2026-11-04"
  },
  {
    "slug": "json-to-csharp",
    "title": "JSON to C# Class Converter",
    "description": "Generate C# 11 model classes for System.Text.Json with nested types, JsonPropertyName attributes, required properties and nullable fields.",
    "kind": "text",
    "example": "[{\"user_id\":1,\"profile\":{\"name\":\"Ada\"},\"tags\":[\"admin\"]},{\"user_id\":2,\"profile\":null}]",
    "action": "Generate C#",
    "extension": "cs",
    "fields": [],
    "steps": [
      "Paste one JSON object or a non-empty array of representative objects.",
      "Generate classes inferred from every record, including missing and null fields.",
      "Use C# 11 and .NET 7 or later, then review the generated contract before deserializing production responses."
    ],
    "sections": [
      {
        "heading": "Preserve wire names with typed properties",
        "body": "The generator creates PascalCase C# properties and explicit JsonPropertyName attributes, so unusual JSON names remain mapped to their exact wire keys. Nested objects become classes, arrays become List, integer samples choose int or long, and fractional samples choose double. Mixed values fall back to JsonElement rather than inventing a misleading single type."
      },
      {
        "heading": "Presence and nullability have different meanings",
        "body": "A property seen in every sample uses the required modifier, including when its value can be null. A property missing from some samples is nullable and not required. Required presence does not by itself forbid null, and annotations do not replace domain validation. Input arrays represent sample Root records; deserialize actual arrays as List<Root>. Empty arrays cannot establish an object model, and unsafe integer samples are rejected."
      }
    ],
    "faq": {
      "question": "Does required guarantee that a string is nonempty?",
      "answer": "No. It requires a property to be present during supported System.Text.Json deserialization. Validate null, length and business rules separately."
    },
    "related": [
      "/tools/json-to-typescript-interface",
      "/tools/json-to-kotlin",
      "/tools/json-schema-generator"
    ],
    "modified": "2026-11-04"
  },
  {
    "slug": "json-to-kotlin",
    "title": "JSON to Kotlin Data Class Converter",
    "description": "Generate Kotlin models for kotlinx.serialization with nested classes, SerialName mappings, nullable types and defaults for missing fields.",
    "kind": "text",
    "example": "[{\"user_id\":1,\"profile\":{\"name\":\"Ada\"},\"tags\":[\"admin\"]},{\"user_id\":2,\"profile\":null}]",
    "action": "Generate Kotlin",
    "extension": "kt",
    "fields": [],
    "steps": [
      "Paste a JSON object or a non-empty array of example objects.",
      "Generate Kotlin models using every example to infer missing and nullable properties.",
      "Configure the Kotlin serialization plugin and kotlinx-serialization-json in your own project before using the generated classes."
    ],
    "sections": [
      {
        "heading": "Model the response without renaming its JSON keys",
        "body": "Properties use generated camelCase names and SerialName annotations to retain the original key. Strings, booleans, Int, Long, Double and List types are inferred from samples. Nested objects receive their own serializable model. Mixed shapes use JsonElement, and empty objects use an ordinary class because Kotlin data classes require at least one constructor property."
      },
      {
        "heading": "Keep required-nullable and missing fields distinct",
        "body": "A field that is present with null is nullable but still has no default when all samples contain it. A field absent from some records gets a nullable type with a default of null. These are sample-derived choices, not a complete API specification. Strings resembling dates stay String. Review enum constraints and validation separately, and keep numeric IDs as strings when they exceed safe browser JSON integer precision."
      }
    ],
    "faq": {
      "question": "Does this configure Gradle or the serialization compiler plugin?",
      "answer": "No. It generates model source. Your project must supply the serialization plugin and libraries appropriate to its Kotlin version."
    },
    "related": [
      "/tools/json-to-csharp",
      "/tools/json-to-rust",
      "/tools/json-to-python-dataclass"
    ],
    "modified": "2026-11-04"
  },
  {
    "slug": "csv-column-extractor",
    "title": "CSV Column Extractor",
    "description": "Select and reorder named CSV columns while preserving quoted commas, multiline cells, leading zeros and header spelling.",
    "kind": "text",
    "example": "name,email,city\nAda,ada@example.com,London\nGrace,grace@example.com,New York",
    "action": "Extract columns",
    "extension": "csv",
    "fields": [
      {
        "key": "columns",
        "label": "Column names as a JSON array",
        "default": "[\"name\",\"email\"]",
        "type": "text"
      },
      {
        "key": "delimiter",
        "label": "Input delimiter",
        "default": ",",
        "type": "select",
        "options": [
          {
            "value": ",",
            "label": "Comma"
          },
          {
            "value": ";",
            "label": "Semicolon"
          },
          {
            "value": "\t",
            "label": "Tab"
          }
        ]
      }
    ],
    "steps": [
      "Paste CSV with a unique, non-empty header row.",
      "Enter the exact desired column names as a JSON array, in output order.",
      "Extract the columns and copy or download the comma-separated result."
    ],
    "sections": [
      {
        "heading": "Select fields without corrupting cell boundaries",
        "body": "This tool parses the CSV rather than splitting text at every comma. Quoted delimiters, doubled quotes and embedded line breaks remain part of their original cells. The selector is a JSON array so a header containing a comma can be selected unambiguously. Matching includes header whitespace and case; the tool does not silently rename columns."
      },
      {
        "heading": "Use an explicit output order",
        "body": "Selected names determine output order, and repeated or unknown names are rejected. Every source row must match the header width. Values remain strings, including empty cells and IDs with leading zeros. Output uses comma-separated CSV with proper quoting regardless of input delimiter. The tool does not import XLSX workbooks, infer data types or run spreadsheet formulas."
      }
    ],
    "faq": {
      "question": "How do I select a header that contains a comma?",
      "answer": "Include it as one JSON string, for example [\"city, state\",\"email\"]. The comma inside the quoted name is not a separator between selected fields."
    },
    "related": [
      "/tools/csv-to-json",
      "/tools/csv-transpose",
      "/tools/csv-deduplicate"
    ],
    "modified": "2026-11-04"
  },
  {
    "slug": "csv-transpose",
    "title": "Transpose CSV",
    "description": "Swap CSV rows and columns with correct quoting for multiline cells, empty values and embedded delimiters.",
    "kind": "text",
    "example": "metric,Ada,Grace\nscore,98,99\ncity,London,New York",
    "action": "Transpose CSV",
    "extension": "csv",
    "fields": [
      {
        "key": "delimiter",
        "label": "Input delimiter",
        "default": ",",
        "type": "select",
        "options": [
          {
            "value": ",",
            "label": "Comma"
          },
          {
            "value": ";",
            "label": "Semicolon"
          },
          {
            "value": "\t",
            "label": "Tab"
          }
        ]
      }
    ],
    "steps": [
      "Paste a rectangular CSV table and select its delimiter.",
      "Transpose to exchange every row index with its column index.",
      "Copy or download the resulting comma-separated table."
    ],
    "sections": [
      {
        "heading": "Treat the whole input as a matrix",
        "body": "Every cell participates in transposition, including the first row. The tool does not assume that headers should be removed or treated as a special data type. A three-row, four-column input becomes four rows and three columns. Empty cells are retained and quoted content is parsed before rows and columns are exchanged."
      },
      {
        "heading": "Review dimensions and import behavior",
        "body": "Rows must have equal width; irregular input is rejected instead of padded silently. The tool caps work at 50,000 cells to keep browser processing manageable. Output uses commas and quotes cells when necessary. Transposing twice restores the cell matrix, although newline style and quoting may be normalized. Spreadsheet applications may still apply their own type conversion when importing the result."
      }
    ],
    "faq": {
      "question": "Does the first row stay at the top?",
      "answer": "No. The first row becomes the first column. Header cells are transposed like any other cells."
    },
    "related": [
      "/tools/csv-column-extractor",
      "/tools/csv-to-markdown",
      "/tools/tsv-to-json"
    ],
    "modified": "2026-11-04"
  },
  {
    "slug": "csv-deduplicate",
    "title": "CSV Duplicate Row Remover",
    "description": "Remove duplicate CSV records by selected key columns or whole-row identity, keeping the first or last occurrence with explicit matching rules.",
    "kind": "text",
    "example": "name,email,city\nAda,ada@example.com,London\nAda Updated,ada@example.com,Oxford\nGrace,grace@example.com,New York",
    "action": "Remove duplicates",
    "extension": "csv",
    "fields": [
      {
        "key": "keys",
        "label": "Key columns as JSON array; [] means all columns",
        "default": "[\"email\"]",
        "type": "text"
      },
      {
        "key": "keep",
        "label": "Occurrence to keep",
        "default": "first",
        "type": "select",
        "options": [
          {
            "value": "first",
            "label": "First"
          },
          {
            "value": "last",
            "label": "Last"
          }
        ]
      },
      {
        "key": "trim",
        "label": "Trim key values for matching",
        "default": "true",
        "type": "checkbox"
      },
      {
        "key": "ignoreCase",
        "label": "Ignore case in key values",
        "default": "false",
        "type": "checkbox"
      },
      {
        "key": "delimiter",
        "label": "Input delimiter",
        "default": ",",
        "type": "select",
        "options": [
          {
            "value": ",",
            "label": "Comma"
          },
          {
            "value": ";",
            "label": "Semicolon"
          },
          {
            "value": "\t",
            "label": "Tab"
          }
        ]
      }
    ],
    "steps": [
      "Paste CSV with unique headers and choose key columns.",
      "Set matching rules and decide whether the first or last matching record survives.",
      "Remove duplicates, then review the retained rows before replacing the source export."
    ],
    "sections": [
      {
        "heading": "Record identity is a deliberate choice",
        "body": "Two rows can differ in display name while referring to the same email or customer ID. Select the fields that establish identity for your dataset. An empty key array compares every column. Composite keys use an unambiguous tuple representation rather than a joined string, so delimiters inside cell values cannot cause accidental collisions."
      },
      {
        "heading": "Preserve original values in the retained rows",
        "body": "Trimming and case folding affect matching only; retained cell contents and header spelling stay unchanged. First mode preserves first-occurrence order. Last mode retains the last record for each key and orders those survivors by their positions in the source. Empty key values participate like ordinary values, so decide whether that behavior fits your dataset. Quoted multiline CSV is supported."
      }
    ],
    "faq": {
      "question": "Is this the same as removing duplicate text lines?",
      "answer": "No. It compares parsed CSV records and selected cell values, so quoted newlines and delimiter characters do not split a record incorrectly."
    },
    "related": [
      "/tools/remove-duplicate-lines",
      "/tools/csv-column-extractor",
      "/tools/list-compare"
    ],
    "modified": "2026-11-04"
  },
  {
    "slug": "cron-expression-generator",
    "title": "Cron Expression Generator",
    "description": "Build five-field Unix cron schedules for intervals, daily runs, weekdays, weekly or monthly jobs, with validated custom numeric fields.",
    "kind": "design",
    "example": "",
    "action": "Generate cron",
    "extension": "txt",
    "fields": [
      {
        "key": "preset",
        "label": "Schedule",
        "default": "weekdays",
        "type": "select",
        "options": [
          {
            "value": "interval",
            "label": "Every N minutes"
          },
          {
            "value": "daily",
            "label": "Daily"
          },
          {
            "value": "weekdays",
            "label": "Weekdays"
          },
          {
            "value": "weekly",
            "label": "Weekly"
          },
          {
            "value": "monthly",
            "label": "Monthly"
          },
          {
            "value": "custom",
            "label": "Custom fields"
          }
        ]
      },
      {
        "key": "interval",
        "label": "Interval in minutes",
        "default": "15",
        "type": "number",
        "min": 1,
        "max": 59
      },
      {
        "key": "minute",
        "label": "Minute",
        "default": "0",
        "type": "number",
        "min": 0,
        "max": 59
      },
      {
        "key": "hour",
        "label": "Hour",
        "default": "9",
        "type": "number",
        "min": 0,
        "max": 23
      },
      {
        "key": "weekday",
        "label": "Weekly day",
        "default": "1",
        "type": "select",
        "options": [
          {
            "value": "0",
            "label": "Sunday"
          },
          {
            "value": "1",
            "label": "Monday"
          },
          {
            "value": "2",
            "label": "Tuesday"
          },
          {
            "value": "3",
            "label": "Wednesday"
          },
          {
            "value": "4",
            "label": "Thursday"
          },
          {
            "value": "5",
            "label": "Friday"
          },
          {
            "value": "6",
            "label": "Saturday"
          }
        ]
      },
      {
        "key": "monthday",
        "label": "Monthly day",
        "default": "1",
        "type": "number",
        "min": 1,
        "max": 31
      },
      {
        "key": "customMinute",
        "label": "Custom minute",
        "default": "*",
        "type": "text"
      },
      {
        "key": "customHour",
        "label": "Custom hour",
        "default": "*",
        "type": "text"
      },
      {
        "key": "customDay",
        "label": "Custom day of month",
        "default": "*",
        "type": "text"
      },
      {
        "key": "customMonth",
        "label": "Custom month",
        "default": "*",
        "type": "text"
      },
      {
        "key": "customWeekday",
        "label": "Custom weekday",
        "default": "*",
        "type": "text"
      }
    ],
    "steps": [
      "Choose a preset and fill the relevant interval or clock fields.",
      "For custom schedules, use numeric values, lists, ranges and steps in the five fields.",
      "Generate the expression and inspect it with the linked cron parser before configuring your scheduler."
    ],
    "sections": [
      {
        "heading": "Generate the common Unix five-field format",
        "body": "The fields are minute, hour, day of month, month and weekday. Presets generate expressions directly, while custom mode validates numeric ranges and step syntax. Sunday is 0 or 7 in custom mode. A minute step starts at zero within each hour; an interval that does not divide 60 is not a continuously spaced elapsed-time timer across hour boundaries."
      },
      {
        "heading": "The scheduler decides timezone and execution policy",
        "body": "This tool does not install a job or promise an execution time. Use the timezone and daylight-saving behavior documented by your scheduler. Monthly dates such as the 31st skip shorter months. Restricting both day-of-month and weekday can use OR semantics in traditional cron. Quartz, AWS and other extended formats can differ and are outside this five-field generator."
      }
    ],
    "faq": {
      "question": "Can I paste this directly into every cloud scheduler?",
      "answer": "Check its documented dialect first. This generator emits Unix five-field expressions, not Quartz or six-field provider-specific schedules."
    },
    "related": [
      "/tools/cron-parser",
      "/tools/time-duration-converter",
      "/tools/date-to-unix-timestamp"
    ],
    "modified": "2026-11-04"
  },
  {
    "slug": "bcrypt-generator",
    "title": "Bcrypt Hash Generator and Checker",
    "description": "Generate salted bcrypt hashes or verify a password against an existing bcrypt hash locally, with UTF-8 length and cost validation.",
    "kind": "graphic",
    "example": "demo-password",
    "action": "Generate bcrypt hash",
    "extension": "txt",
    "fields": [
      {
        "key": "mode",
        "label": "Operation",
        "default": "hash",
        "type": "select",
        "options": [
          {
            "value": "hash",
            "label": "Generate a hash"
          },
          {
            "value": "verify",
            "label": "Check a password"
          }
        ]
      },
      {
        "key": "cost",
        "label": "Generation cost (4–12)",
        "default": "10",
        "type": "number",
        "min": 4,
        "max": 12
      }
    ],
    "steps": [
      "Enter a test password or password you are authorized to process.",
      "Choose generation and a cost, or verification and an existing hash.",
      "Run locally and copy the hash or inspect the match result."
    ],
    "sections": [
      {
        "heading": "Salted password hashing is intentionally different",
        "body": "A fresh hash includes a random salt, so hashing the same password twice normally produces different strings. Verification uses the salt and cost embedded in the supplied hash. The tool uses the existing bcryptjs library asynchronously in the browser and does not contact an authentication service or attempt password guessing."
      },
      {
        "heading": "Reject silent truncation and runaway costs",
        "body": "Bcrypt handles only the first 72 UTF-8 bytes of a password. This tool rejects longer input instead of silently truncating it. Generation costs are limited to 4–12 for an interactive browser task, and verification rejects encoded costs above 14 to bound local work. Cost selection still needs benchmarking in the system where hashes will be used; this tool does not prescribe a production password-storage policy."
      }
    ],
    "faq": {
      "question": "Can a bcrypt hash be decoded into a password?",
      "answer": "No. The checker compares a supplied candidate with the hash; it does not recover the original password."
    },
    "related": [
      "/tools/password-generator",
      "/tools/hash-generator",
      "/blog/md5-vs-sha256"
    ],
    "modified": "2026-11-04"
  },
  {
    "slug": "html-link-extractor",
    "title": "HTML Link Extractor",
    "description": "Extract real HTML anchor URLs with link text, rel attributes and same-origin classification, resolving relative paths against an explicit base URL.",
    "kind": "text",
    "example": "<a href=\"/docs\">Documentation</a>\n<a href=\"https://other.example/\" rel=\"nofollow noopener\">Partner</a>",
    "action": "Extract links",
    "extension": "json",
    "fields": [
      {
        "key": "base",
        "label": "Base page URL",
        "default": "https://example.com/start",
        "type": "text"
      },
      {
        "key": "unique",
        "label": "Keep first occurrence of each resolved URL",
        "default": "true",
        "type": "checkbox"
      }
    ],
    "steps": [
      "Paste HTML containing a or area elements with href attributes.",
      "Set the page URL used to resolve relative references.",
      "Extract HTTP(S) links as structured JSON and review their labels and attributes."
    ],
    "sections": [
      {
        "heading": "Use markup semantics rather than a URL regex",
        "body": "The tool parses an inert HTML template, decodes character references in href values, and resolves relative and protocol-relative links against the supplied base. It exports link text or area alt text, resolved URL, rel tokens, target and a nofollow flag. URL candidates outside real anchor elements are not included."
      },
      {
        "heading": "Classify origins without visiting destinations",
        "body": "A same-origin label means the resolved scheme, host and port match the supplied base origin. It is not a statement about ownership, trust or ranking. Non-HTTP schemes are skipped. Embedded base tags are ignored in favor of your explicit input. Deduplication retains the first resolved URL and its label. The tool does not execute scripts, apply external CSS or check whether destinations exist."
      }
    ],
    "faq": {
      "question": "How is this different from the URL Extractor?",
      "answer": "The URL Extractor scans plain text. This tool reads actual HTML anchors, resolves relative links and retains anchor metadata."
    },
    "related": [
      "/tools/url-extractor",
      "/tools/url-cleaner",
      "/tools/html-to-text"
    ],
    "modified": "2026-11-04"
  },
  {
    "slug": "ipv4-to-decimal",
    "title": "IPv4 to Decimal Converter",
    "description": "Convert dotted IPv4 addresses to unsigned 32-bit decimal values and back, with hexadecimal and binary representations.",
    "kind": "text",
    "example": "192.168.1.1",
    "action": "Convert IPv4",
    "extension": "json",
    "fields": [
      {
        "key": "direction",
        "label": "Input form",
        "default": "ip",
        "type": "select",
        "options": [
          {
            "value": "ip",
            "label": "Dotted IPv4"
          },
          {
            "value": "decimal",
            "label": "Unsigned decimal integer"
          }
        ]
      }
    ],
    "steps": [
      "Enter one dotted IPv4 address or an unsigned decimal integer.",
      "Select the input form and convert.",
      "Copy the JSON containing dotted decimal, unsigned integer, hex and binary forms."
    ],
    "sections": [
      {
        "heading": "Treat the address as four ordered bytes",
        "body": "Each dotted octet must be an integer from 0 to 255. The converter combines bytes in network order, with the first octet as the most significant byte. The unsigned decimal range is 0 through 4294967295. Hex output is padded to eight digits, and binary output uses four eight-bit groups."
      },
      {
        "heading": "Reject ambiguous legacy address spellings",
        "body": "The tool accepts exactly four decimal octets and rejects leading-zero octets, shorthand forms, negative integers and values beyond 32 bits. It does not support IPv6 or interpret hostnames. Conversion changes representation only; it does not locate an address, classify a subnet or check reachability. Use the CIDR calculator for network masks and host ranges."
      }
    ],
    "faq": {
      "question": "Why do some programs show a negative number for an IPv4 address?",
      "answer": "They may display the same 32 bits as a signed integer. This converter deliberately uses the unsigned range."
    },
    "related": [
      "/tools/cidr-calculator",
      "/tools/number-base-converter",
      "/tools/url-parser"
    ],
    "modified": "2026-11-04"
  },
  {
    "slug": "css-grid-generator",
    "title": "CSS Grid Generator",
    "description": "Generate fixed-column or responsive auto-fit CSS Grid layouts with adjustable gaps, minimum card widths and a live numbered-cell preview.",
    "kind": "design",
    "example": "",
    "action": "Generate CSS Grid",
    "extension": "css",
    "fields": [
      {
        "key": "responsive",
        "label": "Responsive auto-fit columns",
        "default": "true",
        "type": "checkbox"
      },
      {
        "key": "columns",
        "label": "Fixed columns",
        "default": "3",
        "type": "number",
        "min": 1,
        "max": 8
      },
      {
        "key": "minWidth",
        "label": "Responsive minimum card width (px)",
        "default": "180",
        "type": "number",
        "min": 60,
        "max": 600
      },
      {
        "key": "gap",
        "label": "Gap (px)",
        "default": "16",
        "type": "number",
        "min": 0,
        "max": 80
      },
      {
        "key": "items",
        "label": "Preview item count",
        "default": "9",
        "type": "number",
        "min": 1,
        "max": 24
      }
    ],
    "steps": [
      "Choose responsive auto-fit or a fixed column count.",
      "Set gap and minimum card width, then generate the layout.",
      "Resize the page to inspect the preview and copy the CSS into your component."
    ],
    "sections": [
      {
        "heading": "Build the container rule and inspect real browser layout",
        "body": "Fixed mode uses equal minmax(0, 1fr) tracks. Responsive mode combines auto-fit with a minimum card width, allowing the browser to choose how many columns fit. The minimum is bounded by 100% so a narrow container can still contain one card. The preview uses actual CSS Grid rather than a static illustration."
      },
      {
        "heading": "Adapt the generated rule to your content",
        "body": "The snippet targets .grid and its direct children. Preview count changes only the demonstration, not the emitted layout rule. Long unbroken text, images and custom child styles may need additional wrapping or sizing in your application. This is a column-layout starter rather than a visual editor for named areas, arbitrary item spans or a full design system."
      }
    ],
    "faq": {
      "question": "Why can responsive mode show fewer columns than the fixed count?",
      "answer": "Responsive mode ignores the fixed count and uses the available container width, minimum card width and gap to decide the track count."
    },
    "related": [
      "/tools/css-clamp-calculator",
      "/tools/css-border-radius-generator",
      "/tools/css-formatter"
    ],
    "modified": "2026-11-04"
  },
  {
    "slug": "srt-to-vtt",
    "title": "SRT to VTT Converter",
    "description": "Convert plain SubRip subtitles to WebVTT or WebVTT back to SRT, validating cue timing and preserving caption text.",
    "kind": "text",
    "example": "1\n00:00:01,000 --> 00:00:03,000\nHello, world!\n\n2\n00:00:04,500 --> 00:00:06,000\nA second caption.",
    "action": "Convert subtitles",
    "extension": "vtt",
    "fields": [
      {
        "key": "direction",
        "label": "Direction",
        "default": "srt-vtt",
        "type": "select",
        "options": [
          {
            "value": "srt-vtt",
            "label": "SRT to WebVTT"
          },
          {
            "value": "vtt-srt",
            "label": "WebVTT to SRT"
          }
        ]
      }
    ],
    "steps": [
      "Paste SRT text, or switch direction and paste WebVTT.",
      "Convert to validate each timed cue and change the container syntax.",
      "Download the generated .vtt or .srt file and test it with your player."
    ],
    "sections": [
      {
        "heading": "Convert timed text without rewriting the dialogue",
        "body": "The tool parses cue boundaries and millisecond timestamps, adds or removes the WEBVTT header, and uses the timestamp separator required by the destination. Cue text and its line breaks remain unchanged. SRT numbering is regenerated when exporting SRT, while cue identifiers are not part of the preserved content."
      },
      {
        "heading": "Know the supported subtitle subset",
        "body": "This converter supports plain timed cues. It rejects WebVTT STYLE, REGION, header metadata and positioning settings when exporting to SRT, because those features have no direct representation here. Cue markup is retained as text and may render differently across players. It does not translate, transcribe audio, detect speech or repair malformed timestamps silently."
      }
    ],
    "faq": {
      "question": "Does converting subtitles synchronize them with a video?",
      "answer": "No. It preserves timing. Use the separate time-shift tool if every cue needs the same offset."
    },
    "related": [
      "/tools/subtitle-time-shifter",
      "/tools/subtitles-to-text",
      "/tools/time-duration-converter"
    ],
    "modified": "2026-11-04",
    "reference": "https://www.w3.org/TR/webvtt1/"
  },
  {
    "slug": "subtitle-time-shifter",
    "title": "Subtitle Time Shifter",
    "description": "Shift every SRT or WebVTT cue by a positive or negative millisecond offset while preserving cue durations and text.",
    "kind": "text",
    "example": "1\n00:00:01,000 --> 00:00:03,000\nHello, world!\n\n2\n00:00:04,500 --> 00:00:06,000\nA second caption.",
    "action": "Shift subtitle times",
    "extension": "srt",
    "fields": [
      {
        "key": "offset",
        "label": "Offset (milliseconds)",
        "default": "1500",
        "type": "number",
        "min": -86400000,
        "max": 86400000
      },
      {
        "key": "format",
        "label": "Input/output format",
        "default": "srt",
        "type": "select",
        "options": [
          {
            "value": "srt",
            "label": "SRT"
          },
          {
            "value": "vtt",
            "label": "WebVTT"
          }
        ]
      }
    ],
    "steps": [
      "Paste plain SRT or WebVTT and select the matching format.",
      "Enter a positive offset to delay captions or a negative offset to advance them.",
      "Shift and download; any result with a negative cue time is rejected."
    ],
    "sections": [
      {
        "heading": "Apply one consistent synchronization correction",
        "body": "A uniform offset moves the start and end of every cue by the same amount, so cue duration stays unchanged. Milliseconds allow precise adjustments for a constant intro or audio delay. The tool validates input timing first and exports the selected format with normalized millisecond precision."
      },
      {
        "heading": "Distinguish an offset from timing drift",
        "body": "If captions gradually move out of sync, a single offset is not sufficient; that requires a deliberate time-scale or editing workflow. This tool does not stretch timing or clamp early cues to zero, because clamping changes durations and can hide a bad offset. It accepts plain timed cues and rejects unsupported WebVTT styling or positioning when it cannot preserve the format faithfully."
      }
    ],
    "faq": {
      "question": "What happens if shifting would move a cue before zero?",
      "answer": "The operation fails with an explanation, leaving the source unchanged. Choose a different offset or edit those cues deliberately."
    },
    "related": [
      "/tools/srt-to-vtt",
      "/tools/subtitles-to-text",
      "/tools/time-duration-converter"
    ],
    "modified": "2026-11-04"
  },
  {
    "slug": "subtitles-to-text",
    "title": "Subtitles to Text Extractor",
    "description": "Extract a readable transcript from plain SRT or WebVTT captions, removing timing and optionally joining consecutive duplicate cues.",
    "kind": "text",
    "example": "1\n00:00:01,000 --> 00:00:03,000\nHello, world!\n\n2\n00:00:04,500 --> 00:00:06,000\nA second caption.",
    "action": "Extract transcript",
    "extension": "txt",
    "fields": [
      {
        "key": "format",
        "label": "Subtitle format",
        "default": "srt",
        "type": "select",
        "options": [
          {
            "value": "srt",
            "label": "SRT"
          },
          {
            "value": "vtt",
            "label": "WebVTT"
          }
        ]
      },
      {
        "key": "dedupe",
        "label": "Remove consecutive duplicate caption texts",
        "default": "true",
        "type": "checkbox"
      }
    ],
    "steps": [
      "Paste plain subtitle cues and select SRT or WebVTT.",
      "Choose whether consecutive identical captions should be collapsed.",
      "Extract and copy or download the transcript."
    ],
    "sections": [
      {
        "heading": "Extract spoken text from a timed caption file",
        "body": "The parser separates caption text from numbering and timing. Common inline cue markup is removed and character references are decoded in an inert document. The output keeps one paragraph per cue, including line breaks inside the cue. Consecutive duplicate removal is optional and does not deduplicate unrelated later repetitions."
      },
      {
        "heading": "A transcript is not a new transcription",
        "body": "This tool reads the subtitle text you supply; it does not process audio or perform OCR on burned-in subtitles. Speaker labels and sound descriptions remain part of the text unless they are markup. Plain timed-cue input is supported. Review the result before using it as edited prose, because caption segmentation often splits sentences for on-screen reading."
      }
    ],
    "faq": {
      "question": "Will it remove legitimate repeated dialogue?",
      "answer": "Only consecutive identical cue texts are collapsed when that option is enabled. Disable it when every repeated cue should remain."
    },
    "related": [
      "/tools/srt-to-vtt",
      "/tools/word-counter",
      "/tools/text-line-wrapper"
    ],
    "modified": "2026-11-04"
  },
  {
    "slug": "csv-row-filter",
    "title": "CSV Row Filter",
    "description": "Filter parsed CSV records by exact text, substring or numeric comparisons without breaking quoted and multiline cells.",
    "kind": "text",
    "example": "name,score,team\nAda,98,Blue\nGrace,85,Red\nLinus,91,Blue",
    "action": "Filter rows",
    "extension": "csv",
    "fields": [
      {
        "key": "column",
        "label": "Exact column name",
        "default": "score",
        "type": "text"
      },
      {
        "key": "operator",
        "label": "Comparison",
        "default": "gte",
        "type": "select",
        "options": [
          {
            "value": "eq",
            "label": "Text equals"
          },
          {
            "value": "contains",
            "label": "Text contains"
          },
          {
            "value": "gt",
            "label": "Number greater than"
          },
          {
            "value": "gte",
            "label": "Number at least"
          },
          {
            "value": "lt",
            "label": "Number less than"
          },
          {
            "value": "lte",
            "label": "Number at most"
          }
        ]
      },
      {
        "key": "value",
        "label": "Comparison value",
        "default": "90",
        "type": "text"
      },
      {
        "key": "trim",
        "label": "Trim cells for matching",
        "default": "true",
        "type": "checkbox"
      },
      {
        "key": "ignoreCase",
        "label": "Ignore case for text matching",
        "default": "false",
        "type": "checkbox"
      },
      {
        "key": "delimiter",
        "label": "Input delimiter",
        "default": ",",
        "type": "select",
        "options": [
          {
            "value": ",",
            "label": "Comma"
          },
          {
            "value": ";",
            "label": "Semicolon"
          },
          {
            "value": "\t",
            "label": "Tab"
          }
        ]
      }
    ],
    "steps": [
      "Paste CSV with unique headers and choose an exact column name.",
      "Set the comparison and matching options.",
      "Filter and download the retained records with their original cell values."
    ],
    "sections": [
      {
        "heading": "Compare cells after parsing the CSV",
        "body": "Quoted commas and line breaks remain inside their cells. Matching normalization applies to the selected cell only; output retains the source cell text and header order. Text comparisons do not coerce values, so a code such as 001 remains different from 1 unless your explicit rule says otherwise."
      },
      {
        "heading": "Use numeric comparisons deliberately",
        "body": "Numeric operators accept finite decimal/scientific notation and skip cells that are blank or nonnumeric. They do not interpret locale commas, currency signs or hexadecimal literals. Output is comma-separated CSV with normal quoting. If nothing matches, the header remains as a valid empty result table. Input is limited to 50,000 cells for interactive use."
      }
    ],
    "faq": {
      "question": "Does filtering change the source values?",
      "answer": "No. Trimming and case folding affect matching only; retained records keep their original cells."
    },
    "related": [
      "/tools/csv-column-extractor",
      "/tools/csv-deduplicate",
      "/tools/csv-column-statistics"
    ],
    "modified": "2026-11-04"
  },
  {
    "slug": "csv-column-statistics",
    "title": "CSV Column Statistics",
    "description": "Inspect a CSV column for empty, distinct, numeric and nonnumeric values, with sum, mean, median and range for finite decimal numbers.",
    "kind": "text",
    "example": "name,score,team\nAda,98,Blue\nGrace,85,Red\nLinus,91,Blue",
    "action": "Analyze column",
    "extension": "json",
    "fields": [
      {
        "key": "column",
        "label": "Exact column name",
        "default": "score",
        "type": "text"
      },
      {
        "key": "delimiter",
        "label": "Input delimiter",
        "default": ",",
        "type": "select",
        "options": [
          {
            "value": ",",
            "label": "Comma"
          },
          {
            "value": ";",
            "label": "Semicolon"
          },
          {
            "value": "\t",
            "label": "Tab"
          }
        ]
      }
    ],
    "steps": [
      "Paste CSV and choose a column by its exact header.",
      "Analyze to see text-quality counts and numeric statistics.",
      "Review excluded values before using the totals elsewhere."
    ],
    "sections": [
      {
        "heading": "Combine data-quality counts with numeric summaries",
        "body": "The result reports row count, blank cells, distinct original strings and numeric/nonnumeric counts. Numeric summaries include minimum, maximum, sum, mean and median. Blank cells are not treated as zero. A small sample of nonnumeric values helps reveal a wrong column or unexpected export format."
      },
      {
        "heading": "Keep the interpretation explicit",
        "body": "Numeric parsing uses finite decimal or scientific notation after trimming; it does not infer currencies or localized separators. Distinct strings are compared exactly, so surrounding spaces can remain visible as separate values in the quality count. Statistics use ordinary browser floating-point arithmetic, not an exact accounting decimal engine. Values that overflow supported arithmetic cause an error rather than an infinite total."
      }
    ],
    "faq": {
      "question": "Are empty cells included as zero in the average?",
      "answer": "No. The numeric mean uses only values parsed as finite numbers; empty and nonnumeric counts are reported separately."
    },
    "related": [
      "/tools/csv-row-filter",
      "/tools/csv-to-json",
      "/tools/percentage-calculator"
    ],
    "modified": "2026-11-04"
  },
  {
    "slug": "json-array-filter",
    "title": "JSON Array Filter",
    "description": "Filter JSON array values with a JSON Pointer field, typed equality, substring, numeric or presence tests.",
    "kind": "text",
    "example": "[{\"id\":1,\"active\":true,\"profile\":{\"city\":\"London\"}},{\"id\":2,\"active\":false,\"profile\":{\"city\":\"Paris\"}},{\"id\":3,\"active\":true}]",
    "action": "Filter JSON array",
    "extension": "json",
    "fields": [
      {
        "key": "pointer",
        "label": "Field JSON Pointer (empty means entire item)",
        "default": "/active",
        "type": "text"
      },
      {
        "key": "operator",
        "label": "Comparison",
        "default": "eq",
        "type": "select",
        "options": [
          {
            "value": "eq",
            "label": "JSON value equals"
          },
          {
            "value": "ne",
            "label": "Existing value does not equal"
          },
          {
            "value": "contains",
            "label": "String contains"
          },
          {
            "value": "gt",
            "label": "Number greater than"
          },
          {
            "value": "gte",
            "label": "Number at least"
          },
          {
            "value": "lt",
            "label": "Number less than"
          },
          {
            "value": "lte",
            "label": "Number at most"
          },
          {
            "value": "exists",
            "label": "Pointer exists"
          },
          {
            "value": "missing",
            "label": "Pointer is missing"
          }
        ]
      },
      {
        "key": "value",
        "label": "Comparison as JSON (for example true or \"London\")",
        "default": "true",
        "type": "text"
      },
      {
        "key": "ignoreCase",
        "label": "Ignore case for substring matching",
        "default": "false",
        "type": "checkbox"
      }
    ],
    "steps": [
      "Paste a JSON array and enter a valid JSON Pointer for the field in each item.",
      "Choose a comparison and supply a typed JSON criterion where needed.",
      "Filter to retain matching items without reshaping them."
    ],
    "sections": [
      {
        "heading": "Use JSON types rather than string guesses",
        "body": "The criterion is parsed as JSON: true is a boolean and \"true\" is a string. Equality is structural, including arrays and objects. Numeric operators require numeric values; substring matching requires strings. The pointer is resolved relative to each array member, so the empty pointer compares the entire item."
      },
      {
        "heading": "Treat missing values separately",
        "body": "A missing pointer matches only the explicit missing test. Existing null and false values still count as present. The not-equal operator examines existing values rather than automatically including missing fields. Malformed pointer escapes are rejected before filtering. This is a focused array filter, not a complete JSONPath implementation or an application authorization rule."
      }
    ],
    "faq": {
      "question": "Is a null field the same as a missing field?",
      "answer": "No. A key with null exists and can match JSON null; an absent key matches the missing operator."
    },
    "related": [
      "/tools/json-pointer-extractor",
      "/tools/json-diff",
      "/blog/json-pointer-explained"
    ],
    "modified": "2026-11-04"
  },
  {
    "slug": "json-pointer-extractor",
    "title": "JSON Pointer Value Extractor",
    "description": "Extract a precise value from JSON using RFC 6901 pointers, including escaped slash and tilde keys and array indexes.",
    "kind": "text",
    "example": "{\"user\":{\"name\":\"Ada\",\"roles\":[\"admin\",\"editor\"]},\"a/b\":{\"m~n\":42}}",
    "action": "Extract JSON value",
    "extension": "json",
    "fields": [
      {
        "key": "pointer",
        "label": "JSON Pointer (empty means root)",
        "default": "/user/name",
        "type": "text"
      }
    ],
    "steps": [
      "Paste a JSON document and enter a pointer such as /user/roles/0.",
      "Use ~1 for a slash inside a key and ~0 for a literal tilde.",
      "Extract the selected JSON value or inspect a missing-path error."
    ],
    "sections": [
      {
        "heading": "Address one location unambiguously",
        "body": "A pointer is a sequence of slash-delimited reference tokens. Array indexes are zero-based, while object keys are interpreted literally after pointer unescaping. The empty string selects the whole document, and a single slash selects an empty-string property name. The result remains valid JSON, including quotes around a selected string."
      },
      {
        "heading": "Do not confuse a pointer with a query language",
        "body": "This tool does not evaluate scripts, wildcards or filters. It accepts the plain pointer form, not a URI fragment beginning with #. Array leading zeros and the append dash token are rejected for reading. A pointer that is syntactically valid can still fail because its path is absent or passes through a primitive value."
      }
    ],
    "faq": {
      "question": "Why are strings returned with quotes?",
      "answer": "The output is a JSON value. Quotes distinguish a string from another JSON type and preserve an exact copyable representation."
    },
    "related": [
      "/tools/json-flattener",
      "/tools/json-array-filter",
      "/blog/json-pointer-explained"
    ],
    "modified": "2026-11-04"
  },
  {
    "slug": "json-key-renamer",
    "title": "JSON Key Renamer",
    "description": "Rename JSON object keys using an explicit mapping, optionally across nested objects, while rejecting collisions and preserving values.",
    "kind": "text",
    "example": "{\"first_name\":\"Ada\",\"profile\":{\"last_name\":\"Lovelace\"}}",
    "action": "Rename JSON keys",
    "extension": "json",
    "fields": [
      {
        "key": "mapping",
        "label": "Rename map as JSON object",
        "default": "{\"first_name\":\"firstName\",\"last_name\":\"lastName\"}",
        "type": "text"
      },
      {
        "key": "recursive",
        "label": "Rename keys recursively",
        "default": "true",
        "type": "checkbox"
      }
    ],
    "steps": [
      "Paste an object or an array of objects.",
      "Provide an old-key to new-key mapping and choose recursive or root-record renaming.",
      "Rename and review the result; any collision stops the operation."
    ],
    "sections": [
      {
        "heading": "Apply a simultaneous explicit mapping",
        "body": "Keys are renamed from their original spelling, not repeatedly passed through the mapping. This permits deliberate swaps when destination names remain unique. Values and array ordering are preserved. Recursive mode visits nested objects; nonrecursive mode handles the root object or each root array record and leaves nested values unchanged."
      },
      {
        "heading": "Reject data loss from collisions",
        "body": "If two original properties would produce the same destination key in one object, the tool reports an error rather than choosing a winner. The source is never mutated. Special names such as __proto__ are handled as data properties. The mapping controls keys only and does not transform string values, infer casing conventions, or validate the resulting document against your API schema."
      }
    ],
    "faq": {
      "question": "Will renaming one key cause it to be renamed again by another mapping entry?",
      "answer": "No. Every destination is determined from the original key once, so mapping chains are not applied repeatedly."
    },
    "related": [
      "/tools/case-converter",
      "/tools/json-sorter",
      "/tools/json-diff"
    ],
    "modified": "2026-11-04"
  },
  {
    "slug": "http-status-lookup",
    "title": "HTTP Status Code Lookup",
    "description": "Look up common HTTP response codes, their standard reason labels, response class and a link to the official IANA registry.",
    "kind": "design",
    "example": "",
    "action": "Look up status",
    "extension": "json",
    "fields": [
      {
        "key": "code",
        "label": "HTTP status code",
        "default": "404",
        "type": "number",
        "min": 100,
        "max": 599
      }
    ],
    "steps": [
      "Enter a three-digit HTTP status code.",
      "Look up the included common-code label and its response class.",
      "Use the official registry reference for uncommon or recently assigned codes."
    ],
    "sections": [
      {
        "heading": "Separate the status code from application error text",
        "body": "The numeric status belongs to the HTTP response. A response body can contain a separate application code or message, and reason text in a server log is not always the canonical label. This offline reference covers common stable codes and identifies their informational, success, redirection, client-error or server-error class."
      },
      {
        "heading": "Use the registry for the complete current assignment",
        "body": "A valid three-digit number is not necessarily assigned, and this small reference does not list every code. Unknown entries are reported as absent from this reference rather than declared unassigned. The tool does not request a website or diagnose the cause of an error. Check the actual response headers and the relevant specification when behavior matters."
      }
    ],
    "faq": {
      "question": "Does this check the live status of a URL?",
      "answer": "No. It is an offline code lookup. It does not make requests to a supplied website."
    },
    "related": [
      "/tools/http-headers-to-json",
      "/tools/curl-to-fetch",
      "/tools/json-formatter"
    ],
    "modified": "2026-11-04",
    "reference": "https://www.iana.org/assignments/http-status-codes/"
  },
  {
    "slug": "mime-type-lookup",
    "title": "MIME Type Lookup",
    "description": "Find common media types by filename, extension or MIME string, with matching extensions and a clear unknown-type fallback.",
    "kind": "text",
    "example": "document.pdf",
    "action": "Look up MIME type",
    "extension": "json",
    "fields": [],
    "steps": [
      "Enter a filename, extension such as .webp, or a MIME type such as application/json.",
      "Look up the common mapping and related extensions.",
      "Review the result against your server’s content and configuration."
    ],
    "sections": [
      {
        "heading": "Look up a name, not the actual file bytes",
        "body": "This reference maps common extensions to media types and can reverse-search a media type without parameters. Filename matching ignores query and fragment suffixes and compares extensions without case. Multiple extensions can map to one media type, such as jpg and jpeg. The result does not prove that a renamed file contains the expected data."
      },
      {
        "heading": "Unknown is different from a verified type",
        "body": "An unrecognized extension returns an explicit unknown result and a generic binary fallback suggestion. The lookup does not inspect file signatures or override browser sniffing rules. Use the actual encoder output and HTTP Content-Type when serving data. For unusual formats, consult the official registry or format documentation rather than guessing a type from the filename alone."
      }
    ],
    "faq": {
      "question": "Can renaming a file to .png make it a PNG image?",
      "answer": "No. The extension is a label. Use a real format converter when the encoded bytes need to change."
    },
    "related": [
      "/tools/image-format-converter",
      "/tools/http-headers-to-json",
      "/tools/file-to-base64"
    ],
    "modified": "2026-11-04",
    "reference": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/MIME_types/Common_types"
  },
  {
    "slug": "css-text-shadow-generator",
    "title": "CSS Text Shadow Generator",
    "description": "Create a CSS text-shadow declaration with adjustable offsets, blur, color and opacity and inspect it on a live text preview.",
    "kind": "design",
    "example": "",
    "action": "Generate text shadow",
    "extension": "css",
    "fields": [
      {
        "key": "x",
        "label": "Horizontal offset (px)",
        "default": "2",
        "type": "number",
        "min": -100,
        "max": 100
      },
      {
        "key": "y",
        "label": "Vertical offset (px)",
        "default": "3",
        "type": "number",
        "min": -100,
        "max": 100
      },
      {
        "key": "blur",
        "label": "Blur radius (px)",
        "default": "4",
        "type": "number",
        "min": 0,
        "max": 80
      },
      {
        "key": "color",
        "label": "Shadow color",
        "default": "#6366f1",
        "type": "color"
      },
      {
        "key": "opacity",
        "label": "Opacity (%)",
        "default": "60",
        "type": "number",
        "min": 0,
        "max": 100
      }
    ],
    "steps": [
      "Choose offsets, blur and a shadow color.",
      "Set opacity and generate the text preview.",
      "Copy the declaration into the rule that styles your text."
    ],
    "sections": [
      {
        "heading": "Text shadows follow glyphs rather than the element box",
        "body": "A text-shadow is drawn around the characters. Its two offsets move the shadow, and its optional blur softens the edge. This differs from box-shadow, which follows an element’s box. The generated declaration contains a single shadow layer; multiple layers can be combined manually with commas."
      },
      {
        "heading": "Check readability in the final design",
        "body": "A shadow can change the perceived edge of text but does not automatically establish sufficient foreground/background contrast. Inspect the actual font, size and background in your component. Large blur and saturated colors can obscure small text. The preview uses one fixed sample so the generated declaration stays independent of your page’s typography."
      }
    ],
    "faq": {
      "question": "Can text-shadow use spread or inset like box-shadow?",
      "answer": "No. Those box-shadow controls are not part of the text-shadow syntax."
    },
    "related": [
      "/tools/css-box-shadow-generator",
      "/tools/color-contrast-checker",
      "/tools/css-formatter"
    ],
    "modified": "2026-11-04"
  },
  {
    "slug": "css-clip-path-generator",
    "title": "CSS Clip Path Polygon Generator",
    "description": "Build a CSS polygon clip-path from percentage point pairs, preview the clipped shape and copy the generated CSS.",
    "kind": "text",
    "example": "[[0,0],[100,0],[80,100],[20,100]]",
    "action": "Generate clip path",
    "extension": "css",
    "fields": [
      {
        "key": "color",
        "label": "Preview fill",
        "default": "#6366f1",
        "type": "color"
      }
    ],
    "steps": [
      "Enter 3–20 coordinate pairs as JSON, using percentages from 0 to 100.",
      "Generate the shape to inspect point order and clipping.",
      "Copy the clip-path rule and adapt the element’s dimensions in your layout."
    ],
    "sections": [
      {
        "heading": "Describe a polygon in the element’s own coordinate space",
        "body": "Each pair is horizontal and vertical percentage. Points are connected in order and the last point closes back to the first. Percentages scale with the element, so a polygon can appear different on a wide rectangle and a square. Reordering points changes the path and may create self-intersections."
      },
      {
        "heading": "Clipping does not change document layout dimensions",
        "body": "The element still occupies its original rectangular layout box. Clip-path controls which painted region remains visible; it does not wrap neighboring text around the polygon. This generator validates numeric bounds and a minimum of three distinct points, but it does not infer a simple non-self-intersecting geometry or add browser-specific fallback images."
      }
    ],
    "faq": {
      "question": "Does clip-path resize the layout box to the visible shape?",
      "answer": "No. It clips painting while the element keeps its normal layout size."
    },
    "related": [
      "/tools/css-border-radius-generator",
      "/tools/css-gradient-generator",
      "/tools/svg-to-png"
    ],
    "modified": "2026-11-04"
  },
  {
    "slug": "cubic-bezier-generator",
    "title": "Cubic Bezier Easing Generator",
    "description": "Generate CSS cubic-bezier timing functions with control-point validation, a curve graph and an animated preview.",
    "kind": "design",
    "example": "",
    "action": "Generate easing",
    "extension": "css",
    "fields": [
      {
        "key": "x1",
        "label": "First control X",
        "default": "0.25",
        "type": "number",
        "min": 0,
        "max": 1,
        "step": "any"
      },
      {
        "key": "y1",
        "label": "First control Y",
        "default": "0.1",
        "type": "number",
        "min": -3,
        "max": 3,
        "step": "any"
      },
      {
        "key": "x2",
        "label": "Second control X",
        "default": "0.25",
        "type": "number",
        "min": 0,
        "max": 1,
        "step": "any"
      },
      {
        "key": "y2",
        "label": "Second control Y",
        "default": "1",
        "type": "number",
        "min": -3,
        "max": 3,
        "step": "any"
      }
    ],
    "steps": [
      "Set the two control points; X coordinates must stay between 0 and 1.",
      "Generate the timing function and inspect the curve and motion preview.",
      "Copy the easing into a transition or animation rule."
    ],
    "sections": [
      {
        "heading": "Control timing without changing the endpoints",
        "body": "The curve starts at (0,0) and ends at (1,1). X describes progress through time, while Y describes output progress. CSS constrains the X control coordinates to the unit interval. Y may overshoot, which can produce an anticipation or overshoot effect in a compatible animated property."
      },
      {
        "heading": "A graph and motion show different aspects",
        "body": "The graph displays the control geometry, while the ball previews the generated easing over a fixed duration. The preview reverses direction on alternating runs and pauses its animation for reduced-motion preferences. Not every property can visibly overshoot its valid range, so check the easing on the actual property you intend to animate."
      }
    ],
    "faq": {
      "question": "Can the Y control points be outside 0–1?",
      "answer": "Yes. This tool allows a practical range from -3 to 3. CSS requires the X controls, rather than Y controls, to remain within 0–1."
    },
    "related": [
      "/tools/css-clamp-calculator",
      "/tools/css-flexbox-generator",
      "/tools/css-formatter"
    ],
    "modified": "2026-11-04",
    "reference": "https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function/cubic-bezier"
  },
  {
    "slug": "css-flexbox-generator",
    "title": "CSS Flexbox Generator",
    "description": "Generate flex container CSS with direction, wrapping, alignment and gap controls, plus a live numbered-item preview.",
    "kind": "design",
    "example": "",
    "action": "Generate Flexbox",
    "extension": "css",
    "fields": [
      {
        "key": "direction",
        "label": "Direction",
        "default": "row",
        "type": "select",
        "options": [
          {
            "value": "row",
            "label": "row"
          },
          {
            "value": "row-reverse",
            "label": "row-reverse"
          },
          {
            "value": "column",
            "label": "column"
          },
          {
            "value": "column-reverse",
            "label": "column-reverse"
          }
        ]
      },
      {
        "key": "wrap",
        "label": "Wrapping",
        "default": "wrap",
        "type": "select",
        "options": [
          {
            "value": "nowrap",
            "label": "nowrap"
          },
          {
            "value": "wrap",
            "label": "wrap"
          },
          {
            "value": "wrap-reverse",
            "label": "wrap-reverse"
          }
        ]
      },
      {
        "key": "justify",
        "label": "Main-axis alignment",
        "default": "flex-start",
        "type": "select",
        "options": [
          {
            "value": "flex-start",
            "label": "flex-start"
          },
          {
            "value": "center",
            "label": "center"
          },
          {
            "value": "flex-end",
            "label": "flex-end"
          },
          {
            "value": "space-between",
            "label": "space-between"
          },
          {
            "value": "space-around",
            "label": "space-around"
          },
          {
            "value": "space-evenly",
            "label": "space-evenly"
          }
        ]
      },
      {
        "key": "align",
        "label": "Cross-axis alignment",
        "default": "center",
        "type": "select",
        "options": [
          {
            "value": "stretch",
            "label": "stretch"
          },
          {
            "value": "flex-start",
            "label": "flex-start"
          },
          {
            "value": "center",
            "label": "center"
          },
          {
            "value": "flex-end",
            "label": "flex-end"
          }
        ]
      },
      {
        "key": "gap",
        "label": "Gap (px)",
        "default": "12",
        "type": "number",
        "min": 0,
        "max": 80
      },
      {
        "key": "items",
        "label": "Preview items",
        "default": "8",
        "type": "number",
        "min": 1,
        "max": 20
      }
    ],
    "steps": [
      "Choose direction and wrapping for the container.",
      "Adjust main-axis and cross-axis alignment plus the gap.",
      "Inspect the live layout and copy the CSS into your component."
    ],
    "sections": [
      {
        "heading": "Think in main and cross axes",
        "body": "Flex direction establishes the main axis. Justify-content distributes items along it, while align-items controls their cross-axis placement. Reversed directions change visual order without changing the underlying source order. Wrapping creates additional flex lines when fixed-size preview items no longer fit."
      },
      {
        "heading": "Use container rules as a starting point",
        "body": "The snippet styles the flex container; the preview gives items a fixed demonstration size. Your application’s child sizing, flex-grow, flex-shrink and basis rules affect the final result. This generator does not reorder DOM content or implement a full responsive layout system. Test long labels and narrow containers rather than relying only on the desktop preview."
      }
    ],
    "faq": {
      "question": "Is Flexbox the same as CSS Grid?",
      "answer": "They are different layout models. Use the separate Grid generator when you want explicit column tracks; this tool explores flex axes and item flow."
    },
    "related": [
      "/tools/css-grid-generator",
      "/tools/css-clamp-calculator",
      "/tools/css-formatter"
    ],
    "modified": "2026-11-04"
  },
  {
    "slug": "image-color-picker",
    "title": "Image Color Picker",
    "description": "Pick exact decoded RGBA pixels from a local image by clicking its canvas or entering coordinates, with HEX output and a color swatch.",
    "kind": "image",
    "example": "",
    "action": "Read pixel color",
    "extension": "json",
    "fields": [
      {
        "key": "x",
        "label": "Pixel X (zero based)",
        "default": "0",
        "type": "number",
        "min": 0,
        "max": 40000
      },
      {
        "key": "y",
        "label": "Pixel Y (zero based)",
        "default": "0",
        "type": "number",
        "min": 0,
        "max": 40000
      }
    ],
    "steps": [
      "Choose a PNG, JPEG or WebP image.",
      "Read the entered pixel coordinates or click the rendered canvas to select a pixel.",
      "Copy its RGBA and HEX values; alpha is included rather than silently discarded."
    ],
    "sections": [
      {
        "heading": "Sample the decoded image, not a screen capture",
        "body": "The picker reads the image’s canvas pixels in the browser. Click coordinates are mapped back from the displayed canvas to the original pixel grid, so a scaled preview can still address source pixels. The result includes x/y, RGB bytes, alpha and a hex color with an alpha suffix when needed."
      },
      {
        "heading": "Understand color-management and transparency limits",
        "body": "The result reflects the browser’s decoded sRGB-style canvas representation, not raw sensor values or an ICC-profile inspection. Transparent pixels retain their alpha value, and RGB values at zero alpha should not be interpreted as a visible color. The file stays local; the tool does not identify brands, objects or a complete palette automatically."
      }
    ],
    "faq": {
      "question": "Does clicking a scaled preview sample the smaller display image?",
      "answer": "The click is mapped to the source canvas coordinates. The reported sample is read from that decoded source pixel grid."
    },
    "related": [
      "/tools/color-converter",
      "/tools/color-contrast-checker",
      "/tools/image-format-converter"
    ],
    "modified": "2026-11-04"
  },
  {
    "slug": "image-grayscale",
    "title": "Image to Grayscale Converter",
    "description": "Convert a local PNG, JPEG or WebP image to grayscale, preserving decoded transparency and downloading PNG output.",
    "kind": "image",
    "example": "",
    "action": "Convert to grayscale",
    "extension": "png",
    "fields": [],
    "steps": [
      "Choose a PNG, JPEG or WebP image.",
      "Convert to neutral grayscale and inspect the before/after preview.",
      "Download the PNG; use the compressor afterward if you need a smaller delivery file."
    ],
    "sections": [
      {
        "heading": "Remove color while retaining image structure",
        "body": "The converter computes a weighted grayscale value from the decoded RGB channels and writes it to all three channels. Alpha is preserved. It creates a new PNG rather than applying a temporary webpage-only CSS effect, so the exported pixels remain grayscale in other applications."
      },
      {
        "heading": "Grayscale is not the same as a two-tone threshold",
        "body": "This operation retains intermediate shades rather than reducing the result to only black and white. It is not a print proof or an analysis of perceptual contrast. Source profiles and metadata are not retained, and image animation is flattened by browser decoding. Filtering is limited to 20 million decoded pixels to bound per-pixel work."
      }
    ],
    "faq": {
      "question": "Will this make the image file smaller?",
      "answer": "Not necessarily. The output is PNG and may be larger than a compressed source. Compare sizes and choose an appropriate delivery format."
    },
    "related": [
      "/tools/image-compressor",
      "/tools/image-format-converter",
      "/tools/image-color-picker"
    ],
    "modified": "2026-11-04"
  },
  {
    "slug": "image-watermark",
    "title": "Text Watermark Image Tool",
    "description": "Add a text watermark to a local image with position, size, color and opacity controls, then download a PNG preview.",
    "kind": "image",
    "example": "",
    "action": "Add watermark",
    "extension": "png",
    "fields": [
      {
        "key": "text",
        "label": "Watermark text",
        "default": "Sample",
        "type": "text"
      },
      {
        "key": "position",
        "label": "Position",
        "default": "bottom-right",
        "type": "select",
        "options": [
          {
            "value": "top-left",
            "label": "top-left"
          },
          {
            "value": "top-right",
            "label": "top-right"
          },
          {
            "value": "center",
            "label": "center"
          },
          {
            "value": "bottom-left",
            "label": "bottom-left"
          },
          {
            "value": "bottom-right",
            "label": "bottom-right"
          }
        ]
      },
      {
        "key": "fontSize",
        "label": "Font size (px)",
        "default": "32",
        "type": "number",
        "min": 1,
        "max": 256
      },
      {
        "key": "color",
        "label": "Text color",
        "default": "#ffffff",
        "type": "color"
      },
      {
        "key": "opacity",
        "label": "Opacity (%)",
        "default": "65",
        "type": "number",
        "min": 0,
        "max": 100
      }
    ],
    "steps": [
      "Choose an image and enter the text you want to overlay.",
      "Set placement, size, color and opacity.",
      "Inspect the result and download PNG; long text is scaled down to fit the image."
    ],
    "sections": [
      {
        "heading": "Create a visible overlay without uploading",
        "body": "The tool draws a single line of text with a browser sans-serif font. Margin scales with image dimensions, and placement follows the selected corner or center. Font size is reduced when necessary to keep the text inside a small image. The output preserves the source canvas dimensions and decoded transparency."
      },
      {
        "heading": "Keep an original and review the export",
        "body": "A watermark changes image pixels and is not an ownership verification or access-control system. Font appearance can vary by browser and installed fallback fonts. Metadata and animation are not preserved. Check readability against both light and dark portions of the image, especially when using a low-opacity overlay."
      }
    ],
    "faq": {
      "question": "Can I remove the text from the downloaded PNG later as a separate layer?",
      "answer": "No. The text is flattened into the exported pixels. Keep the original image for future edits."
    },
    "related": [
      "/tools/image-resizer",
      "/tools/image-compressor",
      "/tools/image-rotate-flip"
    ],
    "modified": "2026-11-04"
  },
  {
    "slug": "image-to-pdf",
    "title": "Image to PDF Converter",
    "description": "Place one local PNG, JPEG or WebP image on a single A4 or Letter PDF page with fitting, orientation and margin controls.",
    "kind": "image",
    "example": "",
    "action": "Create PDF",
    "extension": "pdf",
    "fields": [
      {
        "key": "paper",
        "label": "Paper size",
        "default": "a4",
        "type": "select",
        "options": [
          {
            "value": "a4",
            "label": "A4"
          },
          {
            "value": "letter",
            "label": "US Letter"
          }
        ]
      },
      {
        "key": "orientation",
        "label": "Orientation",
        "default": "portrait",
        "type": "select",
        "options": [
          {
            "value": "portrait",
            "label": "Portrait"
          },
          {
            "value": "landscape",
            "label": "Landscape"
          }
        ]
      },
      {
        "key": "margin",
        "label": "Page margin (points)",
        "default": "24",
        "type": "number",
        "min": 0,
        "max": 144
      }
    ],
    "steps": [
      "Choose a PNG, JPEG or WebP image.",
      "Select paper size, orientation and margin in points.",
      "Create and download a one-page PDF containing the fitted image."
    ],
    "sections": [
      {
        "heading": "Fit a picture inside a real PDF page",
        "body": "The image is scaled proportionally inside the available page area and centered. One point is 1/72 inch. The page has the selected physical dimensions rather than using the source pixel count as a paper size. This is a single-image converter, not a multi-page scan organizer or an OCR tool."
      },
      {
        "heading": "Export behavior and text limitations",
        "body": "The browser composites transparent pixels onto white and embeds a high-quality JPEG image in the PDF. Existing metadata and animation are not preserved. Text already present in the picture remains raster content and is not made searchable. The PDF contains no scripts, remote resources or automatic upload; it is generated and downloaded locally."
      }
    ],
    "faq": {
      "question": "Will text in the image become selectable in the PDF?",
      "answer": "No. The page contains the image. Searchable or selectable text requires a separate OCR or document-authoring workflow."
    },
    "related": [
      "/tools/image-resizer",
      "/tools/image-cropper",
      "/tools/image-format-converter"
    ],
    "modified": "2026-11-04"
  },
  {
    "slug": "text-line-wrapper",
    "title": "Text Line Wrapper",
    "description": "Wrap plain text to a chosen character width, optionally preserving input line breaks and splitting long words without breaking grapheme clusters.",
    "kind": "text",
    "example": "Small tools can remove a surprising amount of repetitive work from an ordinary development day.",
    "action": "Wrap text",
    "extension": "txt",
    "fields": [
      {
        "key": "width",
        "label": "Target characters per line",
        "default": "40",
        "type": "number",
        "min": 10,
        "max": 200
      },
      {
        "key": "preserve",
        "label": "Preserve existing line breaks",
        "default": "true",
        "type": "checkbox"
      },
      {
        "key": "breakWords",
        "label": "Split words longer than the width",
        "default": "false",
        "type": "checkbox"
      }
    ],
    "steps": [
      "Paste plain text and set the target line width.",
      "Choose whether existing line breaks remain and whether long words may be split.",
      "Wrap and copy the normalized result."
    ],
    "sections": [
      {
        "heading": "Format prose for narrow plain-text contexts",
        "body": "The wrapper normalizes spacing between words and can keep each original line as a separate wrapping block. When preservation is disabled, nonblank lines within a paragraph are joined before wrapping. Blank paragraph boundaries remain. The tool is intended for prose, terminal notes and plain-text messages rather than source-code formatting."
      },
      {
        "heading": "Character counts are not exact terminal column widths",
        "body": "Modern browsers count grapheme clusters so common combined characters and emoji sequences are not split when breaking long words. Wide CJK characters and terminal-specific rendering can still occupy more than one display cell. Without long-word splitting, a single long token may exceed the target width. Input is capped at 200,000 characters for interactive wrapping."
      }
    ],
    "faq": {
      "question": "Will this preserve Python or YAML indentation?",
      "answer": "No. It normalizes word spacing and line wrapping. Use a format-aware code formatter for indentation-sensitive source."
    },
    "related": [
      "/tools/whitespace-remover",
      "/tools/word-counter",
      "/tools/subtitles-to-text"
    ],
    "modified": "2026-11-04"
  },
  {
    "slug": "download-time-calculator",
    "title": "Download Time Calculator",
    "description": "Estimate transfer time from file size, bandwidth and efficiency, with explicit decimal/binary size units and bit-per-second network units.",
    "kind": "design",
    "example": "",
    "action": "Estimate download time",
    "extension": "json",
    "fields": [
      {
        "key": "size",
        "label": "File size",
        "default": "1",
        "type": "number",
        "min": 0,
        "max": 1000000,
        "step": "any"
      },
      {
        "key": "sizeUnit",
        "label": "Size unit",
        "default": "GiB",
        "type": "select",
        "options": [
          {
            "value": "B",
            "label": "B"
          },
          {
            "value": "KB",
            "label": "KB"
          },
          {
            "value": "MB",
            "label": "MB"
          },
          {
            "value": "GB",
            "label": "GB"
          },
          {
            "value": "TB",
            "label": "TB"
          },
          {
            "value": "KiB",
            "label": "KiB"
          },
          {
            "value": "MiB",
            "label": "MiB"
          },
          {
            "value": "GiB",
            "label": "GiB"
          },
          {
            "value": "TiB",
            "label": "TiB"
          }
        ]
      },
      {
        "key": "speed",
        "label": "Connection speed",
        "default": "100",
        "type": "number",
        "min": 1e-06,
        "max": 1000000000,
        "step": "any"
      },
      {
        "key": "speedUnit",
        "label": "Speed unit",
        "default": "Mbps",
        "type": "select",
        "options": [
          {
            "value": "bps",
            "label": "bps"
          },
          {
            "value": "Kbps",
            "label": "Kbps"
          },
          {
            "value": "Mbps",
            "label": "Mbps"
          },
          {
            "value": "Gbps",
            "label": "Gbps"
          }
        ]
      },
      {
        "key": "efficiency",
        "label": "Effective throughput (%)",
        "default": "90",
        "type": "number",
        "min": 0.01,
        "max": 100,
        "step": "any"
      }
    ],
    "steps": [
      "Enter file size with its decimal or binary unit.",
      "Enter the link rate in bits per second and choose an efficiency estimate.",
      "Calculate theoretical duration and compare assumptions with actual transfers."
    ],
    "sections": [
      {
        "heading": "Keep bytes and network bits separate",
        "body": "One byte contains eight bits. Decimal size units use powers of 1000, while KiB, MiB and GiB use powers of 1024. Network Kbps, Mbps and Gbps use powers of 1000 bits per second. The calculator applies your efficiency percentage to the nominal connection rate before estimating duration."
      },
      {
        "heading": "An estimate is not a throughput guarantee",
        "body": "Protocol overhead, latency, congestion, server limits, parallel transfers and changing connection quality can alter real results. Efficiency is an explicit assumption rather than a measured property. The output shows bytes, effective bit rate and duration in seconds, minutes and hours. It does not test your network connection or request a remote file."
      }
    ],
    "faq": {
      "question": "Why is 100 Mbps not the same as 100 MB per second?",
      "answer": "Mbps measures millions of bits per second; MB/s measures millions of bytes per second. Divide the bit rate by eight before comparing byte transfer rates."
    },
    "related": [
      "/tools/byte-converter",
      "/tools/time-duration-converter",
      "/tools/percentage-calculator"
    ],
    "modified": "2026-11-04"
  },
  {
    "slug": "unicode-normalizer",
    "title": "Unicode Normalizer",
    "description": "Normalize text to NFC, NFD, NFKC or NFKD to fix different Unicode representations before comparisons and imports.",
    "kind": "text",
    "example": "Café — ① ﬁ",
    "action": "Run Unicode Normalizer",
    "extension": "txt",
    "fields": [
      {
        "key": "form",
        "label": "Normalization form",
        "default": "NFC",
        "type": "select",
        "options": [
          {
            "value": "NFC",
            "label": "NFC"
          },
          {
            "value": "NFD",
            "label": "NFD"
          },
          {
            "value": "NFKC",
            "label": "NFKC"
          },
          {
            "value": "NFKD",
            "label": "NFKD"
          }
        ]
      }
    ],
    "steps": [
      "Paste the example or your own input.",
      "Choose the options that match your task.",
      "Run the tool, review the result, then copy or download it."
    ],
    "sections": [
      {
        "heading": "When to use Unicode Normalizer",
        "body": "Text copied from different applications can look identical while using different character sequences. Normalize product names, imported labels, or test fixtures before an exact comparison. NFC combines compatible canonical sequences, while NFD separates them. The example contains an accented word written with a combining mark, alongside characters that demonstrate the difference between canonical and compatibility normalization."
      },
      {
        "heading": "How to interpret the result",
        "body": "The output is the normalized text itself, so it can be pasted directly into another application. NFKC and NFKD can change distinctions such as circled digits and typographic ligatures; choose them only when that is intended. Normalization does not translate text, remove accents, change letter case, or guarantee that visually similar letters belong to the same alphabet. Keep an original copy when transforming identifiers."
      }
    ],
    "faq": {
      "question": "What should I check before using the output?",
      "answer": "The output is the normalized text itself, so it can be pasted directly into another application."
    },
    "related": [
      "/tools/unicode-escape",
      "/tools/text-diff"
    ],
    "modified": "2026-11-05",
    "reference": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize"
  },
  {
    "slug": "invisible-character-detector",
    "title": "Invisible Character Detector",
    "description": "Find zero-width characters, non-breaking spaces, bidirectional controls and unusual whitespace with exact positions.",
    "kind": "text",
    "example": "Hello​ world !\nID:‮123",
    "action": "Run Invisible Character Detector",
    "extension": "json",
    "fields": [],
    "steps": [
      "Paste the example or your own input.",
      "Choose the options that match your task.",
      "Run the tool, review the result, then copy or download it."
    ],
    "sections": [
      {
        "heading": "When to use Invisible Character Detector",
        "body": "Unexpected invisible characters can explain why a copied identifier fails, a CSV key does not match, or a line appears backwards. Paste the suspicious text to list invisible and formatting characters without modifying the source. Each match includes a Unicode code point and both a UTF-16 offset and a code-point position, making it easier to locate the character in an editor."
      },
      {
        "heading": "How to interpret the result",
        "body": "Positions start at zero. Tabs and line breaks are reported because they affect comparisons, even when they are intentional. The detector also includes Unicode format characters, separators, variation selectors, combining grapheme joiners and several visually blank characters. A match is a clue rather than an error: zero-width joiners and variation selectors are legitimate parts of many emoji and writing systems. Review context before removing anything."
      }
    ],
    "faq": {
      "question": "What should I check before using the output?",
      "answer": "Positions start at zero."
    },
    "related": [
      "/tools/whitespace-remover",
      "/tools/unicode-normalizer"
    ],
    "modified": "2026-11-05"
  },
  {
    "slug": "uuid-validator",
    "title": "UUID Validator and Inspector",
    "description": "Validate UUID syntax and inspect its version, variant and UUIDv7 timestamp without generating new identifiers.",
    "kind": "text",
    "example": "019a4d50-6b80-7000-8000-000000000001",
    "action": "Run UUID Validator and Inspector",
    "extension": "json",
    "fields": [],
    "steps": [
      "Paste the example or your own input.",
      "Choose the options that match your task.",
      "Run the tool, review the result, then copy or download it."
    ],
    "sections": [
      {
        "heading": "When to use UUID Validator and Inspector",
        "body": "Use this inspector when a database identifier is rejected or when you need to distinguish UUID versions in an API response. Paste one canonical UUID per line. The report shows whether its shape is valid, its normalized spelling, version bits and variant. Nil and maximum UUIDs are identified separately because their reserved patterns do not describe ordinary generated identifiers."
      },
      {
        "heading": "How to interpret the result",
        "body": "A syntactically valid identifier is not proof that a generator used secure randomness or that the value is unique. Version seven identifiers include a millisecond timestamp that is shown as an ISO date when representable; other versions do not receive that interpretation. This tool accepts the standard hyphenated form only and reports invalid rows individually instead of silently discarding them."
      }
    ],
    "faq": {
      "question": "What should I check before using the output?",
      "answer": "A syntactically valid identifier is not proof that a generator used secure randomness or that the value is unique."
    },
    "related": [
      "/tools/uuid-generator",
      "/tools/uuid-to-base64"
    ],
    "modified": "2026-11-05"
  },
  {
    "slug": "cookie-parser",
    "title": "Cookie Parser",
    "description": "Parse Cookie request headers or separate Set-Cookie response lines into structured JSON without losing duplicate names.",
    "kind": "text",
    "example": "Set-Cookie: session=abc=123; Path=/; Secure; HttpOnly; SameSite=Lax",
    "action": "Run Cookie Parser",
    "extension": "json",
    "fields": [
      {
        "key": "mode",
        "label": "Header type",
        "default": "response",
        "type": "select",
        "options": [
          {
            "value": "response",
            "label": "Set-Cookie response"
          },
          {
            "value": "request",
            "label": "Cookie request"
          }
        ]
      }
    ],
    "steps": [
      "Paste the example or your own input.",
      "Choose the options that match your task.",
      "Run the tool, review the result, then copy or download it."
    ],
    "sections": [
      {
        "heading": "When to use Cookie Parser",
        "body": "Browser requests send a Cookie header containing name and value pairs, while responses use Set-Cookie to attach attributes to individual cookies. Choose the matching mode before parsing a copied header. The output preserves cookie order, duplicate names and values containing equals signs, which helps diagnose sessions with multiple paths or applications sharing the same cookie name."
      },
      {
        "heading": "How to interpret the result",
        "body": "Paste each response cookie on its own line. Commas inside an Expires date are kept intact; combined Set-Cookie headers are not automatically split. Attributes are displayed as written with normalized names, without checking public suffix rules or deciding whether a browser will accept the cookie. Percent escapes are preserved rather than decoded, since cookie values do not have a universal URL-encoding contract."
      }
    ],
    "faq": {
      "question": "What should I check before using the output?",
      "answer": "Paste each response cookie on its own line."
    },
    "related": [
      "/tools/http-headers-to-json",
      "/tools/url-decode"
    ],
    "modified": "2026-11-05",
    "reference": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie"
  },
  {
    "slug": "csp-parser",
    "title": "Content Security Policy Parser",
    "description": "Inspect CSP directives, repeated directives and common risky source expressions in a pasted policy.",
    "kind": "text",
    "example": "default-src 'self'; script-src 'self' https://cdn.example.com; object-src 'none'; base-uri 'self' ",
    "action": "Run Content Security Policy Parser",
    "extension": "json",
    "fields": [],
    "steps": [
      "Paste the example or your own input.",
      "Choose the options that match your task.",
      "Run the tool, review the result, then copy or download it."
    ],
    "sections": [
      {
        "heading": "When to use Content Security Policy Parser",
        "body": "Long Content-Security-Policy headers become easier to inspect when each directive is separated into a name and a source list. Paste one policy to see the first occurrence of every directive, any later duplicates and notes about common source expressions. This is useful when reviewing a deployment header or explaining why a repeated directive has not extended the earlier source list."
      },
      {
        "heading": "How to interpret the result",
        "body": "The report is a structural inspection, not a security grade or a browser enforcement simulator. It does not fetch resources, resolve default-src fallback chains, verify nonces, or combine multiple policy headers. Notes about unsafe-inline, unsafe-eval, wildcards and mixed none expressions call attention to values worth reviewing. Whether a resource loads still depends on the complete response, browser support, destination and execution context."
      }
    ],
    "faq": {
      "question": "What should I check before using the output?",
      "answer": "The report is a structural inspection, not a security grade or a browser enforcement simulator."
    },
    "related": [
      "/tools/http-headers-to-json",
      "/tools/meta-tag-generator"
    ],
    "modified": "2026-11-05",
    "reference": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy"
  },
  {
    "slug": "ini-to-json",
    "title": "INI to JSON Converter",
    "description": "Convert sectioned INI configuration to JSON while preserving string values and catching duplicate keys.",
    "kind": "text",
    "example": "; Application configuration\nname=Utilixio\n[server]\nhost=localhost\nport=3000\n[features]\ncache=true",
    "action": "Run INI to JSON Converter",
    "extension": "json",
    "fields": [],
    "steps": [
      "Paste the example or your own input.",
      "Choose the options that match your task.",
      "Run the tool, review the result, then copy or download it."
    ],
    "sections": [
      {
        "heading": "When to use INI to JSON Converter",
        "body": "Configuration files often use INI sections while applications and deployment tooling expect JSON. This converter places keys before the first section at the document root and turns each named section into a nested object. It keeps numbers and booleans as strings so values such as leading-zero codes and explicitly written settings survive the conversion without guessed types."
      },
      {
        "heading": "How to interpret the result",
        "body": "INI dialects differ across platforms. This implementation supports equals-separated keys, full-line semicolon or hash comments, and simple section names. It rejects duplicate keys, repeated sections, root-key collisions and malformed lines instead of guessing which value wins. Quotes and inline comment characters remain literal parts of values. Interpolation, multiline values, dotted section expansion and PHP-style array syntax are not interpreted."
      }
    ],
    "faq": {
      "question": "What should I check before using the output?",
      "answer": "INI dialects differ across platforms."
    },
    "related": [
      "/tools/env-parser",
      "/tools/json-formatter"
    ],
    "modified": "2026-11-05"
  },
  {
    "slug": "csv-join",
    "title": "CSV Join by Key",
    "description": "Join two CSV tables by exact key columns using inner, left or full joins, with duplicate-key checks.",
    "kind": "text",
    "example": "id,name\n1,Ada\n2,Grace",
    "action": "Run CSV Join by Key",
    "extension": "csv",
    "fields": [
      {
        "key": "leftKey",
        "label": "Left key column",
        "default": "id",
        "type": "text"
      },
      {
        "key": "rightKey",
        "label": "Right key column",
        "default": "id",
        "type": "text"
      },
      {
        "key": "mode",
        "label": "Join type",
        "default": "left",
        "type": "select",
        "options": [
          {
            "value": "left",
            "label": "Left join"
          },
          {
            "value": "inner",
            "label": "Inner join"
          },
          {
            "value": "full",
            "label": "Full outer join"
          }
        ]
      }
    ],
    "steps": [
      "Paste the example or your own input.",
      "Choose the options that match your task.",
      "Run the tool, review the result, then copy or download it."
    ],
    "sections": [
      {
        "heading": "When to use CSV Join by Key",
        "body": "Join related exports when one table contains names and another contains account details, prices or departments. Choose one key column in each table; the names can differ. A left join keeps every first-table record, an inner join keeps matched records, and a full join also includes unmatched second-table records. Matching uses exact text, so leading zeros remain significant."
      },
      {
        "heading": "How to interpret the result",
        "body": "Both tables need unique, non-empty keys because this tool performs a one-to-one join rather than expanding many-to-many combinations. All columns are retained, including both key columns; conflicting right-side headers receive a unique suffix. Missing cells from unmatched rows are empty strings. Inputs use comma-separated CSV with a header row and may contain quoted commas or multiline values. Output is downloadable CSV; review it before importing into another system."
      }
    ],
    "faq": {
      "question": "What should I check before using the output?",
      "answer": "Both tables need unique, non-empty keys because this tool performs a one-to-one join rather than expanding many-to-many combinations."
    },
    "related": [
      "/tools/csv-column-extractor",
      "/tools/csv-compare"
    ],
    "modified": "2026-11-05",
    "exampleB": "id,department\n1,Engineering\n3,Design",
    "inputLabel": "First input",
    "secondInputLabel": "Second input"
  },
  {
    "slug": "csv-compare",
    "title": "CSV Compare by Key",
    "description": "Compare CSV exports by record ID and report added, removed and changed rows regardless of row or column order.",
    "kind": "text",
    "example": "id,name,plan\n1,Ada,free\n2,Grace,pro",
    "action": "Run CSV Compare by Key",
    "extension": "json",
    "fields": [
      {
        "key": "key",
        "label": "Shared key column",
        "default": "id",
        "type": "text"
      }
    ],
    "steps": [
      "Paste the example or your own input.",
      "Choose the options that match your task.",
      "Run the tool, review the result, then copy or download it."
    ],
    "sections": [
      {
        "heading": "When to use CSV Compare by Key",
        "body": "Line diffs become noisy when exported rows move around. Compare the records by a stable ID instead to find additions, removals and changed cell values. Paste the older export first and the newer export second. Columns are matched by their exact header names, so reordering either rows or columns alone does not create a change."
      },
      {
        "heading": "How to interpret the result",
        "body": "Both tables must have the same set of headers and unique non-empty values in the selected key column. Values are compared as exact strings: whitespace, leading zeros and different number spellings are meaningful differences. Each changed record lists the old and new values for affected columns. Added and removed records include their complete rows. Schema changes require a separate review and are rejected here rather than hidden inside a value comparison."
      }
    ],
    "faq": {
      "question": "What should I check before using the output?",
      "answer": "Both tables must have the same set of headers and unique non-empty values in the selected key column."
    },
    "related": [
      "/tools/csv-join",
      "/tools/text-diff"
    ],
    "modified": "2026-11-05",
    "exampleB": "plan,id,name\npro,1,Ada\nfree,3,Linus",
    "inputLabel": "First input",
    "secondInputLabel": "Second input"
  },
  {
    "slug": "json-group-by",
    "title": "JSON Array Group By",
    "description": "Group JSON records by a JSON Pointer field and keep typed group keys, counts and original records.",
    "kind": "text",
    "example": "[{\"team\":\"Design\",\"name\":\"Ada\"},{\"team\":\"Engineering\",\"name\":\"Grace\"},{\"team\":\"Design\",\"name\":\"Linus\"}]",
    "action": "Run JSON Array Group By",
    "extension": "json",
    "fields": [
      {
        "key": "pointer",
        "label": "Group field JSON Pointer",
        "default": "/team",
        "type": "text"
      }
    ],
    "steps": [
      "Paste the example or your own input.",
      "Choose the options that match your task.",
      "Run the tool, review the result, then copy or download it."
    ],
    "sections": [
      {
        "heading": "When to use JSON Array Group By",
        "body": "Group API records by a department, status, customer identifier or another nested field without writing a script. Enter a JSON Pointer such as /team or /address/country. The result is an array of groups, each containing the original field value, a count and the matching records in their original order. This makes the result convenient for inspecting distribution and feeding follow-up processing."
      },
      {
        "heading": "How to interpret the result",
        "body": "Group keys must be scalar JSON values: strings, numbers, booleans or null. Missing paths and object or array keys are rejected to prevent ambiguous categories. The string 1 and the number 1 are separate groups because their types matter. JSON Pointer uses ~1 for a literal slash and ~0 for a tilde inside property names. This groups records only; it does not calculate sums or rewrite their contents."
      }
    ],
    "faq": {
      "question": "What should I check before using the output?",
      "answer": "Group keys must be scalar JSON values: strings, numbers, booleans or null."
    },
    "related": [
      "/tools/json-pointer-extractor",
      "/tools/json-array-filter"
    ],
    "modified": "2026-11-05"
  },
  {
    "slug": "json-array-chunker",
    "title": "JSON Array Chunker",
    "description": "Split a JSON array into fixed-size batches for API requests, migrations and test fixtures while preserving order.",
    "kind": "text",
    "example": "[1,2,3,4,5,6,7]",
    "action": "Run JSON Array Chunker",
    "extension": "json",
    "fields": [
      {
        "key": "size",
        "label": "Items per chunk",
        "default": "3",
        "type": "number",
        "min": 1,
        "max": 10000,
        "step": "1"
      }
    ],
    "steps": [
      "Paste the example or your own input.",
      "Choose the options that match your task.",
      "Run the tool, review the result, then copy or download it."
    ],
    "sections": [
      {
        "heading": "When to use JSON Array Chunker",
        "body": "APIs and import jobs often limit how many records a single request may contain. Paste a JSON array and choose the maximum number of items per batch to produce an array of smaller arrays. The tool retains input order and values, which is useful when preparing test payloads or dividing a small migration into predictable parts."
      },
      {
        "heading": "How to interpret the result",
        "body": "Chunk size must be an integer between one and ten thousand. The last chunk may contain fewer items, and an empty source array produces an empty result. This is an item-count limit rather than a byte-size limit: a batch containing large records can still exceed an API payload allowance. The tool prepares data only and does not send requests, manage retries, or guarantee that a remote service accepts the resulting records."
      }
    ],
    "faq": {
      "question": "What should I check before using the output?",
      "answer": "Chunk size must be an integer between one and ten thousand."
    },
    "related": [
      "/tools/json-array-filter",
      "/tools/json-formatter"
    ],
    "modified": "2026-11-05"
  },
  {
    "slug": "css-selector-tester",
    "title": "CSS Selector Tester",
    "description": "Test a CSS selector against pasted HTML and inspect matching elements, text and attributes locally.",
    "kind": "text",
    "example": "<ul><li class=\"active\" data-id=\"1\">Ada</li><li>Grace</li></ul>",
    "action": "Run CSS Selector Tester",
    "extension": "json",
    "fields": [
      {
        "key": "selector",
        "label": "CSS selector",
        "default": "li.active",
        "type": "text"
      }
    ],
    "steps": [
      "Paste the example or your own input.",
      "Choose the options that match your task.",
      "Run the tool, review the result, then copy or download it."
    ],
    "sections": [
      {
        "heading": "When to use CSS Selector Tester",
        "body": "Before writing a scraper or a browser assertion, test whether a selector matches the intended elements in a small HTML sample. Paste a fragment and enter a browser-supported CSS selector. The result includes the match count and a structured description of each matching element, with its tag, attributes and text content. Invalid selector syntax is reported as an error."
      },
      {
        "heading": "How to interpret the result",
        "body": "HTML is parsed in an inert template and is never inserted into the live page. Scripts do not run and referenced resources are not loaded. Browser parsing can repair malformed markup, so the tree can differ from the original string. Layout-dependent pseudo-classes, hover state, shadow DOM and external styles are not simulated. Matches are capped at one thousand to keep the result readable; narrow a broad selector before inspecting a larger sample."
      }
    ],
    "faq": {
      "question": "What should I check before using the output?",
      "answer": "HTML is parsed in an inert template and is never inserted into the live page."
    },
    "related": [
      "/tools/html-formatter",
      "/tools/xpath-tester"
    ],
    "modified": "2026-11-05"
  },
  {
    "slug": "xpath-tester",
    "title": "XPath Tester for HTML",
    "description": "Evaluate relative XPath 1.0 expressions on pasted HTML, including attributes, counts, strings and booleans.",
    "kind": "text",
    "example": "<ul><li data-id=\"1\">Ada</li><li data-id=\"2\">Grace</li></ul>",
    "action": "Run XPath Tester for HTML",
    "extension": "json",
    "fields": [
      {
        "key": "expression",
        "label": "Relative XPath expression",
        "default": ".//li/@data-id",
        "type": "text"
      }
    ],
    "steps": [
      "Paste the example or your own input.",
      "Choose the options that match your task.",
      "Run the tool, review the result, then copy or download it."
    ],
    "sections": [
      {
        "heading": "When to use XPath Tester for HTML",
        "body": "XPath can target attributes or compute values that are awkward to inspect with a CSS selector alone. Paste an HTML fragment and start a relative expression from the synthetic wrapper element. For example, .//li selects descendant list items, .//li/@data-id selects their attributes, and count(.//li) returns a number. Results identify node types so attributes and elements are distinguishable."
      },
      {
        "heading": "How to interpret the result",
        "body": "This tester uses the browser XPath 1.0 engine on inert HTML, not an XML processor or XPath 2.0 implementation. Use relative paths beginning with a dot for navigation; absolute document paths are not useful in the detached wrapper. HTML tag names are normalized by the parser. No namespaces are registered, scripts are not executed, and pasted markup is never attached to the live page. Node result lists are limited to one thousand entries."
      }
    ],
    "faq": {
      "question": "What should I check before using the output?",
      "answer": "This tester uses the browser XPath 1.0 engine on inert HTML, not an XML processor or XPath 2.0 implementation."
    },
    "related": [
      "/tools/css-selector-tester",
      "/tools/html-formatter"
    ],
    "modified": "2026-11-05",
    "reference": "https://developer.mozilla.org/en-US/docs/Web/API/Document/evaluate"
  },
  {
    "slug": "text-find-replace",
    "title": "Text Find and Replace",
    "description": "Replace literal text in bulk with first-match or all-match mode and an exact replacement count.",
    "kind": "text",
    "example": "Hello NAME. Welcome, NAME!",
    "action": "Run Text Find and Replace",
    "extension": "txt",
    "fields": [
      {
        "key": "find",
        "label": "Find literal text",
        "default": "NAME",
        "type": "text"
      },
      {
        "key": "replacement",
        "label": "Replace with",
        "default": "Ada",
        "type": "text"
      },
      {
        "key": "mode",
        "label": "Replace",
        "default": "all",
        "type": "select",
        "options": [
          {
            "value": "all",
            "label": "All occurrences"
          },
          {
            "value": "first",
            "label": "First occurrence"
          }
        ]
      }
    ],
    "steps": [
      "Paste the example or your own input.",
      "Choose the options that match your task.",
      "Run the tool, review the result, then copy or download it."
    ],
    "sections": [
      {
        "heading": "When to use Text Find and Replace",
        "body": "Use literal replacement for templates, copied labels and repeated snippets when regular expressions would add unnecessary escaping. Enter the exact text to find and its replacement, then choose whether to replace the first occurrence or every non-overlapping occurrence. Matching is case sensitive, and punctuation such as periods, brackets or dollar signs is treated as ordinary text."
      },
      {
        "heading": "How to interpret the result",
        "body": "The output is the changed text, with a separate replacement count shown above it. An empty replacement removes the matched text; an empty search is rejected to avoid inserting content between every character. Dollar sequences in the replacement have no special meaning. Newlines and spaces are significant in the search. Review a text diff when changing configuration or source code because this tool does not understand its syntax."
      }
    ],
    "faq": {
      "question": "What should I check before using the output?",
      "answer": "The output is the changed text, with a separate replacement count shown above it."
    },
    "related": [
      "/tools/text-diff",
      "/tools/regex-escape"
    ],
    "modified": "2026-11-05"
  },
  {
    "slug": "regex-escape",
    "title": "Regex Escape Tool",
    "description": "Escape literal text into a JavaScript regular-expression pattern, including punctuation, whitespace and Unicode edge cases.",
    "kind": "text",
    "example": "price (USD): $19.99 / item",
    "action": "Run Regex Escape Tool",
    "extension": "txt",
    "fields": [],
    "steps": [
      "Paste the example or your own input.",
      "Choose the options that match your task.",
      "Run the tool, review the result, then copy or download it."
    ],
    "sections": [
      {
        "heading": "When to use Regex Escape Tool",
        "body": "A literal string can accidentally become a very different search when passed directly to a regular-expression constructor. Escape pasted text before embedding it as a literal pattern. This tool uses JavaScript RegExp.escape when the browser provides it and a compatible fallback otherwise. The output is a pattern source that matches the input as literal text."
      },
      {
        "heading": "How to interpret the result",
        "body": "The first ASCII letter or digit may appear as a hexadecimal escape to avoid joining a preceding numeric escape when patterns are concatenated. Slashes, brackets, whitespace and other punctuation are escaped for use in Unicode-aware JavaScript patterns. The result is not a JSON string or a complete slash-delimited expression. If storing the pattern in source code or JSON, apply the string escaping required by that destination separately."
      }
    ],
    "faq": {
      "question": "What should I check before using the output?",
      "answer": "The first ASCII letter or digit may appear as a hexadecimal escape to avoid joining a preceding numeric escape when patterns are concatenated."
    },
    "related": [
      "/tools/regex-tester",
      "/tools/backslash-escape"
    ],
    "modified": "2026-11-05"
  },
  {
    "slug": "json-array-deduplicator",
    "title": "JSON Array Deduplicator",
    "description": "Remove duplicate JSON records by a JSON Pointer key, keeping the first or last occurrence with exact typed matching.",
    "kind": "text",
    "example": "[{\"id\":1,\"name\":\"Ada\"},{\"id\":2,\"name\":\"Grace\"},{\"id\":1,\"name\":\"Ada updated\"}]",
    "action": "Deduplicate JSON array",
    "extension": "json",
    "fields": [
      {
        "key": "pointer",
        "label": "Unique key JSON Pointer",
        "default": "/id",
        "type": "text"
      },
      {
        "key": "keep",
        "label": "Keep occurrence",
        "default": "first",
        "type": "select",
        "options": [
          {
            "value": "first",
            "label": "First"
          },
          {
            "value": "last",
            "label": "Last"
          }
        ]
      }
    ],
    "steps": [
      "Paste the example or your own input.",
      "Choose the options that match your task.",
      "Run the tool, review the result, then copy or download it."
    ],
    "sections": [
      {
        "heading": "Remove repeated records by a stable key",
        "body": "API pages, merged exports and retry logs can contain multiple versions of the same record. Choose a JSON Pointer to the unique identifier and decide whether to retain the first or last occurrence. The output remains a JSON array containing complete original records. It is useful for preparing a clean fixture or checking the result of combining small API responses."
      },
      {
        "heading": "Understand exact matching and retained order",
        "body": "Keys must exist and must be scalar JSON values. Numbers and strings remain different keys, so an identifier written as a number does not collide with the same digits inside a string. Null and empty strings are allowed but each behaves as one shared key. Retained records appear in their original source order, including when keeping the last occurrence. Missing paths, complex keys and arrays larger than ten thousand items are rejected. This tool does not merge fields across repeated records."
      }
    ],
    "faq": {
      "question": "What should I check before using the output?",
      "answer": "Empty arrays and empty objects are preserved as values because they have no child paths to emit."
    },
    "related": [
      "/tools/json-array-filter",
      "/tools/csv-deduplicate"
    ],
    "modified": "2026-11-05"
  },
  {
    "slug": "ipv6-compressor",
    "title": "IPv6 Compressor and Expander",
    "description": "Validate IPv6 addresses and show expanded, compressed and integer representations, including IPv4-mapped input.",
    "kind": "text",
    "example": "2001:0db8:0000:0000:0000:ff00:0042:8329\n::ffff:192.0.2.128",
    "action": "Run IPv6 Compressor and Expander",
    "extension": "json",
    "fields": [],
    "steps": [
      "Paste the example or your own input.",
      "Choose the options that match your task.",
      "Run the tool, review the result, then copy or download it."
    ],
    "sections": [
      {
        "heading": "When to use IPv6 Compressor and Expander",
        "body": "Long IPv6 spellings are hard to compare by eye. Paste one address per line to inspect its eight fully padded groups and a shorter lowercase representation. Compression removes leading zeroes and shortens the longest run of zero groups, choosing the first run when there is a tie. The report also includes the address as a decimal integer for storage or test-vector comparison."
      },
      {
        "heading": "How to interpret the result",
        "body": "Input may use one double-colon abbreviation and may end with a dotted IPv4 address. Output uses hexadecimal groups consistently, including mapped addresses; application-specific display conventions may prefer a dotted suffix. Zone identifiers, CIDR prefixes, ports and enclosing URL brackets are rejected because this tool accepts addresses only. Validation establishes address syntax, not whether the address is assigned, reachable or appropriate for a particular network."
      }
    ],
    "faq": {
      "question": "What should I check before using the output?",
      "answer": "Input may use one double-colon abbreviation and may end with a dotted IPv4 address."
    },
    "related": [
      "/tools/cidr-calculator",
      "/tools/ipv4-to-decimal"
    ],
    "modified": "2026-11-05",
    "reference": "https://www.rfc-editor.org/rfc/rfc5952"
  },
  {
    "slug": "semver-compare",
    "title": "Semantic Version Comparator",
    "description": "Compare two strict SemVer 2.0.0 versions with correct prerelease ordering and build metadata handling.",
    "kind": "text",
    "example": "1.10.0-beta.2",
    "action": "Run Semantic Version Comparator",
    "extension": "json",
    "fields": [],
    "steps": [
      "Paste the example or your own input.",
      "Choose the options that match your task.",
      "Run the tool, review the result, then copy or download it."
    ],
    "sections": [
      {
        "heading": "When to use Semantic Version Comparator",
        "body": "Lexical sorting puts some version numbers in the wrong order. Compare two semantic versions to evaluate major, minor and patch components numerically, then apply prerelease precedence when required. The report includes each parsed component and the relationship between the inputs. Use it while checking package releases or preparing update tests with versions such as beta.2 and beta.11."
      },
      {
        "heading": "How to interpret the result",
        "body": "This comparator accepts strict major.minor.patch versions with optional prerelease and build metadata. Numeric identifiers cannot contain leading zeroes. Build metadata is shown but ignored for precedence, so two differently built artifacts can compare equal. Large numeric components are compared exactly without conversion to JavaScript Number. Package ranges, caret constraints, wildcards, leading v prefixes and ecosystem-specific version conventions are outside this tool."
      }
    ],
    "faq": {
      "question": "What should I check before using the output?",
      "answer": "This comparator accepts strict major.minor.patch versions with optional prerelease and build metadata."
    },
    "related": [
      "/tools/number-base-converter",
      "/tools/text-diff"
    ],
    "modified": "2026-11-05",
    "exampleB": "1.10.0-beta.11",
    "inputLabel": "First input",
    "secondInputLabel": "Second input",
    "reference": "https://semver.org/"
  },
  {
    "slug": "csv-pivot-table",
    "title": "CSV Pivot Table Generator",
    "description": "Build a pivot table from CSV with row and column groups and count, sum or average aggregation.",
    "kind": "text",
    "example": "team,month,hours\nDesign,Jan,4\nDesign,Feb,6\nEngineering,Jan,8\nDesign,Jan,2",
    "action": "Run CSV Pivot Table Generator",
    "extension": "csv",
    "fields": [
      {
        "key": "row",
        "label": "Row field",
        "default": "team",
        "type": "text"
      },
      {
        "key": "column",
        "label": "Column field",
        "default": "month",
        "type": "text"
      },
      {
        "key": "value",
        "label": "Numeric value field",
        "default": "hours",
        "type": "text"
      },
      {
        "key": "aggregation",
        "label": "Aggregation",
        "default": "sum",
        "type": "select",
        "options": [
          {
            "value": "sum",
            "label": "Sum"
          },
          {
            "value": "count",
            "label": "Count"
          },
          {
            "value": "average",
            "label": "Average"
          }
        ]
      }
    ],
    "steps": [
      "Paste the example or your own input.",
      "Choose the options that match your task.",
      "Run the tool, review the result, then copy or download it."
    ],
    "sections": [
      {
        "heading": "When to use CSV Pivot Table Generator",
        "body": "Turn a long CSV export into a compact cross-tabulation without opening a spreadsheet. Select one field for row labels and one for column labels, then choose count, sum or average. For numeric aggregation, select the value column as well. Repeated row and column combinations are combined, making the output suitable for reviewing activity by team, month, category or another pair of dimensions."
      },
      {
        "heading": "How to interpret the result",
        "body": "Labels retain the order in which they first appear. Missing combinations produce empty cells, while actual zero totals remain zero. Count measures source records and does not require a numeric value field. Sum and average require a finite number in every source value; blank or formatted currency values are rejected. Arithmetic uses JavaScript floating-point numbers, so use an accounting system when exact decimal rounding is required. The output is comma-separated CSV."
      }
    ],
    "faq": {
      "question": "What should I check before using the output?",
      "answer": "Labels retain the order in which they first appear."
    },
    "related": [
      "/tools/csv-column-statistics",
      "/tools/csv-join"
    ],
    "modified": "2026-11-05"
  },
  {
    "slug": "html-heading-extractor",
    "title": "HTML Heading Outline Extractor",
    "description": "Extract H1–H6 headings in document order and flag skipped levels or missing and repeated H1 headings.",
    "kind": "text",
    "example": "<main><h1>Product guide</h1><h2>Setup</h2><h4>Troubleshooting</h4></main>",
    "action": "Run HTML Heading Outline Extractor",
    "extension": "json",
    "fields": [],
    "steps": [
      "Paste the example or your own input.",
      "Choose the options that match your task.",
      "Run the tool, review the result, then copy or download it."
    ],
    "sections": [
      {
        "heading": "When to use HTML Heading Outline Extractor",
        "body": "Inspect the heading structure of a pasted page before publishing an article or reviewing a template. The output lists heading levels, text and IDs in document order, with observations about missing H1 elements, multiple H1 elements and jumps over intermediate levels. It helps reveal a document outline that is hard to notice when headings are styled to look similar."
      },
      {
        "heading": "How to interpret the result",
        "body": "The analysis uses the supplied HTML only and never fetches a page or executes scripts. It includes headings present in the markup even if external CSS would hide them, and it does not inspect shadow roots or generated content. A skipped level is a review prompt rather than an automatic accessibility failure. Heading structure is one part of a usable document and does not predict search ranking or replace an accessibility audit."
      }
    ],
    "faq": {
      "question": "What should I check before using the output?",
      "answer": "The analysis uses the supplied HTML only and never fetches a page or executes scripts."
    },
    "related": [
      "/tools/html-formatter",
      "/tools/css-selector-tester"
    ],
    "modified": "2026-11-05"
  },
  {
    "slug": "relative-url-resolver",
    "title": "Relative URL Resolver",
    "description": "Resolve relative links against a base HTTP or HTTPS URL and inspect the resulting origin and cross-origin status.",
    "kind": "text",
    "example": "../images/logo.svg\n?lang=uk\n#overview\n//cdn.example.com/app.js",
    "action": "Run Relative URL Resolver",
    "extension": "json",
    "fields": [
      {
        "key": "base",
        "label": "Base URL",
        "default": "https://example.com/docs/start/index.html",
        "type": "text"
      }
    ],
    "steps": [
      "Paste the example or your own input.",
      "Choose the options that match your task.",
      "Run the tool, review the result, then copy or download it."
    ],
    "sections": [
      {
        "heading": "When to use Relative URL Resolver",
        "body": "Relative paths can behave unexpectedly when a page moves between directories or gains a trailing slash. Enter the page URL as the base and paste one reference per line. The resolver applies the browser URL algorithm to parent paths, query-only references, fragments and protocol-relative links. It reports the absolute URL and whether its origin differs from the base."
      },
      {
        "heading": "How to interpret the result",
        "body": "Both the base and resolved destinations must use HTTP or HTTPS, and embedded usernames or passwords are rejected. No request is made, so a successful resolution does not mean that the destination exists or is safe. The result follows URL syntax rather than filesystem path rules, including percent-encoding and dot-segment normalization. Supply the effective document base when an HTML base element changes how links are interpreted."
      }
    ],
    "faq": {
      "question": "What should I check before using the output?",
      "answer": "Both the base and resolved destinations must use HTTP or HTTPS, and embedded usernames or passwords are rejected."
    },
    "related": [
      "/tools/url-parser",
      "/tools/url-cleaner"
    ],
    "modified": "2026-11-05"
  },
  {
    "slug": "date-difference-calculator",
    "title": "Date Difference Calculator",
    "description": "Calculate signed calendar days, full weeks and remaining days between two dates without daylight-saving surprises.",
    "kind": "design",
    "example": "",
    "fields": [
      {
        "key": "start",
        "label": "Start date (YYYY-MM-DD)",
        "default": "2026-11-05",
        "type": "text"
      },
      {
        "key": "end",
        "label": "End date (YYYY-MM-DD)",
        "default": "2026-12-25",
        "type": "text"
      }
    ],
    "action": "Calculate",
    "extension": "json",
    "steps": [
      "Load the example or enter your own values.",
      "Choose the relevant options and run the tool.",
      "Review the result, then copy it or download a local file."
    ],
    "sections": [
      {
        "heading": "When this tool is useful",
        "body": "Measure a date interval when planning a trip, checking a project timeline or preparing a test case. Enter two Gregorian calendar dates in year-month-day form. The result includes signed days, absolute days, complete weeks and the remaining days. Swapping the start and end reverses the sign while keeping the absolute interval unchanged."
      },
      {
        "heading": "Reading the result and limitations",
        "body": "The start date is excluded and the end date marks the end of the interval, so identical dates have a difference of zero. Dates are evaluated at UTC midnight to avoid daylight-saving changes creating fractional days. This is a calendar-date calculation, not a measurement between local timestamps. Invalid dates and years outside 0001 through 9999 are rejected. Months are not reported because their lengths vary."
      }
    ],
    "faq": {
      "question": "What are the main limits of Date Difference Calculator?",
      "answer": "The start date is excluded and the end date marks the end of the interval, so identical dates have a difference of zero. Dates are evaluated at UTC midnight to avoid daylight-saving changes creating fractional days. This is a calendar-date calculation, not a measurement between local timestamps. Invalid dates and years outside 0001 through 9999 are rejected. Months are not reported because their lengths vary."
    },
    "related": [
      "/tools/business-days-calculator",
      "/tools/time-duration-converter"
    ],
    "modified": "2026-11-05"
  },
  {
    "slug": "business-days-calculator",
    "title": "Business Days Calculator",
    "description": "Count working days between dates with selectable weekends, optional end-date inclusion and your own holiday list.",
    "kind": "design",
    "example": "",
    "fields": [
      {
        "key": "start",
        "label": "Start date (included)",
        "default": "2026-11-05",
        "type": "text"
      },
      {
        "key": "end",
        "label": "End date",
        "default": "2026-11-20",
        "type": "text"
      },
      {
        "key": "weekend",
        "label": "Weekend",
        "default": "sat-sun",
        "type": "select",
        "options": [
          {
            "value": "sat-sun",
            "label": "Saturday and Sunday"
          },
          {
            "value": "fri-sat",
            "label": "Friday and Saturday"
          },
          {
            "value": "none",
            "label": "No weekend exclusion"
          }
        ]
      },
      {
        "key": "includeEnd",
        "label": "End date",
        "default": "false",
        "type": "select",
        "options": [
          {
            "value": "false",
            "label": "Exclude end date"
          },
          {
            "value": "true",
            "label": "Include end date"
          }
        ]
      },
      {
        "key": "holidays",
        "label": "Holiday dates (comma or space separated)",
        "default": "2026-11-17",
        "type": "text"
      }
    ],
    "action": "Calculate",
    "extension": "json",
    "steps": [
      "Load the example or enter your own values.",
      "Choose the relevant options and run the tool.",
      "Review the result, then copy it or download a local file."
    ],
    "sections": [
      {
        "heading": "When this tool is useful",
        "body": "Estimate available workdays for a delivery schedule, leave request or internal plan. Choose a weekend pattern and paste the holiday dates that apply to your organization. The result separates working days, excluded weekend days and excluded weekday holidays, so a holiday that falls on a weekend is not subtracted twice. The example uses a custom holiday solely to demonstrate the input format."
      },
      {
        "heading": "Reading the result and limitations",
        "body": "The start date is included, while end-date inclusion is an explicit option. Holiday calendars are not downloaded or inferred from a country, and this is not a payroll or legal deadline service. Enter dates in YYYY-MM-DD form; duplicates in the holiday list count once. Reversed ranges and intervals longer than 36,600 days are rejected. Check local rules and any partial working days before using a count in an operational schedule."
      }
    ],
    "faq": {
      "question": "What are the main limits of Business Days Calculator?",
      "answer": "The start date is included, while end-date inclusion is an explicit option. Holiday calendars are not downloaded or inferred from a country, and this is not a payroll or legal deadline service. Enter dates in YYYY-MM-DD form; duplicates in the holiday list count once. Reversed ranges and intervals longer than 36,600 days are rejected. Check local rules and any partial working days before using a count in an operational schedule."
    },
    "related": [
      "/tools/date-difference-calculator",
      "/tools/iso-week-calculator"
    ],
    "modified": "2026-11-05"
  },
  {
    "slug": "iso-week-calculator",
    "title": "ISO Week Number Calculator",
    "description": "Find a date’s ISO week number, ISO week-year, weekday and the Monday–Sunday boundaries of its week.",
    "kind": "design",
    "example": "",
    "fields": [
      {
        "key": "date",
        "label": "Date (YYYY-MM-DD)",
        "default": "2026-12-31",
        "type": "text"
      }
    ],
    "action": "Calculate",
    "extension": "json",
    "steps": [
      "Load the example or enter your own values.",
      "Choose the relevant options and run the tool.",
      "Review the result, then copy it or download a local file."
    ],
    "sections": [
      {
        "heading": "When this tool is useful",
        "body": "Week numbers in reports can differ from the calendar year near New Year. This calculator returns the ISO week date, where Monday is day one and week one contains January fourth. Use it to label a weekly export, verify an analytics grouping or identify the Monday and Sunday belonging to a particular date."
      },
      {
        "heading": "Reading the result and limitations",
        "body": "The ISO week-year is shown separately from the ordinary calendar year because late December can belong to the next ISO year and early January can belong to the previous one. Output dates use the Gregorian calendar and are calculated in UTC without relying on your device time zone. This tool does not implement country-specific Sunday-start week numbering or fiscal calendars. Supply a complete valid date rather than a year and week alone."
      }
    ],
    "faq": {
      "question": "What are the main limits of ISO Week Number Calculator?",
      "answer": "The ISO week-year is shown separately from the ordinary calendar year because late December can belong to the next ISO year and early January can belong to the previous one. Output dates use the Gregorian calendar and are calculated in UTC without relying on your device time zone. This tool does not implement country-specific Sunday-start week numbering or fiscal calendars. Supply a complete valid date rather than a year and week alone."
    },
    "related": [
      "/tools/date-difference-calculator",
      "/tools/time-zone-converter"
    ],
    "modified": "2026-11-05"
  },
  {
    "slug": "time-zone-converter",
    "title": "Time Zone Converter",
    "description": "Convert an explicitly offset ISO timestamp to an IANA time zone with the correct date and daylight-saving offset.",
    "kind": "design",
    "example": "",
    "fields": [
      {
        "key": "instant",
        "label": "ISO timestamp with Z or UTC offset",
        "default": "2026-11-05T12:00:00Z",
        "type": "text"
      },
      {
        "key": "zone",
        "label": "Destination IANA time zone",
        "default": "Europe/Bratislava",
        "type": "text"
      }
    ],
    "action": "Calculate",
    "extension": "json",
    "steps": [
      "Load the example or enter your own values.",
      "Choose the relevant options and run the tool.",
      "Review the result, then copy it or download a local file."
    ],
    "sections": [
      {
        "heading": "When this tool is useful",
        "body": "Convert a meeting time, log entry or API timestamp into another time zone without assuming that a region keeps the same offset throughout the year. Enter an ISO timestamp containing Z or an explicit numeric offset, then choose an IANA name such as Europe/Bratislava or America/New_York. The result includes the UTC instant and its formatted local representation."
      },
      {
        "heading": "Reading the result and limitations",
        "body": "An offset is required so the input identifies one instant even during repeated or skipped local clock hours. The destination offset and formatting come from your browser’s Internationalization API and installed time-zone data. Historical rules and future rule updates therefore depend on that runtime. This tool does not guess the zone of a bare local time or resolve ambiguous daylight-saving input. Leap seconds and timestamps without seconds are not accepted."
      }
    ],
    "faq": {
      "question": "What are the main limits of Time Zone Converter?",
      "answer": "An offset is required so the input identifies one instant even during repeated or skipped local clock hours. The destination offset and formatting come from your browser’s Internationalization API and installed time-zone data. Historical rules and future rule updates therefore depend on that runtime. This tool does not guess the zone of a bare local time or resolve ambiguous daylight-saving input. Leap seconds and timestamps without seconds are not accepted."
    },
    "related": [
      "/tools/date-to-unix-timestamp",
      "/tools/iso-week-calculator"
    ],
    "modified": "2026-11-05"
  },
  {
    "slug": "unit-converter",
    "title": "Unit Converter",
    "description": "Convert length, mass, volume and temperature between metric and common imperial units with clear unit compatibility checks.",
    "kind": "design",
    "example": "",
    "fields": [
      {
        "key": "value",
        "label": "Value",
        "default": "1",
        "type": "number",
        "min": -1000000000000.0,
        "max": 1000000000000.0,
        "step": "any"
      },
      {
        "key": "from",
        "label": "From",
        "default": "m",
        "type": "select",
        "options": [
          {
            "value": "mm",
            "label": "Millimetres"
          },
          {
            "value": "cm",
            "label": "Centimetres"
          },
          {
            "value": "m",
            "label": "Metres"
          },
          {
            "value": "km",
            "label": "Kilometres"
          },
          {
            "value": "in",
            "label": "Inches"
          },
          {
            "value": "ft",
            "label": "Feet"
          },
          {
            "value": "yd",
            "label": "Yards"
          },
          {
            "value": "mi",
            "label": "Miles"
          },
          {
            "value": "g",
            "label": "Grams"
          },
          {
            "value": "kg",
            "label": "Kilograms"
          },
          {
            "value": "oz",
            "label": "Ounces (mass)"
          },
          {
            "value": "lb",
            "label": "Pounds (mass)"
          },
          {
            "value": "ml",
            "label": "Millilitres"
          },
          {
            "value": "l",
            "label": "Litres"
          },
          {
            "value": "usgal",
            "label": "US liquid gallons"
          },
          {
            "value": "ukgal",
            "label": "Imperial gallons"
          },
          {
            "value": "c",
            "label": "Celsius"
          },
          {
            "value": "f",
            "label": "Fahrenheit"
          },
          {
            "value": "k",
            "label": "Kelvin"
          }
        ]
      },
      {
        "key": "to",
        "label": "To",
        "default": "ft",
        "type": "select",
        "options": [
          {
            "value": "mm",
            "label": "Millimetres"
          },
          {
            "value": "cm",
            "label": "Centimetres"
          },
          {
            "value": "m",
            "label": "Metres"
          },
          {
            "value": "km",
            "label": "Kilometres"
          },
          {
            "value": "in",
            "label": "Inches"
          },
          {
            "value": "ft",
            "label": "Feet"
          },
          {
            "value": "yd",
            "label": "Yards"
          },
          {
            "value": "mi",
            "label": "Miles"
          },
          {
            "value": "g",
            "label": "Grams"
          },
          {
            "value": "kg",
            "label": "Kilograms"
          },
          {
            "value": "oz",
            "label": "Ounces (mass)"
          },
          {
            "value": "lb",
            "label": "Pounds (mass)"
          },
          {
            "value": "ml",
            "label": "Millilitres"
          },
          {
            "value": "l",
            "label": "Litres"
          },
          {
            "value": "usgal",
            "label": "US liquid gallons"
          },
          {
            "value": "ukgal",
            "label": "Imperial gallons"
          },
          {
            "value": "c",
            "label": "Celsius"
          },
          {
            "value": "f",
            "label": "Fahrenheit"
          },
          {
            "value": "k",
            "label": "Kelvin"
          }
        ]
      }
    ],
    "action": "Calculate",
    "extension": "json",
    "steps": [
      "Load the example or enter your own values.",
      "Choose the relevant options and run the tool.",
      "Review the result, then copy it or download a local file."
    ],
    "sections": [
      {
        "heading": "When this tool is useful",
        "body": "Translate everyday measurements when following a specification, checking a package weight or comparing metric and imperial dimensions. Select two units of the same measurement type. Length, mass and volume conversions use fixed relationships; temperature conversions additionally apply the required offset. US liquid gallons and imperial gallons are separate choices so their different volumes remain visible."
      },
      {
        "heading": "Reading the result and limitations",
        "body": "A length cannot be converted into a mass without extra information such as density, so incompatible selections are rejected. Negative length, mass or volume and temperatures below absolute zero are also rejected. Ounces and pounds refer to mass rather than fluid volume or force. Calculations use JavaScript floating-point arithmetic and display up to twelve significant digits; they are suitable for general measurement checks rather than calibration certificates or precision laboratory work."
      }
    ],
    "faq": {
      "question": "What are the main limits of Unit Converter?",
      "answer": "A length cannot be converted into a mass without extra information such as density, so incompatible selections are rejected. Negative length, mass or volume and temperatures below absolute zero are also rejected. Ounces and pounds refer to mass rather than fluid volume or force. Calculations use JavaScript floating-point arithmetic and display up to twelve significant digits; they are suitable for general measurement checks rather than calibration certificates or precision laboratory work."
    },
    "related": [
      "/tools/aspect-ratio-calculator",
      "/tools/byte-converter"
    ],
    "modified": "2026-11-05"
  },
  {
    "slug": "weighted-average-calculator",
    "title": "Weighted Average Calculator",
    "description": "Calculate a weighted mean from CSV values and weights, with explicit handling of zero weights and invalid rows.",
    "kind": "text",
    "example": "value,weight\n80,2\n90,3\n70,1",
    "fields": [
      {
        "key": "valueField",
        "label": "Value column",
        "default": "value",
        "type": "text"
      },
      {
        "key": "weightField",
        "label": "Weight column",
        "default": "weight",
        "type": "text"
      }
    ],
    "action": "Calculate weighted average",
    "extension": "json",
    "steps": [
      "Load the example or enter your own values.",
      "Choose the relevant options and run the tool.",
      "Review the result, then copy it or download a local file."
    ],
    "sections": [
      {
        "heading": "Calculate a mean when contributions differ",
        "body": "A simple average gives every entry equal influence, which can misrepresent a dataset with different counts or importance weights. Paste a CSV table and choose the value and weight columns to calculate a weighted mean. This can help verify an educational exercise, combine summarized measurements or check a small reporting formula. The example combines three scores with different contribution weights."
      },
      {
        "heading": "Check weights and numeric precision",
        "body": "Every row needs a finite numeric value and a nonnegative finite weight. Zero-weight rows do not affect the result and are counted separately. At least one weight must be positive. The result includes total weight and weighted sum so the calculation can be inspected. Values and weights are parsed as plain decimal or exponent notation without currency symbols or grouping commas. Arithmetic uses JavaScript floating point and rejects overflowing totals; displayed results are rounded to twelve significant digits."
      }
    ],
    "faq": {
      "question": "Can all weights be zero?",
      "answer": "No. At least one weight must be positive; negative weights and missing numeric cells are rejected."
    },
    "related": [
      "/tools/csv-column-statistics",
      "/tools/percentage-calculator"
    ],
    "modified": "2026-11-05"
  },
  {
    "slug": "gcd-lcm-calculator",
    "title": "GCD and LCM Calculator",
    "description": "Find the greatest common divisor and least common multiple of a list of whole numbers using exact integer arithmetic.",
    "kind": "text",
    "example": "12, 18, 30",
    "fields": [],
    "action": "Process input",
    "extension": "json",
    "steps": [
      "Load the example or enter your own values.",
      "Choose the relevant options and run the tool.",
      "Review the result, then copy it or download a local file."
    ],
    "sections": [
      {
        "heading": "When this tool is useful",
        "body": "Find a shared divisor for reducing quantities or a common multiple for repeating cycles. Paste integers separated by commas or whitespace. The result reports the greatest common divisor and the least common multiple for the whole list. Negative inputs are treated by their magnitudes because the standard nonnegative results are the useful convention for these operations."
      },
      {
        "heading": "Reading the result and limitations",
        "body": "At least two and at most one hundred integers are required, with a maximum of one hundred digits per input. Decimal notation and scientific notation are rejected instead of rounded. Any zero makes the least common multiple zero; the greatest common divisor of an all-zero list is reported as zero by convention. Results are decimal strings because exact values may exceed JavaScript’s safe integer range."
      }
    ],
    "faq": {
      "question": "What are the main limits of GCD and LCM Calculator?",
      "answer": "At least two and at most one hundred integers are required, with a maximum of one hundred digits per input. Decimal notation and scientific notation are rejected instead of rounded. Any zero makes the least common multiple zero; the greatest common divisor of an all-zero list is reported as zero by convention. Results are decimal strings because exact values may exceed JavaScript’s safe integer range."
    },
    "related": [
      "/tools/aspect-ratio-calculator",
      "/tools/number-base-converter"
    ],
    "modified": "2026-11-05"
  },
  {
    "slug": "scientific-notation-converter",
    "title": "Scientific Notation Converter",
    "description": "Convert decimal or exponent notation into normalized scientific notation and an exact expanded decimal string.",
    "kind": "text",
    "example": "0.0000012300",
    "fields": [],
    "action": "Process input",
    "extension": "json",
    "steps": [
      "Load the example or enter your own values.",
      "Choose the relevant options and run the tool.",
      "Review the result, then copy it or download a local file."
    ],
    "sections": [
      {
        "heading": "When this tool is useful",
        "body": "Expand a value copied from a spreadsheet or normalize a long decimal for documentation. The converter handles both ordinary decimal text and forms such as 1.23e-6. It returns a normalized scientific form with one nonzero digit before the decimal point and an expanded ordinary decimal form. The conversion operates on digit strings rather than binary floating-point numbers."
      },
      {
        "heading": "Reading the result and limitations",
        "body": "Numeric value is preserved exactly within the supported length, but insignificant trailing fractional zeroes are removed; this tool does not track measurement uncertainty or significant-figure intent. Zero is normalized without a negative sign. Commas, currency symbols, NaN and Infinity are not accepted. Exponents are limited to magnitude ten thousand and expanded output to twenty thousand characters to keep accidental large inputs manageable."
      }
    ],
    "faq": {
      "question": "What are the main limits of Scientific Notation Converter?",
      "answer": "Numeric value is preserved exactly within the supported length, but insignificant trailing fractional zeroes are removed; this tool does not track measurement uncertainty or significant-figure intent. Zero is normalized without a negative sign. Commas, currency symbols, NaN and Infinity are not accepted. Exponents are limited to magnitude ten thousand and expanded output to twenty thousand characters to keep accidental large inputs manageable."
    },
    "related": [
      "/tools/number-base-converter",
      "/tools/number-to-words"
    ],
    "modified": "2026-11-05"
  },
  {
    "slug": "roman-numeral-converter",
    "title": "Roman Numeral Converter",
    "description": "Convert whole numbers from 1 to 3999 into Roman numerals or validate and decode canonical Roman numeral text.",
    "kind": "text",
    "example": "2026",
    "fields": [
      {
        "key": "direction",
        "label": "Direction",
        "default": "roman",
        "type": "select",
        "options": [
          {
            "value": "roman",
            "label": "Number to Roman"
          },
          {
            "value": "decimal",
            "label": "Roman to number"
          }
        ]
      }
    ],
    "action": "Process input",
    "extension": "json",
    "steps": [
      "Load the example or enter your own values.",
      "Choose the relevant options and run the tool.",
      "Review the result, then copy it or download a local file."
    ],
    "sections": [
      {
        "heading": "When this tool is useful",
        "body": "Convert a year, outline label or edition number into standard Roman numerals without manually combining symbols. Choose the direction before entering either a decimal integer or a Roman numeral. The reverse conversion accepts lowercase input and normalizes it to uppercase, then checks that the spelling follows the usual subtractive forms such as IV, IX, XL and CM."
      },
      {
        "heading": "Reading the result and limitations",
        "body": "The supported range is one through 3999, using the symbols I, V, X, L, C, D and M. Zero, negative values, fractions, overlines and historical additive variants are outside this tool. Noncanonical strings such as IIII or IC are rejected rather than assigned a guessed meaning. The JSON result includes both representations so you can inspect the conversion before copying it into a document."
      }
    ],
    "faq": {
      "question": "What are the main limits of Roman Numeral Converter?",
      "answer": "The supported range is one through 3999, using the symbols I, V, X, L, C, D and M. Zero, negative values, fractions, overlines and historical additive variants are outside this tool. Noncanonical strings such as IIII or IC are rejected rather than assigned a guessed meaning. The JSON result includes both representations so you can inspect the conversion before copying it into a document."
    },
    "related": [
      "/tools/number-to-words",
      "/tools/number-base-converter"
    ],
    "modified": "2026-11-05"
  },
  {
    "slug": "number-to-words",
    "title": "Number to Words Converter",
    "description": "Spell signed whole numbers in English using exact decimal input, from zero through eighteen-digit magnitudes.",
    "kind": "text",
    "example": "123456789",
    "fields": [],
    "action": "Process input",
    "extension": "txt",
    "steps": [
      "Load the example or enter your own values.",
      "Choose the relevant options and run the tool.",
      "Review the result, then copy it or download a local file."
    ],
    "sections": [
      {
        "heading": "When this tool is useful",
        "body": "Write an integer in English words for educational examples, generated labels or a document draft. The converter groups digits into thousands, millions and larger short-scale names while preserving the exact integer value. Negative numbers receive a minus prefix, and zero has its own explicit spelling. The example demonstrates how several groups are combined into one phrase."
      },
      {
        "heading": "Reading the result and limitations",
        "body": "This implementation uses English short-scale cardinal wording without the optional British and between hundreds and tens. Hyphens connect compound tens such as twenty-one. It accepts at most eighteen digits in the magnitude and does not support fractions, currencies, ordinal numbers or regional cheque-writing conventions. Leading zeroes are rejected because they may indicate an identifier rather than a quantity. Always review wording required by a formal document."
      }
    ],
    "faq": {
      "question": "What are the main limits of Number to Words Converter?",
      "answer": "This implementation uses English short-scale cardinal wording without the optional British and between hundreds and tens. Hyphens connect compound tens such as twenty-one. It accepts at most eighteen digits in the magnitude and does not support fractions, currencies, ordinal numbers or regional cheque-writing conventions. Leading zeroes are rejected because they may indicate an identifier rather than a quantity. Always review wording required by a formal document."
    },
    "related": [
      "/tools/roman-numeral-converter",
      "/tools/scientific-notation-converter"
    ],
    "modified": "2026-11-05"
  },
  {
    "slug": "random-name-picker",
    "title": "Random Name Picker",
    "description": "Pick one or several unique entries from a list with browser-generated randomness and no replacement. ",
    "kind": "text",
    "example": "Ada\nGrace\nLinus\nMargaret\nAlan\nKatherine\nDonald",
    "fields": [
      {
        "key": "count",
        "label": "Number of entries to pick",
        "default": "1",
        "type": "number",
        "min": 1,
        "max": 10000,
        "step": "any"
      }
    ],
    "action": "Process input",
    "extension": "json",
    "steps": [
      "Load the example or enter your own values.",
      "Choose the relevant options and run the tool.",
      "Review the result, then copy it or download a local file."
    ],
    "sections": [
      {
        "heading": "When this tool is useful",
        "body": "Choose participants for a small activity, select examples from a list or make a casual random choice. Paste one entry per line and choose how many to draw. Entries are trimmed and exact duplicate labels are removed before selection, so pasting the same label twice does not increase its chance. The result contains the selected entries in draw order."
      },
      {
        "heading": "Reading the result and limitations",
        "body": "Selection uses a Fisher–Yates shuffle with browser cryptographic randomness and rejection sampling to avoid modulo bias. Each run is independent and draws without replacement within that run. This is a local convenience tool, not an externally audited draw, and it does not save history or provide a reproducible seed. Labels differing only by letter case remain separate. At most ten thousand unique entries are supported; the draw count cannot exceed the available entries."
      }
    ],
    "faq": {
      "question": "What are the main limits of Random Name Picker?",
      "answer": "Selection uses a Fisher–Yates shuffle with browser cryptographic randomness and rejection sampling to avoid modulo bias. Each run is independent and draws without replacement within that run. This is a local convenience tool, not an externally audited draw, and it does not save history or provide a reproducible seed. Labels differing only by letter case remain separate. At most ten thousand unique entries are supported; the draw count cannot exceed the available entries."
    },
    "related": [
      "/tools/random-team-generator",
      "/tools/remove-duplicate-lines"
    ],
    "modified": "2026-11-05"
  },
  {
    "slug": "random-team-generator",
    "title": "Random Team Generator",
    "description": "Split a roster into randomly shuffled teams whose sizes differ by at most one person. ",
    "kind": "text",
    "example": "Ada\nGrace\nLinus\nMargaret\nAlan\nKatherine\nDonald",
    "fields": [
      {
        "key": "teams",
        "label": "Number of teams",
        "default": "3",
        "type": "number",
        "min": 1,
        "max": 10000,
        "step": "any"
      }
    ],
    "action": "Process input",
    "extension": "json",
    "steps": [
      "Load the example or enter your own values.",
      "Choose the relevant options and run the tool.",
      "Review the result, then copy it or download a local file."
    ],
    "sections": [
      {
        "heading": "When this tool is useful",
        "body": "Create groups for a workshop, classroom activity or casual game without assigning every participant manually. Paste one participant per line and choose how many teams you need. The roster is shuffled locally and distributed across the teams in turn. Team sizes stay as even as possible, with any remaining participants assigned to the earlier numbered teams."
      },
      {
        "heading": "Reading the result and limitations",
        "body": "Each nonblank line represents one participant, and repeated labels are rejected so a person is not accidentally assigned twice. Add a distinguishing label when two people share a name. Randomization uses browser cryptographic randomness with an unbiased shuffle, but it does not balance skill, availability or other personal attributes. The number of teams must be between one and the number of participants, with at most ten thousand participants. No roster is submitted to a server."
      }
    ],
    "faq": {
      "question": "What are the main limits of Random Team Generator?",
      "answer": "Each nonblank line represents one participant, and repeated labels are rejected so a person is not accidentally assigned twice. Add a distinguishing label when two people share a name. Randomization uses browser cryptographic randomness with an unbiased shuffle, but it does not balance skill, availability or other personal attributes. The number of teams must be between one and the number of participants, with at most ten thousand participants. No roster is submitted to a server."
    },
    "related": [
      "/tools/random-name-picker",
      "/tools/list-compare"
    ],
    "modified": "2026-11-05"
  },
  {
    "slug": "csv-merge",
    "title": "CSV Merger",
    "description": "Append two CSV tables vertically, matching reordered headers or combining different schemas with a union of columns.",
    "kind": "text",
    "example": "id,name\n1,Ada\n2,Grace",
    "fields": [
      {
        "key": "schema",
        "label": "Column handling",
        "default": "strict",
        "type": "select",
        "options": [
          {
            "value": "strict",
            "label": "Same column names"
          },
          {
            "value": "union",
            "label": "Union of columns"
          }
        ]
      }
    ],
    "action": "Process input",
    "extension": "csv",
    "steps": [
      "Load the example or enter your own values.",
      "Choose the relevant options and run the tool.",
      "Review the result, then copy it or download a local file."
    ],
    "sections": [
      {
        "heading": "When this tool is useful",
        "body": "Combine small exports from successive days or separate sources into one table with a single header row. Unlike joining by a key, merging appends records vertically and keeps every source row. The second table may use a different column order because cells are aligned by header name. Union mode also keeps columns that appear in only one of the tables."
      },
      {
        "heading": "Reading the result and limitations",
        "body": "Headers must be unique and nonblank. Strict mode requires the same set of column names; union mode keeps first-table columns first and appends new second-table columns. Missing cells are empty strings, which cannot distinguish an absent column from an explicitly empty value. Duplicate records are intentionally preserved. Inputs use comma-separated CSV with standard quoting, and output is limited to one hundred thousand cells for a responsive local conversion."
      }
    ],
    "faq": {
      "question": "What are the main limits of CSV Merger?",
      "answer": "Headers must be unique and nonblank. Strict mode requires the same set of column names; union mode keeps first-table columns first and appends new second-table columns. Missing cells are empty strings, which cannot distinguish an absent column from an explicitly empty value. Duplicate records are intentionally preserved. Inputs use comma-separated CSV with standard quoting, and output is limited to one hundred thousand cells for a responsive local conversion."
    },
    "related": [
      "/tools/csv-join",
      "/tools/csv-deduplicate"
    ],
    "modified": "2026-11-05",
    "exampleB": "name,id\nLinus,3",
    "inputLabel": "First CSV",
    "secondInputLabel": "Second CSV"
  },
  {
    "slug": "csv-unpivot",
    "title": "CSV Unpivot Tool",
    "description": "Convert a wide CSV table into long-form records while preserving selected identifier columns and original cell text.",
    "kind": "text",
    "example": "team,Jan,Feb\nDesign,4,6\nEngineering,8,10",
    "fields": [
      {
        "key": "ids",
        "label": "Identifier columns (JSON array)",
        "default": "[\"team\"]",
        "type": "text"
      },
      {
        "key": "variable",
        "label": "Variable column name",
        "default": "period",
        "type": "text"
      },
      {
        "key": "valueName",
        "label": "Value column name",
        "default": "amount",
        "type": "text"
      }
    ],
    "action": "Process input",
    "extension": "csv",
    "steps": [
      "Load the example or enter your own values.",
      "Choose the relevant options and run the tool.",
      "Review the result, then copy it or download a local file."
    ],
    "sections": [
      {
        "heading": "When this tool is useful",
        "body": "Turn spreadsheet columns such as months or survey questions into rows before charting or importing data. Choose the identifier columns to retain in each output record. Every remaining source column becomes a variable name, and its cell becomes the corresponding value. The result is a long-form CSV table that is easier to group, filter or feed into another analysis tool."
      },
      {
        "heading": "Reading the result and limitations",
        "body": "Identifier selection is a JSON array of exact header names, and at least one source column must remain to unpivot. Output names must be distinct and cannot collide with retained identifiers. All cell values, including empty cells and leading zeroes, remain strings without aggregation or type inference. Records are emitted in source-row order and then source-column order. The output is limited to one hundred thousand cells."
      }
    ],
    "faq": {
      "question": "What are the main limits of CSV Unpivot Tool?",
      "answer": "Identifier selection is a JSON array of exact header names, and at least one source column must remain to unpivot. Output names must be distinct and cannot collide with retained identifiers. All cell values, including empty cells and leading zeroes, remain strings without aggregation or type inference. Records are emitted in source-row order and then source-column order. The output is limited to one hundred thousand cells."
    },
    "related": [
      "/tools/csv-pivot-table",
      "/tools/csv-column-extractor"
    ],
    "modified": "2026-11-05"
  },
  {
    "slug": "json-array-to-object",
    "title": "JSON Array to Object",
    "description": "Index an array of JSON records by a string or safe integer field, with explicit duplicate-key handling.",
    "kind": "text",
    "example": "[{\"id\":\"u1\",\"name\":\"Ada\"},{\"id\":\"u2\",\"name\":\"Grace\"}]",
    "fields": [
      {
        "key": "pointer",
        "label": "Key field JSON Pointer",
        "default": "/id",
        "type": "text"
      },
      {
        "key": "duplicates",
        "label": "Duplicate keys",
        "default": "error",
        "type": "select",
        "options": [
          {
            "value": "error",
            "label": "Reject duplicates"
          },
          {
            "value": "first",
            "label": "Keep first"
          },
          {
            "value": "last",
            "label": "Keep last"
          }
        ]
      }
    ],
    "action": "Process input",
    "extension": "json",
    "steps": [
      "Load the example or enter your own values.",
      "Choose the relevant options and run the tool.",
      "Review the result, then copy it or download a local file."
    ],
    "sections": [
      {
        "heading": "When this tool is useful",
        "body": "Change a list response into a lookup object when a UI or fixture needs direct access by identifier. Select the key field with a JSON Pointer such as /id or /user/code. Each resulting object property contains the complete source record. This is useful when testing normalized application state or preparing an input expected by another library."
      },
      {
        "heading": "Reading the result and limitations",
        "body": "JSON property names are strings, so the number 1 and the string 1 map to the same destination key. Duplicate behavior is an explicit choice, with rejection as the default to avoid silent data loss. Keys must be strings or safe integers; missing paths, null, booleans and complex keys are rejected. The output safely preserves property names such as __proto__ as ordinary data. Object enumeration can reorder integer-looking keys, so retain an array when ordering matters."
      }
    ],
    "faq": {
      "question": "What are the main limits of JSON Array to Object?",
      "answer": "JSON property names are strings, so the number 1 and the string 1 map to the same destination key. Duplicate behavior is an explicit choice, with rejection as the default to avoid silent data loss. Keys must be strings or safe integers; missing paths, null, booleans and complex keys are rejected. The output safely preserves property names such as __proto__ as ordinary data. Object enumeration can reorder integer-looking keys, so retain an array when ordering matters."
    },
    "related": [
      "/tools/json-group-by",
      "/tools/json-array-deduplicator"
    ],
    "modified": "2026-11-05"
  },
  {
    "slug": "html-image-alt-checker",
    "title": "HTML Image Alt Checker",
    "description": "Inspect pasted HTML for images with missing, empty or whitespace-only alt attributes and review image metadata locally.",
    "kind": "text",
    "example": "<img src=\"product.jpg\" alt=\"Blue ceramic cup\"><img src=\"decoration.svg\" alt=\"\"><img src=\"banner.jpg\">",
    "fields": [],
    "action": "Process input",
    "extension": "json",
    "steps": [
      "Load the example or enter your own values.",
      "Choose the relevant options and run the tool.",
      "Review the result, then copy it or download a local file."
    ],
    "sections": [
      {
        "heading": "When this tool is useful",
        "body": "Review image descriptions in a page fragment before publishing an article or a product template. The report lists each image source, alternative text and loading metadata, separating missing attributes from deliberately empty values. This helps a content editor find markup that deserves attention without fetching the images or running scripts from the page."
      },
      {
        "heading": "Reading the result and limitations",
        "body": "An empty alt attribute can be correct for a decorative image, while a meaningful image generally needs useful equivalent text. The tool flags cases for review and cannot decide whether a description communicates the right meaning. It inspects img elements only, not CSS background images, rendered visibility or the complete accessibility tree. Pasted HTML stays inert in the browser, and external image sources are not requested."
      }
    ],
    "faq": {
      "question": "What are the main limits of HTML Image Alt Checker?",
      "answer": "An empty alt attribute can be correct for a decorative image, while a meaningful image generally needs useful equivalent text. The tool flags cases for review and cannot decide whether a description communicates the right meaning. It inspects img elements only, not CSS background images, rendered visibility or the complete accessibility tree. Pasted HTML stays inert in the browser, and external image sources are not requested."
    },
    "related": [
      "/tools/html-heading-extractor",
      "/tools/html-formatter"
    ],
    "modified": "2026-11-05"
  },
  {
    "slug": "html-form-inspector",
    "title": "HTML Form Inspector",
    "description": "Extract forms, associated controls, labels, methods and action attributes from pasted HTML without submitting anything.",
    "kind": "text",
    "example": "<form id=\"signup\" action=\"/subscribe\" method=\"post\"><label for=\"email\">Email</label><input id=\"email\" name=\"email\" type=\"email\" required><button type=\"submit\">Join</button></form>",
    "fields": [],
    "action": "Process input",
    "extension": "json",
    "steps": [
      "Load the example or enter your own values.",
      "Choose the relevant options and run the tool.",
      "Review the result, then copy it or download a local file."
    ],
    "sections": [
      {
        "heading": "When this tool is useful",
        "body": "Inspect the fields a form declares before debugging a submission or reviewing a template. The result lists forms and their associated controls, including names, types, required and disabled states, label text and select options. Controls using a form attribute are associated with the matching form ID even when they appear outside the form element."
      },
      {
        "heading": "Reading the result and limitations",
        "body": "This is a static markup inventory, not a serialization of successful submission fields or an accessibility certification. It does not execute validation, simulate clicks, resolve action URLs or send a request. Password, hidden and other input values are deliberately omitted from the report. Missing explicit methods are reported as GET, and action attributes are shown literally. Form associations are resolved within the pasted fragment; the browser may repair malformed markup during parsing."
      }
    ],
    "faq": {
      "question": "What are the main limits of HTML Form Inspector?",
      "answer": "This is a static markup inventory, not a serialization of successful submission fields or an accessibility certification. It does not execute validation, simulate clicks, resolve action URLs or send a request. Password, hidden and other input values are deliberately omitted from the report. Missing explicit methods are reported as GET, and action attributes are shown literally. Form associations are resolved within the pasted fragment; the browser may repair malformed markup during parsing."
    },
    "related": [
      "/tools/html-image-alt-checker",
      "/tools/css-selector-tester"
    ],
    "modified": "2026-11-05"
  },
  {
    "slug": "css-keyframes-generator",
    "title": "CSS Keyframes Animation Generator",
    "description": "Generate fade, slide, pulse or spin keyframes with duration controls, a live preview and reduced-motion CSS.",
    "kind": "design",
    "example": "",
    "fields": [
      {
        "key": "effect",
        "label": "Effect",
        "default": "slide",
        "type": "select",
        "options": [
          {
            "value": "fade",
            "label": "Fade"
          },
          {
            "value": "slide",
            "label": "Slide"
          },
          {
            "value": "pulse",
            "label": "Pulse"
          },
          {
            "value": "spin",
            "label": "Spin"
          }
        ]
      },
      {
        "key": "duration",
        "label": "Duration (seconds)",
        "default": "1.5",
        "type": "number",
        "min": 0.1,
        "max": 30,
        "step": "any"
      },
      {
        "key": "distance",
        "label": "Slide distance (px)",
        "default": "40",
        "type": "number",
        "min": 0,
        "max": 200,
        "step": "any"
      },
      {
        "key": "timing",
        "label": "Timing",
        "default": "ease-in-out",
        "type": "select",
        "options": [
          {
            "value": "linear",
            "label": "linear"
          },
          {
            "value": "ease",
            "label": "ease"
          },
          {
            "value": "ease-in",
            "label": "ease-in"
          },
          {
            "value": "ease-out",
            "label": "ease-out"
          },
          {
            "value": "ease-in-out",
            "label": "ease-in-out"
          }
        ]
      }
    ],
    "action": "Generate CSS",
    "extension": "css",
    "steps": [
      "Load the example or enter your own values.",
      "Choose the relevant options and run the tool.",
      "Review the result, then copy it or download a local file."
    ],
    "sections": [
      {
        "heading": "When this tool is useful",
        "body": "Prepare a small interface animation without rewriting the same keyframe structure. Choose a fade, slide, pulse or spin effect and adjust its duration and easing. The live preview demonstrates the generated motion, and the output includes an animation class plus named keyframes that can be copied into an existing stylesheet."
      },
      {
        "heading": "Reading the result and limitations",
        "body": "The preview repeats to make the motion easy to inspect, and the generated CSS uses the same infinite alternate behavior. A reduced-motion media query disables the animation for users who request less motion. Consider changing the iteration count for real interface feedback instead of looping indefinitely. Animation can create a stacking context and transform existing content, so review the result within your actual component layout. This generator does not modify the original stylesheet."
      }
    ],
    "faq": {
      "question": "What are the main limits of CSS Keyframes Animation Generator?",
      "answer": "The preview repeats to make the motion easy to inspect, and the generated CSS uses the same infinite alternate behavior. A reduced-motion media query disables the animation for users who request less motion. Consider changing the iteration count for real interface feedback instead of looping indefinitely. Animation can create a stacking context and transform existing content, so review the result within your actual component layout. This generator does not modify the original stylesheet."
    },
    "related": [
      "/tools/cubic-bezier-generator",
      "/tools/css-filter-generator"
    ],
    "modified": "2026-11-05"
  },
  {
    "slug": "css-triangle-generator",
    "title": "CSS Triangle Generator",
    "description": "Generate up, down, left or right CSS border triangles with adjustable dimensions, color and live preview.",
    "kind": "design",
    "example": "",
    "fields": [
      {
        "key": "direction",
        "label": "Direction",
        "default": "up",
        "type": "select",
        "options": [
          {
            "value": "up",
            "label": "Up"
          },
          {
            "value": "down",
            "label": "Down"
          },
          {
            "value": "left",
            "label": "Left"
          },
          {
            "value": "right",
            "label": "Right"
          }
        ]
      },
      {
        "key": "width",
        "label": "Width (px)",
        "default": "100",
        "type": "number",
        "min": 1,
        "max": 300,
        "step": "any"
      },
      {
        "key": "height",
        "label": "Height (px)",
        "default": "80",
        "type": "number",
        "min": 1,
        "max": 300,
        "step": "any"
      },
      {
        "key": "color",
        "label": "Color",
        "default": "#6366f1",
        "type": "color"
      }
    ],
    "action": "Generate CSS",
    "extension": "css",
    "steps": [
      "Load the example or enter your own values.",
      "Choose the relevant options and run the tool.",
      "Review the result, then copy it or download a local file."
    ],
    "sections": [
      {
        "heading": "When this tool is useful",
        "body": "Create a simple decorative pointer for a tooltip, speech bubble or dropdown. The technique uses a zero-size element with transparent borders on two sides and a colored border on another. Choose the direction, visible width and height, then inspect the preview before copying the generated declarations into a class or pseudo-element."
      },
      {
        "heading": "Reading the result and limitations",
        "body": "The visible triangle uses border geometry rather than an image file, so width and height declarations on the element itself remain zero. Surrounding layout still needs to account for the border box. A border triangle cannot contain readable text and should be treated as decoration rather than an interactive control on its own. Dimensions are limited to three hundred pixels per axis for the preview, and the color input accepts a six-digit hexadecimal value."
      }
    ],
    "faq": {
      "question": "What are the main limits of CSS Triangle Generator?",
      "answer": "The visible triangle uses border geometry rather than an image file, so width and height declarations on the element itself remain zero. Surrounding layout still needs to account for the border box. A border triangle cannot contain readable text and should be treated as decoration rather than an interactive control on its own. Dimensions are limited to three hundred pixels per axis for the preview, and the color input accepts a six-digit hexadecimal value."
    },
    "related": [
      "/tools/css-clip-path-generator",
      "/tools/css-border-radius-generator"
    ],
    "modified": "2026-11-05"
  },
  {
    "slug": "css-filter-generator",
    "title": "CSS Filter Generator",
    "description": "Combine blur, brightness, contrast, saturation, grayscale and hue rotation with a colorful CSS preview.",
    "kind": "design",
    "example": "",
    "fields": [
      {
        "key": "blur",
        "label": "Blur (px)",
        "default": "0",
        "type": "number",
        "min": 0,
        "max": 20,
        "step": "any"
      },
      {
        "key": "brightness",
        "label": "Brightness (%)",
        "default": "110",
        "type": "number",
        "min": 0,
        "max": 200,
        "step": "any"
      },
      {
        "key": "contrast",
        "label": "Contrast (%)",
        "default": "105",
        "type": "number",
        "min": 0,
        "max": 200,
        "step": "any"
      },
      {
        "key": "saturate",
        "label": "Saturation (%)",
        "default": "120",
        "type": "number",
        "min": 0,
        "max": 300,
        "step": "any"
      },
      {
        "key": "grayscale",
        "label": "Grayscale (%)",
        "default": "0",
        "type": "number",
        "min": 0,
        "max": 100,
        "step": "any"
      },
      {
        "key": "hue",
        "label": "Hue rotation (degrees)",
        "default": "20",
        "type": "number",
        "min": 0,
        "max": 360,
        "step": "any"
      }
    ],
    "action": "Generate CSS",
    "extension": "css",
    "steps": [
      "Load the example or enter your own values.",
      "Choose the relevant options and run the tool.",
      "Review the result, then copy it or download a local file."
    ],
    "sections": [
      {
        "heading": "When this tool is useful",
        "body": "Explore a CSS filter chain before adding it to an image or interface element. Adjust brightness, contrast, saturation and hue, then add grayscale or blur if needed. The preview uses a colorful sample so changes are visible without uploading a photo. The output is a complete class declaration containing the filter functions in a fixed, visible order."
      },
      {
        "heading": "Reading the result and limitations",
        "body": "Filter order affects the result, so the emitted chain should be kept intact when comparing the preview to your stylesheet. Filters apply to the element and its rendered descendants and can affect text as well as images. This is a browser rendering effect, not a downloadable edited image or an accurate color-calibration workflow. Blur can extend beyond an element’s bounds, and filtering may affect stacking behavior and rendering performance in a larger page."
      }
    ],
    "faq": {
      "question": "What are the main limits of CSS Filter Generator?",
      "answer": "Filter order affects the result, so the emitted chain should be kept intact when comparing the preview to your stylesheet. Filters apply to the element and its rendered descendants and can affect text as well as images. This is a browser rendering effect, not a downloadable edited image or an accurate color-calibration workflow. Blur can extend beyond an element’s bounds, and filtering may affect stacking behavior and rendering performance in a larger page."
    },
    "related": [
      "/tools/image-grayscale",
      "/tools/color-converter"
    ],
    "modified": "2026-11-05"
  },
  {
    "slug": "xlsx-to-csv",
    "title": "Excel XLSX to CSV Converter",
    "description": "Export a selected Excel worksheet as UTF-8 CSV, preserving text cells and using stored formula results.",
    "kind": "graphic",
    "server": {
      "input": "files",
      "accept": ".xlsx"
    },
    "example": "",
    "fields": [
      {
        "key": "sheet",
        "label": "Worksheet number (1-based)",
        "default": "1",
        "type": "number",
        "min": 1,
        "max": 100,
        "step": "1"
      }
    ],
    "action": "Convert on server",
    "extension": "csv",
    "steps": [
      "Choose the example or select your input files in the required format.",
      "Check the options, then select Convert on server to upload and process the input.",
      "Review the result and download the converted file."
    ],
    "sections": [
      {
        "heading": "What this conversion produces",
        "body": "Export one worksheet from an XLSX workbook for a data import or a quick inspection in a text editor. Select the worksheet by its one-based position. The output contains comma-separated UTF-8 cells with standard quoting for embedded commas, quotes and line breaks. Empty cells inside the used table remain empty instead of shifting later values to the left."
      },
      {
        "heading": "Supported input and practical limits",
        "body": "Only modern XLSX workbooks are accepted; legacy XLS and password-protected files are unsupported. Formulas are not executed and use cached results only, so a formula without a saved result is an error. Styling, charts, merged-cell geometry and macros are not exported. Files are limited to 2 MiB compressed, 32 MiB expanded ZIP content and 50,000 worksheet cells. Dates become ISO date-time strings rather than locale-specific spreadsheet displays."
      }
    ],
    "faq": {
      "question": "What should I know before converting?",
      "answer": "Only modern XLSX workbooks are accepted; legacy XLS and password-protected files are unsupported."
    },
    "related": [
      "/tools/xlsx-to-json",
      "/tools/csv-to-json"
    ],
    "modified": "2026-11-05"
  },
  {
    "slug": "json-to-xlsx",
    "title": "JSON to Excel XLSX Converter",
    "description": "Create an Excel workbook from a JSON array of flat records with typed numbers, booleans and literal text cells.",
    "kind": "graphic",
    "server": {
      "input": "text"
    },
    "example": "[{\"id\":\"001\",\"name\":\"Ada\",\"score\":95,\"active\":true},{\"id\":\"002\",\"name\":\"Grace\",\"score\":98,\"active\":false}]",
    "fields": [],
    "action": "Convert on server",
    "extension": "xlsx",
    "steps": [
      "Choose the example or select your input files in the required format.",
      "Check the options, then select Convert on server to upload and process the input.",
      "Review the result and download the converted file."
    ],
    "sections": [
      {
        "heading": "What this conversion produces",
        "body": "Turn a small API export into an editable spreadsheet without first flattening its values into CSV. Paste an array of records to create one worksheet with a header row. Headers are collected in first-seen order across the records. Text remains text, including leading-zero identifiers and strings beginning with an equals sign; numeric and boolean JSON values become native Excel cells."
      },
      {
        "heading": "Supported input and practical limits",
        "body": "Records must be flat objects containing strings, finite safe-range numbers, booleans or null. Nested arrays and objects require an explicit flattening decision and are rejected. Missing properties and null become empty cells. The table is limited to 50,000 cells and individual strings to Excel’s 32,767-character cell limit. This converter creates a new workbook and does not execute formulas, build charts or preserve a pre-existing workbook template."
      }
    ],
    "faq": {
      "question": "What should I know before converting?",
      "answer": "Records must be flat objects containing strings, finite safe-range numbers, booleans or null."
    },
    "related": [
      "/tools/xlsx-to-json",
      "/tools/json-to-csv"
    ],
    "modified": "2026-11-05"
  },
  {
    "slug": "xlsx-to-json",
    "title": "Excel XLSX to JSON Converter",
    "description": "Convert a selected XLSX worksheet into JSON records using its first row as unique property names.",
    "kind": "graphic",
    "server": {
      "input": "files",
      "accept": ".xlsx"
    },
    "example": "",
    "fields": [
      {
        "key": "sheet",
        "label": "Worksheet number (1-based)",
        "default": "1",
        "type": "number",
        "min": 1,
        "max": 100,
        "step": "1"
      }
    ],
    "action": "Convert on server",
    "extension": "json",
    "steps": [
      "Choose the example or select your input files in the required format.",
      "Check the options, then select Convert on server to upload and process the input.",
      "Review the result and download the converted file."
    ],
    "sections": [
      {
        "heading": "What this conversion produces",
        "body": "Read an Excel table as structured records for a test fixture, application import or review. The first worksheet row becomes the JSON property names and subsequent nonempty rows become objects. Numbers and booleans retain their types; empty cells become null. Choose a worksheet position when a workbook contains more than one sheet."
      },
      {
        "heading": "Supported input and practical limits",
        "body": "Header cells must be unique and nonblank, and the workbook must contain a rectangular table within 50,000 cells. Cell formatting does not change the underlying numeric value, so use real text cells for leading-zero identifiers. Dates are emitted as ISO strings. Stored formula results can be read, but formulas are never recalculated and missing cached results are rejected. XLS, encrypted workbooks and files above the documented ZIP limits are not supported."
      }
    ],
    "faq": {
      "question": "What should I know before converting?",
      "answer": "Header cells must be unique and nonblank, and the workbook must contain a rectangular table within 50,000 cells."
    },
    "related": [
      "/tools/json-to-xlsx",
      "/tools/xlsx-to-csv"
    ],
    "modified": "2026-11-05"
  },
  {
    "slug": "docx-converter",
    "title": "Word DOCX to HTML and Text Converter",
    "description": "Extract readable text or sanitized structural HTML from a DOCX document for publishing and content migration.",
    "kind": "graphic",
    "server": {
      "input": "files",
      "accept": ".docx"
    },
    "example": "",
    "fields": [
      {
        "key": "format",
        "label": "Output format",
        "default": "text",
        "type": "select",
        "options": [
          {
            "value": "text",
            "label": "Plain UTF-8 text"
          },
          {
            "value": "html",
            "label": "Sanitized HTML"
          }
        ]
      }
    ],
    "action": "Convert on server",
    "extension": "txt",
    "steps": [
      "Choose the example or select your input files in the required format.",
      "Check the options, then select Convert on server to upload and process the input.",
      "Review the result and download the converted file."
    ],
    "sections": [
      {
        "heading": "What this conversion produces",
        "body": "Recover the main written content of a modern Word document for an editor or publishing workflow. Plain-text mode removes document formatting, while HTML mode retains common paragraph, heading, list and table structure. HTML output is sanitized before download and is shown as source text rather than executed inside the tool."
      },
      {
        "heading": "Supported input and practical limits",
        "body": "This is content extraction rather than an exact rendering of Word pages. Images, precise fonts, floating shapes and page layout are not preserved. Legacy DOC, encrypted documents and externally linked files are unsupported. DOCX uploads are limited to 2 MiB compressed and 32 MiB expanded archive content. Embedded images are omitted from HTML output. Review conversion notes and the resulting structure before publishing, especially for complex tables and unusual document styles."
      }
    ],
    "faq": {
      "question": "What should I know before converting?",
      "answer": "This is content extraction rather than an exact rendering of Word pages."
    },
    "related": [
      "/tools/text-to-docx",
      "/tools/html-to-text"
    ],
    "modified": "2026-11-05"
  },
  {
    "slug": "pdf-merger",
    "title": "PDF Merger",
    "description": "Combine PDF documents into one download with an editable file order and no image rasterization. ",
    "kind": "graphic",
    "server": {
      "input": "files",
      "accept": ".pdf",
      "multiple": true
    },
    "example": "",
    "fields": [],
    "action": "Convert on server",
    "extension": "pdf",
    "steps": [
      "Choose the example or select your input files in the required format.",
      "Check the options, then select Convert on server to upload and process the input.",
      "Review the result and download the converted file."
    ],
    "sections": [
      {
        "heading": "What this conversion produces",
        "body": "Combine related PDF pages into a single document for sharing or archiving. Add at least two PDFs and use the file-list arrows to choose their order. Each source contributes all its pages in sequence. Page sizes and page content are copied, avoiding an unnecessary image conversion that would otherwise make selectable text harder to use."
      },
      {
        "heading": "Supported input and practical limits",
        "body": "This tool accepts up to eight unencrypted PDFs within a combined 4 MiB upload and a total of 200 pages. It copies pages rather than entire document-level structures, so bookmarks, signatures, attachments and interactive forms are not guaranteed to survive. Any modification invalidates existing digital signatures. The output is a new PDF; retain source documents when their original signatures or interactive behavior matter."
      }
    ],
    "faq": {
      "question": "What should I know before converting?",
      "answer": "This tool accepts up to eight unencrypted PDFs within a combined 4 MiB upload and a total of 200 pages."
    },
    "related": [
      "/tools/pdf-page-extractor",
      "/tools/pdf-rotate"
    ],
    "modified": "2026-11-05"
  },
  {
    "slug": "pdf-page-extractor",
    "title": "PDF Page Extractor",
    "description": "Extract selected PDF pages into a new document using page numbers and ranges in your chosen order. ",
    "kind": "graphic",
    "server": {
      "input": "files",
      "accept": ".pdf"
    },
    "example": "",
    "fields": [
      {
        "key": "pages",
        "label": "Pages and ranges (1-based)",
        "default": "1",
        "type": "text"
      }
    ],
    "action": "Convert on server",
    "extension": "pdf",
    "steps": [
      "Choose the example or select your input files in the required format.",
      "Check the options, then select Convert on server to upload and process the input.",
      "Review the result and download the converted file."
    ],
    "sections": [
      {
        "heading": "What this conversion produces",
        "body": "Create a smaller PDF containing only the pages needed for a particular task. Enter a comma-separated list such as 1,3-5 to copy individual pages or inclusive ranges. Selections are processed in the order entered, allowing a custom output sequence. Repeated pages are rejected so an accidental repeated range does not silently duplicate a section."
      },
      {
        "heading": "Supported input and practical limits",
        "body": "Page numbers are one-based and must refer to existing pages. The result is one PDF containing the selected pages, not a ZIP of individual page files. Up to 200 source pages and 4 MiB combined input are supported. Encrypted PDFs are rejected. Page copying may omit document-level bookmarks, attachments and form relationships, and the new file does not retain the validity of any digital signature on the source."
      }
    ],
    "faq": {
      "question": "What should I know before converting?",
      "answer": "Page numbers are one-based and must refer to existing pages."
    },
    "related": [
      "/tools/pdf-merger",
      "/tools/pdf-page-numbers"
    ],
    "modified": "2026-11-05"
  },
  {
    "slug": "pdf-rotate",
    "title": "PDF Page Rotation Tool",
    "description": "Rotate all pages of a PDF clockwise by 90, 180 or 270 degrees while keeping text and vectors. ",
    "kind": "graphic",
    "server": {
      "input": "files",
      "accept": ".pdf"
    },
    "example": "",
    "fields": [
      {
        "key": "angle",
        "label": "Clockwise rotation",
        "default": "90",
        "type": "select",
        "options": [
          {
            "value": "90",
            "label": "90°"
          },
          {
            "value": "180",
            "label": "180°"
          },
          {
            "value": "270",
            "label": "270°"
          }
        ]
      }
    ],
    "action": "Convert on server",
    "extension": "pdf",
    "steps": [
      "Choose the example or select your input files in the required format.",
      "Check the options, then select Convert on server to upload and process the input.",
      "Review the result and download the converted file."
    ],
    "sections": [
      {
        "heading": "What this conversion produces",
        "body": "Correct a PDF whose scanned or exported pages face the wrong direction. Choose a clockwise quarter-turn and apply it to all pages. The operation updates page rotation metadata rather than rasterizing page contents, preserving ordinary selectable text and vector artwork. Existing page rotation is taken into account instead of being overwritten with an unrelated absolute orientation."
      },
      {
        "heading": "Supported input and practical limits",
        "body": "Rotation applies to the entire document; extract a subset first if only some pages need correction. The maximum is 200 pages and 4 MiB of unencrypted PDF input. Interactive features may behave differently in viewers after an edit, and existing digital signatures will no longer validate. This tool changes viewing orientation rather than performing OCR, straightening a slightly skewed scan or changing the physical paper size."
      }
    ],
    "faq": {
      "question": "What should I know before converting?",
      "answer": "Rotation applies to the entire document; extract a subset first if only some pages need correction."
    },
    "related": [
      "/tools/pdf-page-extractor",
      "/tools/pdf-resize"
    ],
    "modified": "2026-11-05"
  },
  {
    "slug": "pdf-metadata-remover",
    "title": "PDF Metadata Remover",
    "description": "Remove the PDF information dictionary and catalog XMP metadata while keeping the document pages. ",
    "kind": "graphic",
    "server": {
      "input": "files",
      "accept": ".pdf"
    },
    "example": "",
    "fields": [],
    "action": "Convert on server",
    "extension": "pdf",
    "steps": [
      "Choose the example or select your input files in the required format.",
      "Check the options, then select Convert on server to upload and process the input.",
      "Review the result and download the converted file."
    ],
    "sections": [
      {
        "heading": "What this conversion produces",
        "body": "Create a copy of a PDF without its standard document-information dictionary and catalog-level XMP metadata stream. Those structures commonly contain title, author, producer and creation details. The tool rewrites the document without adding fresh informational metadata, then returns the resulting PDF for download."
      },
      {
        "heading": "Supported input and practical limits",
        "body": "Metadata removal is not anonymization or redaction. Names may remain in visible page text, images, annotations, attachments, form fields, embedded fonts or application-specific objects. This tool does not inspect or remove those other locations. Existing digital signatures become invalid when the file is rewritten. Only unencrypted PDFs up to 200 pages and 4 MiB are supported. Inspect the output with an independent metadata viewer when the result will be shared publicly."
      }
    ],
    "faq": {
      "question": "What should I know before converting?",
      "answer": "Metadata removal is not anonymization or redaction."
    },
    "related": [
      "/tools/pdf-watermark",
      "/tools/pdf-page-extractor"
    ],
    "modified": "2026-11-05"
  },
  {
    "slug": "pdf-resize",
    "title": "PDF Page Size Converter",
    "description": "Fit PDF page artwork onto A4 or Letter paper with preserved proportions and configurable margins. ",
    "kind": "graphic",
    "server": {
      "input": "files",
      "accept": ".pdf"
    },
    "example": "",
    "fields": [
      {
        "key": "paper",
        "label": "Target paper",
        "default": "a4",
        "type": "select",
        "options": [
          {
            "value": "a4",
            "label": "A4 portrait"
          },
          {
            "value": "letter",
            "label": "US Letter portrait"
          }
        ]
      },
      {
        "key": "margin",
        "label": "Margin (points)",
        "default": "24",
        "type": "number",
        "min": 0,
        "max": 100,
        "step": "1"
      }
    ],
    "action": "Convert on server",
    "extension": "pdf",
    "steps": [
      "Choose the example or select your input files in the required format.",
      "Check the options, then select Convert on server to upload and process the input.",
      "Review the result and download the converted file."
    ],
    "sections": [
      {
        "heading": "What this conversion produces",
        "body": "Normalize a collection of differently sized PDF pages before printing or combining them with a standard report. Each source page is embedded as artwork on a new A4 or Letter page. The converter scales the content proportionally and centers it within the chosen margin rather than stretching text or cutting off the source rectangle."
      },
      {
        "heading": "Supported input and practical limits",
        "body": "This creates new pages from page artwork. Interactive annotations, forms, links and document-level features are not carried over as interactive objects. Existing rotation is handled when positioning the artwork. The output has portrait paper dimensions; embedded source pages may be landscape within that frame. Input is limited to 200 unencrypted pages and 4 MiB. This is a page-fit operation, not a guaranteed reduction in file size."
      }
    ],
    "faq": {
      "question": "What should I know before converting?",
      "answer": "This creates new pages from page artwork."
    },
    "related": [
      "/tools/pdf-merger",
      "/tools/pdf-rotate"
    ],
    "modified": "2026-11-05"
  },
  {
    "slug": "text-to-pdf",
    "title": "Text to PDF Converter",
    "description": "Create a paginated PDF from plain text with an embedded font supporting Latin and Cyrillic characters.",
    "kind": "graphic",
    "server": {
      "input": "text"
    },
    "example": "Meeting notes\n\nHello, world!\nВітаємо! Це приклад тексту українською.\n\nThis document is generated from plain text.",
    "fields": [
      {
        "key": "fontSize",
        "label": "Font size (points)",
        "default": "12",
        "type": "number",
        "min": 8,
        "max": 24,
        "step": "1"
      }
    ],
    "action": "Convert on server",
    "extension": "pdf",
    "steps": [
      "Choose the example or select your input files in the required format.",
      "Check the options, then select Convert on server to upload and process the input.",
      "Review the result and download the converted file."
    ],
    "sections": [
      {
        "heading": "What this conversion produces",
        "body": "Turn notes or a short plain-text export into a PDF that can be viewed consistently across devices. Text is wrapped to an A4 page with fixed margins and additional pages are added as needed. A bundled Noto Sans font is embedded in the document, supporting common Latin and Cyrillic text rather than relying on a font installed on the reader’s computer."
      },
      {
        "heading": "Supported input and practical limits",
        "body": "Input is plain text, not HTML or Markdown. The converter supports left-to-right text and rejects unsupported font characters and control codes instead of substituting missing-glyph boxes. Complex scripts, emoji, rich layout and right-to-left shaping are outside its scope. Tabs become spaces and explicit line breaks are retained. Text is limited to 20,000 characters and output to 50 pages. Review the PDF before sharing if exact typography is important."
      }
    ],
    "faq": {
      "question": "What should I know before converting?",
      "answer": "Input is plain text, not HTML or Markdown."
    },
    "related": [
      "/tools/text-to-docx",
      "/tools/pdf-page-numbers"
    ],
    "modified": "2026-11-05"
  },
  {
    "slug": "pdf-watermark",
    "title": "PDF Text Watermark Tool",
    "description": "Add a centered text watermark to every PDF page with adjustable opacity and an embedded Unicode font. ",
    "kind": "graphic",
    "server": {
      "input": "files",
      "accept": ".pdf"
    },
    "example": "",
    "fields": [
      {
        "key": "text",
        "label": "Watermark text",
        "default": "DRAFT",
        "type": "text"
      },
      {
        "key": "opacity",
        "label": "Opacity (%)",
        "default": "20",
        "type": "number",
        "min": 5,
        "max": 100,
        "step": "1"
      }
    ],
    "action": "Convert on server",
    "extension": "pdf",
    "steps": [
      "Choose the example or select your input files in the required format.",
      "Check the options, then select Convert on server to upload and process the input.",
      "Review the result and download the converted file."
    ],
    "sections": [
      {
        "heading": "What this conversion produces",
        "body": "Mark a review copy or identify the intended use of a document with a visible text overlay. Enter a short watermark and choose its opacity. The tool adds the same centered, diagonal mark to every page using an embedded font. The existing page content remains beneath the overlay and is not converted into an image."
      },
      {
        "heading": "Supported input and practical limits",
        "body": "A watermark is not encryption, ownership proof or access control, and it does not prevent copying or editing. The text is limited to 80 supported left-to-right characters and scales to fit the page. Existing page rotations affect the visual placement in some viewers, so inspect the output. Input must be unencrypted PDF within 200 pages and 4 MiB, and modification invalidates existing digital signatures."
      }
    ],
    "faq": {
      "question": "What should I know before converting?",
      "answer": "A watermark is not encryption, ownership proof or access control, and it does not prevent copying or editing."
    },
    "related": [
      "/tools/image-watermark",
      "/tools/pdf-page-numbers"
    ],
    "modified": "2026-11-05"
  },
  {
    "slug": "pdf-page-numbers",
    "title": "Add Page Numbers to PDF",
    "description": "Add sequential footer page numbers to a PDF with a custom starting number and adjustable text size. ",
    "kind": "graphic",
    "server": {
      "input": "files",
      "accept": ".pdf"
    },
    "example": "",
    "fields": [
      {
        "key": "start",
        "label": "First printed number",
        "default": "1",
        "type": "number",
        "min": 0,
        "max": 999999,
        "step": "1"
      },
      {
        "key": "fontSize",
        "label": "Number size (points)",
        "default": "11",
        "type": "number",
        "min": 8,
        "max": 24,
        "step": "1"
      }
    ],
    "action": "Convert on server",
    "extension": "pdf",
    "steps": [
      "Choose the example or select your input files in the required format.",
      "Check the options, then select Convert on server to upload and process the input.",
      "Review the result and download the converted file."
    ],
    "sections": [
      {
        "heading": "What this conversion produces",
        "body": "Prepare a printable reference copy by adding visible page numbers to the bottom of each page. Choose the starting number to continue numbering from an earlier section. The footer is centered on the page’s unrotated coordinate area and uses an embedded font, while the underlying text and artwork remain available as PDF content."
      },
      {
        "heading": "Supported input and practical limits",
        "body": "Numbers are new page content and do not update PDF page-label metadata, tables of contents or existing printed numbering. The converter does not erase an old footer, so check that it will not cover important content. Rotated or unusually cropped documents need visual review. Input is limited to 200 unencrypted PDF pages and 4 MiB. Like other edits, adding numbers invalidates any original digital signatures."
      }
    ],
    "faq": {
      "question": "What should I know before converting?",
      "answer": "Numbers are new page content and do not update PDF page-label metadata, tables of contents or existing printed numbering."
    },
    "related": [
      "/tools/pdf-merger",
      "/tools/pdf-page-extractor"
    ],
    "modified": "2026-11-05"
  },
  {
    "slug": "image-to-avif",
    "title": "Image to AVIF Converter",
    "description": "Convert a PNG, JPEG or WebP image into AVIF with adjustable quality and preserved transparency where supported. ",
    "kind": "graphic",
    "server": {
      "input": "files",
      "accept": ".png,.jpg,.jpeg,.webp"
    },
    "example": "",
    "fields": [
      {
        "key": "quality",
        "label": "AVIF quality",
        "default": "60",
        "type": "number",
        "min": 1,
        "max": 100,
        "step": "1"
      }
    ],
    "action": "Convert on server",
    "extension": "avif",
    "steps": [
      "Choose the example or select your input files in the required format.",
      "Check the options, then select Convert on server to upload and process the input.",
      "Review the result and download the converted file."
    ],
    "sections": [
      {
        "heading": "What this conversion produces",
        "body": "Create an AVIF version of an existing raster asset for a modern web workflow. Upload a PNG, JPEG or WebP and choose an encoder quality level. The converter applies orientation metadata before encoding and produces a single AVIF image. Transparent source pixels remain transparent rather than being flattened onto a background."
      },
      {
        "heading": "Supported input and practical limits",
        "body": "The output is a still image; animated formats and unsupported input types are rejected. Uploads are limited to 4 MiB and decoded images to 16 million pixels. Encoding can change color and detail, and a higher quality value can produce a larger file. Source metadata is not copied by default. Compare the downloaded image to the original and provide fallback assets where the target software does not support AVIF."
      }
    ],
    "faq": {
      "question": "What should I know before converting?",
      "answer": "The output is a still image; animated formats and unsupported input types are rejected."
    },
    "related": [
      "/tools/image-format-converter",
      "/tools/image-compressor"
    ],
    "modified": "2026-11-05"
  },
  {
    "slug": "tiff-to-image",
    "title": "TIFF to PNG and JPEG Converter",
    "description": "Extract a selected TIFF page as PNG or JPEG with explicit page selection and white-backed JPEG output. ",
    "kind": "graphic",
    "server": {
      "input": "files",
      "accept": ".tif,.tiff"
    },
    "example": "",
    "fields": [
      {
        "key": "page",
        "label": "TIFF page (1-based)",
        "default": "1",
        "type": "number",
        "min": 1,
        "max": 100,
        "step": "1"
      },
      {
        "key": "format",
        "label": "Output",
        "default": "png",
        "type": "select",
        "options": [
          {
            "value": "png",
            "label": "PNG"
          },
          {
            "value": "jpeg",
            "label": "JPEG"
          }
        ]
      }
    ],
    "action": "Convert on server",
    "extension": "png",
    "steps": [
      "Choose the example or select your input files in the required format.",
      "Check the options, then select Convert on server to upload and process the input.",
      "Review the result and download the converted file."
    ],
    "sections": [
      {
        "heading": "What this conversion produces",
        "body": "Convert a scan or a TIFF image into a format that is easier to view in ordinary applications. Select one page from a multipage TIFF and choose PNG or JPEG. PNG is suitable when retaining transparency matters; JPEG output is flattened onto white so transparent regions do not unexpectedly become black."
      },
      {
        "heading": "Supported input and practical limits",
        "body": "One conversion produces one selected page, not a combined document or archive. TIFF codecs supported by the installed image engine are accepted, with a maximum of 4 MiB input and 16 million decoded pixels for the chosen page. Unsupported compression and invalid page numbers result in errors. Color conversion may change specialized scientific or print-oriented data, so retain the original TIFF for workflows that require its bit depth, channels or calibration metadata."
      }
    ],
    "faq": {
      "question": "What should I know before converting?",
      "answer": "One conversion produces one selected page, not a combined document or archive."
    },
    "related": [
      "/tools/image-to-avif",
      "/tools/image-format-converter"
    ],
    "modified": "2026-11-05"
  },
  {
    "slug": "gif-sprite-sheet",
    "title": "GIF to Sprite Sheet Converter",
    "description": "Arrange decoded GIF frames into a transparent PNG sprite sheet with configurable columns. ",
    "kind": "graphic",
    "server": {
      "input": "files",
      "accept": ".gif"
    },
    "example": "",
    "fields": [
      {
        "key": "columns",
        "label": "Columns",
        "default": "4",
        "type": "number",
        "min": 1,
        "max": 16,
        "step": "1"
      }
    ],
    "action": "Convert on server",
    "extension": "png",
    "steps": [
      "Choose the example or select your input files in the required format.",
      "Check the options, then select Convert on server to upload and process the input.",
      "Review the result and download the converted file."
    ],
    "sections": [
      {
        "heading": "What this conversion produces",
        "body": "Turn an animated GIF into one PNG atlas for a game prototype, animation inspection or frame-based workflow. The decoder composites GIF frames to full canvases before arranging them in reading order, left to right and then top to bottom. Choose the column count to control the layout; unused cells in the final row remain transparent."
      },
      {
        "heading": "Supported input and practical limits",
        "body": "The output contains frame pixels only. It does not preserve frame delays, looping rules or animation playback code. The converter supports up to 64 frames and a total decoded frame and output area of 16 million pixels, within a 4 MiB upload. Uneven final rows add transparent space to the sheet. A sprite sheet can be larger than the original compressed GIF, so this is a layout conversion rather than a compression tool."
      }
    ],
    "faq": {
      "question": "What should I know before converting?",
      "answer": "The output contains frame pixels only."
    },
    "related": [
      "/tools/image-cropper",
      "/tools/image-format-converter"
    ],
    "modified": "2026-11-05"
  },
  {
    "slug": "json5-to-json",
    "title": "JSON5 to JSON Converter",
    "description": "Convert JSON5 comments, trailing commas, unquoted keys and single-quoted strings into strict formatted JSON.",
    "kind": "graphic",
    "server": {
      "input": "text"
    },
    "example": "// Development settings\n{ app: 'Utilixio', enabled: true, ports: [3000, 3001,], }",
    "fields": [],
    "action": "Convert on server",
    "extension": "json",
    "steps": [
      "Choose the example or select your input files in the required format.",
      "Check the options, then select Convert on server to upload and process the input.",
      "Review the result and download the converted file."
    ],
    "sections": [
      {
        "heading": "What this conversion produces",
        "body": "Clean a JSON5 configuration for a program that accepts only strict JSON. The parser supports familiar JSON5 conveniences such as comments, trailing commas and quoted or unquoted object keys, then writes a consistently formatted JSON document. This is useful when moving a development configuration into a stricter import interface."
      },
      {
        "heading": "Supported input and practical limits",
        "body": "Only values that strict JSON can represent are accepted. Non-finite numbers and unsafe integer magnitudes are rejected rather than silently converted to null or rounded. Comments and original formatting are intentionally discarded in the output. Duplicate object keys follow the JSON5 parser’s last-value behavior, so review configurations where repeated keys may be significant. Input is limited to 2 MiB of text with bounded object depth."
      }
    ],
    "faq": {
      "question": "What should I know before converting?",
      "answer": "Only values that strict JSON can represent are accepted."
    },
    "related": [
      "/tools/json-validator",
      "/tools/json-formatter"
    ],
    "modified": "2026-11-05"
  },
  {
    "slug": "json-to-toml",
    "title": "JSON to TOML Converter",
    "description": "Convert JSON configuration objects into TOML tables with typed tables and explicit checks for unsupported null values.",
    "kind": "graphic",
    "server": {
      "input": "text"
    },
    "example": "{\"app\":{\"name\":\"Utilixio\",\"enabled\":true},\"server\":{\"port\":3000,\"hosts\":[\"localhost\",\"example.com\"]}}",
    "fields": [],
    "action": "Convert on server",
    "extension": "toml",
    "steps": [
      "Choose the example or select your input files in the required format.",
      "Check the options, then select Convert on server to upload and process the input.",
      "Review the result and download the converted file."
    ],
    "sections": [
      {
        "heading": "What this conversion produces",
        "body": "Prepare TOML configuration from a JSON object while retaining nested tables, strings, booleans and finite numbers. Paste the configuration and download a TOML file that can be reviewed in a text editor. Property names are handled by the serializer rather than manually concatenated, which helps preserve punctuation and escape characters in keys and string values."
      },
      {
        "heading": "Supported input and practical limits",
        "body": "TOML has no null value, so null anywhere in the input is rejected. The root must be an object, and the serializer determines which arrays and nested structures are representable. Numbers must stay within JavaScript’s safe integer range when integral; larger identifiers should be strings. This converter does not infer date-time values from strings. The text limit is 2 MiB with a maximum nesting depth of 32."
      }
    ],
    "faq": {
      "question": "What should I know before converting?",
      "answer": "TOML has no null value, so null anywhere in the input is rejected."
    },
    "related": [
      "/tools/toml-to-json",
      "/tools/json-to-yaml"
    ],
    "modified": "2026-11-05"
  },
  {
    "slug": "text-encoding-converter",
    "title": "Text File Encoding Converter",
    "description": "Convert text files between UTF-8, UTF-16, Windows-1251, Windows-1252 and Shift JIS with loss checks. ",
    "kind": "graphic",
    "server": {
      "input": "files",
      "accept": ".txt,.csv,.json,.xml,.srt,.log"
    },
    "example": "",
    "fields": [
      {
        "key": "from",
        "label": "Source encoding",
        "default": "utf8",
        "type": "select",
        "options": [
          {
            "value": "utf8",
            "label": "UTF-8"
          },
          {
            "value": "utf16le",
            "label": "UTF-16 little-endian"
          },
          {
            "value": "utf16be",
            "label": "UTF-16 big-endian"
          },
          {
            "value": "win1251",
            "label": "Windows-1251"
          },
          {
            "value": "win1252",
            "label": "Windows-1252"
          },
          {
            "value": "shift_jis",
            "label": "Shift JIS"
          }
        ]
      },
      {
        "key": "to",
        "label": "Target encoding",
        "default": "utf16le",
        "type": "select",
        "options": [
          {
            "value": "utf8",
            "label": "UTF-8"
          },
          {
            "value": "utf16le",
            "label": "UTF-16 little-endian"
          },
          {
            "value": "utf16be",
            "label": "UTF-16 big-endian"
          },
          {
            "value": "win1251",
            "label": "Windows-1251"
          },
          {
            "value": "win1252",
            "label": "Windows-1252"
          },
          {
            "value": "shift_jis",
            "label": "Shift JIS"
          }
        ]
      }
    ],
    "action": "Convert on server",
    "extension": "txt",
    "steps": [
      "Choose the example or select your input files in the required format.",
      "Check the options, then select Convert on server to upload and process the input.",
      "Review the result and download the converted file."
    ],
    "sections": [
      {
        "heading": "What this conversion produces",
        "body": "Fix a file whose encoding does not match the application that needs to read it. Select the source charset explicitly, then choose the target charset. This helps prepare legacy CSV imports, text exports and configuration files. The converter checks whether decoding and re-encoding can preserve the source and whether the target can represent the resulting characters."
      },
      {
        "heading": "Supported input and practical limits",
        "body": "Encoding detection is not guessed automatically: selecting the wrong but technically valid source charset can still produce incorrect text. Lossy target conversion and malformed source bytes are rejected using a roundtrip check. A leading byte-order mark is treated as an encoding signature rather than text. Output uses no BOM, so select the charset explicitly when importing it. Input is limited to 4 MiB and decoded text to two million characters."
      }
    ],
    "faq": {
      "question": "What should I know before converting?",
      "answer": "Encoding detection is not guessed automatically: selecting the wrong but technically valid source charset can still produce incorrect text."
    },
    "related": [
      "/tools/unicode-normalizer",
      "/tools/unicode-escape"
    ],
    "modified": "2026-11-05"
  },
  {
    "slug": "text-to-docx",
    "title": "Text to Word DOCX Converter",
    "description": "Create an editable DOCX document from plain text with paragraph and line-break preservation.",
    "kind": "graphic",
    "server": {
      "input": "text"
    },
    "example": "Project notes\n\nHello, world!\nВітаємо! Текст залишиться редагованим.\n\nNext steps:\nReview the draft.\nShare the document.",
    "fields": [],
    "action": "Convert on server",
    "extension": "docx",
    "steps": [
      "Choose the example or select your input files in the required format.",
      "Check the options, then select Convert on server to upload and process the input.",
      "Review the result and download the converted file."
    ],
    "sections": [
      {
        "heading": "What this conversion produces",
        "body": "Move plain notes into an editable Word document without manually copying them into a desktop editor. The output is a new DOCX containing normal paragraphs and explicit line breaks based on the source text. Unicode text is kept as document text, allowing an installed word processor to choose suitable fonts when the file is opened."
      },
      {
        "heading": "Supported input and practical limits",
        "body": "Input is plain text rather than HTML or Markdown, and formatting markers are not interpreted. Two consecutive line breaks separate paragraphs; a single line break remains within a paragraph. The converter does not create images, tables, headers, tracked changes or a template-specific layout. Text is limited to 20,000 characters and invalid XML control characters are rejected. Document appearance can vary with the fonts available on the reader’s device."
      }
    ],
    "faq": {
      "question": "What should I know before converting?",
      "answer": "Input is plain text rather than HTML or Markdown, and formatting markers are not interpreted."
    },
    "related": [
      "/tools/docx-converter",
      "/tools/text-to-pdf"
    ],
    "modified": "2026-11-05"
  },
  {
    "slug": "stereo-to-mono-wav",
    "title": "Stereo to Mono WAV Converter",
    "description": "Mix stereo WAV audio into a mono 16-bit PCM WAV file while preserving its sample rate. ",
    "kind": "graphic",
    "server": {
      "input": "files",
      "accept": ".wav"
    },
    "example": "",
    "fields": [],
    "action": "Convert on server",
    "extension": "wav",
    "steps": [
      "Choose the example or select your input files in the required format.",
      "Check the options, then select Convert on server to upload and process the input.",
      "Review the result and download the converted file."
    ],
    "sections": [
      {
        "heading": "What this conversion produces",
        "body": "Create a mono version of a two-channel WAV recording for an audio workflow that expects one channel. Each output sample is the average of the left and right source samples, avoiding the doubling in level caused by simply adding channels. The output uses signed 16-bit PCM and retains the original sample rate. Mono input can also be normalized to the same output format."
      },
      {
        "heading": "Supported input and practical limits",
        "body": "Supported sources are uncompressed RIFF/WAVE PCM with 8-, 16-, 24- or 32-bit integer samples, or 32-bit IEEE float, with one or two channels. MP3, AAC, WAVE extensible, compressed WAV and RF64 are not decoded. Invalid non-finite samples are rejected. Input and output are capped at 4 MiB. Averaging phase-opposed stereo channels can reduce or cancel sound, so listen to the result before replacing a source recording."
      }
    ],
    "faq": {
      "question": "What should I know before converting?",
      "answer": "Supported sources are uncompressed RIFF/WAVE PCM with 8-, 16-, 24- or 32-bit integer samples, or 32-bit IEEE float, with one or two channels."
    },
    "related": [
      "/tools/file-checksum",
      "/tools/file-to-base64"
    ],
    "modified": "2026-11-05"
  },
  {
    "slug": "pdf-to-text",
    "title": "PDF to Text Converter",
    "description": "Extract selectable text from PDF pages into a UTF-8 text file without OCR or uploading to an external conversion provider.",
    "kind": "graphic",
    "server": {
      "input": "files",
      "accept": ".pdf"
    },
    "fields": [],
    "example": "",
    "action": "Convert on server",
    "extension": "txt",
    "steps": [
      "Load the working example or provide your own input.",
      "Review the format options, then select Convert on server to process the input.",
      "Check the result and download the output file."
    ],
    "sections": [
      {
        "heading": "What this tool does",
        "body": "Recover selectable text from a report, document or exported PDF for searching and editing. The converter reads text items in the order supplied by the PDF engine and keeps explicit line endings where available. Pages are separated by a form-feed character so a downstream editor or script can distinguish their boundaries without adding visible page headings to the content."
      },
      {
        "heading": "Supported formats and limits",
        "body": "This does not perform optical character recognition. A scan containing only images can produce an empty result. Columns, ligatures and unusual font encodings can affect reading order and spacing, so compare extracted text with the original before relying on it. Password-protected PDFs are unsupported. Input is limited to 4 MiB and 200 pages; processing is stopped if it exceeds the server worker time or memory allowance."
      }
    ],
    "faq": {
      "question": "What should I check before using the result?",
      "answer": "This does not perform optical character recognition."
    },
    "related": [
      "/tools/pdf-to-image",
      "/tools/docx-converter"
    ],
    "modified": "2026-11-06"
  },
  {
    "slug": "pdf-to-image",
    "title": "PDF to PNG and JPEG Converter",
    "description": "Render a selected PDF page as PNG or JPEG at 72 or 144 DPI with the page’s viewing rotation applied.",
    "kind": "graphic",
    "server": {
      "input": "files",
      "accept": ".pdf"
    },
    "fields": [
      {
        "key": "page",
        "label": "Page number",
        "default": "1",
        "type": "number",
        "min": 1,
        "max": 200,
        "step": "any"
      },
      {
        "key": "dpi",
        "label": "Resolution",
        "default": "144",
        "type": "select",
        "options": [
          {
            "value": "72",
            "label": "72 DPI"
          },
          {
            "value": "144",
            "label": "144 DPI"
          }
        ]
      },
      {
        "key": "format",
        "label": "Image format",
        "default": "png",
        "type": "select",
        "options": [
          {
            "value": "png",
            "label": "PNG"
          },
          {
            "value": "jpeg",
            "label": "JPEG"
          }
        ]
      }
    ],
    "example": "",
    "action": "Convert on server",
    "extension": "png",
    "steps": [
      "Load the working example or provide your own input.",
      "Review the format options, then select Convert on server to process the input.",
      "Check the result and download the output file."
    ],
    "sections": [
      {
        "heading": "What this tool does",
        "body": "Create a raster image of one PDF page for a presentation, thumbnail or review workflow. Choose its one-based page number and output resolution. The PDF renderer applies page orientation and draws onto a white background before the result is encoded. PNG retains sharp line work without JPEG compression artifacts, while JPEG can be convenient for photographic pages."
      },
      {
        "heading": "Supported formats and limits",
        "body": "The result is an image with no selectable text or interactive links. Each conversion renders one page, not a full archive of page files. Input must be an unencrypted PDF up to 4 MiB and 200 pages, and the rendered surface must stay within 16 million pixels. Fonts, transparency and complex drawing features can vary across renderers. Inspect the downloaded page before using it as an exact visual record."
      }
    ],
    "faq": {
      "question": "What should I check before using the result?",
      "answer": "The result is an image with no selectable text or interactive links."
    },
    "related": [
      "/tools/pdf-contact-sheet",
      "/tools/image-to-pdf"
    ],
    "modified": "2026-11-06"
  },
  {
    "slug": "pdf-contact-sheet",
    "title": "PDF Contact Sheet Generator",
    "description": "Create a PNG overview of PDF pages arranged as thumbnails in a readable grid.",
    "kind": "graphic",
    "server": {
      "input": "files",
      "accept": ".pdf"
    },
    "fields": [
      {
        "key": "columns",
        "label": "Columns",
        "default": "3",
        "type": "number",
        "min": 1,
        "max": 6,
        "step": "any"
      },
      {
        "key": "thumbWidth",
        "label": "Thumbnail width (px)",
        "default": "180",
        "type": "number",
        "min": 80,
        "max": 400,
        "step": "any"
      }
    ],
    "example": "",
    "action": "Convert on server",
    "extension": "png",
    "steps": [
      "Load the working example or provide your own input.",
      "Review the format options, then select Convert on server to process the input.",
      "Check the result and download the output file."
    ],
    "sections": [
      {
        "heading": "What this tool does",
        "body": "Review a short PDF at a glance without opening every page individually. The tool renders page thumbnails in document order, then places them left to right and top to bottom on a white PNG sheet. Portrait and landscape pages fit inside the same thumbnail boxes, making the sheet useful for spotting page order, blank pages or repeated material."
      },
      {
        "heading": "Supported formats and limits",
        "body": "The sheet is a visual overview rather than a high-resolution replacement for the PDF. It supports at most twenty unencrypted pages and a 4 MiB upload. The output grid is limited to 16 million pixels, and thumbnails are fitted without stretching. Page text may be too small to read at reduced size. Use the separate PDF page-to-image converter when you need a full-resolution image of a specific page."
      }
    ],
    "faq": {
      "question": "What should I check before using the result?",
      "answer": "The sheet is a visual overview rather than a high-resolution replacement for the PDF."
    },
    "related": [
      "/tools/pdf-to-image",
      "/tools/image-contact-sheet"
    ],
    "modified": "2026-11-06"
  },
  {
    "slug": "pdf-form-to-json",
    "title": "PDF Form Fields to JSON",
    "description": "Export AcroForm field names, current values, types and choices from a fillable PDF into JSON.",
    "kind": "graphic",
    "server": {
      "input": "files",
      "accept": ".pdf"
    },
    "fields": [],
    "example": "",
    "action": "Convert on server",
    "extension": "json",
    "steps": [
      "Load the working example or provide your own input.",
      "Review the format options, then select Convert on server to process the input.",
      "Check the result and download the output file."
    ],
    "sections": [
      {
        "heading": "What this tool does",
        "body": "Inspect a fillable PDF before automating its completion. The report contains a values object and a field list with field names, types, read-only state and available choices where applicable. Text, checkboxes, radio groups, dropdowns and option lists are represented separately so their value types remain clear. The values object can be used as a starting point for the form-filling tool."
      },
      {
        "heading": "Supported formats and limits",
        "body": "This reads existing AcroForm fields, not text printed on an ordinary page or fields guessed from a scanned form. A PDF without form fields returns an empty collection. Signature fields and buttons are described without extracting cryptographic signature data. Password-protected and XFA-based workflows are unsupported. Input is limited to 4 MiB and 200 pages, and exported values are handled as server conversion data rather than saved to a history."
      }
    ],
    "faq": {
      "question": "What should I check before using the result?",
      "answer": "This reads existing AcroForm fields, not text printed on an ordinary page or fields guessed from a scanned form."
    },
    "related": [
      "/tools/pdf-form-filler",
      "/tools/pdf-to-text"
    ],
    "modified": "2026-11-06"
  },
  {
    "slug": "pdf-form-filler",
    "title": "Fill PDF Form from JSON",
    "description": "Fill existing PDF text fields, checkboxes and choice fields using a JSON map of field names and values.",
    "kind": "graphic",
    "server": {
      "input": "files",
      "accept": ".pdf",
      "textLabel": "Field values as a JSON object"
    },
    "fields": [
      {
        "key": "flatten",
        "label": "Output form",
        "default": "false",
        "type": "select",
        "options": [
          {
            "value": "false",
            "label": "Keep editable fields"
          },
          {
            "value": "true",
            "label": "Flatten fields into page artwork"
          }
        ]
      }
    ],
    "example": "{\"name\":\"Grace Hopper\",\"subscribed\":true}",
    "action": "Convert on server",
    "extension": "pdf",
    "steps": [
      "Load the working example or provide your own input.",
      "Review the format options, then select Convert on server to process the input.",
      "Check the result and download the output file."
    ],
    "sections": [
      {
        "heading": "What this tool does",
        "body": "Complete a small fillable PDF by pasting a JSON object whose keys match its AcroForm field names. String values fill text fields, booleans set checkboxes, and valid option names select dropdown, list or radio choices. Inspect the field-export tool first when you do not know the exact names or choices. No new fields are guessed or added to ordinary page text."
      },
      {
        "heading": "Supported formats and limits",
        "body": "Unknown, read-only and unsupported field types are rejected, as are choices outside the field’s available options. The bundled font supports common left-to-right Latin and Cyrillic text; unsupported glyphs or scripts are errors. Optional flattening removes editability. Editing invalidates existing digital signatures. The source must be an unencrypted AcroForm PDF within 4 MiB and 200 pages. Review the completed file in a PDF viewer before sharing."
      }
    ],
    "faq": {
      "question": "What should I check before using the result?",
      "answer": "Unknown, read-only and unsupported field types are rejected, as are choices outside the field’s available options."
    },
    "related": [
      "/tools/pdf-form-to-json",
      "/tools/pdf-page-numbers"
    ],
    "modified": "2026-11-06"
  },
  {
    "slug": "pdf-crop",
    "title": "PDF Margin Crop Tool",
    "description": "Adjust the visible CropBox of PDF pages by removing margins measured in PDF points.",
    "kind": "graphic",
    "server": {
      "input": "files",
      "accept": ".pdf"
    },
    "fields": [
      {
        "key": "top",
        "label": "Top margin (points)",
        "default": "12",
        "type": "number",
        "min": 0,
        "max": 500,
        "step": "any"
      },
      {
        "key": "right",
        "label": "Right margin (points)",
        "default": "12",
        "type": "number",
        "min": 0,
        "max": 500,
        "step": "any"
      },
      {
        "key": "bottom",
        "label": "Bottom margin (points)",
        "default": "12",
        "type": "number",
        "min": 0,
        "max": 500,
        "step": "any"
      },
      {
        "key": "left",
        "label": "Left margin (points)",
        "default": "12",
        "type": "number",
        "min": 0,
        "max": 500,
        "step": "any"
      }
    ],
    "example": "",
    "action": "Convert on server",
    "extension": "pdf",
    "steps": [
      "Load the working example or provide your own input.",
      "Review the format options, then select Convert on server to process the input.",
      "Check the result and download the output file."
    ],
    "sections": [
      {
        "heading": "What this tool does",
        "body": "Hide consistent empty margins when a document has more space around its content than you need. Values are applied to each page’s current crop rectangle in the PDF’s unrotated coordinate system. One point is one seventy-second of an inch. The tool keeps the page content as PDF objects rather than rendering it into an image."
      },
      {
        "heading": "Supported formats and limits",
        "body": "Cropping changes visibility only and is not redaction. Hidden text, images, annotations and other objects can remain in the file and may be recoverable. Margins must leave a positive-width and positive-height rectangle on every page. Rotated pages use their underlying page coordinates, so inspect orientation carefully. Only unencrypted PDFs up to 4 MiB and 200 pages are supported, and rewriting the document invalidates existing digital signatures."
      }
    ],
    "faq": {
      "question": "What should I check before using the result?",
      "answer": "Cropping changes visibility only and is not redaction."
    },
    "related": [
      "/tools/pdf-resize",
      "/tools/pdf-rotate"
    ],
    "modified": "2026-11-06"
  },
  {
    "slug": "pdf-grayscale",
    "title": "PDF to Grayscale Converter",
    "description": "Render PDF pages in grayscale and create a new image-based PDF for a monochrome review or print workflow.",
    "kind": "graphic",
    "server": {
      "input": "files",
      "accept": ".pdf"
    },
    "fields": [],
    "example": "",
    "action": "Convert on server",
    "extension": "pdf",
    "steps": [
      "Load the working example or provide your own input.",
      "Review the format options, then select Convert on server to process the input.",
      "Check the result and download the output file."
    ],
    "sections": [
      {
        "heading": "What this tool does",
        "body": "Produce a grayscale copy of a short color document using a consistent rendering pipeline. Each page is rendered on white, converted to grayscale and embedded into a new PDF page with matching viewing proportions. This can help assess whether charts and artwork remain understandable when color is removed before printing or distribution."
      },
      {
        "heading": "Supported formats and limits",
        "body": "The new PDF contains raster page images, so selectable text, vector sharpness, form controls and links are not preserved. This is not a lossless color-profile edit or a guarantee of smaller file size. Up to twenty unencrypted pages and 4 MiB of input are supported, with a 16-million-pixel limit per rendered page. Fine details can soften at the fixed 72 DPI resolution; retain the original when text accessibility or editing matters."
      }
    ],
    "faq": {
      "question": "What should I check before using the result?",
      "answer": "The new PDF contains raster page images, so selectable text, vector sharpness, form controls and links are not preserved."
    },
    "related": [
      "/tools/pdf-to-image",
      "/tools/image-grayscale"
    ],
    "modified": "2026-11-06"
  },
  {
    "slug": "bmp-converter",
    "title": "BMP Image Converter",
    "description": "Convert uncompressed 24/32-bit BMP to PNG, or create a 24-bit BMP from a still PNG, JPEG or WebP image.",
    "kind": "graphic",
    "server": {
      "input": "files",
      "accept": ".bmp,.png,.jpg,.jpeg,.webp"
    },
    "fields": [
      {
        "key": "direction",
        "label": "Direction",
        "default": "bmp-png",
        "type": "select",
        "options": [
          {
            "value": "bmp-png",
            "label": "BMP to PNG"
          },
          {
            "value": "image-bmp",
            "label": "PNG/JPEG/WebP to BMP"
          }
        ]
      }
    ],
    "example": "",
    "action": "Convert on server",
    "extension": "png",
    "steps": [
      "Load the working example or provide your own input.",
      "Review the format options, then select Convert on server to process the input.",
      "Check the result and download the output file."
    ],
    "sections": [
      {
        "heading": "What this tool does",
        "body": "Move a classic bitmap image into a common web format, or prepare a BMP for software that expects that file type. BMP-to-PNG mode reads uncompressed Windows bitmap rows with either bottom-up or top-down storage. The reverse mode creates a standard 24-bit BMP with padded rows and a white background for transparent source pixels."
      },
      {
        "heading": "Supported formats and limits",
        "body": "Supported BMP input uses a Windows DIB header, BI_RGB compression and 24 or 32 bits per pixel. Indexed palettes, bitfields, RLE and other BMP variants are rejected. The reserved fourth byte in BI_RGB 32-bit files is treated as opaque rather than interpreted as alpha. Source images and output are limited to 4 MiB and 16 million pixels. BMP files are uncompressed and can be much larger than their PNG or JPEG sources."
      }
    ],
    "faq": {
      "question": "What should I check before using the result?",
      "answer": "Supported BMP input uses a Windows DIB header, BI_RGB compression and 24 or 32 bits per pixel."
    },
    "related": [
      "/tools/image-format-converter",
      "/tools/image-to-avif"
    ],
    "modified": "2026-11-06"
  },
  {
    "slug": "image-contact-sheet",
    "title": "Image Contact Sheet Generator",
    "description": "Arrange multiple PNG, JPEG or WebP images into a white-backed PNG thumbnail grid with consistent cells.",
    "kind": "graphic",
    "server": {
      "input": "files",
      "accept": ".png,.jpg,.jpeg,.webp",
      "multiple": true
    },
    "fields": [
      {
        "key": "columns",
        "label": "Columns",
        "default": "2",
        "type": "number",
        "min": 1,
        "max": 4,
        "step": "any"
      },
      {
        "key": "cell",
        "label": "Cell size (px)",
        "default": "240",
        "type": "number",
        "min": 80,
        "max": 600,
        "step": "any"
      }
    ],
    "example": "",
    "action": "Convert on server",
    "extension": "png",
    "steps": [
      "Load the working example or provide your own input.",
      "Review the format options, then select Convert on server to process the input.",
      "Check the result and download the output file."
    ],
    "sections": [
      {
        "heading": "What this tool does",
        "body": "Combine a small set of pictures into one overview for a visual review, comparison or sharing task. Choose the file order with the list arrows and select a column count and square cell size. Each image is auto-oriented and fitted inside its cell with white padding, preserving the complete image rather than cutting it to a square."
      },
      {
        "heading": "Supported formats and limits",
        "body": "The contact sheet supports two to eight still PNG, JPEG or WebP images with a combined upload size of 4 MiB. Individual sources and the output sheet are limited to 16 million pixels. It does not include filenames or preserve source metadata, and transparent areas are flattened to white. The result is a new composite PNG, not an archive of originals. Keep the source images for detailed editing or full-resolution inspection."
      }
    ],
    "faq": {
      "question": "What should I check before using the result?",
      "answer": "The contact sheet supports two to eight still PNG, JPEG or WebP images with a combined upload size of 4 MiB."
    },
    "related": [
      "/tools/pdf-contact-sheet",
      "/tools/image-resizer"
    ],
    "modified": "2026-11-06"
  },
  {
    "slug": "transparent-png-trimmer",
    "title": "Transparent PNG Border Trimmer",
    "description": "Automatically remove transparent borders from a PNG using an adjustable alpha threshold without guessing a background color.",
    "kind": "graphic",
    "server": {
      "input": "files",
      "accept": ".png"
    },
    "fields": [
      {
        "key": "threshold",
        "label": "Ignore alpha values at or below",
        "default": "0",
        "type": "number",
        "min": 0,
        "max": 254,
        "step": "any"
      }
    ],
    "example": "",
    "action": "Convert on server",
    "extension": "png",
    "steps": [
      "Load the working example or provide your own input.",
      "Review the format options, then select Convert on server to process the input.",
      "Check the result and download the output file."
    ],
    "sections": [
      {
        "heading": "What this tool does",
        "body": "Tighten the canvas around a cutout, icon or transparent export without selecting crop coordinates manually. The tool scans the PNG alpha channel to find pixels above the chosen threshold, then crops to their combined bounding rectangle. At the default threshold, only fully transparent pixels are ignored, preserving faint antialiased edges."
      },
      {
        "heading": "Supported formats and limits",
        "body": "This does not remove an opaque background or detect an object by its color. Raising the threshold can trim faint shadows and translucent details, so compare the output with the original. A completely transparent image has no visible bounding rectangle and returns an error. Only still PNG input is supported, within 4 MiB and 16 million pixels. The result is re-encoded as PNG and does not preserve arbitrary source metadata."
      }
    ],
    "faq": {
      "question": "What should I check before using the result?",
      "answer": "This does not remove an opaque background or detect an object by its color."
    },
    "related": [
      "/tools/image-cropper",
      "/tools/image-color-picker"
    ],
    "modified": "2026-11-06"
  },
  {
    "slug": "image-exif-remover",
    "title": "Image EXIF and Metadata Remover",
    "description": "Re-encode a still JPEG, PNG or WebP without copied EXIF, XMP or source metadata and apply its orientation before export.",
    "kind": "graphic",
    "server": {
      "input": "files",
      "accept": ".jpg,.jpeg,.png,.webp"
    },
    "fields": [],
    "example": "",
    "action": "Convert on server",
    "extension": "jpg",
    "steps": [
      "Load the working example or provide your own input.",
      "Review the format options, then select Convert on server to process the input.",
      "Check the result and download the output file."
    ],
    "sections": [
      {
        "heading": "What this tool does",
        "body": "Make a sharing copy of an image without carrying its standard source metadata into the new file. The converter first applies orientation information so a rotated camera image stays upright after its EXIF tag is removed. It then re-encodes in the original supported format without requesting preservation of source EXIF, XMP or profile metadata."
      },
      {
        "heading": "Supported formats and limits",
        "body": "This is not anonymization: visible faces, text, locations or information hidden inside pixels can remain. JPEG and WebP are re-encoded with a fixed high-quality setting and are not lossless metadata-only edits. Color appearance can change when specialized profiles are converted. Animated images, unsupported formats and sources above 4 MiB or 16 million pixels are rejected. Inspect the downloaded copy and retain the original for archival use."
      }
    ],
    "faq": {
      "question": "What should I check before using the result?",
      "answer": "This is not anonymization: visible faces, text, locations or information hidden inside pixels can remain."
    },
    "related": [
      "/tools/pdf-metadata-remover",
      "/tools/image-format-converter"
    ],
    "modified": "2026-11-06"
  },
  {
    "slug": "wav-trimmer",
    "title": "WAV Audio Trimmer",
    "description": "Trim uncompressed PCM WAV audio to a time range while preserving channels, sample rate and sample bytes.",
    "kind": "graphic",
    "server": {
      "input": "files",
      "accept": ".wav"
    },
    "fields": [
      {
        "key": "start",
        "label": "Start time (seconds)",
        "default": "0",
        "type": "number",
        "min": 0,
        "max": 100000,
        "step": "any"
      },
      {
        "key": "end",
        "label": "End time (seconds; blank means file end)",
        "default": "0.05",
        "type": "text"
      }
    ],
    "example": "",
    "action": "Convert on server",
    "extension": "wav",
    "steps": [
      "Load the working example or provide your own input.",
      "Review the format options, then select Convert on server to process the input.",
      "Check the result and download the output file."
    ],
    "sections": [
      {
        "heading": "What this tool does",
        "body": "Keep a short portion of a WAV recording without re-encoding its sample values. Enter a start and end time in seconds. Boundaries are aligned to complete sample frames, so stereo channels remain synchronized. The output keeps the original sample rate, channel count and integer bit depth while writing a clean WAV container around the selected samples."
      },
      {
        "heading": "Supported formats and limits",
        "body": "Input must be classic RIFF/WAVE integer PCM with one or two channels and 8, 16, 24 or 32 bits per sample. Compressed WAV, RF64, extensible format and IEEE float are unsupported in this tool. An empty end field selects the file’s end. The interval must fit inside the recording and contain at least one frame. Input and output are capped at 4 MiB; original non-audio metadata chunks are omitted."
      }
    ],
    "faq": {
      "question": "What should I check before using the result?",
      "answer": "Input must be classic RIFF/WAVE integer PCM with one or two channels and 8, 16, 24 or 32 bits per sample."
    },
    "related": [
      "/tools/stereo-to-mono-wav",
      "/tools/wav-normalizer"
    ],
    "modified": "2026-11-06"
  },
  {
    "slug": "wav-normalizer",
    "title": "WAV Peak Normalizer",
    "description": "Adjust integer PCM WAV audio to a target peak level and export 16-bit PCM while preserving channels and sample rate.",
    "kind": "graphic",
    "server": {
      "input": "files",
      "accept": ".wav"
    },
    "fields": [
      {
        "key": "db",
        "label": "Target peak (dBFS)",
        "default": "-1",
        "type": "number",
        "min": -24,
        "max": 0,
        "step": "any"
      }
    ],
    "example": "",
    "action": "Convert on server",
    "extension": "wav",
    "steps": [
      "Load the working example or provide your own input.",
      "Review the format options, then select Convert on server to process the input.",
      "Check the result and download the output file."
    ],
    "sections": [
      {
        "heading": "What this tool does",
        "body": "Make a quieter WAV use more of the available sample range or reduce its maximum peak to a chosen level. The converter measures the largest absolute sample, computes one gain value and applies it consistently to every channel. A target below zero dBFS leaves peak headroom. The output uses 16-bit integer PCM at the source sample rate."
      },
      {
        "heading": "Supported formats and limits",
        "body": "Peak normalization is not perceived-loudness normalization, compression, limiting or noise removal. Stereo balance and relative dynamics are kept, while silent input remains silent. Source audio must be mono or stereo RIFF/WAVE integer PCM at 8, 16, 24 or 32 bits. Float, compressed and extensible WAV are unsupported. Quantization to 16 bits can change sample values. Files and output must stay within 4 MiB; listen before replacing an original."
      }
    ],
    "faq": {
      "question": "What should I check before using the result?",
      "answer": "Peak normalization is not perceived-loudness normalization, compression, limiting or noise removal."
    },
    "related": [
      "/tools/wav-trimmer",
      "/tools/stereo-to-mono-wav"
    ],
    "modified": "2026-11-06"
  },
  {
    "slug": "zip-creator",
    "title": "ZIP Archive Creator",
    "description": "Combine two to eight selected files into a downloadable ZIP archive with safe names and collision checks.",
    "kind": "graphic",
    "server": {
      "input": "files",
      "accept": "",
      "multiple": true
    },
    "fields": [],
    "example": "",
    "action": "Convert on server",
    "extension": "zip",
    "steps": [
      "Load the working example or provide your own input.",
      "Review the format options, then select Convert on server to process the input.",
      "Check the result and download the output file."
    ],
    "sections": [
      {
        "heading": "What this tool does",
        "body": "Package a small set of files for sharing or transfer without installing an archive program. Add the files, review their names and generate one ZIP download. The archive uses ordinary Deflate compression and stores only each file’s final filename rather than a path from your device. It does not execute, interpret or convert the contents of the selected files."
      },
      {
        "heading": "Supported formats and limits",
        "body": "Choose two to eight files with at most 4 MiB combined input. Names are normalized to safe leaf names, and duplicate resulting names are rejected so one file does not silently overwrite another. Folder structures, passwords, encryption and split archives are not created. The final ZIP must also fit within 4 MiB; already compressed inputs can make the archive slightly larger rather than smaller."
      }
    ],
    "faq": {
      "question": "What should I check before using the result?",
      "answer": "Choose two to eight files with at most 4 MiB combined input."
    },
    "related": [
      "/tools/zip-extractor",
      "/tools/file-checksum"
    ],
    "modified": "2026-11-06"
  },
  {
    "slug": "zip-extractor",
    "title": "ZIP File Inspector and Extractor",
    "description": "List a ZIP archive’s entries or download one selected file without writing extracted paths to server storage.",
    "kind": "graphic",
    "server": {
      "input": "files",
      "accept": ".zip"
    },
    "fields": [
      {
        "key": "entry",
        "label": "Exact entry path (blank lists entries)",
        "default": "",
        "type": "text"
      }
    ],
    "example": "",
    "action": "Convert on server",
    "extension": "json",
    "steps": [
      "Load the working example or provide your own input.",
      "Review the format options, then select Convert on server to process the input.",
      "Check the result and download the output file."
    ],
    "sections": [
      {
        "heading": "What this tool does",
        "body": "Inspect a small ZIP before downloading a particular entry. Leave the path field blank to receive a JSON list of filenames and declared sizes, then copy an exact entry path into the field to extract that one file. Extraction returns the file bytes as a download and never recreates the archive’s directory tree on server storage."
      },
      {
        "heading": "Supported formats and limits",
        "body": "Encrypted archives are rejected. The ZIP must be no larger than 4 MiB, contain at most one thousand entries and declare at most 64 MiB of expanded contents. A selected entry must stay within 4 MiB while streaming. The listing is metadata, not a full integrity or malware scan; unselected file contents are not decompressed. Directories cannot be downloaded as individual files. Treat downloaded contents according to their original file type."
      }
    ],
    "faq": {
      "question": "What should I check before using the result?",
      "answer": "Encrypted archives are rejected."
    },
    "related": [
      "/tools/zip-creator",
      "/tools/file-checksum"
    ],
    "modified": "2026-11-06"
  },
  {
    "slug": "markdown-to-docx",
    "title": "Markdown to Word DOCX Converter",
    "description": "Convert Markdown headings, paragraphs, inline formatting, lists and basic tables into an editable Word document. ",
    "kind": "graphic",
    "server": {
      "input": "text"
    },
    "fields": [],
    "example": "# Project notes\n\nA **bold** idea and an *important* detail.\n\n- Review the draft\n- Share the result\n\n| Task | Owner |\n| --- | --- |\n| Review | Ada |",
    "action": "Convert on server",
    "extension": "docx",
    "steps": [
      "Load the working example or provide your own input.",
      "Review the format options, then select Convert on server to process the input.",
      "Check the result and download the output file."
    ],
    "sections": [
      {
        "heading": "What this tool does",
        "body": "Turn a Markdown draft into an editable DOCX for a review workflow that uses a word processor. The converter parses Markdown, sanitizes the generated HTML and maps supported text structures to document elements. It keeps headings, bold and italic runs, line breaks, code text, basic lists and simple tables rather than treating Markdown punctuation as ordinary text."
      },
      {
        "heading": "Supported formats and limits",
        "body": "This supports a deliberately limited document structure, not a pixel-perfect HTML or browser rendering. Images are omitted and raw HTML is treated as text. CSS and scripts are not executed, and complex table spans are rejected. Lists are limited in nesting depth and large tables are bounded. Input is limited to twenty thousand characters. Fonts and page layout can vary in the word processor used to open the file; review the result before distribution."
      }
    ],
    "faq": {
      "question": "What should I check before using the result?",
      "answer": "This supports a deliberately limited document structure, not a pixel-perfect HTML or browser rendering."
    },
    "related": [
      "/tools/html-to-docx",
      "/tools/text-to-docx"
    ],
    "modified": "2026-11-06"
  },
  {
    "slug": "html-to-docx",
    "title": "HTML to Word DOCX Converter",
    "description": "Convert a basic HTML fragment into an editable DOCX with headings, text formatting, lists and simple tables. ",
    "kind": "graphic",
    "server": {
      "input": "text"
    },
    "fields": [],
    "example": "<h1>Project notes</h1><p>Hello, <strong>world</strong>! Вітаємо.</p><ul><li>Review</li><li>Share</li></ul><table><tr><th>Task</th><th>Owner</th></tr><tr><td>Review</td><td>Ada</td></tr></table>",
    "action": "Convert on server",
    "extension": "docx",
    "steps": [
      "Load the working example or provide your own input.",
      "Review the format options, then select Convert on server to process the input.",
      "Check the result and download the output file."
    ],
    "sections": [
      {
        "heading": "What this tool does",
        "body": "Move a small HTML content fragment into a Word document without copying rendered content from a browser. The converter sanitizes the fragment and maps supported elements into document paragraphs, text runs, lists and tables. It keeps useful structure such as heading levels and inline emphasis while discarding active content and presentation-only markup."
      },
      {
        "heading": "Supported formats and limits",
        "body": "The tool does not render CSS, run JavaScript, fetch a URL or download linked resources. Images and unsupported elements are omitted, and complicated table spans are rejected instead of being guessed. Supported text is editable after conversion, but exact fonts, browser layout and interactive behavior are not reproduced. Use at most twenty thousand input characters and inspect the DOCX in your intended word processor, especially when lists or tables are involved."
      }
    ],
    "faq": {
      "question": "What should I check before using the result?",
      "answer": "The tool does not render CSS, run JavaScript, fetch a URL or download linked resources."
    },
    "related": [
      "/tools/markdown-to-docx",
      "/tools/docx-converter"
    ],
    "modified": "2026-11-06"
  },
  {
    "slug": "csv-to-vcard",
    "title": "CSV to vCard Contacts Converter",
    "description": "Convert contact rows with givenName, familyName, email, phone and organization columns into a multi-contact VCF file. ",
    "kind": "graphic",
    "server": {
      "input": "text"
    },
    "fields": [],
    "example": "givenName,familyName,email,phone,organization\nAda,Lovelace,ada@example.com,+44123456789,Analytical Engine\nGrace,Hopper,grace@example.com,+12025550123,Computing",
    "action": "Convert on server",
    "extension": "vcf",
    "steps": [
      "Load the working example or provide your own input.",
      "Review the format options, then select Convert on server to process the input.",
      "Check the result and download the output file."
    ],
    "sections": [
      {
        "heading": "What this tool does",
        "body": "Prepare a batch of contacts for software that imports vCard files. Paste comma-separated CSV with givenName and familyName columns, plus optional email, phone and organization columns. Each row becomes a separate vCard 3.0 contact with a structured name and a display name. Unicode names and quoted CSV cells are retained without manually creating one contact at a time."
      },
      {
        "heading": "Supported formats and limits",
        "body": "Every row needs at least one nonblank name component. Optional columns may be absent, but malformed email values and line breaks in phone or email fields are rejected. Text properties are escaped and long lines are folded by UTF-8 byte length. This does not merge contacts or detect duplicates already stored in another application. The limit is one thousand contacts and fifty thousand CSV cells; check the receiving application’s import behavior."
      }
    ],
    "faq": {
      "question": "What should I check before using the result?",
      "answer": "Every row needs at least one nonblank name component."
    },
    "related": [
      "/tools/vcard-generator",
      "/tools/csv-column-extractor"
    ],
    "modified": "2026-11-06"
  },
  {
    "slug": "csv-to-icalendar",
    "title": "CSV to iCalendar Events Converter",
    "description": "Convert CSV events with UTC start and end timestamps into an importable ICS calendar file. ",
    "kind": "graphic",
    "server": {
      "input": "text"
    },
    "fields": [],
    "example": "summary,start,end,location\nProject review,2026-11-06T10:00:00Z,2026-11-06T11:00:00Z,Meeting room\nPlanning,2026-11-07T09:00:00Z,2026-11-07T09:30:00Z,Online",
    "action": "Convert on server",
    "extension": "ics",
    "steps": [
      "Load the working example or provide your own input.",
      "Review the format options, then select Convert on server to process the input.",
      "Check the result and download the output file."
    ],
    "sections": [
      {
        "heading": "What this tool does",
        "body": "Create a batch of calendar events from a simple table without entering them individually in a calendar application. Required columns are summary, start and end. Start and end use explicit UTC timestamps with seconds, such as 2026-11-06T10:00:00Z. Optional description and location columns become escaped calendar text, and each exported event receives a unique identifier."
      },
      {
        "heading": "Supported formats and limits",
        "body": "End times must be later than start times and all dates must be valid Gregorian UTC values. Local times, recurrence rules, reminders and all-day dates are not inferred. The converter writes one calendar containing at most one thousand events and folds long lines to the iCalendar byte limit. Importing the same export repeatedly may create duplicate events because identifiers are generated for each export; review the target calendar before repeating an import."
      }
    ],
    "faq": {
      "question": "What should I check before using the result?",
      "answer": "End times must be later than start times and all dates must be valid Gregorian UTC values."
    },
    "related": [
      "/tools/icalendar-generator",
      "/tools/time-zone-converter"
    ],
    "modified": "2026-11-06"
  },
  {
    "slug": "json-to-geojson",
    "title": "JSON Records to GeoJSON Converter",
    "description": "Convert records with latitude and longitude columns into a GeoJSON Point FeatureCollection with preserved properties. ",
    "kind": "graphic",
    "server": {
      "input": "text"
    },
    "fields": [
      {
        "key": "latitude",
        "label": "Latitude property",
        "default": "lat",
        "type": "text"
      },
      {
        "key": "longitude",
        "label": "Longitude property",
        "default": "lon",
        "type": "text"
      }
    ],
    "example": "[{\"name\":\"Kyiv\",\"lat\":50.4501,\"lon\":30.5234},{\"name\":\"Bratislava\",\"lat\":48.1486,\"lon\":17.1077}]",
    "action": "Convert on server",
    "extension": "geojson",
    "steps": [
      "Load the working example or provide your own input.",
      "Review the format options, then select Convert on server to process the input.",
      "Check the result and download the output file."
    ],
    "sections": [
      {
        "heading": "What this tool does",
        "body": "Prepare location records for a mapping tool that accepts GeoJSON. Select the top-level property names containing latitude and longitude. Each record becomes a Point feature using the required longitude-first coordinate order, while its other properties remain available for labels or styling. The output is a FeatureCollection that can be downloaded with a GeoJSON extension."
      },
      {
        "heading": "Supported formats and limits",
        "body": "Coordinates must be finite numbers or plain numeric strings, with latitude between minus ninety and ninety and longitude between minus one hundred eighty and one hundred eighty. Missing or invalid coordinates reject the conversion instead of silently dropping records. This assumes geographic longitude and latitude and does not reproject a grid coordinate system or geocode addresses. Input must be an array of at most ten thousand objects with bounded JSON depth and safe integer values."
      }
    ],
    "faq": {
      "question": "What should I check before using the result?",
      "answer": "Coordinates must be finite numbers or plain numeric strings, with latitude between minus ninety and ninety and longitude between minus one hundred eighty and one hundred eighty."
    },
    "related": [
      "/tools/json-to-csv",
      "/tools/json-array-filter"
    ],
    "modified": "2026-11-06"
  },
  {
    "slug": "json-schema-validator",
    "title": "JSON Schema Validator",
    "description": "Validate JSON against Draft 7 or Draft 2020-12 schemas and inspect precise instance paths without modifying the document.",
    "kind": "graphic",
    "example": "{\"name\":\"Ada\",\"email\":\"ada@example.com\",\"age\":36}",
    "fields": [
      {
        "key": "draft",
        "label": "JSON Schema draft",
        "default": "7",
        "type": "select",
        "options": [
          {
            "value": "7",
            "label": "Draft 7"
          },
          {
            "value": "2020",
            "label": "Draft 2020-12"
          }
        ]
      }
    ],
    "action": "Convert on server",
    "extension": "json",
    "steps": [
      "Load the example or paste your own input.",
      "Review the settings, then select Convert on server to send input for processing.",
      "Review the result, then copy or download it."
    ],
    "sections": [
      {
        "heading": "What this tool helps you do",
        "body": "Check whether a JSON document satisfies an actual schema rather than merely parsing as JSON. Paste the document and schema into separate editors, choose the matching draft, and inspect validation errors with their instance and schema paths. Common string formats such as email and date-time are checked through the validator’s format definitions."
      },
      {
        "heading": "Format rules and limitations",
        "body": "Schemas are compiled in strict mode. Unsupported keywords, unknown formats and unresolved references are errors instead of silently ignored rules. External schemas are not downloaded. Validation does not insert defaults, coerce types or remove properties from the document. Input depth and worker resources are bounded, and JSON numbers use JavaScript numeric precision. The result is a diagnostic report, not a security certification or proof that an API request will be accepted."
      }
    ],
    "faq": {
      "question": "What should I check before relying on the output?",
      "answer": "Schemas are compiled in strict mode."
    },
    "related": [
      "/tools/json-schema-generator",
      "/tools/json-validator"
    ],
    "modified": "2026-11-06",
    "server": {
      "input": "text"
    },
    "exampleB": "{\"type\":\"object\",\"properties\":{\"name\":{\"type\":\"string\"},\"email\":{\"type\":\"string\",\"format\":\"email\"},\"age\":{\"type\":\"integer\",\"minimum\":0}},\"required\":[\"name\",\"email\"],\"additionalProperties\":false}",
    "inputLabel": "JSON document",
    "secondInputLabel": "JSON Schema"
  },
  {
    "slug": "json-to-messagepack",
    "title": "JSON to MessagePack Converter",
    "description": "Encode JSON values as a downloadable MessagePack binary file with finite-number and depth checks.",
    "kind": "graphic",
    "example": "{\"name\":\"Ada\",\"active\":true,\"scores\":[3,5,8]}",
    "fields": [],
    "action": "Convert on server",
    "extension": "msgpack",
    "steps": [
      "Load the example or paste your own input.",
      "Review the settings, then select Convert on server to send input for processing.",
      "Review the result, then copy or download it."
    ],
    "sections": [
      {
        "heading": "What this tool helps you do",
        "body": "Prepare a small binary payload for a system that accepts MessagePack instead of textual JSON. Objects, arrays, strings, booleans, null and supported numbers retain their JSON meaning while the encoder chooses appropriate MessagePack representations. The result is a binary file for download, not a Base64 string or a simulated size estimate."
      },
      {
        "heading": "Format rules and limitations",
        "body": "Only JSON values are accepted; this tool does not infer dates, binary buffers or application-specific extension types from strings. Integral numbers outside JavaScript’s safe range are rejected, so preserve large identifiers as strings. Nesting is limited to 32 levels and total text to 2 MiB. MessagePack interoperability can depend on the receiving implementation’s type expectations; compare the decoded structure before using a payload in an integration."
      }
    ],
    "faq": {
      "question": "What should I check before relying on the output?",
      "answer": "Only JSON values are accepted; this tool does not infer dates, binary buffers or application-specific extension types from strings."
    },
    "related": [
      "/tools/messagepack-to-json",
      "/tools/json-formatter"
    ],
    "modified": "2026-11-06",
    "server": {
      "input": "text"
    }
  },
  {
    "slug": "messagepack-to-json",
    "title": "MessagePack to JSON Converter",
    "description": "Decode a single MessagePack value into JSON with explicit representations for binary data, timestamps and large integers.",
    "kind": "graphic",
    "example": "",
    "fields": [],
    "action": "Convert on server",
    "extension": "json",
    "steps": [
      "Load the example or paste your own input.",
      "Review the settings, then select Convert on server to send input for processing.",
      "Review the result, then copy or download it."
    ],
    "sections": [
      {
        "heading": "What this tool helps you do",
        "body": "Inspect a MessagePack export without manually reading binary tags. Upload one binary value and download formatted JSON. JSON-compatible numbers, strings, arrays and maps retain their values. Binary byte arrays become objects containing Base64 text; timestamps and integers that JSON cannot represent exactly use explicit tagged representations so those distinctions are visible."
      },
      {
        "heading": "Format rules and limitations",
        "body": "The input must contain exactly one complete MessagePack value. Non-string map keys, unsafe object keys, unsupported extension types and oversized containers are rejected. A decoded binary wrapper is a report representation and is not automatically interpreted as binary by the separate JSON encoder. Upload and output limits apply independently, so Base64 expansion can make a result too large. This does not decompress a surrounding archive or guess a framing protocol."
      }
    ],
    "faq": {
      "question": "What should I check before relying on the output?",
      "answer": "The input must contain exactly one complete MessagePack value."
    },
    "related": [
      "/tools/json-to-messagepack",
      "/tools/file-to-base64"
    ],
    "modified": "2026-11-06",
    "server": {
      "input": "files",
      "accept": ".msgpack,.mpack,.bin"
    }
  },
  {
    "slug": "plist-converter",
    "title": "XML Property List and JSON Converter",
    "description": "Convert JSON to an XML plist or parse supported XML plist values into JSON without fetching its DTD.",
    "kind": "graphic",
    "example": "{\"name\":\"Utilixio\",\"enabled\":true,\"ports\":[3000,3001]}",
    "fields": [
      {
        "key": "direction",
        "label": "Direction",
        "default": "to-plist",
        "type": "select",
        "options": [
          {
            "value": "to-plist",
            "label": "JSON to XML plist"
          },
          {
            "value": "to-json",
            "label": "XML plist to JSON"
          }
        ]
      }
    ],
    "action": "Convert on server",
    "extension": "json",
    "steps": [
      "Load the example or paste your own input.",
      "Review the settings, then select Convert on server to send input for processing.",
      "Review the result, then copy or download it."
    ],
    "sections": [
      {
        "heading": "What this tool helps you do",
        "body": "Move basic configuration values between JSON and Apple’s XML property-list format. Dictionaries, arrays, strings, booleans and finite numeric values are supported in both directions. XML plist dates and data values are exported with explicit tagged JSON objects instead of silently becoming unrelated ordinary strings. Dictionary key order is preserved where the output format permits it."
      },
      {
        "heading": "Format rules and limitations",
        "body": "This handles XML plist, not binary plist or application preference synchronization. JSON null has no plist equivalent and is rejected. Tagged date/data reports are not automatically inferred when encoding JSON back to plist. The standard Apple plist DOCTYPE may be recognized and removed locally; other DTDs, entity declarations and external resource loading are not supported. Malformed structures, duplicate dictionary keys and excessive depth are errors."
      }
    ],
    "faq": {
      "question": "What should I check before relying on the output?",
      "answer": "This handles XML plist, not binary plist or application preference synchronization."
    },
    "related": [
      "/tools/json-to-toml",
      "/tools/xml-to-json"
    ],
    "modified": "2026-11-06",
    "server": {
      "input": "text"
    }
  },
  {
    "slug": "jmespath-tester",
    "title": "JMESPath Query Tester",
    "description": "Run JMESPath projections, filters and built-in functions against a JSON document and download the selected result.",
    "kind": "graphic",
    "example": "{\"users\":[{\"name\":\"Ada\",\"active\":true},{\"name\":\"Grace\",\"active\":false},{\"name\":\"Linus\",\"active\":true}]}",
    "fields": [
      {
        "key": "query",
        "label": "JMESPath expression",
        "default": "users[?active].name",
        "type": "text"
      }
    ],
    "action": "Convert on server",
    "extension": "json",
    "steps": [
      "Load the example or paste your own input.",
      "Review the settings, then select Convert on server to send input for processing.",
      "Review the result, then copy or download it."
    ],
    "sections": [
      {
        "heading": "What this tool helps you do",
        "body": "Explore a JSON response using the query language commonly found in command-line and cloud tooling. A projection can pick nested fields, a filter can select matching records, and built-in functions can shape the result without writing a JavaScript program. The example selects names from active users and returns a JSON array ready for another processing step."
      },
      {
        "heading": "Format rules and limitations",
        "body": "The tool uses the JMESPath library’s supported language and functions, not JSONPath or arbitrary JavaScript. Invalid expressions and type mismatches return errors. Missing selections can legitimately produce null or empty arrays. The source document is not modified, and no URLs are fetched. Input depth, numeric safety and worker resources are bounded; validate important queries against the exact implementation used by the receiving command or service."
      }
    ],
    "faq": {
      "question": "What should I check before relying on the output?",
      "answer": "The tool uses the JMESPath library’s supported language and functions, not JSONPath or arbitrary JavaScript."
    },
    "related": [
      "/tools/json-pointer-extractor",
      "/tools/json-array-filter"
    ],
    "modified": "2026-11-06",
    "server": {
      "input": "text"
    }
  },
  {
    "slug": "regex-replace",
    "title": "Regex Find and Replace",
    "description": "Apply a JavaScript regular expression and replacement string, including numbered and named capture references.",
    "kind": "graphic",
    "example": "Ada Lovelace\nGrace Hopper",
    "fields": [
      {
        "key": "pattern",
        "label": "JavaScript pattern",
        "default": "(\\w+) (\\w+)",
        "type": "text"
      },
      {
        "key": "flags",
        "label": "Flags",
        "default": "gu",
        "type": "text"
      },
      {
        "key": "replacement",
        "label": "Replacement string",
        "default": "$2, $1",
        "type": "text"
      }
    ],
    "action": "Convert on server",
    "extension": "txt",
    "steps": [
      "Load the example or paste your own input.",
      "Review the settings, then select Convert on server to send input for processing.",
      "Review the result, then copy or download it."
    ],
    "sections": [
      {
        "heading": "What this tool helps you do",
        "body": "Reformat repeated text using capture groups rather than a literal search. Supply a pattern without surrounding slashes, optional JavaScript flags, and a replacement string such as $2, $1. The global flag replaces all matches; omitting it replaces the first. The output is the transformed text itself so it can be copied into an editor or downloaded."
      },
      {
        "heading": "Format rules and limitations",
        "body": "Replacement strings follow JavaScript substitution rules; this tool does not execute a replacement callback or user code. Patterns are limited in length and source text to two hundred thousand characters. Expensive expressions run in the bounded conversion worker and may time out. JavaScript regex behavior can differ from PCRE, Python or other engines. Use the literal replacement tool when regex syntax is unnecessary."
      }
    ],
    "faq": {
      "question": "What should I check before relying on the output?",
      "answer": "Replacement strings follow JavaScript substitution rules; this tool does not execute a replacement callback or user code."
    },
    "related": [
      "/tools/regex-tester",
      "/tools/text-find-replace"
    ],
    "modified": "2026-11-06",
    "server": {
      "input": "text"
    }
  },
  {
    "slug": "x509-certificate-decoder",
    "title": "X.509 Certificate Decoder",
    "description": "Inspect a public PEM certificate’s subject, issuer, validity dates, fingerprints and public key without performing trust validation.",
    "kind": "graphic",
    "example": "-----BEGIN CERTIFICATE-----\nMIIDWTCCAkGgAwIBAgIUBZ9jz9avx7VTbL3eloKyCSYukM4wDQYJKoZIhvcNAQEL\nBQAwPDEYMBYGA1UEAwwPZXhhbXBsZS5pbnZhbGlkMSAwHgYDVQQKDBdDb252ZXJz\naW9uIFRvb2wgRXhhbXBsZTAeFw0yNjExMDYwOTM4MzZaFw0yNzExMDYwOTM4MzZa\nMDwxGDAWBgNVBAMMD2V4YW1wbGUuaW52YWxpZDEgMB4GA1UECgwXQ29udmVyc2lv\nbiBUb29sIEV4YW1wbGUwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCT\nbug30ZEiqF3MxzsmN3UFhaYLZq5kK2affD2OU5/m2KOlb3tb62fgjj0fnGprkQdF\nNR5wIFq9H1N415ZkL62ZNft9XXEiVUHi3YdjP8Rht7OwRum80+8HBtBYxyI2Opjq\nBdpFrT0i/Kf054RZnMMjGxUOR2+mkq/9xQqc5VtfCUZuIb+4egAUfOX2BFBSJtkC\nXO81wHeNlGYvsHNRVFnohQAaAWi6l1XEFhPqwS+fpXBGDEyPk2zHxDapLzUiC16X\n/bfIycHdPq85y3Pklm4/OmyUZv5XpnoLmIzCHZJSdiHkTT4vwofPhI34xLkTd0ZJ\nWs9XrjXPCYIQHwlPonLvAgMBAAGjUzBRMB0GA1UdDgQWBBQURW51dn9Zyldmsh5F\nY84DJyRK2zAfBgNVHSMEGDAWgBQURW51dn9Zyldmsh5FY84DJyRK2zAPBgNVHRMB\nAf8EBTADAQH/MA0GCSqGSIb3DQEBCwUAA4IBAQAJ6fcj4jhqXj6OKb03X7JLkphJ\ns8D71fJegsCn4RwSqJa2QVuDLk+efP/4wjdf0nmJdpb0PtDYRvKAa82Kh8W9Ahwd\nxNHkeuiTkXTfoUFhXTp+B9qm5kXnXa7McifZiTDk8aFqiOjnW8EbmFHlzSXvGkxo\nf61diWE8KoO55u0GZkZvFDUXo4fotC5J0Xhkmb+Jm9UCizRqKXDY56QTGnHV/RrQ\nN+KJLJOiSqISNR8ik7Zb0t5G5zOr3SGJ1mco5scaZK23zUf2KcMmW0W7WlFgX9Np\nTAghh5Zrmj43allGGuEAB1PKctL/eN8DLfcRLYaqboYP7qcdpg/z4Is93TG7\n-----END CERTIFICATE-----\n",
    "fields": [],
    "action": "Convert on server",
    "extension": "json",
    "steps": [
      "Load the example or paste your own input.",
      "Review the settings, then select Convert on server to send input for processing.",
      "Review the result, then copy or download it."
    ],
    "sections": [
      {
        "heading": "What this tool helps you do",
        "body": "Read the metadata inside one public X.509 certificate when checking a certificate export or documenting a TLS configuration. The result includes subject and issuer names, serial number, validity interval, fingerprints and the public key. The supplied example is self-signed for example.invalid and does not represent the certificate currently used by this website."
      },
      {
        "heading": "Format rules and limitations",
        "body": "Paste a single public CERTIFICATE PEM block only. Private keys and certificate chains are not accepted. Displaying validity dates does not establish trust: the tool does not verify a chain, hostname, revocation status or possession of the private key. Input is limited to 64 KiB and processed under the server conversion limits. Compare critical certificate information with a trusted local client before making an operational security decision."
      }
    ],
    "faq": {
      "question": "What should I check before relying on the output?",
      "answer": "Paste a single public CERTIFICATE PEM block only."
    },
    "related": [
      "/tools/ssh-key-fingerprint",
      "/tools/file-checksum"
    ],
    "modified": "2026-11-06",
    "server": {
      "input": "text"
    }
  },
  {
    "slug": "ssh-key-fingerprint",
    "title": "SSH Public Key Fingerprint Tool",
    "description": "Calculate SHA-256 and legacy MD5 fingerprints from an OpenSSH public key and inspect its wire-format fields.",
    "kind": "graphic",
    "example": "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAINdamAGCsQq31Uv+08lkBzoO4XLz2qYjJa8CGmj3B1Ea example-key",
    "fields": [],
    "action": "Convert on server",
    "extension": "json",
    "steps": [
      "Load the example or paste your own input.",
      "Review the settings, then select Convert on server to send input for processing.",
      "Review the result, then copy or download it."
    ],
    "sections": [
      {
        "heading": "What this tool helps you do",
        "body": "Compare an exported public key with a fingerprint shown by another system. Paste one OpenSSH public-key line, including its key type and Base64 payload. The tool calculates a SHA-256 fingerprint from the decoded SSH wire data and also provides the legacy colon-separated MD5 form for older comparison workflows. A trailing comment is treated as a label rather than key material."
      },
      {
        "heading": "Format rules and limitations",
        "body": "Supported key layouts are Ed25519, RSA and uncompressed NIST ECDSA public keys. The declared type must match the encoded type and the wire fields must have valid lengths. This inspects representation, not mathematical key strength, ownership or host authenticity. MD5 is supplied only for legacy comparison. Private keys, authorized_keys option prefixes and multi-key input are unsupported. Use a trusted channel to confirm fingerprints when authenticating a host."
      }
    ],
    "faq": {
      "question": "What should I check before relying on the output?",
      "answer": "Supported key layouts are Ed25519, RSA and uncompressed NIST ECDSA public keys."
    },
    "related": [
      "/tools/x509-certificate-decoder",
      "/tools/hash-generator"
    ],
    "modified": "2026-11-06",
    "server": {
      "input": "text"
    }
  },
  {
    "slug": "csv-to-html-table",
    "title": "CSV to HTML Table Converter",
    "description": "Convert a rectangular CSV table into escaped semantic HTML with an optional caption and header row.",
    "kind": "graphic",
    "example": "name,role\nAda,Engineer\nGrace,Researcher",
    "fields": [
      {
        "key": "caption",
        "label": "Table caption",
        "default": "Team",
        "type": "text"
      },
      {
        "key": "header",
        "label": "First row is a header",
        "default": "true",
        "type": "select",
        "options": [
          {
            "value": "true",
            "label": "Yes"
          },
          {
            "value": "false",
            "label": "No"
          }
        ]
      }
    ],
    "action": "Convert on server",
    "extension": "html",
    "steps": [
      "Load the example or paste your own input.",
      "Review the settings, then select Convert on server to send input for processing.",
      "Review the result, then copy or download it."
    ],
    "sections": [
      {
        "heading": "What this tool helps you do",
        "body": "Prepare a small spreadsheet export for a web article or an HTML template. The converter writes a table, an optional caption, header cells when enabled and a body row for each remaining CSV record. Cell text is escaped as text content, so pasted angle brackets and ampersands do not become active HTML markup."
      },
      {
        "heading": "Format rules and limitations",
        "body": "Input uses comma-separated CSV with ordinary quoting and a consistent number of cells per row. The limit is fifty thousand cells, and no number or date types are guessed. Line breaks inside quoted cells become explicit HTML line breaks. The output is a table fragment rather than a full styled webpage. CSS, sorting behavior, merged cells and formulas are not generated; review semantics and presentation in the destination document."
      }
    ],
    "faq": {
      "question": "What should I check before relying on the output?",
      "answer": "Input uses comma-separated CSV with ordinary quoting and a consistent number of cells per row."
    },
    "related": [
      "/tools/html-table-to-csv",
      "/tools/json-to-html-table"
    ],
    "modified": "2026-11-06",
    "server": {
      "input": "text"
    }
  },
  {
    "slug": "csv-delimiter-converter",
    "title": "CSV Delimiter Converter",
    "description": "Convert comma, semicolon or tab-separated data while preserving quoted cell contents and optional UTF-8 BOM output.",
    "kind": "graphic",
    "example": "id;name;note\n001;Ada;\"one;two\"",
    "fields": [
      {
        "key": "from",
        "label": "Input delimiter",
        "default": ";",
        "type": "select",
        "options": [
          {
            "value": ",",
            "label": "Comma"
          },
          {
            "value": ";",
            "label": "Semicolon"
          },
          {
            "value": "\t",
            "label": "Tab"
          }
        ]
      },
      {
        "key": "to",
        "label": "Output delimiter",
        "default": ",",
        "type": "select",
        "options": [
          {
            "value": ",",
            "label": "Comma"
          },
          {
            "value": ";",
            "label": "Semicolon"
          },
          {
            "value": "\t",
            "label": "Tab"
          }
        ]
      },
      {
        "key": "bom",
        "label": "UTF-8 BOM",
        "default": "false",
        "type": "select",
        "options": [
          {
            "value": "false",
            "label": "No BOM"
          },
          {
            "value": "true",
            "label": "Include BOM"
          }
        ]
      }
    ],
    "action": "Convert on server",
    "extension": "csv",
    "steps": [
      "Load the example or paste your own input.",
      "Review the settings, then select Convert on server to send input for processing.",
      "Review the result, then copy or download it."
    ],
    "sections": [
      {
        "heading": "What this tool helps you do",
        "body": "Adapt a CSV export to an application that expects a different separator. Choose the actual input delimiter and the required output delimiter. The parser reads quoted cells before rewriting separators, so a semicolon inside a quoted value remains data rather than becoming an extra column. Leading zeroes, empty cells and embedded line breaks are retained as text."
      },
      {
        "heading": "Format rules and limitations",
        "body": "This does not guess the separator, infer headers or convert numeric formats. Rows must be rectangular and the table must stay within fifty thousand cells. Output uses CRLF record endings and quotes values where the chosen separator or a line break requires it. Optional BOM output can help some spreadsheet importers identify UTF-8. It does not convert the file into a legacy character set; use the separate encoding converter for that."
      }
    ],
    "faq": {
      "question": "What should I check before relying on the output?",
      "answer": "This does not guess the separator, infer headers or convert numeric formats."
    },
    "related": [
      "/tools/text-encoding-converter",
      "/tools/csv-to-json"
    ],
    "modified": "2026-11-06",
    "server": {
      "input": "text"
    }
  },
  {
    "slug": "xml-xpath-tester",
    "title": "XML XPath Tester",
    "description": "Evaluate XPath 1.0 expressions against XML with an explicit namespace map and structured node or scalar results.",
    "kind": "graphic",
    "example": "<catalog><book id=\"a\"><title>First</title></book><book id=\"b\"><title>Second</title></book></catalog>",
    "fields": [
      {
        "key": "expression",
        "label": "XPath 1.0 expression",
        "default": "//book/title/text()",
        "type": "text"
      },
      {
        "key": "namespaces",
        "label": "Prefix-to-namespace JSON map",
        "default": "{}",
        "type": "text"
      }
    ],
    "action": "Convert on server",
    "extension": "json",
    "steps": [
      "Load the example or paste your own input.",
      "Review the settings, then select Convert on server to send input for processing.",
      "Review the result, then copy or download it."
    ],
    "sections": [
      {
        "heading": "What this tool helps you do",
        "body": "Test a query against XML data rather than a browser-repaired HTML fragment. Enter an XPath expression and, when needed, map prefixes to namespace URIs in a JSON object. The result identifies selected nodes or a scalar string, number or boolean. A prefix in the query must be explicitly mapped even when the source uses a default namespace."
      },
      {
        "heading": "Format rules and limitations",
        "body": "The evaluator supports XPath 1.0 and does not add XSLT functions, JavaScript or network access. DTDs and entity declarations are rejected. XML must be well formed, with bounded node count and depth; result node lists are limited to one thousand entries. Namespace-aware XML queries differ from the existing HTML XPath tester, which parses HTML. Inspect serialized node results as data rather than inserting untrusted markup into a live page."
      }
    ],
    "faq": {
      "question": "What should I check before relying on the output?",
      "answer": "The evaluator supports XPath 1.0 and does not add XSLT functions, JavaScript or network access."
    },
    "related": [
      "/tools/xpath-tester",
      "/tools/xml-formatter"
    ],
    "modified": "2026-11-06",
    "server": {
      "input": "text"
    }
  },
  {
    "slug": "json-canonicalizer",
    "title": "Canonical JSON Generator",
    "description": "Generate compact deterministic JSON using UTF-16 key ordering and ECMAScript number serialization, with duplicate-key checks.",
    "kind": "graphic",
    "example": "{\"z\":3,\"a\":{\"y\":2,\"x\":1},\"values\":[true,null,\"text\"]}",
    "fields": [],
    "action": "Convert on server",
    "extension": "json",
    "steps": [
      "Load the example or paste your own input.",
      "Review the settings, then select Convert on server to send input for processing.",
      "Review the result, then copy or download it."
    ],
    "sections": [
      {
        "heading": "What this tool helps you do",
        "body": "Prepare a stable JSON representation when formatting and object-key order must not vary between equivalent parsed documents. Object keys are sorted by UTF-16 code units, arrays retain their order, and insignificant whitespace is removed. Strings and finite numbers use ECMAScript serialization, following the central JSON Canonicalization Scheme rules."
      },
      {
        "heading": "Format rules and limitations",
        "body": "Duplicate keys and unpaired Unicode surrogates are rejected. Numbers are interpreted as IEEE-754 values by the JSON parser, so original decimal spelling and arbitrary-precision distinctions are not preserved. Use strings for exact large identifiers. Canonicalization does not normalize Unicode or prove that two business records mean the same thing. Input depth and node count are bounded. The output is canonical text only; hashing, signing and protocol-specific validation remain separate operations."
      }
    ],
    "faq": {
      "question": "What should I check before relying on the output?",
      "answer": "Duplicate keys and unpaired Unicode surrogates are rejected."
    },
    "related": [
      "/tools/json-sorter",
      "/tools/hash-generator"
    ],
    "modified": "2026-11-06",
    "server": {
      "input": "text"
    }
  },
  {
    "slug": "env-diff",
    "title": "Environment File Diff",
    "description": "Compare single-line .env assignments locally, report missing or changed keys and hide values by default.",
    "kind": "text",
    "example": "APP_NAME=Utilixio\nPORT=3000\nTOKEN=\"example-only\"",
    "fields": [
      {
        "key": "showValues",
        "label": "Include values in the report",
        "default": "false",
        "type": "checkbox"
      }
    ],
    "action": "Run tool",
    "extension": "json",
    "steps": [
      "Load the example or paste your own input.",
      "Check the settings and run the tool.",
      "Review the result, then copy or download it."
    ],
    "sections": [
      {
        "heading": "What this tool helps you do",
        "body": "Compare two flat environment configurations before moving a small application between environments. The report separates added keys, removed keys, changed assignments and an unchanged count. Values are redacted by default, making it easier to discuss configuration drift without copying credentials into a report. The conversion runs locally and does not send the configuration to a conversion API."
      },
      {
        "heading": "Format rules and limitations",
        "body": "This supports one assignment per line, optional export prefixes, comments and single-quoted or JSON-escaped double-quoted values. Multiline values, duplicate keys and malformed assignments are rejected. It does not expand variables, read process environment settings or interpret shell commands. Exact parsed string values are compared, so intentional differences such as whitespace inside quotes remain meaningful. Enabling value display includes those strings in the downloadable result; review it before sharing."
      }
    ],
    "faq": {
      "question": "What should I check before relying on the output?",
      "answer": "This supports one assignment per line, optional export prefixes, comments and single-quoted or JSON-escaped double-quoted values."
    },
    "related": [
      "/tools/env-parser",
      "/tools/text-diff"
    ],
    "modified": "2026-11-06",
    "exampleB": "APP_NAME=Utilixio\nPORT=8080\nREGION=eu",
    "inputLabel": "Before .env",
    "secondInputLabel": "After .env"
  },
  {
    "slug": "shell-argument-escaper",
    "title": "POSIX Shell Argument Escaper",
    "description": "Turn a JSON array of strings into safely single-quoted POSIX shell arguments without executing a command.",
    "kind": "text",
    "example": "[\"hello world\",\"O'Brien\",\"$HOME\",\"$(example)\"]",
    "fields": [],
    "action": "Run tool",
    "extension": "sh",
    "steps": [
      "Load the example or paste your own input.",
      "Check the settings and run the tool.",
      "Review the result, then copy or download it."
    ],
    "sections": [
      {
        "heading": "What this tool helps you do",
        "body": "Prepare literal command arguments that contain spaces, quotes or shell punctuation. Paste a JSON array in which each item is one argument. The output quotes every item independently and joins them with spaces, including a special sequence for embedded apostrophes. It can be appended to a command in a POSIX-compatible shell after reviewing the intended program and arguments."
      },
      {
        "heading": "Format rules and limitations",
        "body": "This only encodes argument boundaries and does not execute or validate the resulting command. It targets POSIX shells such as sh and Bash, not PowerShell or Windows cmd. NUL characters cannot be passed as ordinary process arguments and are rejected. Quoting does not prevent an invoked program from interpreting a leading dash as an option; use that program’s argument conventions, such as an option terminator where supported."
      }
    ],
    "faq": {
      "question": "What should I check before relying on the output?",
      "answer": "This only encodes argument boundaries and does not execute or validate the resulting command."
    },
    "related": [
      "/tools/backslash-escape",
      "/tools/curl-to-fetch"
    ],
    "modified": "2026-11-06"
  },
  {
    "slug": "sms-segment-calculator",
    "title": "SMS Segment Calculator",
    "description": "Estimate GSM-7 or Unicode SMS segments, accounting for extension characters and whole surrogate pairs.",
    "kind": "text",
    "example": "Hello! Your appointment is confirmed.",
    "fields": [],
    "action": "Run tool",
    "extension": "json",
    "steps": [
      "Load the example or paste your own input.",
      "Check the settings and run the tool.",
      "Review the result, then copy or download it."
    ],
    "sections": [
      {
        "heading": "What this tool helps you do",
        "body": "Check how a message’s characters affect its likely SMS segment count before pasting it into a sending platform. Basic GSM characters consume one unit and extension-table characters consume two. Text outside that alphabet switches to a Unicode count based on UTF-16 units. The report includes encoding, character and unit counts, segment count and remaining space in the last segment."
      },
      {
        "heading": "Format rules and limitations",
        "body": "The calculator uses typical capacities of 160 or 70 units for a single segment and 153 or 67 for concatenated segments. It avoids splitting a GSM escape pair or a supplementary Unicode character across a boundary. Sender types, carrier routes and concatenation headers can change real limits. It does not send messages, apply smart-character substitutions, validate delivery or calculate a bill. Your text is processed locally in the browser."
      }
    ],
    "faq": {
      "question": "What should I check before relying on the output?",
      "answer": "The calculator uses typical capacities of 160 or 70 units for a single segment and 153 or 67 for concatenated segments."
    },
    "related": [
      "/tools/word-counter",
      "/tools/unicode-normalizer"
    ],
    "modified": "2026-11-06"
  },
  {
    "slug": "css-specificity-calculator",
    "title": "CSS Selector Specificity Calculator",
    "description": "Calculate ID, class and type specificity vectors for selectors, including modern functional pseudo-classes.",
    "kind": "graphic",
    "example": "#app .card > a:hover\n:where(#app) .card\n:is(#app, .card) a",
    "fields": [],
    "action": "Convert on server",
    "extension": "json",
    "steps": [
      "Load the example or paste your own input.",
      "Review the settings, then select Convert on server to send input for processing.",
      "Review the result, then copy or download it."
    ],
    "sections": [
      {
        "heading": "What this tool helps you do",
        "body": "Inspect the specificity contribution of CSS selectors when debugging why one style competes with another. Enter one selector per line and compare the three-part vector for ID selectors, class-like selectors and type-like selectors. Modern functional pseudo-classes are handled by the selector parser, including the zero specificity of where and the argument behavior of is and has."
      },
      {
        "heading": "Format rules and limitations",
        "body": "This is a selector calculation rather than a complete cascade simulator. Origin, importance, cascade layers, scope, inheritance and source order can still decide which declaration wins. Supply one complex selector on each line rather than a top-level comma-separated list. Unsupported or malformed syntax is rejected. Values are reported as separate components, not a decimal score where ten classes would incorrectly carry into the ID component."
      }
    ],
    "faq": {
      "question": "What should I check before relying on the output?",
      "answer": "This is a selector calculation rather than a complete cascade simulator."
    },
    "related": [
      "/tools/css-selector-tester",
      "/tools/css-to-react-style"
    ],
    "modified": "2026-11-06",
    "server": {
      "input": "text"
    }
  },
  {
    "slug": "css-media-query-generator",
    "title": "CSS Media Query Generator",
    "description": "Build combined viewport, orientation, color-scheme and reduced-motion queries with a live match indicator.",
    "kind": "design",
    "example": "",
    "fields": [
      {
        "key": "minWidth",
        "label": "Minimum width (px; zero omits)",
        "default": "768",
        "type": "number",
        "min": 0,
        "max": 10000,
        "step": "any"
      },
      {
        "key": "maxWidth",
        "label": "Maximum width (px; zero omits)",
        "default": "0",
        "type": "number",
        "min": 0,
        "max": 10000,
        "step": "any"
      },
      {
        "key": "orientation",
        "label": "Orientation",
        "default": "any",
        "type": "select",
        "options": [
          {
            "value": "any",
            "label": "Any"
          },
          {
            "value": "portrait",
            "label": "Portrait"
          },
          {
            "value": "landscape",
            "label": "Landscape"
          }
        ]
      },
      {
        "key": "scheme",
        "label": "Preferred color scheme",
        "default": "any",
        "type": "select",
        "options": [
          {
            "value": "any",
            "label": "Any"
          },
          {
            "value": "light",
            "label": "Light"
          },
          {
            "value": "dark",
            "label": "Dark"
          }
        ]
      },
      {
        "key": "motion",
        "label": "Motion preference",
        "default": "any",
        "type": "select",
        "options": [
          {
            "value": "any",
            "label": "Any"
          },
          {
            "value": "reduce",
            "label": "Reduced motion"
          }
        ]
      }
    ],
    "action": "Run tool",
    "extension": "css",
    "steps": [
      "Load the example or paste your own input.",
      "Check the settings and run the tool.",
      "Review the result, then copy or download it."
    ],
    "sections": [
      {
        "heading": "What this tool helps you do",
        "body": "Assemble a CSS media condition without repeatedly typing its syntax. Choose viewport width bounds and optional device preference conditions. The tool combines the selected conditions with and and returns a stylesheet scaffold ready for your own rules. A live indicator checks the generated query against the current browser, updating when the viewport or relevant preference changes."
      },
      {
        "heading": "Format rules and limitations",
        "body": "Width conditions refer to CSS pixels, not physical screen pixels or an element’s container size. Zero disables a width bound, and an enabled maximum cannot be below the minimum. Matching a query does not guarantee a suitable layout; test the styles you add on real content. This generator does not modify the page stylesheet. Browser support for individual media features can differ, so review the target environment before deployment."
      }
    ],
    "faq": {
      "question": "What should I check before relying on the output?",
      "answer": "Width conditions refer to CSS pixels, not physical screen pixels or an element’s container size."
    },
    "related": [
      "/tools/css-clamp-calculator",
      "/tools/css-grid-generator"
    ],
    "modified": "2026-11-06"
  },
  {
    "slug": "color-harmony-generator",
    "title": "Color Harmony Palette Generator",
    "description": "Generate complementary, analogous, triadic or tetradic palettes from a HEX color with swatches and CSS variables.",
    "kind": "design",
    "example": "",
    "fields": [
      {
        "key": "base",
        "label": "Base HEX color",
        "default": "#6366f1",
        "type": "color"
      },
      {
        "key": "harmony",
        "label": "Harmony",
        "default": "triadic",
        "type": "select",
        "options": [
          {
            "value": "complementary",
            "label": "Complementary"
          },
          {
            "value": "analogous",
            "label": "Analogous"
          },
          {
            "value": "triadic",
            "label": "Triadic"
          },
          {
            "value": "split",
            "label": "Split complementary"
          },
          {
            "value": "tetradic",
            "label": "Tetradic"
          }
        ]
      }
    ],
    "action": "Run tool",
    "extension": "css",
    "steps": [
      "Load the example or paste your own input.",
      "Check the settings and run the tool.",
      "Review the result, then copy or download it."
    ],
    "sections": [
      {
        "heading": "What this tool helps you do",
        "body": "Explore related colors for an interface or illustration by rotating the base color’s hue while keeping its saturation and lightness. Choose a harmony and inspect the swatches alongside the generated HEX values and CSS custom properties. The original base color is retained exactly for its zero-degree position instead of being replaced by a rounded approximation."
      },
      {
        "heading": "Format rules and limitations",
        "body": "This uses the HSL color model and simple hue relationships, not a perceptually uniform color space or a trained design recommendation. Gray, white and black have no meaningful chromatic hue, so some results can repeat. A harmonious palette is not automatically readable or accessible: check foreground/background combinations with the contrast tool. The generator runs locally, accepts six-digit HEX input and does not change an uploaded image."
      }
    ],
    "faq": {
      "question": "What should I check before relying on the output?",
      "answer": "This uses the HSL color model and simple hue relationships, not a perceptually uniform color space or a trained design recommendation."
    },
    "related": [
      "/tools/color-contrast-checker",
      "/tools/color-converter"
    ],
    "modified": "2026-11-06"
  },
  {
    "slug": "html-to-markdown",
    "title": "HTML to Markdown Converter",
    "description": "Convert sanitized HTML content into Markdown with headings, links, lists, code blocks and supported tables.",
    "kind": "graphic",
    "example": "<h1>Project notes</h1><p>Hello, <strong>world</strong>!</p><ul><li>Review</li><li>Share</li></ul><pre><code>console.log(\"Hello\");</code></pre>",
    "fields": [],
    "action": "Convert on server",
    "extension": "md",
    "steps": [
      "Load the example or paste your own input.",
      "Review the settings, then select Convert on server to send input for processing.",
      "Review the result, then copy or download it."
    ],
    "sections": [
      {
        "heading": "What this tool helps you do",
        "body": "Move a small HTML article or content fragment into a Markdown workflow. The converter sanitizes the source, then maps supported headings, emphasis, links, lists and code blocks to Markdown. Common tables and strike-through use the GitHub-flavored extensions. URLs remain references in the output and are not fetched while converting the fragment."
      },
      {
        "heading": "Format rules and limitations",
        "body": "This does not render a page, execute scripts, download resources or reproduce CSS layout. Complex table geometry and unsupported structures may fall back to simpler text or sanitized markup, so inspect the result in the intended Markdown renderer. Images can remain as URL references rather than embedded image files. Input is limited to two hundred thousand characters. Conversion is structural and can change whitespace and presentation."
      }
    ],
    "faq": {
      "question": "What should I check before relying on the output?",
      "answer": "This does not render a page, execute scripts, download resources or reproduce CSS layout."
    },
    "related": [
      "/tools/markdown-to-html",
      "/tools/markdown-to-docx"
    ],
    "modified": "2026-11-06",
    "server": {
      "input": "text"
    }
  },
  {
    "slug": "css-to-react-style",
    "title": "CSS to React Style Object Converter",
    "description": "Convert a CSS declaration list into a JavaScript style object with camelCase names and preserved custom properties.",
    "kind": "graphic",
    "example": "background-color: #6366f1; color: white; padding: 12px 20px; -webkit-user-select: none; --accent: #f59e0b;",
    "fields": [],
    "action": "Convert on server",
    "extension": "js",
    "steps": [
      "Load the example or paste your own input.",
      "Review the settings, then select Convert on server to send input for processing.",
      "Review the result, then copy or download it."
    ],
    "sections": [
      {
        "heading": "What this tool helps you do",
        "body": "Translate an inline declaration list into a React-compatible style object without manually renaming every property. Standard hyphenated names become camelCase, recognized vendor prefixes use the expected JavaScript casing and custom property names beginning with two dashes stay unchanged. Values remain CSS strings, preserving units and functions rather than guessing numeric conversions."
      },
      {
        "heading": "Format rules and limitations",
        "body": "Paste declarations only, without a selector block, media rule or stylesheet wrapper. Important declarations are rejected because React’s ordinary style object cannot represent their cascade priority directly. Repeated properties use the last declaration and are placed in its final source order. The parser checks syntax rather than proving browser support for every property or value. The output is source code for review; this tool never applies those declarations to the live page."
      }
    ],
    "faq": {
      "question": "What should I check before relying on the output?",
      "answer": "Paste declarations only, without a selector block, media rule or stylesheet wrapper."
    },
    "related": [
      "/tools/html-to-jsx",
      "/tools/css-specificity-calculator"
    ],
    "modified": "2026-11-06",
    "server": {
      "input": "text"
    }
  },
  {
    "slug": "openapi-operation-extractor",
    "title": "OpenAPI Operation Extractor",
    "description": "Extract methods, paths, operation IDs, tags and deprecated flags from OpenAPI or Swagger JSON. Build an API inventory locally.",
    "kind": "text",
    "example": "{\n  \"openapi\": \"3.1.0\",\n  \"info\": {\n    \"title\": \"Sample\",\n    \"version\": \"1.0\"\n  },\n  \"paths\": {\n    \"/users\": {\n      \"get\": {\n        \"operationId\": \"listUsers\",\n        \"summary\": \"List users\",\n        \"tags\": [\n          \"Users\"\n        ]\n      }\n    },\n    \"/users/{id}\": {\n      \"delete\": {\n        \"operationId\": \"deleteUser\",\n        \"deprecated\": true\n      }\n    }\n  }\n}",
    "action": "Analyze input",
    "extension": "json",
    "fields": [],
    "steps": [
      "Load the included example or provide your own input and settings.",
      "Choose the operation and review the supported format below.",
      "Run the tool, inspect the result, and copy or download it."
    ],
    "sections": [
      {
        "heading": "Create an endpoint inventory",
        "body": "Paste an OpenAPI 3.x or Swagger 2.0 document in JSON form to list the operations under paths. The result retains each exact path, HTTP method, operation identifier, summary, tags and deprecation flag. Use the inventory when reviewing an unfamiliar API, preparing migration notes or checking which methods belong to a resource. Path-level metadata is not mistakenly counted as an operation."
      },
      {
        "heading": "Know what is outside the inventory",
        "body": "The extractor inspects the supplied document without fetching references or contacting API servers. Referenced path items are listed separately because their operations may live elsewhere. Callbacks, webhooks, inherited security rules and parameter resolution are not expanded. This is an inventory helper rather than a complete OpenAPI validator. Convert YAML to JSON first, and use the original specification when interpreting authentication or request requirements."
      }
    ],
    "faq": {
      "question": "Does OpenAPI Operation Extractor upload my input?",
      "answer": "No. This tool processes input locally in your browser without calling a conversion API."
    },
    "related": [
      "/tools/json-schema-validator",
      "/tools/json-to-yaml",
      "/blog/openapi-paths-operations"
    ],
    "modified": "2026-11-06"
  },
  {
    "slug": "har-analyzer",
    "title": "HAR File Analyzer",
    "description": "Analyze HAR JSON locally: slow requests, HTTP errors, host counts and known response-body bytes. No requests are replayed.",
    "kind": "text",
    "example": "{\n  \"log\": {\n    \"version\": \"1.2\",\n    \"entries\": [\n      {\n        \"request\": {\n          \"method\": \"GET\",\n          \"url\": \"https://example.com/app.js?version=2\"\n        },\n        \"response\": {\n          \"status\": 200,\n          \"bodySize\": 18000\n        },\n        \"time\": 120\n      },\n      {\n        \"request\": {\n          \"method\": \"GET\",\n          \"url\": \"https://example.com/api/users\"\n        },\n        \"response\": {\n          \"status\": 503,\n          \"bodySize\": 120\n        },\n        \"time\": 850\n      }\n    ]\n  }\n}",
    "action": "Analyze input",
    "extension": "json",
    "fields": [],
    "steps": [
      "Load the included example or provide your own input and settings.",
      "Choose the operation and review the supported format below.",
      "Run the tool, inspect the result, and copy or download it."
    ],
    "sections": [
      {
        "heading": "Find requests worth investigating",
        "body": "Export a HAR capture from browser developer tools, then paste its JSON to summarize up to ten thousand recorded requests. The report lists status failures, counts requests by host and ranks the twenty slowest entries. Response body sizes are summed only when the capture reports a known nonnegative size. Unknown sizes stay visible instead of silently becoming evidence of a zero-byte response."
      },
      {
        "heading": "Interpret timings and sensitive data carefully",
        "body": "Requests frequently overlap, so their individual durations cannot be added to obtain page load time. Body size also differs from total network transfer because headers, compression and caching affect the capture. The report omits query strings, credentials, headers and bodies, but path names can still contain identifiers. Processing stays local and never replays captured requests. Review the capture before sharing it or its derived report."
      }
    ],
    "faq": {
      "question": "Does HAR File Analyzer upload my input?",
      "answer": "No. This tool processes input locally in your browser without calling a conversion API."
    },
    "related": [
      "/tools/cache-control-parser",
      "/tools/http-headers-to-json",
      "/blog/read-har-network-requests"
    ],
    "modified": "2026-11-06"
  },
  {
    "slug": "cache-control-parser",
    "title": "Cache-Control Header Parser",
    "description": "Parse Cache-Control directives, quoted values, duplicate directives and numeric freshness settings with practical interpretation hints.",
    "kind": "text",
    "example": "Cache-Control: public, max-age=3600, stale-while-revalidate=60",
    "action": "Analyze input",
    "extension": "json",
    "fields": [],
    "steps": [
      "Load the included example or provide your own input and settings.",
      "Choose the operation and review the supported format below.",
      "Run the tool, inspect the result, and copy or download it."
    ],
    "sections": [
      {
        "heading": "Inspect a cache policy one directive at a time",
        "body": "Paste a single Cache-Control field value with or without its header name. The parser separates directives without splitting commas inside quoted strings, keeps extension directives and identifies repeated names. Common age and stale-window directives are checked for nonnegative integer values. This helps diagnose a copied response header without confusing a quoted field list with several unrelated directives."
      },
      {
        "heading": "Distinguish storage from revalidation",
        "body": "A no-cache directive asks for validation before reuse; it does not itself prohibit storing a response. No-store addresses storage. The report provides these narrow interpretation hints and flags obvious conflicts such as public together with private. It does not calculate the complete cache outcome, which also depends on status, request headers, Age, freshness, Vary and cache implementation. Check actual responses after changing a server or CDN configuration."
      }
    ],
    "faq": {
      "question": "Does Cache-Control Header Parser upload my input?",
      "answer": "No. This tool processes input locally in your browser without calling a conversion API."
    },
    "related": [
      "/tools/http-headers-to-json",
      "/tools/har-analyzer",
      "/blog/cache-control-no-cache-no-store"
    ],
    "modified": "2026-11-06"
  },
  {
    "slug": "email-header-parser",
    "title": "Email Header Parser",
    "description": "Unfold raw email headers, retain repeated fields and inspect Received order locally. No mailbox connection or message upload required.",
    "kind": "text",
    "example": "From: Ada <ada@example.com>\r\nTo: team@example.net\r\nSubject: Release notes\r\n for this week\r\nReceived: from relay.example by mx.example.net; Tue, 3 Nov 2026 10:00:00 +0000\r\nReceived: from client.example by relay.example; Tue, 3 Nov 2026 09:59:58 +0000",
    "action": "Analyze input",
    "extension": "json",
    "fields": [],
    "steps": [
      "Load the included example or provide your own input and settings.",
      "Choose the operation and review the supported format below.",
      "Run the tool, inspect the result, and copy or download it."
    ],
    "sections": [
      {
        "heading": "Read raw header structure",
        "body": "Copy the raw header block from a message source view rather than the rendered message display. Continuation lines beginning with a space or tab are unfolded into the previous field. Repeated fields remain separate and in their original order, which is important for Received chains and other trace information. The parser stops at the first empty line and does not parse the message body."
      },
      {
        "heading": "Do not equate parsing with authentication",
        "body": "Received fields are shown newest first as they appeared in the input; the tool does not establish which relay is trustworthy. Authentication-Results and From values remain claims in the supplied text. Encoded words are preserved, not decoded, and timestamp differences are not treated as verified delivery delays. Use trusted mailbox diagnostics for sender authentication and redact addresses or identifiers before sharing the resulting report."
      }
    ],
    "faq": {
      "question": "Does Email Header Parser upload my input?",
      "answer": "No. This tool processes input locally in your browser without calling a conversion API."
    },
    "related": [
      "/tools/http-headers-to-json",
      "/tools/text-frequency-analyzer",
      "/blog/read-email-received-headers"
    ],
    "modified": "2026-11-06"
  },
  {
    "slug": "curl-command-builder",
    "title": "cURL Command Builder",
    "description": "Build a POSIX-shell cURL command from a URL, method, JSON headers and request body. Quote arguments safely without sending the request.",
    "kind": "text",
    "example": "{\"name\":\"Ada\",\"active\":true}",
    "action": "Analyze input",
    "extension": "sh",
    "fields": [
      {
        "key": "url",
        "label": "Request URL",
        "default": "https://example.com/api/users",
        "type": "text"
      },
      {
        "key": "method",
        "label": "HTTP method",
        "default": "POST",
        "type": "select",
        "options": [
          {
            "value": "GET",
            "label": "GET"
          },
          {
            "value": "POST",
            "label": "POST"
          },
          {
            "value": "PUT",
            "label": "PUT"
          },
          {
            "value": "PATCH",
            "label": "PATCH"
          },
          {
            "value": "DELETE",
            "label": "DELETE"
          },
          {
            "value": "HEAD",
            "label": "HEAD"
          }
        ]
      },
      {
        "key": "headers",
        "label": "Headers as a JSON object",
        "default": "{\"Content-Type\":\"application/json\"}",
        "type": "text"
      }
    ],
    "steps": [
      "Load the included example or provide your own input and settings.",
      "Choose the operation and review the supported format below.",
      "Run the tool, inspect the result, and copy or download it."
    ],
    "sections": [
      {
        "heading": "Build a reproducible request template",
        "body": "Enter an absolute HTTP or HTTPS URL, select a method and provide headers as a JSON object of string values. The main editor supplies an optional raw body. The result includes explicit URL and method options, disables URL globbing, and quotes each shell argument independently. This is useful for preparing a documented example or recreating a request outside a browser without sending it during generation."
      },
      {
        "heading": "Match the generated command to your shell",
        "body": "The generated quoting targets POSIX shells such as sh and bash; it is not a PowerShell or Windows cmd quoting format. A raw body is passed with data-raw, so an initial at sign is not interpreted as a local filename. Headers reject embedded line breaks, and URL credentials are rejected. Review secrets before saving the command to documentation, terminal history or a shared issue tracker."
      }
    ],
    "faq": {
      "question": "Does cURL Command Builder upload my input?",
      "answer": "No. This tool processes input locally in your browser without calling a conversion API."
    },
    "related": [
      "/tools/curl-to-fetch",
      "/tools/shell-argument-escaper",
      "/blog/curl-post-json-command"
    ],
    "modified": "2026-11-06"
  },
  {
    "slug": "sql-placeholder-converter",
    "title": "SQL Placeholder Converter",
    "description": "Convert question-mark SQL bind placeholders to PostgreSQL $1 parameters, or back to ? with a parameter-order report.",
    "kind": "text",
    "example": "SELECT * FROM users WHERE email = ? AND active = ? AND note <> '?';",
    "action": "Analyze input",
    "extension": "json",
    "fields": [
      {
        "key": "direction",
        "label": "Conversion direction",
        "default": "to-postgres",
        "type": "select",
        "options": [
          {
            "value": "to-postgres",
            "label": "? → $1, $2"
          },
          {
            "value": "to-question",
            "label": "$1, $2 → ?"
          }
        ]
      }
    ],
    "steps": [
      "Load the included example or provide your own input and settings.",
      "Choose the operation and review the supported format below.",
      "Run the tool, inspect the result, and copy or download it."
    ],
    "sections": [
      {
        "heading": "Convert prepared-statement placeholders",
        "body": "Use a prepared-statement SQL template to switch between anonymous question-mark parameters and PostgreSQL numbered parameters. Quoted strings, quoted identifiers, line comments, nested block comments and dollar-quoted strings are preserved. In the reverse direction the report includes an occurrence-based parameter order, so a repeated or out-of-order numbered parameter can be bound correctly by an anonymous-placeholder driver."
      },
      {
        "heading": "Keep binding separate from SQL text",
        "body": "This utility never substitutes values or executes SQL. Bind parameters through the receiving database driver after converting the template. SQL dialects disagree about quoting and operators; standalone PostgreSQL question-mark JSON operators cannot be distinguished from anonymous placeholders and must not be used as source placeholders. Question-mark pipe and ampersand operators are rejected. Review the output and its parameter order before changing an application query."
      }
    ],
    "faq": {
      "question": "Does SQL Placeholder Converter upload my input?",
      "answer": "No. This tool processes input locally in your browser without calling a conversion API."
    },
    "related": [
      "/tools/sql-formatter",
      "/tools/sql-in-clause-generator",
      "/blog/sql-bind-placeholder-styles"
    ],
    "modified": "2026-11-06"
  },
  {
    "slug": "json-key-case-converter",
    "title": "JSON Key Case Converter",
    "description": "Recursively convert JSON property names to camelCase, snake_case, kebab-case or PascalCase with collision detection.",
    "kind": "text",
    "example": "{\"user_name\":\"Ada\",\"HTTPStatus\":200,\"profile_data\":{\"last_login\":null}}",
    "action": "Analyze input",
    "extension": "json",
    "fields": [
      {
        "key": "style",
        "label": "Property naming",
        "default": "camel",
        "type": "select",
        "options": [
          {
            "value": "camel",
            "label": "camelCase"
          },
          {
            "value": "snake",
            "label": "snake_case"
          },
          {
            "value": "kebab",
            "label": "kebab-case"
          },
          {
            "value": "pascal",
            "label": "PascalCase"
          }
        ]
      }
    ],
    "steps": [
      "Load the included example or provide your own input and settings.",
      "Choose the operation and review the supported format below.",
      "Run the tool, inspect the result, and copy or download it."
    ],
    "sections": [
      {
        "heading": "Change property conventions recursively",
        "body": "Convert keys in objects nested inside arrays and other objects while keeping scalar values unchanged. The converter recognizes common camel-case boundaries, uppercase acronym boundaries and punctuation separators before applying the selected naming convention. Use it for reviewing an API response, preparing a fixture or adapting a small configuration document. Array positions and ordinary string values are not treated as property names."
      },
      {
        "heading": "Detect collisions before exporting",
        "body": "Different source keys can produce the same destination name, for example user-name and user_name. Instead of silently overwriting a value, the converter stops with a collision error. Keys that contain no usable letters or numbers are also rejected. Input is limited to thirty-two nesting levels and fifty thousand visited values. JSON numeric precision follows the browser parser; encode long identifiers as strings before transformation."
      }
    ],
    "faq": {
      "question": "Does JSON Key Case Converter upload my input?",
      "answer": "No. This tool processes input locally in your browser without calling a conversion API."
    },
    "related": [
      "/tools/json-key-renamer",
      "/tools/json-to-typescript-interface",
      "/tools/json-array-sorter"
    ],
    "modified": "2026-11-06"
  },
  {
    "slug": "json-array-sorter",
    "title": "JSON Array Sorter",
    "description": "Stably sort JSON objects by a numeric or string property. Keep missing and null values last in either sort direction.",
    "kind": "text",
    "example": "[{\"name\":\"Ada\",\"score\":90},{\"name\":\"Grace\",\"score\":100},{\"name\":\"Linus\",\"score\":90}]",
    "action": "Analyze input",
    "extension": "json",
    "fields": [
      {
        "key": "key",
        "label": "Exact property name",
        "default": "score",
        "type": "text"
      },
      {
        "key": "type",
        "label": "Value type",
        "default": "number",
        "type": "select",
        "options": [
          {
            "value": "number",
            "label": "Number"
          },
          {
            "value": "string",
            "label": "String"
          }
        ]
      },
      {
        "key": "order",
        "label": "Sort direction",
        "default": "desc",
        "type": "select",
        "options": [
          {
            "value": "asc",
            "label": "Ascending"
          },
          {
            "value": "desc",
            "label": "Descending"
          }
        ]
      }
    ],
    "steps": [
      "Load the included example or provide your own input and settings.",
      "Choose the operation and review the supported format below.",
      "Run the tool, inspect the result, and copy or download it."
    ],
    "sections": [
      {
        "heading": "Sort records without converting their values",
        "body": "Provide an array of JSON objects and select an exact top-level property name. Numeric mode compares finite numbers rather than their formatted strings, so ten sorts after two. String mode compares JavaScript string order without a language-specific collation. The entire original record travels with its sort key, making the result suitable for inspecting API fixtures, reports and test data."
      },
      {
        "heading": "Make ties and absent keys predictable",
        "body": "Equal sort keys retain their original relative order. Missing properties and explicit null values move to the end in both ascending and descending modes. Other value types must match the chosen mode, preventing an accidental mixture of numbers and numeric-looking strings. Nested property paths and locale-aware alphabetic ordering are not implemented. Inputs are bounded to ten thousand objects and still use ordinary browser JSON number precision."
      }
    ],
    "faq": {
      "question": "Does JSON Array Sorter upload my input?",
      "answer": "No. This tool processes input locally in your browser without calling a conversion API."
    },
    "related": [
      "/tools/json-array-filter",
      "/tools/json-group-by",
      "/tools/json-key-case-converter"
    ],
    "modified": "2026-11-06"
  },
  {
    "slug": "csv-to-json-lines",
    "title": "CSV to JSON Lines Converter",
    "description": "Convert CSV or TSV rows directly to NDJSON records while preserving quoted fields, line breaks and numeric-looking text.",
    "kind": "text",
    "example": "id,name,note\n001,Ada,\"hello, team\"\n002,Grace,\"two lines\nin a cell\"",
    "action": "Analyze input",
    "extension": "ndjson",
    "fields": [
      {
        "key": "delimiter",
        "label": "Input delimiter",
        "default": ",",
        "type": "select",
        "options": [
          {
            "value": ",",
            "label": "Comma"
          },
          {
            "value": ";",
            "label": "Semicolon"
          },
          {
            "value": "\t",
            "label": "Tab"
          }
        ]
      }
    ],
    "steps": [
      "Load the included example or provide your own input and settings.",
      "Choose the operation and review the supported format below.",
      "Run the tool, inspect the result, and copy or download it."
    ],
    "sections": [
      {
        "heading": "Export one complete object per line",
        "body": "Use the first row as the property-name header and convert each following row to a complete JSON object. Quoted delimiters, doubled quotes and line breaks inside cells are handled by the shared separated-value parser. Each output record occupies one physical line because line breaks inside strings are JSON-escaped. A final newline is included for compatibility with common text-processing workflows."
      },
      {
        "heading": "Preserve spreadsheet text deliberately",
        "body": "All CSV cells remain strings, including leading zeros, dates, booleans and empty cells. This avoids silently guessing a schema while moving records into an ingestion pipeline. Header names must be unique and nonempty, and every record must have the same number of cells as the header. The tool processes up to fifty thousand data cells in memory; it is not a streaming importer for multi-gigabyte files."
      }
    ],
    "faq": {
      "question": "Does CSV to JSON Lines Converter upload my input?",
      "answer": "No. This tool processes input locally in your browser without calling a conversion API."
    },
    "related": [
      "/tools/json-to-ndjson",
      "/tools/csv-to-json",
      "/blog/csv-to-ndjson-preserve-text"
    ],
    "modified": "2026-11-06"
  },
  {
    "slug": "ascii-table-generator",
    "title": "ASCII Table Generator",
    "description": "Turn CSV or TSV into a bordered plain-text table for README files, terminal notes and text-only documentation.",
    "kind": "text",
    "example": "Name,Language,Year\nAda,English,1815\nGrace,English,1906",
    "action": "Analyze input",
    "extension": "txt",
    "fields": [
      {
        "key": "delimiter",
        "label": "Input delimiter",
        "default": ",",
        "type": "select",
        "options": [
          {
            "value": ",",
            "label": "Comma"
          },
          {
            "value": ";",
            "label": "Semicolon"
          },
          {
            "value": "\t",
            "label": "Tab"
          }
        ]
      }
    ],
    "steps": [
      "Load the included example or provide your own input and settings.",
      "Choose the operation and review the supported format below.",
      "Run the tool, inspect the result, and copy or download it."
    ],
    "sections": [
      {
        "heading": "Make a table for plain-text destinations",
        "body": "Paste comma-, semicolon- or tab-separated cells to create a table with plus, minus and pipe borders. Column widths are calculated across all rows, and the first row is followed by a header separator. Cell line breaks and tabs are replaced with spaces so each record occupies one table row. This is useful in terminal notes, text emails and documentation that does not render Markdown tables."
      },
      {
        "heading": "Understand display width limitations",
        "body": "The output is designed for a monospace font. Widths count Unicode code points, which is appropriate for simple Latin text but not a full terminal-width algorithm. Combining marks, emoji and East Asian wide characters can still appear misaligned. Inputs are limited to two hundred rows, twenty columns and eighty UTF-16 units per cell. Control characters are removed instead of being allowed to affect a terminal display."
      }
    ],
    "faq": {
      "question": "Does ASCII Table Generator upload my input?",
      "answer": "No. This tool processes input locally in your browser without calling a conversion API."
    },
    "related": [
      "/tools/csv-to-markdown",
      "/tools/markdown-table-generator",
      "/tools/csv-to-html-table"
    ],
    "modified": "2026-11-06"
  },
  {
    "slug": "fraction-calculator",
    "title": "Fraction Calculator",
    "description": "Add, subtract, multiply and divide fractions with exact BigInt arithmetic. Return a simplified fraction and decimal approximation.",
    "kind": "design",
    "example": "",
    "action": "Calculate",
    "extension": "json",
    "fields": [
      {
        "key": "left",
        "label": "First fraction",
        "default": "1/3",
        "type": "text"
      },
      {
        "key": "operation",
        "label": "Operation",
        "default": "add",
        "type": "select",
        "options": [
          {
            "value": "add",
            "label": "Add"
          },
          {
            "value": "subtract",
            "label": "Subtract"
          },
          {
            "value": "multiply",
            "label": "Multiply"
          },
          {
            "value": "divide",
            "label": "Divide"
          }
        ]
      },
      {
        "key": "right",
        "label": "Second fraction",
        "default": "1/6",
        "type": "text"
      }
    ],
    "steps": [
      "Load the included example or provide your own input and settings.",
      "Choose the operation and review the supported format below.",
      "Run the tool, inspect the result, and copy or download it."
    ],
    "sections": [
      {
        "heading": "Calculate an exact rational result",
        "body": "Enter integer fractions such as 1/3 or signed integers and choose addition, subtraction, multiplication or division. Numerators and denominators are calculated with BigInt rather than floating-point arithmetic. The final numerator and denominator are reduced by their greatest common divisor, and a negative sign is normalized to the numerator. This keeps common arithmetic results exact even when their decimals repeat."
      },
      {
        "heading": "Distinguish exact output from approximation",
        "body": "The fraction fields are exact strings. The decimal field is an ordinary approximate number for convenience and may round a repeating or very large rational value. Each input integer is limited to fifty digits, denominators cannot be zero, and division by a zero fraction is rejected. Mixed-number syntax and decimal inputs are not supported; rewrite a mixed number as an improper fraction before using this calculator."
      }
    ],
    "faq": {
      "question": "Does Fraction Calculator upload my input?",
      "answer": "No. This tool processes input locally in your browser without calling a conversion API."
    },
    "related": [
      "/tools/gcd-lcm-calculator",
      "/tools/percentage-calculator",
      "/blog/exact-fraction-arithmetic"
    ],
    "modified": "2026-11-06"
  },
  {
    "slug": "prime-factorization",
    "title": "Prime Factorization Calculator",
    "description": "Find prime factors, exponents and primality for whole numbers from 2 to one trillion. All calculations stay in your browser.",
    "kind": "design",
    "example": "",
    "action": "Calculate",
    "extension": "json",
    "fields": [
      {
        "key": "integer",
        "label": "Integer to factor",
        "default": "360",
        "type": "number",
        "min": 2,
        "max": 1000000000000
      }
    ],
    "steps": [
      "Load the included example or provide your own input and settings.",
      "Choose the operation and review the supported format below.",
      "Run the tool, inspect the result, and copy or download it."
    ],
    "sections": [
      {
        "heading": "Break an integer into prime powers",
        "body": "Enter a whole number from two through one trillion to obtain its prime factors and repeated-factor exponents. The result includes a readable multiplication expression as well as structured factor objects. If the input has exactly one factor with exponent one, it is identified as prime. Use the factorization to inspect divisibility, reduce arithmetic problems or compare the building blocks of several integers."
      },
      {
        "heading": "Use the supported size range",
        "body": "Trial division removes powers of two and then tests odd divisors only while their square can divide the remaining value. This bounded approach is predictable for the advertised range, which stays inside exact JavaScript integer precision. It is not intended for cryptographic-size integers or arbitrary-precision primality testing. Zero, one, negative numbers, fractions and larger values are rejected instead of producing misleading prime-factor reports."
      }
    ],
    "faq": {
      "question": "Does Prime Factorization Calculator upload my input?",
      "answer": "No. This tool processes input locally in your browser without calling a conversion API."
    },
    "related": [
      "/tools/gcd-lcm-calculator",
      "/tools/fraction-calculator",
      "/tools/number-base-converter"
    ],
    "modified": "2026-11-06"
  },
  {
    "slug": "matrix-calculator",
    "title": "Matrix Calculator",
    "description": "Transpose matrices, multiply two matrices or calculate a determinant from JSON arrays. Supports numeric matrices up to 10 × 10.",
    "kind": "text",
    "example": "[[1,2],[3,4]]",
    "action": "Analyze input",
    "extension": "json",
    "fields": [
      {
        "key": "operation",
        "label": "Operation",
        "default": "multiply",
        "type": "select",
        "options": [
          {
            "value": "transpose",
            "label": "Transpose A"
          },
          {
            "value": "multiply",
            "label": "A × B"
          },
          {
            "value": "determinant",
            "label": "Determinant of A"
          }
        ]
      }
    ],
    "steps": [
      "Load the included example or provide your own input and settings.",
      "Choose the operation and review the supported format below.",
      "Run the tool, inspect the result, and copy or download it."
    ],
    "sections": [
      {
        "heading": "Provide matrices as JSON arrays",
        "body": "Write each matrix as an outer array of row arrays. Every row must contain the same number of finite numeric cells. The first editor supplies matrix A; the second supplies matrix B when multiplying. Transposition exchanges rows and columns. Multiplication requires the number of columns in A to equal the number of rows in B, and returns the resulting rectangular matrix."
      },
      {
        "heading": "Interpret numerical determinants carefully",
        "body": "A determinant requires a square matrix and is calculated with row pivoting and elimination. Row swaps change the sign, and an exact zero pivot produces a zero determinant. These operations use floating-point numbers, so nearly singular matrices can accumulate rounding error. Dimensions are limited to ten by ten, extreme magnitudes are bounded, and overflowing results are rejected. This is a numerical helper rather than a symbolic algebra system."
      }
    ],
    "faq": {
      "question": "Does Matrix Calculator upload my input?",
      "answer": "No. This tool processes input locally in your browser without calling a conversion API."
    },
    "related": [
      "/tools/quadratic-equation-solver",
      "/tools/fraction-calculator",
      "/tools/ascii-table-generator"
    ],
    "modified": "2026-11-06",
    "exampleB": "[[2,0],[1,2]]",
    "inputLabel": "Matrix A (JSON)",
    "secondInputLabel": "Matrix B (JSON)"
  },
  {
    "slug": "quadratic-equation-solver",
    "title": "Quadratic Equation Solver",
    "description": "Solve ax² + bx + c = 0 for real, repeated or complex roots. Handles linear and degenerate equations explicitly.",
    "kind": "design",
    "example": "",
    "action": "Calculate",
    "extension": "json",
    "fields": [
      {
        "key": "a",
        "label": "Coefficient a",
        "default": "1",
        "type": "number",
        "min": -1e+150,
        "max": 1e+150
      },
      {
        "key": "b",
        "label": "Coefficient b",
        "default": "-3",
        "type": "number",
        "min": -1e+150,
        "max": 1e+150
      },
      {
        "key": "c",
        "label": "Coefficient c",
        "default": "2",
        "type": "number",
        "min": -1e+150,
        "max": 1e+150
      }
    ],
    "steps": [
      "Load the included example or provide your own input and settings.",
      "Choose the operation and review the supported format below.",
      "Run the tool, inspect the result, and copy or download it."
    ],
    "sections": [
      {
        "heading": "Identify the kind of equation first",
        "body": "Supply the coefficients of ax squared plus bx plus c equals zero. A nonzero quadratic coefficient leads to two real roots, one repeated root or a complex conjugate pair according to the discriminant. If the quadratic coefficient is zero, the calculator handles the remaining linear equation separately. The all-zero identity and an inconsistent constant equation also receive explicit results rather than division errors."
      },
      {
        "heading": "Reduce avoidable floating-point cancellation",
        "body": "Coefficients are scaled before evaluating the discriminant, and distinct real roots use a cancellation-resistant formulation with the second root derived from their product. This improves ordinary numerical results but does not create symbolic exactness. Very unequal coefficients, near-zero discriminants and extreme roots can still lose precision or exceed the supported range. Check sensitive results by substituting them into the original equation using an appropriate numerical tolerance."
      }
    ],
    "faq": {
      "question": "Does Quadratic Equation Solver upload my input?",
      "answer": "No. This tool processes input locally in your browser without calling a conversion API."
    },
    "related": [
      "/tools/matrix-calculator",
      "/tools/fraction-calculator",
      "/tools/scientific-notation-converter"
    ],
    "modified": "2026-11-06"
  },
  {
    "slug": "binomial-probability-calculator",
    "title": "Binomial Probability Calculator",
    "description": "Calculate exactly, at most or at least k successes in n independent trials, with expected value and standard deviation.",
    "kind": "design",
    "example": "",
    "action": "Calculate",
    "extension": "json",
    "fields": [
      {
        "key": "trials",
        "label": "Number of trials n",
        "default": "10",
        "type": "number",
        "min": 0,
        "max": 1000
      },
      {
        "key": "successes",
        "label": "Successes k",
        "default": "3",
        "type": "number",
        "min": 0,
        "max": 1000
      },
      {
        "key": "probability",
        "label": "Success probability p",
        "default": "0.5",
        "type": "number",
        "min": 0,
        "max": 1
      },
      {
        "key": "mode",
        "label": "Probability to calculate",
        "default": "exactly",
        "type": "select",
        "options": [
          {
            "value": "exactly",
            "label": "Exactly k"
          },
          {
            "value": "at-most",
            "label": "At most k"
          },
          {
            "value": "at-least",
            "label": "At least k"
          }
        ]
      }
    ],
    "steps": [
      "Load the included example or provide your own input and settings.",
      "Choose the operation and review the supported format below.",
      "Run the tool, inspect the result, and copy or download it."
    ],
    "sections": [
      {
        "heading": "Choose the probability event precisely",
        "body": "Set the number of trials, the target number of successes and a success probability from zero through one. Exactly counts only the chosen outcome. At most includes that outcome and every smaller count, while at least includes it and every larger count. The report also gives the expected number of successes and standard deviation, which describe the distribution rather than guaranteeing a particular outcome."
      },
      {
        "heading": "Check the binomial assumptions",
        "body": "Trials must be independent and share the same success probability. Sampling without replacement or changing conditions may require another distribution. The calculator supports up to one thousand trials and evaluates probabilities through logarithms rather than overflowing factorials. Very tiny tail probabilities can underflow to zero in floating-point arithmetic. Endpoint probabilities zero and one are handled explicitly, and a target count cannot exceed the number of trials."
      }
    ],
    "faq": {
      "question": "Does Binomial Probability Calculator upload my input?",
      "answer": "No. This tool processes input locally in your browser without calling a conversion API."
    },
    "related": [
      "/tools/percentage-calculator",
      "/tools/fraction-calculator",
      "/blog/binomial-at-least-probability"
    ],
    "modified": "2026-11-06"
  },
  {
    "slug": "css-pattern-generator",
    "title": "CSS Background Pattern Generator",
    "description": "Generate repeating dots, diagonal stripes or checkerboard backgrounds with live CSS previews and custom colors.",
    "kind": "design",
    "example": "",
    "action": "Generate CSS",
    "extension": "css",
    "fields": [
      {
        "key": "pattern",
        "label": "Pattern style",
        "default": "dots",
        "type": "select",
        "options": [
          {
            "value": "dots",
            "label": "Dots"
          },
          {
            "value": "stripes",
            "label": "Diagonal stripes"
          },
          {
            "value": "checker",
            "label": "Checkerboard"
          }
        ]
      },
      {
        "key": "size",
        "label": "Pattern tile size (px)",
        "default": "24",
        "type": "number",
        "min": 4,
        "max": 200
      },
      {
        "key": "base",
        "label": "Background color",
        "default": "#101827",
        "type": "color"
      },
      {
        "key": "ink",
        "label": "Pattern color",
        "default": "#6379a8",
        "type": "color"
      }
    ],
    "steps": [
      "Load the included example or provide your own input and settings.",
      "Choose the operation and review the supported format below.",
      "Run the tool, inspect the result, and copy or download it."
    ],
    "sections": [
      {
        "heading": "Create a repeating background without an image",
        "body": "Choose dots, diagonal stripes or a checkerboard and set a tile size plus two colors. The generator builds a CSS gradient background and shows it in a live browser preview. A background shorthand includes the generated image, tile size and base color, so the copied rule can be applied to a section or decorative element without downloading an additional raster asset."
      },
      {
        "heading": "Keep patterns subordinate to content",
        "body": "Dense patterns can make text difficult to read even when each chosen color looks attractive alone. Use a separate solid surface behind long text, test the actual foreground contrast and inspect the design at different browser sizes. The dot radius is fixed while tile spacing changes. These patterns are decorative and convey no information on their own; provide semantic content independently of the generated background."
      }
    ],
    "faq": {
      "question": "Does CSS Background Pattern Generator upload my input?",
      "answer": "No. This tool processes input locally in your browser without calling a conversion API."
    },
    "related": [
      "/tools/css-gradient-generator",
      "/tools/color-contrast-checker",
      "/tools/css-border-generator"
    ],
    "modified": "2026-11-06"
  },
  {
    "slug": "css-border-generator",
    "title": "CSS Border Generator",
    "description": "Create solid, dashed, dotted or double CSS borders with custom width, color and corner radius. Preview and copy the rule.",
    "kind": "design",
    "example": "",
    "action": "Generate CSS",
    "extension": "css",
    "fields": [
      {
        "key": "width",
        "label": "Width (px)",
        "default": "3",
        "type": "number",
        "min": 0,
        "max": 40
      },
      {
        "key": "style",
        "label": "Line style",
        "default": "solid",
        "type": "select",
        "options": [
          {
            "value": "solid",
            "label": "Solid"
          },
          {
            "value": "dashed",
            "label": "Dashed"
          },
          {
            "value": "dotted",
            "label": "Dotted"
          },
          {
            "value": "double",
            "label": "Double"
          }
        ]
      },
      {
        "key": "color",
        "label": "Line color",
        "default": "#7c9cff",
        "type": "color"
      },
      {
        "key": "radius",
        "label": "Corner radius (px)",
        "default": "16",
        "type": "number",
        "min": 0,
        "max": 100
      }
    ],
    "steps": [
      "Load the included example or provide your own input and settings.",
      "Choose the operation and review the supported format below.",
      "Run the tool, inspect the result, and copy or download it."
    ],
    "sections": [
      {
        "heading": "Preview a consistent border rule",
        "body": "Choose a border width, line style, color and corner radius to generate a reusable CSS class. The preview uses the same properties that appear in the output, so changes to the controls can be inspected directly. All four sides use one consistent border. Use the generated rule for a card, input container or small component, then adjust the class name to match your stylesheet."
      },
      {
        "heading": "Account for the box model",
        "body": "A border normally contributes to the rendered element size unless box sizing is configured appropriately. The generated rule does not change the surrounding layout or force a box-sizing convention. Double borders need enough width for both strokes and the separating gap to appear clearly; dotted and dashed patterns depend partly on browser rendering. A zero-width choice deliberately hides the border while preserving the selected radius value."
      }
    ],
    "faq": {
      "question": "Does CSS Border Generator upload my input?",
      "answer": "No. This tool processes input locally in your browser without calling a conversion API."
    },
    "related": [
      "/tools/css-outline-generator",
      "/tools/css-border-radius-generator",
      "/tools/css-box-shadow-generator"
    ],
    "modified": "2026-11-06"
  },
  {
    "slug": "css-outline-generator",
    "title": "CSS Outline Generator",
    "description": "Generate CSS outlines with width, style, offset and rounded-corner preview. Useful for reviewing focus-ring treatments.",
    "kind": "design",
    "example": "",
    "action": "Generate CSS",
    "extension": "css",
    "fields": [
      {
        "key": "width",
        "label": "Width (px)",
        "default": "3",
        "type": "number",
        "min": 0,
        "max": 40
      },
      {
        "key": "style",
        "label": "Line style",
        "default": "solid",
        "type": "select",
        "options": [
          {
            "value": "solid",
            "label": "Solid"
          },
          {
            "value": "dashed",
            "label": "Dashed"
          },
          {
            "value": "dotted",
            "label": "Dotted"
          },
          {
            "value": "double",
            "label": "Double"
          }
        ]
      },
      {
        "key": "color",
        "label": "Line color",
        "default": "#7c9cff",
        "type": "color"
      },
      {
        "key": "radius",
        "label": "Corner radius (px)",
        "default": "16",
        "type": "number",
        "min": 0,
        "max": 100
      },
      {
        "key": "offset",
        "label": "Outline offset (px)",
        "default": "4",
        "type": "number",
        "min": -20,
        "max": 40
      }
    ],
    "steps": [
      "Load the included example or provide your own input and settings.",
      "Choose the operation and review the supported format below.",
      "Run the tool, inspect the result, and copy or download it."
    ],
    "sections": [
      {
        "heading": "Explore an outline without changing layout size",
        "body": "An outline is drawn around an element without taking up the box-model space used by a border. Choose its width, style, color and offset to see how the ring sits around the preview. A positive offset moves it outward; a negative offset draws it inward. The generated class includes a corner radius for the underlying element as well as the outline properties."
      },
      {
        "heading": "Test focus treatments in the real interface",
        "body": "The generator produces a general outline class rather than automatically changing focus styles or removing browser defaults. When adapting it for focus-visible, verify that keyboard users can locate focus on every relevant background and at zoomed sizes. Parent clipping and overflow rules may cut off an outward outline. Do not assume a decorative ring meets accessibility requirements merely because it looks clear in this isolated preview."
      }
    ],
    "faq": {
      "question": "Does CSS Outline Generator upload my input?",
      "answer": "No. This tool processes input locally in your browser without calling a conversion API."
    },
    "related": [
      "/tools/css-border-generator",
      "/tools/color-contrast-checker",
      "/tools/css-box-shadow-generator"
    ],
    "modified": "2026-11-06"
  },
  {
    "slug": "unix-timestamp-batch-converter",
    "title": "Batch Unix Timestamp Converter",
    "description": "Convert up to 1,000 Unix timestamps to ISO UTC dates. Explicitly choose seconds or milliseconds and retain each source value.",
    "kind": "text",
    "example": "0\n1700000000\n-1",
    "action": "Analyze input",
    "extension": "json",
    "fields": [
      {
        "key": "unit",
        "label": "Input timestamp unit",
        "default": "seconds",
        "type": "select",
        "options": [
          {
            "value": "seconds",
            "label": "Seconds"
          },
          {
            "value": "milliseconds",
            "label": "Milliseconds"
          }
        ]
      }
    ],
    "steps": [
      "Load the included example or provide your own input and settings.",
      "Choose the operation and review the supported format below.",
      "Run the tool, inspect the result, and copy or download it."
    ],
    "sections": [
      {
        "heading": "Convert a log column consistently",
        "body": "Paste one integer timestamp per line and explicitly select seconds or milliseconds. Every result retains its original text alongside an ISO-formatted UTC date, which makes it easier to compare a converted log column with the source. Negative timestamps represent times before the Unix epoch. The tool does not guess units based on digit count, because historical and future values make that shortcut unreliable."
      },
      {
        "heading": "Preserve exact input precision",
        "body": "Both the parsed integer and its millisecond representation must fit JavaScript safe-integer precision, and the resulting date must be inside the browser date range. A malformed line stops the conversion with its original line number instead of silently dropping a record. Fractional timestamps and locale-dependent date strings are not accepted. For display in a regional time zone, use the separate time-zone converter after obtaining the UTC instant."
      }
    ],
    "faq": {
      "question": "Does Batch Unix Timestamp Converter upload my input?",
      "answer": "No. This tool processes input locally in your browser without calling a conversion API."
    },
    "related": [
      "/tools/date-to-unix-timestamp",
      "/tools/time-zone-converter",
      "/blog/unix-seconds-vs-milliseconds"
    ],
    "modified": "2026-11-06"
  },
  {
    "slug": "text-frequency-analyzer",
    "title": "Word and Character Frequency Analyzer",
    "description": "Rank repeated words or Unicode characters with counts and percentages. Choose case-sensitive matching and export the frequency report.",
    "kind": "text",
    "example": "Useful tools save time. Useful examples make tools easier to use.",
    "action": "Analyze input",
    "extension": "json",
    "fields": [
      {
        "key": "mode",
        "label": "Count units",
        "default": "words",
        "type": "select",
        "options": [
          {
            "value": "words",
            "label": "Words"
          },
          {
            "value": "characters",
            "label": "Characters"
          }
        ]
      },
      {
        "key": "caseSensitive",
        "label": "Case-sensitive matching",
        "default": "false",
        "type": "select",
        "options": [
          {
            "value": "false",
            "label": "Ignore case"
          },
          {
            "value": "true",
            "label": "Preserve case"
          }
        ]
      },
      {
        "key": "limit",
        "label": "Maximum ranked results",
        "default": "50",
        "type": "number",
        "min": 1,
        "max": 500
      }
    ],
    "steps": [
      "Load the included example or provide your own input and settings.",
      "Choose the operation and review the supported format below.",
      "Run the tool, inspect the result, and copy or download it."
    ],
    "sections": [
      {
        "heading": "Find repeated terms in a text sample",
        "body": "Analyze word or character frequency to spot repetitive wording, inspect a dataset label column or summarize a small text corpus. Results are ranked by descending count, with a deterministic string-order tie break. Percentages use the total number of counted tokens as their denominator. A result limit shortens the displayed ranking without changing the total token count or the reported number of unique tokens."
      },
      {
        "heading": "Understand the counting units",
        "body": "Word mode groups Unicode letters and numbers and retains apostrophes inside words. It is not a language-aware tokenizer for scripts that normally omit spaces. Character mode counts Unicode code points after NFC normalization and excludes whitespace; a visual emoji sequence or combining cluster may contain several counted units. Case folding is optional and uses ordinary Unicode lowercase conversion rather than a language-specific linguistic analysis."
      }
    ],
    "faq": {
      "question": "Does Word and Character Frequency Analyzer upload my input?",
      "answer": "No. This tool processes input locally in your browser without calling a conversion API."
    },
    "related": [
      "/tools/word-counter",
      "/tools/unicode-normalizer",
      "/tools/invisible-character-detector"
    ],
    "modified": "2026-11-06"
  },
  {
    "slug": "pdf-compressor",
    "title": "PDF Compressor",
    "description": "Reduce scanned PDF size with JPEG downsampling. Choose resolution and quality; keep the original when it is already smaller.",
    "kind": "graphic",
    "example": "",
    "action": "Convert on server",
    "extension": "pdf",
    "fields": [
      {
        "key": "dpi",
        "label": "Output resolution",
        "default": "96",
        "type": "select",
        "options": [
          {
            "value": "72",
            "label": "72 DPI · small"
          },
          {
            "value": "96",
            "label": "96 DPI · balanced"
          },
          {
            "value": "144",
            "label": "144 DPI · clearer"
          }
        ]
      },
      {
        "key": "quality",
        "label": "JPEG quality",
        "default": "65",
        "type": "number",
        "min": 30,
        "max": 90,
        "step": "1"
      },
      {
        "key": "keepOriginal",
        "label": "Return the original if smaller",
        "default": "true",
        "type": "checkbox"
      }
    ],
    "steps": [
      "Choose your file or load the example.",
      "Review the settings and the format notes before continuing.",
      "Select Convert on server and download the result."
    ],
    "sections": [
      {
        "heading": "Make an image-heavy PDF easier to send",
        "body": "Scanned documents and photo-heavy PDFs often contain more image detail than a recipient needs for on-screen reading. This compressor renders each page at your chosen resolution and stores it as a compressed JPEG inside a new PDF. Lower resolution and quality can reduce size, but also make small writing harder to read. Inspect the downloaded result before using it for an application or sharing important records."
      },
      {
        "heading": "Understand the raster conversion",
        "body": "The rebuilt PDF contains page images rather than selectable text, live form fields or vector artwork. Original links, annotations and signatures are not carried into that rebuilt output. The operation supports up to twenty pages and cannot promise a specific final size. By default the original is returned unchanged when rebuilding would increase its size; its download name identifies that case. This method is most appropriate for scans, not text-preserving optimization."
      }
    ],
    "faq": {
      "question": "Where is my file processed?",
      "answer": "The selected file is sent to this site only when you run the server conversion. Processing uses memory without a saved conversion history."
    },
    "related": [
      "/tools/pdf-splitter",
      "/tools/pdf-to-word",
      "/tools/image-target-size"
    ],
    "modified": "2026-11-06",
    "server": {
      "input": "files",
      "accept": "application/pdf,.pdf",
      "warning": "Rebuilt pages become images: selectable text, forms, links and signatures are not preserved. Maximum 20 pages. If the original is smaller, it is returned unchanged by default."
    }
  },
  {
    "slug": "pdf-splitter",
    "title": "Split PDF",
    "description": "Split a PDF into separate files by page count and download them together in a ZIP. Original page content is copied without rasterizing.",
    "kind": "graphic",
    "example": "",
    "action": "Convert on server",
    "extension": "zip",
    "fields": [
      {
        "key": "pagesPerFile",
        "label": "Pages per output PDF",
        "default": "1",
        "type": "number",
        "min": 1,
        "max": 200,
        "step": "1"
      }
    ],
    "steps": [
      "Choose your file or load the example.",
      "Review the settings and the format notes before continuing.",
      "Select Convert on server and download the result."
    ],
    "sections": [
      {
        "heading": "Separate one document into usable pieces",
        "body": "Choose how many consecutive pages belong in each output file. A setting of one creates a separate PDF for every page; a larger setting groups pages into consecutive chunks. The final chunk can contain fewer pages when the total is not divisible by the chosen group size. All resulting files are packaged in a ZIP with page-range names, making it easy to identify and send the intended section."
      },
      {
        "heading": "Keep the page count and file boundaries clear",
        "body": "The splitter copies page content instead of rendering screenshots, so ordinary text and vector artwork remain available. Document-level bookmarks, signatures and interactive form relationships are not guaranteed to survive a copy into separate documents. Inputs may contain up to two hundred pages and the operation creates at most fifty output files. Choose a larger group size if a long document would exceed that count; output size is also bounded."
      }
    ],
    "faq": {
      "question": "Where is my file processed?",
      "answer": "The selected file is sent to this site only when you run the server conversion. Processing uses memory without a saved conversion history."
    },
    "related": [
      "/tools/pdf-merger",
      "/tools/pdf-page-remover",
      "/tools/pdf-page-extractor"
    ],
    "modified": "2026-11-06",
    "server": {
      "input": "files",
      "accept": "application/pdf,.pdf"
    }
  },
  {
    "slug": "pdf-page-remover",
    "title": "Delete PDF Pages",
    "description": "Remove unwanted pages from a PDF using page numbers or ranges. Download one PDF containing the remaining pages in their original order.",
    "kind": "graphic",
    "example": "",
    "action": "Convert on server",
    "extension": "pdf",
    "fields": [
      {
        "key": "pages",
        "label": "Pages to delete, for example 2, 4-6",
        "default": "2",
        "type": "text"
      }
    ],
    "steps": [
      "Choose your file or load the example.",
      "Review the settings and the format notes before continuing.",
      "Select Convert on server and download the result."
    ],
    "sections": [
      {
        "heading": "Remove pages without rebuilding the visible artwork",
        "body": "Enter one-based page numbers or ascending ranges separated by commas. The listed pages are deleted, while all remaining pages keep their original order in one downloadable PDF. This is useful for removing an empty scan, an unneeded cover page or an appendix before sharing a document. The operation copies surviving page content rather than taking screenshots, preserving ordinary text and vector shapes on those pages."
      },
      {
        "heading": "Review the document after removal",
        "body": "At least one page must remain, and a page cannot be listed twice. Selections outside the document are errors rather than silently ignored instructions. Page copying does not guarantee preservation of document-level bookmarks, digital signatures or interactive form relationships. Removing a page is also different from redacting information within a page. Use the original document as a backup and check the final page count and reading order before sending the result."
      }
    ],
    "faq": {
      "question": "Where is my file processed?",
      "answer": "The selected file is sent to this site only when you run the server conversion. Processing uses memory without a saved conversion history."
    },
    "related": [
      "/tools/pdf-splitter",
      "/tools/pdf-merger",
      "/tools/pdf-page-extractor"
    ],
    "modified": "2026-11-06",
    "server": {
      "input": "files",
      "accept": "application/pdf,.pdf"
    }
  },
  {
    "slug": "pdf-to-word",
    "title": "PDF to Word Converter",
    "description": "Turn selectable PDF text into an editable Word DOCX file. Exports text and page breaks; complex layouts and scanned images are not recreated.",
    "kind": "graphic",
    "example": "",
    "action": "Convert on server",
    "extension": "docx",
    "fields": [],
    "steps": [
      "Choose your file or load the example.",
      "Review the settings and the format notes before continuing.",
      "Select Convert on server and download the result."
    ],
    "sections": [
      {
        "heading": "Create a document you can edit",
        "body": "This converter reads an existing PDF text layer and writes its extracted lines into a DOCX document. The resulting text can be edited in Word or another compatible word processor. Source page boundaries become page breaks, so it remains possible to compare the draft with the original PDF. It is useful for recovering paragraphs from reports, notes and other documents that already contain selectable text."
      },
      {
        "heading": "Choose the right conversion expectation",
        "body": "This is text reconstruction, not a layout-faithful recreation of the PDF. Tables, columns, typography, diagrams and images are not reproduced as editable Word objects. Reading order depends on the text order stored in the source, so review multi-column documents carefully. Scanned pages without text require OCR first. Exports are limited to fifty pages and one hundred thousand extracted characters; empty extraction reports an error instead of producing a blank Word document."
      }
    ],
    "faq": {
      "question": "Where is my file processed?",
      "answer": "The selected file is sent to this site only when you run the server conversion. Processing uses memory without a saved conversion history."
    },
    "related": [
      "/tools/pdf-to-text",
      "/tools/image-to-text",
      "/tools/docx-converter"
    ],
    "modified": "2026-11-06",
    "server": {
      "input": "files",
      "accept": "application/pdf,.pdf",
      "warning": "Exports existing selectable text and page breaks only. Scanned images need OCR. Tables, pictures, columns and original formatting are not recreated."
    }
  },
  {
    "slug": "pdf-to-powerpoint",
    "title": "PDF to PowerPoint Converter",
    "description": "Convert PDF pages into a PowerPoint PPTX presentation. Each page becomes a clear slide image with its aspect ratio preserved.",
    "kind": "graphic",
    "example": "",
    "action": "Convert on server",
    "extension": "pptx",
    "fields": [],
    "steps": [
      "Choose your file or load the example.",
      "Review the settings and the format notes before continuing.",
      "Select Convert on server and download the result."
    ],
    "sections": [
      {
        "heading": "Present existing PDF pages as slides",
        "body": "Each PDF page is rendered to an image and placed on its own PowerPoint slide. The first page determines the presentation proportions. Later pages with different proportions are centered with unused space around them rather than being stretched. This is useful for presenting a finished handout, illustrated report or other PDF whose appearance is already appropriate for an audience."
      },
      {
        "heading": "Understand what can be edited afterward",
        "body": "The slide contains an image of the page, not individual text boxes or reconstructed charts. You can add new PowerPoint objects around it, but cannot edit the source wording as native slide text through this conversion. Links, forms, video and document signatures are not retained. A maximum of twenty pages is supported, with bounded image dimensions and output size. For a native editable presentation, use the original authoring file when available."
      }
    ],
    "faq": {
      "question": "Where is my file processed?",
      "answer": "The selected file is sent to this site only when you run the server conversion. Processing uses memory without a saved conversion history."
    },
    "related": [
      "/tools/pdf-to-image",
      "/tools/pdf-to-word",
      "/tools/pdf-compressor"
    ],
    "modified": "2026-11-06",
    "server": {
      "input": "files",
      "accept": "application/pdf,.pdf",
      "warning": "Each slide contains a page image. Text and charts are not separate editable PowerPoint objects. Maximum 20 pages."
    }
  },
  {
    "slug": "excel-to-pdf",
    "title": "Excel to PDF Converter",
    "description": "Export a worksheet from XLSX to a readable PDF table. Choose orientation, font size and columns per page; repeat headers on continued pages.",
    "kind": "graphic",
    "example": "",
    "action": "Convert on server",
    "extension": "pdf",
    "fields": [
      {
        "key": "sheet",
        "label": "Worksheet number",
        "default": "1",
        "type": "number",
        "min": 1,
        "max": 100,
        "step": "1"
      },
      {
        "key": "orientation",
        "label": "Page orientation",
        "default": "landscape",
        "type": "select",
        "options": [
          {
            "value": "portrait",
            "label": "Portrait A4"
          },
          {
            "value": "landscape",
            "label": "Landscape A4"
          }
        ]
      },
      {
        "key": "columns",
        "label": "Columns per page band",
        "default": "6",
        "type": "number",
        "min": 1,
        "max": 10,
        "step": "1"
      },
      {
        "key": "fontSize",
        "label": "Text size",
        "default": "9",
        "type": "number",
        "min": 7,
        "max": 14,
        "step": "1"
      }
    ],
    "steps": [
      "Choose your file or load the example.",
      "Review the settings and the format notes before continuing.",
      "Select Convert on server and download the result."
    ],
    "sections": [
      {
        "heading": "Make a worksheet easy to share or print",
        "body": "Choose one worksheet by its one-based position in the XLSX workbook. The converter writes its stored cell values into a PDF table, wrapping text within each cell and repeating the first row as a header on continuation pages. Wide worksheets are split into consecutive column bands according to your setting. This keeps the text readable without squeezing every column onto a single page."
      },
      {
        "heading": "Export stored values rather than the Excel print layout",
        "body": "This table export does not reproduce workbook charts, images, merged-cell layouts, conditional formatting or Excel-specific print areas. Formulas use their saved cached results and are not recalculated; recalculate and save the workbook first if needed. Inputs are restricted to two MiB compressed and validated expanded content. The selected worksheet may contain at most one thousand rows, one hundred thousand text characters and sixty exported PDF pages."
      }
    ],
    "faq": {
      "question": "Where is my file processed?",
      "answer": "The selected file is sent to this site only when you run the server conversion. Processing uses memory without a saved conversion history."
    },
    "related": [
      "/tools/xlsx-to-csv",
      "/tools/xlsx-to-json",
      "/tools/pdf-merger"
    ],
    "modified": "2026-11-06",
    "server": {
      "input": "files",
      "accept": ".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "warning": "Exports the selected worksheet as a new table, not its original print layout. Charts, images and merged-cell formatting are not reproduced. Formulas need saved results."
    }
  },
  {
    "slug": "heic-to-jpg",
    "title": "HEIC to JPG Converter",
    "description": "Convert an iPhone HEIC or HEIF photo to a widely compatible JPG image. Select JPEG quality and download a previewable result.",
    "kind": "graphic",
    "example": "",
    "action": "Convert on server",
    "extension": "jpg",
    "fields": [
      {
        "key": "quality",
        "label": "JPEG quality",
        "default": "90",
        "type": "number",
        "min": 40,
        "max": 100,
        "step": "1"
      }
    ],
    "steps": [
      "Choose your file or load the example.",
      "Review the settings and the format notes before continuing.",
      "Select Convert on server and download the result."
    ],
    "sections": [
      {
        "heading": "Make an iPhone photo easier to open",
        "body": "HEIC is common in phone photo libraries, but a form, email workflow or older application may require JPEG. Upload a HEIC or HEIF image and choose the output quality to create a normal JPG. The converter decodes the image on this site’s server and returns the resulting file with a browser preview. It does not ask for access to your phone library or an external photo account."
      },
      {
        "heading": "Know what the JPEG contains",
        "body": "Only the first top-level image is exported; a multi-image container or Live Photo is not converted into a video or animation. JPEG is a lossy still-image format, and transparent pixels are placed over white. The decoded photo must stay within sixteen million pixels. Unsupported HEIF compression variants can fail even when the filename has the expected extension. Original container metadata and auxiliary depth or motion data are not carried into the new JPEG."
      }
    ],
    "faq": {
      "question": "Where is my file processed?",
      "answer": "The selected file is sent to this site only when you run the server conversion. Processing uses memory without a saved conversion history."
    },
    "related": [
      "/tools/image-target-size",
      "/tools/image-dpi-converter",
      "/tools/passport-photo-maker"
    ],
    "modified": "2026-11-06",
    "server": {
      "input": "files",
      "accept": ".heic,.heif,image/heic,image/heif",
      "warning": "Exports the first still image as JPEG. Auxiliary depth, motion and multi-image content are not retained."
    }
  },
  {
    "slug": "image-to-text",
    "title": "Image to Text Converter (OCR)",
    "description": "Extract printed English text from a JPG, PNG or WebP image using OCR. Copy or download the recognized text without an external OCR provider.",
    "kind": "graphic",
    "example": "",
    "action": "Convert on server",
    "extension": "txt",
    "fields": [],
    "steps": [
      "Choose your file or load the example.",
      "Review the settings and the format notes before continuing.",
      "Select Convert on server and download the result."
    ],
    "sections": [
      {
        "heading": "Recover text from a clear picture",
        "body": "Upload a still image of printed English text, such as a receipt, screenshot or photographed note. The OCR engine reads the picture and returns editable plain text that you can copy or download. Keep the text upright, well lit and large enough to read; crop unnecessary surroundings before uploading. A sharp source usually matters more than simply increasing the file size."
      },
      {
        "heading": "Check every important recognition result",
        "body": "OCR can confuse similar characters, miss faint lines and reorder text in complex layouts. This tool uses a bundled English recognition model and does not promise handwriting recognition or support for every language. Inputs are limited to six million pixels and are reduced to a bounded working size. Review names, amounts and identifiers against the original image before reuse. The model runs on this server without calling an external OCR service or saving an OCR history."
      }
    ],
    "faq": {
      "question": "Where is my file processed?",
      "answer": "The selected file is sent to this site only when you run the server conversion. Processing uses memory without a saved conversion history."
    },
    "related": [
      "/tools/pdf-to-word",
      "/tools/pdf-to-text",
      "/tools/image-cropper"
    ],
    "modified": "2026-11-06",
    "server": {
      "input": "files",
      "accept": "image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp",
      "warning": "Printed English text only. OCR can make mistakes; check names, numbers and totals against the source. Maximum 6 million pixels."
    }
  },
  {
    "slug": "image-target-size",
    "title": "Compress Image to KB",
    "description": "Make a JPG smaller than your chosen KB limit. Automatically adjust JPEG quality and optionally resize dimensions for upload requirements.",
    "kind": "graphic",
    "example": "",
    "action": "Convert on server",
    "extension": "jpg",
    "fields": [
      {
        "key": "kilobytes",
        "label": "Maximum size (KB, 1 KB = 1,024 bytes)",
        "default": "100",
        "type": "number",
        "min": 10,
        "max": 5000,
        "step": "1"
      },
      {
        "key": "allowResize",
        "label": "Allow smaller pixel dimensions if needed",
        "default": "true",
        "type": "checkbox"
      }
    ],
    "steps": [
      "Choose your file or load the example.",
      "Review the settings and the format notes before continuing.",
      "Select Convert on server and download the result."
    ],
    "sections": [
      {
        "heading": "Meet a form’s file-size limit",
        "body": "Some forms accept a photograph only when it is below a particular upload limit. Set the desired size in kibibyte-style units of one thousand twenty-four bytes and upload a PNG, JPEG or WebP image. The tool searches JPEG quality settings for an output below that limit. If permitted, it also reduces the pixel dimensions when quality changes alone cannot achieve the requested size."
      },
      {
        "heading": "Review the actual output before submitting",
        "body": "The result is always JPEG, so transparent backgrounds become white and some image detail is lost. A strict byte limit and a strict pixel-size requirement can conflict; turn off resizing when a form requires the original dimensions. If the target cannot be met under those conditions, the tool reports an error instead of returning an oversized file. The size summary compares input and output, and the preview helps you check that important details remain readable."
      }
    ],
    "faq": {
      "question": "Where is my file processed?",
      "answer": "The selected file is sent to this site only when you run the server conversion. Processing uses memory without a saved conversion history."
    },
    "related": [
      "/tools/image-compressor",
      "/tools/image-resizer",
      "/tools/heic-to-jpg"
    ],
    "modified": "2026-11-06",
    "server": {
      "input": "files",
      "accept": "image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp",
      "warning": "Outputs JPEG. Transparency becomes white; dimensions may shrink if resizing is enabled. Confirm any separate pixel-dimension requirement."
    }
  },
  {
    "slug": "image-dpi-converter",
    "title": "Image DPI Converter",
    "description": "Set image print resolution to 300 DPI or another value. Keep pixels unchanged or fit a specified print size in millimeters.",
    "kind": "graphic",
    "example": "",
    "action": "Convert on server",
    "extension": "jpg",
    "fields": [
      {
        "key": "dpi",
        "label": "Print resolution (DPI)",
        "default": "300",
        "type": "number",
        "min": 72,
        "max": 1200,
        "step": "1"
      },
      {
        "key": "mode",
        "label": "Pixel dimensions",
        "default": "metadata",
        "type": "select",
        "options": [
          {
            "value": "metadata",
            "label": "Keep existing pixels; change DPI metadata"
          },
          {
            "value": "resize",
            "label": "Fit a specified print size"
          }
        ]
      },
      {
        "key": "widthMm",
        "label": "Print width (mm; resize mode)",
        "default": "100",
        "type": "number",
        "min": 1,
        "max": 1000,
        "step": "1"
      },
      {
        "key": "heightMm",
        "label": "Print height (mm; resize mode)",
        "default": "150",
        "type": "number",
        "min": 1,
        "max": 1000,
        "step": "1"
      }
    ],
    "steps": [
      "Choose your file or load the example.",
      "Review the settings and the format notes before continuing.",
      "Select Convert on server and download the result."
    ],
    "sections": [
      {
        "heading": "Separate pixel dimensions from print resolution",
        "body": "DPI metadata tells a printing application how densely to place an image’s pixels on paper. Changing that number alone does not add detail. In the keep-pixels mode, the oriented image retains its pixel width and height while the output JPEG receives your selected density. A six-hundred-pixel width at three hundred DPI describes a two-inch print width, regardless of how large the same image appears on screen."
      },
      {
        "heading": "Resize only when the destination needs it",
        "body": "In print-size mode, millimeter dimensions and DPI determine the new pixel canvas. The image is fitted inside that canvas with white padding so it is not stretched out of proportion. Enlarging a small source interpolates existing detail rather than recovering information that was never captured. JPEG output flattens transparency over white. The final canvas is bounded to sixteen million pixels, and actual printer scaling settings can still affect the physical output size."
      }
    ],
    "faq": {
      "question": "Where is my file processed?",
      "answer": "The selected file is sent to this site only when you run the server conversion. Processing uses memory without a saved conversion history."
    },
    "related": [
      "/tools/passport-photo-maker",
      "/tools/image-resizer",
      "/tools/image-target-size"
    ],
    "modified": "2026-11-06",
    "server": {
      "input": "files",
      "accept": "image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
    }
  },
  {
    "slug": "passport-photo-maker",
    "title": "Passport Photo Maker",
    "description": "Crop a photo to chosen millimeter dimensions and DPI, or create a 4 × 6 inch print sheet. Size preparation without a compliance guarantee.",
    "kind": "graphic",
    "example": "",
    "action": "Convert on server",
    "extension": "jpg",
    "fields": [
      {
        "key": "widthMm",
        "label": "Photo width (mm)",
        "default": "35",
        "type": "number",
        "min": 20,
        "max": 70,
        "step": "1"
      },
      {
        "key": "heightMm",
        "label": "Photo height (mm)",
        "default": "45",
        "type": "number",
        "min": 20,
        "max": 70,
        "step": "1"
      },
      {
        "key": "dpi",
        "label": "Print DPI",
        "default": "300",
        "type": "number",
        "min": 150,
        "max": 600,
        "step": "1"
      },
      {
        "key": "output",
        "label": "Download format",
        "default": "single",
        "type": "select",
        "options": [
          {
            "value": "single",
            "label": "Single sized photo"
          },
          {
            "value": "sheet",
            "label": "4 × 6 inch print sheet"
          }
        ]
      }
    ],
    "steps": [
      "Choose your file or load the example.",
      "Review the settings and the format notes before continuing.",
      "Select Convert on server and download the result."
    ],
    "sections": [
      {
        "heading": "Prepare a photo at a known physical size",
        "body": "Choose the required width and height in millimeters and a printing resolution. The tool crops the source around its center, resizes it to the corresponding pixel dimensions and writes JPEG density metadata. Select a single photo or a four-by-six-inch sheet with repeated copies and white gaps. This helps prepare an already suitable photograph for printing without manually calculating pixels from millimeters."
      },
      {
        "heading": "Check official photo requirements separately",
        "body": "Correct dimensions are only one part of an identification photo requirement. This tool does not verify head position, facial expression, lighting, background, age of the photo or a particular authority’s acceptance rules. It does not detect a face or replace the background. Position the subject appropriately before uploading, review the centered crop and consult the receiving authority’s current requirements. When printing, disable fit-to-page scaling so the intended physical dimensions are retained."
      }
    ],
    "faq": {
      "question": "Where is my file processed?",
      "answer": "The selected file is sent to this site only when you run the server conversion. Processing uses memory without a saved conversion history."
    },
    "related": [
      "/tools/image-cropper",
      "/tools/image-dpi-converter",
      "/tools/image-target-size"
    ],
    "modified": "2026-11-06",
    "server": {
      "input": "files",
      "accept": "image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp",
      "warning": "Sizing and center cropping only. No face detection, background replacement or official passport/visa compliance check. Check the receiving authority’s photo rules."
    }
  },
  {
    "slug": "split-image",
    "title": "Split Image into a Grid",
    "description": "Cut a photo into rows and columns and download all tiles in a ZIP. Choose PNG for lossless tiles or JPG for smaller files.",
    "kind": "graphic",
    "example": "",
    "action": "Convert on server",
    "extension": "zip",
    "fields": [
      {
        "key": "columns",
        "label": "Columns",
        "default": "3",
        "type": "number",
        "min": 1,
        "max": 6,
        "step": "1"
      },
      {
        "key": "rows",
        "label": "Rows",
        "default": "1",
        "type": "number",
        "min": 1,
        "max": 6,
        "step": "1"
      },
      {
        "key": "format",
        "label": "Tile image format",
        "default": "jpeg",
        "type": "select",
        "options": [
          {
            "value": "jpeg",
            "label": "JPG"
          },
          {
            "value": "png",
            "label": "PNG"
          }
        ]
      }
    ],
    "steps": [
      "Choose your file or load the example.",
      "Review the settings and the format notes before continuing.",
      "Select Convert on server and download the result."
    ],
    "sections": [
      {
        "heading": "Divide a photograph into separate tiles",
        "body": "Choose the number of rows and columns to partition an image into a regular grid. Every source pixel belongs to a tile, including edge pixels when the dimensions are not evenly divisible by the grid. Files are named by row and column and packaged in a ZIP. This is useful for image panels, a multi-part design or preparing separate picture sections for another layout."
      },
      {
        "heading": "Match the tile format to the next step",
        "body": "PNG preserves tile pixels and transparency but can create larger downloads. JPEG usually produces smaller photographic tiles and places transparency over white. The input is normalized for orientation before cutting, and each grid direction supports up to six tiles. Platform-specific posting order, profile cropping and display ratios are outside the conversion; check the destination layout before publishing. The combined tile data and final archive are subject to the standard output size limit."
      }
    ],
    "faq": {
      "question": "Where is my file processed?",
      "answer": "The selected file is sent to this site only when you run the server conversion. Processing uses memory without a saved conversion history."
    },
    "related": [
      "/tools/image-cropper",
      "/tools/image-resizer",
      "/tools/zip-extractor"
    ],
    "modified": "2026-11-06",
    "server": {
      "input": "files",
      "accept": "image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
    }
  },
  {
    "slug": "age-calculator",
    "title": "Age Calculator",
    "description": "Calculate age in years, months and days, total days lived and the next birthday from two calendar dates.",
    "kind": "design",
    "example": "",
    "action": "Calculate",
    "extension": "txt",
    "fields": [
      {
        "key": "birth",
        "label": "Date of birth",
        "default": "1995-06-15",
        "type": "date"
      },
      {
        "key": "asOf",
        "label": "As of date (leave blank for today)",
        "default": "",
        "type": "date"
      }
    ],
    "steps": [
      "Enter your values or reset the included example.",
      "Review the settings and the format notes before continuing.",
      "Select Calculate, then inspect or copy the result."
    ],
    "sections": [
      {
        "heading": "Calculate a calendar age rather than dividing days",
        "body": "Enter a birth date and optionally a reference date. Leaving the reference date empty uses today in your browser’s local calendar. The result separates completed years, completed additional months and remaining days, then gives the total elapsed day count and the next birthday. This is more informative than dividing days by three hundred sixty-five, which ignores leap years and the varying lengths of months."
      },
      {
        "heading": "Understand the date convention",
        "body": "All calculations compare calendar dates without time-of-day or daylight-saving offsets. Month-end anniversaries are clamped to the final valid day of the destination month. A February twenty-ninth birthday is treated as February twenty-eighth in a non-leap year for this tool. Legal birthday and eligibility rules can differ, so the result is not an official age determination. Birth and reference dates must be valid and fall between nineteen hundred and twenty-one ninety-nine."
      }
    ],
    "faq": {
      "question": "Where is my calculation performed?",
      "answer": "The calculation runs locally in your browser without a conversion API request."
    },
    "related": [
      "/tools/date-difference-calculator",
      "/tools/business-days-calculator",
      "/tools/iso-week-calculator"
    ],
    "modified": "2026-11-06"
  },
  {
    "slug": "discount-calculator",
    "title": "Discount Calculator",
    "description": "Calculate a sale price and how much you save from an original price and percentage discount. Supports common currencies.",
    "kind": "design",
    "example": "",
    "action": "Calculate",
    "extension": "txt",
    "fields": [
      {
        "key": "price",
        "label": "Original price",
        "default": "120",
        "type": "number",
        "min": 0.01,
        "max": 1000000000.0,
        "step": ".01"
      },
      {
        "key": "discount",
        "label": "Discount (%)",
        "default": "25",
        "type": "number",
        "min": 0,
        "max": 100,
        "step": ".01"
      },
      {
        "key": "currency",
        "label": "Currency",
        "default": "USD",
        "type": "select",
        "options": [
          {
            "value": "USD",
            "label": "USD"
          },
          {
            "value": "EUR",
            "label": "EUR"
          },
          {
            "value": "GBP",
            "label": "GBP"
          },
          {
            "value": "UAH",
            "label": "UAH"
          }
        ]
      }
    ],
    "steps": [
      "Enter your values or reset the included example.",
      "Review the settings and the format notes before continuing.",
      "Select Calculate, then inspect or copy the result."
    ],
    "sections": [
      {
        "heading": "See the price after one discount",
        "body": "Enter the original price and a discount percentage to calculate the amount saved and the final sale price. Currency selection controls display formatting rather than performing an exchange-rate conversion. A twenty-five percent discount on one hundred twenty units saves thirty and leaves ninety to pay. This simple comparison helps interpret a sale label without confusing the amount saved with the price you actually owe."
      },
      {
        "heading": "Keep checkout extras separate",
        "body": "The calculator applies one percentage reduction to a positive original amount with at most two decimal places. Savings are rounded to the nearest minor currency unit, then subtracted from the original amount. Sales tax, delivery costs, loyalty credits and stacked promotions are excluded. Successive discounts are not generally equivalent to adding their percentages together. Use the real checkout rules when comparing a multi-offer promotion or a price that changes with shipping or tax."
      }
    ],
    "faq": {
      "question": "Where is my calculation performed?",
      "answer": "The calculation runs locally in your browser without a conversion API request."
    },
    "related": [
      "/tools/tip-calculator",
      "/tools/percentage-calculator",
      "/tools/loan-calculator"
    ],
    "modified": "2026-11-06"
  },
  {
    "slug": "tip-calculator",
    "title": "Tip Calculator and Bill Splitter",
    "description": "Calculate a tip, total bill and each person’s share. Split remaining cents fairly so all shares add up to the exact total.",
    "kind": "design",
    "example": "",
    "action": "Calculate",
    "extension": "txt",
    "fields": [
      {
        "key": "bill",
        "label": "Bill before tip",
        "default": "85.5",
        "type": "number",
        "min": 0.01,
        "max": 1000000000.0,
        "step": ".01"
      },
      {
        "key": "tip",
        "label": "Tip (%)",
        "default": "15",
        "type": "number",
        "min": 0,
        "max": 100,
        "step": ".01"
      },
      {
        "key": "people",
        "label": "People splitting the bill",
        "default": "3",
        "type": "number",
        "min": 1,
        "max": 100,
        "step": "1"
      },
      {
        "key": "currency",
        "label": "Currency",
        "default": "USD",
        "type": "select",
        "options": [
          {
            "value": "USD",
            "label": "USD"
          },
          {
            "value": "EUR",
            "label": "EUR"
          },
          {
            "value": "GBP",
            "label": "GBP"
          },
          {
            "value": "UAH",
            "label": "UAH"
          }
        ]
      }
    ],
    "steps": [
      "Enter your values or reset the included example.",
      "Review the settings and the format notes before continuing.",
      "Select Calculate, then inspect or copy the result."
    ],
    "sections": [
      {
        "heading": "Calculate the full amount before dividing",
        "body": "Enter the bill amount, choose a percentage tip and set the number of people sharing it. The tip is calculated on the amount you enter, rounded to the nearest minor currency unit and added to the bill. The result shows the tip, total and average per person. If a service charge is already included, decide whether another tip is appropriate before entering a percentage; the calculator cannot infer that from a receipt."
      },
      {
        "heading": "Keep every cent accounted for",
        "body": "Equal-looking rounded shares can add up to one cent more or less than the actual bill. This tool divides the total in whole minor currency units and allocates any remaining cents to the first people in the list. Individual shares therefore differ by at most one cent and sum exactly to the total. It does not split by individual ordered items, apply local tipping customs or add taxes beyond the bill amount you supplied."
      }
    ],
    "faq": {
      "question": "Where is my calculation performed?",
      "answer": "The calculation runs locally in your browser without a conversion API request."
    },
    "related": [
      "/tools/discount-calculator",
      "/tools/percentage-calculator",
      "/tools/recipe-scaler"
    ],
    "modified": "2026-11-06"
  },
  {
    "slug": "loan-calculator",
    "title": "Loan Payment Calculator",
    "description": "Estimate a fixed-rate monthly loan payment, total interest and amortization schedule. Enter an amount, annual rate and term in months.",
    "kind": "design",
    "example": "",
    "action": "Calculate",
    "extension": "txt",
    "fields": [
      {
        "key": "principal",
        "label": "Loan amount",
        "default": "10000",
        "type": "number",
        "min": 0.01,
        "max": 1000000000.0,
        "step": ".01"
      },
      {
        "key": "annualRate",
        "label": "Nominal annual interest (%)",
        "default": "6",
        "type": "number",
        "min": 0,
        "max": 100,
        "step": ".01"
      },
      {
        "key": "months",
        "label": "Term in months",
        "default": "36",
        "type": "number",
        "min": 1,
        "max": 600,
        "step": "1"
      },
      {
        "key": "currency",
        "label": "Currency",
        "default": "USD",
        "type": "select",
        "options": [
          {
            "value": "USD",
            "label": "USD"
          },
          {
            "value": "EUR",
            "label": "EUR"
          },
          {
            "value": "GBP",
            "label": "GBP"
          },
          {
            "value": "UAH",
            "label": "UAH"
          }
        ]
      }
    ],
    "steps": [
      "Enter your values or reset the included example.",
      "Review the settings and the format notes before continuing.",
      "Select Calculate, then inspect or copy the result."
    ],
    "sections": [
      {
        "heading": "Compare a fixed monthly repayment example",
        "body": "Enter the borrowed principal, a fixed nominal annual interest percentage and the number of monthly payments. The calculator divides the annual rate by twelve and uses equal period-end payments to amortize the principal. The report includes the monthly payment, total interest, total amount repaid and a payment-by-payment schedule. A zero interest rate is handled as an even division of principal across the selected term."
      },
      {
        "heading": "Treat the result as an illustration",
        "body": "The schedule assumes the same monthly rate for the entire term and no extra repayments. It excludes origination fees, insurance, taxes, late charges, variable-rate resets and lender-specific day-count or rounding conventions. A quoted APR can include costs beyond the nominal interest rate expected by this formula. Amounts are displayed to two decimals, while internal calculations retain more precision. Use the lender’s official disclosures and schedule when making a borrowing decision."
      }
    ],
    "faq": {
      "question": "Where is my calculation performed?",
      "answer": "The calculation runs locally in your browser without a conversion API request."
    },
    "related": [
      "/tools/compound-interest-calculator",
      "/tools/discount-calculator",
      "/tools/percentage-calculator"
    ],
    "modified": "2026-11-06",
    "reference": "https://www.consumerfinance.gov/ask-cfpb/what-is-amortization-and-how-could-it-affect-my-auto-loan-en-771/"
  },
  {
    "slug": "compound-interest-calculator",
    "title": "Compound Interest Calculator",
    "description": "Project a balance with an initial amount, monthly contributions and monthly compounding. See contributions and growth year by year.",
    "kind": "design",
    "example": "",
    "action": "Calculate",
    "extension": "txt",
    "fields": [
      {
        "key": "initial",
        "label": "Initial balance",
        "default": "1000",
        "type": "number",
        "min": 0,
        "max": 1000000000.0,
        "step": ".01"
      },
      {
        "key": "monthly",
        "label": "Monthly contribution",
        "default": "100",
        "type": "number",
        "min": 0,
        "max": 1000000000.0,
        "step": ".01"
      },
      {
        "key": "annualRate",
        "label": "Nominal annual rate (%)",
        "default": "5",
        "type": "number",
        "min": 0,
        "max": 50,
        "step": ".01"
      },
      {
        "key": "years",
        "label": "Years",
        "default": "10",
        "type": "number",
        "min": 1,
        "max": 50,
        "step": "1"
      },
      {
        "key": "currency",
        "label": "Currency",
        "default": "USD",
        "type": "select",
        "options": [
          {
            "value": "USD",
            "label": "USD"
          },
          {
            "value": "EUR",
            "label": "EUR"
          },
          {
            "value": "GBP",
            "label": "GBP"
          },
          {
            "value": "UAH",
            "label": "UAH"
          }
        ]
      }
    ],
    "steps": [
      "Enter your values or reset the included example.",
      "Review the settings and the format notes before continuing.",
      "Select Calculate, then inspect or copy the result."
    ],
    "sections": [
      {
        "heading": "Separate money contributed from hypothetical growth",
        "body": "Enter a starting balance, a regular monthly contribution, a fixed nominal annual rate and a period in years. Interest is applied monthly, then the contribution is added at the end of that month. The report separates the money you put in from the modeled growth and lists the balance at each year end. Currency selection affects formatting only and does not convert between currencies."
      },
      {
        "heading": "Understand the projection assumptions",
        "body": "A constant rate is a simplifying input, not a forecast or a promise. Real accounts and investments can have fees, taxes, changing returns, withdrawal rules and different compounding conventions. Inflation also changes what a future amount can buy. This calculator does not choose a product or recommend an allocation. Its bounded monthly simulation supports up to fifty years and rejects amounts outside the supported range; compare actual terms before relying on a financial projection."
      }
    ],
    "faq": {
      "question": "Where is my calculation performed?",
      "answer": "The calculation runs locally in your browser without a conversion API request."
    },
    "related": [
      "/tools/loan-calculator",
      "/tools/percentage-calculator",
      "/tools/discount-calculator"
    ],
    "modified": "2026-11-06",
    "reference": "https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator"
  },
  {
    "slug": "final-grade-calculator",
    "title": "Final Grade Calculator",
    "description": "Find the final-exam percentage needed to reach your target course grade. Includes weighted coursework and an attainable-target check.",
    "kind": "design",
    "example": "",
    "action": "Calculate",
    "extension": "txt",
    "fields": [
      {
        "key": "current",
        "label": "Current grade excluding final (%)",
        "default": "82",
        "type": "number",
        "min": 0,
        "max": 100,
        "step": ".01"
      },
      {
        "key": "target",
        "label": "Target overall grade (%)",
        "default": "85",
        "type": "number",
        "min": 0,
        "max": 100,
        "step": ".01"
      },
      {
        "key": "weight",
        "label": "Final exam weight (%)",
        "default": "30",
        "type": "number",
        "min": 0.01,
        "max": 100,
        "step": ".01"
      }
    ],
    "steps": [
      "Enter your values or reset the included example.",
      "Review the settings and the format notes before continuing.",
      "Select Calculate, then inspect or copy the result."
    ],
    "sections": [
      {
        "heading": "Start with the grade outside the final exam",
        "body": "Enter your current coursework percentage, the overall course percentage you want and the final exam’s share of the complete grade. The current percentage must describe only the work outside that final. The calculator solves the weighted-average equation for the final-exam result. It also identifies a target that is already met with a zero on the final, or one requiring more than one hundred percent under the ordinary scale."
      },
      {
        "heading": "Check your syllabus before interpreting the number",
        "body": "Some courses weight several assignment groups, drop low scores, apply a grading curve or round at specific stages. Those rules can make a simple two-part calculation inappropriate. The required result is rounded upward to one hundredth of a percentage point, and the model does not assume extra credit is available. A final weight of one hundred percent makes the existing coursework irrelevant. Use the documented grading policy to decide which current grade belongs in the input."
      }
    ],
    "faq": {
      "question": "Where is my calculation performed?",
      "answer": "The calculation runs locally in your browser without a conversion API request."
    },
    "related": [
      "/tools/gpa-calculator",
      "/tools/weighted-average-calculator",
      "/tools/percentage-calculator"
    ],
    "modified": "2026-11-06"
  },
  {
    "slug": "gpa-calculator",
    "title": "GPA Calculator",
    "description": "Calculate a credit-weighted GPA from course grades. Enter letter grades or numeric grade points in an editable course table.",
    "kind": "text",
    "example": "Course,Credits,Grade\nMathematics,3,A\nEnglish,4,B+\nHistory,3,A-",
    "action": "Calculate",
    "extension": "txt",
    "fields": [
      {
        "key": "scale",
        "label": "A+ grade point value",
        "default": "4",
        "type": "select",
        "options": [
          {
            "value": "4",
            "label": "4.0 scale · A+ = 4.0"
          },
          {
            "value": "4.3",
            "label": "4.3 scale · A+ = 4.3"
          }
        ]
      }
    ],
    "steps": [
      "Enter your values or reset the included example.",
      "Review the settings and the format notes before continuing.",
      "Select Calculate, then inspect or copy the result."
    ],
    "sections": [
      {
        "heading": "Weight each course by its credits",
        "body": "Add a course name, a positive credit value and either a supported letter grade or numeric grade points. The calculator multiplies each grade point value by its credits, sums those quality points and divides by the total credits. This produces a credit-weighted GPA rather than a simple average of letter labels. The editable table lets you add or remove courses without preparing a spreadsheet or writing code."
      },
      {
        "heading": "Use the mapping that fits your institution",
        "body": "The built-in mapping uses A as four, B as three, C as two and common plus/minus increments. A-plus is four or four-point-three according to your setting. Numeric inputs must fit that scale. Institutional policies can treat repeats, withdrawals, pass/fail courses and rounding differently, so include only the courses that should contribute to this calculation. The result is a planning aid rather than an official transcript, and it does not infer transfer-credit rules."
      }
    ],
    "faq": {
      "question": "Where is my calculation performed?",
      "answer": "The calculation runs locally in your browser without a conversion API request."
    },
    "related": [
      "/tools/final-grade-calculator",
      "/tools/weighted-average-calculator",
      "/tools/percentage-calculator"
    ],
    "modified": "2026-11-06",
    "tableInput": {
      "headers": [
        "Course",
        "Credits",
        "Grade"
      ]
    },
    "inputLabel": "Course grades"
  },
  {
    "slug": "recipe-scaler",
    "title": "Recipe Scaler",
    "description": "Scale ingredient quantities to a new number of servings. Edit ingredients in a table; supports decimals, fractions and mixed numbers.",
    "kind": "text",
    "example": "Amount,Unit,Ingredient\n2,cups,Flour\n1/2,cup,Milk\n1 1/2,tbsp,Olive oil\nto taste,,Salt",
    "action": "Calculate",
    "extension": "txt",
    "fields": [
      {
        "key": "originalServings",
        "label": "Original servings",
        "default": "4",
        "type": "number",
        "min": 0.1,
        "max": 1000,
        "step": ".1"
      },
      {
        "key": "targetServings",
        "label": "New servings",
        "default": "8",
        "type": "number",
        "min": 0.1,
        "max": 1000,
        "step": ".1"
      }
    ],
    "steps": [
      "Enter your values or reset the included example.",
      "Review the settings and the format notes before continuing.",
      "Select Calculate, then inspect or copy the result."
    ],
    "sections": [
      {
        "heading": "Adjust ingredient amounts for a different yield",
        "body": "Enter the recipe’s original servings and your desired servings, then edit the ingredient table. Each numeric quantity is multiplied by the ratio between those two yields. Amounts can be decimals, simple fractions or mixed numbers such as one and one half. Units and ingredient names stay unchanged, so the tool does not invent a conversion between cups, grams or different ingredient densities."
      },
      {
        "heading": "Use practical judgment beyond the arithmetic",
        "body": "A blank amount or the phrase to taste is retained without numeric scaling. Other quantities are rounded to four decimal places for a readable result. Cooking duration, pan geometry, oven temperature and food-safety requirements do not scale by the serving ratio, and seasonings or leavening can need separate adjustment in a large batch. The tool handles ingredient arithmetic only. Review indivisible items such as eggs and choose an appropriate preparation method for the new yield."
      }
    ],
    "faq": {
      "question": "Where is my calculation performed?",
      "answer": "The calculation runs locally in your browser without a conversion API request."
    },
    "related": [
      "/tools/fraction-calculator",
      "/tools/unit-converter",
      "/tools/tip-calculator"
    ],
    "modified": "2026-11-06",
    "tableInput": {
      "headers": [
        "Amount",
        "Unit",
        "Ingredient"
      ]
    },
    "inputLabel": "Recipe ingredients"
  },
  {
    "slug": "stopwatch-timer",
    "title": "Online Stopwatch and Countdown Timer",
    "description": "Run a live countdown or stopwatch with start, pause, resume, reset and stopwatch laps. Works locally in your browser.",
    "kind": "design",
    "example": "",
    "action": "Open timer",
    "extension": "txt",
    "fields": [
      {
        "key": "mode",
        "label": "Mode",
        "default": "countdown",
        "type": "select",
        "options": [
          {
            "value": "countdown",
            "label": "Countdown timer"
          },
          {
            "value": "stopwatch",
            "label": "Stopwatch"
          }
        ]
      },
      {
        "key": "minutes",
        "label": "Countdown minutes",
        "default": "2",
        "type": "number",
        "min": 0,
        "max": 1440,
        "step": "1"
      },
      {
        "key": "seconds",
        "label": "Countdown seconds",
        "default": "0",
        "type": "number",
        "min": 0,
        "max": 59,
        "step": "1"
      }
    ],
    "steps": [
      "Choose countdown or stopwatch and select Open timer.",
      "Set a countdown duration when using countdown mode.",
      "Use the live Start, Pause, Resume and Reset controls; record laps in stopwatch mode."
    ],
    "sections": [
      {
        "heading": "Measure a duration with live controls",
        "body": "Choose a countdown to run toward zero, or a stopwatch to count upward. Start, pause and resume the live display without losing the elapsed duration, or reset it to begin again. Stopwatch mode can keep up to one hundred lap readings. The copy-time control copies the displayed time rather than only the setup values. These controls work locally and do not send timing data to the conversion server."
      },
      {
        "heading": "Keep the browser timing limits in mind",
        "body": "The display uses a monotonic browser clock to reduce ordinary interval drift while the page is running. Browser throttling, operating-system sleep, tab closure and page reloads can still affect what is displayed or stop the session. It does not provide a guaranteed background alarm, notification or saved timer history. Countdowns support one second through twenty-four hours. Changing the setup and reopening the timer starts a new session, so keep the current page open when timing matters."
      }
    ],
    "faq": {
      "question": "Does the timer work after I close the page?",
      "answer": "No. Keep the page open. The timer is a local browser session and does not create a server alarm or persistent notification."
    },
    "related": [
      "/tools/time-duration-converter",
      "/tools/date-difference-calculator",
      "/tools/time-zone-converter"
    ],
    "modified": "2026-11-07"
  }
] as const;
