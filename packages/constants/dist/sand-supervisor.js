function isSandHostBundleChannel(value) {
  return typeof value === "string" && SAND_HOST_BUNDLE_CHANNELS.includes(value);
}
function coerceSandHostBundleChannel(value) {
  return isSandHostBundleChannel(value) ? value : SAND_HOST_BUNDLE_DEFAULT_CHANNEL;
}
function sandHostBundleVersionFileName(channel) {
  return `sand-host-bundle-${channel}.version`;
}
function parseSandHostBundleDigest(rawText) {
  var _a19;
  const token = (_a19 = rawText.trim().split(/\s+/, 1)[0]) !== null && _a19 !== void 0 ? _a19 : "";
  return SAND_HOST_BUNDLE_SHA256_REGEX.test(token) ? token : null;
}
function buildSandSupervisorCommand(args) {
  const command = {
    id: args.id,
    kind: args.kind,
    issuedAtMs: args.nowMs
  };
  if (args.reason !== void 0)
    command.reason = args.reason;
  if (args.kind === "upgrade") {
    if (args.mode !== void 0)
      command.mode = args.mode;
    if (args.version !== void 0)
      command.version = args.version;
    if (args.bundlePath !== void 0)
      command.bundlePath = args.bundlePath;
    if (args.sha256 !== void 0)
      command.sha256 = args.sha256;
    if (args.forceNow === true)
      command.forceNow = true;
  }
  return command;
}
function serializeSandSupervisorCommand(command) {
  return JSON.stringify(command);
}
function isSandHostUpgradeAvailable(current, target) {
  if (target == null || target.length === 0)
    return false;
  return current !== target;
}
var SAND_SUPERVISOR_DIR, SAND_SUPERVISOR_COMMAND_PATH, SAND_SUPERVISOR_COMMAND_PART_PATH, SAND_SUPERVISOR_STATUS_PATH, SAND_SUPERVISOR_ACKS_DIR, SAND_SUPERVISOR_STAGED_BUNDLE_PATH, SAND_SUPERVISOR_STAGED_BUNDLE_PART_PATH, SAND_SUPERVISOR_DESKTOP_HEALTH_PATH, SAND_BOX_AGENT_DATA_ROOT, SAND_BOX_HOST_UPGRADE_MARKER_PATH, SAND_BOX_HOST_DIR, SAND_BOX_HOST_ENTRY, SAND_BOX_HOST_VERSION_PATH, SAND_HOST_BUNDLE_CHANNELS, SAND_HOST_BUNDLE_DEFAULT_CHANNEL, SAND_HOST_BUNDLE_PROMOTABLE_CHANNELS, SAND_HOST_BUNDLE_S3_BUCKET, SAND_HOST_BUNDLE_S3_REGION, SAND_HOST_BUNDLE_S3_PREFIX, SAND_HOST_BUNDLE_PUBLIC_BASE_URL, SAND_HOST_BUNDLE_SHA256_REGEX, SAND_HOST_UPGRADE_MAX_DEFER_MS;
var init_sand_supervisor = __esm({
  "../packages/constants/dist/sand-supervisor.js"() {
    "use strict";
    SAND_SUPERVISOR_DIR = "/tmp/sand-supervisor";
    SAND_SUPERVISOR_COMMAND_PATH = `${SAND_SUPERVISOR_DIR}/command.json`;
    SAND_SUPERVISOR_COMMAND_PART_PATH = `${SAND_SUPERVISOR_COMMAND_PATH}.part`;
    SAND_SUPERVISOR_STATUS_PATH = `${SAND_SUPERVISOR_DIR}/status.json`;
    SAND_SUPERVISOR_ACKS_DIR = `${SAND_SUPERVISOR_DIR}/acks`;
    SAND_SUPERVISOR_STAGED_BUNDLE_PATH = `${SAND_SUPERVISOR_DIR}/incoming-host-bundle.tgz`;
    SAND_SUPERVISOR_STAGED_BUNDLE_PART_PATH = `${SAND_SUPERVISOR_STAGED_BUNDLE_PATH}.part`;
    SAND_SUPERVISOR_DESKTOP_HEALTH_PATH = `${SAND_SUPERVISOR_DIR}/desktop-health.json`;
    SAND_BOX_AGENT_DATA_ROOT = "/home/box/sand-data";
    SAND_BOX_HOST_UPGRADE_MARKER_PATH = `${SAND_BOX_AGENT_DATA_ROOT}/.sand-host-upgrade.json`;
    SAND_BOX_HOST_DIR = "/home/box/sand-host";
    SAND_BOX_HOST_ENTRY = `${SAND_BOX_HOST_DIR}/host-main.cjs`;
    SAND_BOX_HOST_VERSION_PATH = `${SAND_BOX_HOST_DIR}/version`;
    SAND_HOST_BUNDLE_CHANNELS = ["latest", "stable"];
    SAND_HOST_BUNDLE_DEFAULT_CHANNEL = "latest";
    SAND_HOST_BUNDLE_PROMOTABLE_CHANNELS = SAND_HOST_BUNDLE_CHANNELS.filter((channel) => channel !== SAND_HOST_BUNDLE_DEFAULT_CHANNEL);
    SAND_HOST_BUNDLE_S3_BUCKET = "public-asphr-vm-daemon-bucket";
    SAND_HOST_BUNDLE_S3_REGION = "us-east-1";
    SAND_HOST_BUNDLE_S3_PREFIX = "sand-host-bundle";
    SAND_HOST_BUNDLE_PUBLIC_BASE_URL = `https://${SAND_HOST_BUNDLE_S3_BUCKET}.s3.${SAND_HOST_BUNDLE_S3_REGION}.amazonaws.com/${SAND_HOST_BUNDLE_S3_PREFIX}`;
    SAND_HOST_BUNDLE_SHA256_REGEX = /^[0-9a-f]{64}$/;
    SAND_HOST_UPGRADE_MAX_DEFER_MS = 6 * 60 * 60 * 1e3;
  }
});
