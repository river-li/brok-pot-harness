/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/agent-isolation/agent-store-worker.ts
 * Bundle: sand-host/agent-isolation/agent-store-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
var import_node_worker_threads = require("node:worker_threads");

// @recovered-fragment 2/2
function post(message, transfer = []) {
  import_node_worker_threads.parentPort?.postMessage(message, transfer);
}
function transferableBuffers(views) {
  const buffers = [];
  for (const view of views) {
    if (view !== void 0 && view.buffer instanceof ArrayBuffer) buffers.push(view.buffer);
  }
  return buffers;
}
function main() {
  const port = import_node_worker_threads.parentPort;
  invariant(port != null, "agent-store-worker must run as a worker_thread");
  const boot = import_node_worker_threads.workerData;
  let store;
  try {
    store = new ConversationBlobStoreDb({
      agentId: boot.agentId,
      blobDbPath: boot.blobDbPath,
      busyTimeoutMs: boot.busyTimeoutMs ?? 5e3,
      ...boot.legacyBlobDbPath != null ? { legacyBlobDbPath: boot.legacyBlobDbPath } : {},
      log: (message) => void process.stderr.write(`${message}
`)
    });
  } catch (error) {
    let code = "error";
    if (error instanceof ConversationBlobRecoveryError) {
      code = error.code;
    } else if (typeof error === "object" && error !== null && "code" in error && typeof error.code === "string") {
      code = error.code;
    }
    const detail = error instanceof ConversationBlobRecoveryError ? ` detail=${error.message}` : "";
    console.error(
      `[agent-store-worker] failed to open blob db: agent=${boot.agentId} code=${code}${detail}`
    );
    process.exit(1);
    return;
  }
  port.on("message", (request) => {
    try {
      switch (request.kind) {
        case "init": {
          post({
            kind: "init-ok",
            requestId: request.requestId,
            threadId: import_node_worker_threads.threadId,
            pid: process.pid
          });
          return;
        }
        case "set-blob": {
          store.setBlob(request.blobId, request.blobData);
          post({ kind: "set-blob-ok", requestId: request.requestId });
          return;
        }
        case "get-blob": {
          const blobData = store.getBlob(request.blobId);
          if (blobData == null) {
            post({
              kind: "get-blob-ok",
              requestId: request.requestId,
              blobData: void 0
            });
            return;
          }
          const copy = new Uint8Array(blobData.byteLength);
          copy.set(blobData);
          post(
            {
              kind: "get-blob-ok",
              requestId: request.requestId,
              blobData: copy
            },
            [copy.buffer]
          );
          return;
        }
        case "find-latest-root": {
          post({
            kind: "find-latest-root-ok",
            requestId: request.requestId,
            rootId: store.findLatestRootBlobId()
          });
          return;
        }
        case "clear-blobs": {
          store.clearBlobs();
          post({ kind: "clear-blobs-ok", requestId: request.requestId });
          return;
        }
        case "clear-stale-roots": {
          post({
            kind: "clear-stale-roots-ok",
            requestId: request.requestId,
            deleted: store.clearStaleCheckpointRoots(request.retainedRootIdHex)
          });
          return;
        }
        case "collect-garbage": {
          post({
            kind: "collect-garbage-ok",
            requestId: request.requestId,
            result: store.collectGarbage({
              retainedRootIdHex: request.retainedRootIdHex,
              pendingWriteRetentionMs: request.pendingWriteRetentionMs
            })
          });
          return;
        }
        case "walk-export-closure": {
          const result = store.walkExportClosure(
            request.retainedRootIdHex,
            {
              maxClosureBytes: request.maxClosureBytes,
              maxClosureBlobs: request.maxClosureBlobs
            },
            (progress) => {
              post({
                kind: "walk-export-closure-progress",
                requestId: request.requestId,
                progress
              });
            }
          );
          post(
            { kind: "walk-export-closure-ok", requestId: request.requestId, result },
            transferableBuffers(result.outcome === "walked" ? [result.rootBytes] : [])
          );
          return;
        }
        case "get-blobs": {
          const blobs = store.getBlobsByHexIds(request.blobIdsHex);
          post(
            { kind: "get-blobs-ok", requestId: request.requestId, blobs },
            transferableBuffers(blobs)
          );
          return;
        }
        case "verify-legacy-blob-retirement": {
          post({
            kind: "verify-legacy-blob-retirement-ok",
            requestId: request.requestId,
            verdict: store.verifyLegacyBlobRetirement(
              request.retainedRootIdHex,
              request.legacyBlobDbPath
            )
          });
          return;
        }
        case "flush": {
          post({ kind: "flush-ok", requestId: request.requestId });
          return;
        }
        case "close": {
          store.close();
          post({ kind: "close-ok", requestId: request.requestId });
          port.close();
          return;
        }
      }
    } catch (error) {
      const code = typeof error === "object" && error !== null && "code" in error && typeof error.code === "string" ? error.code : void 0;
      post({
        kind: "error",
        requestId: request.requestId,
        message: error instanceof Error ? error.message : String(error),
        ...error instanceof Error ? { name: error.name } : {},
        ...code != null ? { code } : {}
      });
    }
  });
}
main();
