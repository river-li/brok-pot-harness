function eventBase(lifecycle) {
  return {
    summaryLifecycleId: lifecycle.summaryLifecycleId,
    summarizationModelId: lifecycle.summarizationModelId,
    mainModelId: lifecycle.mainModelId,
    summarizerType: lifecycle.summarizerType
  };
}
function liveLifecycle(source) {
  if ("status" in source) {
    return source;
  }
  return source.kind === "live_generation" ? source.lifecycle : void 0;
}
function createLiveSummaryLifecycle(options2) {
  return {
    summaryLifecycleId: crypto.randomUUID(),
    summarizationModelId: options2.summarizationModelId,
    mainModelId: options2.mainModelId,
    summarizerType: options2.summarizerType,
    emittedDeferrals: /* @__PURE__ */ new Set(),
    status: "created"
  };
}
function emitSummaryLifecycleStarted(ctx, source) {
  const lifecycle = liveLifecycle(source);
  if (lifecycle === void 0 || lifecycle.status !== "created") {
    return;
  }
  lifecycle.status = "started";
  getAgentEventTracker(ctx).trackSummaryLifecycle(ctx, {
    ...eventBase(lifecycle),
    phase: "started"
  });
}
function emitSummaryLifecycleCompleted(ctx, source, outcome) {
  const lifecycle = liveLifecycle(source);
  if (lifecycle === void 0 || lifecycle.status !== "started") {
    return;
  }
  lifecycle.status = "completed";
  getAgentEventTracker(ctx).trackSummaryLifecycle(ctx, {
    ...eventBase(lifecycle),
    phase: "completed",
    outcome
  });
}
function emitSummaryLifecycleDeferred(ctx, source, reason) {
  const lifecycle = liveLifecycle(source);
  if (lifecycle === void 0 || lifecycle.status === "terminal" || lifecycle.emittedDeferrals.has(reason)) {
    return;
  }
  lifecycle.emittedDeferrals.add(reason);
  getAgentEventTracker(ctx).trackSummaryLifecycle(ctx, {
    ...eventBase(lifecycle),
    phase: "deferred",
    reason
  });
}
function emitSummaryLifecycleTerminal(ctx, source, event) {
  const lifecycle = liveLifecycle(source);
  if (lifecycle === void 0 || lifecycle.status === "terminal") {
    return;
  }
  lifecycle.status = "terminal";
  getAgentEventTracker(ctx).trackSummaryLifecycle(ctx, {
    ...eventBase(lifecycle),
    ...event
  });
}
function emitSummaryLifecycleAbandoned(ctx, source, reason) {
  emitSummaryLifecycleTerminal(ctx, source, { phase: "abandoned", reason });
}
function emitSummaryLifecyclePersisted(ctx, source) {
  emitSummaryLifecycleTerminal(ctx, source, { phase: "persisted" });
}
