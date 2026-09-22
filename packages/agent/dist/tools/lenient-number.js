/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/lenient-number.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_zod();
function preprocessLenientNumber(val) {
  if (val === void 0) {
    return void 0;
  }
  if (typeof val === "number") {
    return val;
  }
  if (typeof val === "string") {
    const trimmed = val.trim();
    if (trimmed === "") {
      return val;
    }
    const num = Number(trimmed);
    if (Number.isNaN(num)) {
      return val;
    }
    return num;
  }
  return val;
}
function lenientNumber(schema2 = external_exports.number()) {
  return external_exports.preprocess(preprocessLenientNumber, schema2);
}

