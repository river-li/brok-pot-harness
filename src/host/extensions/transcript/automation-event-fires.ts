init_errors();
init_system_errno();
var EVENT_FIRE_DEBOUNCE_MS = 750;
var MAX_QUEUED_EVENT_FIRES_PER_AUTOMATION = 500;
var MAX_REPORTED_DROPPED_FIRES = 256;
function deliveryErrorTypeAndCode(error42) {
  let errorType = typeof error42;
  if (error42 instanceof Error) errorType = error42.constructor.name;
  const errorCode = findSystemErrno(error42);
  return {
    errorType,
    ...errorCode !== void 0 ? { errorCode } : {}
  };
}
function isTerminalPrWatchEvent(automation, event) {
  if (event.source === "github") {
    if (event.prNumber === void 0) return false;
    if (event.kind !== "pr-merged" && event.kind !== "pr-closed") return false;
    return triggerListeners(automation.trigger).some(
      (listener) => listener.type === "github" && listener.repo.toLowerCase() === event.repo.toLowerCase() && listener.pr === event.prNumber && (listener.events.includes(event.kind) || event.kind === "pr-closed" && listener.events.includes("pr-merged"))
    );
  }
  if (event.source === "origin" && event.kind === "pr-merged") {
    if (event.prNumber === void 0) return false;
    return triggerListeners(automation.trigger).some(
      (listener) => listener.type === "origin" && listener.repo.toLowerCase() === event.repo.toLowerCase() && listener.pr === event.prNumber && listener.events.includes(event.kind)
    );
  }
  return false;
}
var AutomationEventFires = class {
  constructor(tm) {
    this.tm = tm;
  }
  tm;
  pendingEventFireBatches = /* @__PURE__ */ new Map();
  reportedDroppedFireUuids = /* @__PURE__ */ new Set();
  enqueueEventAutomationFire({
    agentId,
    automation,
    event,
    runUuid,
    runAsSubagent
  }) {
    if (!this.tm.execution.canExecute || this.tm.disposed) {
      return Promise.resolve(void 0);
    }
    const runKey = runAsSubagent === true && runUuid !== void 0 ? `${agentId}:${automation.id}:${runUuid}` : `${agentId}:${automation.id}`;
    return new Promise((resolve29) => {
      let batch = this.pendingEventFireBatches.get(runKey);
      if (batch == null) {
        batch = {
          agentId,
          automation,
          items: [],
          debounce: null,
          flushing: false,
          flushImmediately: false
        };
        this.pendingEventFireBatches.set(runKey, batch);
      }
      batch.automation = automation;
      batch.items.push({
        event,
        ...runUuid !== void 0 ? { runUuid } : {},
        ...runAsSubagent !== void 0 ? { runAsSubagent } : {},
        resolve: resolve29
      });
      this.shedOverflowingEventFires(runKey);
      this.scheduleEventBatchFlush(runKey);
    });
  }
  shedOverflowingEventFires(runKey) {
    const batch = this.pendingEventFireBatches.get(runKey);
    if (batch == null) return;
    const excess = batch.items.length - MAX_QUEUED_EVENT_FIRES_PER_AUTOMATION;
    if (excess <= 0) return;
    for (const item of batch.items.splice(0, excess)) {
      this.reportFireDropped({
        agentId: batch.agentId,
        trigger: "event",
        reason: "event_batch_overflow",
        ...item.runUuid !== void 0 ? { runUuid: item.runUuid } : {}
      });
      item.resolve("error");
    }
  }
  scheduleEventBatchFlush(runKey) {
    const batch = this.pendingEventFireBatches.get(runKey);
    if (batch == null || batch.items.length === 0 || batch.flushing) {
      return;
    }
    if (batch.debounce != null) return;
    const debounce = new AbortController();
    batch.debounce = debounce;
    const waitMs = batch.flushImmediately ? 0 : EVENT_FIRE_DEBOUNCE_MS;
    batch.flushImmediately = false;
    void delay3(waitMs, debounce.signal).then(() => {
      batch.debounce = null;
      if (debounce.signal.aborted) return;
      void this.flushEventBatch(runKey);
    });
  }
  async flushEventBatch(runKey) {
    const batch = this.pendingEventFireBatches.get(runKey);
    if (batch == null || batch.items.length === 0 || batch.flushing || this.tm.disposed) {
      return;
    }
    batch.flushing = true;
    const items = batch.items.splice(0, MAX_EVENTS_IN_AUTOMATION_WAKE);
    const fireUuids = items.flatMap((item) => item.runUuid !== void 0 ? [item.runUuid] : []);
    let outcome;
    let terminalWatchDeleted = false;
    try {
      outcome = await this.tm.automationRuntime.fireAutomation({
        agentId: batch.agentId,
        automation: batch.automation,
        trigger: "event",
        events: items.map((item) => item.event),
        ...fireUuids.length > 0 ? { runUuid: fireUuids[0] } : {},
        coalescedRunUuids: fireUuids.slice(1),
        ...items[0]?.runAsSubagent !== void 0 ? { runAsSubagent: items[0].runAsSubagent } : {}
      });
      if (outcome !== void 0 && items.some((item) => isTerminalPrWatchEvent(batch.automation, item.event))) {
        await this.tm.automationRuntime.deleteAgentAutomation(batch.agentId, batch.automation.id);
        terminalWatchDeleted = true;
      }
    } catch (error42) {
      this.tm.hostLog(
        `[sand:automation] event wake dispatch failed for "${batch.automation.name}" (${batch.automation.id}): ` + errorMessage(error42),
        "error"
      );
    } finally {
      for (const item of items) item.resolve(outcome);
      batch.flushing = false;
      if (terminalWatchDeleted) {
        for (const item of batch.items.splice(0)) {
          this.reportFireDropped({
            agentId: batch.agentId,
            trigger: "event",
            reason: "automation_missing",
            ...item.runUuid !== void 0 ? { runUuid: item.runUuid } : {}
          });
          item.resolve(void 0);
        }
        this.pendingEventFireBatches.delete(runKey);
      } else if (batch.items.length > 0) {
        batch.flushImmediately = true;
        this.scheduleEventBatchFlush(runKey);
      } else {
        this.pendingEventFireBatches.delete(runKey);
      }
    }
  }
  reportFireDropped({
    agentId,
    trigger: trigger2,
    reason,
    scheduledForMs,
    runUuid,
    error: error42
  }) {
    if (runUuid !== void 0) {
      if (this.reportedDroppedFireUuids.has(runUuid)) return;
      this.reportedDroppedFireUuids.add(runUuid);
      while (this.reportedDroppedFireUuids.size > MAX_REPORTED_DROPPED_FIRES) {
        const oldest = this.reportedDroppedFireUuids.values().next().value;
        if (oldest === void 0) break;
        this.reportedDroppedFireUuids.delete(oldest);
      }
    }
    this.tm.telemetry.reportAutomationFireDropped({
      conversationId: agentId,
      trigger: trigger2,
      reason,
      ...runUuid !== void 0 ? { runUuid } : {},
      ...error42 !== void 0 ? deliveryErrorTypeAndCode(error42) : {},
      ...scheduledForMs != null ? {
        scheduledForMs,
        latenessMs: Math.max(0, Date.now() - scheduledForMs)
      } : {}
    });
  }
};
