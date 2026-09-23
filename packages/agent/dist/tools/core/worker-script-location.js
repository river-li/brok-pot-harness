var import_node_fs45 = __toESM(require("node:fs"), 1);
var import_node_path76 = __toESM(require("node:path"), 1);
var import_node_url10 = require("node:url");
function resolveWorkerLocation(moduleUrl, representativeWorker) {
  const moduleDir = import_node_path76.default.dirname((0, import_node_url10.fileURLToPath)(moduleUrl));
  if (import_node_fs45.default.existsSync(import_node_path76.default.join(moduleDir, `${representativeWorker}.ts`))) {
    return { dir: moduleDir, extension: "ts" };
  }
  if (import_node_fs45.default.existsSync(import_node_path76.default.join(moduleDir, `${representativeWorker}.js`))) {
    return { dir: moduleDir, extension: "js" };
  }
  const entry = process.argv[1];
  if (entry) {
    const entryDir = import_node_path76.default.dirname(entry);
    if (import_node_fs45.default.existsSync(import_node_path76.default.join(entryDir, `${representativeWorker}.js`))) {
      return { dir: entryDir, extension: "js" };
    }
  }
  return { dir: moduleDir, extension: "js" };
}
