var import_node_child_process16 = require("node:child_process");
var import_node_fs101 = require("node:fs");
var import_node_path178 = require("node:path");
var SAND_WEBAUTHN_PROXY_MARKER_PATH = "/home/box/.sand-webauthn-proxy-enabled";
var BOX_CHROME_POLICY_COMMAND = "/usr/local/bin/box-chrome-policy";
function applyWebAuthnProxyMarker(enabled, markerPath = SAND_WEBAUTHN_PROXY_MARKER_PATH, policyCommand = BOX_CHROME_POLICY_COMMAND) {
  if (!(0, import_node_fs101.existsSync)((0, import_node_path178.dirname)(markerPath))) {
    return "not-a-box";
  }
  const present = (0, import_node_fs101.existsSync)(markerPath);
  if (present === enabled) {
    return "unchanged";
  }
  if (enabled) {
    (0, import_node_fs101.writeFileSync)(markerPath, "", { encoding: "utf8", mode: 420 });
  } else {
    (0, import_node_fs101.unlinkSync)(markerPath);
  }
  if ((0, import_node_fs101.existsSync)(policyCommand)) {
    (0, import_node_child_process16.spawnSync)(policyCommand, [], { stdio: "ignore" });
  }
  return "applied";
}
