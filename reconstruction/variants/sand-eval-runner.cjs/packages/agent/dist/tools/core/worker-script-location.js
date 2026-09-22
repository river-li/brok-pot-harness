/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/core/worker-script-location.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_node_fs21 = __toESM(require("node:fs"), 1);
var import_node_path50 = __toESM(require("node:path"), 1);
var import_node_url6 = require("node:url");
function resolveWorkerLocation(moduleUrl, representativeWorker) {
  const moduleDir = import_node_path50.default.dirname((0, import_node_url6.fileURLToPath)(moduleUrl));
  if (import_node_fs21.default.existsSync(import_node_path50.default.join(moduleDir, `${representativeWorker}.ts`))) {
    return { dir: moduleDir, extension: "ts" };
  }
  if (import_node_fs21.default.existsSync(import_node_path50.default.join(moduleDir, `${representativeWorker}.js`))) {
    return { dir: moduleDir, extension: "js" };
  }
  const entry = process.argv[1];
  if (entry) {
    const entryDir = import_node_path50.default.dirname(entry);
    if (import_node_fs21.default.existsSync(import_node_path50.default.join(entryDir, `${representativeWorker}.js`))) {
      return { dir: entryDir, extension: "js" };
    }
  }
  return { dir: moduleDir, extension: "js" };
}

