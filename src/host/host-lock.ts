var DEFAULT_TAKEOVER_TIMEOUT_MS = 3e3;
var DEFAULT_POLL_INTERVAL_MS = 100;
var MAX_ACQUIRE_ATTEMPTS = 5;
function defaultIsProcessAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error41) {
    const code = findSystemErrno(error41);
    if (code === "ESRCH" || code === "EPERM" || code === "ERR_INVALID_ARG_TYPE") return false;
    throw error41;
  }
}
function defaultTerminateProcess(pid, signal) {
  try {
    process.kill(pid, signal);
  } catch {
  }
}
function defaultDelay(ms2) {
  return new Promise((resolve29) => setTimeout(resolve29, ms2));
}
function readLockPid(path31) {
  let raw;
  try {
    raw = (0, import_node_fs29.readFileSync)(path31, "utf8");
  } catch (error41) {
    reportFallbackUnlessAbsent("host_lock", error41);
    return null;
  }
  const pid = Number.parseInt(raw.trim(), 10);
  return Number.isInteger(pid) && pid > 0 ? pid : null;
}
function removeLock(path31) {
  try {
    (0, import_node_fs29.unlinkSync)(path31);
  } catch {
  }
}
function tryCreateLock(path31, pid) {
  try {
    const fd = (0, import_node_fs29.openSync)(path31, "wx");
    try {
      (0, import_node_fs29.writeFileSync)(fd, String(pid), "utf8");
    } finally {
      (0, import_node_fs29.closeSync)(fd);
    }
    return true;
  } catch (error41) {
    if (findSystemErrno(error41) === "EEXIST") return false;
    throw error41;
  }
}
function makeHandle(path31, pid) {
  return {
    path: path31,
    pid,
    release() {
      if (readLockPid(path31) !== pid) return;
      removeLock(path31);
    }
  };
}
async function waitForExit(pid, isProcessAlive, delay5, timeoutMs, pollIntervalMs) {
  const deadline = Date.now() + timeoutMs;
  while (isProcessAlive(pid) && Date.now() < deadline) {
    await delay5(pollIntervalMs);
  }
}
async function acquireHostLock(options2 = {}) {
  const path31 = options2.path ?? getHostLockPath();
  const pid = options2.pid ?? process.pid;
  const isProcessAlive = options2.isProcessAlive ?? defaultIsProcessAlive;
  const isSandHostProcessCheck = options2.isSandHostProcess ?? isSandHostProcess;
  const terminateProcess = options2.terminateProcess ?? defaultTerminateProcess;
  const delay5 = options2.delay ?? defaultDelay;
  const takeoverTimeoutMs = options2.takeoverTimeoutMs ?? DEFAULT_TAKEOVER_TIMEOUT_MS;
  const pollIntervalMs = options2.pollIntervalMs ?? DEFAULT_POLL_INTERVAL_MS;
  (0, import_node_fs29.mkdirSync)((0, import_node_path28.dirname)(path31), { recursive: true });
  let outcome = "created";
  let previousPid;
  for (let attempt = 0; attempt < MAX_ACQUIRE_ATTEMPTS; attempt++) {
    if (tryCreateLock(path31, pid)) {
      return { outcome, lock: makeHandle(path31, pid), previousPid };
    }
    const holder = readLockPid(path31);
    if (holder == null) {
      outcome = "reclaimed-dead";
      removeLock(path31);
      continue;
    }
    if (holder === pid) {
      removeLock(path31);
      continue;
    }
    if (!isProcessAlive(holder)) {
      outcome = "reclaimed-dead";
      previousPid = holder;
      removeLock(path31);
      continue;
    }
    if (!isSandHostProcessCheck(holder)) {
      outcome = "reclaimed-foreign";
      previousPid = holder;
      removeLock(path31);
      continue;
    }
    outcome = "took-over";
    previousPid = holder;
    terminateProcess(holder, "SIGTERM");
    await waitForExit(holder, isProcessAlive, delay5, takeoverTimeoutMs, pollIntervalMs);
    if (isProcessAlive(holder)) {
      terminateProcess(holder, "SIGKILL");
      await waitForExit(holder, isProcessAlive, delay5, takeoverTimeoutMs, pollIntervalMs);
    }
    removeLock(path31);
  }
  (0, import_node_fs29.writeFileSync)(path31, String(pid), "utf8");
  return { outcome, lock: makeHandle(path31, pid), previousPid };
}
