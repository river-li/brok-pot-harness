var port = import_node_worker_threads.parentPort;
invariant(port != null, "search-index-worker must run as a worker_thread");
var config = import_node_worker_threads.workerData;
invariant(
  typeof config?.indexDbPath === "string" && typeof config?.agentsRootDir === "string",
  "search-index-worker needs indexDbPath + agentsRootDir"
);
var db = openSearchIndexDb(config.indexDbPath);
ensureSearchIndexSchema(db, isFts5Available());
var writer = new SandSearchIndexWriter(db, config.agentsRootDir);
port.on("message", (request) => {
  let response;
  try {
    writer.runJob(request.job);
    response = { requestId: request.requestId, ok: true };
  } catch (error) {
    response = {
      requestId: request.requestId,
      ok: false,
      message: error instanceof Error ? error.message : String(error),
      isIndexCorrupt: isSqliteCorruptError(error)
    };
  }
  port.postMessage(response);
});
