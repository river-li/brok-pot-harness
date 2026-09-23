var import_node_fs75 = require("node:fs");
var import_node_path122 = require("node:path");
function getSandSettingsPath(agentDir) {
  return (0, import_node_path122.join)(agentDir, SAND_SETTINGS_FILENAME);
}
function readRawSettings(path31) {
  let raw;
  try {
    raw = (0, import_node_fs75.readFileSync)(path31, "utf8");
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
