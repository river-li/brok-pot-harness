function isUnknownRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function parseJsonOrUndefined(text2) {
  let value;
  try {
    value = JSON.parse(text2);
  } catch {
    value = void 0;
  }
  return value;
}
var init_unknown_record = __esm({
  "src/shared/parse/unknown-record.ts"() {
    "use strict";
  }
});
