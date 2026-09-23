var import_node_path51 = require("node:path");
function validateAndResolveSubpath(baseDir, subPath) {
  const resolvedBase = (0, import_node_path51.resolve)(baseDir);
  const resolved = (0, import_node_path51.resolve)(baseDir, subPath);
  const rel = (0, import_node_path51.relative)(resolvedBase, resolved);
  if (rel.startsWith("..") || (0, import_node_path51.isAbsolute)(rel)) {
    throw new Error(`Invalid subPath: path traversal not allowed (${JSON.stringify(subPath)})`);
  }
  return resolved;
}
