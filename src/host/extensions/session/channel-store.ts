var import_node_fs85 = require("node:fs");
var import_node_path136 = require("node:path");
init_scheduling();
init_errors();
init_system_errno();
var CHANNELS_DIRNAME = "channels";
var CHANNEL_CHANGE_DEBOUNCE_MS = 50;
function getAgentChannelsDir(agentDir) {
  return (0, import_node_path136.join)(agentDir, CHANNELS_DIRNAME);
}
function labelFor(platform2, raw) {
  const clamped = raw != null ? clampChannelLabel(raw) : "";
  if (clamped.length > 0) return clamped;
  return findConnectorManifest(platform2)?.displayName ?? platform2;
}
function channelConfigLabel(raw) {
  const parsed2 = JSON.parse(raw);
  if (parsed2 === null || typeof parsed2 !== "object") {
    throw new TypeError(`${CHANNEL_CONFIG_FILENAME} is not an object`);
  }
  const label = parsed2.label;
  return typeof label === "string" ? label : void 0;
}
function degradedConnection(platform2, fault, error41) {
  return {
    platform: platform2,
    label: labelFor(platform2, void 0),
    status: "error",
    detail: `${fault} ${CHANNEL_CONFIG_FILENAME}: ${errorLogTag(error41)}`
  };
}
var FileChannelStore = class {
  constructor(channelsDir) {
    this.channelsDir = channelsDir;
    this.dir = new WatchedDirectory(
      channelsDir,
      createDebouncePolicy({
        name: "sand-channel-store-change",
        delayMs: CHANNEL_CHANGE_DEBOUNCE_MS
      })
    );
  }
  channelsDir;
  dir;
  getLocation() {
    return this.dir.getLocation();
  }
  setOnChange(onChange) {
    this.dir.setOnChange(onChange);
  }
  configPath(platform2) {
    return (0, import_node_path136.join)(this.channelsDir, platform2, CHANNEL_CONFIG_FILENAME);
  }
  readConnection(platform2) {
    let raw;
    try {
      raw = (0, import_node_fs85.readFileSync)(this.configPath(platform2), "utf8");
    } catch (error41) {
      if (isMissingPathError(error41)) return null;
      return degradedConnection(platform2, "unreadable", error41);
    }
    let label;
    try {
      label = channelConfigLabel(raw);
    } catch (error41) {
      return degradedConnection(platform2, "corrupt", error41);
    }
    return { platform: platform2, label: labelFor(platform2, label), status: "configured" };
  }
  listConnections() {
    return this.dir.listSubdirectoryNames().filter(isSafeFolderId).flatMap((platform2) => this.readConnection(platform2) ?? []);
  }
  listPlatforms() {
    return this.listConnections().map((connection) => connection.platform);
  }
  readLabel(platform2) {
    return this.readConnection(platform2)?.label ?? null;
  }
  writeMetadata(platform2, label) {
    if (!isSafeFolderId(platform2)) return false;
    const metadata = { label: labelFor(platform2, label) };
    this.dir.writeFileAtomic(this.configPath(platform2), `${JSON.stringify(metadata, null, 2)}
`);
    return true;
  }
  remove(platform2) {
    if (!isSafeFolderId(platform2)) return false;
    const platformDir = (0, import_node_path136.join)(this.channelsDir, platform2);
    try {
      if (!(0, import_node_fs85.statSync)(platformDir).isDirectory()) return false;
    } catch (error41) {
      reportFallbackUnlessAbsent("channel_store", error41);
      return false;
    }
    (0, import_node_fs85.rmSync)(platformDir, { recursive: true, force: true });
    this.dir.scheduleNotify();
    return true;
  }
};
