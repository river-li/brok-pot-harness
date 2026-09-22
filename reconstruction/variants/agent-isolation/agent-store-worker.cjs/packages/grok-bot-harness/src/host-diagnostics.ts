/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/host-diagnostics.ts
 * Bundle: sand-host/agent-isolation/agent-store-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var pinnedReporter = null;
function reportHostDiagnostic(diagnostic) {
  pinnedReporter?.(diagnostic);
}

