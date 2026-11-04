# Content and SEO expansion — 2026-11-03

The first expansion added 10 tools and 20 English articles. The follow-up adds another 20 tools, bringing the site to 102 tools and 32 articles. Existing pages and the user's earlier uncommitted additions remain in place. English follows the existing site language; there are no translated aliases competing for the same content.

## Search intent map

| Tool | Main queries | Supporting articles |
| --- | --- | --- |
| JSON Flattener | flatten nested JSON, unflatten JSON | JSON flattening; JSON Pointer |
| JSON to NDJSON | JSON to NDJSON, JSON Lines to JSON | JSON vs NDJSON; invalid JSON Lines |
| TSV to JSON | TSV to JSON, spreadsheet to JSON | TSV vs CSV; spreadsheet preparation |
| PX to REM | px to rem, rem to px | CSS unit choice; responsive typography |
| Color Contrast Checker | WCAG contrast checker, AA contrast ratio | Contrast thresholds; UI palette workflow |
| HTML to Text | HTML to plain text, extract text from HTML | Extraction workflow; DOM text properties |
| Unicode Escape | Unicode escape decoder, JavaScript Unicode escapes | Escape notation; code points vs graphemes |
| SRI Generator | SRI hash generator, SHA384 integrity | SRI setup; digest mismatch diagnosis |
| Basic Auth Generator | Basic auth header generator, decode Basic auth | Protocol format; fetch integration |
| URL Slug List Generator | bulk slug generator, duplicate URL slugs | Migration redirect maps; CMS uniqueness |

The bulk slug tool targets batch migrations, preserves row correspondence, and rejects collisions. The existing slug generator remains the richer single-title tool. JSON flattening uses reversible JSON Pointer/container markers rather than silently treating dots inside keys as separators.

Search-result inspection confirmed existing result sets for conversion phrases, especially JSON/NDJSON and TSV/JSON. This is qualitative intent research, not measured search volume. No Search Console, Keyword Planner, or backlink data was available; traffic and ranking forecasts would be speculative. Each article addresses a separate task or question rather than replacing its tool landing page.

## Implementation

Each URL has its own App Router directory, server `page.tsx`, and named content component. Shared workbench, transformation, metadata, schema, and article helpers reduce duplication. The noninteractive home and blog catalogs render as server components to avoid shipping catalog content and icons as client JavaScript. No new runtime dependency was added.

New pages use self-canonical URLs, unique titles/descriptions, Open Graph/Twitter previews, and initial-HTML JSON-LD. Tool schema describes the actual free web application; article schema includes visible authorship and dates. Articles have a table of contents, worked examples, a focused FAQ, official references, and reciprocal links to the associated tool and sibling guide. No invented review ratings or promises of FAQ rich results are used.

The sitemap includes every real tool/article route and uses explicit modification dates for the new content. Older pages omit unknown dates rather than claiming they changed on every build. Update the dates only after meaningful content changes. All metadata references to missing `icon.png` were replaced with the existing 1024×1024 `og-image.png`. Account routes inherit noindex metadata and do not inherit the homepage canonical.

## Verification

- `npm run check:expansion`: transformation edge cases and sitemap/content checks.
- `npx tsc --noEmit`: type checking.
- `npm run check:rendered-seo` after building: all 50 added pages have server-rendered content, one H1, self-canonical metadata, and valid initial-HTML JSON-LD; all 134 content canonicals and 139 sitemap URLs are checked.
- `npm run build`: production rendering; use `next build --webpack` if Turbopack stalls in the execution environment.
- Targeted ESLint passes for the new shared modules. Repository-wide lint has pre-existing failures in older files; do not suppress these globally.
- HTML extraction requires a browser DOM; the Node transformation checks explicitly exclude that one transform.

After deployment, submit `https://utilixio.com/sitemap.xml` to the site's Search Console property, inspect representative new URLs, and monitor actual impressions and query coverage. Sitemap submission is an account action and has not been performed by this code change. These pages are prepared for indexing locally; publication and indexing are separate steps.

## References

- https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Subresource_Integrity
- https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum
- https://www.rfc-editor.org/rfc/rfc6901
- https://www.rfc-editor.org/rfc/rfc7617
- https://github.com/ndjson/ndjson-spec

## Follow-up: 20 additional tools

