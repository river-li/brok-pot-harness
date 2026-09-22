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
