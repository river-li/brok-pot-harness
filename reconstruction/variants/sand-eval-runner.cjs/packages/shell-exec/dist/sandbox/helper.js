/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/shell-exec/dist/sandbox/helper.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function withPolicyDirectoryReadonly(additionalReadonlyPaths) {
  const dir = ensureSandboxPolicyDirectory();
  if (!additionalReadonlyPaths || additionalReadonlyPaths.length === 0) {
    return [dir];
  }
  if (additionalReadonlyPaths.includes(dir)) {
    return additionalReadonlyPaths;
  }
  return [...additionalReadonlyPaths, dir];
}
function isWorkspaceReadControlEnabled() {
  const configured2 = configuredWorkspaceReadEnabled;
  return typeof configured2 === "function" ? configured2() : configured2;
}
function configureSandboxPrereqs(options2) {
  getRipgrepBinaryPath();
  const { sandboxBinaryPath, workspaceReadEnabled } = options2;
  if (!configuredSandboxBinaryPath) {
    configuredSandboxBinaryPath = sandboxBinaryPath;
  }
  if (workspaceReadEnabled !== void 0) {
    configuredWorkspaceReadEnabled = workspaceReadEnabled;
  }
}
function getSandboxBinary() {
  return configuredSandboxBinaryPath;
}
function applyConfiguredRipgrepToSandboxEnv(env) {
  if (process.platform !== "linux") {
    return;
  }
  Object.assign(env, withConfiguredRipgrepEnv(env));
}
function resolveNetworkPolicyForFile(sandboxPolicy) {
  if (sandboxPolicy.type === "insecure_none") {
    return void 0;
  }
  const policy = sandboxPolicy.networkPolicy;
  if (policy === void 0) {
    return void 0;
  }
  if (!isNetworkEnabledByPolicy(policy)) {
    return void 0;
  }
  const hasDenyList = policy.deny !== void 0 && policy.deny.length > 0;
  if (policy.default === "allow" && !hasDenyList) {
    return void 0;
  }
  return { version: 1, ...policy };
}
function resolveHardcodedAllowedReadPaths(platform = process.platform) {
  const resolved = [];
  const seen = /* @__PURE__ */ new Set();
  const bundledPaths = {};
  try {
    bundledPaths.ripgrep = getRipgrepBinaryPath();
  } catch {
  }
  for (const entry of getHardcodedAllowedReadPaths(platform, os3.homedir(), bundledPaths)) {
    if (seen.has(entry)) {
      continue;
    }
    seen.add(entry);
    resolved.push(entry);
  }
  return resolved;
}
function withSandboxPolicyDirectoryReadonly(sandboxPolicy) {
  return {
    ...sandboxPolicy,
    additionalReadonlyPaths: withPolicyDirectoryReadonly(sandboxPolicy.additionalReadonlyPaths)
  };
}
function normalizeAdditionalReadPathRoots(paths) {
  const roots = [];
  const seen = /* @__PURE__ */ new Set();
  for (const raw of paths) {
    let entry = raw.trim();
    if (!entry) {
      continue;
    }
    if (entry === "~") {
      entry = os3.homedir();
    } else if (entry.startsWith("~/") || entry.startsWith("~\\")) {
      entry = path4.join(os3.homedir(), entry.slice(2));
    }
    entry = entry.replace(/\/\*\*$/, "").replace(/\/\*$/, "");
    entry = entry.replace(/\\\*\*$/, "").replace(/\\\*$/, "");
    const base = path4.basename(entry);
    if (base.includes("*") || base.includes("?")) {
      entry = path4.dirname(entry);
    }
    if (!entry || entry === ".") {
      continue;
    }
    const normalized = path4.normalize(entry);
    if (seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);
    roots.push(normalized);
  }
  return roots;
}
function buildNativeSandboxPolicy(sandboxPolicy, cwd, options2) {
  let ignoreMapping;
  if (sandboxPolicy.ignoreMapping) {
    ignoreMapping = buildIgnoreMapping(sandboxPolicy.ignoreMapping, cwd, [], []);
  }
  const additionalReadonlyPaths = buildReadOnlyJson(sandboxPolicy.additionalReadonlyPaths, sandboxPolicy.writeProtectionMapping, cwd);
  const readBoundary = getEffectiveSandboxReadBoundary(sandboxPolicy.readBoundary, options2?.workspaceReadEnabled ?? isWorkspaceReadControlEnabled());
  const trustedReadPaths = resolveHardcodedAllowedReadPaths();
  const allowlistRoots = readBoundary === "workspace" ? normalizeAdditionalReadPathRoots(sandboxPolicy.additionalReadPaths ?? []) : [];
  const hardcodedReadPaths = [...trustedReadPaths];
  const seen = new Set(trustedReadPaths);
  for (const root of allowlistRoots) {
    if (seen.has(root)) {
      continue;
    }
    seen.add(root);
    hardcodedReadPaths.push(root);
  }
  const common2 = {
    cwd,
    readBoundary,
    hardcodedReadPaths,
    additionalReadonlyPaths,
    networkAccess: isNetworkEnabledByPolicy(sandboxPolicy.networkPolicy),
    ignoreMapping
  };
  if (sandboxPolicy.type === "workspace_readonly") {
    return {
      type: sandboxPolicy.type,
      ...common2
    };
  }
  return {
    type: sandboxPolicy.type,
    ...common2,
    additionalReadwritePaths: sandboxPolicy.additionalReadwritePaths || [],
    disableTmpWrite: sandboxPolicy.disableTmpWrite || false
  };
}
function checkBinaryAvailable(ctx) {
  if (binaryAvailable !== null) {
    return !!binaryAvailable;
  }
  try {
    const bin = getSandboxBinary();
    logger8.info(ctx, `[checkBinaryAvailable] Resolved binary path: ${bin}`);
    if (!bin) {
      binaryCheckError = new Error("Sandbox binary path was not configured");
      binaryAvailable = false;
      logger8.info(ctx, "[checkBinaryAvailable] Binary path not set, returning false");
      return false;
    }
    binaryAvailable = fs3.existsSync(bin);
    if (!binaryAvailable) {
      binaryCheckError = new Error(`Sandbox binary not found at ${bin}`);
      logger8.info(ctx, `[checkBinaryAvailable] Binary not found at: ${bin}`);
    } else {
      logger8.info(ctx, `[checkBinaryAvailable] Binary path exists: ${binaryAvailable}`);
    }
    return !!binaryAvailable;
  } catch (e) {
    binaryCheckError = e;
    binaryAvailable = false;
    logger8.info(ctx, `[checkBinaryAvailable] Exception checking binary: ${e}`);
    return false;
  }
}
function isSandboxHelperSupported(ctx) {
  if (cachedSandboxHelperSupported !== null) {
    return cachedSandboxHelperSupported;
  }
  const effectiveCtx = ctx ?? createContext();
  logger8.info(effectiveCtx, "[isSandboxHelperSupported] Starting sandbox support check...");
  if (!checkBinaryAvailable(effectiveCtx)) {
    const reason = binaryCheckError?.message || "Binary check failed";
    lastSandboxFailureReason = reason;
    logger8.info(effectiveCtx, `[isSandboxHelperSupported] Binary not available, returning false. Reason: ${reason}`);
    cachedSandboxHelperSupported = false;
    return cachedSandboxHelperSupported;
  }
  if (process.platform === "win32") {
    lastSandboxFailureReason = "Windows sandbox helper only provides network proxy, not filesystem isolation";
    logger8.info(effectiveCtx, "[isSandboxHelperSupported] win32: returning false (proxy-only, no filesystem sandbox)");
    cachedSandboxHelperSupported = false;
    return cachedSandboxHelperSupported;
  }
  if (process.platform === "darwin") {
    lastSandboxFailureReason = null;
    logger8.info(effectiveCtx, `[isSandboxHelperSupported] ${process.platform} platform, binary available, sandbox supported!`);
    cachedSandboxHelperSupported = true;
    return cachedSandboxHelperSupported;
  }
  const { binaryPath, args, env } = buildPreflightInvocation(effectiveCtx, process.cwd());
  try {
    const preflightStart = Date.now();
    spawnWorkload(import_node_child_process3.execFileSync, binaryPath, args, {
      stdio: ["ignore", "ignore", "pipe"],
      timeout: PREFLIGHT_PROBE_TIMEOUT_MS,
      env,
      shell: false
    });
    const preflightMs = Date.now() - preflightStart;
    lastSandboxFailureReason = null;
    logger8.info(effectiveCtx, `[isSandboxHelperSupported] Preflight succeeded in ${preflightMs}ms, sandbox supported!`);
    cachedSandboxHelperSupported = true;
    return cachedSandboxHelperSupported;
  } catch (e) {
    const error3 = e;
    return recordPreflightFailure(effectiveCtx, {
      message: error3.message,
      status: error3.status,
      stderrText: error3.stderr?.toString?.() || ""
    });
  }
}
function buildPreflightInvocation(ctx, cwd) {
  const unifiedPolicy = {
    sandbox: buildNativeSandboxPolicy(withSandboxPolicyDirectoryReadonly({ type: "workspace_readwrite" }), cwd)
  };
  const binaryPath = String(getSandboxBinary());
  logger8.info(ctx, `[sandboxPreflight] Running preflight with binary: ${binaryPath}`);
  logger8.info(ctx, `[sandboxPreflight] CWD: ${cwd}`);
  const env = { ...process.env };
  applyConfiguredRipgrepToSandboxEnv(env);
  const policyFilePath = writeSandboxPolicyFile(JSON.stringify(unifiedPolicy));
  return {
    binaryPath,
    args: ["--policy", policyFilePath, "--preflight-only", "--", "/bin/true"],
    env
  };
}
function recordPreflightFailure(ctx, failure) {
  const { message, status, stderrText } = failure;
  logger8.error(ctx, `[sandboxPreflight] Preflight failed: ${message}`);
  logger8.error(ctx, `[sandboxPreflight] Exit status: ${status}`);
  if (stderrText) {
    logger8.error(ctx, `[sandboxPreflight] Stderr: ${stderrText}`);
  }
  if (status === 2) {
    lastSandboxFailureReason = `Linux preflight failed with exit code 2 (unsupported kernel features). stderr: ${stderrText || "none"}`;
  } else {
    lastSandboxFailureReason = `Linux preflight failed: ${message || "unknown error"}. Exit status: ${status}. stderr: ${stderrText || "none"}`;
  }
  cachedSandboxHelperSupported = false;
  return false;
}
async function primeSandboxHelperSupport(opts) {
  if (cachedVerdictIsWorkspaceRooted && cachedSandboxHelperSupported !== null) {
    return cachedSandboxHelperSupported;
  }
  if (inFlightWorkspaceProbe !== null) {
    return inFlightWorkspaceProbe;
  }
  inFlightWorkspaceProbe = probeSandboxSupportFromWorkspace(opts).finally(() => {
    inFlightWorkspaceProbe = null;
  });
  return inFlightWorkspaceProbe;
}
async function probeSandboxSupportFromWorkspace(opts) {
  const ctx = opts.ctx ?? createContext();
  if (!isLinux || !checkBinaryAvailable(ctx)) {
    const supported2 = isSandboxHelperSupported(ctx);
    cachedVerdictIsWorkspaceRooted = true;
    return supported2;
  }
  if (cachedSandboxHelperSupported !== null) {
    logger8.info(ctx, `[primeSandboxHelperSupport] Re-probing from ${opts.workspaceCwd}; the cached verdict (${cachedSandboxHelperSupported}) was measured from a different directory`);
  }
  const timeoutMs = opts.timeoutMs ?? PREFLIGHT_PROBE_TIMEOUT_MS;
  const { binaryPath, args, env } = buildPreflightInvocation(ctx, opts.workspaceCwd);
  const started = Date.now();
  const outcome = await runPreflightWithTimeout({
    binaryPath,
    args,
    env,
    timeoutMs
  });
  const elapsedMs3 = Date.now() - started;
  if (outcome.kind === "timeout") {
    lastSandboxFailureReason = `Linux preflight rooted at ${opts.workspaceCwd} did not finish within ${timeoutMs}ms (sandbox setup for this workspace is slower than the terminal tool will wait). stderr: ${outcome.stderrText || "none"}`;
    logger8.error(ctx, `[primeSandboxHelperSupport] Preflight timed out after ${timeoutMs}ms, treating sandbox as unsupported`);
    cachedSandboxHelperSupported = false;
    cachedVerdictIsWorkspaceRooted = true;
    return false;
  }
  if (outcome.kind === "failed") {
    const supported2 = recordPreflightFailure(ctx, {
      message: outcome.message,
      status: outcome.status,
      stderrText: outcome.stderrText
    });
    cachedVerdictIsWorkspaceRooted = true;
    return supported2;
  }
  lastSandboxFailureReason = null;
  logger8.info(ctx, `[primeSandboxHelperSupport] Preflight rooted at ${opts.workspaceCwd} succeeded in ${elapsedMs3}ms, sandbox supported!`);
  cachedSandboxHelperSupported = true;
  cachedVerdictIsWorkspaceRooted = true;
  return true;
}
function runPreflightWithTimeout(opts) {
  return new Promise((resolve14) => {
    let child;
    try {
      child = spawnWorkload(import_node_child_process3.spawn, opts.binaryPath, opts.args, {
        stdio: ["ignore", "ignore", "pipe"],
        env: opts.env,
        shell: false,
        detached: true
      });
    } catch (e) {
      resolve14({
        kind: "failed",
        message: e instanceof Error ? e.message : String(e),
        stderrText: ""
      });
      return;
    }
    let stderrText = "";
    child.stderr?.on("data", (chunk) => {
      stderrText += chunk.toString();
    });
    let settled = false;
    const timer2 = setTimeout(() => {
      if (settled) {
        return;
      }
      settled = true;
      killProcessGroup(child);
      resolve14({ kind: "timeout", stderrText });
    }, opts.timeoutMs);
    timer2.unref?.();
    const finish = (outcome) => {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timer2);
      resolve14(outcome);
    };
    child.on("error", (e) => {
      finish({ kind: "failed", message: e.message, stderrText });
    });
    child.on("close", (code, signal) => {
      if (code === 0) {
        finish({ kind: "ok" });
        return;
      }
      finish({
        kind: "failed",
        message: `preflight exited with code ${code}${signal ? ` (signal ${signal})` : ""}`,
        status: code,
        stderrText
      });
    });
  });
}
function killProcessGroup(child) {
  const pid = child.pid;
  if (pid === void 0) {
    return;
  }
  try {
    process.kill(-pid, "SIGKILL");
  } catch {
    try {
      child.kill("SIGKILL");
    } catch {
    }
  }
}
function spawnWithSandboxHelper(command, args = [], options2 = {}, sandboxPolicy) {
  const ctx = createContext();
  options2.env = filterElectronEnv(options2.env);
  if (!checkBinaryAvailable(ctx)) {
    throw new Error(`Sandbox binary not available: ${binaryCheckError?.message || `binary not configured`}. Please build the binary or use 'insecure_none' policy.`);
  }
  if (sandboxPolicy.type === "insecure_none") {
    return spawnWorkload(import_node_child_process3.spawn, command, args, options2);
  }
  if (sandboxPolicy.type === "workspace_readwrite" || sandboxPolicy.type === "workspace_readonly") {
    return spawnWithSandboxHelperPolicy(command, args, options2, sandboxPolicy);
  }
  throw new Error(`Unsupported sandbox policy: ${String(sandboxPolicy)}`);
}
function spawnWithSandboxHelperPolicy(command, args, options2, sandboxPolicy) {
  if (sandboxPolicy.type !== "workspace_readwrite" && sandboxPolicy.type !== "workspace_readonly") {
    throw new Error("Expected workspace_readwrite or workspace_readonly policy");
  }
  const executionCwd = String(options2.cwd ?? process.cwd());
  const cwd = sandboxPolicy.sandboxWorkspaceRoot ?? executionCwd;
  let actualCommand = command;
  let actualArgs = args;
  if (options2.shell) {
    if (process.platform === "win32") {
      const shellPath = typeof options2.shell === "string" ? options2.shell : "cmd.exe";
      actualCommand = shellPath;
      actualArgs = ["/c", `${command} ${args.join(" ")}`];
    } else {
      const shellPath = typeof options2.shell === "string" ? options2.shell : "/bin/sh";
      actualCommand = shellPath;
      actualArgs = ["-c", `${command} ${args.join(" ")}`];
    }
  }
  const sandbox = buildNativeSandboxPolicy(withSandboxPolicyDirectoryReadonly(sandboxPolicy), cwd);
  const resolvedNetworkPolicy = resolveNetworkPolicyForFile(sandboxPolicy);
  const unifiedPolicy = { sandbox };
  if (resolvedNetworkPolicy !== void 0) {
    unifiedPolicy.networkPolicy = resolvedNetworkPolicy;
  }
  if (sandboxPolicy.networkPolicyStrict === false) {
    unifiedPolicy.networkPolicyStrict = false;
  }
  const policyFilePath = writeSandboxPolicyFile(JSON.stringify(unifiedPolicy));
  const sandboxArgs = ["--policy", policyFilePath, "--", actualCommand, ...actualArgs];
  const baseEnv = process.platform === "linux" ? scrubSocketEnvVars(process.env) : process.env;
  const optionsEnv = process.platform === "linux" && options2.env ? scrubSocketEnvVars(options2.env) : options2.env;
  const mergedEnv = {
    ...baseEnv,
    ...optionsEnv,
    CURSOR_SANDBOX: "native"
  };
  applyConfiguredRipgrepToSandboxEnv(mergedEnv);
  const spawnOptions = {
    cwd: options2.cwd || executionCwd,
    env: mergedEnv,
    stdio: options2.stdio || ["pipe", "pipe", "pipe"],
    detached: options2.detached
  };
  try {
    const startTime = /* @__PURE__ */ new Date();
    const child = spawnWorkload(import_node_child_process3.spawn, String(getSandboxBinary()), sandboxArgs, spawnOptions);
    if (isMacOS && child.pid) {
      registerSandboxMetadata(child, {
        startTime,
        pid: child.pid
      });
    }
    return child;
  } catch (e) {
    throw new Error(`Failed to spawn sandboxed process: ${e}`);
  }
}
function isGitBackedSync(dir) {
  let current = path4.resolve(dir);
  for (; ; ) {
    try {
      const dotGit = path4.join(current, ".git");
      if (fs3.existsSync(dotGit)) {
        return true;
      }
    } catch {
    }
    const parent = path4.dirname(current);
    if (parent === current) {
      return false;
    }
    current = parent;
  }
}
function buildReadOnlyJson(additionalReadonlyPaths, writeProtectionMapping, cwd) {
  const fromPaths = additionalReadonlyPaths && additionalReadonlyPaths.length > 0 ? convertPathsToIgnoreMapping(...additionalReadonlyPaths) : {};
  const cwdIsGitBacked = isGitBackedSync(cwd);
  const fromWorkspace = !isLinux || cwdIsGitBacked ? writeProtectionMapping ?? {} : {};
  const merged = { ...fromPaths };
  for (const [dir, patterns] of Object.entries(fromWorkspace)) {
    if (merged[dir]) {
      merged[dir] = [...merged[dir], ...patterns];
    } else {
      merged[dir] = patterns;
    }
  }
  if (Object.keys(merged).length === 0) {
    return void 0;
  }
  return normalizeIgnoreMapping(merged, cwd, [], []);
}
function buildIgnoreMapping(ignoreMapping, _cwd, _additionalReadwrite, _additionalReadonly) {
  return normalizeIgnoreMapping(ignoreMapping, _cwd, _additionalReadwrite, _additionalReadonly);
}
function normalizeIgnoreMapping(ignoreMapping, _cwd, _additionalReadwrite, _additionalReadonly) {
  const result = {};
  for (const [path30, patterns] of Object.entries(ignoreMapping)) {
    const fsPath = path30.startsWith("file://") ? uriToFsPath(path30) : path30;
    result[fsPath] = patterns;
    const canonicalPath = tryRealpath(fsPath);
    if (canonicalPath !== fsPath) {
      result[canonicalPath] = patterns;
    }
  }
  return result;
}
function uriToFsPath(uri) {
  let path30 = uri.replace(/^file:\/\//, "");
  path30 = decodeURIComponent(path30);
  if (path30.length > 1 && path30.endsWith("/")) {
    path30 = path30.slice(0, -1);
  }
  return path30;
}
function tryRealpath(p2) {
  try {
    return (0, import_node_fs4.realpathSync)(p2);
  } catch {
    return p2;
  }
}
function getLastSandboxFailureReason() {
  return lastSandboxFailureReason;
}
var import_node_child_process3, fs3, import_node_fs4, os3, path4, isMacOS, isLinux, logger8, configuredSandboxBinaryPath, configuredWorkspaceReadEnabled, binaryAvailable, binaryCheckError, lastSandboxFailureReason, cachedSandboxHelperSupported, cachedVerdictIsWorkspaceRooted, inFlightWorkspaceProbe, PREFLIGHT_PROBE_TIMEOUT_MS;
var init_helper = __esm({
  "../packages/shell-exec/dist/sandbox/helper.js"() {
    "use strict";
    import_node_child_process3 = require("node:child_process");
    fs3 = __toESM(require("node:fs"), 1);
    import_node_fs4 = require("node:fs");
    os3 = __toESM(require("node:os"), 1);
    path4 = __toESM(require("node:path"), 1);
    init_dist();
    init_dist3();
    init_env_filter();
    init_ripgrep();
    init_hardcoded_policy();
    init_seatbelt();
    init_network_policy_utils();
    init_policy_file();
    isMacOS = process.platform === "darwin";
    isLinux = process.platform === "linux";
    logger8 = createLogger("shell-exec:sandbox");
    configuredWorkspaceReadEnabled = true;
    binaryAvailable = null;
    binaryCheckError = null;
    lastSandboxFailureReason = null;
    cachedSandboxHelperSupported = null;
    cachedVerdictIsWorkspaceRooted = false;
    inFlightWorkspaceProbe = null;
    PREFLIGHT_PROBE_TIMEOUT_MS = 15e3;
  }
});

