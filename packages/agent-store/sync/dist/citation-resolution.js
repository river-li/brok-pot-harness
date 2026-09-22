/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-store/sync/dist/citation-resolution.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function pullPathsAttemptFromRound(summary, engineStateAfterRound) {
  return engineStateAfterRound === "passive" && !summary.listingComplete ? { kind: "holder-owns-fetch" } : { kind: "ran", summary };
}

