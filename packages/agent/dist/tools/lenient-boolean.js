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
