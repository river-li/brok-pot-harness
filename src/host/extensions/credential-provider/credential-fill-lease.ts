/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/credential-provider/credential-fill-lease.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_scheduling();
init_errors();
var DEFAULT_AUTOFILL_WAIT_MS = 8e3;
var DEFAULT_AGENT_TOOL_WAIT_MS = 3e4;
var CLEAR_RETRY_LOG_EVERY = 10;
var AGENT_TOOL_REFUSAL_DETAIL = {
  "autofill-in-progress": "The box browser is busy: a saved credential is being filled into a sign-in form, and this tool must not observe it. The tool did not run. Retry in a few seconds.",
  "credentials-uncleared": "The box browser is locked: a filled credential has not yet been confirmed cleared from the sign-in page, so this tool must not observe it. The tool did not run. Retry in a few seconds.",
  aborted: "The tool call was cancelled while waiting for the box browser.",
  unavailable: "The box could not confirm that no saved credential is being filled into its browser, so this tool did not run. Retry in a few seconds."
};
var AUTOFILL_REFUSAL_DETAIL = {
  "agent-tools-busy": "Agent tools are using the box browser. Try again once they finish.",
  "fill-in-progress": "Another credential fill has not finished clearing the page. Try again in a moment.",
  aborted: "The credential fill was cancelled while waiting for the box browser."
};
var BOX_WIDE_KEY = "box";
function windowKey(windowIndex) {
  return windowIndex === void 0 ? BOX_WIDE_KEY : String(windowIndex);
}
var CredentialFillLease = class {
  windows = /* @__PURE__ */ new Map();
  waiters = /* @__PURE__ */ new Set();
  clock;
  log;
  autofillDeadline;
  agentToolDeadline;
  constructor(options2 = {}) {
    this.clock = options2.clock ?? realClock;
    this.log = options2.log ?? (() => void 0);
    this.autofillDeadline = createDeadlinePolicy({
      name: "sand-credential-fill-lease-autofill",
      timeoutMs: options2.autofillWaitMs ?? DEFAULT_AUTOFILL_WAIT_MS,
      clock: this.clock
    });
    this.agentToolDeadline = createDeadlinePolicy({
      name: "sand-credential-fill-lease-agent-tool",
      timeoutMs: options2.agentToolWaitMs ?? DEFAULT_AGENT_TOOL_WAIT_MS,
      clock: this.clock
    });
  }
  canStartAutofill(windowIndex) {
    return this.scope(windowKey(windowIndex)).every(
      (state) => state.autofill === "idle" && state.agentHolds.size === 0
    );
  }
  async acquireAutofill(request5) {
    const key = windowKey(request5.windowIndex);
    const own = this.window(key);
    const startedAt = this.clock.monotonicNow();
    own.autofillWaiting += 1;
    let outcome;
    try {
      outcome = await this.waitUntil(
        this.autofillDeadline,
        () => {
          const blocked = this.scope(key).some(
            (state) => state.autofill !== "idle" || state.agentHolds.size > 0
          );
          if (blocked) return false;
          own.autofill = "filling";
          return true;
        },
        request5.signal
      );
    } finally {
      own.autofillWaiting -= 1;
    }
    const waitedMs = Math.round(elapsedMs(startedAt, this.clock.monotonicNow()));
    if (outcome.kind !== "ready") {
      let reason = "aborted";
      if (outcome.kind === "timed-out") {
        reason = this.scope(key).some((state) => state.autofill !== "idle") ? "fill-in-progress" : "agent-tools-busy";
      }
      this.log(
        `credentials: lease refused autofill on window ${key} after ${waitedMs}ms (${reason}${outcome.kind === "aborted" ? `: ${errorLogTag(outcome.cause)}` : ""}, ${this.describeWindow(key)})`
      );
      this.forgetIfIdle(key);
      this.notify();
      return { ok: false, reason, detail: AUTOFILL_REFUSAL_DETAIL[reason] };
    }
    this.log(`credentials: lease autofill acquired on window ${key} after ${waitedMs}ms`);
    const acquiredAt = this.clock.monotonicNow();
    let released = false;
    return {
      ok: true,
      markUncleared: () => {
        if (released || own.autofill === "uncleared") return;
        own.autofill = "uncleared";
        this.log(
          `credentials: lease autofill on window ${key} held until the filled credential is cleared`
        );
      },
      release: () => {
        if (released) return;
        released = true;
        own.autofill = "idle";
        this.forgetIfIdle(key);
        this.log(
          `credentials: lease autofill on window ${key} released after ${Math.round(
            elapsedMs(acquiredAt, this.clock.monotonicNow())
          )}ms`
        );
        this.notify();
      }
    };
  }
  async acquireAgentTool(request5) {
    const key = windowKey(request5.windowIndex);
    const own = this.window(key);
    const startedAt = this.clock.monotonicNow();
    const deadline = request5.waitMs === void 0 ? this.agentToolDeadline : createDeadlinePolicy({
      name: "sand-credential-fill-lease-agent-tool",
      timeoutMs: request5.waitMs,
      clock: this.clock
    });
    own.agentWaiting += 1;
    let outcome;
    try {
      outcome = await this.waitUntil(
        deadline,
        () => {
          const blocked = this.scope(key).some(
            (state) => state.autofill !== "idle" || state.autofillWaiting > 0
          );
          if (blocked) return false;
          own.agentHolds.set(request5.toolName, (own.agentHolds.get(request5.toolName) ?? 0) + 1);
          return true;
        },
        request5.signal
      );
    } finally {
      own.agentWaiting -= 1;
    }
    const waitedMs = Math.round(elapsedMs(startedAt, this.clock.monotonicNow()));
    if (outcome.kind !== "ready") {
      let reason = "aborted";
      if (outcome.kind === "timed-out") {
        reason = this.scope(key).some((state) => state.autofill === "uncleared") ? "credentials-uncleared" : "autofill-in-progress";
      }
      this.log(
        `credentials: lease refused ${request5.toolName} on window ${key} after ${waitedMs}ms (${reason}${outcome.kind === "aborted" ? `: ${errorLogTag(outcome.cause)}` : ""}, ${this.describeWindow(key)})`
      );
      this.forgetIfIdle(key);
      return { ok: false, reason, detail: AGENT_TOOL_REFUSAL_DETAIL[reason] };
    }
    if (waitedMs > 0) {
      this.log(
        `credentials: lease ${request5.toolName} on window ${key} waited ${waitedMs}ms for a credential fill`
      );
    }
    let released = false;
    return {
      ok: true,
      release: () => {
        if (released) return;
        released = true;
        const remaining = (own.agentHolds.get(request5.toolName) ?? 1) - 1;
        if (remaining <= 0) own.agentHolds.delete(request5.toolName);
        else own.agentHolds.set(request5.toolName, remaining);
        this.forgetIfIdle(key);
        this.notify();
      }
    };
  }
  window(key) {
    let state = this.windows.get(key);
    if (state === void 0) {
      state = { autofill: "idle", autofillWaiting: 0, agentWaiting: 0, agentHolds: /* @__PURE__ */ new Map() };
      this.windows.set(key, state);
    }
    return state;
  }
  scope(key) {
    if (key === BOX_WIDE_KEY) return [...this.windows.values()];
    const own = this.windows.get(key);
    const boxWide = this.windows.get(BOX_WIDE_KEY);
    return [own, boxWide].filter((state) => state !== void 0);
  }
  forgetIfIdle(key) {
    const state = this.windows.get(key);
    if (state !== void 0 && state.autofill === "idle" && state.autofillWaiting === 0 && state.agentWaiting === 0 && state.agentHolds.size === 0) {
      this.windows.delete(key);
    }
  }
  describeWindow(key) {
    const describe3 = (name17) => {
      const state = this.windows.get(name17);
      if (state === void 0) return `${name17}: idle`;
      const holds = [...state.agentHolds.entries()].map(([tool, count]) => `${tool}x${count}`);
      return `${name17}: autofill=${state.autofill}, autofillWaiting=${state.autofillWaiting}, agentWaiting=${state.agentWaiting}, agentHolds=[${holds.join(", ")}]`;
    };
    return key === BOX_WIDE_KEY ? [...this.windows.keys()].map(describe3).join("; ") : [describe3(key), describe3(BOX_WIDE_KEY)].join("; ");
  }
  async waitUntil(deadline, tryTake, signal) {
    if (signal?.aborted === true) return { kind: "aborted", cause: signal.reason };
    let taken = tryTake();
    if (taken) return { kind: "ready" };
    try {
      await deadline.run(async (deadlineSignal) => {
        while (!taken) {
          await this.nextChange(deadlineSignal);
          taken = tryTake();
        }
      }, signal);
      return { kind: "ready" };
    } catch (error42) {
      if (taken) return { kind: "ready" };
      if (error42 instanceof DeadlineExceededError) return { kind: "timed-out" };
      return { kind: "aborted", cause: error42 };
    }
  }
  nextChange(signal) {
    return new Promise((resolve29, reject2) => {
      if (signal.aborted) {
        reject2(signal.reason);
        return;
      }
      const waiter = () => {
        signal.removeEventListener("abort", onAbort);
        resolve29();
      };
      const onAbort = () => {
        this.waiters.delete(waiter);
        reject2(signal.reason);
      };
      this.waiters.add(waiter);
      signal.addEventListener("abort", onAbort, { once: true });
    });
  }
  notify() {
    const waiters = [...this.waiters];
    this.waiters.clear();
    for (const waiter of waiters) waiter();
  }
};
function createLeasedCredentialFill(options2) {
  const retries = /* @__PURE__ */ new Set();
  const fills = /* @__PURE__ */ new Map();
  const releaseIfCleared = (windowIndex, fill) => {
    if (fill.active || fill.pendingClears > 0) return;
    fill.hold.release();
    if (fills.get(windowIndex) === fill) fills.delete(windowIndex);
  };
  const holdUntilCleared = (windowIndex, fill, result) => {
    if (result.cleared) {
      releaseIfCleared(windowIndex, fill);
      return;
    }
    fill.hold.markUncleared();
    fill.pendingClears += 1;
    const target = result.clearTarget;
    let attempts2 = 0;
    const run2 = options2.clearRetry.start(async () => {
      attempts2 += 1;
      let clearance;
      try {
        clearance = await options2.verifyCleared(target);
      } catch (error42) {
        options2.log(`credentials: clear retry ${attempts2} failed (${errorLogTag(error42)})`);
        return;
      }
      if (!clearance.cleared) {
        if (attempts2 === 1 || attempts2 % CLEAR_RETRY_LOG_EVERY === 0) {
          options2.log(
            `credentials: filled credential still on the page after ${attempts2} clear attempt(s); agent tools stay blocked`
          );
        }
        return;
      }
      options2.log(`credentials: filled credential cleared after ${attempts2} clear attempt(s)`);
      retries.delete(run2);
      run2.dispose();
      fill.pendingClears -= 1;
      releaseIfCleared(windowIndex, fill);
    });
    retries.add(run2);
  };
  const runWithFill = async (windowIndex, activeFill, fill) => {
    activeFill.active = true;
    let result;
    try {
      result = await fill();
    } catch (error42) {
      activeFill.active = false;
      releaseIfCleared(windowIndex, activeFill);
      throw error42;
    }
    activeFill.active = false;
    holdUntilCleared(windowIndex, activeFill, result);
    return { ok: true, result };
  };
  const run = async (windowIndex, fill) => {
    const acquisition = await options2.lease.acquireAutofill({ windowIndex });
    if (!acquisition.ok) return acquisition;
    const activeFill = { hold: acquisition, active: false, pendingClears: 0 };
    fills.set(windowIndex, activeFill);
    return await runWithFill(windowIndex, activeFill, fill);
  };
  return {
    run,
    runFollowUp: async (windowIndex, fill) => {
      const activeFill = fills.get(windowIndex);
      if (activeFill === void 0 || activeFill.active || activeFill.pendingClears === 0) {
        return await run(windowIndex, fill);
      }
      return await runWithFill(windowIndex, activeFill, fill);
    },
    pendingClearCount: () => retries.size,
    dispose: () => {
      for (const run2 of retries) run2.dispose();
      retries.clear();
      for (const fill of fills.values()) fill.hold.release();
      fills.clear();
    }
  };
}

