var MAX_HANDLED_REASONS = 1e3;
var CodebaseSnapshotTrigger = class {
  getSession;
  logger;
  handledReasonKeys = /* @__PURE__ */ new Set();
  failureCount = 0;
  nextFailureLogAt = 1;
  constructor({ getSession, logger: logger110 }) {
    this.getSession = getSession;
    this.logger = logger110;
  }
  handle(reason) {
    const session = this.getSession();
    if (session === void 0) {
      this.logger.debug(`snapshot trigger dropped (telemetry inactive): ${reason.type}`);
      return "inactive";
    }
    const reasonKey = snapshotReasonKey(reason);
    if (this.handledReasonKeys.has(reasonKey)) {
      return "duplicate";
    }
    this.handledReasonKeys.add(reasonKey);
    this.pruneIfNeeded();
    void session.snapshot(reason).catch((err) => {
      this.handledReasonKeys.delete(reasonKey);
      this.failureCount++;
      if (this.failureCount < this.nextFailureLogAt) {
        return;
      }
      this.nextFailureLogAt *= 2;
      this.logger.warn(`snapshot trigger failed (failure #${this.failureCount})`, err);
    });
    return "accepted";
  }
  pruneIfNeeded() {
    if (this.handledReasonKeys.size <= MAX_HANDLED_REASONS) {
      return;
    }
    const oldest = this.handledReasonKeys.values().next();
    if (!oldest.done) {
      this.handledReasonKeys.delete(oldest.value);
    }
  }
};
function snapshotReasonKey(reason) {
  switch (reason.type) {
    case "AGENT_REQUEST_START":
    case "AGENT_REQUEST_END":
      return JSON.stringify([reason.type, reason.requestId]);
  }
}
