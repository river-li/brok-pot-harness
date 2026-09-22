/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/node/paths.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_promises26 = require("node:fs/promises");
var import_node_path58 = require("node:path");
var import_node_url7 = require("node:url");
function isPathWithin2(parent, child, opts = {}) {
  const rel = (0, import_node_path58.relative)((0, import_node_path58.resolve)(parent), (0, import_node_path58.resolve)(child));
  if (rel === "") return opts.isInclusive ?? false;
  return !rel.startsWith("..") && !(0, import_node_path58.isAbsolute)(rel);
}
function filePathFromFileUrl(rawUrl) {
  try {
    const url2 = new URL(rawUrl);
    if (url2.protocol !== "file:") return null;
    return (0, import_node_url7.fileURLToPath)(url2);
  } catch {
    return null;
  }
}
async function realpathNearestExisting(p2) {
  const missing = [];
  let current = p2;
  for (; ; ) {
    try {
      const real = await (0, import_promises26.realpath)(current);
      return missing.length === 0 ? real : (0, import_node_path58.join)(real, ...missing.reverse());
    } catch (error3) {
      if (findSystemErrno(error3) !== "ENOENT") throw error3;
      const parent = (0, import_node_path58.dirname)(current);
      if (parent === current) return p2;
      missing.push((0, import_node_path58.basename)(current));
      current = parent;
    }
  }
}

