function cloudAgentWorkerNameLabel(worker) {
  return worker.name ?? worker.workerId;
}
function workerAnswersTo(worker, requested) {
  return worker.name === requested || worker.displayName === requested || worker.workerId === requested;
}
function resolveCloudAgentMachineTarget(requestedName, workers) {
  const requested = requestedName.trim();
  if (requested.length === 0) {
    return { kind: "not_found" };
  }
  const matches = workers.filter((worker) => workerAnswersTo(worker, requested));
  if (matches.length === 1) {
    return { kind: "matched", worker: matches[0] };
  }
  if (matches.length > 1) {
    return { kind: "ambiguous", matches };
  }
  return { kind: "not_found" };
}
var MAX_LISTED_WORKERS = 25;
var START_WORKER_HINT = "Start one on the intended machine with `agent worker start` (add `--name <name>` to choose its name), or use environment type pool for a team's shared pool.";
function describeCloudAgentWorker(worker) {
  const name17 = cloudAgentWorkerNameLabel(worker);
  const parts = [
    worker.displayName !== void 0 && worker.displayName !== name17 ? `"${worker.displayName}"` : void 0,
    worker.machine !== void 0 && worker.machine !== name17 ? `machine ${worker.machine}` : void 0,
    worker.inUse ? "in use" : "idle",
    worker.workspacePath !== void 0 ? `workspace ${worker.workspacePath}` : void 0,
    worker.repos.length > 0 ? `repos ${worker.repos.join(", ")}` : void 0,
    worker.name === void 0 ? `no registered name, target it by worker id` : void 0
  ].filter((part) => part !== void 0);
  return `${name17} \u2014 ${parts.join("; ")}`;
}
function connectedWorkersNote(workers) {
  if (workers.length === 0) {
    return ` None of this account's own private workers is connected right now. ${START_WORKER_HINT}`;
  }
  const listed = workers.slice(0, MAX_LISTED_WORKERS).map((worker) => `
- ${describeCloudAgentWorker(worker)}`).join("");
  const hidden = workers.length - MAX_LISTED_WORKERS;
  const overflow = hidden > 0 ? `
- (+${hidden} more)` : "";
  return ` Your connected workers, pass one of these names exactly:${listed}${overflow}
${START_WORKER_HINT}`;
}
function ambiguousWorkersNote(matches) {
  const listed = matches.slice(0, MAX_LISTED_WORKERS).map((worker) => `
- ${describeCloudAgentWorker(worker)} (worker id ${worker.workerId})`).join("");
  return ` It names ${matches.length} connected workers; pass the worker id of the one you mean:${listed}`;
}
