/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/codebase-telemetry/dist/privacy.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var PrivacyMode3 = {
  UNSPECIFIED: 0,
  NO_STORAGE: 1,
  NO_TRAINING: 2,
  USAGE_DATA_TRAINING_ALLOWED: 3,
  USAGE_CODEBASE_TRAINING_ALLOWED: 4
};
function toPrivacyMode(value) {
  switch (value) {
    case PrivacyMode3.NO_STORAGE:
    case PrivacyMode3.NO_TRAINING:
    case PrivacyMode3.USAGE_DATA_TRAINING_ALLOWED:
    case PrivacyMode3.USAGE_CODEBASE_TRAINING_ALLOWED:
      return value;
    default:
      return PrivacyMode3.UNSPECIFIED;
  }
}
function isCodebaseTelemetryAllowed(mode) {
  return mode === PrivacyMode3.USAGE_CODEBASE_TRAINING_ALLOWED;
}

