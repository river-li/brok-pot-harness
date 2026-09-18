var import_node_fs82 = require("node:fs");
var import_node_path133 = require("node:path");
var import_node_util11 = require("node:util");
init_errors();
var ConversationRecoveryScanError = class extends SandDomainError {
  constructor(detail) {
    super(`conversation recovery scan failed: ${detail}`);
    this.detail = detail;
  }
  detail;
  name = "ConversationRecoveryScanError";
};
function transcriptEntryMatchesRecovered(persisted, recovered) {
  if (persisted.kind !== recovered.kind) return false;
  if (persisted.kind === "message" && recovered.kind === "message") {
    return persisted.role === recovered.role && persisted.content === recovered.content;
  }
  if (persisted.kind === "send-message" && recovered.kind === "send-message") {
    return (0, import_node_util11.isDeepStrictEqual)(persisted.message, recovered.message);
  }
  if (persisted.kind === "tool-call" && recovered.kind === "tool-call") {
    return persisted.name === recovered.name && persisted.status === recovered.status && persisted.summary === recovered.summary;
  }
  return false;
}
function cacheBlobReads(blobStore) {
  const reads = /* @__PURE__ */ new Map();
  return {
    getBlob(ctx, blobId) {
      const key = toHex3(blobId);
      const cached2 = reads.get(key);
      if (cached2 != null) return cached2;
      const read = blobStore.getBlob(ctx, blobId);
      reads.set(key, read);
      return read;
    },
    setBlob(ctx, blobId, blobData) {
      reads.set(toHex3(blobId), Promise.resolve(blobData));
      return blobStore.setBlob(ctx, blobId, blobData);
    },
    setBlobLocallyOnly(ctx, blobId, blobData) {
      reads.set(toHex3(blobId), Promise.resolve(blobData));
      return blobStore.setBlobLocallyOnly(ctx, blobId, blobData);
    },
    flush(ctx) {
      return blobStore.flush(ctx);
    }
  };
}
function ensureProfileFile(dbPath, db) {
  const path31 = getSandProfilePath((0, import_node_path133.dirname)(dbPath));
  if (readSandProfileFile(path31) != null) return;
  const legacyName = db.get("name");
  writeSandProfileFile(path31, {
    name: legacyName.length > 0 ? legacyName : SAND_DEFAULT_AGENT_NAME,
    description: db.getSandProfile().description,
    title: ""
  });
}
function ensureSettingsFile(dbPath) {
  const path31 = getSandSettingsPath((0, import_node_path133.dirname)(dbPath));
  if ((0, import_node_fs82.existsSync)(path31)) return;
  writeSandSettingsFile(path31, {
    notifyOnAgentUpdates: true
  });
}
