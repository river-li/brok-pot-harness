/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/node/sand-client-metadata.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var SAND_CLIENT_TYPE = "sand";
var SAND_CLIENT_FALLBACK_BASE_VERSION = "0.1.0";
var SAND_CLIENT_VERSION_DEV_SUFFIX = "-dev";
var SAND_CLIENT_VERSION_LAB_SUFFIX = "-lab";
var STAMPED_VERSION_BASE = /^(\d+\.\d+\.\d+)(?:-.+)?$/;
function stampedVersionBaseOf(stamped) {
  return STAMPED_VERSION_BASE.exec(stamped?.trim() ?? "")?.[1];
}
function sandClientBaseVersionOf(clientAppVersion) {
  return stampedVersionBaseOf(clientAppVersion) ?? stampedVersionBaseOf(
    true ? "0.58.0-pre.19" : void 0
  ) ?? SAND_CLIENT_FALLBACK_BASE_VERSION;
}
var SAND_BOX_NAMESPACE_HEADER = "x-sand-box-namespace";
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

