/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/transcript/run-scheduler.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_scheduling();
init_dist3();
function takeNextUserTask(pending) {
  if (pending.length === 0) return void 0;
  const preferred = pending.findIndex((item) => item.source !== "group-member");
  return pending.splice(preferred === -1 ? 0 : preferred, 1)[0];
}
var SandRunScheduler = class {
  constructor(options2, clock = realClock) {
    this.options = options2;
    this.clock = clock;
  }
  options;
  clock;
  queues = /* @__PURE__ */ new Map();
  disposed = false;
  enqueue(agentId, task, options2) {
    if (this.disposed) return Promise.resolve().then(options2.onCancelled);
    const queue = this.queueFor(agentId);
    let resolve29;
    let reject2;
    const promise2 = new Promise((res, rej) => {
      resolve29 = res;
      reject2 = rej;
    });
    const item = {
      lane: options2.lane,
      source: options2.source,
      enqueuedAtMs: this.clock.now(),
      ...options2.acceptedAtMs != null ? { acceptedAtMs: options2.acceptedAtMs } : {},
      ...options2.ackToken != null ? { ackToken: options2.ackToken } : {},
      ...options2.onCancelled != null ? { onCancelled: options2.onCancelled } : {},
      task,
      resolve: resolve29,
      reject: reject2,
      promise: promise2
    };
    if (item.lane === "user") {
      queue.pendingUser.push(item);
    } else if (item.lane === "agent") {
      queue.pendingAgent.push(item);
    } else {
      queue.pendingBackground.push(item);
    }
    let pendingAhead = queue.pendingUser.length + queue.pendingAgent.length + queue.pendingBackground.length - 1;
    if (item.lane === "user") {
      pendingAhead = queue.pendingUser.length - 1;
    } else if (item.lane === "agent") {
      pendingAhead = queue.pendingUser.length + queue.pendingAgent.length - 1;
    }
    this.options.telemetry.onAccepted({
      agentId,
      lane: item.lane,
      source: item.source,
      position: (queue.active != null ? 1 : 0) + pendingAhead,
      depthUser: queue.pendingUser.length,
      depthAgent: queue.pendingAgent.length,
      depthBackground: queue.pendingBackground.length,
      hasActive: queue.active != null
    });
    this.armWatchdog(agentId, queue);
    void Promise.resolve().then(() => this.pump(agentId));
    return promise2;
  }
  async drain(agentId) {
    const queue = this.queues.get(agentId);
    if (queue == null) return;
    const snapshot = [
      ...queue.active != null ? [queue.active.settled] : [],
      ...queue.zombies,
      ...queue.pendingUser.map((item) => item.promise),
      ...queue.pendingAgent.map((item) => item.promise),
      ...queue.pendingBackground.map((item) => item.promise)
    ];
    await Promise.allSettled(snapshot);
  }
  getDiagnostics() {
    const now = this.clock.now();
    const diagnostics = [];
    for (const [agentId, queue] of this.queues) {
      const depthUser = queue.pendingUser.length;
      const depthAgent = queue.pendingAgent.length;
      const depthBackground = queue.pendingBackground.length;
      const active = queue.active;
      if (depthUser === 0 && depthAgent === 0 && depthBackground === 0 && active == null) {
        continue;
      }
      const oldestUser = queue.pendingUser[0];
      diagnostics.push({
        agentId,
        depthUser,
        depthAgent,
        depthBackground,
        depthTotal: depthUser + depthAgent + depthBackground + (active != null ? 1 : 0),
        ...oldestUser != null ? { oldestPendingUserAgeMs: now - oldestUser.enqueuedAtMs } : {},
        ...active != null ? {
          active: {
            lane: active.item.lane,
            source: active.item.source,
            runtimeMs: now - active.startedAtMs,
            phase: active.phase
          }
        } : {}
      });
    }
    return diagnostics;
  }
  getActiveLane(agentId) {
    return this.queues.get(agentId)?.active?.item.lane;
  }
  dispose() {
    this.disposed = true;
    for (const queue of this.queues.values()) {
      queue.watchdogTimer?.dispose();
      queue.graceTimer?.dispose();
      queue.watchdogTimer = void 0;
      queue.graceTimer = void 0;
      for (const item of [
        ...queue.pendingUser.splice(0),
        ...queue.pendingAgent.splice(0),
        ...queue.pendingBackground.splice(0)
      ]) {
        void Promise.resolve().then(item.onCancelled).then(item.resolve, item.reject);
      }
    }
  }
  queueFor(agentId) {
    const existing = this.queues.get(agentId);
    if (existing != null) return existing;
    const created = {
      pendingUser: [],
      pendingAgent: [],
      pendingBackground: [],
      active: null,
      generationCounter: 0,
      zombies: /* @__PURE__ */ new Set()
    };
    this.queues.set(agentId, created);
    return created;
  }
  pump(agentId) {
    if (this.disposed) return;
    const queue = this.queues.get(agentId);
    if (queue == null || queue.active != null) return;
    let next;
    if (queue.pendingUser.length > 0) {
      next = takeNextUserTask(queue.pendingUser);
    } else if (queue.pendingAgent.length > 0) {
      next = queue.pendingAgent.shift();
    } else {
      next = queue.pendingBackground.shift();
    }
    if (next == null) {
      this.disarmWatchdog(queue);
      return;
    }
    const generation = ++queue.generationCounter;
    let markSettled;
    const settled = new Promise((resolve29) => {
      markSettled = resolve29;
    });
    const active = {
      item: next,
      startedAtMs: this.clock.now(),
      generation,
      settled,
      phase: "running"
    };
    queue.active = active;
    const jumpedBackground = next.lane === "background" ? 0 : queue.pendingBackground.length;
    this.options.telemetry.onDequeued({
      agentId,
      lane: next.lane,
      source: next.source,
      queueWaitMs: active.startedAtMs - next.enqueuedAtMs,
      ...next.acceptedAtMs != null ? { acceptedToRunMs: active.startedAtMs - next.acceptedAtMs } : {},
      jumpedBackground,
      depthUser: queue.pendingUser.length,
      depthAgent: queue.pendingAgent.length,
      depthBackground: queue.pendingBackground.length
    });
    this.disarmWatchdog(queue);
    this.armWatchdog(agentId, queue);
    this.options.onRunStart?.(agentId);
    let taskPromise;
    try {
      taskPromise = next.task();
    } catch (error42) {
      taskPromise = Promise.reject(error42);
    }
    void taskPromise.then(
      () => {
        this.onTaskSettled(agentId, queue, active, void 0);
        markSettled();
      },
      (error42) => {
        this.onTaskSettled(agentId, queue, active, { error: error42 });
        markSettled();
      }
    );
  }
  onTaskSettled(agentId, queue, active, failure2) {
    if (failure2 === void 0) {
      active.item.resolve();
    } else {
      active.item.reject(failure2.error);
    }
    if (queue.active?.generation !== active.generation) {
      this.options.telemetry.onWatchdog({
        agentId,
        stage: "late_settle",
        activeLane: active.item.lane,
        activeSource: active.item.source,
        activeRuntimeMs: this.clock.now() - active.startedAtMs
      });
      return;
    }
    queue.active = null;
    this.disarmWatchdog(queue);
    this.pump(agentId);
  }
  waitedBehindActiveMs(queue) {
    const head = queue.pendingUser[0];
    const active = queue.active;
    if (head == null || active == null) return null;
    return this.clock.now() - Math.max(head.enqueuedAtMs, active.startedAtMs);
  }
  armWatchdog(agentId, queue) {
    if (this.disposed) return;
    if (queue.watchdogTimer != null || queue.graceTimer != null) return;
    const waitedMs = this.waitedBehindActiveMs(queue);
    if (waitedMs == null) return;
    const remaining = Math.max(0, this.options.watchdogMs - waitedMs);
    queue.watchdogTimer = this.clock.schedule(remaining, () => {
      queue.watchdogTimer = void 0;
      this.onWatchdogFired(agentId, queue);
    });
  }
  disarmWatchdog(queue) {
    queue.watchdogTimer?.dispose();
    queue.watchdogTimer = void 0;
    queue.graceTimer?.dispose();
    queue.graceTimer = void 0;
  }
  escapeReapedRun(agentId) {
    const queue = this.queues.get(agentId);
    const active = queue?.active;
    if (queue == null || active == null) return void 0;
    this.disarmWatchdog(queue);
    this.escapeWedgedRun(agentId, queue, active);
    return active.settled;
  }
  onWatchdogFired(agentId, queue) {
    if (this.disposed) return;
    const active = queue.active;
    const head = queue.pendingUser[0];
    if (active == null || head == null) return;
    const waitedBehindActiveMs = this.waitedBehindActiveMs(queue);
    if (waitedBehindActiveMs == null) return;
    if (waitedBehindActiveMs < this.options.watchdogMs) {
      this.armWatchdog(agentId, queue);
      return;
    }
    const waitingUserAgeMs = this.clock.now() - head.enqueuedAtMs;
    const interrupted = this.tryInterruptWedgedRun(agentId);
    active.phase = "interrupted";
    this.options.telemetry.onWatchdog({
      agentId,
      stage: "trip",
      activeLane: active.item.lane,
      activeSource: active.item.source,
      activeRuntimeMs: this.clock.now() - active.startedAtMs,
      waitingUserAgeMs,
      interrupted
    });
    queue.graceTimer = this.clock.schedule(this.options.watchdogGraceMs, () => {
      queue.graceTimer = void 0;
      this.escapeWedgedRun(agentId, queue, active);
    });
  }
  tryInterruptWedgedRun(agentId) {
    const attempt = attemptSync(() => this.options.interruptWedgedRun(agentId));
    return attempt.ok ? attempt.value : false;
  }
  escapeWedgedRun(agentId, queue, active) {
    if (this.disposed) return;
    if (queue.active?.generation !== active.generation) return;
    const waitingHead = queue.pendingUser[0];
    this.options.telemetry.onWatchdog({
      agentId,
      stage: "escape",
      activeLane: active.item.lane,
      activeSource: active.item.source,
      activeRuntimeMs: this.clock.now() - active.startedAtMs,
      ...waitingHead != null ? { waitingUserAgeMs: this.clock.now() - waitingHead.enqueuedAtMs } : {},
      ...active.item.ackToken != null ? { ackToken: active.item.ackToken } : {}
    });
    active.item.resolve();
    queue.zombies.add(active.settled);
    void active.settled.then(() => queue.zombies.delete(active.settled));
    queue.active = null;
    this.pump(agentId);
  }
};

