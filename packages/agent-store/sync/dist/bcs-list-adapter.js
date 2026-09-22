/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-store/sync/dist/bcs-list-adapter.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function isLeftoverHiddenByRemovedPrefix({ relPath, listedDir, removed }) {
  for (const marker17 of removed) {
    if (relPath === marker17) {
      continue;
    }
    if (!relPath.startsWith(`${marker17}/`)) {
      continue;
    }
    if (listedDir === marker17 || listedDir.startsWith(`${marker17}/`)) {
      return false;
    }
    return true;
  }
  return false;
}
function adaptFlatAgentStoreList({ files, relPath, tombstones, listingComplete, removedSubdirs, tombstoneWatermarkMs, tombstoneFloorMs }) {
  const requestedRelPath = normalizeListDirRelPath(relPath);
  const prefix = listDirPrefix(requestedRelPath);
  const subdirs = /* @__PURE__ */ new Set();
  const matchedFiles = [];
  let skippedUnsafeEntries = 0;
  const removed = /* @__PURE__ */ new Set();
  for (const name17 of removedSubdirs !== null && removedSubdirs !== void 0 ? removedSubdirs : []) {
    try {
      removed.add(normalizeRelPath(name17));
    } catch (_a19) {
      skippedUnsafeEntries += 1;
    }
  }
  for (const file2 of files) {
    let normalizedPath;
    try {
      normalizedPath = normalizeRelPath(file2.relPath);
    } catch (_b2) {
      skippedUnsafeEntries += 1;
      continue;
    }
    collectSubdir({ prefix, relObjectPath: normalizedPath, subdirs });
    if (!normalizedPath.startsWith(prefix)) {
      continue;
    }
    if (isLeftoverHiddenByRemovedPrefix({
      relPath: normalizedPath,
      listedDir: requestedRelPath,
      removed
    })) {
      continue;
    }
    matchedFiles.push(Object.assign(Object.assign({}, file2), { relPath: normalizedPath }));
  }
  for (const name17 of removed) {
    subdirs.delete(name17);
  }
  return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ files: matchedFiles.sort((left, right) => left.relPath.localeCompare(right.relPath)), subdirs: [...subdirs].sort() }, tombstones !== void 0 ? { tombstones } : {}), listingComplete !== void 0 ? { listingComplete } : {}), removed.size > 0 ? { removedSubdirs: [...removed].sort() } : {}), tombstoneWatermarkMs !== void 0 ? { tombstoneWatermarkMs } : {}), tombstoneFloorMs !== void 0 ? { tombstoneFloorMs } : {}), { skippedUnsafeEntries });
}
function normalizeListDirRelPath(relPath) {
  if (relPath === "") {
    return "";
  }
  return normalizeRelPath(relPath);
}
function listDirPrefix(requestedRelPath) {
  if (requestedRelPath.length === 0) {
    return "";
  }
  return `${requestedRelPath.replace(/\/$/, "")}/`;
}
function collectSubdir({ prefix, relObjectPath, subdirs }) {
  if (!relObjectPath.startsWith(prefix)) {
    return;
  }
  const remaining = relObjectPath.slice(prefix.length);
  const firstSlash = remaining.indexOf("/");
  if (firstSlash > 0) {
    subdirs.add(`${prefix}${remaining.slice(0, firstSlash)}`);
  }
}

