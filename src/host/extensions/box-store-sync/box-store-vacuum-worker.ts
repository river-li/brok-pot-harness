/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/box-store-sync/box-store-vacuum-worker.ts
 * Bundle: sand-host/extensions/box-store-sync/box-store-vacuum-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
var import_node_worker_threads = require("node:worker_threads");

// @recovered-fragment 2/2
var port = import_node_worker_threads.parentPort;
invariant(port != null, "box-store-vacuum-worker must run as a worker_thread");
port.on("message", (job) => {
  try {
    sqliteVacuumInto(job.srcPath, job.destPath, job.busyTimeoutMs);
    port.postMessage({ ok: true });
  } catch (error) {
    port.postMessage({
      ok: false,
      message: error instanceof Error ? error.message : String(error)
    });
  }
});
