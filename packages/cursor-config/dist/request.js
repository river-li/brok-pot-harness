function isLocalCliMode() {
  var _a19;
  return typeof process !== "undefined" && ((_a19 = process.env) === null || _a19 === void 0 ? void 0 : _a19[LOCAL_CLI_MODE_ENV]) === "true";
}
function applyLocalCliModeHeader(headers) {
  if (isLocalCliMode()) {
    headers.set(LOCAL_CLI_MODE_HEADER, "true");
  }
}
var LOCAL_CLI_MODE_ENV, LOCAL_CLI_MODE_HEADER;
var init_request = __esm({
  "../packages/cursor-config/dist/request.js"() {
    "use strict";
    LOCAL_CLI_MODE_ENV = "CURSOR_AGENT_CLI_LOCAL_MODE";
    LOCAL_CLI_MODE_HEADER = "local-cli-mode";
  }
});