| Route | Search task and distinct behavior |
| --- | --- |
| `/tools/file-to-base64` | Encode binary files or decode Base64 into an exact downloadable file; distinct from text Base64 encoding. |
| `/tools/file-checksum` | Hash actual file bytes and compare a published SHA checksum; distinct from the existing text hash tool. |
| `/tools/image-resizer` | Change pixel dimensions with a locked or unlocked aspect ratio; exports PNG. |
| `/tools/image-compressor` | Tune JPEG/WebP quality at unchanged dimensions and compare actual byte sizes. |
| `/tools/image-format-converter` | Convert PNG/JPEG/WebP formats with explicit transparency handling. |
| `/tools/css-gradient-generator` | Generate linear, radial or conic background CSS with a browser preview. |
| `/tools/css-box-shadow-generator` | Generate outer/inset shadow CSS with offsets, blur, spread and opacity. |
| `/tools/css-border-radius-generator` | Generate eight-radius elliptical corner CSS with a shape preview. |
| `/tools/json-to-python-dataclass` | Infer Python 3.10+ dataclasses, nested classes and optional fields from multiple sample records. |
| `/tools/csv-to-sql` | Generate dialect-aware INSERTs directly from quoted CSV, keeping cells as text. |
| `/tools/json-to-query-string` | Encode a parameter object or decode query parameters, retaining repeated keys. |
| `/tools/html-table-to-csv` | Extract a pasted HTML table with CSV quoting; explicitly rejects merged cells. |
| `/tools/url-extractor` | Find absolute HTTP(S) URL candidates in pasted text without visiting them. |
| `/tools/email-extractor` | Extract common email address candidates; does not claim mailbox verification. |
| `/tools/list-compare` | Compare membership, intersection, union and duplicates independently of row order. |
| `/tools/whitespace-remover` | Apply one of four explicit whitespace cleanup rules; distinct from deduplication. |
| `/tools/nato-phonetic-alphabet` | Spell identifiers with international letter words, including Alfa and Juliett. |
| `/tools/time-duration-converter` | Convert fixed elapsed-time units, separate from calendar dates and timestamps. |
| `/tools/percentage-calculator` | Calculate percentage-of, ratio, or change, with formulas and zero-baseline validation. |
| `/tools/http-headers-to-json` | Parse one HTTP header block; preserve repeated fields as arrays. |

Every new route has its own static page and named component, self-canonical metadata, WebApplication and breadcrumb schema, unique use cases, limitations, a focused FAQ and related internal links. The home catalog and sitemap use the same typed tool registry. No additional blog posts or duplicate alias pages were created for this follow-up, and no runtime package was added.

