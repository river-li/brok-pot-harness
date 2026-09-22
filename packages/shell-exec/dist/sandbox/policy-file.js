/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/shell-exec/dist/sandbox/policy-file.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function getSandboxPolicyDirectory() {
  const override = process.env[SANDBOX_POLICY_DIR_ENV]?.trim();
  if (override) {
    return path15.resolve(override);
  }
  return path15.resolve(path15.join(os5.homedir(), ".cursor", SANDBOX_POLICY_DIR_NAME));
}
function pruneStaleSandboxPolicyFiles(dir) {
  let entries;
  try {
    entries = fs15.readdirSync(dir);
  } catch {
    return;
  }
  const now = Date.now();
  for (const name17 of entries) {
    if (!name17.startsWith("sandbox-policy-")) {
      continue;
    }
    const fullPath = path15.join(dir, name17);
    try {
      const st2 = fs15.statSync(fullPath);
      if (!st2.isFile()) {
        continue;
      }
      if (now - st2.mtimeMs > STALE_POLICY_MAX_AGE_MS) {
        fs15.unlinkSync(fullPath);
      }
    } catch {
    }
  }
}
function ensureSandboxPolicyDirectory() {
  const dir = getSandboxPolicyDirectory();
  fs15.mkdirSync(dir, { recursive: true, mode: 448 });
  try {
    fs15.chmodSync(dir, 448);
  } catch {
  }
  const now = Date.now();
  if (now - lastPruneAtMs >= PRUNE_INTERVAL_MS) {
    lastPruneAtMs = now;
    pruneStaleSandboxPolicyFiles(dir);
  }
  return dir;
}
function writeSandboxPolicyFile(policyJson) {
  const dir = ensureSandboxPolicyDirectory();
  const suffix = crypto2.randomBytes(8).toString("hex");
  const filePath = path15.join(dir, `sandbox-policy-${suffix}`);
  fs15.writeFileSync(filePath, policyJson, { encoding: "utf-8", mode: 384 });
  return filePath;
}
var crypto2, fs15, os5, path15, SANDBOX_POLICY_DIR_NAME, SANDBOX_POLICY_DIR_ENV, STALE_POLICY_MAX_AGE_MS, PRUNE_INTERVAL_MS, lastPruneAtMs;
var init_policy_file = __esm({
  "../packages/shell-exec/dist/sandbox/policy-file.js"() {
    "use strict";
    crypto2 = __toESM(require("node:crypto"), 1);
    fs15 = __toESM(require("node:fs"), 1);
    os5 = __toESM(require("node:os"), 1);
    path15 = __toESM(require("node:path"), 1);
    SANDBOX_POLICY_DIR_NAME = "sandbox-policies";
    SANDBOX_POLICY_DIR_ENV = "CURSOR_SANDBOX_POLICY_DIR";
    STALE_POLICY_MAX_AGE_MS = 60 * 60 * 1e3;
    PRUNE_INTERVAL_MS = 15 * 60 * 1e3;
    lastPruneAtMs = 0;
  }
});

