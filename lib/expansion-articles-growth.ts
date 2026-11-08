// Fifty practical, English-language guides requested for the blog expansion.
// Each guide uses the same three-section editorial structure as the existing journal.
export const growthArticles = [
  {
    slug: 'how-to-merge-pdf-files-online', title: 'How to Merge PDF Files Online: A Simple Guide',
    description: 'Learn how to merge PDF files online, arrange pages in the right order, and download one clean document without changing the originals.',
    intro: 'To merge PDF files, put the source documents in the order you want, combine them, then check the page sequence in the finished file. This is useful for applications, reports, invoices, and scanned records that belong together. Keep an untouched copy of every original before combining sensitive or important documents. The free PDF merger on this site processes files in your browser, so you can assemble a document without uploading it to a conversion service.',
    sections: [
      { heading: 'Put the documents in reading order', body: 'Rename files with a numeric prefix such as 01-cover.pdf, 02-form.pdf, and 03-attachments.pdf before selecting them. This makes the intended sequence clear even when a file picker sorts names alphabetically. Upload the files together, then use the page or file controls to move any item that landed in the wrong position. If one source has landscape pages or a different paper size, decide whether that difference is acceptable before merging; combining files does not automatically normalize their layout.' },
      { heading: 'Merge, then inspect the result', body: 'Run the merge and open the downloaded PDF in a viewer. Check the first and last page of each source, page orientation, blank pages, and any forms that need to remain fillable. A merger can preserve pages while still producing a document that is too large for an email limit, so check the file size too. If the PDF contains confidential records, use a trusted device and avoid shared computers. Keep the original files until the recipient confirms the combined document opens correctly.' },
      { heading: 'Handle signatures and accessibility carefully', body: 'A digital signature usually applies to a particular version of a PDF. Changing that file by merging it can invalidate the signature, even if the visible mark remains. Ask the signer for an unsigned source or have the final combined file signed afterward. Scanned pages may be images without searchable text; merging does not add OCR. For screen-reader use, confirm that the final document has tags, reading order, and meaningful page labels instead of assuming those features survived from every source.' }
    ],
    example: 'Files in order:\n01-cover.pdf\n02-application.pdf\n03-supporting-documents.pdf\n\nOutput: application-package.pdf',
    question: 'Can I merge PDF files without uploading them?', answer: 'Yes. A browser-based merger can combine files locally on your device; check the tool description and avoid services that require sending private documents to a server.',
    source: 'https://www.loc.gov/preservation/digital/formats/fdd/fdd000030.shtml', tool: 'pdf-merger', date: '2026-11-08'
  },
  {
    slug: 'how-to-compress-pdf-under-1mb', title: 'How to Compress a PDF Under 1 MB',
    description: 'Find out how to compress a PDF under 1 MB by reducing image size, removing unused content, and checking legibility before you send it.',
    intro: 'A PDF can exceed a 1 MB upload limit because it contains high-resolution photos, embedded fonts, or duplicated resources. Compression reduces the bytes stored in the file, but aggressive settings can make text or evidence unreadable. Start with a copy, choose a target size, and compare the compressed pages at normal zoom before submitting. If the receiver sets a strict limit, leave a little room below it because websites may calculate file size differently from the rounded value shown by your operating system.',
    sections: [
      { heading: 'Reduce the largest content first', body: 'Scanned pages and photographs usually take more space than selectable text. Lowering image resolution and using efficient image compression can make a large difference, especially when the source was scanned at print quality. Remove pages that are not part of the submission and avoid embedding duplicate images. Fonts should remain embedded when needed for correct display. Do not convert every page to a low-quality image just to reach a number; that can remove searchable text and make small print difficult to read.' },
      { heading: 'Use a target size and verify every page', body: 'Upload a copy to a PDF compressor and set a maximum size if the tool supports it. A target of 950 KB is safer than aiming for exactly 1,000 KB when a portal limit is described as 1 MB. Download the result and inspect charts, signatures, barcodes, and fine print at 100 percent zoom. Compare the before and after versions page by page. If a signature, stamp, or medical image becomes unclear, choose lighter compression and ask the recipient whether a larger file is acceptable.' },
      { heading: 'Try alternatives when compression is not enough', body: 'If the source is already mostly text, repeated compression may barely change its size. Split a document into permitted parts, remove unnecessary attachments, or export the original office file with a smaller image setting. Some portals accept a secure link instead of an attachment. Never remove embedded fonts or flatten interactive forms without checking the submission instructions. A compressed PDF should remain complete, readable, and acceptable to the organization receiving it.' }
    ],
    example: 'Original: 4.8 MB scanned application\nTarget: 950 KB\nAfter compression: 812 KB\nCheck: signatures readable at 100% and all 12 pages present',
    question: 'Will compressing a PDF make it blurry?', answer: 'It can if image quality is reduced too far. Review photos, small text, barcodes, and signatures in the downloaded result before sending it.',
    source: 'https://www.loc.gov/preservation/digital/formats/fdd/fdd000030.shtml', tool: 'pdf-compressor', date: '2026-11-08'
  },
  {
    slug: 'how-to-convert-heic-to-jpg', title: 'How to Convert HEIC to JPG on Any Device',
    description: 'Learn how to convert HEIC to JPG for websites, email, and older apps while keeping the original photo and checking image quality.',
    intro: 'HEIC is a space-efficient photo format used by many phones, while JPG is accepted by nearly every website and image editor. Convert a HEIC image when an upload form rejects it or a recipient cannot open it. Keep the HEIC original: conversion creates a new file and may discard features such as depth data, edits, or some metadata. This guide explains a quick conversion workflow and how to avoid confusing a file extension change with a real image conversion.',
    sections: [
      { heading: 'Choose the right conversion method', body: 'Select the HEIC photo in a converter that supports the format, choose JPG as the output, and export a new copy. On a phone, check whether the photo app can export a compatible copy; on a computer, use a trusted local converter when images are private. Renaming photo.heic to photo.jpg does not convert its encoded image data. It only changes the label, so apps may still report an unsupported file or show a decoding error.' },
      { heading: 'Balance compatibility and image quality', body: 'JPG uses lossy compression, so a conversion setting may trade file size for detail. For a normal photo, a high-quality setting is usually a good starting point. Avoid converting the same image repeatedly because each lossy export can add artifacts. If transparency or exact pixel data matters, JPG may be the wrong output; use PNG or another supported format instead. Check dimensions and compare fine detail after conversion, especially around text, hair, and high-contrast edges.' },
      { heading: 'Check metadata before sharing', body: 'Photos can contain camera details, timestamps, and GPS coordinates. A converter may preserve or remove metadata depending on its settings. Before sharing a personal photo publicly, inspect the exported file and remove location information if you do not want it disclosed. Keep the original in a separate folder until the JPG opens on the destination device. When converting a batch, use clear filenames and confirm that every output corresponds to the expected source image.' }
    ],
    example: 'Input: vacation-photo.heic\nOutput format: JPG\nOutput name: vacation-photo.jpg\nQuality: 90%\nKeep: vacation-photo.heic as the original',
    question: 'Does changing .heic to .jpg convert the photo?', answer: 'No. Renaming changes only the filename extension. Use an image converter that decodes HEIC and exports a real JPG file.',
    source: 'https://support.apple.com/en-us/116944', tool: 'heic-to-jpg', date: '2026-11-08'
  },
  {
    slug: 'how-to-remove-pdf-password', title: 'How to Remove a Password from a PDF',
    description: 'See how to remove a PDF password you are authorized to use, save an unprotected copy, and keep the original file secure.',
    intro: 'If you know a PDF’s password and are allowed to edit the document, you can open it and save an unencrypted copy. This is useful when you need to share a document with an approved workflow that cannot handle protected files. A password remover is not a way to bypass access controls: do not attempt to open files you do not own or have permission to process. Make sure the unprotected copy is stored and sent securely because anyone with the file may be able to read it.',
    sections: [
      { heading: 'Confirm you have permission and the password', body: 'Check with the document owner before changing its security. Some PDFs have an opening password that is required to read the content; others restrict printing or editing. A browser tool may ask you to provide the opening password so it can decrypt the file locally. If you do not know the password, request an accessible copy from the owner rather than trying random passwords or third-party unlock services. Organizational policies may require protected storage even after you make an authorized copy.' },
      { heading: 'Create a separate unprotected copy', body: 'Choose the PDF and enter the known password in the authorized tool. Save the result under a new filename so the original remains unchanged. Open the new copy and verify that all pages, form fields, bookmarks, and annotations are present. Some PDF security options are not identical across viewers, so inspect the document in the application your recipient uses. Do not overwrite the only copy of a signed or legally significant file.' },
      { heading: 'Protect the document after removing security', body: 'An unprotected PDF can be forwarded or copied without the original password. Store it in an access-controlled location and delete temporary downloads from shared devices. If the purpose is to send the document, use the recipient’s approved secure transfer method. A digital signature can become invalid when a PDF is altered, so check the signature panel after processing. For compliance records, retain the protected original and document why an unencrypted copy was created.' }
    ],
    example: 'Authorized workflow:\n1. Open client-record.pdf with its supplied password.\n2. Save a separate file as client-record-approved-copy.pdf.\n3. Reopen it and verify pages and signature status.',
    question: 'Can I remove a PDF password if I do not know it?', answer: 'This tool is intended for files you are authorized to access and for which you know the password. Ask the document owner for a valid copy if you do not.',
    source: 'https://qpdf.readthedocs.io/en/stable/cli.html#option-encrypt', tool: 'pdf-password-protector', date: '2026-11-08'
  },
  {
    slug: 'how-to-convert-image-to-text-ocr', title: 'How to Convert an Image to Text with OCR',
    description: 'Convert an image to text with OCR, improve recognition with a clear scan, and proofread names, numbers, and formatting afterward.',
    intro: 'Optical character recognition (OCR) turns text inside a photo or scan into editable words. Use it to copy a receipt, digitize a printed page, or make a screenshot searchable. OCR is a recognition estimate, not a perfect transcription: blur, glare, handwriting, unusual fonts, and low contrast can change characters. Start with the clearest image available and review the result against the original before relying on a name, amount, address, or other important detail.',
    sections: [
      { heading: 'Prepare a readable source image', body: 'Place the page flat, keep the camera parallel to it, and use even light without reflections. Crop away unrelated background but leave a small margin around the text. For a scan, choose a resolution high enough to make individual characters distinct; enlarging a tiny blurry screenshot will not restore missing detail. Rotate the image so lines read horizontally. If the page has multiple columns, tables, or mixed languages, expect to check reading order and language recognition manually.' },
      { heading: 'Run OCR and correct likely errors', body: 'Upload a supported image to the OCR tool and choose the language when that option is available. Compare the output with the source, focusing on characters that look alike, such as O and 0, I and 1, commas and decimal points, or rn and m. Tables may be returned as plain text with spacing that does not preserve columns. Retain a copy of the source image so you can resolve ambiguous words rather than guessing from context.' },
      { heading: 'Use OCR output as a draft', body: 'OCR can save retyping time, but it does not certify that a document is authentic or complete. Verify totals and identifiers independently before using the text in a payment, form, or database. For searchable PDFs, run OCR on every page and check the text layer by searching for a phrase that appears in the scan. Treat personal or confidential scans carefully, and choose a local-processing tool when you do not want the image sent to an outside service.' }
    ],
    example: 'Image text: Invoice total $1,280.50\nOCR draft: Invoice total $1,28O.50\nCorrection after visual check: Invoice total $1,280.50',
    question: 'Why does OCR make mistakes?', answer: 'OCR estimates characters from pixels. Blur, skew, glare, low contrast, and similar-looking letters or digits can produce errors that need proofreading.',
    source: 'https://www.nist.gov/programs-projects/optical-character-recognition-ocr', tool: 'image-to-text', date: '2026-11-08'
  },
  {
    slug: 'how-to-resize-image-without-losing-quality', title: 'How to Resize an Image Without Losing Quality',
    description: 'Resize an image without unnecessary quality loss by choosing the right dimensions, preserving its aspect ratio, and exporting once.',
    intro: 'To resize an image cleanly, decide the required pixel dimensions, preserve the original aspect ratio, and export from the highest-quality source you have. Making an image smaller usually looks good because extra pixels are discarded. Making it much larger cannot recreate detail that was never captured. The right settings depend on whether the image is for a website, social post, print, or a form with strict dimensions. Keep the original file so you can create other sizes later.',
    sections: [
      { heading: 'Start with the destination dimensions', body: 'Check the platform or document requirement before editing. A profile avatar, a product listing, and a print poster need different dimensions and may have different file-size limits. Choose a crop ratio that matches the destination instead of stretching the image. Enable “lock aspect ratio” and enter one dimension; calculate the other proportionally. If the destination requires a square, crop intentionally and preview the subject before exporting so important parts are not cut off.' },
      { heading: 'Choose a suitable format and quality', body: 'Use JPEG for photographs when a smaller file is important, PNG for sharp graphics or transparency, and WebP where the destination accepts it. Avoid saving a JPEG repeatedly; each lossy export can soften edges and introduce artifacts. If the resized image will be edited again, keep a lossless or original copy. When a site specifies a maximum file size, adjust quality gradually and inspect fine detail rather than choosing the smallest possible file by default.' },
      { heading: 'Understand upscaling and print resolution', body: 'Upscaling interpolates new pixels between existing ones. It can make an image larger on screen but does not restore true texture or focus. For print, pixel dimensions and intended physical size both matter: the same file produces different print density at different dimensions. Check the image at the size it will be used. Keep color profiles when a color-managed workflow depends on them, and verify that metadata does not reveal location information you would rather remove.' }
    ],
    example: 'Original: 2400 × 1600 px\nTarget width: 1200 px\nProportional height: 800 px\nExport: WebP for web, or JPEG if the destination requires it',
    question: 'Can I enlarge a small image without losing quality?', answer: 'Not completely. Upscaling can smooth or infer pixels, but it cannot recover detail absent from the original source.',
    source: 'https://www.w3.org/TR/css-images-3/#the-object-fit', tool: 'image-resizer', date: '2026-11-08'
  },
  {
    slug: 'how-to-convert-webp-to-jpg', title: 'How to Convert WebP to JPG for Any App',
    description: 'Convert WebP to JPG for apps that do not support WebP, choose a useful quality setting, and keep transparency in mind.',
    intro: 'WebP often makes web images smaller, but older apps, upload forms, or document workflows may only accept JPG. Converting creates a compatible copy while leaving the original WebP available. JPG does not support transparency, so transparent pixels need a background color during conversion. Choose a high-quality export for photographs and verify the result in the destination app. Renaming a WebP file to .jpg does not change its format and will not make an unsupported image readable.',
    sections: [
      { heading: 'Convert the image data, not just the filename', body: 'Open the WebP file in a converter that can decode the format, select JPG as the output, and download the converted copy. Keep a clear filename so you can tell the original from the export. If a converter reports an unsupported file, first check that the source is a valid WebP and not an HTML download with a .webp extension. A real conversion decodes the image and writes a new JPEG stream with the proper file signature.' },
      { heading: 'Choose a background for transparent pixels', body: 'JPG stores colors for every pixel and has no alpha channel. A transparent WebP therefore needs to be composited against a solid color, commonly white, before saving as JPG. Preview the edges on both light and dark backgrounds to spot halos. If transparency is important for a logo, sticker, or icon, use PNG or WebP instead. Converting a transparent asset to JPG can permanently replace the transparent regions with the chosen background.' },
      { heading: 'Check size, quality, and metadata', body: 'JPEG quality settings balance file size and visual detail. Start high, then reduce the setting only if an upload limit requires it. Check gradients, fine text, and edges at normal viewing size. Converting to JPG may remove animation because JPG is a still-image format. Review metadata before sharing photos if they contain camera or location details. Keep the original WebP as the master file in case you need a transparent or higher-quality version later.' }
    ],
    example: 'Source: product-photo.webp\nOutput: product-photo.jpg\nTransparency: composite onto white\nQuality: 88%\nVerify: opens in the target application',
    question: 'Does JPG keep transparency from WebP?', answer: 'No. JPG has no transparency channel. Choose a background color or export to PNG if transparent pixels must remain transparent.',
    source: 'https://developers.google.com/speed/webp/docs/webp_study', tool: 'webp-to-jpg', date: '2026-11-08'
  },
  {
    slug: 'how-to-split-pdf-pages', title: 'How to Split PDF Pages into Separate Files',
    description: 'Split PDF pages into smaller files or extract selected pages, then verify page ranges and filenames before sharing.',
    intro: 'Splitting a PDF separates a large document into smaller files or extracts specific pages for a form, report, or application. First decide whether you need one file per page, a group of page ranges, or only selected pages. Page numbers usually refer to the PDF’s physical sequence, which may differ from printed page labels. Work from a copy, then open every output to confirm that the requested pages appear in the right file and order.',
    sections: [
      { heading: 'Choose page ranges deliberately', body: 'Use comma-separated page numbers for individual pages and ranges such as 3-7 for continuous sections, if supported. A request like 1-3, 8, 10-12 creates three groups rather than one continuous range. Check the viewer’s page thumbnails before processing, especially when a cover or table of contents is not numbered. Avoid assuming that the label printed on the page matches its position in the PDF file.' },
      { heading: 'Name output files so they stay organized', body: 'Use descriptive names that identify the contents, not only a generic sequence such as output-1. For example, application-pages-1-4.pdf is easier to match with a request than split-1.pdf. If the tool downloads a ZIP archive, extract it into a dedicated folder and verify that the archive contains the expected number of documents. Keep the source PDF until each split file opens and has been reviewed.' },
      { heading: 'Check signatures, forms, and document context', body: 'A digital signature can be invalidated when a PDF is split or otherwise modified. Interactive fields, bookmarks, and links may also behave differently in a new file. Before sending an extracted page, consider whether it depends on preceding definitions, a legend, or a signature page. Remove pages only when you are authorized to do so, and protect sensitive outputs as carefully as the full source document.' }
    ],
    example: 'Source: report.pdf (18 pages)\nGroup 1: pages 1-4 → report-summary.pdf\nGroup 2: pages 5-18 → report-appendix.pdf',
    question: 'Can I extract just one page from a PDF?', answer: 'Yes. Select the page number or range you need, export it as a separate PDF, and confirm the resulting file contains the expected page.',
    source: 'https://www.loc.gov/preservation/digital/formats/fdd/fdd000030.shtml', tool: 'pdf-splitter', date: '2026-11-08'
  },
  {
    slug: 'how-to-calculate-compound-interest', title: 'How to Calculate Compound Interest Step by Step',
    description: 'Calculate compound interest with the right rate and compounding period, then compare how regular contributions change a savings balance.',
    intro: 'Compound interest adds earned interest to a balance, so later interest can be earned on both the original principal and earlier growth. To estimate a future balance, you need the starting amount, annual rate, compounding frequency, and time. Contributions and fees change the result, and a quoted rate may not equal the return you actually receive. Use a calculator to explore assumptions, then compare its estimate with the account’s official terms before making a financial decision.',
    sections: [
      { heading: 'Use a consistent rate and time unit', body: 'For a fixed annual nominal rate, a common formula is A = P(1 + r/n)^(nt), where P is principal, r is the annual rate as a decimal, n is the number of compounding periods per year, and t is years. Convert 5% to 0.05, not 5. Match the frequency to the account terms. An annual rate, effective annual yield, and variable rate are not interchangeable; identify which one your source provides.' },
      { heading: 'Add contributions and fees separately', body: 'Regular deposits make the future value higher, but timing matters: a deposit at the beginning of each period earns longer than one at the end. A basic compound-interest result may not include recurring deposits, taxes, account fees, or inflation. Model each cash flow with a calculator that supports contributions, or use a spreadsheet and record the timing convention. Compare the nominal balance with purchasing power after inflation instead of treating a larger currency amount as guaranteed real growth.' },
      { heading: 'Test scenarios instead of predicting returns', body: 'Try a conservative, middle, and higher rate so you can see how sensitive the result is to the assumption. Historical performance does not guarantee a future return, and investment values can fall. Check whether the calculator compounds continuously, monthly, daily, or on another schedule. Save your inputs with the result so another person can reproduce it. Use regulated financial guidance for decisions involving retirement, debt, or investment risk.' }
    ],
    example: 'Principal: $5,000\nAnnual rate: 4% = 0.04\nCompounding: monthly (n = 12)\nTime: 3 years\nA = 5000 × (1 + 0.04/12)^(12×3) ≈ $5,637.04',
    question: 'Is compound interest guaranteed to grow an investment?', answer: 'No. The formula models a stated rate. Investment returns can vary, and fees, taxes, and losses can change the actual result.',
    source: 'https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator', tool: 'compound-interest-calculator', date: '2026-11-08'
  },
  {
    slug: 'how-to-calculate-bmi', title: 'How to Calculate BMI and Understand the Result',
    description: 'Calculate BMI from height and weight, convert units correctly, and understand why BMI is a screening measure rather than a diagnosis.',
    intro: 'Body mass index (BMI) compares weight with height using a simple ratio. Adults can calculate it from kilograms and meters or pounds and inches, but the result is only a screening measure. It does not directly measure body fat or distinguish muscle from fat. Use a BMI calculator to check the arithmetic, then consider age, health history, and clinical guidance before drawing conclusions. BMI categories are interpreted differently for children and teens, where age and sex percentiles are used.',
    sections: [
      { heading: 'Enter weight and height in matching units', body: 'For metric units, BMI equals weight in kilograms divided by height in meters squared. For U.S. customary units, multiply weight in pounds by 703, then divide by height in inches squared. Enter the units exactly as shown and avoid mixing centimeters with meters. Rounding height too early can shift the result, so use a reasonably precise measurement. A calculator can prevent arithmetic slips, but it cannot confirm that the measurement itself is accurate.' },
      { heading: 'Read adult ranges with context', body: 'Common adult BMI categories use thresholds such as 18.5, 25, and 30, but they are population-level screening ranges rather than a diagnosis for an individual. Body composition, pregnancy, fluid retention, age, and some health conditions affect interpretation. A muscular person may have a higher BMI without excess body fat, while a person can have health risks at a BMI within a typical range. Discuss a concerning result with a qualified clinician.' },
      { heading: 'Use a different method for children', body: 'For people ages 2 through 19, BMI is interpreted using a percentile that accounts for age and sex, not the adult categories. A standard adult calculator cannot provide that clinical interpretation. For children, use guidance from a pediatric healthcare professional or an official child growth chart. Do not use a single number to label a child’s health, diet, or body image. Seek urgent care for acute symptoms regardless of a calculated BMI value.' }
    ],
    example: 'Metric example:\nWeight = 70 kg\nHeight = 1.75 m\nBMI = 70 / (1.75 × 1.75) = 22.86',
    question: 'Is BMI the same as body fat percentage?', answer: 'No. BMI uses height and weight. Body-fat percentage estimates the share of body mass made up of fat and requires different measurements.',
    source: 'https://www.cdc.gov/bmi/adult-calculator/bmi-categories.html', tool: 'bmi-calculator', date: '2026-11-08'
  },
  {
    slug: 'how-to-calculate-mortgage-payment', title: 'How to Calculate a Monthly Mortgage Payment',
    description: 'Calculate a monthly mortgage payment from loan amount, interest rate, and term, then account for taxes and insurance separately.',
    intro: 'A mortgage payment estimate starts with the principal, annual interest rate, and loan term. A standard fixed-rate formula estimates principal and interest, but a household’s full housing cost also includes property tax, insurance, fees, and sometimes association dues. Use consistent units and treat the output as an estimate. Lenders may calculate payments using different dates, fees, and escrow rules, so compare the calculator with a written loan estimate before accepting an offer.',
    sections: [
      { heading: 'Find the amount actually borrowed', body: 'Subtract the down payment from the purchase price, then add any financed costs that belong in the loan. Do not enter the home price as the principal if you are borrowing less than the full amount. Convert the annual interest rate to a monthly rate by dividing by 12, and convert a 30-year term to 360 monthly payments. Check whether the quoted rate is fixed or adjustable and whether points or other fees are included.' },
      { heading: 'Calculate principal and interest', body: 'For a fixed-rate loan, the monthly payment formula is M = P × i(1+i)^n / ((1+i)^n − 1), where P is principal, i is the monthly interest rate, and n is the total number of payments. At a zero interest rate, divide principal by the number of payments instead. A mortgage calculator applies this formula and can show a schedule, but the result does not include every cost of owning a home.' },
      { heading: 'Build a complete monthly budget', body: 'Add estimated property taxes, homeowners insurance, mortgage insurance when required, and association fees to principal and interest. Taxes and premiums can change over time. Maintenance, utilities, and closing costs are also separate from the loan payment. Compare a monthly estimate with your emergency savings and other debt obligations. A lender’s official loan estimate provides standardized cost disclosures; use it to confirm fees and payment timing rather than relying only on a web calculator.' }
    ],
    example: 'Loan: $320,000\nFixed annual rate: 6.5%\nTerm: 30 years = 360 payments\nEstimated principal + interest: about $2,023/month\nAdd taxes, insurance, and fees separately',
    question: 'Does a mortgage calculator include property tax?', answer: 'Only if you enter it. The basic mortgage formula covers principal and interest; taxes, insurance, and other housing costs should be added separately.',
    source: 'https://www.consumerfinance.gov/owning-a-home/loan-estimate/', tool: 'mortgage-payment-calculator', date: '2026-11-08'
  },
  {
    slug: 'how-to-calculate-loan-amortization', title: 'How to Calculate a Loan Amortization Schedule',
    description: 'Build a loan amortization schedule that shows each payment, interest charge, principal reduction, and remaining balance over time.',
    intro: 'An amortization schedule breaks a fixed loan into payments and shows how each payment changes the balance. Early payments on many standard loans contain more interest because the outstanding principal is still large. To calculate a schedule, use the principal, periodic interest rate, payment amount, and payment dates. A calculator is useful for estimates, while the lender’s contract controls actual timing, rounding, and fees. Check the schedule against the payment amount on your statement.',
    sections: [
      { heading: 'Calculate the periodic payment', body: 'Convert the annual rate into the rate for each payment period and multiply the number of periods by the term. For a monthly schedule, a 6% nominal annual rate is often modeled as 0.06 divided by 12, with 12 payments per year. Loan products can define rates and payment conventions differently, so read the note on your contract. If the rate changes, a single fixed-rate schedule no longer describes future payments.' },
      { heading: 'Separate interest from principal', body: 'For each period, calculate interest as the beginning balance multiplied by the periodic rate. Subtract that interest from the payment to find the principal reduction. Then subtract principal paid from the beginning balance to get the new balance. Repeat for each payment and account for rounding to cents. If the payment does not cover the interest due, the balance may grow rather than fall; check for negative amortization and fees instead of assuming every loan reduces principal.' },
      { heading: 'Compare early repayment scenarios', body: 'An extra principal payment can reduce later interest, but servicers may require it to be marked as principal-only. Verify the lender’s instructions and any prepayment terms before sending extra funds. Compare schedules using the same rate, payment date, and rounding rules. A web estimate may differ slightly from a statement because lenders use daily interest, payment posting dates, or other conventions. Keep the official amortization disclosure for contractual planning.' }
    ],
    example: 'Starting balance: $10,000\nMonthly rate: 0.5%\nPayment: $500\nMonth 1 interest: $10,000 × 0.005 = $50\nPrincipal paid: $500 − $50 = $450\nNew balance: $9,550',
    question: 'Why does the interest portion decrease over time?', answer: 'With a fixed rate, interest is calculated on the remaining balance. As principal is paid down, the next period’s interest charge usually falls.',
    source: 'https://www.consumerfinance.gov/ask-cfpb/what-is-an-amortization-schedule-en-209/', tool: 'loan-amortization-calculator', date: '2026-11-08'
  },
  {
    slug: 'how-to-calculate-percentage', title: 'How to Calculate a Percentage in Three Steps',
    description: 'Learn how to calculate a percentage, find a percent of a number, and compare percentage change without mixing up the formulas.',
    intro: 'A percentage expresses a value as parts per hundred. The main calculations are finding a percent of a number, finding what percent one number is of another, and finding the percentage change between two values. These sound similar but use different divisions. Write down what the result should mean before entering numbers. A percentage calculator can check your arithmetic, but you still need to choose the right formula and identify the correct starting value.',
    sections: [
      { heading: 'Find a percent of a number', body: 'Convert the percent to a decimal by dividing by 100, then multiply by the number. For example, 15% of 80 is 0.15 × 80 = 12. For a discount, subtract that amount from the original price; the discount amount itself is not the final price. For tax, add the calculated tax when the quoted price excludes it. Check whether the displayed price already includes tax to avoid adding it twice.' },
      { heading: 'Find what percent one value is', body: 'Divide the part by the whole and multiply by 100. If 18 of 60 questions are correct, 18 ÷ 60 × 100 = 30%. Confirm that the denominator is the full group you mean to compare against. A percentage is undefined when the whole is zero. When the group sizes differ, percentages can be more useful than raw counts, but include the sample size so readers understand how much data supports the comparison.' },
      { heading: 'Calculate percentage change from the original', body: 'Subtract the original value from the new value, divide by the original, and multiply by 100. A change from 50 to 60 is (60 − 50) ÷ 50 × 100 = 20% increase. Reversing the comparison uses a different denominator: from 60 to 50 is a 16.7% decrease. State the baseline explicitly. Percentage points describe the difference between two percentages and should not be confused with percent change.' }
    ],
    example: '15% of 80 = 0.15 × 80 = 12\n18 out of 60 = 18 / 60 × 100 = 30%\nChange from 50 to 60 = (60 − 50) / 50 × 100 = 20%',
    question: 'How do I calculate percentage increase?', answer: 'Subtract the original from the new value, divide by the original value, and multiply by 100. Use the original as the baseline.',
    source: 'https://www.nist.gov/pml/owm/metric-si/si-units', tool: 'percentage-calculator', date: '2026-11-08'
  },
  {
    slug: 'how-to-calculate-tip', title: 'How to Calculate a Tip and Split the Bill',
    description: 'Calculate a restaurant tip from the amount you choose, decide whether tax is included, and split the final bill fairly.',
    intro: 'A tip is usually calculated as a percentage of a restaurant bill, then added to the amount due. When a group shares a meal, the fairest split may depend on what each person ordered rather than dividing the total evenly. Check whether the receipt already includes a service charge and whether your group expects a tip based on the pre-tax amount. A tip calculator can make the arithmetic quick and show each person’s share before anyone pays.',
    sections: [
      { heading: 'Choose the base amount consistently', body: 'Decide whether the tip percentage applies to the pre-tax subtotal or the final total. Practices vary by location and restaurant, so follow your group’s agreement and local norms. Multiply the chosen base by the tip rate as a decimal: 18% becomes 0.18. Add the tip to the bill to find the total. If a service charge is already listed, ask whether it replaces or supplements a voluntary tip rather than adding a second amount automatically.' },
      { heading: 'Split by equal shares or individual orders', body: 'An equal split works when everyone agrees to share the cost. Divide the total including tip by the number of people and round cents in a way that preserves the sum. If people ordered different amounts, enter each person’s subtotal and allocate the tip in proportion to those subtotals. This keeps someone who ordered less from paying the same amount as someone who ordered more. Account for shared appetizers separately if your group wants to divide them evenly.' },
      { heading: 'Check rounding and payment methods', body: 'Card terminals may suggest a tip using different bases, and cash payments can require convenient rounding. Agree on a method before sending payments so the collected amounts add up to the receipt. If one person pays the restaurant, settle only after confirming the itemized total, taxes, discounts, and included charges. A calculator estimates shares; it cannot decide what is fair for a specific group, so show everyone the calculation.' }
    ],
    example: 'Subtotal: $80.00\nTip: 18% × $80 = $14.40\nTotal: $94.40\nFour equal shares: $23.60 each',
    question: 'Should I calculate a tip before or after tax?', answer: 'Customs vary. Choose a basis your group and local practice consider appropriate, and check whether the bill already includes a service charge.',
    source: 'https://www.irs.gov/businesses/small-businesses-self-employed/tip-recordkeeping-and-reporting', tool: 'tip-calculator', date: '2026-11-08'
  },
  {
    slug: 'how-to-calculate-gpa', title: 'How to Calculate GPA from Course Grades',
    description: 'Calculate GPA using course credits and grade points, and check whether your school uses a weighted or unweighted grading scale.',
    intro: 'A grade point average is commonly calculated by multiplying each course’s grade points by its credit value, adding those products, and dividing by the total credits. Schools can use different scales, plus weighted grades for honors or advanced courses. Before calculating, find the scale in your institution’s handbook. A GPA calculator can organize the math, but it cannot determine how your school handles pass/fail classes, repeats, transfer credit, or rounding.',
    sections: [
      { heading: 'Convert each grade using your school’s scale', body: 'Do not assume every school maps letter grades to the same points. One school may use a 4.0 scale, while another adds grade points for advanced courses or handles plus and minus grades differently. Find the official grading policy and enter the grade points, not the percentage, unless the school explicitly maps percentages directly. For cumulative GPA, confirm whether transfer courses and repeated classes are included in the calculation.' },
      { heading: 'Weight grade points by course credits', body: 'For each class, multiply grade points by credits. Add all the quality points and divide by the sum of included credits. A four-credit course should count more than a one-credit course when the policy is credit-weighted. Exclude courses that the school marks as non-GPA credit, such as some pass/fail classes, if required. Keep full precision during calculation and round only at the end using the institution’s stated rule.' },
      { heading: 'Compare your result with the transcript', body: 'Use the official transcript as the source for recorded grades and credits. A semester estimate may differ from the cumulative GPA because of previous coursework, withdrawals, repeated classes, or institutional rounding. If you are checking eligibility for a scholarship or program, use the definition that program requests; some recalculate GPA from selected courses. Ask the registrar when a transcript policy is unclear instead of relying on an online estimate.' }
    ],
    example: 'Course A: 4.0 points × 3 credits = 12 quality points\nCourse B: 3.0 points × 4 credits = 12 quality points\nGPA = (12 + 12) / (3 + 4) = 3.43',
    question: 'Do all colleges calculate GPA the same way?', answer: 'No. Grade scales, credit weighting, repeated courses, and rounding policies vary. Use the grading rules published by your school.',
    source: 'https://registrar.berkeley.edu/academic-records/grades/grade-points/', tool: 'gpa-calculator', date: '2026-11-08'
  },
  {
    slug: 'salary-to-hourly-conversion', title: 'How to Convert Salary to an Hourly Rate',
    description: 'Convert an annual salary to an hourly rate by using realistic work hours, paid weeks, and a consistent gross-pay calculation.',
    intro: 'To estimate an hourly equivalent for a salary, divide annual gross pay by the hours worked in a year. The result depends on the schedule you choose: a 40-hour week for 52 weeks is 2,080 hours, but unpaid leave, overtime, or a part-time schedule changes the denominator. This calculation helps compare job offers, not determine take-home pay. Taxes, benefits, bonuses, and local employment rules should be evaluated separately.',
    sections: [
      { heading: 'Use the actual paid schedule', body: 'Start with annual base salary before taxes and deductions. Multiply paid hours per week by paid working weeks per year. If you work 40 hours for 52 weeks, the annual hours are 2,080. If the salary covers fewer weeks or a shorter schedule, use those figures instead. Do not include overtime hours unless the salary is intended to compensate for them. State your assumptions so another person can reproduce the estimate.' },
      { heading: 'Separate base pay from benefits', body: 'A salary may include a bonus, commission, health insurance, retirement match, paid leave, or other benefits. These items do not all convert into cash wages, and their value depends on eligibility and use. Calculate the base hourly equivalent first, then compare benefits in separate columns. For contractors, account for unpaid time, business expenses, insurance, and taxes before comparing a contract rate with an employee salary.' },
      { heading: 'Compare offers on the same basis', body: 'Use gross pay for both offers and apply the same number of work hours. If one job regularly expects longer hours, calculate an effective hourly rate using those hours as a second scenario. The result still will not show take-home pay, which depends on tax rules and deductions. Review the written offer and employment classification before deciding; a quick conversion is a comparison aid, not legal or tax advice.' }
    ],
    example: '$62,400 annual salary ÷ (40 hours/week × 52 weeks)\n= $62,400 ÷ 2,080\n= $30.00 gross per hour equivalent',
    question: 'Is salary divided by 2,080 always accurate?', answer: 'Only for the assumption of 40 hours per week for 52 weeks. Use your actual schedule and paid weeks for a closer estimate.',
    source: 'https://www.bls.gov/careeroutlook/2015/article/should-i-get-a-new-job.htm', tool: 'salary-to-hourly-calculator', date: '2026-11-08'
  },
  {
    slug: 'what-is-structured-data-json-ld', title: 'What Is Structured Data and JSON-LD?',
    description: 'Learn what structured data and JSON-LD do, how to add schema markup, and why valid markup does not guarantee a rich result.',
    intro: 'Structured data is machine-readable information that describes entities and relationships on a webpage. JSON-LD is a common way to place that data in a script element without changing the visible page layout. Search engines may use eligible markup to understand a page, but markup alone does not guarantee a rich result or higher ranking. Add only facts users can also find on the page, validate the JSON syntax, and follow the current policies of each search engine.',
    sections: [
      { heading: 'Choose a schema type that matches the page', body: 'Use a type from Schema.org that accurately describes the page, such as Article, Product, Event, or LocalBusiness. Do not choose a type only because it appears to offer a search feature. Required and recommended properties differ by type and search feature, and eligibility rules can change. Represent real values from the page, including the correct name, dates, prices, and availability. Avoid inventing reviews or ratings to fill optional properties.' },
      { heading: 'Add JSON-LD without changing visible content', body: 'Place a script with type application/ld+json in the document head or body. The value must be valid JSON: use double quotes, escape special characters, and do not include comments or trailing commas. Connect nested entities with stable identifiers when useful. Keep the markup synchronized with what a visitor can see; if the offer, date, or product changes, update structured data as part of the same publishing workflow.' },
      { heading: 'Validate syntax and search eligibility separately', body: 'A JSON parser checks syntax, while a search engine’s rich-results test checks support for specific search features. Search Console can later report detected data and issues for crawled pages. These are separate checks: a document can be syntactically valid but not eligible for a rich result. Correct errors, request recrawling where appropriate, and monitor changes. Never promise rankings based on markup alone; usefulness, content quality, and search policies still matter.' }
    ],
    example: '<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "Article",\n  "headline": "A practical guide"\n}\n</script>',
    question: 'Does JSON-LD guarantee a Google rich result?', answer: 'No. Valid structured data can make a page eligible for supported features, but Google decides whether and when to show them.',
    source: 'https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data', tool: 'structured-data-generator', date: '2026-11-08'
  },
  {
    slug: 'how-to-generate-xml-sitemap', title: 'How to Generate an XML Sitemap for a Website',
    description: 'Generate an XML sitemap with canonical URLs, valid dates, and useful page entries, then submit and monitor it in Search Console.',
    intro: 'An XML sitemap lists canonical URLs that a site owner wants search engines to discover. It can help crawlers find important pages, especially on a large or recently updated site, but it does not guarantee indexing. Include pages that return successfully and should appear in search; exclude redirects, error pages, and duplicate URL variants. Generate the file, validate its XML, publish it at the site root, and keep it updated when the site changes.',
    sections: [
      { heading: 'Select canonical, indexable URLs', body: 'Use absolute URLs with the correct protocol and host. Include only pages that you want search engines to consider indexing, and use the preferred canonical version when query strings or multiple paths lead to the same content. Do not list URLs blocked from crawling or marked noindex as if they were priority pages. Large sites can split sitemaps by content type and use a sitemap index when protocol limits require it.' },
      { heading: 'Use last-modified dates honestly', body: 'The lastmod value should describe a meaningful update to the page, not a file timestamp that changes on every deployment. Search engines may use accurate dates as a crawl hint. Change frequency and priority values are optional hints and are not commands that force a search engine to crawl. Avoid including guessed dates or identical priority values that imply a precision the site does not actually use.' },
      { heading: 'Publish and check the sitemap', body: 'Save valid XML at a stable URL such as https://example.com/sitemap.xml, then reference it in robots.txt. Open the URL in a browser and check the server response. Submit the sitemap in Search Console and review discovered URLs, parsing errors, and indexing reports. A sitemap helps communicate discovery information; it does not replace internal links, good page quality, or canonical tags. Revalidate after migrations and large URL changes.' }
    ],
    example: '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>https://example.com/about</loc></url>\n</urlset>',
    question: 'Does submitting a sitemap make every URL indexable?', answer: 'No. It helps discovery, but search engines decide whether to crawl and index each URL based on many signals and policies.',
    source: 'https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap', tool: 'sitemap-xml-generator', date: '2026-11-08'
  },
  {
    slug: 'how-to-create-robots-txt', title: 'How to Create a Robots.txt File Correctly',
    description: 'Create a robots.txt file with specific crawler rules, test allowed paths, and avoid using crawl blocking to hide private pages.',
    intro: 'A robots.txt file gives compliant crawlers instructions about which URL paths they may request. It is a crawl-control mechanism, not a password or reliable way to hide a page from search. Put the file at the site root for the exact host and protocol it covers, then test rules against the URLs you care about. A restrictive rule can prevent crawlers from fetching important pages, so keep a copy of the previous file before publishing changes.',
    sections: [
      { heading: 'Write rules for the right user agent', body: 'Each group begins with a User-agent line and may include Allow or Disallow paths. A wildcard group applies to crawlers that do not have a more specific group. Rules match URL paths and are case-sensitive on many servers. Start with a narrow path instead of blocking a broad directory unless you have checked every affected page. Different search engines can implement details differently, so use their current documentation for complex patterns.' },
      { heading: 'Do not use robots.txt for confidential data', body: 'A disallowed URL can still be discovered from links and may appear in search results without a description. Robots rules do not require a crawler to keep content secret, and malicious bots may ignore them. Protect private content with authentication or server-side access controls. Use noindex where a page should not appear in search and the crawler is allowed to fetch it; do not block that fetch before the crawler can see the directive.' },
      { heading: 'Test before publishing', body: 'Compare the rules against important page paths and confirm that assets needed to render pages remain crawlable. Test both allowed and blocked examples, including trailing slashes and uppercase path variants. Publish the file at /robots.txt and inspect the exact live URL for each subdomain or protocol where rules differ. Monitor crawl reports after deployment. A syntax-valid file can still contain a logic error that blocks the wrong section of a site.' }
    ],
    example: 'User-agent: *\nDisallow: /private-preview/\nAllow: /private-preview/public-example\nSitemap: https://example.com/sitemap.xml',
    question: 'Can robots.txt keep a page out of Google?', answer: 'It can restrict crawling, but it does not guarantee deindexing or privacy. Use authentication for private content and a supported noindex directive for search exclusion.',
    source: 'https://developers.google.com/search/docs/crawling-indexing/robots/intro', tool: 'robots-txt-generator', date: '2026-11-08'
  },
  {
    slug: 'what-are-open-graph-meta-tags', title: 'What Are Open Graph Meta Tags?',
    description: 'Learn how Open Graph meta tags control shared link previews, choose image dimensions, and test what social platforms can fetch.',
    intro: 'Open Graph meta tags describe a webpage when it is shared on compatible social platforms. They can provide a title, description, canonical URL, and preview image. These tags do not change the visible page content, and each platform may cache or interpret them differently. Add tags to the page head, use absolute image URLs that crawlers can fetch, and verify the preview after deployment. A good social preview should match the page and help a person decide whether to open it.',
    sections: [
      { heading: 'Add the core Open Graph properties', body: 'Set og:title, og:type, og:image, and og:url, then add og:description for a useful summary. Use a full canonical URL rather than a relative path. Include image width and height when known, and provide descriptive alt text with og:image:alt. Keep title and description accurate to the visible article. Do not put key information only in an image because preview images may be cropped or omitted by a platform.' },
      { heading: 'Prepare an image that survives cropping', body: 'Use a high-quality image with enough resolution for the target platform and keep important subjects away from the extreme edges. Social cards may crop or resize the source differently across devices. Avoid tiny text, logos you do not own, and design elements that become misleading when cropped. Check that the image URL returns a public image with a successful HTTP response and an appropriate content type. A local preview cannot prove that an external crawler can access it.' },
      { heading: 'Refresh platform caches after changes', body: 'Platforms often cache link previews, so edits may not appear immediately. Use the platform’s official sharing debugger or inspection tool to request a refresh where available. Check the final page source rather than only client-rendered DOM, because some crawlers do not execute JavaScript consistently. Keep Open Graph data and standard page metadata aligned, and monitor redirects so the shared canonical URL resolves to the intended page.' }
    ],
    example: '<meta property="og:title" content="A practical guide to sharing links">\n<meta property="og:description" content="Create a clear, accurate social preview.">\n<meta property="og:url" content="https://example.com/guide">\n<meta property="og:image" content="https://example.com/guide-cover.jpg">',
    question: 'Do Open Graph tags improve Google rankings?', answer: 'They are mainly for link previews on social platforms. They are not a direct guarantee of improved search rankings.',
    source: 'https://ogp.me/', tool: 'open-graph-generator', date: '2026-11-08'
  },
  {
    slug: 'how-to-check-keyword-density', title: 'How to Check Keyword Density in a Page',
    description: 'Check keyword density by counting terms and variants, reviewing page context, and avoiding repetitive writing that harms readability.',
    intro: 'Keyword density is the share of a text occupied by a term or phrase. It can help you spot accidental repetition, but there is no universal percentage that guarantees a page will rank. Search systems consider meaning, usefulness, and context rather than rewarding a single formula. Use a density checker as an editing aid: inspect exact phrases and related language, then read the page aloud to make sure it serves people instead of repeating a keyword unnaturally.',
    sections: [
      { heading: 'Define the text and phrase you are counting', body: 'Decide whether the count includes headings, navigation, captions, and metadata or only the main article. Normalize capitalization and whitespace, but be careful with punctuation and word boundaries. For a phrase, count complete phrase matches rather than matching fragments inside longer words. A simple frequency percentage is often total occurrences divided by total words, multiplied by 100; tools may use different tokenization rules, so compare like with like.' },
      { heading: 'Review related terms and intent', body: 'A useful page may include synonyms, examples, entities, and questions that naturally belong to the topic. Do not add unrelated variants simply to increase a score. Compare the page with the reader’s task: what information would help someone complete it accurately? Use headings to make the structure clear, then remove sentences that repeat a point without adding detail. A count can highlight a pattern, but editorial judgment determines whether that pattern improves the page.' },
      { heading: 'Avoid fixed density targets', body: 'Search guidelines do not require a fixed keyword density. Repeating an exact phrase in every heading can make the article awkward and may look manipulative. Use the main phrase where it clearly describes the subject, then write naturally. Check readability, factual support, and whether the page answers a distinct query better than a generic overview. Reassess after editing because a percentage can change when the overall text length changes.' }
    ],
    example: 'Text words: 800\nExact phrase matches: 8\nSimple frequency: 8 / 800 × 100 = 1%\nNext step: review each use for clarity and relevance',
    question: 'What is a good keyword density percentage?', answer: 'There is no universally recommended percentage. Use frequency to notice repetition, then prioritize accurate, useful, readable content.',
    source: 'https://developers.google.com/search/docs/fundamentals/creating-helpful-content', tool: 'keyword-density-checker', date: '2026-11-08'
  },
  {
    slug: 'how-to-create-hreflang-tags', title: 'How to Create Hreflang Tags for Languages',
    description: 'Create hreflang tags for language and regional page versions, use reciprocal references, and validate each destination URL.',
    intro: 'Hreflang annotations help search engines understand that pages are localized alternatives for different languages or regions. They do not translate a page or guarantee that a search result will show a particular version. Each localized page should identify itself and its alternate versions with consistent, fully qualified URLs. Plan the language-region mapping before adding tags, then check that every referenced page exists, is indexable, and returns a successful response.',
    sections: [
      { heading: 'Use valid language and region codes', body: 'Write a BCP 47 language tag such as en, es, or en-GB. The language code is required; a region is optional and should represent the intended audience. Avoid inventing codes from country names or using a region where you mean only a language. Include an x-default URL when you have a suitable fallback page. Keep each mapping aligned with a real alternate page rather than pointing all locales to one generic destination.' },
      { heading: 'Make alternate references reciprocal', body: 'If page A lists page B as an alternate, page B should list page A as well as itself and the other relevant versions. Use absolute canonical URLs and keep the set consistent across HTML link elements, HTTP headers, or an XML sitemap. Choose one implementation method where possible to reduce conflicting data. Every localized version should have a self-reference so search engines can identify the page’s own language and region.' },
      { heading: 'Validate destinations and content', body: 'Open every URL in the mapping and confirm it loads the intended localized page, not a redirect to a different locale or a 404. Hreflang is an annotation, not a substitute for localized content or navigation. Ensure canonical tags do not contradict the alternate relationship. After publishing, inspect Search Console reports and check a sample of language-region pairs. Changes can take time to be recrawled, so do not expect an immediate result.' }
    ],
    example: '<link rel="alternate" hreflang="en" href="https://example.com/en/">\n<link rel="alternate" hreflang="es" href="https://example.com/es/">\n<link rel="alternate" hreflang="x-default" href="https://example.com/">',
    question: 'Does hreflang redirect visitors to another language?', answer: 'No. Hreflang annotations help search engines choose among alternate URLs; your site’s own navigation or locale logic controls the visitor experience.',
    source: 'https://developers.google.com/search/docs/specialty/international/localized-versions', tool: 'hreflang-tag-generator', date: '2026-11-08'
  },
  {
    slug: 'how-to-write-meta-descriptions', title: 'How to Write a Clear Meta Description',
    description: 'Write a meta description that summarizes the page, matches search intent, and gives readers a useful reason to choose your result.',
    intro: 'A meta description is a short summary that may appear under a page title in search results. Search engines can rewrite it, so there is no guaranteed display or ranking boost from adding one. A strong description accurately previews the page and helps a person decide whether it answers their question. Write a distinct summary for each important page, keep it specific, and avoid stuffing several keyword variations into a sentence that sounds unnatural.',
    sections: [
      { heading: 'Summarize the page, not the whole website', body: 'Lead with the main task or answer the page supports. Mention a useful detail, such as the format supported, audience, or limitation, if it helps set expectations. Keep the wording consistent with the visible content; a promise the page does not meet can disappoint visitors. Search result snippets can be generated from page text instead of your meta description, so make the opening paragraph clear as well.' },
      { heading: 'Make each description unique and readable', body: 'Avoid copying one description across dozens of URLs. Write in plain language, use an active verb when it fits, and remove filler such as “Welcome to our website.” There is no fixed character count that guarantees display because snippets vary by query and device width. Draft a concise sentence, then preview how it looks on mobile and desktop. Do not use quotation marks or symbols that may be truncated confusingly.' },
      { heading: 'Measure results without overclaiming', body: 'Use Search Console to review impressions, clicks, and queries for pages that receive enough data. Compare changes over a reasonable period and account for seasonality or other page updates. Click-through rate can vary by ranking position, query, and result features, so a description alone does not explain every change. Update copy when it no longer matches the page, and avoid promising a ranking outcome from metadata edits.' }
    ],
    example: 'Page: free image resizer\nMeta description: Resize JPG, PNG, and WebP images to exact dimensions. Keep proportions, preview the result, and download a web-ready copy.',
    question: 'How long should a meta description be?', answer: 'Keep it concise enough to communicate the page’s value in a short snippet. Display length varies by query and device, so no character limit guarantees full display.',
    source: 'https://developers.google.com/search/docs/appearance/snippet', tool: 'seo-meta-description-generator', date: '2026-11-08'
  },
  {
    slug: 'how-to-build-utm-links', title: 'How to Build UTM Links for Campaign Tracking',
    description: 'Build UTM links with consistent source, medium, and campaign values so analytics reports can group campaign traffic correctly.',
    intro: 'UTM parameters label campaign links so analytics software can attribute visits to a source, medium, or campaign. They do not prove that a visitor converted, and inconsistent labels can split one campaign across several report rows. Create a naming convention before distributing links, use lowercase values consistently, and test that the destination still loads. Avoid putting personal information or secrets in a URL because query parameters can appear in logs and browser history.',
    sections: [
      { heading: 'Choose values that describe the campaign', body: 'Use utm_source for the platform or publisher, utm_medium for the channel, and utm_campaign for the campaign name. Optional parameters such as utm_content can distinguish creatives or links. Follow the conventions in your analytics property; “Email”, “email”, and “e-mail” may be reported separately. Use simple labels without spaces, or encode spaces safely. Avoid adding parameters that your analytics setup does not use.' },
      { heading: 'Keep the destination URL intact', body: 'Append parameters with a question mark when the URL has no query string, or an ampersand when it already has one. A URL builder handles encoding for characters such as spaces and ampersands. Check that the final URL points to the intended HTTPS page and that existing query values remain present. Some redirects strip parameters, so test the full click path and inspect the landing page before launching a campaign.' },
      { heading: 'Protect privacy and compare reports carefully', body: 'UTM values should describe campaigns, not identify an individual. Do not place email addresses, customer IDs, or other personal data in query parameters. Analytics attribution depends on consent, browser settings, and the measurement configuration. Compare reports using the same channel definitions and time windows. A tagged link identifies how a visit arrived; it does not establish that the campaign caused a sale or that every visitor was measured.' }
    ],
    example: 'https://example.com/pricing?utm_source=newsletter&utm_medium=email&utm_campaign=november_launch&utm_content=hero_link',
    question: 'Do UTM parameters change the page content?', answer: 'Usually they are tracking labels, but the site or analytics scripts can use query values. Test the destination and avoid sensitive data in URLs.',
    source: 'https://support.google.com/analytics/answer/10917952', tool: 'utm-builder', date: '2026-11-08'
  },
  {
    slug: 'serp-preview-tool-how-to-check', title: 'How to Preview a Search Result Snippet',
    description: 'Preview a search result snippet with a title and description, then improve clarity while remembering that Google may rewrite the snippet.',
    intro: 'A search result preview helps you see how a page title and description might look in a result card. It is an editing aid, not an exact simulation of Google’s live results. Display depends on the query, device, language, and search engine, and Google may choose text from the page instead. Use a preview tool to catch awkward wording and truncation, then confirm that the title and description match the page itself.',
    sections: [
      { heading: 'Write for the query and the reader', body: 'Make the title identify the page’s subject clearly and put the most useful words near the beginning. The description should explain what the page offers, not repeat the title. Avoid vague superlatives and promises that the page cannot support. If a page answers several different tasks, consider whether it needs clearer sections or separate pages rather than trying to fit every idea into one snippet.' },
      { heading: 'Preview width and mobile appearance', body: 'Search interfaces usually constrain snippets by available pixel width rather than a universal character count. Letters vary in width, so two titles with the same number of characters can occupy different space. Preview both wide and narrow layouts, and read the text after any likely truncation point. Important information should not depend on the final few characters being shown. Keep brand wording concise if it competes with the page topic.' },
      { heading: 'Check the live result after publishing', body: 'The preview cannot guarantee which title or description a search engine will show. Search systems may use page headings, anchor text, or other visible copy. After changes are crawled, inspect actual results for the target query and review Search Console impressions and clicks. Avoid repeatedly changing metadata based on a single impression. A snippet should set an accurate expectation; ranking and appearance depend on many other signals.' }
    ],
    example: 'Page title: Free PDF Merger — Combine Documents Online\nDescription: Join PDF files in your chosen order, check the combined pages, and download one document. Keep your original files unchanged.',
    question: 'Will Google show the exact snippet I preview?', answer: 'Not necessarily. Google may generate a query-specific title or description from other content on the page.',
    source: 'https://developers.google.com/search/docs/appearance/title-link', tool: 'serp-snippet-preview', date: '2026-11-08'
  },
  {
    slug: 'what-is-canonical-url', title: 'What Is a Canonical URL and When to Use One?',
    description: 'Understand canonical URLs, choose a preferred page version, and avoid pointing canonical tags to redirects or unrelated pages.',
    intro: 'A canonical URL identifies the preferred version among pages with duplicate or very similar content. It is a hint to search engines, not an access restriction or guaranteed command. Common duplicates come from tracking parameters, alternate paths, or HTTP and HTTPS versions. Choose the URL you want indexed, make it stable, and reference it consistently in internal links and sitemaps. A canonical tag should point to a relevant page that loads successfully.',
    sections: [
      { heading: 'Choose the preferred page version', body: 'Decide whether the canonical version uses HTTPS, a www host, trailing slashes, and a particular path format. Use the same choice across navigation, redirects, sitemap entries, and canonical tags. If two URLs contain substantially different information, do not canonicalize one to the other merely to consolidate traffic. A canonical page should represent the content of the duplicates, not a generic homepage.' },
      { heading: 'Add a self-referencing canonical when useful', body: 'A link element in the document head can name the preferred absolute URL: link rel="canonical" href="https://example.com/page". A self-reference can make the preferred version explicit. Ensure there is one clear canonical value and that rendered HTML exposes it to crawlers. Avoid conflicting HTML and HTTP header canonicals. Parameterized pages may need special handling if filters create genuinely useful unique content.' },
      { heading: 'Check redirects and indexing signals', body: 'Open the canonical destination and confirm it returns a successful page rather than redirecting or showing an error. Canonicalization is one signal among redirects, internal links, sitemap URLs, and content similarity. Search engines may select a different canonical if signals conflict. Use Search Console URL inspection to compare the declared canonical with the selected canonical after recrawling. Fix inconsistent internal links instead of relying on tags to resolve every duplicate.' }
    ],
    example: '<link rel="canonical" href="https://example.com/products/blue-mug">\n\nTracking variant: https://example.com/products/blue-mug?utm_source=email',
    question: 'Does a canonical tag redirect duplicate pages?', answer: 'No. A canonical tag is an indexing hint; a redirect sends visitors and crawlers to another URL.',
    source: 'https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls', tool: 'canonical-url-checker', date: '2026-11-08'
  },
  {
    slug: 'how-to-convert-json-to-csv', title: 'How to Convert JSON to CSV Without Losing Fields',
    description: 'Convert JSON to CSV by choosing a row structure, flattening nested fields carefully, and checking quoted commas and empty values.',
    intro: 'JSON and CSV represent data differently. JSON supports nested objects, arrays, and mixed values, while CSV is a rectangular table of rows and columns. Before converting, decide what one row represents and how nested values should become cells. A converter can produce a file quickly, but no single mapping preserves every JSON structure in a plain CSV. Keep the original JSON and inspect the resulting headers, row count, and quoting before importing the file elsewhere.',
    sections: [
      { heading: 'Choose the array that represents table rows', body: 'Many exports contain an array of objects, where each object becomes a row and each key becomes a column. If records are nested, decide whether to flatten them into dotted paths, join selected values, or serialize a nested value as JSON text inside one cell. Arrays may need one row per item or a joined representation. Record that choice so a later import does not silently reinterpret the data.' },
      { heading: 'Preserve CSV quoting and text types', body: 'CSV fields containing commas, quote marks, or line breaks need correct quoting. A valid writer wraps the field in quotes and doubles quote characters inside it. Spreadsheets may also reinterpret strings such as postal codes, dates, and long IDs. Keep identifiers as text and check leading zeros after opening the file. Empty, missing, and null JSON values are distinct concepts; decide how each should be represented.' },
      { heading: 'Validate the converted data', body: 'Compare the row count with the intended array length and check the first, middle, and last records. Inspect headers for duplicate keys and columns that contain unexpected objects. If you need a round trip back to the same JSON structure, CSV may be too lossy; retain a schema or use NDJSON for records. Avoid opening sensitive data in a shared spreadsheet or cloud account without authorization.' }
    ],
    example: '[{"name":"Ada Lovelace","postal":"00123"},{"name":"Sam Lee","postal":"94105"}]\n\nname,postal\n"Ada Lovelace",00123\n"Sam Lee",94105',
    question: 'Can every JSON file be converted to CSV losslessly?', answer: 'No. CSV has no native nesting or data types, so nested structures and null or missing values need an explicit mapping.',
    source: 'https://www.rfc-editor.org/rfc/rfc4180', tool: 'json-to-csv', date: '2026-11-08'
  },
  {
    slug: 'how-to-format-json', title: 'How to Format JSON for Easier Reading',
    description: 'Format JSON with consistent indentation, validate syntax, and understand why a pretty-printed document can still have data errors.',
    intro: 'Formatting JSON adds whitespace and line breaks so a document is easier to read. It does not change the underlying values when performed correctly. A formatter can also report syntax errors such as missing commas, unquoted property names, or trailing commas. Valid JSON is not necessarily valid for your application: required fields and data types need separate schema or business-rule checks. Work from a copy when editing an important configuration or API response.',
    sections: [
      { heading: 'Paste a complete JSON value', body: 'A JSON document can be an object, array, string, number, boolean, or null. Most configuration files start with an object. Use double quotes around strings and property names, separate members with commas, and avoid comments unless the format is JSONC or another extension. If the formatter stops at a character, inspect the nearest bracket and comma first; a missing delimiter earlier in the file can make later lines look invalid.' },
      { heading: 'Choose indentation for the destination', body: 'Two spaces are common in web projects, while some teams prefer four spaces or tabs. Indentation changes readability, not the data model. A minified JSON response can be pretty-printed for review, and formatted JSON can be minified for transfer. Keep a project’s established style when committing changes so diffs remain focused. Do not manually align keys with spaces because values with different lengths make that formatting brittle.' },
      { heading: 'Validate more than syntax', body: 'After formatting, parse the JSON and validate it against the API schema or application requirements. A parser cannot know whether an email field is required, an enum value is allowed, or a date is in the right business range. Compare before and after values when the input is important. Avoid online formatters for secrets or private configuration; a local browser tool can keep processing on the device if that is how the tool is implemented.' }
    ],
    example: '{"name":"Ada","active":true,"roles":["editor","reviewer"]}\n\nBecomes:\n{\n  "name": "Ada",\n  "active": true,\n  "roles": ["editor", "reviewer"]\n}',
    question: 'Does pretty-printing change JSON values?', answer: 'A correct formatter changes whitespace only. It should preserve the parsed values, but verify the output before replacing important data.',
    source: 'https://www.rfc-editor.org/rfc/rfc8259', tool: 'json-formatter', date: '2026-11-08'
  },
  {
    slug: 'how-to-validate-json', title: 'How to Validate JSON Syntax and Structure',
    description: 'Validate JSON syntax first, then check required properties and data types against a schema or the receiving API contract.',
    intro: 'JSON validation has two layers: syntax validation confirms that a document follows JSON grammar, while schema validation checks whether its structure matches an expected contract. A file can pass the first and fail the second. Validate both before sending data to an API or loading configuration into an application. When a parser reports an error, use the line and column as a starting point, but inspect nearby delimiters because the actual mistake may occur just before the reported position.',
    sections: [
      { heading: 'Check JSON grammar', body: 'JSON uses double-quoted strings, commas between members, and matching braces and brackets. It does not allow comments, undefined, NaN, or trailing commas. Parse the entire document rather than only a fragment. If you have JSONC or JSON5, use a parser for that format and convert it to strict JSON before sending it to a system that expects RFC-compliant JSON.' },
      { heading: 'Check the application schema', body: 'A JSON Schema can describe required fields, types, allowed values, array item shapes, and numeric bounds. Choose the correct schema draft and apply any formats your validator supports. A schema may still omit business rules such as whether a start date must be before an end date. Add those checks in the application. Validate examples from both successful and failing cases to confirm that the schema catches mistakes without rejecting valid data.' },
      { heading: 'Use errors without exposing private data', body: 'A useful validation report identifies a path such as /items/2/price and explains the expectation. Avoid logging full request bodies if they contain credentials or personal information. Redact sensitive values while retaining enough context to reproduce the issue. Validation is not sanitization: accepted strings may still need escaping before insertion into HTML or SQL. Keep validation, authorization, and output encoding as separate controls.' }
    ],
    example: '{"name":"Ada","age":"36"}\n\nSyntax: valid JSON\nSchema expectation: age is an integer\nStructure result: invalid until age is 36 (number)',
    question: 'Can valid JSON still be rejected by an API?', answer: 'Yes. It may be syntactically valid but use missing fields, wrong types, unsupported values, or violate application rules.',
    source: 'https://json-schema.org/learn/getting-started-step-by-step', tool: 'json-validator', date: '2026-11-08'
  },
  {
    slug: 'json-vs-yaml-which-to-use', title: 'JSON vs YAML: Which Format Should You Use?',
    description: 'Compare JSON vs YAML for APIs, configuration, and data exchange, including readability, strictness, and common parsing pitfalls.',
    intro: 'JSON and YAML both represent structured data, but their syntax and common use cases differ. JSON is widely used for APIs and has a strict grammar. YAML is often chosen for human-edited configuration because it supports indentation-based structure and comments. The better choice depends on the tools that read the file and the people who maintain it. Preserve the data model when converting, because scalars, dates, and special values can be interpreted differently by different parsers.',
    sections: [
      { heading: 'Use JSON for interoperable data exchange', body: 'JSON is a common choice for HTTP APIs, browser code, and machine-generated documents. Its explicit braces, brackets, and quoted keys make structure clear to parsers. Standard JSON has no comments, so documentation usually lives in a schema or separate text. Be aware that many JavaScript parsers represent numbers as binary floating-point values, which can lose precision for very large integers. Treat identifiers as strings when exact digits matter.' },
      { heading: 'Use YAML when maintainers benefit from its syntax', body: 'YAML supports comments and a compact indentation style that can make configuration files approachable. Indentation is significant, tabs may be rejected, and implicit scalar rules can surprise authors. Quote strings that resemble booleans, numbers, dates, or special values when exact text is intended. YAML features such as anchors may not be accepted by every application. Check the parser and supported YAML version used in production.' },
      { heading: 'Convert with a round-trip check', body: 'A converter can translate common mappings, arrays, strings, numbers, booleans, and null values. Review values that have implicit types, multiline text, date-like strings, or keys with unusual characters. Parse the output with the application’s actual library, not only a generic formatter. Keep the original source and compare the parsed data before replacing a deployment configuration. A successful conversion does not prove that a particular service accepts every field.' }
    ],
    example: 'JSON: {"enabled": true, "retries": 3}\n\nYAML:\nenabled: true\nretries: 3',
    question: 'Is YAML a superset of JSON?', answer: 'YAML versions support JSON-compatible structures, but parser behavior and application restrictions still matter when converting between them.',
    source: 'https://yaml.org/spec/1.2.2/', tool: 'yaml-to-json', date: '2026-11-08'
  },
  {
    slug: 'how-to-convert-csv-to-json', title: 'How to Convert CSV to JSON Correctly',
    description: 'Convert CSV to JSON by selecting a delimiter, using a header row, and preserving quoted fields and identifier columns as text.',
    intro: 'CSV conversion turns rows and columns into JSON values, usually an array of objects. The first row often supplies property names, but CSV files do not have a single universally enforced schema. Delimiters, quoting, line endings, and character encoding can differ by exporter. Choose the correct parsing options, protect identifiers such as postal codes from automatic number conversion, and inspect the output before using it in an API or database.',
    sections: [
      { heading: 'Prepare headers and consistent rows', body: 'Use one header row with a unique, non-empty name for each column. Make sure data rows contain the expected number of cells. Remove titles, subtotals, and blank separator lines unless they are part of the dataset. Select comma, tab, or semicolon according to the actual file content; a .csv extension does not prove that commas separate the fields. Confirm the text encoding if accented characters appear corrupted.' },
      { heading: 'Respect quotes and keep identifiers as strings', body: 'A quoted CSV field may contain a delimiter, quote mark, or newline. Use a standards-aware parser rather than splitting each line on commas. Decide whether values should remain strings or be converted to numbers, booleans, and null. Postal codes, phone numbers, and long IDs usually should stay strings because leading zeros and exact digits matter. Do not let a spreadsheet silently reformat those values before conversion.' },
      { heading: 'Check the generated objects', body: 'Compare the number of output objects with the number of data rows and inspect records with empty cells, quotes, and multiline text. Empty cells can become empty strings, null values, or omitted properties depending on the converter. Write down the chosen mapping if another system will import the output. For sensitive records, use a local processing tool and avoid saving data to untrusted shared storage.' }
    ],
    example: 'CSV:\nname,postal_code\nAda,00123\n\nJSON:\n[{"name":"Ada","postal_code":"00123"}]',
    question: 'Why does CSV data sometimes shift into the wrong columns?', answer: 'A field may contain a comma or newline that must be quoted correctly, or the selected delimiter may not match the source file.',
    source: 'https://www.rfc-editor.org/rfc/rfc4180', tool: 'csv-to-json', date: '2026-11-08'
  },
  {
    slug: 'how-to-convert-xml-to-json', title: 'How to Convert XML to JSON Safely',
    description: 'Convert XML to JSON while accounting for attributes, repeated elements, namespaces, and text that does not map directly to objects.',
    intro: 'XML and JSON organize data differently. XML has elements, attributes, namespaces, and mixed text, while JSON uses objects, arrays, and primitive values. A converter must choose how XML features map into JSON, so two tools can produce different but valid outputs. Before converting, decide how attributes and repeated elements should be represented. Keep the original XML and test the result with the application that will consume it.',
    sections: [
      { heading: 'Understand the mapping choices', body: 'Repeated sibling elements commonly become an array, while one occurrence may become a single object unless the converter normalizes both cases. Attributes can be prefixed, grouped in a special object, or omitted. Text nodes mixed with child elements need an explicit representation. Namespaces may be retained in names or resolved through namespace declarations. Document these conventions so downstream code does not assume a different shape for the next record.' },
      { heading: 'Check namespaces and data types', body: 'XML element values begin as text, even when they look like numbers or dates. A converter may keep them as strings or infer types. Preserve leading zeros in identifiers and choose exact behavior for booleans, empty elements, and nil values. Namespace prefixes are aliases, not the namespace identity itself; compare namespace URIs where correctness depends on them. Validate the source against its DTD or XML Schema when the producer provides one.' },
      { heading: 'Validate both sides of the conversion', body: 'Parse the converted JSON and compare key records with the XML source. Test documents with repeated elements, missing elements, empty tags, attributes, and non-ASCII text. Then validate the JSON against the consumer’s expected schema. A valid JSON document can still be semantically wrong if an attribute disappears or an array collapses into one object. Keep conversion logs free of credentials and sensitive payloads.' }
    ],
    example: '<item id="A1"><name>Notebook</name><tag>school</tag><tag>paper</tag></item>\n\nPossible JSON mapping:\n{"item":{"@id":"A1","name":"Notebook","tag":["school","paper"]}}',
    question: 'Does XML always convert to one standard JSON shape?', answer: 'No. XML features such as attributes and mixed content have multiple possible JSON mappings; follow the target application’s contract.',
    source: 'https://www.w3.org/TR/xml/', tool: 'xml-to-json', date: '2026-11-08'
  },
  {
    slug: 'how-to-decode-jwt-token', title: 'How to Decode a JWT Token Safely',
    description: 'Decode a JWT to inspect its header and claims, and understand why decoding alone does not verify the token signature.',
    intro: 'A JSON Web Token is often three Base64url-encoded parts separated by dots: a header, a payload, and a signature. Decoding can help inspect claims such as issuer or expiration, but it does not prove that the token is authentic. Anyone can create a token-like string with arbitrary claims. Do not paste production credentials into an untrusted website. Verify signatures and claims on a trusted server using the issuer’s expected algorithm and keys.',
    sections: [
      { heading: 'Separate the token segments', body: 'Split the compact token at its periods and inspect the first two segments as Base64url data. Base64url uses a URL-safe alphabet and may omit padding. The header describes the signing algorithm and key identifier; the payload contains claims. Treat both as untrusted input until a signature is verified. A malformed token may have an unexpected number of parts or invalid encoding, so report parsing errors rather than guessing.' },
      { heading: 'Check standard claims with context', body: 'The exp claim is a NumericDate in seconds since the Unix epoch; nbf and iat also use time-based values. Compare them with the current time and allow for an explicitly chosen clock-skew policy. The iss, aud, and sub claims have meaning only in the application’s trust model. A token can decode cleanly and still be expired, intended for a different audience, or forged.' },
      { heading: 'Verify before granting access', body: 'A secure application checks the signature using a trusted key and approved algorithm, then validates issuer, audience, expiration, and any application-specific permissions. Do not choose a verification algorithm solely because the untrusted header requests it. Avoid logging full tokens because they can act as bearer credentials. If a token was accidentally exposed, follow the issuer’s revocation or rotation process.' }
    ],
    example: 'header.payload.signature\n\nDecode header and payload to inspect claims.\nThen verify the signature and claims on a trusted server before authorization.',
    question: 'Does decoding a JWT prove it is valid?', answer: 'No. Decoding reveals encoded contents only. Validity requires signature verification and claim checks against a trusted issuer.',
    source: 'https://www.rfc-editor.org/rfc/rfc7519', tool: 'jwt-decoder', date: '2026-11-08'
  },
  {
    slug: 'how-to-generate-uuid', title: 'How to Generate a UUID for an Application',
    description: 'Generate a UUID for records and requests, choose the right version, and avoid treating an identifier as a secret or access token.',
    intro: 'A UUID is a 128-bit identifier used to label records, events, and resources across systems. The right generation method depends on whether you need random uniqueness, time ordering, or a deterministic value from a namespace and name. UUIDs reduce collision risk but do not replace database constraints or authorization. Use a standards-compliant generator, store the value in a suitable field, and keep the version and format consistent across services.',
    sections: [
      { heading: 'Choose a UUID version for the use case', body: 'Random UUIDs are useful when identifiers should be created independently without a central counter. Name-based versions produce the same UUID for the same namespace and input under the chosen hash method. Time-ordered versions can improve locality in some databases, but they reveal ordering information and have specific implementation rules. Confirm what your language runtime and storage system support before choosing a version.' },
      { heading: 'Generate with a secure, trusted library', body: 'Use an operating-system-backed or well-maintained library rather than building random bits by concatenating timestamps and Math.random values. A compliant generator sets version and variant bits correctly. Add a unique constraint in the database so a collision fails safely instead of overwriting an existing row. Validate UUID strings at system boundaries and normalize case only if the surrounding format permits it.' },
      { heading: 'Do not use a UUID as authorization by itself', body: 'An identifier is not automatically a secret. If someone can guess, obtain, or copy a UUID, it should not grant access unless your security model intentionally treats it as a capability and protects it accordingly. Enforce access checks for every resource request. Avoid exposing internal identifiers unnecessarily, and do not rely on their length or randomness as a substitute for authentication, authorization, or token expiration.' }
    ],
    example: 'Example UUID v4:\n550e8400-e29b-41d4-a716-446655440000\n\nUse: order.id\nDatabase: enforce uniqueness\nSecurity: check user authorization separately',
    question: 'Can two UUIDs be identical?', answer: 'A collision is possible in principle, though a correctly generated random UUID has a very low collision probability. Keep a uniqueness constraint.',
    source: 'https://www.rfc-editor.org/rfc/rfc9562', tool: 'uuid-generator', date: '2026-11-08'
  },
  {
    slug: 'how-to-generate-strong-password', title: 'How to Generate a Strong Password',
    description: 'Generate a unique password with enough length, store it in a password manager, and enable multi-factor authentication where possible.',
    intro: 'A strong password is long, unique to one account, and difficult for someone else to guess. Reusing a memorable password across websites creates risk because a breach at one service can expose other accounts. A password manager can generate and store a different random password for each site. Use the service’s allowed characters and length, and turn on multi-factor authentication for important accounts. Never share a password through an insecure message.',
    sections: [
      { heading: 'Prefer length and uniqueness', body: 'Longer passwords create more possible combinations when they are randomly generated. A random password manager entry is easier to make unique than a short pattern based on personal facts. If a service requires a passphrase, combine unrelated words using the manager’s generator rather than a quote or predictable sequence. Avoid adding predictable substitutions such as replacing every a with @; attackers test common patterns.' },
      { heading: 'Use a password manager carefully', body: 'Choose a reputable manager, protect its master account with a strong unique password, and enable multi-factor authentication. Save recovery codes in a secure location separate from your everyday device. Check that the generated password fits the site’s length and symbol rules before submitting. Do not store passwords in plain text files, source code, or shared notes. If a generated password was exposed, replace it rather than trying to keep using it.' },
      { heading: 'Add defenses beyond the password', body: 'Multi-factor authentication helps when a password is stolen or reused elsewhere. Prefer phishing-resistant methods where supported, such as security keys or passkeys. Keep recovery email and phone details current, and review active sessions after suspicious activity. If a site supports passkeys, learn how it stores and syncs them before changing account recovery settings. Password strength cannot compensate for a compromised device or fraudulent sign-in page.' }
    ],
    example: 'Account: example.com\nGenerated password: unique random value from your password manager\nStore: password manager entry for example.com\nAdd: MFA and recovery codes',
    question: 'How often should I change a strong password?', answer: 'Change it when it is exposed, reused, or compromised, and follow your organization’s policy. Use unique passwords and MFA rather than arbitrary frequent changes.',
    source: 'https://pages.nist.gov/800-63-4/sp800-63b.html', tool: 'password-generator', date: '2026-11-08'
  },
  {
    slug: 'what-is-base64-encoding', title: 'What Is Base64 Encoding and When to Use It?',
    description: 'Understand Base64 encoding, its size overhead, URL-safe variant, and why encoding does not encrypt private data.',
    intro: 'Base64 encodes binary data as printable ASCII characters so it can pass through text-oriented formats. It is commonly used in email, data URLs, and some API payloads. Encoding is reversible and provides no confidentiality: anyone who has the text can decode it. Base64 also increases data size by roughly one third before other formatting overhead. Choose it only when a protocol or interface requires a text representation, and use encryption separately for sensitive content.',
    sections: [
      { heading: 'Understand the alphabet and padding', body: 'Standard Base64 uses letters, digits, plus, slash, and optional equals padding. URL-safe Base64 replaces plus and slash with hyphen and underscore; some versions omit padding. A decoder must know which variant it receives. Treat whitespace and line breaks according to the format’s rules. A value that looks like Base64 is not necessarily valid text after decoding because the bytes may represent an image, compressed file, or encrypted data.' },
      { heading: 'Plan for size and character encoding', body: 'Base64 maps each group of three input bytes to four output characters, producing approximately 4/3 the original size. JSON and URL escaping can add further bytes. For text, first encode characters to bytes using a defined character encoding such as UTF-8, then apply Base64. Do not decode arbitrary bytes as text without checking the expected encoding. For large files, a binary upload or object storage link is usually more efficient.' },
      { heading: 'Keep secrets out of public strings', body: 'Base64 is not a security boundary. It can hide a value from casual reading, but it does not prevent anyone from recovering the original bytes. Do not use it to protect passwords, API keys, or personal data. Use authenticated encryption or a secure transport protocol for confidentiality, and manage keys separately. A data URL is also visible to scripts and logs that can access the page, so avoid embedding private files in public content.' }
    ],
    example: 'Text: Hello\nUTF-8 bytes: 48 65 6c 6c 6f\nBase64: SGVsbG8=\nDecode: Hello',
    question: 'Is Base64 encryption?', answer: 'No. Base64 is an encoding that anyone can reverse. Use encryption when confidentiality is required.',
    source: 'https://www.rfc-editor.org/rfc/rfc4648', tool: 'string-to-base64', date: '2026-11-08'
  },
  {
    slug: 'how-to-generate-qr-code', title: 'How to Generate and Test a QR Code',
    description: 'Generate a QR code for a link or text, choose a readable size, and test the printed code before sharing it widely.',
    intro: 'A QR code stores data that a camera app can read, often a web address, contact card, or Wi-Fi configuration. The code itself does not make a link trustworthy, so verify the destination before displaying it. Choose a suitable error-correction level and enough print size for the scanning distance. Test the downloaded image on more than one device and inspect the final printed copy; a preview on a monitor is not a substitute for a real scan.',
    sections: [
      { heading: 'Keep the encoded content concise', body: 'Short URLs create simpler codes that are easier to scan and fit on printed material. If you encode a long URL with many tracking parameters, the pattern becomes denser. Use a stable destination and check for typos before generating the image. Be cautious with URL shorteners because they hide the eventual destination from a person previewing the code. For Wi-Fi or vCard codes, verify each field and escape punctuation according to the format.' },
      { heading: 'Choose contrast and physical size', body: 'Use a dark foreground on a light, plain background. Avoid placing a logo or decoration over important modules unless you test the result and use suitable error correction. Leave a quiet margin around the symbol. Increase physical size for longer scanning distances or poor lighting. When printing, keep the code sharp and do not stretch it out of square; scaling unevenly can make modules difficult for a camera to recognize.' },
      { heading: 'Scan the actual final copy', body: 'Test the generated file from the intended display or a printed proof. Scan with different camera apps, check the decoded text, and confirm that the destination uses HTTPS where appropriate. Make sure the landing page works on a phone and does not require a desktop-only action. If the code appears on packaging or signage, retain the original source and repeat the scan after production. Replace a code if the target URL changes and the code is static.' }
    ],
    example: 'Payload: https://example.com/menu\nForeground: #111111\nBackground: #FFFFFF\nQuiet zone: enabled\nTest: scan the printed proof with two phones',
    question: 'Can I change the destination of a QR code later?', answer: 'A static QR code stores its data directly, so changing the destination requires generating and replacing it. A dynamic redirect service can change targets but adds dependency on that service.',
    source: 'https://www.iso.org/standard/62021.html', tool: 'qr-code-generator', date: '2026-11-08'
  },
  {
    slug: 'sha256-vs-md5-which-hash-to-use', title: 'SHA-256 vs MD5: Which Hash Should You Use?',
    description: 'Compare SHA-256 vs MD5 for checksums and security, and choose a modern algorithm for integrity or password storage.',
    intro: 'MD5 and SHA-256 are hash functions that produce fixed-length digests from input data. MD5 is no longer suitable when collision resistance matters, while SHA-256 remains a widely used member of the SHA-2 family. A checksum can detect accidental changes if you compare it with a trusted reference, but a plain hash does not authenticate who created a file. For passwords, neither raw MD5 nor a fast SHA-256 hash is the right storage method.',
    sections: [
      { heading: 'Use SHA-256 for general file checksums', body: 'A SHA-256 digest is useful for checking whether a file matches a known reference value. Compute it after downloading and compare every character with the publisher’s value obtained through a trusted channel. If an attacker can replace both the file and the checksum, the comparison does not prove authenticity. Use a digital signature or authenticated distribution mechanism when you need to verify the publisher.' },
      { heading: 'Do not use MD5 for security-sensitive integrity', body: 'Practical collision attacks make MD5 inappropriate where an attacker may choose inputs and exploit two different files with the same digest. It may still appear in legacy protocols or non-security identifiers, but avoid introducing new security dependencies on it. A collision is different from finding a preimage for an arbitrary hash; explain the threat model precisely instead of saying that every MD5 value can be reversed.' },
      { heading: 'Choose a password hashing function for passwords', body: 'Password storage needs a slow, salted password-hashing algorithm designed to resist guessing attacks, such as Argon2id, scrypt, bcrypt, or PBKDF2 where required by the platform. A fast cryptographic hash lets attackers test guesses too quickly. Use a maintained library with sensible parameters and unique salts. For message authentication, use a keyed construction such as HMAC rather than an unkeyed digest.' }
    ],
    example: 'File: release.zip\nExpected SHA-256: <digest published by the trusted project>\nComputed SHA-256: <digest of downloaded file>\nCompare: exact match, then verify the publisher/signature when authenticity matters',
    question: 'Is SHA-256 safe for storing passwords?', answer: 'A raw SHA-256 hash is too fast for password storage. Use a dedicated salted password-hashing algorithm with current parameters.',
    source: 'https://csrc.nist.gov/projects/hash-functions', tool: 'hash-generator', date: '2026-11-08'
  },
  {
    slug: 'how-to-write-professional-email', title: 'How to Write a Professional Email That Gets Read',
    description: 'Write a professional email with a specific subject, a clear request, useful context, and a direct next step for the reader.',
    intro: 'A professional email should help the reader understand why you are writing and what action, if any, you need. Start with a subject that identifies the topic, put the main point near the beginning, and include only the context needed to respond. Respect the recipient’s time with concise paragraphs and a specific deadline when one exists. Proofread names, dates, attachments, and tone before sending. Do not let an AI draft add facts or commitments you did not provide.',
    sections: [
      { heading: 'Write a subject that describes the task', body: 'A useful subject tells the recipient what the message concerns, such as “Review requested: Q4 budget by Friday.” Avoid vague subjects like “Question” when the topic can be named. If the message is part of an existing conversation, keep the thread subject unless the topic has changed. Do not mark routine mail urgent without a real deadline; urgency labels lose meaning when overused.' },
      { heading: 'Put the request and context first', body: 'Open with a brief greeting, then state the purpose in the first few lines. Add the background the recipient needs to make a decision, using bullets for multiple questions or dates. Make the requested action explicit: approve, review, choose, or reply. If the ask is optional, say so. Link to supporting documents with descriptive names and confirm that recipients have permission to access them.' },
      { heading: 'Close with a realistic next step', body: 'Use a polite closing and include your name and relevant contact details. State a deadline only if one is genuine and explain the time zone when scheduling across regions. Before sending, check the recipient list, attachments, links, spelling of names, and whether confidential information belongs in the thread. Read the draft once from the recipient’s perspective. A polished message cannot replace a direct conversation when the issue is urgent or sensitive.' }
    ],
    example: 'Subject: Review requested: project timeline by Thursday\n\nHi Morgan,\nCould you review the attached timeline and flag any date conflicts by Thursday at 3 p.m. UTC? The launch date is unchanged; I am checking the handoffs before sharing it with the team.\n\nThanks,\nAlex',
    question: 'How long should a professional email be?', answer: 'Keep it as short as the task allows while including enough context for a useful response. Put the request near the top.',
    source: 'https://owl.purdue.edu/owl/general_writing/academic_writing/email_etiquette.html', tool: 'email-writer', date: '2026-11-08'
  },
  {
    slug: 'how-to-write-cover-letter', title: 'How to Write a Cover Letter for a Job',
    description: 'Write a cover letter that connects your relevant experience to a role, uses specific evidence, and avoids repeating your resume.',
    intro: 'A cover letter explains why your experience fits a particular role and what evidence supports that claim. It should complement your resume rather than restating every job duty. Read the posting, identify the skills the employer emphasizes, and choose one or two examples that demonstrate them. Keep the letter truthful and specific. A generator can help organize a draft, but verify every detail and tailor the final version to the actual employer and role.',
    sections: [
      { heading: 'Match evidence to the job requirements', body: 'Select a small number of relevant requirements from the posting. For each one, describe a concrete project, responsibility, or outcome from your experience. Explain your contribution rather than claiming the entire team’s result. Quantify an outcome only when you can support the number. If you are changing fields or have a gap, connect transferable skills directly to the role instead of apologizing for your background.' },
      { heading: 'Use a clear, compact structure', body: 'Address a named hiring manager when the information is available; otherwise use a neutral greeting. Open with the role and a concise reason for your interest. Use one or two body paragraphs to connect evidence to the job, then close by inviting a conversation. Keep the layout readable and typically to one page, while following any specific application instructions. Save in the requested format and check that contact details are current.' },
      { heading: 'Proofread and tailor before sending', body: 'Replace generic claims with details from the company and role that you have verified. Do not copy unsupported phrases such as “perfect fit” or invent experience to match a requirement. Read the letter aloud to catch awkward language, then check names, dates, and attachment filenames. If you use AI to draft, remove claims it invented and ensure the letter still sounds like you. Follow the employer’s instructions about length, format, and submission.' }
    ],
    example: 'Role: Customer Support Associate\nEvidence: Reduced response backlog by 25% by documenting repeat solutions.\nConnection: I can apply that documentation practice to improve first-response consistency for your support team.',
    question: 'Should a cover letter repeat my resume?', answer: 'No. Use it to explain why selected experience is relevant and provide context that a bullet point alone cannot convey.',
    source: 'https://careerservices.fas.harvard.edu/resources/create-a-resume-or-cv-cover-letter/', tool: 'cover-letter-generator', date: '2026-11-08'
  },
  {
    slug: 'how-to-write-resignation-letter', title: 'How to Write a Resignation Letter Professionally',
    description: 'Write a concise resignation letter with your last working day, a clear notice, and a respectful close that preserves a record.',
    intro: 'A resignation letter creates a written record that you are leaving a role and identifies your intended final working day. Keep it factual and professional, even if the decision is difficult. Check your contract, employee handbook, and local requirements for notice periods before sending it. A short letter can confirm the key details without disclosing personal reasons. If you are concerned about safety, pay, or legal rights, seek appropriate advice before sharing more information.',
    sections: [
      { heading: 'Confirm the date and notice requirements', body: 'Review your employment agreement and workplace policy for notice terms, accrued leave, equipment returns, and final pay processes. Count working days carefully and state the intended final date in an unambiguous format. If you are unsure whether notice is required, ask HR or a qualified adviser. A calculator or template cannot determine the legal rules for your location or contract.' },
      { heading: 'State the decision directly', body: 'Address the manager or HR contact, say that you are resigning from the role, and include the final working day. Keep reasons brief or omit them if they are not needed. Avoid accusations, emotional detail, and promises you cannot keep. If you want to thank colleagues, make the appreciation sincere and concise. Deliver the letter through the channel required by your organization and keep a copy for your records.' },
      { heading: 'Coordinate a practical handover', body: 'Offer a reasonable transition plan if appropriate, such as documenting active work, returning devices, or handing over access through approved processes. Do not transfer passwords in the letter or personal email. Confirm final pay, benefits, and return-of-property steps with HR. Keep the resignation separate from any legal complaint or protected disclosure that needs a formal process. Ask for written acknowledgement when your employer’s policy calls for it.' }
    ],
    example: 'Subject: Resignation — Alex Rivera\n\nDear Morgan,\nI am resigning from my position as Analyst. My intended final working day is December 12, 2026. I will coordinate with you on current handover items.\n\nRegards,\nAlex Rivera',
    question: 'Do I need to explain why I am resigning?', answer: 'Usually a resignation notice can simply state the decision and final day. Check your agreement and local rules for requirements.',
    source: 'https://www.gov.uk/handing-in-your-notice', tool: 'resignation-letter-generator', date: '2026-11-08'
  },
  {
    slug: 'how-to-write-resume-bullet-points', title: 'How to Write Strong Resume Bullet Points',
    description: 'Write resume bullet points that start with an action, show your contribution, and quantify results only when the evidence is real.',
    intro: 'A resume bullet should tell an employer what you did and why it mattered. Begin with a clear action, add the scope or method, and include a result when you can support it. Avoid turning every task into an inflated achievement. The best bullets are specific, accurate, and easy to scan. Tailor the wording to the role without copying a job description or adding keywords for work you have not actually performed.',
    sections: [
      { heading: 'Start with a precise action verb', body: 'Choose a verb that describes your contribution: analyzed, coordinated, repaired, trained, or launched. “Responsible for” often hides the work and can be replaced with the action itself. Use past tense for completed work and present tense for a current responsibility. Keep each bullet focused on one outcome or related set of tasks so a reader can understand it quickly.' },
      { heading: 'Add scope and evidence', body: 'Include the team, process, volume, tool, or audience when it makes the work clearer. Numbers can show scale, such as tickets handled per week or time saved, but use only figures you can substantiate. If exact data is confidential, describe the relative result without exposing protected information. Distinguish your own work from a team outcome and avoid implying sole ownership of shared results.' },
      { heading: 'Tailor for relevance and readability', body: 'Order bullets by relevance to the role, not by how impressive they sound in isolation. Use terminology the employer understands and spell out uncommon acronyms the first time. Keep parallel grammar and remove repeated phrases. Applicant tracking systems do not require awkward keyword stuffing; use accurate terms naturally in context. Proofread dates, titles, and formatting, then check that the resume remains readable on a phone and when exported to PDF.' }
    ],
    example: 'Before: Responsible for customer tickets.\nAfter: Resolved 35–45 customer tickets per week and documented recurring fixes for the support knowledge base.',
    question: 'Should every resume bullet include a number?', answer: 'No. Use numbers where they are accurate and useful. Clear scope and specific actions are better than invented metrics.',
    source: 'https://careerservices.fas.harvard.edu/resources/create-a-resume-or-cv-cover-letter/', tool: 'resume-bullet-generator', date: '2026-11-08'
  },
  {
    slug: 'how-to-create-meeting-agenda', title: 'How to Create a Meeting Agenda That Works',
    description: 'Create a meeting agenda with a clear outcome, timed topics, owners, and pre-reading so attendees know how to prepare.',
    intro: 'A meeting agenda helps participants prepare and keeps discussion focused on a useful outcome. Start by deciding whether a meeting is needed at all; an update may be better as a written note. If people need to make a decision or solve a problem together, state that objective and list the topics in order. Include an owner and time estimate for each item. Send the agenda early enough for attendees to review the materials.',
    sections: [
      { heading: 'Write an outcome, not just a topic', body: 'A topic such as “Project status” does not say what the group should accomplish. Use an outcome such as “Choose one launch date after reviewing dependency risks.” Identify the decision maker and the information required. If the goal is brainstorming, say what kind of ideas are in scope and how the group will prioritize them. This helps invite only people who can contribute to the outcome.' },
      { heading: 'Allocate time and assign owners', body: 'List agenda items in a realistic order and give each a time box. Assign someone to introduce the topic or share the relevant data. Leave room for questions and a short close to recap decisions. If an item needs more time than the meeting allows, schedule a follow-up rather than rushing through every point. Share pre-reading, links, and accessibility needs with the invitation.' },
      { heading: 'End with decisions and actions', body: 'Record the decision, owner, and due date for each action. Distinguish confirmed decisions from proposals that still need approval. Circulate notes to attendees and absent stakeholders who need them, while respecting confidentiality. Review recurring meetings periodically and remove sessions that no longer support a real outcome. An agenda is a tool for useful collaboration, not a reason to keep a meeting that could be an email.' }
    ],
    example: 'Goal: Approve the launch date\n1. Risks and dependencies — 10 min — Priya\n2. Compare date options — 15 min — Alex\n3. Decision and action owners — 5 min — Morgan\nPre-read: release checklist',
    question: 'When should I send a meeting agenda?', answer: 'Send it early enough for attendees to review the objective and any pre-reading. For complex decisions, share materials several days ahead when possible.',
    source: 'https://hbr.org/2017/03/how-to-design-an-agenda-for-an-effective-meeting', tool: 'meeting-agenda-generator', date: '2026-11-08'
  },
  {
    slug: 'how-to-write-linkedin-post', title: 'How to Write a LinkedIn Post People Can Follow',
    description: 'Write a LinkedIn post with one useful idea, a clear opening, readable formatting, and a specific next step for your audience.',
    intro: 'A useful LinkedIn post gives a professional audience one clear idea they can understand or apply. Start with the point, then provide evidence, a short example, or a practical lesson. Avoid vague claims and engagement bait that promise more than the post delivers. Formatting can make a post easier to scan, but excessive line breaks and hashtags do not replace substance. Check company confidentiality rules before sharing work examples or customer details.',
    sections: [
      { heading: 'Choose one audience and one point', body: 'Decide who the post is for and what they should learn, consider, or do after reading it. A post trying to address every audience often becomes generic. Open with a precise observation, question, or result that the body actually supports. Avoid implying that one personal experience proves a universal rule. If you mention a statistic, link to a credible source and provide enough context to interpret it.' },
      { heading: 'Make the body easy to scan', body: 'Use short paragraphs and plain words, define jargon, and put the important context before a “see more” truncation. Bullets can help with a short process or list, but keep the structure meaningful. Add alt text to informative images and subtitles to video where possible. Do not publish screenshots that expose private dashboards, names, or account data. Confirm that any links work and lead to the page you intend.' },
      { heading: 'Use a relevant call to action', body: 'Invite a specific response only when it advances the conversation, such as asking how others handled the same practical challenge. A clear link or next step can be more useful than a generic request for likes. Use a few relevant hashtags if they help categorize the topic, and verify how the platform currently treats them. Measure results against the goal—such as qualified discussion or link visits—not just impressions.' }
    ],
    example: 'Opening: We cut onboarding handoff time by documenting one owner for every step.\nBody: Here is the three-part checklist we changed…\nClose: Which handoff causes the most delay in your team?',
    question: 'How many hashtags should a LinkedIn post have?', answer: 'There is no fixed count that guarantees reach. Use only a few relevant tags when they help readers understand the topic.',
    source: 'https://www.linkedin.com/help/linkedin/answer/a522735', tool: 'linkedin-post-generator', date: '2026-11-08'
  },
  {
    slug: 'how-to-create-css-gradient', title: 'How to Create a CSS Gradient Background',
    description: 'Create a CSS gradient with a direction, color stops, and accessible contrast, then test the result across screen sizes.',
    intro: 'A CSS gradient creates a smooth transition between colors without requiring a separate image file. Linear gradients follow a direction; radial gradients spread from a point or shape. Pick colors that support the text and interface elements placed over them, then test the result on real screens. A generator can help explore syntax quickly, but the final CSS should remain understandable and meet contrast requirements across the entire gradient.',
    sections: [
      { heading: 'Choose gradient type and color stops', body: 'Use linear-gradient for a transition along an angle and radial-gradient for a transition from a center or focal point. Color stops control where each color begins and ends. Start with two or three colors, because many stops can create banding or a noisy visual. Include a fallback background color for older rendering contexts or while the gradient is loading with surrounding styles.' },
      { heading: 'Check contrast throughout the transition', body: 'Text contrast can vary at every point in a gradient. Measure representative areas behind each line of text, including the lightest and darkest regions, and adjust colors or add a solid backing when needed. A gradient preview alone cannot certify accessibility. Avoid relying on color alone to communicate status. Check focus indicators, icons, and borders as well as body text.' },
      { heading: 'Keep the design responsive and maintainable', body: 'Test the background at narrow and wide viewport sizes because a gradient can appear very different when its container changes shape. Use CSS custom properties for colors that belong to a theme, and keep stops close to the component that owns them. Reduce motion concerns are usually limited for static gradients, but animated color transitions can distract or affect users sensitive to movement. Provide a simpler static appearance when appropriate.' }
    ],
    example: '.hero {\n  background: linear-gradient(135deg, #183a35 0%, #557c70 100%);\n  color: #fff;\n}',
    question: 'Can a CSS gradient pass color contrast requirements?', answer: 'It can, but contrast must be checked across the areas where text appears. A single color pair calculation may miss low-contrast points in the transition.',
    source: 'https://developer.mozilla.org/en-US/docs/Web/CSS/gradient/linear-gradient', tool: 'css-gradient-generator', date: '2026-11-08'
  },
  {
    slug: 'how-to-create-css-grid-layout', title: 'How to Create a Responsive CSS Grid Layout',
    description: 'Create a responsive CSS Grid layout with named columns, flexible tracks, and a breakpoint only when the content needs one.',
    intro: 'CSS Grid arranges elements in rows and columns, making it useful for dashboards, galleries, and page layouts. Start by deciding the content relationship and minimum useful width for each item. Flexible tracks can adapt to available space without a breakpoint for every screen size. Use semantic HTML in a meaningful order, then apply grid placement for presentation. Test the layout with zoomed text and narrow screens so content remains readable and keyboard order still makes sense.',
    sections: [
      { heading: 'Define tracks that fit the content', body: 'Use grid-template-columns to describe the available columns. The repeat, minmax, and auto-fit functions can create responsive card layouts that wrap naturally. Set a reasonable minimum width so cards do not become too narrow for their labels and controls. Prefer content-based sizing over fixed widths where possible. Give important regions names with grid-template-areas if that makes the CSS easier to maintain.' },
      { heading: 'Let gaps control spacing', body: 'The gap property creates consistent space between tracks without adding margins to each child. Use row-gap and column-gap only when the two directions need different spacing. Avoid using empty grid cells as decorative spacers; gaps communicate the layout more clearly. If an item spans columns, check how it behaves when the number of columns changes and ensure the content order still matches the reading order.' },
      { heading: 'Test the layout at real content lengths', body: 'Resize the viewport and inspect long headings, translated text, error messages, and enlarged font settings. A layout that works with short demo labels may overflow in production. Use media queries when a meaningful content transition is needed, not simply because a device has a particular brand. Check source order with keyboard navigation and a screen reader; visual placement should not create a confusing sequence.' }
    ],
    example: '.cards {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));\n  gap: 1rem;\n}',
    question: 'Does CSS Grid replace Flexbox?', answer: 'No. Grid is suited to two-dimensional layouts, while Flexbox is often useful for arranging items along one axis. They can be combined.',
    source: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout', tool: 'css-grid-generator', date: '2026-11-08'
  },
  {
    slug: 'how-to-pick-accessible-colors', title: 'How to Pick Accessible Colors for Text',
    description: 'Choose accessible text and background colors by checking contrast ratios and testing interface states beyond the default view.',
    intro: 'Accessible color choices help more people read and use an interface, especially when text is small or displayed in poor lighting. The WCAG contrast formula compares relative luminance for foreground and background colors. Passing a ratio is useful, but color is only one part of accessible design. Check hover, focus, disabled, and error states, and do not use color as the only way to convey meaning. A contrast checker can screen combinations before a full design review.',
    sections: [
      { heading: 'Measure the right foreground and background', body: 'Enter the actual text color and the color directly behind it. The ratio ranges from 1:1 for identical colors to 21:1 for black on white. WCAG AA generally requires 4.5:1 for normal text and 3:1 for large text, with separate requirements for user-interface components and graphics. Transparency, images, and gradients can change the effective background, so sample the rendered color where the text appears.' },
      { heading: 'Check every state and content size', body: 'A button label may pass in its default state but fail on hover or focus. Test links, placeholder text, form errors, charts, and icons that convey information. Large text uses a different threshold, but do not label text “large” unless it meets the defined size and weight criteria. A disabled control may have an exception in some criteria, but it should still remain understandable and usable.' },
      { heading: 'Do not rely on color alone', body: 'Pair color changes with labels, icons, patterns, or text so users can distinguish states without color perception. Test the full page with keyboard focus, zoom, and assistive technology. A contrast checker cannot evaluate whether instructions are clear, focus is visible, or the color system works for every use. Treat the numeric ratio as one check in a broader accessibility review, and test the rendered design rather than only a palette swatch.' }
    ],
    example: 'Normal text on white: #555555 → #FFFFFF\nContrast ratio: approximately 7.46:1\nCheck separately: links, focus ring, button hover, error state',
    question: 'What contrast ratio does normal text need for WCAG AA?', answer: 'The WCAG AA minimum is 4.5:1 for normal text. Large text has a 3:1 minimum; verify the applicable criterion and rendered colors.',
    source: 'https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html', tool: 'color-contrast-checker', date: '2026-11-08'
  },
  {
    slug: 'how-to-calculate-daily-calorie-needs', title: 'How to Estimate Your Daily Calorie Needs',
    description: 'Estimate daily calorie needs from personal inputs and activity, then treat the result as a starting point rather than a prescription.',
    intro: 'A calorie-needs calculator estimates how much energy a person may use in a day from factors such as age, height, weight, and activity. It cannot measure an individual’s metabolism or account for every health condition. Use the result as a rough starting point, not a medical prescription or a guarantee of weight change. Needs can differ substantially between people, and food labels and activity estimates also have measurement error.',
    sections: [
      { heading: 'Enter accurate measurements and activity', body: 'Use current height and weight units, and choose an activity description that reflects a typical week rather than an unusually active day. Different equations and activity multipliers produce different estimates. If you are pregnant, breastfeeding, under 18, recovering from illness, or managing a medical condition, a general adult calculator may not be appropriate. Consult a qualified clinician or registered dietitian for personalized guidance.' },
      { heading: 'Interpret the output as an estimate', body: 'A maintenance estimate is a model based on assumptions, not a direct measurement of energy expenditure. If you track intake and body weight, use a consistent method over time and understand that short-term changes reflect water, digestion, and other factors. Do not respond to a single day’s fluctuation with extreme restriction. Nutrient quality, sleep, medications, and health are not summarized by a calorie number.' },
      { heading: 'Prioritize safety and sustainable habits', body: 'Avoid very low-calorie diets or rapid weight-loss plans without professional supervision. Seek medical advice if changes in appetite or weight are unexplained or accompanied by symptoms. Focus on a balanced eating pattern and activities that support overall health. For a child or teenager, consult pediatric guidance rather than applying adult estimates. A calculator can help explain assumptions, but it should not replace care tailored to your situation.' }
    ],
    example: 'Illustrative inputs: adult, 30 years, 170 cm, 70 kg, moderate activity\nResult: use the calculator’s estimate as a starting range\nNext: discuss personal goals with a qualified health professional',
    question: 'Are calorie calculator results exact?', answer: 'No. They estimate energy needs using equations and activity assumptions; individual needs and tracking accuracy vary.',
    source: 'https://www.niddk.nih.gov/bwp', tool: 'calorie-needs-calculator', date: '2026-11-08'
  },
  {
    slug: 'how-to-use-sleep-cycle-calculator', title: 'How to Use a Sleep Cycle Calculator',
    description: 'Use a sleep cycle calculator to plan a bedtime or wake time, while accounting for sleep latency and the limits of cycle estimates.',
    intro: 'A sleep cycle calculator estimates bedtimes or wake times from a chosen schedule and an assumed sleep-cycle length. Real sleep cycles vary between people and across the night, so a calculator cannot predict the exact best moment to wake. Use it as a planning prompt rather than a health diagnosis. Consistent sleep and enough total time for rest are more important than trying to match a precise cycle minute by minute.',
    sections: [
      { heading: 'Start with the wake time you need', body: 'Choose a realistic wake time and count backward to allow adequate sleep opportunity. Many calculators use approximate blocks around 90 minutes and add a buffer for falling asleep. Treat those numbers as estimates; individual cycles are not identical 90-minute units. If you need to wake at 7:00 a.m., compare several bedtimes that provide a sufficient total window rather than choosing the shortest option that aligns to a cycle boundary.' },
      { heading: 'Build a consistent sleep opportunity', body: 'Keep sleep and wake times reasonably consistent, including weekends, and make the bedroom quiet, dark, and comfortable. Reduce caffeine late in the day and create a relaxing wind-down routine. A calculator does not account for shift work, sleep apnea, pain, medication, stress, or other causes of disrupted rest. If you regularly cannot sleep despite adequate opportunity, a clinician can help assess the cause.' },
      { heading: 'Look for patterns over time', body: 'Record your actual bedtime, wake time, and how rested you feel for a few weeks if you are trying to understand your schedule. Wearables and cycle estimates can be inaccurate and should not diagnose a sleep disorder. Seek medical care for persistent daytime sleepiness, loud snoring with breathing pauses, or other concerning symptoms. Do not delay necessary sleep to fit a calculator’s suggested interval.' }
    ],
    example: 'Required wake time: 7:00 a.m.\nDesired sleep opportunity: 8 hours\nPlan bedtime around 11:00 p.m. plus wind-down time\nUse cycle timing only as a rough comparison, not a guarantee',
    question: 'Are sleep cycles exactly 90 minutes long?', answer: 'No. Cycle duration varies between people and during the night. A calculator’s cycle length is only an approximation.',
    source: 'https://www.cdc.gov/sleep/about/index.html', tool: 'sleep-cycle-calculator', date: '2026-11-08'
  },
  {
    slug: 'how-to-calculate-body-fat-percentage', title: 'How to Calculate Body Fat Percentage',
    description: 'Estimate body fat percentage with measurements, understand method limitations, and avoid treating one estimate as a diagnosis.',
    intro: 'Body-fat percentage estimates how much of a person’s body mass is fat, but methods differ in accuracy and assumptions. Tape-measure formulas use body circumferences and demographic inputs to estimate a value; they do not directly measure body composition. Take measurements carefully and repeat them under similar conditions if tracking a trend. For medical or athletic decisions, consult a qualified professional and consider a method suited to the purpose.',
    sections: [
      { heading: 'Measure consistently for the chosen formula', body: 'Use a flexible tape and follow the specific instructions for each measurement site. Keep the tape level and snug without compressing skin. The Navy method uses different circumference inputs for men and women, so select the correct formula as defined by the calculator. Height and units must match the requested format. Small measurement errors can shift the estimated result, especially when the tape placement changes between attempts.' },
      { heading: 'Understand estimation error', body: 'Circumference formulas are population estimates and may not fit every body shape or demographic group. Hydration, recent exercise, posture, and measurement technique can affect results. Do not compare values from different methods as if they were measured on the same scale. If tracking a change, use the same method and conditions, and pay attention to broader health markers rather than a single percentage.' },
      { heading: 'Use the number responsibly', body: 'A body-composition estimate is not a diagnosis and does not reveal health by itself. Avoid setting extreme diet or exercise goals based on a small change that may be measurement noise. Seek advice from a clinician or registered dietitian for personalized goals, health concerns, or a history of disordered eating. For adolescents and pregnancy, standard adult formulas may be inappropriate.' }
    ],
    example: 'Measurement set (example only):\nHeight: 170 cm\nWaist: 82 cm\nNeck: 36 cm\nMethod: follow the selected formula’s sex-specific measurement instructions\nInterpretation: estimated trend, not a clinical diagnosis',
    question: 'Is a tape-measure body-fat estimate exact?', answer: 'No. It is an estimate that depends on formula assumptions and careful measurement. Use the same method for trend comparisons.',
    source: 'https://www.navyfitness.org/fitness/physical-readiness/body-composition-assessment', tool: 'body-fat-percentage-calculator', date: '2026-11-08'
  }
] as const;

