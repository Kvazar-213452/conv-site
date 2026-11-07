# Conversion example assets

`example.heic` is an original 96 × 64 pixel blue-and-yellow geometric graphic generated for this project. It was encoded offline with `heif-enc`; the deployed converter uses the bundled JavaScript/WASM decoder and does not require that system executable. No external photograph or personal information is included.

OCR examples are generated in memory using the existing bundled Noto Sans font. Language data is supplied by the installed `@tesseract.js-data/eng` package and is read locally with OCR disk caching disabled.
