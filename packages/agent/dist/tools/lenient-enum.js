/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/lenient-enum.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_zod();
function preprocessLenientEnumValue(value, options2) {
  if (typeof value !== "string" || options2.includes(value)) {
    return value;
  }
  const lower = value.toLowerCase();
  const matches = options2.filter((option) => option.toLowerCase() === lower);
  return matches.length === 1 ? matches[0] : value;
}
function lenientEnum(schema2) {
  return external_exports.preprocess((value) => preprocessLenientEnumValue(value, schema2.options), schema2);
}

