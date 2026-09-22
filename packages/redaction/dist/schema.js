/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/redaction/dist/schema.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var rawSchema = REDACTION_SCHEMA;
var REDACTION_SCHEMA2 = Object.fromEntries(Object.entries(rawSchema).map(([msgName, fields2]) => [
  msgName,
  Object.fromEntries(Object.entries(fields2).map(([fieldName, classificationRaw]) => [
    fieldName,
    parseClassification(classificationRaw)
  ]))
]));
function parseClassification(raw) {
  if (typeof raw === "string") {
    return stringToClassification(raw);
  }
  return {
    key: raw.key ? stringToClassification(raw.key) : DataClassification.SAFE,
    value: raw.value ? stringToClassification(raw.value) : DataClassification.SAFE
  };
}
function stringToClassification(str3) {
  switch (str3.toUpperCase()) {
    case "SAFE":
      return DataClassification.SAFE;
    case "CODE":
      return DataClassification.CODE;
    case "PATH":
      return DataClassification.PATH;
    case "CREDENTIALS":
      return DataClassification.CREDENTIALS;
    case "PROVIDER_INFO":
      return DataClassification.PROVIDER_INFO;
    default:
      return DataClassification.CODE;
  }
}

