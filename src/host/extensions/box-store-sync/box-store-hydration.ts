var import_promises13 = require("node:fs/promises");
var import_node_path11 = require("node:path");
init_errors();
var INCOMPLETE_LEGACY_HYDRATE_REASON = "incomplete_legacy_hydrate";
var BOX_STORE_HYDRATION_HANDOFF_FILE_NAME = ".box-store-legacy-hydration-complete";
var BOX_STORE_HYDRATION_HANDOFF_MANIFEST_PATH = `home/box/sand-data/${BOX_STORE_HYDRATION_HANDOFF_FILE_NAME}`;
function isHydrationHandoffManifestPath(relPath) {
  return relPath === BOX_STORE_HYDRATION_HANDOFF_MANIFEST_PATH || relPath.startsWith(`${BOX_STORE_HYDRATION_HANDOFF_MANIFEST_PATH}.`) && relPath.endsWith(".tmp");
}
function isCount(value) {
  return value != null && Number.isInteger(value) && value >= 0;
}
function isBoxStoreFullyHydrated(evidence) {
  if (evidence?.failures == null || evidence.failures.length !== 0) return false;
  if (!isCount(evidence.manifestEntries) || !isCount(evidence.files) || !isCount(evidence.verified)) {
    return false;
  }
  if (evidence.hydrateSource === "legacy") {
    return isCount(evidence.authoritativeStoreDbEntries) && isCount(evidence.restoredStoreDbEntries) && evidence.restoredStoreDbEntries >= evidence.authoritativeStoreDbEntries;
  }
  return evidence.files === evidence.manifestEntries && evidence.verified === evidence.manifestEntries;
}
async function writeHydrationHandoffMarker(markerPath) {
  await (0, import_promises13.mkdir)((0, import_node_path11.dirname)(markerPath), { recursive: true });
  const tempPath = `${markerPath}.${process.pid}.tmp`;
  try {
    const handle = await (0, import_promises13.open)(tempPath, "w", 384);
    try {
      await handle.writeFile("complete\n");
      await handle.sync();
    } finally {
      await handle.close();
    }
    await (0, import_promises13.rename)(tempPath, markerPath);
    const directory = await (0, import_promises13.open)((0, import_node_path11.dirname)(markerPath), "r");
    try {
      await directory.sync();
    } finally {
      await directory.close();
    }
  } finally {
    await (0, import_promises13.rm)(tempPath, { force: true }).catch((error42) => {
      reportBoxStoreDiagnostic({
        extension: "box_store",
        kind: "hydration_temp_cleanup_failed",
        errorClass: errorLogTag(error42)
      });
    });
  }
}
async function removeHydrationHandoffMarker(markerPath) {
  await (0, import_promises13.rm)(markerPath, { force: true });
  await (0, import_promises13.mkdir)((0, import_node_path11.dirname)(markerPath), { recursive: true });
  const directory = await (0, import_promises13.open)((0, import_node_path11.dirname)(markerPath), "r");
  try {
    await directory.sync();
  } finally {
    await directory.close();
  }
}
