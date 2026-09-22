/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/box/protected-path-guard.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_node_path67 = require("node:path");
var SandProtectedPathError = class extends SandDomainError {
  name = "SandProtectedPathError";
};
function refusalMessage(path30) {
  return `Path is inside a protected host-only store and was refused: ${path30}`;
}
var MODEL_READABLE_STORE_TREES = /* @__PURE__ */ new Set([
  "agents",
  "agent-transcripts",
  "user-memory",
  "workflows",
  "plugins",
  "managed-skills"
]);
var PRIVATE_DB_FILE_PATTERN = /\.db($|[.-])/;
function isModelReadableStorePath(root, path30) {
  const segments = (0, import_node_path67.relative)(root, path30).split(import_node_path67.sep);
  const first = segments[0];
  if (first === void 0 || !MODEL_READABLE_STORE_TREES.has(first)) return false;
  return segments.every((segment) => !PRIVATE_DB_FILE_PATTERN.test(segment));
}
async function assertPathOutsideProtectedRoots(protectedRoots, candidatePath, baseDir) {
  if (protectedRoots.length === 0) return;
  const resolved = (0, import_node_path67.isAbsolute)(candidatePath) ? (0, import_node_path67.resolve)(candidatePath) : (0, import_node_path67.resolve)(baseDir, candidatePath);
  for (const root of protectedRoots) {
    if (isPathWithin2(root, resolved, { isInclusive: true }) && !isModelReadableStorePath(root, resolved)) {
      throw new SandProtectedPathError(refusalMessage(candidatePath));
    }
  }
  const realResolved = await realpathNearestExisting(resolved);
  for (const root of protectedRoots) {
    const realRoot = await realpathNearestExisting(root);
    if (isPathWithin2(realRoot, realResolved, { isInclusive: true }) && !isModelReadableStorePath(realRoot, realResolved)) {
      throw new SandProtectedPathError(refusalMessage(candidatePath));
    }
  }
}

