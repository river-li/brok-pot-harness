var readConnections = /* @__PURE__ */ new Map();
var loggedOpenFailures = /* @__PURE__ */ new Set();
function getBlobConnection(dbPath) {
  const cached = readConnections.get(dbPath);
  if (cached != null) return cached;
  if (!(0, import_node_fs.existsSync)(dbPath)) return null;
  try {
    const db = new import_node_sqlite.DatabaseSync(dbPath, { readOnly: true });
    db.exec("PRAGMA busy_timeout = 5000");
    const connection = {
      db,
      statement: db.prepare("SELECT data FROM blobs WHERE id = ?")
    };
    readConnections.set(dbPath, connection);
    return connection;
  } catch (error) {
    if (!loggedOpenFailures.has(dbPath)) {
      loggedOpenFailures.add(dbPath);
      process.stderr.write(
        `[transcript-mirror-worker] cannot open ${dbPath} read-only: ${errorLogTag(error)}
`
      );
    }
    return null;
  }
}
var ReadOnlySqliteBlobStore = class {
  constructor(dbPaths) {
    this.dbPaths = dbPaths;
  }
  dbPaths;
  async getBlob(_ctx, blobId) {
    const key = toHex(blobId);
    for (const dbPath of this.dbPaths) {
      const connection = getBlobConnection(dbPath);
      if (connection == null) continue;
      try {
        const row = connection.statement.get(key);
        if (row?.data instanceof Uint8Array) return row.data;
      } catch (error) {
        process.stderr.write(
          `[transcript-mirror-worker] blob read failed in ${dbPath}: ${errorLogTag(error)}
`
        );
      }
    }
    return void 0;
  }
  async setBlob() {
    invariant(false, "transcript-mirror worker never writes blobs");
  }
  async setBlobLocallyOnly() {
    invariant(false, "transcript-mirror worker never writes blobs");
  }
  async flush() {
  }
};
var MissingTranscriptStateError = class extends SandDomainError {
  name = "MissingTranscriptStateError";
};
function post(message) {
  import_node_worker_threads.parentPort?.postMessage(message);
}
function main() {
  const port = import_node_worker_threads.parentPort;
  invariant(port != null, "transcript-mirror-worker must run as a worker_thread");
  port.on("message", (request) => {
    if (request.kind === "close") {
      post({ kind: "close-ok", requestId: request.requestId });
      port.close();
      return;
    }
    void (async () => {
      try {
        const startedAt = performance.now();
        const blobStore = new ReadOnlySqliteBlobStore(request.blobDbPaths);
        const stateBinary = await blobStore.getBlob(createContext(), request.stateBlobId);
        if (stateBinary == null) {
          throw new MissingTranscriptStateError("transcript mirror checkpoint blob is unavailable");
        }
        const state = ConversationStateStructure.fromBinary(stateBinary);
        const written = await new LegacyFileTranscriptMirror(request.transcriptsDir).writeFull(
          createContext(),
          request.conversationId,
          state,
          blobStore
        );
        post({
          kind: "mirror-write-ok",
          requestId: request.requestId,
          written,
          durationMs: performance.now() - startedAt
        });
      } catch (error) {
        post({
          kind: "error",
          requestId: request.requestId,
          message: error instanceof Error ? error.message : String(error)
        });
      }
    })();
  });
}
main();
