/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/transcript/transcript-threads.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function replyToOf(entry) {
  return "replyTo" in entry ? entry.replyTo : void 0;
}
function resolveBranchRoot2(entry, branchedById) {
  let current = entry;
  const seen = /* @__PURE__ */ new Set([entry.id]);
  for (; ; ) {
    const parentId = replyToOf(current);
    if (parentId === void 0) return void 0;
    const parent = branchedById.get(parentId);
    if (parent === void 0) return parentId;
    if (seen.has(parentId)) return void 0;
    seen.add(parentId);
    current = parent;
  }
}
function branchReplyCounts(branched) {
  const byId = new Map(branched.map((entry) => [entry.id, entry]));
  const counts = /* @__PURE__ */ new Map();
  for (const entry of branched) {
    const root = resolveBranchRoot2(entry, byId);
    if (root === void 0) continue;
    counts.set(root, (counts.get(root) ?? 0) + 1);
  }
  return counts;
}
function threadDescendants(rootId, branched) {
  const byId = new Map(branched.map((entry) => [entry.id, entry]));
  return branched.filter((entry) => resolveBranchRoot2(entry, byId) === rootId);
}

