/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/box/forever-box.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var SAND_BOX_HAND_BACK_TRIGGERS = ["button", "viewer-closed", "dismissed"];
function decideBoxHandBack(handoff, trigger2) {
  if (handoff == null) return { kind: "none" };
  return {
    kind: "resume",
    requestId: handoff.requestId,
    trigger: trigger2,
    resolution: trigger2 === "dismissed" ? "dismissed" : "handed_back"
  };
}

