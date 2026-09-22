/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/context/dist/abort-reason.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function getAbortReasonInfo(reason) {
  if (reason instanceof Error) {
    return {
      abortReasonType: "error",
      abortReasonName: reason.name,
      abortReasonMessage: reason.message
    };
  }
  if (typeof reason === "string") {
    return { abortReasonType: "string", abortReasonMessage: reason };
  }
  if (reason === void 0) {
    return { abortReasonType: "undefined" };
  }
  return { abortReasonType: typeof reason };
}
var init_abort_reason = __esm({
  "../packages/context/dist/abort-reason.js"() {
    "use strict";
  }
});

