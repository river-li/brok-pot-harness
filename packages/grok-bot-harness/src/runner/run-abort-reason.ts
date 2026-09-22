/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/run-abort-reason.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var SandRunAbortError = class extends Error {
  toolCallAuditOutcome = "cancelled";
  intentional;
  reason;
  constructor({ intentional, reason }) {
    super(reason);
    this.name = "SandRunAbortError";
    this.intentional = intentional;
    this.reason = reason;
  }
};
function isIntentionalAbortReason(reason) {
  return typeof reason === "object" && reason !== null && "intentional" in reason && reason.intentional === true;
}

