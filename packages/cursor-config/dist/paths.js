/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/cursor-config/dist/paths.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_node_os19 = require("node:os");
var import_node_path77 = require("node:path");
function getConfigDir() {
  const override = process.env.CURSOR_CONFIG_DIR;
  if (override === null || override === void 0 ? void 0 : override.trim())
    return override;
  const xdg = process.env.XDG_CONFIG_HOME;
  if (xdg === null || xdg === void 0 ? void 0 : xdg.trim())
    return (0, import_node_path77.join)(xdg, "cursor");
  return (0, import_node_path77.join)((0, import_node_os19.homedir)(), ".cursor");
}
var HASH_LENGTH = 7;
var MAX_SOCKET_PATH_LENGTH = 104;
var WINDOWS_SOCK_LENGTH = "worker.sock".length;
var MAX_PREFIX_LENGTH_BEFORE_HASH = MAX_SOCKET_PATH_LENGTH - 1 - HASH_LENGTH - 1 - WINDOWS_SOCK_LENGTH;
var MAX_FULL_PATH_LENGTH = MAX_SOCKET_PATH_LENGTH - WINDOWS_SOCK_LENGTH - 1;

