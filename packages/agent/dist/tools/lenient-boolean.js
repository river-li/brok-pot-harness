/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/lenient-boolean.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_zod();
function preprocessLenientBoolean(value) {
  if (value === "true") {
    return true;
  }
  if (value === "false") {
    return false;
  }
  return value;
}
function lenientBoolean(schema2) {
  return external_exports.preprocess(preprocessLenientBoolean, schema2 ?? external_exports.boolean());
}

