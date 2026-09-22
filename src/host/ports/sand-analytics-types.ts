/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/ports/sand-analytics-types.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function sandMessageLengthBucket(length) {
  if (length <= 0) return "empty";
  if (length < 20) return "xs";
  if (length < 100) return "s";
  if (length < 500) return "m";
  if (length < 2e3) return "l";
  return "xl";
}

