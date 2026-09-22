/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/box-store-sync/conditional-put.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function classifyConditionalPutStatus(status) {
  switch (status) {
    case 412:
      return "already-stored";
    case 409:
      return "concurrent-write";
    default:
      return "other";
  }
}

