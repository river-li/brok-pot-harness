/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/box/box-store-backend-policy.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_node_path6 = require("node:path");
var SAND_BOX_STORE_LOCAL_DIR_ENV = "SAND_BOX_STORE_LOCAL_DIR";
var SAND_BOX_STORE_BACKEND_ENV = "SAND_BOX_STORE_BACKEND";
var SAND_BOX_STORE_MANIFEST_COMMIT_ENV = "SAND_BOX_STORE_MANIFEST_COMMIT";
var SAND_MANIFEST_V2_ENV = "SAND_MANIFEST_V2";
var policies = /* @__PURE__ */ new WeakMap();
function resolveBackendKind(localDir, env) {
  if (localDir != null) return "local-fs";
  if (env[SAND_BOX_STORE_BACKEND_ENV]?.trim().toLowerCase() === "v2") {
    return "sand-box-store-v2";
  }
  return "agent-store";
}
function getBoxStoreBackendPolicy(env) {
  const cached2 = policies.get(env);
  if (cached2 != null) return cached2;
  const rawLocalDir = env[SAND_BOX_STORE_LOCAL_DIR_ENV]?.trim();
  const localDir = rawLocalDir != null && rawLocalDir.length > 0 && (0, import_node_path6.isAbsolute)(rawLocalDir) ? rawLocalDir : void 0;
  const kind = resolveBackendKind(localDir, env);
  const manifestCommit = kind === "sand-box-store-v2" && env[SAND_BOX_STORE_MANIFEST_COMMIT_ENV]?.trim() === "1";
  const policy = Object.freeze({ kind, localDir, manifestCommit });
  policies.set(env, policy);
  return policy;
}
function isBoxStoreSyncEnabled(env) {
  const raw = env.SAND_BOX_STORE_SYNC?.trim().toLowerCase();
  return raw === "1" || raw === "true" || raw === "yes";
}
function isBoxStoreCopyInEnabled(env) {
  const raw = env.SAND_BOX_STORE_COPY_IN?.trim().toLowerCase();
  return raw === "1" || raw === "true" || raw === "yes";
}
var SAND_BOX_LEGACY_STORE_ENV = "SAND_BOX_LEGACY_STORE";
var SAND_BOX_LEGACY_STORE_ABSENT_VALUE = "absent";
function isLegacyBoxStoreHydrateSkipped(env) {
  return env[SAND_BOX_LEGACY_STORE_ENV]?.trim().toLowerCase() === SAND_BOX_LEGACY_STORE_ABSENT_VALUE;
}

