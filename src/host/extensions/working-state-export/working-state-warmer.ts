init_errors();
var WorkingStateWarmOperationTimeoutError = class extends Error {
  name = "WorkingStateWarmOperationTimeoutError";
};
var WorkingStateWarmCancelledError = class extends Error {
  name = "WorkingStateWarmCancelledError";
};
var WorkingStateWarmer = class {
  constructor(deps) {
    this.deps = deps;
    this.drainSoon = deps.debounce.wrap(() => {
      this.drainScheduled = false;
      void this.drain();
    });
  }
  deps;
  pending = /* @__PURE__ */ new Set();
  warmed = /* @__PURE__ */ new Set();
  drainSoon;
  activeDrain;
  activeAgentId;
  backfill;
  populationAgents;
  cancelActiveWarm;
  drainScheduled = false;
  disposed = false;
  schedule(agentId) {
    this.warmed.delete(agentId);
    if (!this.enqueue(agentId, true)) return;
    this.startBackfill();
  }
  forgetAgent(agentId) {
    this.pending.delete(agentId);
    this.warmed.delete(agentId);
  }
  async dispose() {
    this.disposed = true;
    this.pending.clear();
    this.drainScheduled = false;
    this.drainSoon.dispose();
    this.cancelActiveWarm?.(new WorkingStateWarmCancelledError());
    await Promise.all([this.activeDrain, this.backfill]);
  }
  drain() {
    if (this.disposed) return Promise.resolve();
    if (this.activeDrain !== void 0) return this.activeDrain;
    if (this.drainScheduled) {
      this.drainScheduled = false;
    }
    const active = this.drainPending().finally(() => {
      if (this.activeDrain === active) this.activeDrain = void 0;
      this.scheduleDrain();
    });
    this.activeDrain = active;
    return active;
  }
  async drainPending() {
    const batch = [...this.pending];
    for (const agentId of batch) {
      this.pending.delete(agentId);
      if (this.disposed) return;
      if (!this.deps.isEligible(agentId, false)) continue;
      this.activeAgentId = agentId;
      try {
        const outcome = await this.runWarm(agentId);
        if (outcome.outcome === "warmed") this.warmed.add(agentId);
      } catch (error42) {
        if (!this.disposed) {
          this.deps.log(`[sand:working-state-warm] scheduler failed (${errorLogTag(error42)})`);
        }
        if (error42 instanceof WorkingStateWarmOperationTimeoutError) {
          return;
        }
      } finally {
        if (this.activeAgentId === agentId) this.activeAgentId = void 0;
      }
    }
  }
  enqueue(agentId, logExposure) {
    if (this.disposed || !this.deps.isEligible(agentId, logExposure)) return false;
    this.pending.add(agentId);
    this.scheduleDrain();
    return true;
  }
  startBackfill() {
    if (this.disposed || this.backfill !== void 0) return;
    const backfill = this.deps.listAgentPopulation().then(({ idleAgentIds, totalAgents }) => {
      if (this.disposed) return;
      this.populationAgents = totalAgents;
      for (const agentId of idleAgentIds) {
        if (agentId === this.activeAgentId || this.pending.has(agentId) || this.warmed.has(agentId)) {
          continue;
        }
        this.enqueue(agentId, false);
      }
    }).catch((error42) => {
      if (!this.disposed) {
        this.deps.log(
          `[sand:working-state-warm] backfill listing failed (${errorLogTag(error42)})`
        );
      }
    }).finally(() => {
      if (this.backfill === backfill) this.backfill = void 0;
    });
    this.backfill = backfill;
  }
  scheduleDrain() {
    if (this.disposed || this.activeDrain !== void 0 || this.drainScheduled || this.pending.size === 0) {
      return;
    }
    this.drainScheduled = true;
    this.drainSoon();
  }
  async runWarm(agentId) {
    const controller = new AbortController();
    let rejectStopped = () => {
    };
    const stopped2 = new Promise((_resolve, reject2) => {
      rejectStopped = reject2;
    });
    const stop = (reason) => {
      if (controller.signal.aborted) return;
      controller.abort(reason);
      rejectStopped(reason);
    };
    this.cancelActiveWarm = stop;
    const timeout2 = this.deps.operationTimeout.arm(() => {
      stop(new WorkingStateWarmOperationTimeoutError());
    });
    const config2 = this.deps.config();
    try {
      return await Promise.race([
        this.deps.warmAgent(agentId, config2.limits, {
          signal: controller.signal,
          onProgress: () => timeout2.kick(),
          ...this.populationAgents !== void 0 ? { populationAgents: this.populationAgents } : {},
          putConcurrency: config2.putConcurrency
        }),
        stopped2
      ]);
    } finally {
      timeout2.dispose();
      if (this.cancelActiveWarm === stop) this.cancelActiveWarm = void 0;
    }
  }
};
