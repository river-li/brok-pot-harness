var import_node_path108 = require("node:path");
init_errors();
var SandProtectedPathError = class extends SandDomainError {
  name = "SandProtectedPathError";
};
function refusalMessage(path31) {
  return `Path is inside a protected host-only store and was refused: ${path31}`;
}
var MODEL_READABLE_STORE_TREES = /* @__PURE__ */ new Set([
  "agents",
  "agent-transcripts",
  "user-memory",
  "projects",
  "workflows",
  "plugins",
  "managed-skills"
]);
var PRIVATE_DB_FILE_PATTERN = /\.db($|[.-])/;
function isModelReadableStorePath(root, path31) {
  const segments = (0, import_node_path108.relative)(root, path31).split(import_node_path108.sep);
  const first = segments[0];
  if (first === void 0 || !MODEL_READABLE_STORE_TREES.has(first)) return false;
  return segments.every((segment) => !PRIVATE_DB_FILE_PATTERN.test(segment));
}
async function assertPathOutsideProtectedRoots(protectedRoots, candidatePath, baseDir) {
  if (protectedRoots.length === 0) return;
  const resolved = (0, import_node_path108.isAbsolute)(candidatePath) ? (0, import_node_path108.resolve)(candidatePath) : (0, import_node_path108.resolve)(baseDir, candidatePath);
  for (const root of protectedRoots) {
    if (isPathWithin(root, resolved, { isInclusive: true }) && !isModelReadableStorePath(root, resolved)) {
      throw new SandProtectedPathError(refusalMessage(candidatePath));
    }
  }
  const realResolved = await realpathNearestExisting(resolved);
  for (const root of protectedRoots) {
    const realRoot = await realpathNearestExisting(root);
    if (isPathWithin(realRoot, realResolved, { isInclusive: true }) && !isModelReadableStorePath(realRoot, realResolved)) {
      throw new SandProtectedPathError(refusalMessage(candidatePath));
    }
  }
}
