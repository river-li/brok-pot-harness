/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/cursor-plugins/dist/validate-subpath.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_node_path60 = require("node:path");
function validateAndResolveSubpath(baseDir, subPath) {
  const resolvedBase = (0, import_node_path60.resolve)(baseDir);
  const resolved = (0, import_node_path60.resolve)(baseDir, subPath);
  const rel = (0, import_node_path60.relative)(resolvedBase, resolved);
  if (rel.startsWith("..") || (0, import_node_path60.isAbsolute)(rel)) {
    throw new Error(`Invalid subPath: path traversal not allowed (${JSON.stringify(subPath)})`);
  }
  return resolved;
}

