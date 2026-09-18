var import_node_crypto84 = require("node:crypto");
var import_node_path176 = require("node:path");
var SKIP_FILENAMES = /* @__PURE__ */ new Set(["runs.json"]);
var TMP_SUFFIX = ".tmp";
function isUserSkillsFingerprintFile(posixPathUnderLibraryRoot) {
  const [skillId, ...rest] = posixPathUnderLibraryRoot.split("/");
  if (skillId === void 0 || rest.length === 0 || !isSafeFolderId(skillId)) return false;
  return rest.every(isDurableSegment);
}
function isDurableSegment(segment) {
  return segment.length > 0 && !segment.endsWith(TMP_SUFFIX) && !SKIP_FILENAMES.has(segment);
}
function isUnderRoot(relPath) {
  return relPath.length > 0 && relPath !== ".." && !relPath.startsWith("../") && !import_node_path176.posix.isAbsolute(relPath);
}
function userSkillsFingerprintOfTree(tree, libraryRoot) {
  const counted = [];
  for (const [path31, text2] of tree) {
    const relPath = import_node_path176.posix.relative(libraryRoot, path31);
    if (isUnderRoot(relPath) && isUserSkillsFingerprintFile(relPath)) counted.push([relPath, text2]);
  }
  counted.sort(([a], [b2]) => compareCodePoints(a, b2));
  const hash = (0, import_node_crypto84.createHash)("sha256");
  for (const entry of counted) {
    hash.update(JSON.stringify(entry));
    hash.update("\n");
  }
  return hash.digest("hex");
}
function compareCodePoints(a, b2) {
  if (a < b2) return -1;
  return a > b2 ? 1 : 0;
}
