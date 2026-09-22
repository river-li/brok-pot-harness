/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/agent-isolation/legacy-blob-retirement.ts
 * Bundle: sand-host/agent-isolation/agent-store-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_node_fs3 = require("node:fs");
function defer(reason) {
  return { isRetirable: false, reason, legacyRows: 0, legacyBytes: 0 };
}
function verifyLegacyBlobRetirement(options) {
  const { db, legacyBlobDbPath, retainedRootIdHex } = options;
  if (!(0, import_node_fs3.existsSync)(legacyBlobDbPath)) return defer("legacy-unreadable");
  let quickCheck;
  try {
    quickCheck = db.prepare("PRAGMA quick_check").get()?.quick_check;
  } catch {
    return defer("destination-unhealthy");
  }
  if (quickCheck !== "ok") return defer("destination-unhealthy");
  switch (readConversationBlobMigrationState(db)) {
    case "adoption-complete":
      break;
    case "unstarted":
      return defer("adoption-incomplete");
    case "recovery-rebuilt":
      return defer("recovery-rebuilt");
    default:
      return defer("migration-state-unknown");
  }
  const root = db.prepare("SELECT 1 AS present FROM blobs WHERE id = ?").get(retainedRootIdHex);
  if (root == null) return defer("root-missing");
  let isAttached = false;
  try {
    db.prepare("ATTACH DATABASE ? AS legacy").run(legacyBlobDbPath);
    isAttached = true;
    const totals = db.prepare("SELECT count(*) AS rows, coalesce(sum(length(data)), 0) AS bytes FROM legacy.blobs").get();
    return {
      isRetirable: true,
      legacyRows: Number(totals?.rows ?? 0),
      legacyBytes: Number(totals?.bytes ?? 0)
    };
  } catch {
    return defer("legacy-unreadable");
  } finally {
    if (isAttached) {
      try {
        db.exec("DETACH DATABASE legacy");
      } catch {
      }
    }
  }
}

