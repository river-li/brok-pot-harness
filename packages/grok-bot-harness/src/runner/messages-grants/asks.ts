var import_node_crypto59 = require("node:crypto");
init_scheduling();
var ABORTED = {
  kind: "refused",
  reason: "aborted",
  message: SAND_LOCAL_TOOLS_ASK_CANCELLED_MESSAGE
};
var NO_DESKTOP = {
  kind: "refused",
  reason: "no-desktop",
  message: SAND_MESSAGES_GRANTS_NO_DESKTOP_MESSAGE
};
var UNAVAILABLE = {
  kind: "refused",
  reason: "unavailable",
  message: SAND_MESSAGES_GRANTS_UNAVAILABLE_MESSAGE
};
function createMessagesGrantsAsks(deps) {
  const askTtl = createExpiryPolicy({
    name: "sand-messages-grants-ask-ttl",
    ttlMs: deps.ttlMs,
    clock: deps.clock
  });
  const listeners2 = /* @__PURE__ */ new Set();
  const settled = /* @__PURE__ */ new Map();
  const tombstones = /* @__PURE__ */ new Map();
  let state = { kind: "idle" };
  const takeSettled = (requestId2) => {
    const entry = settled.get(requestId2);
    if (entry === void 0) return void 0;
    entry.expiry.dispose();
    settled.delete(requestId2);
    return entry.outcome;
  };
  const park = (requestId2) => (outcome) => {
    takeSettled(requestId2);
    settled.set(requestId2, {
      outcome,
      expiry: deps.clock.schedule(deps.ttlMs, () => settled.delete(requestId2))
    });
  };
  const close = (ask) => {
    ask.expiry.dispose();
    state = { kind: "idle" };
  };
  const settle = (ask, outcome) => {
    if (state.kind !== "open" || state.ask !== ask) return;
    close(ask);
    for (const waiter of [...ask.waiters.values()]) waiter(outcome);
  };
  const open9 = (requestId2, grants) => {
    const askId = (0, import_node_crypto59.randomUUID)();
    const ask = {
      askId,
      grants,
      waiters: /* @__PURE__ */ new Map([[requestId2, park(requestId2)]]),
      expiry: askTtl.arm(askId, () => settle(ask, { kind: "settled", via: "expired" }))
    };
    state = { kind: "open", ask };
    for (const listener of listeners2) listener({ requestId: askId, grants });
    return ask;
  };
  const attach = (requestId2, grants) => {
    if (tombstones.has(requestId2)) return ABORTED;
    const buffered3 = takeSettled(requestId2);
    if (buffered3 !== void 0) return buffered3;
    if (state.kind === "open") {
      const { ask } = state;
      if (!grants.every((grant) => ask.grants.includes(grant))) return UNAVAILABLE;
      if (!ask.waiters.has(requestId2)) ask.waiters.set(requestId2, park(requestId2));
      return { kind: "attached", ask };
    }
    if (deps.hasDesktopClient?.() === false) return NO_DESKTOP;
    return { kind: "attached", ask: open9(requestId2, grants) };
  };
  const cancel = (requestId2) => {
    takeSettled(requestId2);
    tombstones.get(requestId2)?.dispose();
    tombstones.set(
      requestId2,
      deps.clock.schedule(deps.ttlMs, () => tombstones.delete(requestId2))
    );
    if (state.kind !== "open") return;
    const { ask } = state;
    const waiter = ask.waiters.get(requestId2);
    if (waiter === void 0) return;
    ask.waiters.delete(requestId2);
    if (ask.waiters.size === 0) close(ask);
    waiter(ABORTED);
  };
  return {
    cancel,
    begin({ requestId: requestId2, grants }) {
      const attached = attach(requestId2, grants);
      return attached.kind === "attached" ? { kind: "pending" } : attached;
    },
    awaitAsk({ requestId: requestId2, waitMs }) {
      const buffered3 = takeSettled(requestId2);
      if (buffered3 !== void 0) return Promise.resolve(buffered3);
      if (tombstones.has(requestId2)) return Promise.resolve(ABORTED);
      if (state.kind !== "open" || !state.ask.waiters.has(requestId2)) {
        return Promise.resolve(UNAVAILABLE);
      }
      const { ask } = state;
      const boundedWaitMs = Number.isFinite(waitMs) ? Math.min(Math.max(waitMs, 0), deps.ttlMs) : 0;
      return new Promise((resolve29) => {
        const timeout2 = deps.clock.schedule(boundedWaitMs, () => {
          ask.waiters.set(requestId2, park(requestId2));
          resolve29({ kind: "pending" });
        });
        ask.waiters.set(requestId2, (outcome) => {
          timeout2.dispose();
          if (outcome.kind === "settled") park(requestId2)(outcome);
          resolve29(outcome);
        });
      });
    },
    resolve(askId) {
      if (state.kind === "open" && state.ask.askId === askId) {
        settle(state.ask, { kind: "settled", via: "resolved" });
      }
    },
    openRequest() {
      if (state.kind !== "open") return void 0;
      return { requestId: state.ask.askId, grants: state.ask.grants };
    },
    subscribe(listener) {
      listeners2.add(listener);
      const open10 = state.kind === "open" ? state.ask : void 0;
      if (open10 !== void 0) listener({ requestId: open10.askId, grants: open10.grants });
      return () => {
        listeners2.delete(listener);
      };
    },
    request(ask) {
      if (ask.signal.aborted) return Promise.resolve(ABORTED);
      const attached = attach(ask.requestId, ask.grants);
      if (attached.kind !== "attached") return Promise.resolve(attached);
      return new Promise((resolve29) => {
        const onAbort = () => cancel(ask.requestId);
        attached.ask.waiters.set(ask.requestId, (outcome) => {
          ask.signal.removeEventListener("abort", onAbort);
          if (outcome.kind === "settled") park(ask.requestId)(outcome);
          resolve29(outcome);
        });
        ask.signal.addEventListener("abort", onAbort, { once: true });
      });
    }
  };
}
