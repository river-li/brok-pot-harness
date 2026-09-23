var import_node_crypto88 = require("node:crypto");
init_scheduling();
function failure(name17, message) {
  return { ok: false, error: { name: name17, message } };
}
function parseDesktopStage(frame) {
  if (frame.stage === "grant" && (frame.outcome === "ok" || frame.outcome === "declined" || frame.outcome === "failed")) {
    return { stage: "grant", outcome: frame.outcome };
  }
  if (frame.stage === "sign" && (frame.outcome === "ok" || frame.outcome === "failed")) {
    return { stage: "sign", outcome: frame.outcome };
  }
  return void 0;
}
function isLive2(provider, now) {
  return !provider.hasHeartbeat || now - provider.lastSeenAt <= SAND_WEBAUTHN_LIVENESS_WINDOW_MS;
}
function stageCause(stage) {
  if (stage.outcome === "declined") {
    return "consent_declined";
  }
  if (stage.outcome === "failed") {
    return stage.stage === "sign" ? "sign_failed" : "desktop_failed";
  }
  return void 0;
}
var SandWebAuthnBridge = class {
  constructor(deps) {
    this.deps = deps;
  }
  deps;
  providers = /* @__PURE__ */ new Set();
  providersById = /* @__PURE__ */ new Map();
  pending = /* @__PURE__ */ new Map();
  registerProvider(send) {
    const registeredAt = this.deps.clock.now();
    const provider = {
      id: (0, import_node_crypto88.randomUUID)(),
      send,
      registeredAt,
      lastSeenAt: registeredAt,
      hasHeartbeat: false,
      hadHello: false
    };
    this.providers.add(provider);
    this.providersById.set(provider.id, provider);
    this.deps.report.provider({
      phase: "registered",
      providerId: provider.id,
      providerCount: this.providers.size
    });
    send({ kind: "welcome", providerId: provider.id });
    return () => {
      if (!this.providers.delete(provider)) return;
      this.providersById.delete(provider.id);
      for (const [requestId2, pending] of [...this.pending]) {
        if (pending.providerId === provider.id) {
          this.settle(requestId2, {
            ok: false,
            name: "NotAllowedError",
            message: SAND_WEBAUTHN_MACHINE_UNAVAILABLE_MESSAGE
          });
        }
      }
      const detachedAt = this.deps.clock.now();
      this.deps.report.provider({
        phase: "detached",
        providerId: provider.id,
        providerCount: this.providers.size,
        ageMs: detachedAt - provider.registeredAt,
        hadHello: provider.hadHello,
        hasHeartbeat: provider.hasHeartbeat,
        wasLive: isLive2(provider, detachedAt),
        emptied: this.providers.size === 0
      });
    };
  }
  submitResponses(batch) {
    const provider = batch.providerId === void 0 ? void 0 : this.providersById.get(batch.providerId);
    if (provider !== void 0) {
      provider.lastSeenAt = this.deps.clock.now();
    }
    for (const frame of batch.frames) {
      switch (frame.kind) {
        case "hello":
          if (provider !== void 0) {
            provider.computerId = frame.computerId;
            provider.label = frame.label;
            if (!provider.hadHello) {
              provider.hadHello = true;
              this.deps.report.provider({
                phase: "hello",
                providerId: provider.id,
                providerCount: this.providers.size,
                helloDelayMs: this.deps.clock.now() - provider.registeredAt,
                computerIdPresent: frame.computerId !== void 0
              });
            }
          }
          break;
        case "ping":
          if (provider !== void 0) {
            provider.hasHeartbeat = true;
          }
          break;
        case "stage": {
          const pending = this.pending.get(frame.requestId);
          const stage = parseDesktopStage(frame);
          if (pending === void 0 || stage === void 0) {
            break;
          }
          pending.lastStage = stage;
          this.emit(pending.funnel, {
            stage: stage.stage,
            outcome: stage.outcome,
            cause: stageCause(stage)
          });
          break;
        }
        case "result":
          this.settle(frame.requestId, {
            ok: true,
            credentialJson: frame.credentialJson
          });
          break;
        case "error":
          this.settle(frame.requestId, {
            ok: false,
            name: frame.name,
            message: frame.message,
            ...frame.code === void 0 ? {} : { code: frame.code }
          });
          break;
      }
    }
  }
  async requestCeremony(ceremony) {
    const funnel = {
      requestId: (0, import_node_crypto88.randomUUID)(),
      originClass: sandWebAuthnOriginClass(ceremony.origin),
      ceremonyKind: ceremony.kind === "create" ? "create" : "get",
      startedAt: this.deps.clock.monotonicNow()
    };
    const provider = this.selectProvider();
    if (provider === void 0) {
      const cause = this.providers.size === 0 ? "no_provider" : "provider_stale";
      this.emit(funnel, { stage: "request", outcome: "failed", cause, ...this.providerCounts() });
      this.emit(funnel, { stage: "complete", outcome: "failed", cause });
      return failure(
        "NotAllowedError",
        this.providers.size === 0 ? SAND_NO_WEBAUTHN_MACHINE_MESSAGE : SAND_WEBAUTHN_MACHINE_UNAVAILABLE_MESSAGE
      );
    }
    let settle;
    const settled = new Promise((resolve29) => {
      settle = resolve29;
    });
    this.pending.set(funnel.requestId, { settle, funnel, providerId: provider.id });
    try {
      provider.send({ kind: "ceremony", requestId: funnel.requestId, ceremony });
    } catch (error42) {
      this.pending.delete(funnel.requestId);
      this.emit(funnel, {
        stage: "request",
        outcome: "failed",
        cause: "dispatch_failed",
        ...this.providerCounts()
      });
      this.emit(funnel, { stage: "complete", outcome: "failed", cause: "dispatch_failed" });
      throw error42;
    }
    this.emit(funnel, { stage: "request", outcome: "ok", ...this.providerCounts() });
    try {
      const settlement = await this.deps.ceremonyDeadline.run(() => settled);
      return settlement.ok ? { ok: true, credentialJson: settlement.credentialJson } : failure(settlement.name, settlement.message);
    } catch (error42) {
      if (error42 instanceof DeadlineExceededError) {
        if (this.pending.has(funnel.requestId)) {
          this.emit(funnel, { stage: "complete", outcome: "timeout", cause: "timeout" });
        }
        provider.send({ kind: "cancel", requestId: funnel.requestId });
        return failure(
          "NotAllowedError",
          "The security key ceremony timed out before it was completed."
        );
      }
      throw error42;
    } finally {
      this.pending.delete(funnel.requestId);
    }
  }
  settle(requestId2, settlement) {
    const pending = this.pending.get(requestId2);
    if (pending === void 0) {
      return;
    }
    this.pending.delete(requestId2);
    if (settlement.ok) {
      this.emit(pending.funnel, { stage: "complete", outcome: "ok" });
    } else {
      const lastStage = pending.lastStage;
      this.emit(pending.funnel, {
        stage: "complete",
        outcome: "failed",
        cause: (lastStage !== void 0 ? stageCause(lastStage) : void 0) ?? "desktop_failed",
        rawDomErrorName: settlement.name,
        ...settlement.code === void 0 ? {} : { rawSignErrorClass: settlement.code }
      });
    }
    pending.settle(settlement);
  }
  emit(funnel, report) {
    this.deps.report.ceremony({
      ...report,
      requestId: funnel.requestId,
      originClass: funnel.originClass,
      ceremonyKind: funnel.ceremonyKind,
      elapsedMs: this.deps.clock.monotonicNow() - funnel.startedAt
    });
  }
  providerCounts() {
    const now = this.deps.clock.now();
    let live = 0;
    for (const provider of this.providers) {
      if (isLive2(provider, now)) {
        live += 1;
      }
    }
    return { providerCount: this.providers.size, liveProviderCount: live };
  }
  selectProvider() {
    const now = this.deps.clock.now();
    let best;
    for (const provider of this.providers) {
      if (!isLive2(provider, now)) {
        continue;
      }
      if (best === void 0 || provider.lastSeenAt > best.lastSeenAt) {
        best = provider;
      }
    }
    return best;
  }
};
