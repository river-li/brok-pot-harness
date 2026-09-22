var import_promises = require("node:fs/promises");
var import_node_path = require("node:path");
var import_node_url = require("node:url");
init_system_errno();
function isPathWithin(parent, child, opts = {}) {
  const rel = (0, import_node_path.relative)((0, import_node_path.resolve)(parent), (0, import_node_path.resolve)(child));
  if (rel === "") return opts.isInclusive ?? false;
  return !rel.startsWith("..") && !(0, import_node_path.isAbsolute)(rel);
}
function filePathFromFileUrl(rawUrl) {
  try {
    const url2 = new URL(rawUrl);
    if (url2.protocol !== "file:") return null;
    return (0, import_node_url.fileURLToPath)(url2);
  } catch {
    return null;
  }
}
function posixPathFromFileUrl(rawUrl) {
  try {
    const url2 = new URL(rawUrl);
    if (url2.protocol !== "file:") return null;
    return decodeURIComponent(url2.pathname);
  } catch {
    return null;
  }
}
async function containWithin(roots, p2) {
  if (typeof p2 !== "string" || p2.length === 0 || !(0, import_node_path.isAbsolute)(p2)) return null;
  const resolved = (0, import_node_path.resolve)(p2);
  if (!roots.some((root) => isPathWithin(root, resolved))) return null;
  const [realResolved, realRoots] = await Promise.all([
    realpathNearestExisting(resolved),
    Promise.all(roots.map((root) => realpathNearestExisting(root)))
  ]);
  if (!realRoots.some((root) => isPathWithin(root, realResolved))) return null;
  return resolved;
}
async function realpathNearestExisting(p2) {
  const missing = [];
  let current = p2;
  for (; ; ) {
    try {
      const real = await (0, import_promises.realpath)(current);
      return missing.length === 0 ? real : (0, import_node_path.join)(real, ...missing.reverse());
    } catch (error42) {
      if (findSystemErrno(error42) !== "ENOENT") throw error42;
      const parent = (0, import_node_path.dirname)(current);
      if (parent === current) return p2;
      missing.push((0, import_node_path.basename)(current));
      current = parent;
    }
  }
}
