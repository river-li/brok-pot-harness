/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/agents/settings-file.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_node_fs73 = require("node:fs");
var import_node_path121 = require("node:path");
function getSandSettingsPath(agentDir) {
  return (0, import_node_path121.join)(agentDir, SAND_SETTINGS_FILENAME);
}
function readRawSettings(path31) {
  let raw;
  try {
    raw = (0, import_node_fs73.readFileSync)(path31, "utf8");
  } catch (error42) {
    reportFallbackUnlessAbsent("settings_file", error42);
    return {};
  }
  return parseRawSandSettings(raw);
}
function readSandSettingsFile(path31) {
  return settingsConfigFromRaw(readRawSettings(path31));
}
function writeSandSettingsFile(path31, update) {
  writeFileAtomicSync(path31, serializeSandSettingsFile(readRawSettings(path31), update));
}

