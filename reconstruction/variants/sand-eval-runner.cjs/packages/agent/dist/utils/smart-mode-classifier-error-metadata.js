/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/utils/smart-mode-classifier-error-metadata.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var SMART_MODE_CLASSIFIER_MANUAL_REVIEW_ERROR_REASON = "An error occured while classifying this action. Please review manually.";
var METADATA_MARKER = "\n\nSmartModeClassifierFailureMetadata:";
function parseSmartModeClassifierFailureMetadata(error3) {
  if (error3 === void 0) {
    return void 0;
  }
  const markerIndex = error3.indexOf(METADATA_MARKER);
  if (markerIndex < 0) {
    return void 0;
  }
  const rawMetadata = error3.slice(markerIndex + METADATA_MARKER.length);
  try {
    const parsed = JSON.parse(rawMetadata);
    if (parsed === null || typeof parsed !== "object") {
      return void 0;
    }
    const record2 = parsed;
    return {
      failureReason: typeof record2.failureReason === "string" ? record2.failureReason : void 0,
      retryable: typeof record2.retryable === "boolean" ? record2.retryable : void 0
    };
  } catch {
    return void 0;
  }
}

