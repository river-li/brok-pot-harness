/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/session/session-maintenance.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_node_fs82 = require("node:fs");
var import_promises64 = require("node:fs/promises");
var import_node_path133 = require("node:path");
init_agent_pb();
init_errors();
async function clearStaleCheckpointRootsOnce(host, dbPath, db, agentStore) {
  if (db.getStaleRootCleanupVersion() >= STALE_ROOT_CLEANUP_VERSION) return;
  const agentId = (0, import_node_path133.basename)((0, import_node_path133.dirname)(dbPath));
  const defer2 = (reason) => host.reportHostLog(
    "info",
    `[sand-agent-session] stale checkpoint-root cleanup deferred for ${agentId}: ${reason} (retries next open)`
  );
  try {
    const liveRootBlobId = db.get("latestRootBlobId");
    if (liveRootBlobId.length === 0) {
      return;
    }
    if (agentStore.getConversationStateStructure().turns.length === 0) {
      defer2("live conversation did not resolve");
      return;
    }
    if (liveDbHandleCount((0, import_node_path133.resolve)(dbPath)) > 1) {
      defer2("another live store handle");
      return;
    }
    const generation = getSandAgentDbWriteGeneration(dbPath);
    const agentDir = (0, import_node_path133.dirname)(dbPath);
    const deleted = await host.requireWorkerPool().clearStaleCheckpointRoots(
      (0, import_node_path133.basename)(agentDir),
      (0, import_node_path133.join)(agentDir, CONVERSATION_BLOBS_FILENAME),
      toHex3(liveRootBlobId),
      dbPath
    );
    if (getSandAgentDbWriteGeneration(dbPath) !== generation || toHex3(db.get("latestRootBlobId")) !== toHex3(liveRootBlobId) || liveDbHandleCount((0, import_node_path133.resolve)(dbPath)) > 1) {
      defer2(`store changed during the sweep (deleted=${deleted})`);
      return;
    }
    if (!db.setStaleRootCleanupVersion(STALE_ROOT_CLEANUP_VERSION)) {
      defer2(`marker write dropped (deleted=${deleted})`);
      return;
    }
    host.reportHostLog(
      "info",
      `[sand-agent-session] stale checkpoint-root cleanup for ${(0, import_node_path133.basename)(
        agentDir
      )}: deleted=${deleted}`
    );
  } catch (error42) {
    reportSessionDiagnostic({
      family: "maintenance",
      kind: "checkpoint_cleanup_failed",
      agentId,
      errorClass: errorLogTag(error42)
    });
  }
}
function resumeIndexByIdentity(persistedEntries, rebuiltEntries) {
  const rebuiltIndexById = new Map(rebuiltEntries.map((entry, index) => [entry.id, index]));
  let matchedCount = 0;
  for (const entry of persistedEntries) {
    const index = isRebuiltEntry(entry) ? rebuiltIndexById.get(entry.id) ?? -1 : matchedCount;
    if (index < matchedCount) return null;
    for (let skipped2 = matchedCount; skipped2 < index; skipped2++) {
      if (rebuiltEntries[skipped2]?.kind !== "tool-call") return null;
    }
    const rebuilt = rebuiltEntries[index];
    if (rebuilt == null || !transcriptEntryMatchesRecovered(entry, rebuilt)) return null;
    matchedCount = index + 1;
  }
  return matchedCount;
}
function resumeIndexByPosition(persistedEntries, rebuiltEntries) {
  const matches = persistedEntries.every((entry, index) => {
    const rebuilt = rebuiltEntries[index];
    return rebuilt != null && transcriptEntryMatchesRecovered(entry, rebuilt);
  });
  return matches ? persistedEntries.length : null;
}
function backfillTranscript(db, state) {
  const persistedEntries = db.getTranscriptEntries();
  const rebuiltEntries = rebuildTranscriptEntriesFromState(state);
  const matchedCount = resumeIndexByIdentity(persistedEntries, rebuiltEntries) ?? resumeIndexByPosition(persistedEntries, rebuiltEntries);
  if (matchedCount == null) return;
  const firstDrawnIndex = rebuiltEntries.findIndex((entry) => entry.kind !== "tool-call");
  const leadingToolCallCount = firstDrawnIndex === -1 ? rebuiltEntries.length : firstDrawnIndex;
  const spanEnd = rebuiltEntries.at(-1);
  const missingEntries = rebuiltEntries.filter(
    (entry, index) => index >= matchedCount && (entry.kind !== "tool-call" || index < leadingToolCallCount || entry === spanEnd)
  );
  if (missingEntries.length === 0) return;
  const predecessorStampMs = persistedEntries.findLast(
    (entry) => isValidTimestampMs(entry.timestampMs)
  )?.timestampMs;
  db.appendTranscriptEntries(stampRestoredRows(missingEntries, predecessorStampMs));
}
function stampRestoredRows(entries, predecessorStampMs) {
  let floorMs = predecessorStampMs ?? entries.find((entry) => isValidTimestampMs(entry.timestampMs))?.timestampMs;
  return entries.map((entry) => {
    if (isValidTimestampMs(entry.timestampMs) && (floorMs == null || entry.timestampMs >= floorMs)) {
      floorMs = entry.timestampMs;
      return entry;
    }
    return floorMs == null ? entry : { ...entry, timestampMs: floorMs };
  });
}
async function recoverConversationIfRootMissing(host, dbPath, db, agentStore) {
  const existingRoot = db.get("latestRootBlobId");
  if (existingRoot.length > 0) return;
  const blobsPath = (0, import_node_path133.join)((0, import_node_path133.dirname)(dbPath), CONVERSATION_BLOBS_FILENAME);
  const blobStore = agentStore.getBlobStore();
  const recoveryGeneration = getSandAgentDbWriteGeneration(dbPath);
  try {
    if (!(0, import_node_fs82.existsSync)(blobsPath) && !db.hasLegacyConversationBlobs()) return;
    const rootId = await findLatestDurableRootBlobId(host, {
      dbPath,
      blobsPath
    });
    if (rootId == null) return;
    const rootBlob = await blobStore.getBlob(host.ctx, rootId);
    if (rootBlob == null) return;
    const structure = ConversationStateStructure.fromBinary(rootBlob);
    const state = await host.resolveConversationState(structure, blobStore);
    if (state == null) return;
    if (getSandAgentDbWriteGeneration(dbPath) !== recoveryGeneration) return;
    if (!db.compareAndSetLatestRootBlobId({
      expectedRoot: existingRoot,
      nextRoot: rootId
    })) {
      await agentStore.resetFromDb(host.ctx);
      return;
    }
    await agentStore.resetFromDb(host.ctx);
    if (toHex3(db.get("latestRootBlobId")) !== toHex3(rootId)) return;
    const profileName = readSandProfileFile(getSandProfilePath((0, import_node_path133.dirname)(dbPath)))?.name.trim();
    if (profileName != null && profileName.length > 0 && db.get("name") !== profileName) {
      db.set("name", profileName);
    }
    backfillTranscript(db, state);
  } catch (error42) {
    if (error42 instanceof ConversationRecoveryScanError) {
      reportSessionDiagnostic({
        family: "maintenance",
        kind: "recovery_scan_failed",
        agentId: (0, import_node_path133.basename)((0, import_node_path133.dirname)(dbPath)),
        errorClass: error42.detail
      });
      throw error42;
    }
    reportSessionDiagnostic({
      family: "maintenance",
      kind: "recovery_failed",
      agentId: (0, import_node_path133.basename)((0, import_node_path133.dirname)(dbPath)),
      errorClass: errorLogTag(error42)
    });
  }
}
async function repairHiddenTranscriptEntriesOnce(host, dbPath, db, agentStore) {
  if (db.getHiddenEntryRepairVersion() >= HIDDEN_ENTRY_REPAIR_VERSION) return;
  try {
    const entries = db.getTranscriptEntries();
    const hasRebuiltUserEntry = entries.some(
      (entry) => entry.kind === "message" && entry.role === "user" && entry.id.startsWith(`${REBUILT_ENTRY_ID_PREFIX}outline-user-`)
    );
    if (!hasRebuiltUserEntry) {
      db.setHiddenEntryRepairVersion(HIDDEN_ENTRY_REPAIR_VERSION);
      return;
    }
    const structure = agentStore.getConversationStateStructure();
    const state = await agentStore.getFullConversation(host.ctx);
    if (state.turns.length === 0 || state.turns.length < structure.turns.length || !await conversationStructureFullyResolves(host.ctx, structure, agentStore.getBlobStore())) {
      return;
    }
    const outline = deriveOutlineFromConversationState(state);
    const artifactIds = selectHiddenArtifactEntryIds(entries, outline);
    let allDeleted = true;
    for (const id of artifactIds) {
      if (!db.deleteTranscriptEntry(id)) allDeleted = false;
    }
    if (!allDeleted) return;
    if (artifactIds.length > 0) {
      host.reportHostLog(
        "info",
        `[sand-agent-session] hidden-entry repair removed ${artifactIds.length} artifact(s) for ${(0, import_node_path133.basename)(
          (0, import_node_path133.dirname)(dbPath)
        )}`
      );
    }
    db.setHiddenEntryRepairVersion(HIDDEN_ENTRY_REPAIR_VERSION);
  } catch (error42) {
    reportSessionDiagnostic({
      family: "maintenance",
      kind: "hidden_repair_failed",
      agentId: (0, import_node_path133.basename)((0, import_node_path133.dirname)(dbPath)),
      errorClass: errorLogTag(error42)
    });
  }
}
var LEGACY_BLOB_RETIREMENT_VERSION = 1;
var pinnedLegacyBlobRetirementEnabled = false;
function pinLegacyStoreBlobRetirement(enabled) {
  pinnedLegacyBlobRetirementEnabled = enabled;
}
function isLegacyStoreBlobRetirementEnabled() {
  return pinnedLegacyBlobRetirementEnabled;
}
async function retireLegacyStoreBlobsOnce(host, dbPath, db, agentStore) {
  if (!isLegacyStoreBlobRetirementEnabled()) return;
  if (db.getLegacyBlobRetirementVersion() >= LEGACY_BLOB_RETIREMENT_VERSION) {
    return;
  }
  const agentId = (0, import_node_path133.basename)((0, import_node_path133.dirname)(dbPath));
  const defer2 = (reason) => host.reportHostLog(
    "info",
    `[sand-agent-session] legacy store blob retirement deferred for ${agentId}: reason=${reason} (retries next open)`
  );
  try {
    if (!db.hasLegacyConversationBlobs()) {
      if (db.retireLegacyConversationBlobs(LEGACY_BLOB_RETIREMENT_VERSION)) {
        return;
      }
      defer2("marker-write-dropped");
      return;
    }
    const liveRootBlobId = db.get("latestRootBlobId");
    if (liveRootBlobId.length === 0) {
      defer2("no-committed-root");
      return;
    }
    if (agentStore.getConversationStateStructure().turns.length === 0) {
      defer2("live-conversation-unresolved");
      return;
    }
    if (liveDbHandleCount((0, import_node_path133.resolve)(dbPath)) > 1) {
      defer2("another-live-store-handle");
      return;
    }
    const generation = getSandAgentDbWriteGeneration(dbPath);
    const agentDir = (0, import_node_path133.dirname)(dbPath);
    const verdict = await host.requireWorkerPool().verifyLegacyBlobRetirement({
      agentId: (0, import_node_path133.basename)(agentDir),
      blobDbPath: (0, import_node_path133.join)(agentDir, CONVERSATION_BLOBS_FILENAME),
      legacyBlobDbPath: dbPath,
      retainedRootIdHex: toHex3(liveRootBlobId)
    });
    if (!verdict.isRetirable) {
      defer2(verdict.reason ?? "unproven");
      return;
    }
    if (getSandAgentDbWriteGeneration(dbPath) !== generation || toHex3(db.get("latestRootBlobId")) !== toHex3(liveRootBlobId) || liveDbHandleCount((0, import_node_path133.resolve)(dbPath)) > 1) {
      defer2("store-changed-during-proof");
      return;
    }
    if (!db.retireLegacyConversationBlobs(LEGACY_BLOB_RETIREMENT_VERSION)) {
      defer2("marker-write-dropped");
      return;
    }
    host.reportHostLog(
      "info",
      `[sand-agent-session] legacy store blob retirement for ${agentId}: rows=${verdict.legacyRows} bytes=${verdict.legacyBytes}`
    );
  } catch (error42) {
    reportSessionDiagnostic({
      family: "maintenance",
      kind: "blob_retirement_failed",
      agentId,
      errorClass: errorLogTag(error42)
    });
  }
}
async function cleanupLegacyGroupMemberDirs(host) {
  let entries;
  try {
    entries = await (0, import_promises64.readdir)(host.rootDir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    try {
      await (0, import_promises64.rm)((0, import_node_path133.join)(host.rootDir, entry.name, LEGACY_GROUP_MEMBERS_DIRNAME), {
        recursive: true,
        force: true
      });
    } catch (error42) {
      reportSessionDiagnostic({
        family: "maintenance",
        kind: "member_cleanup_failed",
        agentId: entry.name,
        errorClass: errorLogTag(error42)
      });
    }
  }
}
async function findLatestDurableRootBlobId(host, {
  dbPath,
  blobsPath
}) {
  try {
    return await host.requireWorkerPool().findLatestRootBlobId({
      agentId: (0, import_node_path133.basename)((0, import_node_path133.dirname)(dbPath)),
      blobDbPath: blobsPath,
      legacyBlobDbPath: dbPath
    }) ?? null;
  } catch (error42) {
    throw new ConversationRecoveryScanError(errorLogTag(error42));
  }
}

