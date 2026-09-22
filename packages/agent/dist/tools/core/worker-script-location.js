/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/core/worker-script-location.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_node_fs47 = __toESM(require("node:fs"), 1);
var import_node_path85 = __toESM(require("node:path"), 1);
var import_node_url11 = require("node:url");
function resolveWorkerLocation(moduleUrl, representativeWorker) {
  const moduleDir = import_node_path85.default.dirname((0, import_node_url11.fileURLToPath)(moduleUrl));
  if (import_node_fs47.default.existsSync(import_node_path85.default.join(moduleDir, `${representativeWorker}.ts`))) {
    return { dir: moduleDir, extension: "ts" };
  }
  if (import_node_fs47.default.existsSync(import_node_path85.default.join(moduleDir, `${representativeWorker}.js`))) {
    return { dir: moduleDir, extension: "js" };
  }
  const entry = process.argv[1];
  if (entry) {
    const entryDir = import_node_path85.default.dirname(entry);
    if (import_node_fs47.default.existsSync(import_node_path85.default.join(entryDir, `${representativeWorker}.js`))) {
      return { dir: entryDir, extension: "js" };
    }
  }
  return { dir: moduleDir, extension: "js" };
}

