var SMART_MODE_CLASSIFIER_MANUAL_REVIEW_ERROR_REASON = "An error occured while classifying this action. Please review manually.";
var METADATA_MARKER = "\n\nSmartModeClassifierFailureMetadata:";
function parseSmartModeClassifierFailureMetadata(error42) {
  if (error42 === void 0) {
    return void 0;
  }
  const markerIndex = error42.indexOf(METADATA_MARKER);
  if (markerIndex < 0) {
    return void 0;
  }
  const rawMetadata = error42.slice(markerIndex + METADATA_MARKER.length);
  try {
    const parsed2 = JSON.parse(rawMetadata);
    if (parsed2 === null || typeof parsed2 !== "object") {
      return void 0;
    }
    const record2 = parsed2;
    return {
      failureReason: typeof record2.failureReason === "string" ? record2.failureReason : void 0,
      retryable: typeof record2.retryable === "boolean" ? record2.retryable : void 0
    };
  } catch {
    return void 0;
  }
}
