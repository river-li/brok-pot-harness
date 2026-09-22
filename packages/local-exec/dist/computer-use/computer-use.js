/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/local-exec/dist/computer-use/computer-use.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_dist4();

// @recovered-fragment 2/2
var sessionDuration = createHistogram("computer_use.session.duration_ms", {
  description: "Duration of computer-use session in milliseconds"
});
var sessionActionCount = createHistogram("computer_use.session.action_count", {
  description: "Number of actions executed in a computer-use session"
});
var sessionResult = createCounter("computer_use.session.result", {
  description: "Result status of computer-use session",
  labelNames: ["outcome"]
});
var sessionActionKind = createCounter("computer_use.session.action_kind", {
  description: "Requested computer-use actions by bounded kind",
  labelNames: ["kind"]
});
var logger33 = createLogger("computer-use");

