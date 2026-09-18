var SAND_AUTO_REVIEW_AWAITING_TAB_ID = "auto-review";
function buildSandAutoReviewAwaitingReason(summary) {
  return `Approval needed: ${summary}`;
}
var SandAutoReviewAwaitingBridge = class {
  constructor(sink, now = Date.now) {
    this.sink = sink;
    this.now = now;
  }
  sink;
  now;
  pendingByAgent = /* @__PURE__ */ new Map();
  handleEvent(event) {
    const { agentId, id, summary, summaryCopy } = event.approval;
    if (event.type === "created") {
      let pending2 = this.pendingByAgent.get(agentId);
      if (pending2 == null) {
        pending2 = /* @__PURE__ */ new Map();
        this.pendingByAgent.set(agentId, pending2);
      }
      pending2.set(id, {
        reason: buildSandAutoReviewAwaitingReason(summary),
        reasonCopy: {
          kind: "auto_review_approval",
          params: {
            summary,
            ...summaryCopy === void 0 ? {} : { summaryCopy }
          }
        }
      });
      this.assert(agentId, pending2);
      return;
    }
    const pending = this.pendingByAgent.get(agentId);
    if (pending == null || !pending.delete(id)) return;
    if (pending.size === 0) {
      this.pendingByAgent.delete(agentId);
      this.sink.clearForTab(agentId, SAND_AUTO_REVIEW_AWAITING_TAB_ID);
      return;
    }
    this.assert(agentId, pending);
  }
  pendingAwaitingState(agentId) {
    const pending = this.pendingByAgent.get(agentId);
    const awaiting = pending && [...pending.values()].at(-1);
    if (awaiting == null) return null;
    return {
      tabId: SAND_AUTO_REVIEW_AWAITING_TAB_ID,
      reason: awaiting.reason,
      reasonCopy: awaiting.reasonCopy,
      since: this.now()
    };
  }
  assert(agentId, pending) {
    const awaiting = [...pending.values()].at(-1);
    if (awaiting == null) return;
    this.sink.trySetForTab(agentId, {
      tabId: SAND_AUTO_REVIEW_AWAITING_TAB_ID,
      reason: awaiting.reason,
      reasonCopy: awaiting.reasonCopy,
      since: this.now()
    });
  }
};
