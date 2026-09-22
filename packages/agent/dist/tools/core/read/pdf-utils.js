/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/core/read/pdf-utils.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_node_os21 = __toESM(require("node:os"), 1);
var import_node_path89 = __toESM(require("node:path"), 1);
var import_piscina2 = require("piscina");
var PDF_HEADER = [37, 80, 68, 70];
var PDF_EXTENSION_REGEX = /\.pdf$/i;
function hasPdfMagicBytes(bytes) {
  if (bytes.length < PDF_HEADER.length) {
    return false;
  }
  return PDF_HEADER.every((value, index) => bytes[index] === value);
}
function isPdfBinary(bytes, filePath) {
  if (hasPdfMagicBytes(bytes)) {
    return true;
  }
  if (filePath && PDF_EXTENSION_REGEX.test(filePath)) {
    return true;
  }
  return false;
}
var { dir: workerDir2, extension: extension2 } = resolveWorkerLocation(__import_meta_url, "pdf-worker");
var sanitizedEnvForWorkers2 = Object.fromEntries(Object.entries(process.env).filter(([key, value]) => key !== "NSOLID_STATSD" && value !== void 0));
var _pdfWorkerPool;
function isSeaProcess2() {
  return "sea" in process.versions;
}
function getPdfWorkerPool() {
  if (isSeaProcess2()) {
    throw new Error("Piscina worker pool is not available in the self-contained worker SEA");
  }
  if (_pdfWorkerPool === void 0) {
    _pdfWorkerPool = new import_piscina2.Piscina({
      minThreads: 1,
      maxThreads: Math.max(1, Math.floor(import_node_os21.default.availableParallelism() / 4)),
      execArgv: extension2 === "ts" ? ["--experimental-strip-types"] : void 0,
      env: sanitizedEnvForWorkers2
    });
  }
  return _pdfWorkerPool;
}
async function extractPdfText(bytes) {
  const params = { bytes };
  if (isSeaProcess2()) {
    const { default: extractPdfTextWorker2 } = await Promise.resolve().then(() => (init_pdf_worker(), pdf_worker_exports));
    const result2 = await extractPdfTextWorker2(params);
    return result2.text;
  }
  const result = await getPdfWorkerPool().run(params, {
    filename: import_node_path89.default.join(workerDir2, `./pdf-worker.${extension2}`)
  });
  return result.text;
}

