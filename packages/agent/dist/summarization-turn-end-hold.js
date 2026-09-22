/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/summarization-turn-end-hold.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var backgroundSummarizationTurnEndHoldMs = createHistogram("agent.background_summarization.turn_end_hold_ms", {
  description: "Wall time a turn stayed open waiting on an in-flight background summarization, by how the hold ended",
  labelNames: ["outcome", "model", "summarizer"]
});

