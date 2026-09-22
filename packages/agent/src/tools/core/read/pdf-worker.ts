/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/src/tools/core/read/pdf-worker.ts
 * Bundle: sand-host/pdf-worker.js
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
var pdf_worker_exports = {};
__export(pdf_worker_exports, {
  default: () => extractPdfTextWorker
});
module.exports = __toCommonJS(pdf_worker_exports);

// @recovered-fragment 2/2
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
