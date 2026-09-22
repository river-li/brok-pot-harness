/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/telemetry/host-lifecycle-progress.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_invariant();
var HostLifecycleProgress = class {
  constructor(options2) {
    this.options = options2;
    this.phaseStartedAt = options2.startedAt;
    this.armWatchdog();
  }
  options;
  phaseIndex = 0;
  phaseStartedAt;
  watchdogHandle;
  complete(completion) {
    const phase = this.currentPhase();
    invariant(
      phase === completion.phase,
      `Host lifecycle phase ${completion.phase} completed while ${phase ?? "none"} was active`
    );
    this.watchdogHandle?.dispose();
    this.watchdogHandle = void 0;
    this.options.report({
      ...completion,
      outcome: "completed",
      durationMs: this.elapsedMs()
    });
    this.phaseIndex += 1;
    this.phaseStartedAt = this.options.now();
    this.armWatchdog();
  }
  fail() {
    const phase = this.currentPhase();
    if (phase === void 0) return;
    this.watchdogHandle?.dispose();
    this.watchdogHandle = void 0;
    this.options.report({
      phase,
      outcome: "failed",
      durationMs: this.elapsedMs(),
      error: SandError.hostLifecycleFailed()
    });
  }
  armWatchdog() {
    const phase = this.currentPhase();
    if (phase === void 0) return;
    this.watchdogHandle = this.options.watchdog.arm(() => {
      this.options.report({
        phase,
        outcome: "stuck",
        durationMs: this.elapsedMs(),
        error: SandError.hostLifecycleStalled()
      });
    });
  }
  currentPhase() {
    return SAND_HOST_LIFECYCLE_PHASES[this.phaseIndex];
  }
  elapsedMs() {
    return Math.max(0, Math.round(this.options.now() - this.phaseStartedAt));
  }
};

