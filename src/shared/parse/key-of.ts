/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/parse/key-of.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function isKeyOf(table, key) {
  return typeof key === "string" && Object.hasOwn(table, key);
}

