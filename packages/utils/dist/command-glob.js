/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/utils/dist/command-glob.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function escapeRegExp2(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function matchesCommandGlob(pattern, value) {
  const trimmedPattern = pattern.trim();
  const escapedPattern = escapeRegExp2(trimmedPattern);
  const regexSource = `^${escapedPattern.replace(/\\\*/g, ".*")}$`;
  try {
    return new RegExp(regexSource).test(value);
  } catch (_a20) {
    return trimmedPattern === value;
  }
}
var init_command_glob = __esm({
  "../packages/utils/dist/command-glob.js"() {
    "use strict";
  }
});

