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

## 2026-11-05: twenty distinct data and inspection tools

Current totals: **167 tools, 42 articles and 214 sitemap URLs**. The existing App Router pages, shared workbench, guides, nine catalog categories and local processing model are retained. No runtime dependencies were added.

New tasks:

- Unicode normalization (NFC/NFD/NFKC/NFKD) and invisible-character inspection with code-point and UTF-16 offsets.
- UUID syntax/version/variant inspection, including UUIDv7 timestamp extraction.
- Separate request Cookie and response Set-Cookie parsing, preserving duplicate names and literal values.
- Structural CSP inspection with first-directive handling, duplicate reporting and contextual source-expression notes.
- Sectioned INI to JSON conversion with string preservation and duplicate/collision errors.
- CSV inner/left/full joins, record comparison by key, and count/sum/average pivot tables.
- Typed JSON grouping, fixed-size array batching and first/last record deduplication by JSON Pointer.
- CSS selector and XPath 1.0 testing against pasted inert HTML.
- Literal find/replace with replacement counts, and JavaScript regular-expression literal escaping.
- IPv6 expansion/compression, strict SemVer precedence comparison, HTML heading outlines and relative HTTP(S) URL resolution.

Every new route has a unique title/description, self canonical, Open Graph/Twitter metadata, WebApplication/breadcrumb structured data, initial-HTML instructions, example input, format limits and related links. The latest filter now contains this batch of twenty tools. The root sitemap modification date and these new tools use November 5; earlier tool dates are retained. Registry validation now checks duplicate titles and slugs across all three tool catalogs, including legacy routes.

CSV joins explicitly require one-to-one non-empty keys; comparisons require matching schemas and compare exact text rather than guessing types. Pivots preserve absent cells separately from actual zeroes and reject blank/non-finite numeric values. JSON group and deduplication keys are typed scalars; missing pointers are errors. Large JSON integer identifiers must be strings to prevent precision loss. SemVer compares arbitrarily long numeric components without floating-point conversion and ignores build metadata for precedence. IPv6 accepts embedded IPv4 input but outputs hexadecimal groups consistently; zones, ports and prefixes are outside its address-only scope.

HTML is parsed in a template's inert owner document and never attached to the page. CSS matching and heading inspection therefore do not simulate layout, fetched resources or script-generated content. XPath uses the browser's 1.0 engine, relative to a synthetic wrapper. CSP and cookie results describe pasted data rather than certifying browser acceptance or security. Relative URL resolution makes no network request. Normalization and invisible-character reports explicitly explain legitimate writing-system and emoji uses.

Validation completed:

- `npm run check:discovery`: 105 focused checks across seventeen pure tools, including typed keys, quoted CSV, header collisions, schema mismatch, replacement expansion limits, Unicode offsets, strict SemVer edge cases and malformed IPv6.
- Retained expansion, productivity and workflow suites: 40, 67 and 65 checks. The expanded growth suite passes 158 checks, including generated-code and SQLite execution.
- Production Webpack build and targeted ESLint pass. Rendered SEO checks cover 125 added pages, all 209 tool/article canonicals, all 167 initial-HTML homepage tool anchors and 214 sitemap URLs.

Browser validation also passes **181 checks** across all 85 growth-tool interfaces, including all twenty new pages. Added fixtures verify CSS matches and attributes, XPath node/scalar results, heading-level observations, literal regex compatibility and inert HTML that neither executes scripts nor requests remote image/frame resources. Mobile checks include the CSV join, XPath, replacement and SemVer forms. Existing image/file/PDF checks, all catalog filters and the latest-twenty set remain covered.

