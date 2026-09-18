var SAND_BROWSER_DRIVER_BOX_DIR = "/tmp/.sand-browser";
var SAND_BROWSER_DRIVER_SHELL_TIMEOUT_MS = 12e4;
function sandBrowserDriverBoxPath(source) {
  const digest = (0, import_node_crypto64.createHash)("sha256").update(source).digest("hex").slice(0, 16);
  return `${SAND_BROWSER_DRIVER_BOX_DIR}/driver-${digest}.mjs`;
}
var SAND_BROWSER_RESULT_MARKER = "__SAND_BROWSER_RESULT__";
var SAND_BROWSER_STALE_REF_ERROR = "Unknown or stale ref";
var SAND_BROWSER_HIDDEN_TARGET_ERROR = "Hidden target";
var SAND_BROWSER_DRIVER_SOURCE = sand_browser_driver_default;
var SAND_BROWSER_DRIVER_BOX_PATH = sandBrowserDriverBoxPath(SAND_BROWSER_DRIVER_SOURCE);
