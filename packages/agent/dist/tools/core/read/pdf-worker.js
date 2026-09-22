/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/core/read/pdf-worker.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var pdf_worker_exports = {};
__export(pdf_worker_exports, {
  default: () => extractPdfTextWorker
});
async function extractPdfTextWorker(params) {
  const buffer = Buffer.isBuffer(params.bytes) ? params.bytes : Buffer.from(params.bytes);
  const parser = new PDFParse({ data: buffer });
  try {
    const result = await parser.getText();
    return {
      text: typeof result.text === "string" ? result.text : ""
    };
  } finally {
    await parser.destroy();
  }
}
var init_pdf_worker = __esm({
  "../packages/agent/dist/tools/core/read/pdf-worker.js"() {
    "use strict";
    init_esm17();
  }
});

