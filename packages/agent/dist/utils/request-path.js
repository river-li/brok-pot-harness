/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/utils/request-path.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_node_path82 = __toESM(require("node:path"), 1);
function getRequestPathModule(requestContext) {
  const isWindows3 = requestContext.env?.osVersion?.toLowerCase().includes("win32") === true;
  return isWindows3 ? import_node_path82.default.win32 : import_node_path82.default.posix;
}

