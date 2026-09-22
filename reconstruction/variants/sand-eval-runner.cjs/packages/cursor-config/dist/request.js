/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/cursor-config/dist/request.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var LOCAL_CLI_MODE_ENV = "CURSOR_AGENT_CLI_LOCAL_MODE";
var LOCAL_CLI_MODE_HEADER = "local-cli-mode";
function isLocalCliMode() {
  var _a20;
  return typeof process !== "undefined" && ((_a20 = process.env) === null || _a20 === void 0 ? void 0 : _a20[LOCAL_CLI_MODE_ENV]) === "true";
}
function applyLocalCliModeHeader(headers) {
  if (isLocalCliMode()) {
    headers.set(LOCAL_CLI_MODE_HEADER, "true");
  }
}

