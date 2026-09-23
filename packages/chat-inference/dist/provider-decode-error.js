var INFERENCE_REQUEST_ERROR_TYPE_HEADER = "x-cursor-inference-request-error-type";
var PROVIDER_DECODE_ERROR_TYPE = "PROVIDER_DECODE_ERROR";
function isProviderDecodeError(error42) {
  var _a19;
  const seen = /* @__PURE__ */ new Set();
  let current = error42;
  while (typeof current === "object" && current !== null && !seen.has(current)) {
    seen.add(current);
    const carrier = current;
    if (typeof ((_a19 = carrier.metadata) === null || _a19 === void 0 ? void 0 : _a19.get) === "function" && carrier.metadata.get(INFERENCE_REQUEST_ERROR_TYPE_HEADER) === PROVIDER_DECODE_ERROR_TYPE) {
      return true;
    }
    current = carrier.cause;
  }
  return false;
}
