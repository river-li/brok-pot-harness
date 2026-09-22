/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/auto-review/auto-review-service.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var AUTO_REVIEW_TEAM_POLICY_WAIT_MS = 1e4;
var SETTLED_APPROVAL_MEMORY = 256;
var AutoReviewService = class {
  constructor(deps) {
    this.deps = deps;
    this.now = deps.now ?? Date.now;
    this.awaitingBridge = new SandAutoReviewAwaitingBridge(deps.awaitingSink, this.now);
  }
  deps;
  now;
  pendingControllers = /* @__PURE__ */ new Map();
  settledApprovalIds = /* @__PURE__ */ new Set();
  awaitingBridge;
  bindRunner(options2) {
    const getAutoReviewModes = () => this.resolveModes();
    const autoReviewController = new SandAutoReviewController({
      agentId: options2.agentId,
      hostGeneration: this.deps.hostGeneration,
      approvalsResolvable: options2.approvalsResolvable,
      now: this.now,
      onDisplayRecheckFailed: (report) => this.deps.telemetry.reportAutoReviewDisplayRecheckFailed({
        conversationId: report.agentId
      })
    });
    let unsubscribe = () => {
    };
    unsubscribe = autoReviewController.subscribe((event) => {
      if (event.type === "created") {
        this.pendingControllers.set(autoReviewController, unsubscribe);
      }
      if (event.type === "resolved") this.rememberSettled(event.approval.id);
      this.awaitingBridge.handleEvent(event);
      this.handleApprovalEvent(options2.onUpdate, event);
      if (event.type !== "created" && autoReviewController.getPendingApprovals().length === 0) {
        this.pendingControllers.delete(autoReviewController);
      }
    });
    return {
      autoReviewController,
      autoReviewModes: getAutoReviewModes(),
      getAutoReviewModes,
      awaitAutoReviewPolicy: () => this.awaitTeamPolicyWhenOnlyTheLockCouldTurnReviewOn(),
      autoReviewClassifierExecutor: this.deps.createClassifierExecutor(this.deps.auth),
      getAutoReviewInstructions: () => this.deps.settings.getAutoReviewInstructions()
    };
  }
  async awaitTeamPolicyWhenOnlyTheLockCouldTurnReviewOn() {
    if (this.deps.settings.getAutoReviewInstructions().isEnabled) return;
    if (!this.deps.experiments.checkFeatureGate("sand_auto_review_admin_enforce")) return;
    await this.deps.teamPolicy.waitForPolicy(AUTO_REVIEW_TEAM_POLICY_WAIT_MS);
  }
  teamEnforcesAutoReview() {
    return this.deps.experiments.checkFeatureGate("sand_auto_review_admin_enforce") && this.deps.teamPolicy.isAutoReviewEnforced();
  }
  async resolveApproval({
    requestId: requestId2,
    resolution,
    agentId,
    entryId,
    approvalPlatform: approvalPlatform2,
    approvedCommand
  }) {
    const staleError = () => Object.assign(new Error(`${SAND_AUTO_REVIEW_STALE}: ${SAND_AUTO_REVIEW_STALE_MESSAGE}`), {
      failureCode: SAND_AUTO_REVIEW_STALE
    });
    if (this.ownerOf(requestId2)?.resolveApproval(requestId2, resolution, {
      ...approvalPlatform2 === void 0 ? {} : { approvalPlatform: approvalPlatform2 },
      ...approvedCommand === void 0 ? {} : { approvedCommand }
    }) != null) {
      return;
    }
    if (this.settledApprovalIds.has(requestId2)) return;
    if (await this.deps.transcript.settleStaleAutoReviewCard({ agentId, entryId, requestId: requestId2 })) {
      return;
    }
    throw staleError();
  }
  expirePendingApprovals() {
    for (const [controller] of [...this.pendingControllers]) {
      controller.expire("session_end");
    }
  }
  agentIdsWithPendingApprovals() {
    const ids = /* @__PURE__ */ new Set();
    for (const [controller] of this.pendingControllers) {
      const pending = controller.getPendingApprovals();
      if (pending.length === 0) continue;
      ids.add(controller.agentId);
      for (const approval of pending) ids.add(approval.agentId);
    }
    return [...ids];
  }
  stop() {
    const pending = [...this.pendingControllers];
    this.expirePendingApprovals();
    for (const [, unsubscribe] of pending) unsubscribe();
    this.pendingControllers.clear();
  }
  pendingAwaitingState(agentId) {
    return this.awaitingBridge.pendingAwaitingState(agentId);
  }
  async sweepStaleAwaitingBadges(listAgentIds, ifSinceBefore) {
    try {
      for (const agentId of await listAgentIds()) {
        this.deps.awaitingSink.clearForTab(agentId, SAND_AUTO_REVIEW_AWAITING_TAB_ID, {
          ifSinceBefore
        });
      }
    } catch {
    }
  }
  ownerOf(requestId2) {
    for (const [controller] of this.pendingControllers) {
      if (controller.getPendingApprovals().some((approval) => approval.id === requestId2)) {
        return controller;
      }
    }
    return void 0;
  }
  rememberSettled(approvalId) {
    this.settledApprovalIds.add(approvalId);
    if (this.settledApprovalIds.size <= SETTLED_APPROVAL_MEMORY) return;
    const oldest = this.settledApprovalIds.values().next();
    if (!oldest.done) this.settledApprovalIds.delete(oldest.value);
  }
  resolveModes() {
    return resolveSandAutoReviewModes({
      settingsEnabled: this.deps.settings.getAutoReviewInstructions().isEnabled || this.teamEnforcesAutoReview(),
      enforceEnabled: this.deps.experiments.checkFeatureGate("sand_auto_review"),
      localOverride: this.deps.localMode
    });
  }
  handleApprovalEvent(onUpdate, event) {
    this.deps.telemetry.reportAutoReviewApproval({
      eventType: event.type,
      conversationId: event.approval.agentId,
      approvalId: event.approval.id,
      surface: event.approval.surface,
      status: event.approval.status,
      ageMs: this.now() - event.approval.createdAtMs,
      ...event.approval.expiresAtMs !== void 0 ? { ttlMs: event.approval.expiresAtMs - event.approval.createdAtMs } : {},
      ...event.type === "expired" ? { cause: event.cause } : {}
    });
    if (event.type === "created") {
      onUpdate({
        type: "send-message",
        message: {
          type: "auto-review-approval",
          approval: {
            requestId: event.approval.id,
            surface: event.approval.surface,
            summary: event.approval.summary,
            ...event.approval.summaryCopy === void 0 ? {} : { summaryCopy: event.approval.summaryCopy },
            reason: event.approval.reason,
            ...event.approval.reasonCopy === void 0 ? {} : { reasonCopy: event.approval.reasonCopy },
            status: "pending",
            ...event.approval.command !== void 0 ? { command: event.approval.command } : {},
            ...event.approval.proposedRule !== void 0 ? { proposedRule: event.approval.proposedRule } : {}
          }
        },
        timestampMs: this.now()
      });
      return;
    }
    onUpdate({
      type: "auto-review-status",
      requestId: event.approval.id,
      status: event.type === "expired" || event.approval.status === "pending" ? "expired" : event.approval.status
    });
  }
};

