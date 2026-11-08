import { growthArticlesForBlog } from './expansion-articles-growth';

export const expansionArticles = [
  {
    "slug": "json-flattening-guide",
    "title": "How to Flatten Nested JSON Without Losing Structure",
    "description": "Flatten nested JSON for exports and debugging while preserving arrays, empty containers, and keys that contain dots.",
    "intro": "Flattening replaces a nested tree with a collection of paths and values. It helps when you need to inspect deeply nested API responses, compare configuration fields, or prepare records for a tabular export. The important decision is the path format: a convenient dotted path is not always reversible.",
    "sections": [
      {
        "heading": "Choose an unambiguous path format",
        "body": "Consider an object with a literal key user.name alongside a nested user object containing name. Both can become user.name in a naive flattener. JSON Pointer avoids that collision by using slash-delimited segments. It escapes a literal slash as ~1 and a literal tilde as ~0. Store the exact path convention with any exported dataset so another system can interpret it."
      },
      {
        "heading": "Keep container information",
        "body": "A path ending in /0 could describe an array index or an object key named 0. Empty arrays and objects have no leaf values, so a leaf-only export loses them entirely. Our flattener writes an empty container marker at each container path, including the empty-string root path. This format is deliberately richer than a spreadsheet-oriented flat object."
      },
      {
        "heading": "Validate a round trip before migration",
        "body": "Flatten a representative record, restore it, and compare the resulting JSON structure. Include null, false, empty strings, numeric-looking keys, arrays, and empty containers in the sample. Do not compare serialized strings alone because object property order can differ without changing the data. Large numeric identifiers also need care: JavaScript JSON parsing uses numbers that may not preserve integers beyond its safe range."
      }
    ],
    "example": "{\"user\":{\"name\":\"Ada\"},\"tags\":[]}\n→ {\"/user/name\":\"Ada\",\"/user\":{},\"/tags\":[],\"\":{}}",
    "question": "Can flattened JSON always be restored?",
    "answer": "Only when paths are unambiguous and container types are retained. Leaf-only dotted formats often discard information.",
    "source": "https://www.rfc-editor.org/rfc/rfc6901",
    "tool": "json-flattener",
    "date": "2026-11-03"
  },
  {
    "slug": "json-pointer-explained",
    "title": "JSON Pointer Explained: Paths, Arrays and Escaped Keys",
    "description": "Learn JSON Pointer syntax, including /0 array indexes, ~0 and ~1 escaping, and the empty root pointer.",
    "intro": "JSON Pointer identifies one value inside a JSON document. It is useful in validation errors, patch operations, and tools that need a stable reference to a nested field. A pointer is a location, not a search expression: it does not provide wildcards or filters.",
    "sections": [
      {
        "heading": "Read segments from left to right",
        "body": "The empty string identifies the whole document. A slash starts each segment, so /user/name selects name inside user. A pointer consisting of just / selects an object property whose name is the empty string. For arrays, /items/0 selects the first element. Array indexes do not use square brackets and should not have leading zeros."
      },
      {
        "heading": "Escape property names in the right order",
        "body": "Replace tilde with ~0 and slash with ~1 when constructing a segment. When decoding, replace ~1 first and ~0 second. Reversing that decoding order can interpret ~01 incorrectly. A key named a/b is addressed by /a~1b; a key named m~n is addressed by /m~0n. Dots and spaces are ordinary characters in a pointer string."
      },
      {
        "heading": "Separate pointers from URI fragments",
        "body": "A URI fragment representation starts with # and may need percent encoding in addition to pointer escaping. Do not assume a URL-encoded string can be used directly as a plain pointer. A pointer that is syntactically valid can still fail to resolve when a property is absent. Report that condition separately from malformed escape sequences when building an API or validation interface."
      }
    ],
    "example": "{\"a/b\":{\"m~n\":[42]}}\nPointer: /a~1b/m~0n/0\nSelected value: 42",
    "question": "Is JSON Pointer the same as JSONPath?",
    "answer": "No. JSON Pointer addresses a specific location. JSONPath is a query language with selectors and filtering capabilities.",
    "source": "https://www.rfc-editor.org/rfc/rfc6901",
    "tool": "json-flattener",
    "date": "2026-11-03"
  },
  {
    "slug": "json-vs-ndjson",
    "title": "JSON vs NDJSON: When to Use JSON Lines",
    "description": "Compare JSON arrays and newline-delimited JSON for logs, streaming APIs, exports, and incremental processing.",
    "intro": "NDJSON stores one complete JSON value on each line. A conventional JSON export often stores all records inside one array. Both use JSON syntax for individual values, but they differ in how records are framed and processed. That difference matters when an export grows beyond what you want to load into memory.",
    "sections": [
      {
        "heading": "Choose arrays for complete documents",
        "body": "A JSON array is convenient for small API responses and configuration that should be validated as one document. Standard JSON parsers accept it directly. The opening bracket, separators, and closing bracket are part of the document, so appending records to a file requires maintaining valid array syntax. A partially written array may not parse as a complete JSON document."
      },
      {
        "heading": "Choose lines for record streams",
        "body": "With NDJSON, a reader can process a completed line without waiting for the end of the file. This works well for log pipelines and batch exports. Each line must contain a complete JSON value; formatting one record across several physical lines breaks that framing. Newlines inside string values must be escaped using JSON syntax rather than inserted literally."
      },
      {
        "heading": "Understand conversion costs",
        "body": "Converting an array to NDJSON removes only the outer array and serializes each member independently. Converting back collects values into a new array. Our browser converter loads the full input in memory, so it is a convenient conversion tool rather than a streaming engine for multi-gigabyte files. Use a streaming parser or command-line pipeline when file size exceeds a comfortable browser workload."
      }
    ],
    "example": "JSON: [{\"id\":1},{\"id\":2}]\nNDJSON:\n{\"id\":1}\n{\"id\":2}",
    "question": "Are NDJSON and JSON Lines equivalent?",
    "answer": "They share the one-JSON-value-per-line approach. Check the receiving system for conventions about blank lines, final newlines, and accepted value types.",
    "source": "https://github.com/ndjson/ndjson-spec",
    "tool": "json-to-ndjson",
    "date": "2026-11-03"
  },
  {
    "slug": "parse-json-lines",
    "title": "How to Parse JSON Lines and Find Invalid Records",
    "description": "Parse NDJSON line by line, diagnose malformed records, and preserve useful error locations during imports.",
    "intro": "An NDJSON import can fail because just one record is malformed. Parsing the whole file as JSON obscures the underlying issue because multiple adjacent objects are not one valid JSON document. Split records at physical line boundaries and parse each completed record independently.",
    "sections": [
      {
        "heading": "Keep line numbers during validation",
        "body": "Count physical lines before discarding blank lines so error messages point to the source file accurately. Our converter ignores blank lines and reports the original line number for malformed JSON. A stricter ingestion system may reject blank lines, so confirm its contract before exporting. A final newline is helpful for text processing and is commonly expected in NDJSON files."
      },
      {
        "heading": "Recognize common broken records",
        "body": "Trailing commas, single-quoted property names, and unescaped control characters are invalid JSON. A pretty-printed object spanning multiple lines is valid standalone JSON but invalid as one NDJSON record. A string containing a line break must use an escaped newline. If records arrive over a network stream, buffer incomplete chunks until a newline arrives: network chunks do not necessarily align with records."
      },
      {
        "heading": "Choose a failure policy explicitly",
        "body": "For a production import, decide whether to stop at the first invalid line or put bad records in a separate error file. Silently dropping records changes counts and can hide data loss. Record the line number and diagnostic while avoiding sensitive payloads in logs. Validate the resulting array before writing to a database, because valid JSON syntax alone does not establish required fields, types, or business rules."
      }
    ],
    "example": "const rows = text.split(/\r?\n/);\nconst values = rows.filter(line => line.trim()).map(line => JSON.parse(line));",
    "question": "Why does JSON.parse reject an NDJSON file?",
    "answer": "Multiple JSON values separated by newlines are not a single JSON document. Parse individual lines or convert them to an array first.",
    "source": "https://github.com/ndjson/ndjson-spec",
    "tool": "json-to-ndjson",
    "date": "2026-11-03"
  },
  {
    "slug": "tsv-vs-csv",
    "title": "TSV vs CSV: Choosing a Spreadsheet Export Format",
    "description": "Compare tabs and commas, quoting rules, locale issues, and text preservation in spreadsheet exports.",
    "intro": "CSV separates cells with commas; TSV uses tabs. Both can represent rows and columns as plain text. The best choice depends on the data and the importer: changing the delimiter does not remove the need to handle quoted fields, line endings, character encoding, and column types.",
    "sections": [
      {
        "heading": "Match the delimiter to the receiving application",
        "body": "Tabs are convenient for copying cells directly from a spreadsheet because commas inside names and addresses remain ordinary text. CSV is widely supported by databases and reporting tools. Some regional spreadsheet settings export semicolon-separated files under the CSV label. Inspect the actual first line instead of trusting the extension, and select the delimiter explicitly when importing."
      },
      {
        "heading": "Do not split every row with a simple string operation",
        "body": "A quoted cell can contain the delimiter or a newline. A parser needs to track whether it is inside quotes and interpret doubled quotes as a literal quote. Our TSV converter supports that convention and rejects rows with inconsistent cell counts. However, TSV producers do not all share identical escaping rules; inspect exports from the application you actually use."
      },
      {
        "heading": "Preserve identifiers before converting",
        "body": "Postal codes, account numbers, and long IDs should generally stay strings. A spreadsheet can remove leading zeros or switch long values to scientific notation before export; a converter cannot reconstruct the original digits. Set identifier columns to text at the source. When opening untrusted exports in a spreadsheet, remember that cells beginning with formula characters may be interpreted as formulas by that application."
      }
    ],
    "example": "name\tpostal_code\nAda\t00123\n\nJSON value: {\"name\":\"Ada\",\"postal_code\":\"00123\"}",
    "question": "Does TSV avoid all quoting problems?",
    "answer": "No. Tabs and line breaks can appear inside cells, so the exporter and importer still need an agreed escaping convention.",
    "source": "https://www.iana.org/assignments/media-types/text/tab-separated-values",
    "tool": "tsv-to-json",
    "date": "2026-11-03"
  },
  {
    "slug": "spreadsheet-to-json",
    "title": "How to Convert Spreadsheet Data to JSON Safely",
    "description": "Prepare headers, preserve leading zeros, and validate rows when converting Excel or Google Sheets data to JSON.",
    "intro": "Copying a spreadsheet range usually produces tab-separated text. That makes TSV a useful bridge between a worksheet and an API payload. Before conversion, decide what each row represents and which columns must remain text. Most data problems begin in the worksheet rather than in JSON serialization.",
    "sections": [
      {
        "heading": "Prepare one header row",
        "body": "Use unique, non-empty names such as customer_id and signup_date. Remove merged cells, decorative headings, subtotals, and blank columns from the range. Every data row should have the same number of cells as the header. Our converter rejects mismatched widths instead of guessing where missing data belongs, which makes accidental pasted ranges easier to diagnose."
      },
      {
        "heading": "Convert values deliberately",
        "body": "The TSV tool keeps cells as strings. That preserves values such as 00123, false as a label, and dates whose format is ambiguous. Convert selected fields to numbers or booleans later using an explicit schema. An empty cell becomes an empty string; it is not automatically null or an omitted property. Choose that mapping according to the API or database contract."
      },
      {
        "heading": "Check the exported records",
        "body": "Inspect the first, middle, and final records and compare row counts. Test names with accents, quotes, tabs, and multiline addresses. If you reverse the conversion to TSV, nested objects are serialized as JSON text inside cells and missing or null fields become empty cells, so that direction does not preserve every JSON type. Keep the original JSON as the source of truth when types matter."
      }
    ],
    "example": "customer_id\tactive\n00123\tfalse\n\n[{\"customer_id\":\"00123\",\"active\":\"false\"}]",
    "question": "Will this recreate numbers already rounded by Excel?",
    "answer": "No. Export the original data again with identifier columns stored as text. Lost digits cannot be inferred reliably.",
    "source": "https://www.iana.org/assignments/media-types/text/tab-separated-values",
    "tool": "tsv-to-json",
    "date": "2026-11-03"
  },
  {
    "slug": "px-vs-rem",
    "title": "PX vs REM in CSS: Conversion and Practical Differences",
    "description": "Learn the px-to-rem formula, root font-size behavior, browser defaults, and common conversion mistakes.",
    "intro": "A CSS pixel is a reference unit used by the layout system. A rem is relative to the computed font size of the root element. Converting between them is simple arithmetic, but choosing a unit is a design decision that should account for text resizing and the actual root size of your page.",
    "sections": [
      {
        "heading": "Use the current root size",
        "body": "Divide pixels by the root font size to get rem. Multiply rem by that same root size to get pixels. At a 16px root, 24px equals 1.5rem. At a 20px root, the same 24px equals 1.2rem. Check the computed style on the html element instead of assuming a fixed value. Browser defaults and user preferences can affect the result."
      },
      {
        "heading": "Keep zoom and device pixels separate",
        "body": "A CSS pixel is not necessarily one physical screen pixel. Browser zoom and display density affect rendering. REM conversion describes CSS layout values, not the exact number of illuminated pixels on a display. Relative units can help a layout follow text size preferences, but they do not automatically make a page accessible. Fixed-height containers and clipped overflow can still break enlarged content."
      },
      {
        "heading": "Avoid changing the root only for easier arithmetic",
        "body": "A 62.5% root is sometimes used so that 1rem often corresponds to 10px under a common default. That convenience adds assumptions and affects all rem-based components. A root size of 100% with an explicit design token scale is often easier to integrate with existing libraries. Test navigation, dialogs, and forms after increasing text size, especially where dimensions were originally copied from a pixel-based design."
      }
    ],
    "example": "rem = px / rootFontSize\n24 / 16 = 1.5rem\n1.5 * 20 = 30px",
    "question": "Is 1rem always 16px?",
    "answer": "No. It equals the computed font size of the root element. 16px is a common default, not a guarantee.",
    "source": "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/length",
    "tool": "px-to-rem",
    "date": "2026-11-03"
  },
  {
    "slug": "responsive-type-with-rem",
    "title": "Responsive Typography with REM and CSS clamp()",
    "description": "Build a fluid font-size scale with rem and clamp while preserving readable limits and testing text resizing.",
    "intro": "Responsive typography needs both a readable minimum and a sensible maximum. CSS clamp() can interpolate between those limits as the viewport changes. Use rem for the bounds so the scale relates to the root font size, then verify that the viewport-dependent middle term behaves correctly when users enlarge text.",
    "sections": [
      {
        "heading": "Start with useful minimum and maximum sizes",
        "body": "Choose bounds based on content, not just a desktop mockup. A heading might start at 1.5rem and stop at 3rem, while body text stays at least 1rem in the chosen design. These values are starting points rather than universal requirements. Long translated headings, narrow devices, and embedded widgets may need different limits."
      },
      {
        "heading": "Mix relative text sizing and viewport growth",
        "body": "A preferred expression such as calc(1rem + 2vw) grows with the viewport while keeping a root-relative contribution. Pure viewport sizing can respond poorly to text preferences. Even a mixed expression is not proof of accessibility: check browser zoom, text-only enlargement where available, and mobile orientation. Do not place fluid headings in a rigid-height wrapper that cuts off extra lines."
      },
      {
        "heading": "Use a shared scale and test real content",
        "body": "Define custom properties for body, subheading, and display sizes so components use the same decisions. Check line height without units, line length, and spacing alongside font size. A number that looks good on a short heading can become awkward on a four-line title. Use the PX to REM tool to translate an existing design, then adjust the scale based on reading and resizing tests rather than matching a screenshot exactly."
      }
    ],
    "example": ":root { --title-size: clamp(1.5rem, calc(1rem + 2vw), 3rem); }\nh1 { font-size: var(--title-size); line-height: 1.15; }",
    "question": "Does clamp() guarantee accessible text scaling?",
    "answer": "No. Test the complete layout under zoom and text resizing, because viewport terms and rigid containers can limit the result.",
    "source": "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/length",
    "tool": "px-to-rem",
    "date": "2026-11-03"
  },
  {
    "slug": "wcag-color-contrast",
    "title": "WCAG Color Contrast: AA and AAA Ratios Explained",
    "description": "Understand text contrast thresholds, relative luminance, large text rules, and how to test foreground/background pairs.",
    "intro": "Contrast measures the luminance difference between foreground and background. It helps assess whether text is readable for people with reduced vision or contrast sensitivity. Test the colors that actually touch in the rendered interface, including hover states, muted labels, badges, and error messages.",
    "sections": [
      {
        "heading": "Interpret the thresholds correctly",
        "body": "WCAG AA requires at least 4.5:1 for normal text and 3:1 for large text. AAA raises those values to 7:1 and 4.5:1. Large text means at least 18pt regular or 14pt bold, approximately 24px or 18.67px in CSS. Evaluate font size and weight together. Do not round a ratio upward to claim a pass when the underlying value is below the threshold."
      },
      {
        "heading": "Calculate using luminance, not visual guesses",
        "body": "The standard method converts sRGB channels to linear light, combines them with weighted coefficients, and compares lighter and darker luminance after adding 0.05. Our checker evaluates opaque HEX pairs with that formula. Two vivid colors can still have similar luminance and poor text contrast. Hue difference alone is not a reliable indicator."
      },
      {
        "heading": "Test the actual background and state",
        "body": "An alpha color must be composited against its background before testing. Gradients and images can produce multiple local contrast values, so a single flat pair is insufficient. Contrast results also do not assess keyboard behavior, labels, reading order, or screen-reader support. Use this checker as one focused test within a broader accessibility review, and verify disabled or decorative exceptions against the relevant criterion before applying them."
      }
    ],
    "example": "Foreground: #000000\nBackground: #ffffff\nContrast: 21:1",
    "question": "Does passing a contrast checker mean a page is WCAG compliant?",
    "answer": "No. A color-pair check covers only a small part of accessibility and does not establish overall conformance.",
    "source": "https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum",
    "tool": "color-contrast-checker",
    "date": "2026-11-03"
  },
  {
    "slug": "accessible-color-palettes",
    "title": "How to Build an Accessible UI Color Palette",
    "description": "Choose and test semantic color pairs for buttons, labels, focus indicators, and dark mode interfaces.",
    "intro": "An accessible palette is a set of working foreground/background combinations. A collection of attractive standalone swatches is not enough. Begin with semantic roles such as page background, body text, muted text, primary button, and error state, then test each role in the context where users will see it.",
    "sections": [
      {
        "heading": "Create a pair matrix",
        "body": "List the combinations used by components: body text on surface, secondary text on surface, button text on brand, and links within paragraphs. Test each pair with a contrast checker and record its intended use. A brand color that works as a large decorative shape may fail for a small button label. Adjust the label color or choose a darker or lighter brand variant for that role."
      },
      {
        "heading": "Include states and non-color signals",
        "body": "Hover, active, selected, and focus states need separate inspection. Avoid using color alone to explain errors or selection; add text, icons, borders, or another visible cue. Text contrast criteria differ from requirements for user interface components and graphical objects, so do not apply the normal-text threshold indiscriminately to every border. Confirm which requirement fits the element."
      },
      {
        "heading": "Treat dark mode as its own design",
        "body": "Inverting a palette does not preserve all useful relationships. Muted text can become too dim, brand backgrounds can dominate, and disabled states can be confused with active controls. Test both themes independently using real components. Leave some margin above the minimum where practical so minor token changes do not push a combination below its required ratio. Recheck any alpha overlays after compositing them with the actual surface."
      }
    ],
    "example": "Role                 Foreground   Background\nBody text            #111827      #ffffff\nInverse text         #ffffff      #111827",
    "question": "Can I certify a whole palette with one ratio?",
    "answer": "No. Contrast belongs to a particular pair in a particular use. Test the combinations your components actually render.",
    "source": "https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum",
    "tool": "color-contrast-checker",
    "date": "2026-11-03"
  },
  {
    "slug": "html-to-plain-text",
    "title": "How to Convert HTML to Plain Text Without Executing It",
    "description": "Extract readable text from HTML while handling entities, paragraphs, scripts, styles, and missing content.",
    "intro": "HTML-to-text conversion is useful for cleaning copied content, preparing search snippets, or inspecting the words inside an email template. A useful converter interprets markup structure and character references. Removing everything between angle brackets with a regular expression cannot reliably reproduce that behavior.",
    "sections": [
      {
        "heading": "Parse markup in an inert document",
        "body": "Use an HTML parser rather than rendering the supplied markup in the application. Our tool parses a separate document and removes script, style, template, and noscript elements before extracting text. It adds line breaks for common block elements and decodes entities through parsing. It never inserts the supplied HTML into the visible page. Extracted text is displayed as text, not interpreted as markup."
      },
      {
        "heading": "Decide what readable means",
        "body": "A paragraph break, table separator, image alternative, and hyperlink destination are different kinds of information. Our extractor keeps common line boundaries and table-cell separation but does not append link destinations or image alt text. It also does not compute external CSS visibility. If your downstream workflow needs those features, define a richer extraction policy rather than assuming any plain-text converter preserves them."
      },
      {
        "heading": "Keep extraction separate from sanitization",
        "body": "Plain text can be safely displayed through a text node, but converting HTML to text does not produce sanitized HTML. If the result is later inserted into HTML source by string concatenation, it must still be escaped for that context. For production email, maintain a deliberate plain-text alternative and review it for links, reading order, and calls to action. Automatically extracted output is a draft, not a full substitute for that review."
      }
    ],
    "example": "<h2>News</h2><p>Tom &amp; Ada</p>\n\nNews\nTom & Ada",
    "question": "Can I use the output as sanitized HTML?",
    "answer": "No. It is plain text. Escape it appropriately if another system later embeds it into HTML.",
    "source": "https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString",
    "tool": "html-to-text",
    "date": "2026-11-03"
  },
  {
    "slug": "html-textcontent-vs-innertext",
    "title": "textContent vs innerText vs innerHTML in JavaScript",
    "description": "Choose the right DOM property for text extraction, visible text, and markup without introducing unsafe HTML insertion.",
    "intro": "These three DOM properties answer different questions. textContent reads textual node content, innerText approximates rendered text, and innerHTML reads or writes markup. Mixing them up can lead to unexpected whitespace, hidden text in exports, or unsafe rendering of untrusted strings.",
    "sections": [
      {
        "heading": "Use textContent for node text",
        "body": "textContent does not require the same layout-dependent interpretation as innerText. It can include text inside hidden elements and script or style nodes, so remove unwanted nodes first when extracting article content. It does not automatically insert paragraph separators between every block element. Our HTML-to-text tool explicitly adds common line boundaries before reading the resulting text."
      },
      {
        "heading": "Use innerText when rendered behavior matters",
        "body": "innerText generally reflects rendered text and can account for visibility and line breaks in a displayed document. Its behavior depends on whether an element is actually rendered; a detached element is not a reliable substitute for a live layout measurement. Reading it may require layout work. For a server-side or inert-document extraction pipeline, define structural rules rather than assuming browser-visible text can be recovered from HTML alone."
      },
      {
        "heading": "Treat innerHTML as markup",
        "body": "Reading innerHTML preserves tags rather than producing plain words. Writing untrusted strings through it creates an injection risk because the browser interprets markup. Use textContent or framework text interpolation when you intend to display text. If a product truly needs user-authored HTML, use a suitable sanitization policy and review the allowed elements, attributes, and URLs instead of trying to remove dangerous strings with ad hoc replacements."
      }
    ],
    "example": "const node = document.createElement(\"div\");\nnode.textContent = \"<strong>Hello</strong>\";\n// Shows literal tags rather than bold markup.",
    "question": "Why are my paragraphs joined in textContent?",
    "answer": "It combines text nodes rather than formatting the document visually. Add structural separators when building a plain-text export.",
    "source": "https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent",
    "tool": "html-to-text",
    "date": "2026-11-03"
  },
  {
    "slug": "unicode-escape-sequences",
    "title": "JavaScript Unicode Escape Sequences: UTF-16 and Emoji",
    "description": "Use Unicode escapes correctly, understand surrogate pairs, and avoid executing escaped input as JavaScript.",
    "intro": "A Unicode escape writes a character using hexadecimal notation inside source text. In JavaScript, the traditional four-digit form represents one UTF-16 code unit. A brace-style escape can represent an entire Unicode code point. These distinctions become visible as soon as the input includes emoji or less common writing systems.",
    "sections": [
      {
        "heading": "Distinguish source notation from the resulting string",
        "body": "A source literal containing a Unicode escape is interpreted by the JavaScript parser. Text loaded from a file or pasted into a textarea is not automatically re-parsed as a string literal. Our decoder explicitly recognizes Unicode escapes; it does not evaluate JavaScript. It leaves unrelated escape conventions unchanged so it cannot be mistaken for a general-purpose JSON parser."
      },
      {
        "heading": "Represent characters outside the basic plane",
        "body": "Characters above U+FFFF use two UTF-16 code units in JavaScript. The waving-hand emoji can therefore be written as a pair of four-digit escapes or one brace-style escape. JSON accepts the four-digit form but does not accept the JavaScript brace syntax. If the destination is JSON, validate the complete JSON document instead of assuming every JavaScript string notation is portable."
      },
      {
        "heading": "Avoid double interpretation",
        "body": "An escaped value can be escaped again when embedded in another document. Decode only the layer your workflow expects. Repeatedly decoding until a string looks readable can change intended literal text. Never use eval or Function to decode pasted strings. For structured JSON input, JSON.parse is the correct parser; for a focused Unicode conversion, use an explicit decoder that reports malformed sequences and code points outside the Unicode range."
      }
    ],
    "example": "\\u0041 → A\n\\ud83d\\udc4b → 👋\n\\u{1F44B} → 👋 (JavaScript syntax)",
    "question": "Can I use brace-style Unicode escapes in JSON?",
    "answer": "No. JSON uses four hexadecimal digits per Unicode escape; supplementary characters can use a surrogate pair.",
    "source": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar",
    "tool": "unicode-escape",
    "date": "2026-11-03"
  },
  {
    "slug": "unicode-code-points",
    "title": "Unicode Code Points vs UTF-16 Code Units vs Graphemes",
    "description": "Understand why JavaScript string length differs from visible character count for emoji and combining marks.",
    "intro": "Counting characters is ambiguous. A user sees symbols, Unicode assigns code points, and JavaScript stores strings as UTF-16 code units. A single visible symbol can occupy multiple code points and several code units. Choose the measurement that matches your task before applying limits or truncation.",
    "sections": [
      {
        "heading": "Know what string length counts",
        "body": "JavaScript length counts UTF-16 code units. Many familiar letters use one unit; a supplementary-plane emoji uses two. Iterating a string with for...of works by code point, so it handles a surrogate pair together. However, code points still do not always correspond to user-perceived characters. A letter plus a combining accent contains multiple code points even when it looks like one letter."
      },
      {
        "heading": "Use grapheme segmentation for visible editing",
        "body": "Emoji sequences can include skin-tone modifiers, variation selectors, and zero-width joiners. Cutting such a sequence in the middle may produce an unintended symbol. Intl.Segmenter with grapheme granularity is useful for cursor-like operations and user-facing truncation in supported environments. Keep byte limits separate: an API or database may enforce UTF-8 bytes rather than any character count."
      },
      {
        "heading": "Normalize only with a clear purpose",
        "body": "Two visually identical strings may have different code-point sequences, such as an accented letter stored as one precomposed code point or as a base letter plus a mark. Unicode normalization can help comparison, but compatibility normalization may change distinctions that matter to your application. Do not normalize passwords or signed payloads casually. Inspect escaped output when debugging invisible differences and document which normalization form your system expects."
      }
    ],
    "example": "\"👋\".length // 2 code units\n[...\"👋\"].length // 1 code point\n[...\"é\"].length // 2 code points",
    "question": "Is Array.from(text).length a visible character count?",
    "answer": "It counts code points, not grapheme clusters. Combined emoji and accented sequences can still be counted as multiple items.",
    "source": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter",
    "tool": "unicode-escape",
    "date": "2026-11-03"
  },
  {
    "slug": "subresource-integrity-guide",
    "title": "Subresource Integrity Guide: Generate SRI for Scripts and CSS",
    "description": "Add integrity hashes to external scripts and stylesheets and understand exact bytes, CORS, and version pinning.",
    "intro": "Subresource Integrity lets a browser compare a downloaded resource against an expected cryptographic digest before using it. It is useful for versioned scripts and stylesheets served by another origin. The expected value must come from a trusted build or release process, because a hash copied from an untrusted source provides little assurance.",
    "sections": [
      {
        "heading": "Hash the exact release bytes",
        "body": "An SRI value consists of an algorithm name, a hyphen, and a Base64 digest. Supported algorithms include SHA-256, SHA-384, and SHA-512. Our tool generates all three. Upload the exact deployed file when possible; pasting text can change encoding or line endings. SRI hashes bytes, not the meaning of JavaScript or CSS, so equivalent minified and formatted sources produce different values."
      },
      {
        "heading": "Attach the digest to the resource element",
        "body": "Add integrity to the script or stylesheet element. Cross-origin resources also need an appropriate CORS response; crossorigin=\"anonymous\" is commonly used for public CDN assets. Pin the resource URL to a specific release instead of a moving latest alias. When upgrading, update the URL and digest in the same change and test the page from its real origin."
      },
      {
        "heading": "Understand the protection boundary",
        "body": "A mismatch blocks the resource, which can make a page partly unusable if the release process is inconsistent. SRI does not fix vulnerabilities already present in the trusted code and does not protect a page if an attacker can replace both its markup and expected hash. Combine it with careful dependency review and a controlled deployment process. Keep an eye on browser console errors after changing any resource pipeline."
      }
    ],
    "example": "<script src=\"https://cdn.example.com/app-1.0.js\"\n integrity=\"sha384-BASE64_DIGEST\" crossorigin=\"anonymous\"></script>",
    "question": "Should I hash the URL or the file contents?",
    "answer": "Hash the file bytes. The URL string is not what the browser compares against the downloaded resource.",
    "source": "https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Subresource_Integrity",
    "tool": "sri-generator",
    "date": "2026-11-03"
  },
  {
    "slug": "sri-hash-mismatch",
    "title": "How to Fix an SRI Hash Mismatch in the Browser",
    "description": "Diagnose integrity failures caused by changed files, line endings, CDN transformations, redirects, and CORS.",
    "intro": "When the browser reports that no valid digest was found, the bytes it received did not match the expected integrity value. Removing integrity hides the symptom but discards the check. Diagnose the deployed resource and the release process so the URL, content, and hash agree.",
    "sections": [
      {
        "heading": "Inspect the actual network response",
        "body": "Check the final response URL, status, response body, and content type. A missing file may return an HTML error page, which cannot match a JavaScript digest. A redirect may lead to a different version or login page. Save the response bytes and compute a fresh digest locally. Avoid hashing copied DevTools text when exact-byte verification is required."
      },
      {
        "heading": "Look for transformations between build and browser",
        "body": "Minification, banners, encoding changes, newline conversion, and CDN rewriting all change the digest. Transfer compression such as gzip is decoded by the browser before integrity verification; the relevant content is the decoded resource representation. Compare the published asset with the build artifact and check whether different edge locations or caches serve different versions."
      },
      {
        "heading": "Update assets and markup consistently",
        "body": "Publish versioned immutable filenames and deploy matching markup together. A stale HTML page pointing at a resource whose bytes were replaced can create intermittent failures. Check CORS separately: a cross-origin integrity request can fail even when your calculated digest is correct if the server does not allow the request appropriately. Test after clearing or bypassing relevant caches, then confirm normal cached navigation also succeeds."
      }
    ],
    "example": "Checklist:\n1. Exact final URL\n2. Successful resource response\n3. Matching decoded bytes\n4. Correct integrity prefix\n5. Valid cross-origin response",
    "question": "Can whitespace alone cause an SRI failure?",
    "answer": "Yes. A single changed byte, including a newline or added comment, changes the digest.",
    "source": "https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Subresource_Integrity",
    "tool": "sri-generator",
    "date": "2026-11-03"
  },
  {
    "slug": "http-basic-auth-guide",
    "title": "HTTP Basic Authentication: Header Format and Limitations",
    "description": "Generate and decode Basic Authorization headers and understand usernames, passwords, UTF-8, and HTTPS.",
    "intro": "HTTP Basic authentication sends credentials in an Authorization header. The value is the word Basic followed by a Base64 encoding of username, colon, and password. Base64 is reversible encoding, so treat the header itself as a credential and transmit it only over a properly configured HTTPS connection.",
    "sections": [
      {
        "heading": "Build the credential string correctly",
        "body": "The first colon separates username from password. A username cannot contain a colon, while a password can. Control characters are not allowed in either value. Our generator takes the first line as the username and the rest as the password, validates those restrictions, and encodes the result as UTF-8 bytes before Base64 conversion. Do not append a newline to the credentials accidentally."
      },
      {
        "heading": "Agree on character encoding",
        "body": "ASCII examples are straightforward, but non-ASCII credentials require agreement between client and server. The Basic authentication specification defines a UTF-8 charset signal in the server challenge; legacy implementations can behave differently. If an accented password fails, inspect the expected encoding rather than repeatedly changing Base64 characters. Our decoder expects UTF-8 and reports invalid byte sequences."
      },
      {
        "heading": "Protect headers throughout the workflow",
        "body": "Do not paste a real Authorization header into public issue trackers, screenshots, or shared logs. HTTPS protects transport but does not make a copied header harmless. Use narrowly scoped credentials and rotate exposed ones. Basic authentication also has no built-in expiry mechanism; any expiry or revocation comes from the server-side account or application policy. For browser apps, avoid embedding service passwords in publicly shipped JavaScript."
      }
    ],
    "example": "username: demo\npassword: example-password\nHeader: Authorization: Basic BASE64_OF_UTF8_CREDENTIALS",
    "question": "Does Basic authentication encrypt my password?",
    "answer": "No. Base64 is easily decoded. HTTPS is necessary to protect the credentials in transit.",
    "source": "https://www.rfc-editor.org/rfc/rfc7617",
    "tool": "basic-auth-generator",
    "date": "2026-11-03"
  },
  {
    "slug": "basic-auth-with-fetch",
    "title": "How to Send Basic Auth with JavaScript fetch()",
    "description": "Construct a Basic Authorization header for fetch and troubleshoot Unicode encoding, CORS, and exposed credentials.",
    "intro": "fetch() accepts an Authorization header through its headers option. The tricky parts are generating the correct bytes, handling cross-origin requests, and deciding whether a browser should possess the credentials at all. Use a local test account when learning the request format.",
    "sections": [
      {
        "heading": "Encode UTF-8 bytes before Base64",
        "body": "Calling btoa directly on arbitrary Unicode text can throw or encode the wrong bytes. Use TextEncoder to turn the credential string into UTF-8 bytes, convert those bytes to a binary string, then apply btoa. The server must expect that encoding. Validate the username for colons and reject control characters before constructing the request. The generated header should be treated as sensitive output."
      },
      {
        "heading": "Understand browser CORS behavior",
        "body": "For a cross-origin request, an explicit Authorization header normally triggers a preflight. The API must allow your origin, requested method, and Authorization header. A browser CORS error cannot be fixed by changing Base64 or adding access-control response headers to the client request. Inspect the OPTIONS response and configure the API. The credentials option controls browser-managed credentials such as cookies; it does not create a Basic header for you."
      },
      {
        "heading": "Keep shared service secrets on the server",
        "body": "A credential embedded in frontend source or a public build variable is available to users of that application. If the integration uses a shared service account, make the authenticated request through a trusted backend with appropriate authorization. When handling an end user’s own credentials, minimize retention and avoid logging the header. Check response.ok and handle 401 or 403 deliberately rather than assuming a resolved fetch promise means authentication succeeded."
      }
    ],
    "example": "const bytes = new TextEncoder().encode(`${username}:${password}`);\nlet binary = \"\";\nfor (const byte of bytes) binary += String.fromCharCode(byte);\nconst response = await fetch(url, {\n  headers: { Authorization: `Basic ${btoa(binary)}` }\n});",
    "question": "Does credentials: include automatically send my username and password?",
    "answer": "No. It controls browser-managed credentials. Construct the Authorization header explicitly when that is the API contract.",
    "source": "https://www.rfc-editor.org/rfc/rfc7617",
    "tool": "basic-auth-generator",
    "date": "2026-11-03"
  },
  {
    "slug": "bulk-slug-migration",
    "title": "Bulk URL Slug Migration: Build a Safe Redirect Map",
    "description": "Generate slugs for a content migration, identify collisions, and preserve existing URLs with explicit redirects.",
    "intro": "A slug migration changes the public address of content. Generating neat new strings is only one part of the job: every existing URL needs a deliberate destination, and each destination must remain unique. Start from a complete content export that includes stable record identifiers and current canonical URLs.",
    "sections": [
      {
        "heading": "Generate candidates without losing row identity",
        "body": "Keep source ID, old URL, title, proposed slug, and final URL in one mapping table. Our batch generator creates one slug per input line in the same order and rejects duplicate outputs. Latin accents are normalized, punctuation becomes hyphens, and unsupported scripts may be removed. Review multilingual titles separately with a transliteration or native-script policy appropriate to the site."
      },
      {
        "heading": "Resolve collisions before publishing",
        "body": "Titles such as Red Shoes and Red-Shoes can produce the same slug. Use a meaningful qualifier, category, or stable identifier when collisions occur. Do not silently overwrite an existing route or rely on row order to choose the surviving page. Check proposed slugs against both the current live routes and other migration candidates, including reserved paths such as login or api."
      },
      {
        "heading": "Publish and verify the redirect map",
        "body": "Use permanent redirects from old URLs to their closest relevant replacements. Avoid sending every old page to the homepage, and avoid multi-step chains when a direct mapping is available. Update internal links and canonical tags to the final URLs, then regenerate the sitemap from real destinations. Test a representative set of old URLs and confirm that the target returns useful content rather than a soft error page."
      }
    ],
    "example": "id | old_url | title | new_url\n42 | /item/42 | Café Mug | /products/cafe-mug",
    "question": "Should old slugs remain in the sitemap?",
    "answer": "List canonical destination URLs in the sitemap. Keep old-to-new mappings in redirect configuration so existing links still work.",
    "source": "https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes",
    "tool": "text-to-slug-list",
    "date": "2026-11-03"
  },
  {
    "slug": "duplicate-url-slugs",
    "title": "How to Prevent Duplicate URL Slugs in a CMS",
    "description": "Find slug collisions, enforce uniqueness, and distinguish duplicate paths from duplicate content.",
    "intro": "Duplicate slugs can make two records compete for one route. They are a routing and data-integrity problem even before search indexing becomes relevant. A robust CMS checks uniqueness in the same scope used by its router, then stores a stable public address for each record.",
    "sections": [
      {
        "heading": "Define the uniqueness scope",
        "body": "Some sites require a globally unique slug. Others include locale, content type, category, or a parent path. A slug named introduction may be valid under two different documentation sections but invalid twice under the same parent. Make the database uniqueness constraint match that routing model. A UI check alone can race when two editors publish at the same time."
      },
      {
        "heading": "Normalize before comparing",
        "body": "Apply the same case, separator, accent, and trailing-slash rules during generation and validation. Different titles can collapse into an identical candidate after normalization. Our list generator reports duplicate line numbers instead of appending arbitrary suffixes. Resolve them with editorially meaningful names or stable identifiers, then check against existing records. Handle empty output explicitly, particularly for titles containing unsupported scripts or only punctuation."
      },
      {
        "heading": "Keep slugs stable after publication",
        "body": "Changing a title does not always justify changing its URL. Store the published slug separately and use redirects when a deliberate rename is necessary. Duplicate content is a different concern: two distinct URLs can show the same article even if their slugs differ. Choose one canonical address and keep internal links and sitemaps consistent. Canonical hints do not replace route uniqueness or a reliable redirect after a move."
      }
    ],
    "example": "Red Shoes → red-shoes\nRed-Shoes → red-shoes\nResolve before publication; do not overwrite either record.",
    "question": "Can canonical tags fix two records sharing one route?",
    "answer": "No. The router and database must identify one record per path. Canonical tags address preferred URLs for accessible pages.",
    "source": "https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls",
    "tool": "text-to-slug-list",
    "date": "2026-11-03"
  },
  {
    "slug": "rust-serde-json-mapping",
    "title": "JSON to Rust with Serde: Structs, Arrays and Renamed Fields",
    "description": "Map API JSON into Rust structs with Serde derives, nested models, Vec fields and explicit JSON-key renaming.",
    "intro": "A Rust API client needs a model that describes the response it actually receives. Serde connects serialized JSON keys to Rust fields, but a generated model is still a hypothesis based on examples. Start with several representative responses, including records with missing values, before choosing required fields and numeric types.",
    "sections": [
      {
        "heading": "Match wire keys without sacrificing Rust names",
        "body": "A JSON property such as userId can map to a Rust field named user_id through a serde rename attribute. Explicit attributes are useful when keys contain punctuation or when multiple spellings normalize to similar identifiers. Keep the original key in the attribute rather than changing the API contract. Our generator disambiguates colliding Rust names and creates a nested struct for each inferred object shape."
      },
      {
        "heading": "Choose an intentional number representation",
        "body": "An integer-looking sample becomes i64 in this tool, while fractional examples use f64. The tool rejects integer samples outside JavaScript’s safe range because the browser parser cannot reliably preserve their exact digits. If the API represents large identifiers as strings, keep them as String. Amounts requiring decimal arithmetic need a deliberate domain representation; observing one numeric example does not establish a safe money type."
      },
      {
        "heading": "Deserialize the same root shape you inspected",
        "body": "A JSON object can deserialize into Root; an array of objects needs Vec<Root>. An empty array provides no field evidence, so the generator asks for a non-empty record sample. Add tests using real response fixtures and assert the values your application relies on. A successful deserialize establishes structural compatibility for that fixture, while application-level checks still need to validate ranges, relationships and permissions."
      }
    ],
    "example": "#[derive(serde::Deserialize)]\nstruct User {\n    #[serde(rename = \"userId\")]\n    user_id: i64,\n    tags: Vec<String>,\n}",
    "question": "Why use serde rename instead of changing the JSON key?",
    "answer": "The attribute keeps Rust naming conventions while preserving the external API format. It avoids silently inventing a different wire contract.",
    "source": "https://serde.rs/field-attrs.html",
    "tool": "json-to-rust",
    "date": "2026-11-03"
  },
  {
    "slug": "serde-optional-null-missing",
    "title": "Missing vs Null in Serde: What Option<T> Preserves",
    "description": "Understand how optional Rust fields handle absent keys, explicit null, default attributes and serialized output.",
    "intro": "An absent property and a property whose value is null are different JSON states. A typical Rust Option field intentionally combines them into None during deserialization. That is convenient for many response models, but it can lose information needed by patch requests and update APIs.",
    "sections": [
      {
        "heading": "Decide whether two states are enough",
        "body": "For a profile response, a missing nickname and a null nickname may both mean there is no display nickname. For an update request, missing can mean leave the value unchanged while null means clear it. A model that stores only Option<String> cannot remember which of those two inputs produced None. Define the update semantics before reusing a response struct as a request model."
      },
      {
        "heading": "Keep defaulting and output omission separate",
        "body": "The serde default attribute describes what to do when input is missing. A skip_serializing_if attribute describes whether to emit a field when writing output. These are independent choices. Our generator emits defaults and skips None fields in output, so round-tripping a null field can produce an absent field. That behavior is documented rather than presented as a lossless preservation of JSON syntax."
      },
      {
        "heading": "Test all relevant presence cases",
        "body": "Keep fixtures for a missing key, an explicit null, and a real value. If the distinction matters, use a deliberate presence wrapper or custom deserialization strategy and verify it against each fixture. Simply adding another nested Option does not guarantee the intended three-state contract without the right deserializer. Review how validation errors and serialized requests appear to the receiving service as well."
      }
    ],
    "example": "{}\n{\"nickname\":null}\n{\"nickname\":\"Ada\"}\n\n// A conventional Option<String> model maps the first two to None.",
    "question": "Does skip_serializing_if change what a parser accepts?",
    "answer": "It controls serialization output. Input acceptance and missing-field behavior are separate deserialization decisions.",
    "source": "https://serde.rs/field-attrs.html",
    "tool": "json-to-rust",
    "date": "2026-11-03"
  },
  {
    "slug": "typescript-types-vs-runtime-validation",
    "title": "TypeScript Types vs Runtime Validation at API Boundaries",
    "description": "Learn why TypeScript interfaces do not validate network data and how to parse unknown input with a runtime schema.",
    "intro": "TypeScript helps check code while it is developed, but a server response arrives as runtime data. A type assertion changes the compiler’s view of a value without inspecting that value. Treat data from APIs, files and form submissions as unknown until the checks required by your application have run.",
    "sections": [
      {
        "heading": "Recognize the boundary a type assertion skips",
        "body": "Casting an API response to User does not verify that id exists or that name is a string. A response can change after a deployment, an error page can replace the expected payload, or a stored record can contain older fields. Keep the transport step separate from parsing: check HTTP success, decode the response, and validate the decoded value before handing it to typed application logic."
      },
      {
        "heading": "Make parsing failure a normal outcome",
        "body": "A schema parser can return a structured success or failure result. Handle the failure path where your application has enough context to show a useful message or record a diagnostic. Avoid logging entire private payloads just to understand a type mismatch. Prefer field paths and concise errors, and decide whether unknown keys should be rejected, stripped or intentionally retained."
      },
      {
        "heading": "Generate a starting point, then define the contract",
        "body": "Our JSON-to-Zod generator infers types from samples, so it can save repetitive typing. It cannot discover business rules such as a positive quantity, a permitted role, or a date that must follow another date. Add those constraints explicitly and keep tests for valid and invalid inputs. Inferred TypeScript types then describe the parser’s accepted output, reducing drift between validation code and application types."
      }
    ],
    "example": "import { z } from \"zod\";\nconst userSchema = z.object({ id: z.number(), name: z.string() });\nconst result = userSchema.safeParse(payload);\nif (!result.success) { /* handle validation errors */ }",
    "question": "Does the as keyword validate a value?",
    "answer": "No. A type assertion affects static checking and adds no runtime inspection of the asserted value.",
    "source": "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions",
    "tool": "json-to-zod",
    "date": "2026-11-03"
  },
  {
    "slug": "infer-zod-schema-from-json",
    "title": "Generate a Zod Schema from JSON Without Overfitting Samples",
    "description": "Infer nested Zod objects, arrays, unions, optional keys and null values, then refine the schema for your application.",
    "intro": "A JSON sample is useful evidence about an API, but it is not a complete specification. One record may omit a rare field or show only one member of a broader union. A schema generator should preserve what was observed and make uncertain areas visible instead of fabricating constraints.",
    "sections": [
      {
        "heading": "Use varied records to reveal optional keys",
        "body": "If a key is present in every observed object, the generated object schema requires it. If it is absent from some records, the field becomes optional. An explicit null adds a null alternative without making the key absent. These cases matter when validating update payloads. Include realistic records with empty strings, false, zero, null and missing keys rather than relying on one fully populated example."
      },
      {
        "heading": "Review empty arrays and mixed elements",
        "body": "An empty list provides no element-type information, so the tool uses an unknown element schema. Mixed samples produce unions, and object elements are merged into a shared shape. That merge does not infer correlations between fields. If the API uses a discriminator such as kind, define the separate variants manually and validate the relationship between kind and the remaining fields."
      },
      {
        "heading": "Choose your unknown-key policy deliberately",
        "body": "Strict object schemas reject keys outside the model. Standard object parsing normally strips unrecognized keys. Either choice can be appropriate, depending on whether the input is a tightly controlled command or a response that may gain harmless fields. The generated code does not coerce strings into numbers or infer email and timestamp formats from appearance. Add those decisions only when the documented contract supports them."
      }
    ],
    "example": "// Missing name differs from explicit null:\nz.object({ name: z.string().optional() });\nz.object({ name: z.union([z.string(), z.null()]) });",
    "question": "Why does an empty array use z.unknown()?",
    "answer": "There is no observed element to infer from. Replace that placeholder with the documented item schema before relying on it as a contract.",
    "source": "https://zod.dev/api",
    "tool": "json-to-zod",
    "date": "2026-11-03"
  },
  {
    "slug": "css-clamp-formula",
    "title": "CSS clamp() Formula: Calculate Fluid Font Sizes from Two Points",
    "description": "Derive the rem and vw terms in a CSS clamp declaration using font-size and viewport endpoints, with a worked calculation.",
    "intro": "A fluid type formula connects two design decisions: a font size at a narrow viewport and a larger size at a wide viewport. Between them, the preferred size follows a straight line. The clamp bounds keep it from growing outside the intended range.",
    "sections": [
      {
        "heading": "Find the slope and intercept",
        "body": "For a font that grows from 16px at 320px viewport width to 32px at 1280px, the slope is 16 divided by 960, or one sixtieth. The line’s intercept is the starting size minus the slope multiplied by the starting width: approximately 10.6667px. A vw unit represents one percent of viewport width, so multiply the slope by 100 to obtain approximately 1.6667vw."
      },
      {
        "heading": "Convert the root-relative terms consistently",
        "body": "At a 16px root, the bounds become 1rem and 2rem and the intercept becomes approximately 0.6667rem. Put the intercept and viewport contribution inside calc for readability. Keep enough decimal precision to avoid visible endpoint drift. If the root size changes, rem terms change while the viewport contribution follows viewport width; the original pixel checkpoints were calculated for the supplied root assumption."
      },
      {
        "heading": "Verify the middle as well as both ends",
        "body": "At the midpoint viewport of 800px, the preferred size should be 24px under that same root assumption. Below the lower width it stops at the minimum, and above the upper width it stops at the maximum. Test the actual page under zoom and text resizing, especially for long headings and fixed-height controls. A mathematically correct formula does not guarantee that every layout container can accommodate enlarged text."
      }
    ],
    "example": "font-size: clamp(1rem, calc(0.66666667rem + 1.66666667vw), 2rem);\n/* 320px → 16px, 800px → 24px, 1280px → 32px at a 16px root */",
    "question": "Can I use identical minimum and maximum sizes?",
    "answer": "Yes. That produces a constant size. A reversed viewport range is invalid because the two interpolation points would not define the intended interval.",
    "source": "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/clamp",
    "tool": "css-clamp-calculator",
    "date": "2026-11-03"
  },
  {
    "slug": "robots-txt-vs-noindex",
    "title": "robots.txt vs noindex: Crawling and Search Visibility",
    "description": "Choose between crawler access rules, noindex instructions and authentication without accidentally hiding the directive from the crawler.",
    "intro": "Crawling and indexing are related but separate decisions. robots.txt controls access for cooperating crawlers, while noindex instructs a supported search engine not to retain a page in its results. Authentication controls who can actually read private content. Choose the mechanism that matches the outcome you need.",
    "sections": [
      {
        "heading": "Use crawler rules for crawl access",
        "body": "A disallowed URL can still be discovered through links. Blocking the crawl does not reliably erase the URL from search results and does not prevent a browser or an uncooperative client from requesting it. Avoid listing secret route names in a public robots file as a substitute for access control. Keep private applications behind real authentication and authorization checks."
      },
      {
        "heading": "Let the crawler see an indexing instruction",
        "body": "A noindex directive can be placed in supported page metadata or an HTTP response header. The crawler must be able to retrieve the resource to read it. If you disallow the same URL in robots.txt, the search engine may be unable to observe the new directive. Check what the deployed response contains, rather than assuming a template change reached every cached page."
      },
      {
        "heading": "Apply a page-specific policy before publishing",
        "body": "Account pages, internal search results and public documentation do not necessarily need the same search policy. Record the intended treatment of each class of URL and verify it after deployment. Our robots generator creates a draft crawler file only; it does not add noindex tags or protect routes. Use the site’s actual metadata and HTTP configuration to implement those separate requirements."
      }
    ],
    "example": "<!-- On a crawlable HTML page that should not be indexed: -->\n<meta name=\"robots\" content=\"noindex, follow\">\n\n# A robots.txt Disallow is a different crawler-access instruction.",
    "question": "Should I disallow a page to make its noindex stronger?",
    "answer": "That can prevent the crawler from seeing noindex. Keep the instruction accessible when it is the mechanism you rely on.",
    "source": "https://developers.google.com/search/docs/crawling-indexing/block-indexing",
    "tool": "robots-txt-generator",
    "date": "2026-11-03"
  },
  {
    "slug": "robots-txt-common-mistakes",
    "title": "Robots.txt Mistakes: Root Placement, Paths and Staging Rules",
    "description": "Review crawler policy mistakes involving file location, path case, staging block rules, sitemap directives and rendering assets.",
    "intro": "A short robots file can affect a large part of a site. The most useful review starts with deployment scope: which host serves the file, which path rules it contains, and whether the version you inspected is the version crawlers receive. Generate a draft, then verify the live response before treating the policy as complete.",
    "sections": [
      {
        "heading": "Check the host and root location",
        "body": "Publish the file at the host’s root robots.txt path. A file inside an application subdirectory is not a general replacement for the root crawler policy. Paths are case-sensitive, so a rule copied from a differently cased route can miss its target. Use root-relative paths and an absolute URL for the sitemap directive. A sitemap reference helps discovery but does not override a disallowed path."
      },
      {
        "heading": "Keep staging policies out of production",
        "body": "A staging file that disallows the root can be copied during a release. Include robots review in the deployment checklist and verify the actual public host after switching traffic. Also check whether CSS, JavaScript or image paths needed to render public pages were accidentally covered by broad rules. A crawler needs the relevant resources to interpret the page as intended."
      },
      {
        "heading": "Inspect policy rather than adding unsupported directives",
        "body": "Crawler implementations differ, and arbitrary custom directives do not become effective simply because they appear in a text file. Our generator writes a single conventional user-agent group and an optional sitemap URL. It rejects malformed paths instead of treating them as comments or additional lines. It does not certify the entire crawl policy; test representative allowed and disallowed routes and review the crawler’s own documented matching rules."
      }
    ],
    "example": "User-agent: *\nDisallow: /admin/\nDisallow: /preview/\n\nSitemap: https://example.com/sitemap.xml",
    "question": "Does a sitemap directive make all listed URLs crawlable?",
    "answer": "No. Sitemap discovery and crawl-access rules are separate. Resolve disallowed canonical pages intentionally rather than expecting the sitemap to override the policy.",
    "source": "https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec",
    "tool": "robots-txt-generator",
    "date": "2026-11-03"
  },
  {
    "slug": "sql-in-null-empty-list",
    "title": "SQL IN and NOT IN: NULL, Empty Lists and Parameters",
    "description": "Understand three-valued SQL logic, why NOT IN with null can remove expected rows, and how to handle an empty lookup list.",
    "intro": "A small list predicate can produce surprising results when null enters the comparison. SQL does not treat null as an ordinary value, and an empty application list does not automatically translate into a portable IN () expression. Define those cases before generating a query.",
    "sections": [
      {
        "heading": "Keep null separate from the string NULL",
        "body": "The text value \"NULL\" is a string, while SQL NULL represents an unknown or absent value. Comparing a null column through an ordinary IN predicate does not make it match a null member as if they were equal. If the product requirement includes null rows, express that with an explicit IS NULL condition and test the full predicate with parentheses."
      },
      {
        "heading": "Be careful with NOT IN and unknown results",
        "body": "When a NOT IN list or subquery includes null, a nonmatching comparison can evaluate to unknown instead of true. A WHERE clause keeps true rows, so records may disappear from the output unexpectedly. For exclusion logic, consider a correctly correlated NOT EXISTS query and define how null keys should behave. Do not change operators without checking the intended matching semantics."
      },
      {
        "heading": "Handle empty application lists explicitly",
        "body": "For an inclusion filter, an empty set often means match no rows, so a constant FALSE predicate is a clear result. For an exclusion filter it may mean impose no restriction, which is a different decision. Our generator produces inclusion predicates only. In application code, bind values with the database driver; the PostgreSQL parameter output gives placeholder order and the corresponding string array without executing SQL."
      }
    ],
    "example": "-- Explicitly include null column values when that is intended:\nWHERE customer_id IN ($1, $2) OR customer_id IS NULL\n\n-- Empty inclusion list:\nWHERE FALSE",
    "question": "Does putting NULL inside IN match a null column?",
    "answer": "Not as ordinary equality. Use an explicit IS NULL condition when null rows are part of the intended result.",
    "source": "https://www.postgresql.org/docs/current/functions-comparisons.html",
    "tool": "sql-in-clause-generator",
    "date": "2026-11-03"
  },
  {
    "slug": "png-jpeg-webp-comparison",
    "title": "PNG vs JPEG vs WebP: Choose a Web Image Format",
    "description": "Compare transparency, photo compression, graphic edges and re-encoding behavior when choosing PNG, JPEG or WebP.",
    "intro": "The best image format depends on the image and the job it must do. A photograph, a transparent logo and a screenshot with tiny text respond differently to compression. Compare the actual exported result at the dimensions it will be displayed, instead of choosing a format solely by its extension.",
    "sections": [
      {
        "heading": "Match the format to the source content",
        "body": "PNG provides lossless pixel encoding and supports alpha transparency, making it useful for flat graphics and sharp text. JPEG is commonly used for photographs and trades information for a smaller representation. WebP supports efficient still-image delivery and transparency. Browser canvas encoders expose particular modes and quality controls; a tool’s available options do not describe every feature supported by the file format itself."
      },
      {
        "heading": "Flatten transparency deliberately for JPEG",
        "body": "JPEG has no alpha channel. A transparent logo needs a chosen background when converted, and this site’s converter uses white. Check edge pixels for halos on the final page background. Changing a file extension alone does not convert the image, and turning a previously compressed JPEG into PNG does not recover the detail already discarded by the earlier encoding."
      },
      {
        "heading": "Measure dimensions and bytes separately",
        "body": "A format conversion keeps dimensions in our converter, while the resizer changes pixel dimensions and the compressor exposes lossy quality settings. Already optimized sources can grow after another encoding, so inspect the reported byte counts. Canvas exports also omit source metadata and animation. Keep an original source file and choose a separate delivery derivative for each practical display size."
      }
    ],
    "example": "Transparent icon → PNG or WebP\nPhoto delivery → compare JPEG and WebP exports\nTiny screenshot text → inspect lossless PNG before choosing lossy output",
    "question": "Does WebP always produce a smaller file?",
    "answer": "No. Content, dimensions, source encoding and encoder settings all affect the result. Compare actual exported byte counts.",
    "source": "https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types",
    "tool": "image-format-converter",
    "date": "2026-11-03"
  },
  {
    "slug": "verify-download-checksum",
    "title": "How to Verify a Download with a SHA-256 Checksum",
    "description": "Hash exact file bytes, compare a trusted release digest and troubleshoot mismatches without confusing checksums with publisher signatures.",
    "intro": "A checksum identifies the bytes of a file. It can reveal an incomplete download, a changed archive or an unexpected release artifact. Its usefulness depends on the expected digest: you need a value tied to the exact file version through a channel you trust.",
    "sections": [
      {
        "heading": "Compare the file, not its displayed contents",
        "body": "Select the downloaded binary exactly as received. Hashing a filename, copying text out of a document, or extracting an archive first computes a digest for something else. A browser file-checksum calculator reads the bytes and presents a hexadecimal result. Uppercase and lowercase hexadecimal digits represent the same digest; the byte sequence being hashed must still match exactly."
      },
      {
        "heading": "Interpret a mismatch before retrying blindly",
        "body": "Check the release version, operating system, architecture and packaging variant. A .zip and a .tar.gz of similar contents have different bytes and therefore different hashes. An error page downloaded under an archive filename also produces a valid digest for the wrong content. Confirm the final response and file size, then compare the relevant release artifact again."
      },
      {
        "heading": "Know the authenticity boundary",
        "body": "A matching checksum establishes agreement with the supplied expected digest. If an attacker can replace both the download and the expected value, that comparison alone does not establish the publisher’s identity. Use the release’s documented signature or trusted distribution process where authenticity matters. Our tool calculates SHA-256, SHA-384 and SHA-512 locally and can compare one expected hexadecimal digest without sending the file to a conversion service."
      }
    ],
    "example": "1. Obtain the expected SHA-256 from the intended release.\n2. Select the exact downloaded file.\n3. Compare all 64 hexadecimal digits.\n4. Investigate any mismatch before using the artifact.",
    "question": "Can a matching digest tell me who published a file?",
    "answer": "A checksum alone does not prove publisher identity. Its trust comes from how the expected digest or signed release metadata was obtained.",
    "source": "https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest",
    "tool": "file-checksum",
    "date": "2026-11-03"
  },
  {
    "slug": "read-har-network-requests",
    "title": "How to Read a HAR File and Find Slow Network Requests",
    "description": "Read a HAR export, identify slow or failed requests, and distinguish response body size from page-load timing.",
    "intro": "A HAR file is a JSON record of network activity captured during a browser session. It is useful when a page feels slow on another machine or an API request fails intermittently. Start by identifying the capture window and the action being recorded. A log from initial navigation answers a different question from a log captured after a button click. Our local analyzer produces a shortlist for investigation without replaying requests or contacting the captured hosts.",
    "sections": [
      {
        "heading": "Capture a useful reproduction",
        "body": "Open the browser Network panel before reproducing the problem. Decide whether preserving navigation requests or disabling the browser cache matches the issue you want to investigate. Repeat the exact action once and export the relevant requests. Browser exports may offer sanitized and sensitive variants, but even sanitized URLs can contain identifiers in paths or queries. Review the file before sharing it with a colleague. A minimal capture makes it easier to connect each request with the user action that triggered it."
      },
      {
        "heading": "Rank requests without summing overlapping time",
        "body": "Inspect request URLs, methods, response statuses and recorded durations. A long duration identifies a candidate, not automatically the cause of the visible delay. Requests run concurrently, and some resources are fetched after the main content is already usable. Adding all durations therefore does not produce a meaningful page-load duration. Use the DevTools waterfall and its dependency information to establish which requests block the interaction. Compare failed statuses with application behavior, since a deliberately missing resource and a failed essential API call have different consequences."
      },
      {
        "heading": "Interpret size fields and missing measurements",
        "body": "HAR bodySize records response-body bytes when the exporter knows them; negative values indicate unavailable measurements. That field is not a complete transfer-cost measurement. Headers, compression, caching and exporter behavior can change what a capture reports. Our analyzer totals known nonnegative body sizes and reports how many sizes are unknown. It removes credentials, queries and fragments from report URLs, but a path can still be sensitive. Keep the original capture available locally when deeper timing or header inspection is required."
      }
    ],
    "example": "{\"request\":{\"method\":\"GET\",\"url\":\"https://example.com/api/users\"},\n \"response\":{\"status\":503,\"bodySize\":120},\"time\":850}",
    "question": "Does the slowest request always explain a slow page?",
    "answer": "No. A request may run in parallel or after the visible interaction completes. Check its dependency and timing in the waterfall before treating it as the bottleneck.",
    "source": "https://developer.chrome.com/docs/devtools/network/reference/",
    "tool": "har-analyzer",
    "date": "2026-11-06"
  },
  {
    "slug": "cache-control-no-cache-no-store",
    "title": "Cache-Control: no-cache vs no-store vs max-age",
    "description": "Understand cache storage, revalidation and freshness, with concrete examples for HTML, private responses and versioned assets.",
    "intro": "Cache-Control describes how a response may be stored and reused. Confusion usually starts with the name no-cache: it does not simply mean that a response must never be stored. Separate two questions before changing a policy. May a cache retain the representation, and under what conditions may it reuse that representation? The distinction makes deployment troubleshooting much easier than adding every directive that appears to mention freshness.",
    "sections": [
      {
        "heading": "Separate storage permission from reuse",
        "body": "A response with no-store instructs caches not to store it. A response with no-cache may be retained, but reuse requires successful validation with the origin. When validators such as an ETag are available, that validation can result in a small 304 response instead of transferring the representation again. These directives serve different purposes. Review the sensitivity of the response and the desired reuse behavior rather than assuming their names are interchangeable. Also remember that a newly delivered directive does not magically delete every previously stored copy."
      },
      {
        "heading": "Use freshness for resources with a clear lifetime",
        "body": "A max-age value specifies a freshness lifetime in seconds. It does not mean the browser must download the resource after precisely that wall-clock interval; it controls whether a stored response is considered fresh for reuse. Versioned static assets can often tolerate a long freshness lifetime because a content change produces a different URL. Frequently changing HTML may instead require revalidation. Shared-cache rules such as s-maxage and private require additional attention when a CDN sits between the browser and origin."
      },
      {
        "heading": "Verify the actual response path",
        "body": "Inspect the response received by the browser, including Age and Vary when present. A CDN, reverse proxy or framework can add or replace the origin header, so editing one configuration file may not change the final policy. Avoid contradictory duplicate directives and test both a fresh navigation and a subsequent request. Our parser separates directives and flags malformed age values, but cannot determine the complete effective policy from one header string. Request context, status, validators and the behavior of the caches in the path still matter."
      }
    ],
    "example": "HTML requiring validation:\nCache-Control: no-cache\n\nResponse that must not be stored:\nCache-Control: no-store\n\nVersioned asset freshness:\nCache-Control: public, max-age=31536000",
    "question": "Does max-age=0 mean the same thing as no-store?",
    "answer": "No. A zero freshness lifetime makes a stored response immediately stale; it does not itself prohibit storage.",
    "source": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control",
    "tool": "cache-control-parser",
    "date": "2026-11-06"
  },
  {
    "slug": "openapi-paths-operations",
    "title": "OpenAPI Paths and Operations: Build an Endpoint Inventory",
    "description": "Extract an API endpoint list from OpenAPI JSON without confusing path metadata, references or HTTP operations.",
    "intro": "An API inventory should identify each supported method and path together. GET /users and POST /users are separate operations even though they share a resource path. OpenAPI puts these definitions under the paths object, alongside path-level metadata and sometimes references. A small operation list helps reviewers navigate a large description, but it should retain enough context to avoid overstating what has actually been resolved.",
    "sections": [
      {
        "heading": "Treat a method and path as one operation",
        "body": "Walk each path item and inspect its HTTP method fields. Keep the method, exact templated path, operation identifier, summary, tags and deprecation marker. A parameters array at the path level is shared configuration rather than an additional endpoint. Likewise, a summary or vendor extension is not an operation. Preserve path templates such as /users/{id} instead of replacing them with an example identifier. The inventory should describe the API contract, not a single observed request."
      },
      {
        "heading": "Handle referenced definitions explicitly",
        "body": "A path item may refer to a definition elsewhere. Reading only its local properties can therefore miss operations. Our extractor lists unresolved path references instead of fetching remote documents or pretending that the inventory is complete. It also excludes callbacks and webhooks from the paths inventory. If you need a complete dependency-resolved description, use a dedicated OpenAPI processor with an explicit reference-resolution policy, then inspect its resulting document. Resolving references is a separate task from collecting visible method entries."
      },
      {
        "heading": "Use the inventory as a review aid",
        "body": "Compare the extracted list with the intended migration or release scope. Deprecated operations can be prioritized for client review, while missing operation identifiers may make generated clients less convenient. An operation list does not establish whether authentication, response schemas or parameters are correct. Keep the full source document alongside the report and validate it with tooling appropriate to its OpenAPI version. Our extractor accepts JSON documents; convert YAML carefully before use and retain meaningful string values and reference paths."
      }
    ],
    "example": "{\"openapi\":\"3.1.0\",\"paths\":{\"/users\":{\"get\":{\"operationId\":\"listUsers\"},\"post\":{\"operationId\":\"createUser\"}}}}\n\nInventory: GET /users; POST /users",
    "question": "Does an empty inventory prove that an API has no operations?",
    "answer": "No. The document may use unresolved references or describe other features outside the inspected paths. Check the source and the extractor’s unresolved-reference report.",
    "source": "https://spec.openapis.org/oas/v3.0",
    "tool": "openapi-operation-extractor",
    "date": "2026-11-06"
  },
  {
    "slug": "read-email-received-headers",
    "title": "How to Read Email Received Headers Without Trusting Every Claim",
    "description": "Unfold message headers, understand Received order and separate raw trace information from verified sender authentication.",
    "intro": "The visible sender name in an email application is only a small part of the message source. Raw headers include addressing fields, trace entries and authentication-related claims. Reading those fields helps investigate delivery problems, but parsing text is different from establishing trust. Start with the original header block supplied by your mailbox provider and preserve the ordering of repeated fields before trying to draw conclusions.",
    "sections": [
      {
        "heading": "Unfold wrapped fields before reading them",
        "body": "Internet message headers can continue onto following lines that begin with a space or tab. Those lines belong to the preceding field rather than representing new headers. A parser unfolds them to make the value easier to inspect. Stop at the empty line that separates the header block from the message body. Preserve repeated fields instead of merging them into a single map entry: doing so would lose the order and potentially discard information needed to understand a relay chain."
      },
      {
        "heading": "Read relay order with a trust boundary",
        "body": "Received fields are typically prepended by receiving systems, so the newest entry appears first. Reading downward moves toward earlier claimed hops. However, a sender can place misleading fields into a message before it reaches trusted infrastructure. Identify which entries were added by systems you trust before accepting a route or timing claim. Do not infer a verified geographic origin from a hostname alone. Our parser retains the raw order and makes no claim that the route or timestamps are authentic."
      },
      {
        "heading": "Keep authentication and interpretation separate",
        "body": "From, Return-Path and Authentication-Results answer different questions. A raw Authentication-Results value is useful only when you know which trusted system produced it and how your provider treats upstream fields. The local parser does not run SPF, DKIM or DMARC checks, decode encoded words or contact mail servers. It simply exposes unfolded field values. Before sharing a report, remove addresses, identifiers and other private details. For a delivery investigation, combine the parsed view with your provider’s trusted diagnostics and the actual received message."
      }
    ],
    "example": "Received: from relay.example by mx.example.net;\n Tue, 3 Nov 2026 10:00:00 +0000\nReceived: from client.example by relay.example;\n Tue, 3 Nov 2026 09:59:58 +0000",
    "question": "Can a parsed From field prove who sent a message?",
    "answer": "No. It is an asserted message field. Authentication depends on trusted verification and context outside simple header parsing.",
    "source": "https://www.rfc-editor.org/rfc/rfc5322",
    "tool": "email-header-parser",
    "date": "2026-11-06"
  },
  {
    "slug": "curl-post-json-command",
    "title": "How to Build a cURL POST Request with a JSON Body",
    "description": "Construct a reproducible cURL JSON request, quote POSIX shell arguments and keep headers, method and body behavior explicit.",
    "intro": "A short cURL command is often the fastest way to share a reproducible API request. It also passes through two independent parsers: your shell first, then cURL. JSON punctuation, apostrophes in values and special URL characters can therefore break an otherwise valid example. Build the command from explicit arguments, keep the intended shell in mind and review the final request before running it.",
    "sections": [
      {
        "heading": "Specify the URL, headers and payload deliberately",
        "body": "For a JSON API example, provide the target HTTP method, an absolute URL, a Content-Type header when appropriate, and the exact JSON text you want to send. A header does not validate or transform the body into JSON. Check the body independently before testing the API. Our builder accepts headers as a JSON object of string values and puts the body in a raw-data argument. It generates a command only; it does not contact the URL or reveal how the server will respond."
      },
      {
        "heading": "Quote for the shell that will run the command",
        "body": "POSIX single quotes protect most characters from shell expansion. A literal apostrophe requires ending the quoted segment, emitting that apostrophe through a different quoted segment and resuming the original quoting. This detail matters for names such as O’Connor when an ASCII apostrophe is present. The generated command targets shells such as sh and bash. PowerShell and Windows cmd have different parsing rules, so do not assume that a command copied from a POSIX example is directly portable."
      },
      {
        "heading": "Know why raw data and explicit URL options help",
        "body": "A data-raw argument avoids interpreting a leading at sign as a filename. The globoff option prevents cURL from treating braces or square brackets in the URL as URL-globbing patterns. An explicit URL option also makes the argument’s purpose clear. These choices improve reproducibility without making an arbitrary request safe to run. Commands can contain credentials in headers or bodies and can change remote data. Keep real tokens out of documentation and terminal history, and use a nonproduction endpoint for experiments when possible."
      }
    ],
    "example": "curl --globoff --request 'POST' --url 'https://example.com/api/users' --header 'Content-Type: application/json' --data-raw '{\"name\":\"Ada\"}'",
    "question": "Does Content-Type: application/json make an invalid body valid JSON?",
    "answer": "No. It declares the representation type. You must still construct valid JSON and satisfy the receiving API’s schema.",
    "source": "https://curl.se/docs/manpage.html",
    "tool": "curl-command-builder",
    "date": "2026-11-06"
  },
  {
    "slug": "sql-bind-placeholder-styles",
    "title": "SQL ? vs $1 Parameters: Convert Placeholders Without Reordering Values",
    "description": "Understand anonymous and numbered SQL parameters, repeated bindings and why string replacement is unsafe around literals and comments.",
    "intro": "SQL parameter markers are part of the interface between a query and a database driver. Some drivers use anonymous question marks; PostgreSQL commonly uses numbered markers such as $1. Changing marker syntax can appear trivial until a query contains repeated parameters, a question mark in a string or a database-specific operator. Treat conversion as a template transformation and keep value binding separate from the SQL text.",
    "sections": [
      {
        "heading": "Count occurrences and parameter identities separately",
        "body": "In a question-mark template, each marker normally consumes the next bound value. In a numbered template, the same parameter can appear more than once. Converting WHERE a = $2 OR b = $2 to anonymous markers creates two occurrences that both need the original second value. The converter therefore returns an occurrence-based parameter-order list in the numbered-to-anonymous direction. Use that list to build the destination bindings rather than copying the original array unchanged."
      },
      {
        "heading": "Preserve quoted SQL and comments",
        "body": "A question mark inside a quoted string is data, not a parameter. Marker-like text may also appear in quoted identifiers, line comments, block comments or PostgreSQL dollar-quoted strings. A lexical converter must skip those regions rather than applying a global replacement. Our tool recognizes these common forms and rejects unclosed quoted regions. It is still not a full parser for every SQL dialect. Database-specific quoting extensions and ambiguous operator syntax require review before the transformed query is used."
      },
      {
        "heading": "Do not confuse placeholders with escaped values",
        "body": "The generated SQL should still be passed to a database driver together with a separate binding collection. This tool never inserts values, executes a query or establishes that a query is valid for the destination server. PostgreSQL question-mark JSON operators are particularly ambiguous when interpreting question marks as source placeholders; provide a prepared-statement template without those operators. After conversion, test a query with representative values through the actual driver and verify both the result and the binding count."
      }
    ],
    "example": "Input:  SELECT * FROM t WHERE a = $2 OR b = $2 AND c = $1;\nOutput: SELECT * FROM t WHERE a = ? OR b = ? AND c = ?;\nParameter order: [2, 2, 1]",
    "question": "Can I replace every question mark with an incrementing parameter number?",
    "answer": "Only for a restricted template where every unquoted question mark is a bind marker. Literals, comments and JSON operators make unrestricted replacement unreliable.",
    "source": "https://www.postgresql.org/docs/current/sql-syntax-lexical.html",
    "tool": "sql-placeholder-converter",
    "date": "2026-11-06"
  },
  {
    "slug": "csv-to-ndjson-preserve-text",
    "title": "CSV to NDJSON: Preserve Leading Zeros and Multiline Cells",
    "description": "Export CSV records as JSON Lines without guessing cell types or breaking quoted delimiters, embedded newlines and identifiers.",
    "intro": "A CSV file stores a table but usually provides no reliable type schema. Converting it to newline-delimited JSON is useful for record-oriented processing, yet automatic type guesses can change the data. A customer code such as 001 is not necessarily the number one, and a date-looking string may be a label. Start by choosing a preservation policy, then frame each resulting object as one complete JSON line.",
    "sections": [
      {
        "heading": "Parse cells before constructing objects",
        "body": "The first row supplies property names, and every following row must contain the same number of cells. A comma inside a quoted cell is not a separator, and a quoted line break is not a new record. Use a parser that handles those cases rather than splitting on commas and newlines. Duplicate header names must be rejected because a JSON object cannot retain two distinct values under the same property name without changing the representation. Empty headers also need an explicit decision rather than an accidental generated name."
      },
      {
        "heading": "Keep source strings until a schema says otherwise",
        "body": "Our converter preserves every cell as a string, including empty cells, leading-zero identifiers, booleans and date-looking values. That policy avoids silently turning a code into a number or applying a locale-specific date interpretation. If your receiving pipeline requires numbers or nulls, apply a separate schema-aware transformation afterward and validate it. This makes the point where a type decision occurs visible and testable. Spreadsheet applications may already have modified the source values before export, so inspect the actual file rather than only its displayed cells."
      },
      {
        "heading": "Keep record framing distinct from embedded newlines",
        "body": "Each output object is serialized without pretty-printing and placed on its own physical line. A line break inside a string becomes a JSON escape sequence, preserving the value without breaking NDJSON framing. A final newline is included for text-processing convenience. The browser converter processes the complete input in memory and bounds the number of data cells; it is not a streaming system. For large production imports, use a streaming parser and record errors with original row positions instead of silently discarding malformed input."
      }
    ],
    "example": "CSV:\nid,note\n001,\"hello, team\"\n\nNDJSON:\n{\"id\":\"001\",\"note\":\"hello, team\"}\n",
    "question": "Should empty CSV cells become null?",
    "answer": "Only if your import contract explicitly says so. An empty string and JSON null carry different meanings; the converter preserves the empty string.",
    "source": "https://www.rfc-editor.org/rfc/rfc4180",
    "tool": "csv-to-json-lines",
    "date": "2026-11-06"
  },
  {
    "slug": "exact-fraction-arithmetic",
    "title": "Exact Fraction Arithmetic: Add and Simplify Without Decimal Rounding",
    "description": "Calculate rational sums and products using integer numerators, denominators and greatest common divisors instead of rounded decimals.",
    "intro": "A repeating decimal is an approximation of a rational value, while a fraction can represent that value exactly. For example, one third plus one sixth is exactly one half even though writing each input as a short decimal introduces rounding. Integer fraction arithmetic makes the exact relationship visible and gives a clean way to distinguish a mathematical result from a convenient decimal display.",
    "sections": [
      {
        "heading": "Use a common denominator for addition",
        "body": "To add a/b and c/d, compute (ad + cb)/(bd). Subtraction changes the plus to minus. The product bd is a valid common denominator even when it is not the least common multiple, because the result can be reduced afterward. Normalize signs so the denominator stays positive and keep zero denominators invalid. Our calculator uses integer inputs and exact BigInt operations for these steps, avoiding a hidden decimal approximation during the calculation."
      },
      {
        "heading": "Reduce with the greatest common divisor",
        "body": "After computing the numerator and denominator, divide both by their greatest common divisor. This leaves the value unchanged and produces a simplified fraction. Multiplication uses ac/bd; division uses ad/bc and must reject a zero divisor. Zero results normalize to a denominator of one. Very large exact arithmetic can be expensive, so the tool bounds each input integer to fifty digits. That is a deliberate input limit, not an implication that browser memory or computation is unlimited."
      },
      {
        "heading": "Label the decimal as a separate approximation",
        "body": "The displayed numerator and denominator are exact integer strings. The decimal field uses ordinary floating-point conversion and may round a recurring value or a large ratio. Use the fraction fields when preserving exactness matters, and choose a rounding rule only when preparing a final decimal representation. Mixed-number and decimal input syntax are not accepted by this tool; convert them to integer fractions first. When comparing results, compare reduced rational values rather than assuming two rounded decimal strings prove equality."
      }
    ],
    "example": "1/3 + 1/6\n= (1×6 + 1×3) / (3×6)\n= 9/18\n= 1/2",
    "question": "Is the decimal result exact whenever the fraction is exact?",
    "answer": "No. The fraction is exact, but its decimal display is a separate floating-point approximation and can round.",
    "source": "https://docs.python.org/3/library/fractions.html",
    "tool": "fraction-calculator",
    "date": "2026-11-06"
  },
  {
    "slug": "unix-seconds-vs-milliseconds",
    "title": "Unix Timestamp Seconds vs Milliseconds: Avoid the 1970 Date Bug",
    "description": "Identify timestamp units explicitly, convert batches to UTC and diagnose dates near 1970 caused by a thousandfold unit mismatch.",
    "intro": "A timestamp is incomplete without its unit. Unix time is often expressed in seconds, while JavaScript Date expects milliseconds when constructed from a number. Passing a seconds value directly to that constructor shrinks the intended interval by a factor of one thousand and often produces a date near 1970. The reverse mistake pushes a value far into the future. Confirm the producing system’s contract before converting a log column.",
    "sections": [
      {
        "heading": "Convert the unit before constructing the date",
        "body": "Multiply integer seconds by one thousand to obtain milliseconds, then interpret that value as an instant relative to the Unix epoch. Millisecond inputs need no multiplication. Choose the unit explicitly instead of relying on the familiar ten-digit or thirteen-digit appearance of recent timestamps. Historical values, negative values and distant future dates break that heuristic. Our batch converter records the selected unit next to each original input so the report remains understandable after it is copied elsewhere."
      },
      {
        "heading": "Keep UTC instants separate from local display",
        "body": "A numeric Unix timestamp represents an instant, not a regional wall-clock date with an attached time zone. The same instant can be displayed as different local dates or clock times in different regions. The converter returns ISO UTC strings ending in Z to make its display convention clear. If you need a local calendar interpretation, convert that instant using an explicit IANA time zone. Do not manually add a fixed offset when daylight-saving or historical regional rules can affect the requested date."
      },
      {
        "heading": "Check precision, range and failed lines",
        "body": "Large integers can exceed exact JavaScript numeric precision before a date is constructed. The batch converter requires both the input integer and its millisecond value to remain safe integers, then checks the supported Date range. It also rejects fractional inputs rather than silently truncating them. A malformed line stops with its original line number, preserving the relationship between source and report. For datasets with sub-millisecond precision, retain the original value and use a representation that explicitly supports the required precision."
      }
    ],
    "example": "Seconds:      1700000000\nMilliseconds: 1700000000000\nUTC:          2023-11-14T22:13:20.000Z",
    "question": "Can the number of digits reliably determine timestamp units?",
    "answer": "No. Digit count is a clue for familiar recent values, not a complete contract. Read the source format or select the unit explicitly.",
    "source": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date",
    "tool": "unix-timestamp-batch-converter",
    "date": "2026-11-06"
  },
  {
    "slug": "binomial-at-least-probability",
    "title": "Binomial Probability: Exactly, At Most and At Least k Successes",
    "description": "Choose the correct binomial event, avoid off-by-one complements and check independence and constant-probability assumptions.",
    "intro": "A binomial model counts successes in a fixed number of trials. Each trial has two outcomes, the success probability is the same on every trial, and trials are independent. Once those conditions are reasonable, the next common mistake is choosing the wrong event. Exactly three, at most three and at least three are different sets of possible outcomes and usually have very different probabilities.",
    "sections": [
      {
        "heading": "Translate the wording into an inclusive event",
        "body": "Exactly k includes one count. At most k includes zero through k, while at least k includes k through n. Both at most and at least include the boundary k. If using a complement, P(X at least k) equals one minus P(X at most k minus one), not one minus P(X at most k). Write out a small outcome range before calculating when a phrase such as fewer than, more than or no fewer than appears in a problem."
      },
      {
        "heading": "Check whether the trials fit the model",
        "body": "A fixed success probability and independent trials are assumptions, not consequences of entering n and p into a calculator. Sampling without replacement from a small population changes probabilities as items are removed. A process whose success chance improves with practice also violates the constant-probability assumption. The expected count np summarizes the distribution but does not predict a guaranteed observed count. State the model and its limitations alongside any reported probability rather than presenting the calculator output as a property of an unrelated real process."
      },
      {
        "heading": "Interpret numerical tails and endpoint cases",
        "body": "The tool supports up to one thousand trials and uses logarithms to avoid direct factorial overflow. It sums the requested outcomes and calculates inclusive upper tails directly instead of subtracting a nearly-one lower tail. Results still use floating-point arithmetic, so probabilities smaller than the representable range can underflow to zero. When p is zero or one, the distribution concentrates on a single count and is handled separately. Use specialist high-precision statistical software if extremely small tail values are the main subject of the calculation."
      }
    ],
    "example": "For n = 3 and p = 0.5:\nP(X = 2) = 3/8 = 0.375\nP(X ≤ 2) = 7/8 = 0.875\nP(X ≥ 2) = 4/8 = 0.5",
    "question": "Does at least three include exactly three?",
    "answer": "Yes. At least three means three or more successes, so the boundary outcome is included.",
    "source": "https://www.itl.nist.gov/div898/handbook/eda/section3/eda366i.htm",
    "tool": "binomial-probability-calculator",
    "date": "2026-11-06"
  },
  ...growthArticlesForBlog
] as const;
export type ExpansionArticle = (typeof expansionArticles)[number];
