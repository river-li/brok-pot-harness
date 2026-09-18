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
