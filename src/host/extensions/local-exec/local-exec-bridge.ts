var FrameQueue = class {
  buffer = [];
  wake;
  closed = false;
  push(frame) {
    if (this.closed) return;
    this.buffer.push(frame);
    this.wake?.();
    this.wake = void 0;
  }
  close() {
    this.closed = true;
    this.wake?.();
    this.wake = void 0;
  }
  async *[Symbol.asyncIterator]() {
    for (; ; ) {
      if (this.buffer.length > 0) {
        yield this.buffer.shift();
        continue;
      }
      if (this.closed) return;
      await new Promise((resolve29) => {
        this.wake = resolve29;
      });
    }
  }
};
var SUPERVISED_RANK = 4;
var VARIANT_RANKS = { sand: 2, "sand-lab": 1 };
function localExecProviderRank(signals) {
  const supervised = signals.supervised === true ? SUPERVISED_RANK : 0;
  const variant = signals.variant === void 0 ? 0 : VARIANT_RANKS[signals.variant] ?? 0;
  return supervised + variant;
}
var TELEMETRY_VARIANTS = new Set(SAND_VARIANTS);
function boundedVariant(variant) {
  if (variant === void 0) return void 0;
  return TELEMETRY_VARIANTS.has(variant) ? variant : "unknown";
}
var SandLocalExecBridge = class {
  constructor(deps) {
    this.deps = deps;
    this.emptySince = deps.clock.now();
  }
  deps;
  providers = /* @__PURE__ */ new Set();
  byId = /* @__PURE__ */ new Map();
  pending = /* @__PURE__ */ new Map();
  everRegistered = false;
  emptySince;
  registerProvider(send) {
    const provider = {
      id: (0, import_node_crypto50.randomUUID)(),
      send,
      registeredAt: this.deps.clock.now(),
      lastSeenAt: this.deps.clock.now(),
      hasHeartbeat: false
    };
    this.providers.add(provider);
    this.byId.set(provider.id, provider);
    this.everRegistered = true;
    this.deps.report?.provider({
      phase: "registered",
      providerId: provider.id,
      providerCount: this.providers.size
    });
    try {
      send({ kind: "welcome", providerId: provider.id });
    } catch {
    }
    return () => {
      if (!this.providers.delete(provider)) return;
      this.byId.delete(provider.id);
      const now = this.deps.clock.now();
      if (this.providers.size === 0) this.emptySince = now;
      this.deps.report?.provider({
        phase: "detached",
        providerId: provider.id,
        providerCount: this.providers.size,
        ageMs: now - provider.registeredAt,
        hadHello: provider.info !== void 0,
        hasHeartbeat: provider.hasHeartbeat,
        wasLive: this.isLive(provider, now),
        emptied: this.providers.size === 0
      });
    };
  }
  hasProvider() {
    return this.providers.size > 0;
  }
  isComputerLive(computerId) {
    return this.resolveProvider(computerId) !== void 0;
  }
  assertComputerAvailable(computerId, gate, allowImplicitSelection = false) {
    return this.providerComputerId(this.requireProvider(computerId, gate, allowImplicitSelection));
  }
  checkLiveComputerForAsk(agentId) {
    if (this.resolveProvider(void 0) !== void 0) return true;
    this.reportRefused(this.providers.size === 0 ? "no_providers" : "stale_heartbeat", {
      site: "ask_gate",
      agentId
    });
    return false;
  }
  requireProvider(computerId, gate, allowImplicitSelection = false) {
    if (computerId === void 0 && !allowImplicitSelection && this.listComputers().length > 1) {
      this.reportRefused("computer_ambiguous", gate);
      throw new SandLocalExecError(SAND_MACHINE_ID_REQUIRED_MESSAGE);
    }
    const live = gate.site === "messages-op" ? this.liveProviders().filter((provider2) => provider2.messagesOp === true) : this.liveProviders();
    const provider = this.resolveProvider(computerId, live);
    if (provider !== void 0) return provider;
    if (this.providers.size === 0) {
      this.reportRefused("no_providers", gate);
      throw new SandLocalExecError(SAND_NO_LOCAL_MACHINE_MESSAGE);
    }
    if (computerId !== void 0 && !this.hasComputerId(computerId)) {
      this.reportRefused("computer_unknown", gate);
      throw new SandLocalExecError(SAND_NO_LOCAL_MACHINE_MESSAGE);
    }
    if (gate.site === "messages-op" && this.resolveProvider(computerId) !== void 0) {
      this.reportRefused("messages_unsupported", gate);
      throw new SandLocalExecError(sandMessagesUnsupportedMessage(this.routeLabel(computerId)));
    }
    this.reportRefused("stale_heartbeat", gate);
    throw new SandLocalExecError(sandComputerUnavailableMessage(this.routeLabel(computerId)));
  }
  reportRefused(cause, gate) {
    this.deps.report?.refused({
      cause,
      site: gate.site,
      ...gate.agentId !== void 0 ? { conversationId: gate.agentId } : {},
      providerCount: this.providers.size,
      liveProviderCount: this.liveProviders().length,
      everRegistered: this.everRegistered,
      ...cause === "no_providers" ? { emptyForMs: this.deps.clock.now() - this.emptySince } : {}
    });
  }
  providerComputerId(provider) {
    return provider.computerId ?? DEFAULT_SAND_COMPUTER_ID;
  }
  isLive(provider, now) {
    if (!provider.hasHeartbeat) return true;
    return now - provider.lastSeenAt <= SAND_LOCAL_EXEC_LIVENESS_WINDOW_MS;
  }
  liveProviders() {
    const now = this.deps.clock.now();
    return [...this.providers].filter((provider) => this.isLive(provider, now));
  }
  best(candidates) {
    let best;
    for (const provider of candidates) {
      if (best === void 0) {
        best = provider;
        continue;
      }
      const rank = localExecProviderRank(provider);
      const bestRank = localExecProviderRank(best);
      if (rank > bestRank || rank === bestRank && provider.lastSeenAt >= best.lastSeenAt) {
        best = provider;
      }
    }
    return best;
  }
  listComputers() {
    const now = this.deps.clock.now();
    const byComputerId = /* @__PURE__ */ new Map();
    for (const provider of this.providers) {
      const id = this.providerComputerId(provider);
      const existing = byComputerId.get(id);
      if (existing === void 0 || provider.lastSeenAt >= existing.lastSeenAt) {
        byComputerId.set(id, provider);
      }
    }
    return [...byComputerId.entries()].map(([id, provider]) => ({
      id,
      label: provider.label ?? "this computer",
      connected: this.isLive(provider, now)
    }));
  }
  activeComputer() {
    if (this.listComputers().length !== 1) return void 0;
    const provider = this.resolveProvider(void 0);
    if (provider === void 0) return void 0;
    return {
      id: this.providerComputerId(provider),
      label: provider.label ?? "this computer",
      connected: true
    };
  }
  hasComputerId(computerId) {
    for (const provider of this.providers) {
      if (this.providerComputerId(provider) === computerId) return true;
    }
    return false;
  }
  routeLabel(computerId) {
    if (computerId !== void 0) {
      for (const provider of this.providers) {
        if (this.providerComputerId(provider) === computerId) return provider.label;
      }
      return computerId;
    }
    return this.best([...this.providers])?.label;
  }
  resolveProvider(computerId, live = this.liveProviders()) {
    if (computerId === void 0) return this.best(live);
    return this.best(live.filter((provider) => this.providerComputerId(provider) === computerId));
  }
  getProviderInfo(computerId) {
    const fallback2 = computerId === void 0 ? [...this.providers].at(-1) : this.best(
      [...this.providers].filter(
        (provider) => this.providerComputerId(provider) === computerId
      )
    );
    return (this.resolveProvider(computerId) ?? fallback2)?.info;
  }
  submitResponses(batch) {
    const provider = this.providerForBatch(batch.providerId);
    for (const frame of batch.frames ?? []) {
      if (frame.kind === "hello") {
        if (provider !== void 0) {
          const rehello = provider.info !== void 0;
          provider.info = {
            localRoot: frame.localRoot,
            terminalsFolder: frame.terminalsFolder
          };
          if (frame.computerId !== void 0 && frame.computerId.length > 0) {
            provider.computerId = frame.computerId;
          }
          if (frame.label !== void 0 && frame.label.length > 0) {
            provider.label = frame.label;
          }
          if (frame.supervised !== void 0) {
            provider.supervised = frame.supervised;
          }
          if (frame.variant !== void 0 && frame.variant.length > 0) {
            provider.variant = frame.variant;
          }
          if (frame.capabilities?.messagesOp !== void 0) {
            provider.messagesOp = frame.capabilities.messagesOp;
          }
          if (frame.capabilities?.messagesOpGeneration !== void 0) {
            provider.messagesOpGeneration = frame.capabilities.messagesOpGeneration;
          }
          provider.lastSeenAt = this.deps.clock.now();
          this.deps.report?.provider({
            phase: "hello",
            providerId: provider.id,
            providerCount: this.providers.size,
            helloDelayMs: provider.lastSeenAt - provider.registeredAt,
            computerIdPresent: provider.computerId !== void 0,
            rehello,
            ...provider.supervised !== void 0 ? { supervised: provider.supervised } : {},
            ...boundedVariant(provider.variant) !== void 0 ? { variant: boundedVariant(provider.variant) } : {}
          });
        }
        continue;
      }
      if (frame.kind === "ping") {
        if (provider !== void 0) {
          provider.hasHeartbeat = true;
          provider.lastSeenAt = this.deps.clock.now();
          if (frame.supervised !== void 0) {
            provider.supervised = frame.supervised;
          }
        }
        continue;
      }
      const queue = this.pending.get(frame.requestId);
      if (queue === void 0) continue;
      queue.push(frame);
    }
  }
  providerForBatch(providerId) {
    if (providerId !== void 0) {
      const exact = this.byId.get(providerId);
      if (exact !== void 0) return exact;
    }
    return [...this.providers].at(-1);
  }
  retireApproval(approvalId) {
    for (const provider of this.providers) {
      try {
        provider.send({
          kind: "retire-approval",
          requestId: (0, import_node_crypto50.randomUUID)(),
          approvalId
        });
      } catch {
      }
    }
  }
  async *request(ctx, frame, computerId, options2) {
    const blocked = this.deps.blockedReason(options2?.permissionMachineId);
    if (blocked !== void 0) throw new SandLocalExecError(blocked);
    const provider = this.requireProvider(computerId, {
      site: frame.kind,
      agentId: ctx.get(sandLocalToolScopeKey)?.agentId
    });
    if (frame.kind === "messages-op" && requiredMessagesOpGeneration(frame.op) > (provider.messagesOpGeneration ?? 1)) {
      throw new SandLocalExecError(SAND_LOCAL_EXEC_UNSUPPORTED_FRAME_MESSAGE);
    }
    const requestId2 = (0, import_node_crypto50.randomUUID)();
    const queue = new FrameQueue();
    this.pending.set(requestId2, queue);
    const sendCancel = () => {
      try {
        provider.send({ kind: "cancel", requestId: requestId2 });
      } catch {
      }
    };
    const onAbort = () => {
      sendCancel();
      queue.close();
    };
    if (ctx.signal.aborted) onAbort();
    else ctx.signal.addEventListener("abort", onAbort, { once: true });
    const watchdogPolicy = frame.kind === "messages-op" ? createIdleWatchdogPolicy({
      name: "sand-local-exec-messages",
      idleMs: messagesOpIdleBudgetMs(frame.op),
      clock: this.deps.clock
    }) : this.deps.responseWatchdog;
    let timedOut = false;
    let watchdog;
    const armWatchdog = () => {
      if (options2?.watchResponse !== true) return;
      if (watchdog === void 0) {
        watchdog = watchdogPolicy.arm(() => {
          timedOut = true;
          sendCancel();
          queue.close();
        });
        return;
      }
      watchdog.kick();
    };
    try {
      provider.send({ requestId: requestId2, ...frame });
      armWatchdog();
      for await (const responseFrame of queue) {
        armWatchdog();
        yield responseFrame;
      }
      if (timedOut) {
        throw new SandLocalExecError(sandComputerTemporarilyUnreachableMessage(provider.label));
      }
    } finally {
      watchdog?.dispose();
      this.pending.delete(requestId2);
      queue.close();
      ctx.signal.removeEventListener("abort", onAbort);
      if (!ctx.signal.aborted) sendCancel();
    }
  }
};
