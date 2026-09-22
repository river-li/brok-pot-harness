init_dist4();
var modelStreamChunkObserverKey = createKey(/* @__PURE__ */ Symbol("modelStreamChunkObserver"), void 0);
function withModelStreamChunkObserver(ctx, observer) {
  return ctx.with(modelStreamChunkObserverKey, observer);
}
var IDLE_ENDING_CHUNK_TYPES = /* @__PURE__ */ new Set([
  "text-delta",
  "tool-call-streaming-start",
  "tool-call-delta",
  "tool-call"
]);
var THINKING_CHUNK_TYPES = /* @__PURE__ */ new Set([
  "reasoning",
  "reasoning-signature",
  "redacted-reasoning"
]);
var STEER_IDLE_SAMPLE_PREEMPTED_REASON = "steer_preempted_idle_sample";
var IdleModelSamplePreempter = class {
  constructor(options2) {
    this.options = options2;
    this.idle = true;
    this.sawThinking = false;
    this.stopped = false;
    this.didPreempt = false;
    this.now = options2.now ?? (() => Date.now());
    this.setTimer = options2.setTimer ?? ((fn, ms2) => setTimeout(fn, ms2));
    this.clearTimer = options2.clearTimer ?? ((handle) => clearTimeout(handle));
    this.startedAtMs = this.now();
  }
  get preempted() {
    return this.didPreempt;
  }
  /** Ms between sample start and the preemption, for logging; undefined if none. */
  get preemptedAfterMs() {
    return this.didPreempt ? this.now() - this.startedAtMs : void 0;
  }
  get phase() {
    return this.sawThinking ? "thinking" : "no_output";
  }
  start() {
    if (this.stopped) {
      return;
    }
    this.unsubscribe = this.options.signal.onUserInjectionAdmitted(() => this.arm());
    if (this.options.signal.hasPendingUserInjections()) {
      this.arm();
    }
  }
  observeChunk(type2) {
    if (THINKING_CHUNK_TYPES.has(type2)) {
      this.sawThinking = true;
      return;
    }
    if (this.idle && IDLE_ENDING_CHUNK_TYPES.has(type2)) {
      this.idle = false;
      this.disarm();
    }
  }
  stop() {
    if (this.stopped) {
      return;
    }
    this.stopped = true;
    this.disarm();
    this.unsubscribe?.();
    this.unsubscribe = void 0;
  }
  arm() {
    if (this.stopped || !this.idle || this.didPreempt || this.timer !== void 0) {
      return;
    }
    const pendingSinceMs = this.options.policy.pendingSinceMs();
    const waitedMs = pendingSinceMs === void 0 ? 0 : Math.max(0, this.now() - pendingSinceMs);
    const delayMs = Math.max(0, this.options.policy.graceMs - waitedMs);
    this.timer = this.setTimer(() => {
      this.timer = void 0;
      this.fire();
    }, delayMs);
  }
  disarm() {
    if (this.timer !== void 0) {
      this.clearTimer(this.timer);
      this.timer = void 0;
    }
  }
  fire() {
    if (this.stopped || !this.idle || this.didPreempt || !this.options.signal.hasPendingUserInjections()) {
      return;
    }
    this.didPreempt = true;
    this.options.cancel({
      intentional: true,
      reason: STEER_IDLE_SAMPLE_PREEMPTED_REASON
    });
  }
};
function createIdleModelSamplePreempter(signal, cancel) {
  const policy = signal?.idleModelSamplePreemption;
  if (signal === void 0 || policy === void 0 || policy.graceMs < 0) {
    return void 0;
  }
  return new IdleModelSamplePreempter({ signal, policy, cancel });
}
