function errorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}
function serveJobs(port2, config) {
  invariant(
    typeof config.indexDbPath === "string" && typeof config.agentsRootDir === "string",
    "search-index-worker needs indexDbPath + agentsRootDir"
  );
  const db = openSearchIndexDb(config.indexDbPath);
  ensureSearchIndexSchema(db, isFts5Available());
  const writer = new SandSearchIndexWriter(db, config.agentsRootDir);
  port2.on("message", (request) => {
    let response;
    try {
      writer.runJob(request.job);
      response = { requestId: request.requestId, ok: true };
    } catch (error) {
      response = {
        requestId: request.requestId,
        ok: false,
        message: errorMessage(error),
        isIndexCorrupt: isSqliteCorruptError(error)
      };
    }
    port2.postMessage(response);
  });
}
function runQuery(db, { kind, query, limit }, isFtsEnabled) {
  switch (kind) {
    case "messages":
      return { kind, matches: searchMessages(db, query, limit, isFtsEnabled) };
    case "media":
      return { kind, matches: searchMedia(db, query, limit, isFtsEnabled) };
    default: {
      const exhaustive = kind;
      return exhaustive;
    }
  }
}
function serveQueries(port2, config) {
  invariant(
    typeof config.indexDbPath === "string" && typeof config.isFtsEnabled === "boolean",
    "search-index-worker reader needs indexDbPath + isFtsEnabled"
  );
  let db;
  port2.on("message", (request) => {
    let response;
    try {
      db ??= openSearchIndexReadDb(config.indexDbPath);
      response = {
        requestId: request.requestId,
        ok: true,
        ...runQuery(db, request.query, config.isFtsEnabled)
      };
    } catch (error) {
      response = {
        requestId: request.requestId,
        ok: false,
        message: errorMessage(error),
        errorClass: errorLogTag(error),
        isIndexCorrupt: isSqliteCorruptError(error)
      };
    }
    port2.postMessage(response);
  });
}
var port = import_node_worker_threads.parentPort;
invariant(port != null, "search-index-worker must run as a worker_thread");
var data = import_node_worker_threads.workerData;
switch (data?.role) {
  case "writer":
    serveJobs(port, data);
    break;
  case "reader":
    serveQueries(port, data);
    break;
  default:
    invariant(false, "search-index-worker needs a writer or reader role");
}