Primary references used for technical behavior: [SemVer 2.0.0](https://semver.org/), [IPv6 text representation](https://www.rfc-editor.org/rfc/rfc5952), [Unicode normalization](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize), [XPath evaluation](https://developer.mozilla.org/en-US/docs/Web/API/Document/evaluate), [Set-Cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie) and [CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy). Search-result reconnaissance was qualitative; no search-volume, ranking or traffic forecasts are claimed. These changes are local and have not been deployed or submitted to Search Console.

## 2026-11-05: twenty everyday calculation, data and CSS tools

Current totals: **187 tools, 42 articles and 234 sitemap URLs**. This subsequent batch preserves the shared workbench, static App Router pages, local processing and nine catalog categories. No runtime package was added.

The new routes cover twenty separate tasks:

1. Date difference with signed elapsed calendar days.
2. Business-day counts with explicit weekends, holidays and endpoint rules.
3. ISO week dates, week-years and Monday/Sunday boundaries.
4. IANA time-zone display for an explicitly offset input instant.
5. Length, mass, volume and temperature unit conversion.
6. Weighted averages from CSV values and weights.
7. Exact integer greatest common divisors and least common multiples.
8. Exact digit-string scientific-notation expansion and normalization.
9. Canonical Roman numerals, both directions, for 1–3999.
10. English short-scale integer wording.
11. Random selection without replacement from unique labels.
12. Random roster partition into teams of nearly equal size.
13. Vertical CSV append with strict or union schemas.
14. CSV unpivot from wide columns to long-form rows.
15. JSON record arrays indexed as lookup objects.
16. Image alternative-text markup review.
17. Static HTML form/control inventory.
18. CSS keyframe animation generation and preview.
19. CSS border triangle generation and preview.
20. CSS filter chain generation and preview.

All twenty pages have unique metadata, canonical URLs, WebApplication/breadcrumb schema, examples or editable example settings, server-rendered guidance and related links. The most-recent filter contains exactly this batch. Counts and homepage links derive from the combined catalogs, and sitemap generation automatically includes the new growth-tool records with their actual modification date. Earlier records and articles retain their dates.

Dates are strictly validated before arithmetic. The business-day example's custom holiday is an input demonstration, not a country calendar. Unit conversion checks dimensions and physical bounds. GCD/LCM and number wording use BigInt; scientific notation preserves numeric digit values without a floating-point roundtrip. Weighted averages use explicitly documented floating-point arithmetic. Random selection uses Web Crypto, rejection sampling and Fisher–Yates; team labels must be unique and every roster entry is assigned once. This is not an audited drawing service or skill-balancing system.

CSV append and unpivot retain exact cell text and enforce output bounds. JSON lookup collisions are explicit, including number/string keys that become the same JSON property. HTML inspection uses the existing inert template parser. Form reports omit field values, strip form controls from copied label text and never submit a form. Alt-text results distinguish missing, intentionally empty and whitespace-only attributes without claiming a complete accessibility audit.

CSS animation output and its preview honor reduced-motion preferences. Border triangles show their real border geometry, and filter output uses the same ordered chain as the colorful preview. These controls extend the existing DesignPreviews component rather than introducing a separate page architecture.

Validation: 113 focused everyday-tool checks, including all 3,999 canonical Roman roundtrips and team-size partitions up to fifteen people. The retained discovery/workflow/productivity/expansion suites pass 105/65/67/40 checks, and the expanded growth suite passes 176 checks including executable SQLite and generated-code checks. Targeted ESLint passes.

Technical references: [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat), [CSS filter](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/filter), and [HTML img alternative text](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img). Search checks were qualitative and do not establish keyword volume or predict traffic. Changes are local; no production deployment or Search Console submission has been performed.

The form inspector resolves ownership and labels within the inert fragment, including external `form` controls, missing owners, duplicate IDs, implicit labels and non-labelable hidden inputs. Native detached-tree associations are not assumed. The standalone `node scripts/check-growth-browser.mjs --fixtures-only` path passes 83 DOM/canvas/file fixture checks without requiring a running site. Final production Webpack build and rendered SEO checks pass, including all 145 added pages, 229 content canonicals, 187 initial homepage tool links and 234 sitemap entries.

The complete production browser suite passes **233 checks** across all 105 growth-tool interfaces, including all twenty new tools. It verifies animation output and reduced-motion behavior, triangle geometry, filter rendering, HTML inspection, existing file/image/PDF features, catalog search and category/latest filters. New mobile cases cover business-day settings, units, unpivot controls and all three CSS generators.

## 2026-11-05: twenty server-backed file and data conversions

Current totals: **207 tools, 42 articles and 254 sitemap URLs**. This batch adds twenty routes while keeping the existing registry, named page components, guide rendering, catalog, search and sitemap architecture:

- XLSX to CSV, XLSX to JSON, JSON to XLSX.
- DOCX to sanitized HTML/plain text, and plain text to DOCX.
- PDF merge, page extraction/reordering, quarter-turn rotation, standard metadata removal, A4/Letter page fitting, text-to-PDF, text watermarks and visible page numbers.
- Still-image AVIF encoding, selected TIFF page to PNG/JPEG and GIF frames to a PNG sprite sheet.
- JSON5 to strict JSON, JSON to TOML, text-file charset conversion and mono PCM WAV output from mono/stereo source audio.

A shared `ServerWorkbench` calls `/api/convert/[slug]`. Every server tool visibly discloses its upload behavior above the controls and in its server-rendered guide. Uploads occur only after Convert on server; loading a built-in example downloads a generated fixture rather than uploading the user's selection. Merge inputs can be reordered. Output filenames and MIME types follow the actual format, and binary results remain downloadable blobs. HTML output is displayed as source text, not inserted into the live page.

Conversion runs in separate Node workers with a 256 MiB V8 heap allowance and a 25-second execution deadline. Each process admits at most two active uploads and two conversion workers, returns retryable 429 responses when occupied, bounds streamed bodies before multipart parsing, and caps upload reading at ten seconds. Combined files and output are capped at 20 MiB; Office inputs additionally have a 2 MiB compressed and 32 MiB actual expanded ZIP limit. File-processing code writes no upload or conversion history to disk and does not call external conversion providers. Workers, fonts and their runtime dependencies are included in Next's deployment file trace. Native image libraries were also verified in that trace.

Office ZIP entries are streamed for size validation before parsing, and entity declarations are rejected. Worksheet limits are 10,000 rows, 200 columns and 50,000 cells. Cached formula results are read without evaluation; absent results are errors. JSON-created spreadsheet strings remain literal string cells, including text beginning with equals signs. DOCX HTML is sanitized and images omitted. Plain-text extraction uses structural HTML conversion so Word manual line breaks do not disappear.

PDF input is unencrypted and limited to 200 pages. Merge/extract copy pages; resizing embeds artwork and does not preserve interactive annotations. Metadata removal deletes the Info object and catalog XMP object rather than just detaching their references, but does not claim anonymization or redaction. Unicode PDF text uses a bundled Noto Sans font under its included SIL OFL license and deliberately limits unsupported glyphs, controls and RTL shaping. Editing invalidates original digital signatures. Resizing handles existing quarter-turn rotations without moving source artwork outside the new paper area.

Native image input signatures are checked before decoding; still-image conversion does not accept SVG or arbitrary formats. Images have a 16-million-pixel limit; GIF sheets also have a 64-frame limit and preserve composited frame pixels rather than delays. Charset conversions use explicit source/target selection and roundtrip loss checks. WAV decoding supports PCM 8/16/24/32-bit and IEEE float32 for one or two channels; output is mono 16-bit PCM at the source rate. It does not claim MP3/AAC decoding or sample-rate conversion.

The server upload disclosure replaces universal browser-only claims on the homepage, shared guide and privacy page. Terms descriptions were updated to match actual processing, and privacy text now acknowledges hosting metadata, configured analytics/advertising and optional accounts. Browser-only tools retain their local-processing description. API outputs use no-store, nosniff, attachment and noindex headers and are excluded from the sitemap. Same-origin checking uses the original host/proxy host instead of Next's internal request URL; both direct HTTP and real browser uploads are tested.

Next.js and its ESLint configuration were updated within version 16 to 16.4.5, Sharp to 0.35.5, with compatible dependency fixes and an ExcelJS-scoped UUID 11 override. The JSON formatter's existing local `process` callback was renamed to avoid shadowing Next's generated process macros. No standalone rendering service or system Office/FFmpeg installation is required for the website. The bundled font and license are in `public/fonts`.

Validation completed:

- `npm run check:server`: 74 checks across all twenty tools. These include real Excel cell types/formula caches, archive expansion limits, Word line breaks, Unicode PDF text, independent PDF rasterization, GIF frame pixels, all advertised WAV sample formats and isolated-worker messaging. Poppler and Python independently read generated PDF, Office and WAV files.
- `npm run check:server-http`: 51 checks against the production API, including all twenty output formats, explicit browser Origin headers, oversized bodies, parser errors without stack disclosure, bounded concurrency, cancellation recovery, headers and deployment traces.
- Retained growth suite: 176 checks; everyday/discovery/workflow/productivity/expansion suites: 113/105/65/67/40 checks.
- Production Webpack build, TypeScript, targeted lint and rendered SEO pass. SEO verification covers all 165 added pages, 249 tool/article canonicals, 207 initial-HTML homepage tool anchors and 254 sitemap entries, plus honest server notices on every new page.

Runtime requirements: a Node.js Next server supporting worker threads, the installed runtime packages and traced worker/font assets. Built-in examples require the server. Existing browser tools remain independent of the conversion API. Tests that inspect formats additionally require Poppler/Python locally; those are not website runtime dependencies. These changes are local and have not been deployed or submitted to Search Console.

Primary implementation references: [pdf-lib](https://pdf-lib.js.org/), [ExcelJS](https://github.com/exceljs/exceljs), [Mammoth](https://github.com/mwilliamson/mammoth.js), [Sharp output formats](https://sharp.pixelplumbing.com/api-output/), and the [Noto font license](https://github.com/notofonts/noto-fonts/blob/main/LICENSE). Tool descriptions document the implemented behavior and its tested limits rather than promising search volume or traffic.

Final browser verification passes **277 checks** across all 125 growth-tool interfaces, including all twenty server conversions, upload examples, downloads, catalog filters and mobile pages. Additional native-format checks confirm pre-decode GIF frame-area bounds and preservation of completely blank pages during PDF resizing. `npm audit --omit=dev` reports zero production vulnerabilities; the development ESLint dependency chain retains eight moderate advisories. No forced framework downgrade was applied.

## 2026-11-06: twenty additional document, archive, image and audio tools

Current totals: **227 tools, 42 articles and 274 sitemap URLs**. Twenty new, distinct tasks extend the shared server converter without replacing the page/catalog architecture:

- PDF text extraction, selected-page PNG/JPEG rendering, thumbnail contact sheets, AcroForm field export, JSON-driven form filling, visible-margin cropping and raster grayscale export.
- BMP/PNG conversion, multi-image contact sheets, automatic transparent PNG border trimming and image EXIF/metadata removal.
- Sample-aligned PCM WAV trimming and peak normalization.
- ZIP creation and ZIP entry listing/extraction.
- Structured Markdown and HTML to editable DOCX.
- CSV contact batches to VCF, CSV UTC events to ICS, and latitude/longitude JSON records to GeoJSON points.

The new records use their actual November 6 modification date. The homepage sitemap date is updated; existing article/tool/policy dates remain unchanged. Every route includes its own metadata, self canonical, WebApplication/breadcrumb structured data, server-rendered guide, example settings and related links. The latest-tool filter contains this batch. Existing nine categories and all 227 initial-HTML homepage anchors remain intact.

`server/extended-conversions.mjs` shares the existing bounded conversion worker, input/output limits and error handling. `ServerWorkbench` now supports a labeled text editor alongside file input, which the PDF form filler uses for its JSON map. The example button restores that map as well as the options. Empty text extraction has an explicit result message. File uploads retain the visible server-processing disclosure and require an explicit conversion request.

PDF.js 6.5.438 reads local byte arrays with evaluation and XFA disabled. Standard fonts, CMaps, WASM resources, the fake-worker module and native canvas dependencies are traced for deployment. The bounded canvas factory implements the installed renderer API, and cleanup runs through the loading task. Rendering produces pixels rather than interactive PDF content; grayscale output intentionally loses selectable text. Text extraction performs no OCR. Contact sheets and grayscale exports support at most twenty pages, while individual render surfaces remain below sixteen million pixels. Form filling rejects unknown/read-only fields, invalid choices and unsupported glyphs; XFA is rejected before library normalization. CropBox edits are explicitly documented as visibility changes rather than redaction.

BMP handling is restricted to uncompressed Windows 24/32-bit BI_RGB, with explicit row padding and top-down/bottom-up handling. Transparent PNG trimming reads alpha after conversion to RGBA, including gray/alpha inputs. Image metadata removal applies orientation and re-encodes without requesting source metadata preservation; it is not anonymization. Contact sheets preserve file order and fit whole images into cells.

WAV trimming preserves complete integer PCM frames, channels, rate and bit depth. Normalization measures a shared absolute peak and exports 16-bit PCM without changing stereo balance. Neither operation claims codec decoding, loudness normalization or resampling. ZIP creation normalizes leaf names and rejects collisions. Extraction lists metadata first or streams one exact selected entry without filesystem extraction. Archive entry count, declared expanded size and actual streamed output are bounded; encrypted entries are rejected.

Markdown is parsed with raw HTML disabled. HTML is sanitized before supported headings, runs, lists and tables are mapped to DOCX. Scripts/resources are not executed or fetched; merged cells and excessive structural complexity are errors. Calendar/contact fields are escaped and UTF-8-folded, with vCard structured names handled separately from formatted names. Independent parsers verify punctuation and Unicode roundtrips. Events require valid UTC timestamps and receive generated export identifiers. GeoJSON always writes longitude first and rejects missing or out-of-range coordinates.

Validation:

- `npm run check:extended`: 74 checks across the twenty new tools, including real PDF pixels, editable/flattened form values, BMP pixels, alpha trimming, EXIF orientation, exact WAV frames, ZIP entries, DOCX XML, independent vCard/calendar imports, GeoJSON coordinates and native rendering inside a bounded worker. Poppler and Python independently inspect generated files.
- `npm run check:server-http`: 86 checks across all forty server tools, including actual outputs, upload bounds, Origin validation, cancellation recovery and deployment traces.
- Browser suite: 321 checks across all 145 growth-tool interfaces, including all new examples, file/text form controls, download results, catalog filters and mobile layouts.
- Retained suites pass: server conversions 74, growth 176, everyday 113, discovery 105, workflow 65, productivity 67 and expansion 40 checks.
- Production Webpack build, TypeScript, targeted ESLint and rendered SEO pass. Static SEO verification covers 185 added pages, all 269 tool/article canonicals, all 227 homepage tool links and 274 sitemap entries.

**Runtime requirement:** Node.js 22.13 or newer, as declared in package.json and the lockfile. This follows the installed PDF.js requirement. Native canvas packages and local PDF assets must remain in the traced server deployment. No system Office or FFmpeg installation is needed. The additional ical.js package is a development-only interoperability test dependency. Changes remain local; no production deployment or search-index submission was performed.

Primary technical references include [Mozilla PDF.js](https://github.com/mozilla/pdfjs-dist), the installed PDF.js public API/types, [pdf-lib](https://pdf-lib.js.org/), [DOCX](https://docx.js.org/), and [ICAL.js](https://github.com/kewisch/ical.js). Tool selection does not imply measured keyword volume, guaranteed rankings or traffic forecasts.


## 2026-11-06: twenty protocol, validation and browser utilities

Current totals: **247 tools, 42 articles and 294 sitemap URLs**. This batch adds twenty distinct tools in the existing route, workbench, guide and catalog architecture:

1. JSON Schema Validator (Draft 7 and 2020-12).
2. JSON to MessagePack.
3. MessagePack to JSON.
4. XML Plist / JSON Converter.
5. JMESPath Tester.
6. Regex Find and Replace.
7. X.509 Certificate Decoder.
8. SSH Public Key Fingerprint.
9. CSV to HTML Table.
10. CSV Delimiter Converter.
11. XML XPath Tester with namespace mapping.
12. JSON Canonicalizer.
13. CSS Specificity Calculator.
14. HTML to Markdown.
15. CSS to React Style Object.
16. Environment File Diff.
17. POSIX Shell Argument Escaper.
18. SMS Segment Calculator.
19. CSS Media Query Generator.
20. Color Harmony Generator.

The first fifteen share the bounded Node conversion worker; the final five run locally in the browser. The schema validator uses a second labeled editor; the API counts both editors toward its combined text limit. Schema compilation is strict, validates formats without mutating input and does not fetch external references. MessagePack output preserves binary/date/unsafe-integer distinctions through documented JSON tags. Plist and XPath parsing reject custom DTDs and entity declarations; XPath supports explicit namespace mappings. The canonicalizer serializes keys directly in UTF-16 order and rejects duplicate keys and lone surrogates. Public certificate decoding reports metadata, not certificate trust. SSH fingerprints accept supported public-key wire formats, not private keys. HTML conversion sanitizes input without fetching resources. Regex execution remains subject to the existing worker deadline.

Environment differences redact values by default and never call the conversion API. Shell escaping produces arguments for POSIX shells without executing commands. SMS calculations distinguish GSM extension characters and UTF-16 surrogate pairs and avoid splitting them between segments; actual carrier billing can differ. Media queries have a live viewport-match preview. Harmony palettes provide visible swatches and copyable CSS variables without implying accessibility contrast.

Each new route has unique metadata, a self canonical, structured data, a server-rendered guide, examples and related links. The latest-tool filter shows this batch; all 247 tool links appear in the initial homepage HTML across nine categories. Existing dates are preserved, and the twenty new records use November 6. The API remains excluded from the sitemap with noindex response headers. No search-volume or ranking guarantees are claimed.

Validation completed:

- Protocol suite: 75 checks across all twenty additions, including schema drafts and formats, typed MessagePack/plist roundtrips, namespace-aware XPath, canonical key ordering, selector specificity, independent Python shell parsing and SSH hashing, and SMS segment boundaries.
- HTTP suite: 102 checks across all 55 server tools, including actual conversion outputs, upload/concurrency limits, cancellation recovery, response headers and deployment traces. The new worker module and all eleven new runtime packages are included in the deployment trace.
- Retained suites: server 74, extended conversions 74, growth 181, everyday 113, discovery 105, workflow 65, productivity 67 and expansion 40 checks.
- Production Webpack build, TypeScript, targeted ESLint and whitespace checks pass. Rendered SEO checks cover all 205 added pages, 289 content canonicals, 247 initial-HTML homepage tool links and 294 sitemap URLs.
- Chromium: 370 browser checks pass across all 165 growth-tool interfaces, real API examples, downloads, mobile layouts, homepage search and category filters. Additional assertions verify the schema editor, default environment-value redaction, palette swatches, live media-query changes and no conversion-API requests from the five new local tools.
- Production dependency audit reports zero vulnerabilities.

Runtime requirements remain Node.js 22.13 or newer with worker threads and traced runtime assets. Changes are local; deployment and search-index submission have not been performed.


## 2026-11-06: twenty local utilities, ten guides and the photographic journal

Current totals: **267 tools, 52 articles and 324 sitemap URLs**. The new tool batch adds OpenAPI operation extraction, HAR analysis, Cache-Control parsing, email header unfolding, a cURL command builder, SQL placeholder conversion, recursive JSON key case conversion, stable JSON array sorting, CSV to NDJSON, ASCII tables, exact fractions, prime factorization, matrix operations, quadratic equations, binomial probabilities, CSS patterns, CSS borders, CSS outlines, batch Unix timestamps and text frequency analysis. All twenty run locally in the existing GrowthWorkbench without conversion-API requests. Existing server tools and processing disclosures remain in place.

Ten new substantive guides cover HAR interpretation, Cache-Control storage versus revalidation, OpenAPI operations, email Received fields, cURL JSON requests, SQL bind markers, CSV-to-NDJSON text preservation, exact rational arithmetic, timestamp units and inclusive binomial events. Each includes three detailed sections, a worked example, a specific common question, an official reference and a linked tool. Those tools link back to the matching guides. Original publication dates are retained for existing content; new articles use November 6, and redesigned article pages accurately report November 6 as their modification date.

The blog index now has a photographic featured article, editorial typography, searchable cards, seven topic choices, a live result count and a recoverable empty state. Every one of the 52 article links appears in initial HTML. A lightweight search component receives card data from the server rather than bundling full article bodies. The forty shared article pages have photo covers, author/date/read-time metadata, a sticky desktop contents list, readable text widths, code examples, related-tool callouts and photographic related cards. All twelve earlier bespoke articles also receive the new cover and typography wrapper while preserving their content and URLs. Small-screen layouts stack the content and make the contents navigation inline; light and dark themes use the existing theme system.

Eight Unsplash photographs are self-hosted as optimized WebP assets, totaling approximately 632 KiB. Their source links and license reference are recorded in public/images/blog/SOURCES.md. The browser does not contact an external image service. Next Image provides responsive delivery, explicit image dimensions, above-the-fold preloading and lazy loading for card images. Each article has a photographic Open Graph/Twitter image; BlogPosting images and 52 image sitemap associations use the same local assets. No new runtime packages were required.

Important implementation bounds: HAR reports omit query strings, credentials, headers and bodies but may still contain sensitive path names; timings overlap and known body bytes are not total wire transfer. Email header fields are parsed claims, not authentication results. SQL conversion preserves common quoted/comment regions and reports occurrence-based numbered-parameter order; ambiguous question-mark JSON operators require review. Fractions use BigInt and return exact reduced strings plus a labeled approximate decimal. Matrix and probability computations use documented floating-point limits. CSS previews do not imply accessible contrast or complete keyboard-focus compliance. Tool selection does not imply measured keyword volume or guaranteed rankings.

Validation completed:

- New analysis suite: 48 checks across all twenty tools, including exact fraction reduction, matrix pivoting, stable sorts, SQL quotes and repeated parameters, HAR privacy/unknown sizes, CSV multiline strings, binomial events and timestamp units.
- Retained growth suite: 201 checks, including executable generated code and format roundtrips.
- Journal browser suite: 23 checks for all-card initial rendering, search, topic filtering, reset, actual optimized image loading, old/new article templates, date display and mobile overflow. Desktop, mobile and light-theme screenshots were inspected.
- Static SEO checks cover all 319 tool/article routes, uniqueness, related links and sitemap coverage. Final production Webpack build and TypeScript pass. Targeted lint for the modified code passes; older bespoke article bodies retain their pre-existing JSX escaping lint errors. Rendered SEO covers all 235 added pages, 319 content canonicals, 267 initial-HTML homepage links and 324 sitemap URLs.

Changes are local. No deployment, Git push or Search Console submission was performed.

Final verification: 414 browser checks pass across all 185 growth-tool interfaces, including the twenty new local tools, all server examples, catalog search and mobile layouts. The journal SEO/content suite passes 113 checks across all 52 photographic article pages, original publication dates, social metadata, ten substantive new guides and 52 image sitemap associations.

## 2026-11-06: twenty tools for PDFs, photos and everyday calculations

Current totals: **287 tools, 52 articles and 344 sitemap URLs**. The homepage now introduces free online tools for work, study and everyday life. PDF/photo files and everyday calculators come first in the nine-category directory, and six prominent starting links lead to PDF compression, HEIC conversion, OCR, passport-photo sizing, age calculation and loan calculation. Every one of the 287 tool links remains available in initial HTML, and the recent filter contains the new twenty.

New server tools:

1. PDF Compressor — JPEG page downsampling with resolution/quality controls and an original-file fallback when rebuilding is larger.
2. Split PDF — consecutive page groups exported as independent PDFs in a ZIP.
3. Delete PDF Pages — delete page selections and retain the surviving pages in order.
4. PDF to Word — reconstruct existing selectable text and page breaks in an editable DOCX.
5. PDF to PowerPoint — one raster page image per slide, with preserved proportions.
6. Excel to PDF — wrapped worksheet values in a paginated table with repeated headers and horizontal column bands.
7. HEIC to JPG — real HEVC/HEIF decoding through a bundled WASM decoder.
8. Image to Text — English printed-text OCR using a local Tesseract model.
9. Compress Image to KB — bounded JPEG quality search with optional dimension reduction and a checked byte target.
10. Image DPI Converter — density metadata or a fitted millimeter/DPI print canvas.
11. Passport Photo Maker — centered physical-size cropping or a repeated 4 × 6 inch print sheet.
12. Split Image — a complete pixel partition into row/column tiles in a ZIP.

New local tools: Age Calculator, Discount Calculator, Tip Calculator and Bill Splitter, Loan Payment Calculator, Compound Interest Calculator, Final Grade Calculator, GPA Calculator and Recipe Scaler. These show readable summary cards and detail tables. GPA and recipe inputs have editable rows, add/remove controls and no requirement to write CSV or code. Financial illustrations state their interest, contribution timing and excluded-cost assumptions. Tip splitting allocates whole cents so shares sum exactly to the bill. Recipe scaling accepts fractions and mixed numbers while preserving units.

Each page uses the existing metadata, self-canonical, WebApplication/breadcrumb schema, guide, examples, FAQ and related-links architecture. No unimplemented format claims, keyword-volume figures or traffic guarantees were added. The broad task selection follows consumer document/photo workflows represented by services such as [Adobe Acrobat online](https://helpx.adobe.com/document-cloud/faq/try-acrobat-online-services.html) and [iLovePDF](https://www.ilovepdf.com/help/documentation), alongside common school and everyday calculations. These references establish recognizable tasks, not measured search volume for this site.

Format tradeoffs are visible before server conversion. Rebuilt compressed PDFs lose selectable text and interactive content; the original is returned unchanged by default if it is smaller. PDF-to-Word exports text rather than reconstructing layouts or OCR. PowerPoint slides contain page images rather than editable source objects. Excel export uses stored values rather than original workbook print settings and does not recalculate formulas. Passport-photo sizing does not verify official acceptance, face positioning or background rules. HEIC exports the first still image, without auxiliary motion/depth data. OCR is limited to printed English text and requires review.

The twelve server tools extend `server/popular-conversions.mjs` and reuse bounded uploads, isolated conversion workers, output limits and memory-only processing. Existing PDF rendering helpers are shared rather than duplicated. New image outputs have local object-URL previews with cleanup and compression tools show source/result sizes. The API still accepts at most 20 MiB combined files, limits Office inputs to 2 MiB, admits two uploads/conversions and applies its existing body and worker deadlines. Raster images are limited to sixteen million pixels; OCR accepts at most six million. PDF rendering conversions accept at most twenty pages; text-to-Word export accepts fifty. New code does not fetch user-supplied URLs or use third-party conversion services.

Tesseract source, every supported core/WASM build, the English trained-data file, HEIC decoder and original HEIC example are included in the deployment trace. OCR reads a fixed local language path with cacheMethod none, so recognition does not download a model or save a trained-data cache. The website needs Node.js 22.13 or later and its traced packages/assets; no system LibreOffice, Ghostscript, HEIF encoder or external OCR API is required at runtime. System LibreOffice/Poppler/HEIF tools were used only to create synthetic test assets or independently validate results. The PptxGenJS version and scoped image-size override are recorded in the lockfile and checked with real PowerPoint exports.

Validation:

- Popular suite: 47 checks across all twenty tools, including genuine HEIC pixels, English OCR inside the 256 MiB conversion worker, JPEG byte limits, DPI and print dimensions, exact image partitions, PDF chunk contents, calendar boundaries, money allocation, numerical schedules and grade/recipe examples.
- LibreOffice independently opens the generated Word and PowerPoint files and exports both as readable two-page PDFs. Poppler reads generated PDF content and confirms raster-compression text behavior.
- HTTP suite: 126 checks across all 67 server tools, including actual examples/outputs, size limits, Origin validation, cancellation recovery and deployment traces. New OCR/HEIC/PowerPoint assets and supporting packages were separately verified in the final trace.
- Retained suites: growth 209, protocol 75, analysis 48, extended conversions 74 and original server conversions 74 checks.
- Production Webpack build and TypeScript pass. Targeted lint and whitespace checks pass. Static/rendered SEO covers all 255 added pages, 339 tool/article canonicals, 287 homepage tool links and 344 sitemap URLs; the 113 journal checks remain valid.
- `npm audit --omit=dev` reports zero production vulnerabilities. The existing eight moderate development-tool advisories remain; no forced development downgrade was applied.

Primary implementation references: [Tesseract.js](https://github.com/naptha/tesseract.js), [heic-decode](https://github.com/catdad-experiments/heic-decode), [PptxGenJS](https://gitbrent.github.io/PptxGenJS/), [CFPB amortization explanation](https://www.consumerfinance.gov/ask-cfpb/what-is-amortization-and-how-could-it-affect-my-auto-loan-en-771/) and [Investor.gov compound interest calculator](https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator).

Changes are local. No deployment, Git push or search-index submission has been performed.

Final browser validation: **484 checks pass** across all 205 growth-tool interfaces, all 67 server tool examples, local-only calculator requests, summary cards, real output image previews, format notices, editable GPA/recipe rows, homepage search/categories and mobile layouts. The updated desktop homepage screenshot was inspected.

## 2026-11-07: nineteen native file tools and a live timer

Current totals: **307 tools, 52 articles and 364 sitemap URLs**. This batch adds exactly these twenty routes:

1. Word to PDF (DOCX, rendered with LibreOffice).
2. PowerPoint to PDF (PPTX static slide rendering).
3. ODT to PDF.
4. AI Background Remover (local U2NetP model, transparent or solid-background PNG).
5. MP4 to MP3.
6. Video Compressor.
7. Video to GIF.
8. Video Trimmer.
9. Video Resizer.
10. Video to WebM.
11. Audio Converter (MP3, WAV, M4A, OGG, FLAC).
12. Audio Trimmer.
13. Audio Merger.
14. Audio Speed Changer.
15. Mute Video.
16. Extract Video Frames.
17. Password Protect PDF (AES-256).
18. Unlock PDF with a known password.
19. Compare PDF Files (raster visual differences and page geometry report).
20. Online Stopwatch and Countdown Timer.

Nineteen tools use the server; the timer is a local interactive browser session with start, pause, resume, reset, copy-time and stopwatch laps. The homepage now emphasizes document/photo/audio/video tasks, and its six prominent starting links lead to this batch. The existing nine-category catalog retains every tool in initial HTML, and the recent filter contains exactly these twenty additions. All new pages include individual metadata, self-canonicals, WebApplication/breadcrumb schema, instructions, examples, format limits and related links. Modification dates use November 7 without changing old publication dates. The privacy/terms descriptions and sitemap dates now accurately describe per-request temporary processing.

`server/native-conversions.mjs` implements real conversions rather than format-label changes. LibreOffice renders supported modern Office/OpenDocument layouts. FFmpeg/FFprobe process supported local media without replaying remote URLs; inputs are constrained to a format and protocol allowlist. U2NetP inference runs locally through the CPU ONNX binding with telemetry disabled before initialization. pypdf receives passwords only over stdin, never in command-line arguments or saved password files. Upload filenames are not used as filesystem paths. Output audio/video now has browser playback controls, and image/GIF output has an object-URL preview with cleanup.

Native commands run under the parent request supervisor. Each native request has a private temporary directory and separate process groups; TMPDIR/TMP/TEMP also point into that directory. Completion, errors and cancellation stop active commands, terminate the converter worker, await process completion and delete the directory before settling the request. Individual engines have a thirty-second deadline, the native job has forty-five seconds, and a directory-size guard stops working files above sixty-four MiB. Existing conversions retain their twenty-five-second worker deadline. Upload, output, Office ZIP expansion and two-job concurrency limits are retained; the route duration and browser timeout accommodate native jobs.

Office packages are validated for actual expanded size before rendering. Scripts, macros, embedded objects, SVG/HTML subdocuments and externally linked media are rejected; namespaced relationships and ODT links are checked as XML rather than only by a prefix-dependent pattern. Each Office request receives a separate profile with macro execution disabled. Format guides explain font substitution, static presentation export, re-encoding, first-stream selection, codec padding, visual-comparison limits and the requirement to know a PDF password. These are concrete limits, not claims of layout identity, unknown-password recovery or semantic document review.

**Deployment:** the root Dockerfile supplies Node 24, LibreOffice Writer/Impress, FFmpeg/FFprobe, fonts, the isolated Python PDF environment and the Node CPU inference package. NATIVE-RUNTIME.md contains the deployment and host setup commands. Native tools require this container or an equivalently provisioned server; an unchanged Node-only serverless host is insufficient. The image runs as the node user. Local account databases, environment files, keys, Git data and development environments are excluded from the Docker context. The model checksum and CPU inference are tested during image build. No external AI/conversion API key is required.

Validation completed:

- 40 media/native checks across all twenty additions, exercising the actual request supervisor, engines, local AI output, all audio formats, video dimensions/codecs/durations, animated GIF frames, extracted PNGs, PDF encryption/decryption and visual difference counts.
- Cancellation checks start an actual process with a child process, then verify both stop and the private working directory disappears. Separate deadline and malformed/remote-resource input checks pass.
- 164 HTTP/deployment checks pass across all 86 server tools, including the retained converters, genuine output bodies, Origin checking, upload bounds, cancellation recovery, privacy notices and traced assets.
- All 19 new native HTTP conversions also pass inside the built Docker image on a separate localhost port. Its FFmpeg, LibreOffice, Python crypto, CPU inference and existing SQLite binding were independently exercised.
- Retained growth suite: 210 checks. Production Webpack build, TypeScript, targeted lint, content checks and rendered SEO pass. Rendered SEO verifies all 275 added pages, 359 content canonicals, all 307 homepage tool links and 364 sitemap entries.
- Production dependency audit reports zero vulnerabilities; existing moderate development-tool advisories remain outside the production audit.

No keyword-volume statistics, ranking guarantees or guaranteed traffic gains are claimed. Changes and Docker images remain local; no deployment, Git push or search-index submission has been performed.

Final browser validation: **565 checks pass** across all 225 growth-tool interfaces, all server examples, password-field masking, real image/GIF previews, audio/video controls, countdown completion, stopwatch laps/pause/resume, homepage filters and mobile layouts. The final Docker image independently passes all 19 new native HTTP conversions and a clean SQLite initialization check without local account records. The updated homepage screenshot was inspected.


## Vercel compatibility revision — November 7, 2026

The ordinary Next.js Vercel deployment is now the target. Removed the 19 most recent native-engine tools, their pages, related links, catalog entries, AI model and system-process code. The browser stopwatch/countdown remains. Older entries above describe historical batches, including tools that are no longer published. At this historical point the inventory was 288 tools, 52 articles and 345 sitemap URLs. All retained tool links remain in initial homepage HTML. Removed tool URLs return 404 and are absent from sitemap, rather than redirecting visitors to unrelated conversions. The current inventory is documented in the final entry below.

Removed optional SQLite account API, login/register/profile pages and header account controls; tools require no account. Server uploads and outputs are capped at 4 MiB with 64 KiB additional multipart framing allowance. Expanded output is checked before returning a file and produces a small JSON error if too large. Production uses Node 24 and Webpack with explicit worker/OCR/PDF/HEIC/font tracing; the previous Docker/system-engine deployment instructions no longer apply. See VERCEL-DEPLOYMENT.md for current setup and verification limits.

Historical Vercel-targeted validation (before the subsequent 40-tool batch): Node 24 production build and artifact guard pass; 143.24 MiB dependency trace; 129 HTTP checks across 67 server tools on a read-only application filesystem; 5 isolated read-only traced-runtime conversions; 490 browser checks across all 206 growth interfaces, timer controls and mobile catalog; 113 journal checks; 345 sitemap URLs and 288 initial-HTML tool links. A hosted Vercel deployment remains unverified. Current inventory after the later additions: 328 tools, 261 browser tools, 67 server conversions, 52 articles and 385 intended sitemap URLs; the additions have not yet been verified with a production build.
