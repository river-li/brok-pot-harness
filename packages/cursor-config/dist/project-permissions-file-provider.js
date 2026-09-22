/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/cursor-config/dist/project-permissions-file-provider.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function filterStrings(value) {
  if (!Array.isArray(value)) {
    return void 0;
  }
  return value.filter((entry) => typeof entry === "string");
}
function parsePermissionsAutoRunConfig(value) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return void 0;
  }
  const autoRun = value;
  return {
    allowInstructions: filterStrings(autoRun.allow_instructions),
    blockInstructions: filterStrings(autoRun.block_instructions)
  };
}
function parseProjectPermissionsFileConfig(raw) {
  var _a19;
  const errors = [];
  const parsed2 = parse9(raw, errors, {
    allowTrailingComma: true
  });
  if (errors.length > 0) {
    return void 0;
  }
  if (parsed2 === null || typeof parsed2 !== "object" || Array.isArray(parsed2)) {
    return void 0;
  }
  const config2 = parsed2;
  const autoRunConfig = (_a19 = config2.autoReview) !== null && _a19 !== void 0 ? _a19 : config2.autoRun;
  return {
    autoRun: parsePermissionsAutoRunConfig(autoRunConfig)
  };
}

