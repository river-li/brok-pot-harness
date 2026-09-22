/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/node/sand-variant.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function sandVariantOf(packaged, labBuild) {
  if (!packaged) return "sand-dev";
  if (labBuild) return "sand-lab";
  return "sand";
}

