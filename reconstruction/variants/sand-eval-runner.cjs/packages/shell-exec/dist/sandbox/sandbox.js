/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/shell-exec/dist/sandbox/sandbox.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function configureSandboxPrereqs2(options2) {
  configureSandboxPrereqs(options2);
}
function spawnInSandbox(command, args = [], options2 = {}, sandboxPolicy) {
  options2.env = filterElectronEnv(options2.env);
  if (sandboxPolicy.enableSharedBuildCache) {
    options2 = {
      ...options2,
      env: {
        ...filterElectronEnv(process.env),
        ...getSandboxCacheEnv(),
        ...options2.env
      }
    };
  }
  if (sandboxPolicy.type !== "insecure_none") {
    if (isSandboxHelperSupported()) {
      return spawnWithSandboxHelper(command, args, options2, sandboxPolicy);
    }
    const failureReason = getLastSandboxFailureReason();
    throw new SandboxUnsupportedError(`Sandbox policy '${sandboxPolicy.type}' is not supported on this system. Ensure the sandbox helper binary is available, or use 'insecure_none'. Reason: ${failureReason || "unknown"}`, failureReason ?? void 0);
  }
  return spawnUnsafe(command, args, options2);
}
function spawnUnsafe(command, args, options2) {
  return spawnWorkload(import_node_child_process4.spawn, command, args, options2);
}
function captureSandboxDenies2(child) {
  if (isMacOS2) {
    return captureSandboxDenies(child);
  } else {
    return Promise.resolve([]);
  }
}
function isSandboxSupported(_policy, _options) {
  if (isMacOS2) {
    try {
      (0, import_node_fs5.accessSync)("/usr/bin/sandbox-exec", import_node_fs5.constants.X_OK);
    } catch {
      return false;
    }
  }
  return isSandboxHelperSupported(_options?.ctx);
}
async function primeSandboxSupport(options2) {
  if (isMacOS2) {
    try {
      (0, import_node_fs5.accessSync)("/usr/bin/sandbox-exec", import_node_fs5.constants.X_OK);
    } catch {
      return false;
    }
  }
  return primeSandboxHelperSupport(options2);
}
var import_node_child_process4, import_node_fs5, SandboxUnsupportedError, isMacOS2;
var init_sandbox = __esm({
  "../packages/shell-exec/dist/sandbox/sandbox.js"() {
    "use strict";
    import_node_child_process4 = require("node:child_process");
    import_node_fs5 = require("node:fs");
    init_dist3();
    init_env_filter();
    init_cache_env();
    init_helper();
    init_seatbelt();
    SandboxUnsupportedError = class extends Error {
      reason;
      constructor(message, reason) {
        super(message);
        this.reason = reason;
        this.name = "SandboxUnsupportedError";
      }
    };
    isMacOS2 = process.platform === "darwin";
  }
});

