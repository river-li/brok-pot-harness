/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/utils/dist/oom-score-adj.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function resetChildOomScoreAdj(pid) {
  if (process.platform !== "linux" || pid === void 0 || pid <= 0) {
    return;
  }
  try {
    (0, import_node_fs.writeFileSync)(`/proc/${pid}/oom_score_adj`, "0");
  } catch (_a20) {
  }
}
var import_node_fs;
var init_oom_score_adj = __esm({
  "../packages/utils/dist/oom-score-adj.js"() {
    "use strict";
    import_node_fs = require("node:fs");
  }
});

