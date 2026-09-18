function isConnectionRefusedError(error3) {
  var _a20;
  if (!(error3 instanceof Error)) {
    return false;
  }
  const errorWithCode = error3;
  const nestedCode = (_a20 = error3.cause) === null || _a20 === void 0 ? void 0 : _a20.code;
  if (errorWithCode.code === "ECONNREFUSED" || nestedCode === "ECONNREFUSED") {
    return true;
  }
  return error3.message.includes("ECONNREFUSED");
}
function extractStrictSseFallbackStatusCode(error3) {
  if (!error3 || typeof error3 !== "object") {
    return void 0;
  }
  const maybeCode = error3.code;
  if (typeof maybeCode === "number" && maybeCode >= 100 && maybeCode <= 599) {
    return maybeCode;
  }
  if (typeof maybeCode === "string" && /^\d{3}$/.test(maybeCode) && Number(maybeCode) >= 100 && Number(maybeCode) <= 599) {
    return Number(maybeCode);
  }
  const maybeMessage = error3 instanceof Error ? error3.message : typeof error3.message === "string" ? error3.message : void 0;
  if (!maybeMessage) {
    return void 0;
  }
  const match2 = maybeMessage.match(/\bHTTP\s+(\d{3})\b/i);
  if (!(match2 === null || match2 === void 0 ? void 0 : match2[1])) {
    return void 0;
  }
  const parsed = Number.parseInt(match2[1], 10);
  return Number.isNaN(parsed) ? void 0 : parsed;
}
function isSseFallbackAppropriate(error3) {
  const httpStatus = extractStrictSseFallbackStatusCode(error3);
  if (httpStatus !== void 0) {
    return httpStatus === 400 || httpStatus === 404 || httpStatus === 405;
  }
  if (error3 instanceof Error && error3.message.toLowerCase().includes("sessionid must be provided")) {
    return true;
  }
  return isConnectionRefusedError(error3);
}
var init_sse_fallback = __esm({
  "../packages/mcp-core/dist/transport/sse-fallback.js"() {
    "use strict";
  }
});
