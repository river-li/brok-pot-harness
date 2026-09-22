/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/utils/request-path.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_node_path47 = __toESM(require("node:path"), 1);
function getRequestPathModule(requestContext) {
  const isWindows4 = requestContext.env?.osVersion?.toLowerCase().includes("win32") === true;
  return isWindows4 ? import_node_path47.default.win32 : import_node_path47.default.posix;
}

