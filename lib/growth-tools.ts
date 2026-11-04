export type GrowthField = {
  key: string; label: string; default: string;
  type: "number" | "text" | "color" | "checkbox" | "select";
  min?: number; max?: number; step?: string;
  options?: { value: string; label: string }[];
};
export type GrowthTool = {
  slug: string; title: string; description: string; kind: "text" | "design" | "image" | "file" | "graphic";
  example: string; exampleB?: string; inputLabel?: string; secondInputLabel?: string; modified?: string; reference?: string; action: string; extension: string;
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
  }
];