const descriptionEndings = [
  ' Read the steps and example.',
  ' Follow these practical steps.',
  ' See the worked example below.',
  ' Review each step and example.',
  ' Get clear steps and examples.',
  ' See how.',
  ' Read more.',
  ' Try the steps.'
];
const seoTitles: Record<string, string> = {
  'how-to-merge-pdf-files-online': 'How to Merge PDF Files Online: A Simple Guide Today',
  'how-to-compress-pdf-under-1mb': 'Compress PDF to 1MB: How to Reduce File Size',
  'how-to-convert-heic-to-jpg': 'HEIC to JPG: Convert Photos on Any Device Today',
  'how-to-remove-pdf-password': 'Remove PDF Password: A Guide for Files You Own',
  'how-to-convert-image-to-text-ocr': 'Image to Text: Convert a Picture with OCR Easily',
  'how-to-resize-image-without-losing-quality': 'Resize Image Without Losing Quality: Practical Steps',
  'how-to-convert-webp-to-jpg': 'WebP to JPG: Convert Images for Any App Today',
  'how-to-split-pdf-pages': 'Split PDF: Extract or Separate PDF Pages Easily',
  'how-to-calculate-compound-interest': 'Compound Interest Calculator: A Step-by-Step Guide',
  'how-to-calculate-bmi': 'BMI Calculator: How to Calculate BMI Correctly',
  'how-to-calculate-mortgage-payment': 'Mortgage Calculator: Estimate a Monthly Payment',
  'how-to-calculate-loan-amortization': 'Amortization Schedule: Calculate Loan Payments',
  'how-to-calculate-percentage': 'How to Calculate Percentage: Formula and Examples',
  'how-to-calculate-tip': 'Tip Calculator: Calculate a Tip and Split a Bill',
  'how-to-calculate-gpa': 'GPA Calculator: Calculate Your Grade Point Average',
  'salary-to-hourly-conversion': 'Salary to Hourly: Convert Annual Pay to an Hourly Rate',
  'what-is-structured-data-json-ld': 'Structured Data JSON-LD: How to Add Schema Markup',
  'how-to-generate-xml-sitemap': 'XML Sitemap Generator: Build a Sitemap for Search',
  'how-to-create-robots-txt': 'Robots.txt Generator: Write and Test Crawler Rules',
  'what-are-open-graph-meta-tags': 'Open Graph Meta Tags: Create Better Link Previews',
  'how-to-check-keyword-density': 'Keyword Density Checker: Measure Terms on a Page',
  'how-to-create-hreflang-tags': 'Hreflang Tags: Set Up Language Alternatives Correctly',
  'how-to-write-meta-descriptions': 'Meta Description: How to Write a Search Snippet',
  'how-to-build-utm-links': 'UTM Builder: Build Campaign Tracking Links',
  'serp-preview-tool-how-to-check': 'SERP Preview: Check a Search Result Snippet',
  'what-is-canonical-url': 'Canonical URL: Choose the Preferred Page Version',
  'how-to-convert-json-to-csv': 'JSON to CSV: Convert Data Without Losing Fields',
  'how-to-format-json': 'JSON Formatter: Format and Read JSON Clearly',
  'how-to-validate-json': 'JSON Validator: Check Syntax and Structure',
  'json-vs-yaml-which-to-use': 'JSON vs YAML: Which Format Should You Use?',
  'how-to-convert-csv-to-json': 'CSV to JSON: Convert Rows into Data Objects',
  'how-to-convert-xml-to-json': 'XML to JSON: Convert Structured Data Safely',
  'how-to-decode-jwt-token': 'JWT Decoder: Decode a Token and Check Claims',
  'how-to-generate-uuid': 'UUID Generator: Create Unique Identifiers Correctly',
  'how-to-generate-strong-password': 'Password Generator: Create a Strong Unique Password',
  'what-is-base64-encoding': 'Base64 Encode: Convert Text and Binary Data Safely',
  'how-to-generate-qr-code': 'QR Code Generator: Create and Test a Scannable Code',
  'sha256-vs-md5-which-hash-to-use': 'SHA256 vs MD5: Which Hash Should You Use?',
  'how-to-write-professional-email': 'How to Write a Professional Email: Clear Steps',
  'how-to-write-cover-letter': 'How to Write a Cover Letter: A Practical Guide',
  'how-to-write-resignation-letter': 'Resignation Letter: Write a Professional Notice',
  'how-to-write-resume-bullet-points': 'Resume Bullet Points: Write Clear, Useful Examples',
  'how-to-create-meeting-agenda': 'Meeting Agenda Template: Plan a Useful Meeting',
  'how-to-write-linkedin-post': 'LinkedIn Post Generator: Write a Useful Post',
  'how-to-create-css-gradient': 'CSS Gradient Generator: Create a CSS Background',
  'how-to-create-css-grid-layout': 'CSS Grid Generator: Build a Responsive Layout',
  'how-to-pick-accessible-colors': 'Color Contrast Checker: Choose Accessible Text Colors',
  'how-to-calculate-daily-calorie-needs': 'Calorie Calculator: Estimate Daily Energy Needs Safely',
  'how-to-use-sleep-cycle-calculator': 'Sleep Cycle Calculator: Plan a Consistent Bedtime',
  'how-to-calculate-body-fat-percentage': 'Body Fat Calculator: Estimate Percentage Carefully'
};
const seoKeywords: Record<string, string> = {
  'how-to-merge-pdf-files-online':'how to merge pdf files','how-to-compress-pdf-under-1mb':'compress pdf to 1mb','how-to-convert-heic-to-jpg':'heic to jpg','how-to-remove-pdf-password':'remove pdf password','how-to-convert-image-to-text-ocr':'image to text','how-to-resize-image-without-losing-quality':'resize image','how-to-convert-webp-to-jpg':'webp to jpg','how-to-split-pdf-pages':'split pdf',
  'how-to-calculate-compound-interest':'compound interest calculator','how-to-calculate-bmi':'bmi calculator','how-to-calculate-mortgage-payment':'mortgage calculator','how-to-calculate-loan-amortization':'amortization schedule','how-to-calculate-percentage':'how to calculate percentage','how-to-calculate-tip':'tip calculator','how-to-calculate-gpa':'gpa calculator','salary-to-hourly-conversion':'salary to hourly',
  'what-is-structured-data-json-ld':'structured data json-ld','how-to-generate-xml-sitemap':'xml sitemap generator','how-to-create-robots-txt':'robots.txt generator','what-are-open-graph-meta-tags':'open graph meta tags','how-to-check-keyword-density':'keyword density checker','how-to-create-hreflang-tags':'hreflang tags','how-to-write-meta-descriptions':'meta description','how-to-build-utm-links':'utm builder','serp-preview-tool-how-to-check':'serp preview','what-is-canonical-url':'canonical url',
  'how-to-convert-json-to-csv':'json to csv','how-to-format-json':'json formatter','how-to-validate-json':'json validator','json-vs-yaml-which-to-use':'json vs yaml','how-to-convert-csv-to-json':'csv to json','how-to-convert-xml-to-json':'xml to json',
  'how-to-decode-jwt-token':'jwt decoder','how-to-generate-uuid':'uuid generator','how-to-generate-strong-password':'password generator','what-is-base64-encoding':'base64 encode','how-to-generate-qr-code':'qr code generator','sha256-vs-md5-which-hash-to-use':'sha256 vs md5',
  'how-to-write-professional-email':'how to write professional email','how-to-write-cover-letter':'how to write cover letter','how-to-write-resignation-letter':'resignation letter','how-to-write-resume-bullet-points':'resume bullet points','how-to-create-meeting-agenda':'meeting agenda template','how-to-write-linkedin-post':'linkedin post generator',
  'how-to-create-css-gradient':'css gradient generator','how-to-create-css-grid-layout':'css grid generator','how-to-pick-accessible-colors':'color contrast checker',
  'how-to-calculate-daily-calorie-needs':'calorie calculator','how-to-use-sleep-cycle-calculator':'sleep cycle calculator','how-to-calculate-body-fat-percentage':'body fat calculator'
};
const editorialNotes: Record<string, string> = {
  'how-to-write-resignation-letter': 'Keep a dated copy with your employment records and follow the organization’s documented handover process.',
  'how-to-write-resume-bullet-points': 'Use the employer’s terminology only when it accurately describes your work and skills.',
  'how-to-create-meeting-agenda': 'Send an updated agenda if the goal or decision changes before attendees join.',
  'how-to-write-linkedin-post': 'Respond thoughtfully to relevant comments and correct any factual error promptly.',
  'how-to-create-css-gradient': 'Check the full surface at each breakpoint, including text placed over the transition.',
  'how-to-create-css-grid-layout': 'Retest with real labels, error messages, and translated content before release carefully.',
  'how-to-pick-accessible-colors': 'Also confirm focus indicators and state colors remain distinguishable without color alone.',
  'how-to-calculate-daily-calorie-needs': 'Discuss meaningful health changes with a qualified professional who knows your circumstances.',
  'how-to-use-sleep-cycle-calculator': 'An estimate cannot replace a consistent schedule and adequate time available for sleep.',
  'how-to-calculate-body-fat-percentage': 'Repeat measurements under similar conditions before comparing changes over time carefully.'
};
function seoDescription(article: typeof growthArticles[number]): string {
  let description: string = article.description;
  const keyword = seoKeywords[article.slug];
  if (keyword && !description.toLowerCase().includes(keyword.toLowerCase())) description = `${keyword}: ${description}`;
  if (description.length > 160) description = description.slice(0, 159).replace(/\s+\S*$/, '').trimEnd() + '…';
  if (description.length < 140) {
    const ending = descriptionEndings.find(text => description.length + text.length >= 140 && description.length + text.length <= 160);
    if (ending) description += ending;
  }
  return description;
}
export const growthArticlesForBlog = growthArticles.map(article => ({
  ...article,
  title: (seoTitles[article.slug] ?? article.title) + ((seoTitles[article.slug] ?? article.title).length < 50 ? ((seoTitles[article.slug] ?? article.title).length <= 47 ? ' — Practical Guide' : ' — Guide') : ''),
  description: seoDescription(article),
  sections: article.sections.map((section, index) => index === 2 && editorialNotes[article.slug] ? { ...section, body: section.body + ' ' + editorialNotes[article.slug] } : section)
}));
