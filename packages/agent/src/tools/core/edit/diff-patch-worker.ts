/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/src/tools/core/edit/diff-patch-worker.ts
 * Bundle: sand-host/diff-patch-worker.js
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
var diff_patch_worker_exports = {};
__export(diff_patch_worker_exports, {
  default: () => calculateDiffPatch
});
module.exports = __toCommonJS(diff_patch_worker_exports);

// @recovered-fragment 2/2
function calculateDiffPatch(params) {
  const fileName = params.filePath || "";
  const patch = createPatch(fileName, params.original, params.new, "", "", { context: 2 });
  return {
    patch
  };
}
