/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/cookie-origin-approval/cookie-origin-approval-bridge.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_node_crypto44 = require("node:crypto");
init_scheduling();
function isLive(provider, now) {
  return !provider.hasHeartbeat || now - provider.lastSeenAt <= SAND_COOKIE_ORIGIN_APPROVAL_LIVENESS_WINDOW_MS;
}
var SandCookieOriginApprovalBridge = class {
  constructor(deps) {
    this.deps = deps;
    this.askTtl = createExpiryPolicy({
      name: "sand-cookie-origin-approval-ask-ttl",
      ttlMs: SAND_COOKIE_ORIGIN_APPROVAL_ASK_TTL_MS,
      clock: deps.clock
    });
  }
  deps;
  providers = /* @__PURE__ */ new Set();
  providersById = /* @__PURE__ */ new Map();
  pending = /* @__PURE__ */ new Map();
  settledByRequestId = /* @__PURE__ */ new Map();
  cancelledByRequestId = /* @__PURE__ */ new Map();
  askTtl;
  hasPendingRequest(requestId2) {
    return this.pending.has(requestId2);
  }
  registerProvider(send) {
    const provider = {
      id: (0, import_node_crypto44.randomUUID)(),
      send,
      lastSeenAt: this.deps.clock.now(),
      hasHeartbeat: false
    };
    this.providers.add(provider);
    this.providersById.set(provider.id, provider);
    send({ kind: "welcome", providerId: provider.id });
    for (const [requestId2, pending] of [...this.pending]) {
      if (pending.providerId === null) this.represent(requestId2, pending, provider);
    }
    return () => {
      this.dropProvider(provider);
    };
  }
  dropProvider(provider) {
    this.providers.delete(provider);
    this.providersById.delete(provider.id);
    for (const [requestId2, pending] of [...this.pending]) {
      if (pending.providerId === provider.id) this.park(requestId2, pending);
    }
  }
  represent(requestId2, pending, provider) {
    pending.providerId = provider.id;
    try {
      provider.send({
        kind: "request",
        requestId: requestId2,
        origins: pending.origins.map(cookieOriginRequestEntryToWire),
        ...pending.agentId === void 0 ? {} : { agentId: pending.agentId }
      });
    } catch {
      this.dropProvider(provider);
    }
  }
  park(requestId2, pending) {
    const next = this.selectProvider();
    if (next !== void 0) {
      this.represent(requestId2, pending, next);
      return;
    }
    pending.providerId = null;
  }
  submitResponses(batch) {
    const provider = batch.providerId === void 0 ? void 0 : this.providersById.get(batch.providerId);
    if (provider !== void 0) {
      provider.lastSeenAt = this.deps.clock.now();
    }
    for (const frame of batch.frames) {
      switch (frame.kind) {
        case "hello":
          break;
        case "ping":
          if (provider !== void 0) {
            provider.hasHeartbeat = true;
          }
          break;
        case "listed":
          this.settle(frame.requestId, { kind: "listed", items: frame.items });
          break;
        case "resolved":
          this.settle(frame.requestId, {
            kind: "resolved",
            decision: frame.decision,
            grants: frame.grants,
            cookies: frame.cookies,
            ...frame.auto === void 0 ? {} : { auto: frame.auto },
            ...frame.items === void 0 ? {} : { items: frame.items }
          });
          break;
        case "failed":
          this.settle(frame.requestId, {
            kind: "failed",
            stage: frame.stage,
            errorClass: frame.errorClass,
            decision: frame.decision,
            grants: frame.grants,
            ...frame.auto === void 0 ? {} : { auto: frame.auto },
            ...frame.items === void 0 ? {} : { items: frame.items }
          });
          break;
        case "refused":
          this.settle(frame.requestId, {
            kind: "refused",
            message: frame.message,
            ...frame.reason === void 0 ? {} : { reason: frame.reason }
          });
          break;
      }
    }
  }
  begin(args) {
    const { requestId: requestId2 } = args;
    if (this.cancelledByRequestId.has(requestId2)) {
      return {
        kind: "refused",
        message: SAND_COOKIE_ORIGIN_APPROVAL_ABORTED_MESSAGE,
        reason: "aborted"
      };
    }
    if (this.pending.has(requestId2) || this.settledByRequestId.has(requestId2)) {
      return { kind: "started" };
    }
    const provider = this.selectProvider();
    if (provider === void 0) {
      return this.providers.size === 0 ? {
        kind: "refused",
        message: SAND_NO_COOKIE_ORIGIN_APPROVAL_MACHINE_MESSAGE,
        reason: "no-machine"
      } : {
        kind: "refused",
        message: SAND_COOKIE_ORIGIN_APPROVAL_MACHINE_UNAVAILABLE_MESSAGE,
        reason: "machine-stale"
      };
    }
    this.pending.set(requestId2, {
      waiters: /* @__PURE__ */ new Set(),
      origins: [...args.origins],
      ...args.agentId === void 0 ? {} : { agentId: args.agentId },
      ttl: this.askTtl.arm(requestId2, () => {
        this.cancelAndRefuse(requestId2, SAND_COOKIE_ORIGIN_APPROVAL_EXPIRED_MESSAGE, "expired");
      }),
      providerId: provider.id
    });
    try {
      provider.send({
        kind: "request",
        requestId: requestId2,
        origins: args.origins.map(cookieOriginRequestEntryToWire),
        ...args.agentId === void 0 ? {} : { agentId: args.agentId }
      });
    } catch {
      this.dropProvider(provider);
    }
    return { kind: "started" };
  }
  awaitOutcome(requestId2, waitMs) {
    const boundedWaitMs = Number.isFinite(waitMs) ? Math.min(Math.max(waitMs, 0), SAND_COOKIE_ORIGIN_APPROVAL_ASK_TTL_MS) : 0;
    const buffered3 = this.takeSettled(requestId2);
    if (buffered3 !== void 0) return Promise.resolve(buffered3);
    const pending = this.pending.get(requestId2);
    if (pending === void 0) {
      return Promise.resolve(
        this.cancelledByRequestId.has(requestId2) ? {
          kind: "refused",
          message: SAND_COOKIE_ORIGIN_APPROVAL_ABORTED_MESSAGE,
          reason: "aborted"
        } : {
          kind: "refused",
          message: SAND_COOKIE_ORIGIN_APPROVAL_EXPIRED_MESSAGE,
          reason: "expired"
        }
      );
    }
    return new Promise((resolve29) => {
      const waiter = (outcome) => {
        timeout2.dispose();
        resolve29(outcome);
      };
      const timeout2 = this.deps.clock.schedule(boundedWaitMs, () => {
        pending.waiters.delete(waiter);
        resolve29({ kind: "pending" });
      });
      pending.waiters.add(waiter);
    });
  }
  cancel(requestId2) {
    this.takeSettled(requestId2);
    this.rememberCancelled(requestId2);
    this.cancelAndRefuse(requestId2, SAND_COOKIE_ORIGIN_APPROVAL_ABORTED_MESSAGE, "aborted");
  }
  rememberCancelled(requestId2) {
    this.cancelledByRequestId.get(requestId2)?.dispose();
    this.cancelledByRequestId.set(requestId2, {
      dispose: this.deps.clock.schedule(SAND_COOKIE_ORIGIN_APPROVAL_ASK_TTL_MS, () => {
        this.cancelledByRequestId.delete(requestId2);
      }).dispose
    });
  }
  async request(args) {
    if (args.signal?.aborted) {
      return {
        kind: "refused",
        message: SAND_COOKIE_ORIGIN_APPROVAL_ABORTED_MESSAGE,
        reason: "aborted"
      };
    }
    const requestId2 = args.requestId ?? (0, import_node_crypto44.randomUUID)();
    const begun = this.begin({
      requestId: requestId2,
      origins: args.origins,
      ...args.agentId === void 0 ? {} : { agentId: args.agentId }
    });
    if (begun.kind !== "started") return begun;
    const abort = () => {
      this.cancelAndRefuse(requestId2, SAND_COOKIE_ORIGIN_APPROVAL_ABORTED_MESSAGE, "aborted");
    };
    args.signal?.addEventListener("abort", abort, { once: true });
    try {
      return await this.settledOutcome(requestId2);
    } finally {
      args.signal?.removeEventListener("abort", abort);
    }
  }
  settledOutcome(requestId2) {
    const buffered3 = this.takeSettled(requestId2);
    if (buffered3 !== void 0) return Promise.resolve(buffered3);
    const pending = this.pending.get(requestId2);
    if (pending === void 0) {
      return Promise.resolve({
        kind: "refused",
        message: SAND_COOKIE_ORIGIN_APPROVAL_EXPIRED_MESSAGE,
        reason: "expired"
      });
    }
    return new Promise((resolve29) => pending.waiters.add(resolve29));
  }
  takeSettled(requestId2) {
    const settled = this.settledByRequestId.get(requestId2);
    if (settled === void 0) return void 0;
    settled.expiry.dispose();
    this.settledByRequestId.delete(requestId2);
    return settled.outcome;
  }
  cancelAndRefuse(requestId2, message, reason) {
    const pending = this.pending.get(requestId2);
    if (pending === void 0) return;
    try {
      const bound = pending.providerId === null ? void 0 : this.providersById.get(pending.providerId);
      bound?.send({ kind: "cancel", requestId: requestId2 });
    } finally {
      this.settle(requestId2, { kind: "refused", message, reason });
    }
  }
  settle(requestId2, outcome) {
    const pending = this.pending.get(requestId2);
    if (pending === void 0) return;
    pending.ttl.dispose();
    this.pending.delete(requestId2);
    if (pending.waiters.size === 0) {
      this.settledByRequestId.set(requestId2, {
        outcome,
        expiry: this.deps.clock.schedule(SAND_COOKIE_ORIGIN_APPROVAL_SETTLED_BUFFER_TTL_MS, () => {
          this.settledByRequestId.delete(requestId2);
        })
      });
      return;
    }
    const waiters = [...pending.waiters];
    pending.waiters.clear();
    for (const waiter of waiters) waiter(outcome);
  }
  selectProvider() {
    const now = this.deps.clock.now();
    let best;
    for (const provider of this.providers) {
      if (!isLive(provider, now)) continue;
      if (best === void 0 || provider.lastSeenAt > best.lastSeenAt) {
        best = provider;
      }
    }
    return best;
  }
};

