// Existing tool labels and descriptions, preserved from the original home catalog.
export const legacyTools = [
  {
    "slug": "json-to-yaml",
    "title": "JSON → YAML",
    "description": "Convert JSON to clean YAML and back. Handles nested objects, arrays, and special strings.",
    "badge": "Bidirectional"
  },
  {
    "slug": "json-to-csv",
    "title": "JSON → CSV",
    "description": "Turn JSON arrays into CSV spreadsheets and parse CSV back to JSON with type inference.",
    "badge": "Bidirectional"
  },
  {
    "slug": "json-to-xml",
    "title": "JSON → XML",
    "description": "Generate well-formed XML from JSON and parse XML tags back to JSON objects.",
    "badge": "Bidirectional"
  },
  {
    "slug": "json-to-postgresql",
    "title": "JSON → PostgreSQL",
    "description": "Generate batch INSERT statements from JSON and parse INSERT SQL back to JSON.",
    "badge": "Bidirectional"
  },
  {
    "slug": "word-counter",
    "title": "Word Counter",
    "description": "Count words, characters, sentences, and paragraphs in any text. Great for essays and content writing.",
    "badge": "Options"
  },
  {
    "slug": "uuid-to-base64",
    "title": "UUID to Base64",
    "description": "Encode UUIDs to compact Base64 strings and decode Base64 back to standard UUID format.",
    "badge": "Bidirectional"
  },
  {
    "slug": "url-encode",
    "title": "URL Encode / Decode",
    "description": "Percent-encode special characters in URLs and decode encoded strings back to plain text.",
    "badge": "Options"
  },
  {
    "slug": "string-to-base64",
    "title": "String to Base64",
    "description": "Encode any string to Base64 and decode Base64 back to its original text instantly.",
    "badge": "Bidirectional"
  },
  {
    "slug": "remove-duplicate-lines",
    "title": "Remove Duplicate Lines",
    "description": "Paste any text and instantly strip duplicate lines, keeping only unique entries.",
    "badge": "Options"
  },
  {
    "slug": "markdown-to-html",
    "title": "Markdown to HTML",
    "description": "Render Markdown to clean HTML and convert HTML tags back to Markdown syntax.",
    "badge": "Bidirectional"
  },
  {
    "slug": "case-converter",
    "title": "Case Converter",
    "description": "Transform text between camelCase, snake_case, PascalCase, kebab-case, and more.",
    "badge": "Bidirectional"
  },
  {
    "slug": "date-to-unix-timestamp",
    "title": "Date to Unix Timestamp",
    "description": "Convert human-readable dates to Unix timestamps and timestamps back to readable dates.",
    "badge": "Bidirectional"
  },
  {
    "slug": "json-to-prisma-schema",
    "title": "JSON to Prisma Schema",
    "description": "Generate a full Prisma schema file from a JSON object with inferred field types and models.",
    "badge": "Bidirectional"
  },
  {
    "slug": "json-to-typescript-interface",
    "title": "JSON to TypeScript Interface",
    "description": "Instantly generate TypeScript interfaces from any JSON payload with nested type support.",
    "badge": "Bidirectional"
  },
  {
    "slug": "json-formatter",
    "title": "JSON Formatter for Large Files",
    "description": "Format or minify JSON files up to 100 MB right in your browser with drag-and-drop upload.",
    "badge": "Up to 100 MB"
  },
  {
    "slug": "minify-json",
    "title": "Minify JSON Online",
    "description": "Compress JSON to a single line or beautify it back with one click and instant size savings.",
    "badge": "Bidirectional"
  },
  {
    "slug": "hash-generator",
    "title": "Hash Generator",
    "description": "Generate MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes from any text in a single click.",
    "badge": "Multi-Algorithm"
  },
  {
    "slug": "jwt-decoder",
    "title": "JWT Decoder",
    "description": "Decode JSON Web Tokens and inspect header, payload, and signature with formatted timestamps.",
    "badge": "Inspect"
  },
  {
    "slug": "color-converter",
    "title": "Color Converter",
    "description": "Convert between HEX, RGB, and HSL with a live preview swatch for CSS and design work.",
    "badge": "Bidirectional"
  },
  {
    "slug": "regex-tester",
    "title": "Regex Tester",
    "description": "Live-highlighting JavaScript regex playground with capture groups, named groups, and match counts.",
    "badge": "Live"
  },
  {
    "slug": "lorem-ipsum",
    "title": "Lorem Ipsum Generator",
    "description": "Generate placeholder text by paragraphs, sentences, or words with the classic opener option.",
    "badge": "Options"
  },
  {
    "slug": "password-generator",
    "title": "Password Generator",
    "description": "Create strong, cryptographically secure passwords with configurable length and character classes.",
    "badge": "Secure"
  },
  {
    "slug": "text-diff",
    "title": "Text Diff",
    "description": "Compare two blocks of text line by line with added, removed, and unchanged highlighting.",
    "badge": "LCS Diff"
  },
  {
    "slug": "number-base-converter",
    "title": "Number Base Converter",
    "description": "Convert integers between binary, octal, decimal, and hexadecimal with BigInt precision.",
    "badge": "BigInt"
  },
  {
    "slug": "cron-parser",
    "title": "Cron Expression Parser",
    "description": "Translate any cron expression to plain English and preview the next five executions in your timezone.",
    "badge": "Explainer"
  },
  {
    "slug": "curl-to-fetch",
    "title": "cURL to Fetch",
    "description": "Convert any cURL command to idiomatic JavaScript — fetch, axios, or XMLHttpRequest.",
    "badge": "3 targets"
  },
  {
    "slug": "json-diff",
    "title": "JSON Diff",
    "description": "Semantic structural JSON diff ignoring whitespace and key order with dotted path output.",
    "badge": "Semantic"
  },
  {
    "slug": "toml-to-json",
    "title": "TOML to JSON",
    "description": "Convert between TOML and JSON for Cargo.toml, pyproject.toml, Hugo, and Zola configs.",
    "badge": "Bidirectional"
  },
  {
    "slug": "cidr-calculator",
    "title": "CIDR Calculator",
    "description": "IPv4 subnet calculator — mask, wildcard, network/broadcast addresses, host range, and classification.",
    "badge": "IPv4"
  },
  {
    "slug": "sql-formatter",
    "title": "SQL Formatter",
    "description": "Pretty-print SQL queries with configurable indentation and uppercase keywords for Postgres, MySQL, SQLite, MSSQL.",
    "badge": "Pretty-print"
  },
  {
    "slug": "unix-permissions",
    "title": "Unix Permissions",
    "description": "chmod calculator — numeric notation (755) ↔ symbolic (rwxr-xr-x) with setuid, setgid, and sticky bit.",
    "badge": "chmod"
  },
  {
    "slug": "csv-to-markdown",
    "title": "CSV to Markdown",
    "description": "Convert CSV, TSV, or semicolon-separated data to GitHub-flavored Markdown tables with aligned columns.",
    "badge": "GFM"
  },
  {
    "slug": "html-entity-encoder",
    "title": "HTML Entity Encoder",
    "description": "Encode HTML entities (named, numeric, hex) and decode entity-encoded strings for safe HTML rendering.",
    "badge": "Bidirectional"
  },
  {
    "slug": "svg-optimizer",
    "title": "SVG Optimizer",
    "description": "Minify SVG files — strip editor metadata, shorten hex colors, round decimals, collapse whitespace.",
    "badge": "30–70% smaller"
  },
  {
    "slug": "slug-generator",
    "title": "Slug Generator",
    "description": "Turn any text into a clean, URL-friendly slug with Cyrillic transliteration and stop-word removal.",
    "badge": "Multi-locale"
  },
  {
    "slug": "env-parser",
    "title": "ENV Parser",
    "description": "Parse .env files and convert between .env, JSON, and YAML for safe secret management.",
    "badge": "Multi-format"
  },
  {
    "slug": "url-decode",
    "title": "URL Decode",
    "description": "Decode percent-encoded URLs and query parameters back to plain text with full Unicode support.",
    "badge": "Unicode"
  },
  {
    "slug": "uuid-generator",
    "title": "UUID Generator",
    "description": "Generate v4 (random), v7 (time-ordered), and nil UUIDs — up to 1000 at a time with CSPRNG.",
    "badge": "v4 + v7"
  },
  {
    "slug": "ulid-generator",
    "title": "ULID Generator",
    "description": "Generate time-sortable 26-character ULIDs — 48-bit timestamp + 80 random bits in Crockford Base32.",
    "badge": "Sortable"
  },
  {
    "slug": "csv-to-json",
    "title": "CSV to JSON",
    "description": "Parse CSV, TSV, or semicolon-separated data into clean JSON with intelligent type inference.",
    "badge": "Type-aware"
  },
  {
    "slug": "yaml-to-json",
    "title": "YAML to JSON",
    "description": "Parse YAML config files (Kubernetes, Actions, docker-compose, Ansible) into clean JSON.",
    "badge": "YAML 1.2"
  },
  {
    "slug": "xml-to-json",
    "title": "XML to JSON",
    "description": "Convert XML to JSON using the browser's native DOMParser. SOAP, RSS, SVG, OpenXML.",
    "badge": "DOMParser"
  },
  {
    "slug": "html-minifier",
    "title": "HTML Minifier",
    "description": "Strip whitespace, comments, and redundant attributes from HTML with preserved code blocks.",
    "badge": "Safe"
  },
  {
    "slug": "html-formatter",
    "title": "HTML Formatter",
    "description": "Pretty-print HTML with configurable indentation. Inline tags stay inline; block tags wrap.",
    "badge": "Readable"
  },
  {
    "slug": "css-minifier",
    "title": "CSS Minifier",
    "description": "Strip comments, whitespace, and shorten hex colors in CSS. Typical savings 20–40%.",
    "badge": "Shorten"
  },
  {
    "slug": "css-formatter",
    "title": "CSS Formatter",
    "description": "Pretty-print minified or hand-written CSS with configurable indentation. Handles media queries.",
    "badge": "Readable"
  },
  {
    "slug": "js-minifier",
    "title": "JavaScript Minifier",
    "description": "Strip comments and whitespace from JavaScript. Preserves strings, templates, and regex literals.",
    "badge": "No build"
  },
  {
    "slug": "js-formatter",
    "title": "JavaScript Formatter",
    "description": "Quick JS re-indenter with configurable indentation. Preserves literals and comments.",
    "badge": "Readable"
  },
  {
    "slug": "xml-formatter",
    "title": "XML Formatter",
    "description": "Pretty-print minified XML — SOAP responses, RSS feeds, SVG, OpenXML, Android manifests.",
    "badge": "Readable"
  },
  {
    "slug": "jwt-generator",
    "title": "JWT Generator",
    "description": "Sign JSON Web Tokens with HS256, HS384, or HS512 using the Web Crypto API.",
    "badge": "HS256/384/512"
  },
  {
    "slug": "json-schema-generator",
    "title": "JSON Schema Generator",
    "description": "Infer a Draft 2020-12 JSON Schema from any sample JSON. Great for OpenAPI and Ajv/zod.",
    "badge": "Draft 2020-12"
  },
  {
    "slug": "text-reverser",
    "title": "Text Reverser",
    "description": "Reverse strings by characters, words, lines, or chars within each line. Unicode-safe.",
    "badge": "4 modes"
  },
  {
    "slug": "binary-to-text",
    "title": "Binary to Text",
    "description": "Convert between UTF-8 text and binary (8-bit bytes). Handles emoji and non-ASCII correctly.",
    "badge": "UTF-8"
  },
  {
    "slug": "morse-code",
    "title": "Morse Code",
    "description": "Encode text as Morse code and decode Morse back to text. Letters, digits, and punctuation.",
    "badge": "Bidirectional"
  },
  {
    "slug": "rot13",
    "title": "ROT13 / ROT47 / Caesar",
    "description": "Classic shift ciphers — ROT13 (self-inverting), ROT47 (ASCII), or a custom Caesar shift.",
    "badge": "3 variants"
  },
  {
    "slug": "line-sorter",
    "title": "Line Sorter",
    "description": "Sort lines alphabetically, naturally, numerically, or by length — with dedupe and shuffle.",
    "badge": "4 modes"
  },
  {
    "slug": "meta-tag-generator",
    "title": "Meta Tag Generator",
    "description": "Generate SEO, Open Graph, and Twitter Card meta tags from a form with live preview.",
    "badge": "SEO + OG"
  },
  {
    "slug": "json-sorter",
    "title": "JSON Key Sorter",
    "description": "Sort JSON object keys alphabetically or reverse with recursive deep sorting for nested objects.",
    "badge": "Recursive"
  },
  {
    "slug": "backslash-escape",
    "title": "Backslash Escape",
    "description": "Escape and unescape strings for JSON, JavaScript, Python, HTML, and URL encoding.",
    "badge": "5 formats"
  },
  {
    "slug": "text-to-hex",
    "title": "Text to Hex",
    "description": "Convert text to hexadecimal bytes and hex back to text with full UTF-8 and Unicode support.",
    "badge": "UTF-8"
  },
  {
    "slug": "base64-to-hex",
    "title": "Base64 to Hex",
    "description": "Convert between Base64 and hexadecimal encoding formats with configurable output options.",
    "badge": "Bidirectional"
  },
  {
    "slug": "yaml-formatter",
    "title": "YAML Formatter",
    "description": "Pretty-print or minify YAML config files with configurable indentation for Kubernetes, Docker, Ansible.",
    "badge": "Readable"
  },
  {
    "slug": "json-validator",
    "title": "JSON Validator",
    "description": "Validate JSON syntax with detailed error messages, line numbers, and structure statistics.",
    "badge": "Analysis"
  },
  {
    "slug": "html-to-jsx",
    "title": "HTML → JSX",
    "description": "Convert HTML to JSX and back. Transforms class to className, style strings to objects, and more.",
    "badge": "Bidirectional"
  },
  {
    "slug": "url-parser",
    "title": "URL Parser",
    "description": "Parse URLs into protocol, host, path, query params, and hash. Build URLs from components.",
    "badge": "Bidirectional"
  },
  {
    "slug": "json-to-html-table",
    "title": "JSON → HTML Table",
    "description": "Convert JSON arrays to formatted HTML tables with proper thead/tbody structure.",
    "badge": "Generator"
  },
  {
    "slug": "markdown-table-generator",
    "title": "Markdown Table",
    "description": "Create GitHub-flavored Markdown tables with a visual editor. Set alignment, add rows and columns.",
    "badge": "Interactive"
  },
  {
    "slug": "utm-builder",
    "title": "UTM Builder",
    "description": "Build campaign tracking URLs with UTM parameters for Google Analytics and marketing attribution.",
    "badge": "Marketing"
  },
  {
    "slug": "hmac-generator",
    "title": "HMAC Generator",
    "description": "Generate HMAC signatures with SHA-256, SHA-384, SHA-512, SHA-1. Hex and Base64 output.",
    "badge": "Crypto"
  },
  {
    "slug": "byte-converter",
    "title": "Byte Converter",
    "description": "Convert between bytes, KB, MB, GB, TB, PB. Binary (1024) and decimal (1000) standards.",
    "badge": "Dual Mode"
  },
  {
    "slug": "aspect-ratio-calculator",
    "title": "Aspect Ratio",
    "description": "Calculate aspect ratios from dimensions. Scale proportionally. Presets for screens and video.",
    "badge": "Calculator"
  },
  {
    "slug": "json-to-go-struct",
    "title": "JSON → Go Struct",
    "description": "Convert JSON to Go struct definitions with type inference, json tags, and nested structs.",
    "badge": "Go"
  }
] as const;