Search-result inspection covered image compression/resizing, file checksums, CSS generators, list comparison, NATO spelling and HTTP header conversion. Examples of observed result sets: [file checksum](https://stayput.dev/tools/file-checksum), [CSS tools](https://csstools.io/), [list comparison](https://comparelists.io/), [header parsing](https://www.openworkstand.com/http-headers-to-json). These establish recognizable search intent, not measured monthly demand. Exact keyword volumes and ranking forecasts remain unavailable.

Technical behavior follows official documentation for [canvas encoding](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob), [file digests](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest), [Python dataclasses](https://docs.python.org/3.12/library/dataclasses.html), and [repeated URL parameters](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/append).

Validation commands:

- `npm run check:growth`: 78 checks, including compiled and executed generated Python, a real in-memory SQLite import, binary Base64 round trips, checksum comparison, parsing edge cases and resize calculations. Requires Python 3.10+ for model verification.
- `npm run check:growth-browser`: 31 checks using headless Chromium via CDP, with no added browser automation dependency. Covers real DOM table parsing, image encoding and dimensions, white JPEG alpha flattening, all 20 interfaces, runtime exceptions and narrow mobile layouts. Set `CHROME_BIN` to an installed Chromium executable and `TEST_ORIGIN` to the running local site; defaults use the browser cached in this workspace and `http://127.0.0.1:3100`. External analytics, advertising and font requests are blocked during this test.
- `npm run check:expansion` and `npm run check:rendered-seo`: retain the earlier behavior checks and cover all added metadata, schema, internal links, catalog routes and sitemap URLs.
- `next build --webpack`: production build and static rendering of the final routes.

The earlier note excluding HTML extraction from Node checks still applies to the original script. The new browser test specifically covers the new HTML-table extraction and image APIs using a real browser.

## Latest follow-up: five tools, ten guides, and a compact home directory

The catalog now contains 107 tools and 42 articles; the sitemap contains 154 canonical URLs. New tools are JSON to Rust, JSON to Zod, CSS clamp calculation, robots.txt generation, and SQL IN predicate generation. Ten new articles explain Serde mapping and presence semantics, runtime validation and Zod inference, clamp interpolation, crawler versus index rules, robots deployment mistakes, SQL null/empty-list behavior, image format selection, and download checksum verification.

The homepage now has a compact hero, task search, nine counted categories, an A–Z/newest sort and a filter for the five latest tools. Category sections use native details/summary controls and contain every tool link in the initial HTML. They remain browsable without JavaScript, while client-side filtering operates on the same catalog. No paginated alias URLs or filter-query index pages were introduced. The six starting-point links remain available beneath the directory. The original 72 tool labels and descriptions were preserved in `lib/legacy-tools.ts`; `lib/tool-catalog.ts` combines those entries with the later typed registries. Homepage counts and metadata derive from the catalog.

The homepage layout uses the existing theme tokens and avoids the former long sequence of large animated cards. On small screens, the decorative statistics panel is hidden, the directory appears before the starting-point links, and category buttons scroll within their own row. Search supports `/` to focus, Escape to clear the query, a clear control and a no-results reset. Filtering and sorting do not change canonical URLs.

Current verification:

- Production build and TypeScript pass through `next build --webpack`.
- `npm run check:growth` now runs 113 checks. New coverage includes parsed generated Zod against real valid and invalid values, Rust syntax via rustfmt, Serde key escaping, precise integer handling, clamp interpolation, crawler directive validation, and SQL list parameter ordering. The test command now requires rustfmt as well as Python; it uses the Zod package already available in the workspace for generated-schema verification.
- `npm run check:growth-browser` now covers all 25 growth-tool interfaces, Canvas/DOM behavior, homepage search, category and recent filters, keyboard focus, native category disclosure and mobile overflow. Screenshots are saved to `/tmp/utilixio-home-desktop.png`, `/tmp/utilixio-home-mobile.png`, and `/tmp/utilixio-home-light.png` for local review.
- Rendered SEO checks cover all 65 added pages and self-canonical metadata across all 149 tool/article pages. All 107 tool links are verified as real anchors in the initial homepage HTML, along with all 154 sitemap entries.
- Targeted ESLint passes for the new and changed modules. Existing repository-wide lint debt was not suppressed.

Generated code is inferred from examples, and its limitations are explained on each tool page. No traffic volumes, usage-based popularity claims, or ranking guarantees were fabricated. Official references include [Serde field attributes](https://serde.rs/field-attrs.html), [Zod APIs](https://zod.dev/api), [CSS clamp](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/clamp), [Google noindex guidance](https://developers.google.com/search/docs/crawling-indexing/block-indexing), and [PostgreSQL list comparisons](https://www.postgresql.org/docs/current/functions-comparisons.html).

## 2026-11-04: ten practical utilities

The site now contains 117 tools, 42 articles and 164 sitemap URLs. This addition contains tools only; it does not create more articles or duplicate aliases.

| New route | Result a visitor can actually use |
| --- | --- |
| `/tools/qr-code-generator` | Static QR PNG/SVG for text or a URL, with a quiet zone, correction settings and a density-aware minimum output size. |
| `/tools/image-cropper` | Pixel-preserving PNG crop selected through source-relative percentages. |
| `/tools/image-rotate-flip` | Right-angle rotation and source-axis mirroring, exported as PNG. |
| `/tools/favicon-generator` | Five PNG sizes, a three-layer ICO, manifest and HTML snippet; individual downloads and an eight-file ZIP. |
| `/tools/svg-to-png` | Self-contained static SVG rasterization with chosen dimensions and transparent/white background. |
| `/tools/json-patch-tester` | All six RFC 6902 operations, strict JSON Pointer resolution, structural tests and atomic output. |
| `/tools/json-merge-patch` | RFC 7396 object merging, null deletion and whole-array replacement. |
| `/tools/vcard-generator` | vCard 4.0 `.vcf` with escaped UTF-8 text and content-line folding. |
| `/tools/icalendar-generator` | One timed `.ics` event with validated explicit offsets, UTC endpoints, UID and description. |
| `/tools/url-cleaner` | Conservative removal of UTM/ad parameters while preserving unrelated values and fragments by default. |

Each route has a dedicated static page and named component, unique metadata, initial-HTML application and breadcrumb schema, instructions, practical limits and related links. The ten tools appear in the existing search/categories and replace the former five-item "Just added" set with the new ten. Existing tool links and user changes are retained.

This batch adds the `qrcode` runtime package for established QR encoding, its development types, and `jsqr` as a development-only independent decoder. QR payloads are encoded locally and no redirect hosting service is used. ZIP creation and ICO assembly use the generated PNG bytes; no remote file API was added.

The new content dates and homepage sitemap date are explicitly 2026-11-04. Earlier tool and article dates remain 2026-11-03. These dates do not advance on every build.

Verification includes:

- `npm run check:utilities`: 55 checks covering all patch operations and failure cases, special object keys, merge semantics, UTF-8 folding, escaped contact/calendar fields, timezone/date validation, conservative URL cleanup, crop/rotation geometry, ZIP CRC and filenames via Python, and QR PNG/SVG output. PNG QR codes containing a URL and Ukrainian/emoji text are independently decoded with jsQR and compared with their exact input.
- `npm run check:growth`: 118 checks retaining previous generators, executable SQLite and generated Python/Zod/Rust verification, plus the new text/form examples.
- Browser checks exercise all 35 growth-tool interfaces, real pixel crop/flip/rotation, SVG rendering and rejected external/active references, PNG/ICO decoding, an actual eight-file favicon ZIP checked through Python, the home directory, and mobile layouts.
- Rendered SEO checks cover all 75 added pages, self-canonical metadata on all 159 tool/article pages, all 117 real tool anchors in the homepage HTML, and 164 sitemap entries. New WebApplication schema carries the explicit modification date.

JSON Patch uses a fresh source clone and suppresses partial output on failure. A final root deletion is reported as having no JSON artifact to export; an add operation can recreate the root within the same patch. Large results are bounded. Merge Patch deliberately treats null as removal and arrays as replacements. Neither tool infers application authorization rules.

SVG input is restricted to self-contained static artwork; scripts, active event attributes, external base/reference URLs, embedded images, animations and style elements are rejected. Favicon and raster tools preserve the decoded pixels needed for their operation but do not promise metadata or animation preservation. Calendar generation only creates a local file; it does not send invitations or write to an account.

Technical references: [node-qrcode](https://github.com/soldair/node-qrcode), [JSON Patch](https://www.rfc-editor.org/rfc/rfc6902), [JSON Merge Patch](https://www.rfc-editor.org/rfc/rfc7396), [vCard](https://www.rfc-editor.org/rfc/rfc6350), [iCalendar](https://www.rfc-editor.org/rfc/rfc5545). Search-result inspection supplied qualitative task validation, not measured traffic volumes or promises of usage.

## 2026-11-04: ten more tools for data and daily development

Current totals are 127 tools, 42 articles and 174 canonical sitemap URLs. This batch adds JSON to C#, JSON to Kotlin, CSV column selection, CSV transposition, CSV deduplication by keys, a five-field cron builder, bcrypt generation/verification, HTML anchor extraction, unsigned IPv4 conversion, and a CSS Grid generator. No new package was required; bcrypt uses the existing bcryptjs dependency.

The catalog assigns the new tools to data, code/database, security, web, CSS and numeric categories. "Just added" now identifies this latest set of ten. Search, counts, homepage descriptions and sitemap coverage continue to derive from the existing registries. Every tool has a dedicated route and component, unique metadata, initial-HTML schema, usage steps, limits and related links.

CSV operations share the strict parser and preserve cell strings, quoting and multiline records. Selection uses exact column names in a JSON array. Transposition treats the entire input as a matrix. Deduplication uses a structured tuple of key cells, explicit first/last retention and optional matching normalization, keeping surviving source cell values unchanged. These are separate operations rather than duplicate aliases for a generic converter.

C# output targets C# 11/.NET 7+ System.Text.Json and separates required presence from nullability. Kotlin output targets kotlinx.serialization and separates required-nullable fields from missing fields with null defaults. Model checks cover inferred contracts, nesting, name collisions, control-character escaping, Kotlin dollar interpolation, numeric range selection and empty-object behavior. No C#/Kotlin compiler was available in this workspace; generated model files should also be built and tested in the consuming project. TypeScript compilation of the application passed.

The cron builder emits five-field Unix expressions, with numeric syntax validation and documented timezone/dialect limits. IPv4 uses unsigned network-byte-order arithmetic. The Grid preview is real CSS Grid with narrow-container bounds. HTML links are parsed in an inert template, resolved against an explicit base, and returned without fetching destinations. Bcrypt generation and verification run asynchronously; passwords over 72 UTF-8 bytes are rejected, and costs are bounded for interactive use.

Validation:

- `npm run check:productivity`: 67 checks for model contracts and source escaping, CSV matrix/selection/identity, cron syntax/ranges, unsigned IPv4 bounds, Grid settings, salted bcrypt generation and actual successful/unsuccessful password verification.
- `npm run check:growth`: 126 retained and expanded checks, including prior Python, SQLite, Zod and Rust verification and new non-DOM examples.
- Browser suite: 88 checks across all 45 growth-tool interfaces, HTML link resolution/metadata, live Grid rendering, bcrypt generation followed by UI verification, previous Canvas/ICO/ZIP/SVG operations, directory behavior and mobile layouts.
- Production Webpack build and targeted ESLint passed. Rendered SEO checks cover all 85 added pages, canonical tags across 169 tool/article pages, all 127 initial-HTML homepage tool anchors, and 174 sitemap URLs.

Official technical references: [System.Text.Json required properties](https://learn.microsoft.com/en-us/dotnet/standard/serialization/system-text-json/required-properties), [Kotlin serialization](https://kotlinlang.org/docs/serialization.html), [bcryptjs](https://github.com/dcodeIO/bcrypt.js), and [Unix crontab](https://man7.org/linux/man-pages/man5/crontab.5.html). Search-result checks were qualitative and were not used to fabricate traffic or usage forecasts.

## 2026-11-04: twenty workflow, media and design tools

Current totals are 147 tools, 42 articles and 194 sitemap URLs. This batch adds twenty separate tasks without adding language variants or new packages:

- SRT/WebVTT conversion, subtitle offset shifting, and subtitle transcript extraction.
- CSV row filtering and column statistics.
- JSON array filtering, JSON Pointer value extraction and collision-safe key renaming.
- Common HTTP status and MIME type reference lookups.
- CSS text shadow, polygon clip-path, cubic-bezier and Flexbox generators.
- Image pixel picking, grayscale conversion, text watermarking and single-image PDF export.
- Plain-text line wrapping and a bandwidth/file-size transfer-time estimate.

Each tool has its own static App Router page, named component, metadata, WebApplication/breadcrumb schema, format limits, examples where applicable, and related links. The latest-tool set contains these twenty routes. Homepage counts and descriptions still derive from the combined catalog; all 147 tool links remain real anchors in the initial HTML. The existing nine categories are retained.

Subtitles use an explicitly limited plain-cue subset. Conversion rejects unsupported WebVTT positioning, styles and header metadata rather than silently flattening them into SRT. Cue text boundary spaces and line breaks are retained during format/timing conversion. Transcript extraction intentionally removes markup using an inert template. Negative shifted times and invalid cue durations are rejected. Download extensions follow the selected format.

JSON filtering uses typed criteria and plain JSON Pointer locations rather than claiming full JSONPath support. Missing and explicit-null fields remain distinct. Renaming is simultaneous, does not mutate the source, and rejects destination collisions. CSV filtering preserves retained cells and reports numeric exclusions in the statistics tool. Lookup tools explicitly distinguish a common offline reference from a complete live registry or content-sniffing service.

Design previews use browser CSS/SVG, with reduced-motion handling for the easing animation. Pixel selection maps display coordinates back to the original canvas and clamps fractional edge clicks to valid pixels. Grayscale preserves alpha and bounds per-pixel work. Watermarks are flattened text, not editable layers or ownership verification. PDF export flattens transparency to white, embeds a locally encoded JPEG and writes a single A4/Letter page with correct byte offsets and stream lengths. It does not perform OCR.

Validation:

- `npm run check:workflows`: 65 focused checks covering subtitle timing/whitespace, CSV filtering and statistics, typed JSON operations, special keys and pointer escapes, common-reference behavior, CSS validation, grapheme-aware wrapping, transfer units, alpha and canvas coordinate mapping.
- `npm run check:growth`: 141 retained/expanded checks, including earlier generated-code and SQL verification and new non-DOM examples.
- Browser suite: 125 checks across all 65 growth-tool interfaces, source-pixel sampling and edge clicks, actual grayscale and watermark pixels, subtitle transcript extraction and output filenames, motion preferences, Flexbox/Bezier previews, PDF structure via `pdfinfo` and a real page render via `pdftoppm`, existing file/QR tools, catalog filters and narrow mobile layouts.
- Rendered SEO checks cover all 105 added pages, all 189 tool/article canonicals, all 147 homepage tool anchors and 194 sitemap entries. Production Webpack build and targeted ESLint pass.

The browser test now requires the Poppler `pdfinfo` and `pdftoppm` command-line tools in addition to its existing Chromium/Python prerequisites. These are validation tools only and are not required by the website at runtime. The image-to-PDF implementation has no additional runtime dependency.

Official references include [WebVTT](https://www.w3.org/TR/webvtt1/), [CSS cubic-bezier](https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function/cubic-bezier), [IANA HTTP status registry](https://www.iana.org/assignments/http-status-codes/), and [common media types](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/MIME_types/Common_types). The status tool intentionally omits temporary and uncommon entries from its common-code map; an unknown result does not assert that a code is unassigned.
