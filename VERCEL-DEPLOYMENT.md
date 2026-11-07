# Vercel deployment

This checkout targets the ordinary **Next.js preset**, without Container runtime, Large Functions beta, system packages, a persistent disk, database credentials or conversion API keys.

## Project settings

- Framework: **Next.js** (`vercel.json` explicitly selects it).
- Root directory: this repository root.
- Node.js: **24.x**, also pinned in `package.json`.
- Install: the standard `npm ci` / lockfile installation.
- Build: **`npm run build`**, which runs `next build --webpack` and the deployment artifact checks.
- Output directory: leave the Next.js default.
- API runtime: Node.js; conversion route has `maxDuration = 60` seconds.
- No additional environment variables are needed for the retained conversion tools.

If the dashboard contains old custom Install/Build/Output settings, align them with these settings. This revision does not use a Dockerfile or Python requirements. No deployment or Vercel account setting was changed by the local implementation.

## What remains

288 tools: 221 browser tools and 67 server conversions. All 52 articles remain. Sitemap contains 345 URLs. The countdown/stopwatch remains.

Removed 19 tools that introduced system-engine/AI dependencies: Word/PowerPoint/ODT to PDF, background remover, MP4 to MP3, video compressor/GIF/trimmer/resizer/WebM, audio converter/trimmer/merger/speed changer, mute video, video frame extractor, PDF password protection/unlock/compare. Removed URLs return normal 404 responses and are absent from the catalog, related links and sitemap. No unrelated SEO redirects were added.

Optional SQLite accounts, login/register/profile pages and header account controls were removed. All tools work without an account. Existing local account databases are not migrated or published.

## File limits

- At most 8 input files, **4 MiB combined**.
- Entire multipart request: **4 MiB + 64 KiB**, including text and options.
- Office documents retain the stricter **2 MiB** compressed limit.
- Text retains its own 2 MiB character-count bound; serialized UTF-8 request bytes must also fit the request limit.
- Output, including examples: **4 MiB** maximum. Expansion beyond the limit returns a small JSON error, not an oversized download.
- Browser tools retain their own local limits because they do not upload conversion input.

These buffered request/response limits leave headroom beneath Vercel's documented 4.5 MB payload ceiling. They do not provide large-file processing; that would require direct object-storage upload/download and a different job flow.

## Deployment checks

```sh
npm ci
npm run build
npm run check:vercel
npm run check:vercel-runtime
```

`check:vercel` inspects the actual Next.js trace and built route manifest. It rejects missing runtime assets, removed system engines, SQLite account routes and a dependency footprint above 240 MiB. The measured local trace is about **143.24 MiB**, down from 441.20 MiB. This is not a measurement of a remote Vercel artifact; Vercel packaging and platform optional dependencies may differ.

`check:vercel-runtime` copies only traced files to an isolated temporary directory, marks its files and directories read-only, then runs Excel, PDF rendering, HEIC, English OCR and embedded-font PDF conversions without resolving packages from the original checkout. This checks deployment assets that a normal local test can accidentally obtain from untraced files. The temporary test directory is removed afterward.

For the running production server:

```sh
npm run start -- --hostname 127.0.0.1 --port 3100
```

In another terminal:

```sh
npm run check:server-http
```

The HTTP suite covers all 67 server tools, malformed requests, cancellation/concurrency recovery, input/output limits, removed URLs and sitemap. The concurrency bound is per instance, not a global distributed queue.

## Completed local verification

- Production build and artifact checks passed on Node.js 24.
- 129 HTTP/deployment checks passed across all 67 server converters against a Node.js 24 server whose application directory was mounted read-only. This includes oversized uploads, expanded output errors, removed URLs and sitemap.
- The isolated read-only trace test passed on Node.js 24 for Excel, PDF rendering, HEIC, OCR and font assets.
- 180 growth checks, 74 base server-conversion checks and 47 popular-tool checks passed.
- 490 browser checks passed across all 206 growth-tool interfaces, timer controls, mobile layouts and homepage search/category/recent filters.
- 113 journal checks passed; rendered SEO checks confirm 345 sitemap URLs and all 288 tool links in initial homepage HTML.
- `npm audit --omit=dev` reported zero vulnerabilities. Local full audit still reports the previously existing moderate development-dependency findings.

These tests used local Linux/Docker environments, not the Vercel hosted runtime.

## Remaining verification on Vercel

A real Vercel preview has not been created by this change. After deploying, check build/function logs and test `/api/convert/heic-to-jpg?example=1`, OCR, PDF rendering, and `/sitemap.xml`. Test conversions through the page controls as well as example downloads: native Sharp/canvas binaries must match Vercel's runtime, and CPU/cold-start behavior can differ from local tests. The same 25-second worker deadline applies to each conversion. Passing local and isolated Node 24 checks does not substitute for this hosted smoke test.

Official references: [Functions limits](https://vercel.com/docs/functions/limitations), [Node.js versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions), [Next.js file tracing](https://nextjs.org/docs/app/api-reference/config/next-config-js/output), [SQLite storage limitations](https://vercel.com/kb/guide/is-sqlite-supported-in-vercel).
