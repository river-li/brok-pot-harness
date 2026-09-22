/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/utils/dist/attempt.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function attemptSync(operation) {
  try {
    return { ok: true, value: operation() };
  } catch (error42) {
    return { ok: false, error: error42 };
  }
}
var init_attempt = __esm({
  "../packages/utils/dist/attempt.js"() {
    "use strict";
  }
});

