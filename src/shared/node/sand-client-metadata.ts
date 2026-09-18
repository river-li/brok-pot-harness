function stampedVersionBaseOf(stamped) {
  return STAMPED_VERSION_BASE.exec(stamped?.trim() ?? "")?.[1];
}
function sandClientBaseVersionOf(clientAppVersion) {
  return stampedVersionBaseOf(clientAppVersion) ?? stampedVersionBaseOf(
    true ? "0.57.0-pre.7" : void 0
  ) ?? SAND_CLIENT_FALLBACK_BASE_VERSION;
}
function sandBoxNamespaceOf(boxOwnerNamespace, variant) {
  const ownerNamespace = boxOwnerNamespace?.trim();
  if (ownerNamespace === "dev" || ownerNamespace === "lab") {
    return ownerNamespace;
  }
  switch (variant) {
    case "sand-dev":
      return "dev";
    case "sand-lab":
      return "lab";
    default:
      return "prod";
  }
}
function sandClientVersionOf(clientAppVersion, boxNamespace) {
  const baseVersion = sandClientBaseVersionOf(clientAppVersion);
  switch (boxNamespace) {
    case "dev":
      return `${baseVersion}${SAND_CLIENT_VERSION_DEV_SUFFIX}`;
    case "lab":
      return `${baseVersion}${SAND_CLIENT_VERSION_LAB_SUFFIX}`;
    case "prod":
      return baseVersion;
  }
}
function statsigClientOsOf(platform2) {
  switch (platform2) {
    case "win32":
      return "CLIENT_OS_WINDOWS";
    case "darwin":
      return "CLIENT_OS_MACOS";
    case "linux":
      return "CLIENT_OS_LINUX";
    default:
      return void 0;
  }
}
function getSandBackendClientHeaders(identity) {
  return {
    "x-cursor-client-type": SAND_CLIENT_TYPE,
    "x-cursor-client-source": "sand-desktop",
    "x-cursor-client-version": identity.clientVersion,
    "x-sand-box-namespace": identity.boxNamespace,
    "x-cursor-client-os": identity.clientOS
  };
}
var SAND_CLIENT_TYPE, SAND_CLIENT_FALLBACK_BASE_VERSION, SAND_CLIENT_VERSION_DEV_SUFFIX, SAND_CLIENT_VERSION_LAB_SUFFIX, STAMPED_VERSION_BASE, SAND_BOX_NAMESPACE_HEADER;
var init_sand_client_metadata = __esm({
  "src/shared/node/sand-client-metadata.ts"() {
    "use strict";
    SAND_CLIENT_TYPE = "sand";
    SAND_CLIENT_FALLBACK_BASE_VERSION = "0.1.0";
    SAND_CLIENT_VERSION_DEV_SUFFIX = "-dev";
    SAND_CLIENT_VERSION_LAB_SUFFIX = "-lab";
    STAMPED_VERSION_BASE = /^(\d+\.\d+\.\d+)(?:-.+)?$/;
    SAND_BOX_NAMESPACE_HEADER = "x-sand-box-namespace";
  }
});
