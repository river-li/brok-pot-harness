var SandTriggerHub = class {
  constructor(deps) {
    this.deps = deps;
    for (const source of deps.sources) {
      this.sources.set(source.kind, source);
    }
  }
  deps;
  sources = /* @__PURE__ */ new Map();
  startedKinds = /* @__PURE__ */ new Set();
  timer;
  reconcileChain = Promise.resolve();
  pendingPasses = 0;
  isStopped = false;
  start() {
    if (this.timer != null) return;
    this.isStopped = false;
    this.timer = this.deps.polling.start(async () => {
      try {
        if (this.pendingPasses === 0) await this.reconcile();
      } catch {
      }
    });
  }
  async stop() {
    this.isStopped = true;
    this.timer?.dispose();
    this.timer = void 0;
    await this.reconcileChain;
    const started2 = [...this.startedKinds];
    this.startedKinds.clear();
    await Promise.all(
      started2.map(
        (kind) => this.sources.get(kind)?.stop().catch(() => {
        })
      )
    );
  }
  async reconcileNow() {
    await this.reconcile();
  }
  getSourceStatuses() {
    const statuses = /* @__PURE__ */ new Map();
    for (const [kind, source] of this.sources) {
      statuses.set(kind, source.getStatus());
    }
    return statuses;
  }
  async desiredListenersByKind() {
    const byKind = /* @__PURE__ */ new Map();
    for (const { agentId, automation } of await this.deps.listAutomations()) {
      if (!automation.isEnabled) continue;
      if (!(this.deps.shouldScheduleLocally?.(agentId, automation) ?? true)) continue;
      for (const listener of triggerListeners(automation.trigger)) {
        const bucket = byKind.get(listener.type) ?? [];
        bucket.push(listener);
        byKind.set(listener.type, bucket);
      }
    }
    return byKind;
  }
  reconcile() {
    this.pendingPasses += 1;
    const pass = this.reconcileChain.then(() => this.reconcilePass());
    this.reconcileChain = pass.catch(() => {
    }).finally(() => {
      this.pendingPasses -= 1;
    });
    return pass;
  }
  async reconcilePass() {
    if (this.isStopped) return;
    this.deps.onReconcile?.();
    const desired = await this.deps.isReady() ? await this.desiredListenersByKind() : /* @__PURE__ */ new Map();
    if (this.isStopped) return;
    for (const [kind, source] of this.sources) {
      const listeners2 = desired.get(kind) ?? [];
      if (listeners2.length > 0) {
        source.setListeners(listeners2);
        if (!this.startedKinds.has(kind)) {
          this.startedKinds.add(kind);
          try {
            await source.start((event) => this.acceptEvent(event));
          } catch {
            this.startedKinds.delete(kind);
          }
        }
      } else if (this.startedKinds.has(kind)) {
        this.startedKinds.delete(kind);
        await source.stop().catch(() => {
        });
      }
    }
  }
  acceptEvent(event) {
    if (this.isStopped) return false;
    void this.handleEvent(event);
    return true;
  }
  async handleEvent(event) {
    if (this.isStopped) return;
    if (!await this.deps.isReady()) return;
    let scheduled;
    try {
      scheduled = await this.deps.listAutomations();
    } catch {
      return;
    }
    for (const { agentId, automation } of scheduled) {
      if (!automation.isEnabled) continue;
      let originAllowlistMismatch = false;
      const matches = triggerMatchesEvent(automation.trigger, event, {
        onOriginAllowlistMismatch: () => {
          originAllowlistMismatch = true;
        }
      });
      if (!matches) {
        if (originAllowlistMismatch) {
          this.deps.log?.(
            "[sand:automations] Origin listener allowlist rejected an event because no canonical actor identity matched"
          );
        }
        continue;
      }
      try {
        if (!(this.deps.shouldScheduleLocally?.(agentId, automation, event) ?? true)) continue;
        await this.deps.fire(agentId, automation, event);
      } catch {
      }
    }
  }
};
