/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/local-exec/dist/int32.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var INT32_MIN2 = -(2 ** 31);
var INT32_MAX2 = 2 ** 31 - 1;
function clampInt32(n) {
  if (Number.isNaN(n)) {
    return 0;
  }
  if (n < INT32_MIN2) {
    return INT32_MIN2;
  }
  if (n > INT32_MAX2) {
    return INT32_MAX2;
  }
  return n;
}

