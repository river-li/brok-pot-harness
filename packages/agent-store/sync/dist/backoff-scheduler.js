/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-store/sync/dist/backoff-scheduler.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var DEFAULT_MULTIPLIER = 2;
var DEFAULT_JITTER = 0;
var BackoffScheduler = class {
  constructor(options2) {
    var _a19, _b2, _c2;
    this.consecutiveFailures = 0;
    const baseDelayMs = ensureFinitePositive({
      value: options2.baseDelayMs,
      name: "baseDelayMs",
      context: "BackoffScheduler"
    });
    const maxDelayMs = ensureFinitePositive({
      value: options2.maxDelayMs,
      name: "maxDelayMs",
      context: "BackoffScheduler"
    });
    if (baseDelayMs > maxDelayMs) {
      throw new RangeError(`BackoffScheduler baseDelayMs (${baseDelayMs}) must be <= maxDelayMs (${maxDelayMs})`);
    }
    const multiplier = (_a19 = options2.multiplier) !== null && _a19 !== void 0 ? _a19 : DEFAULT_MULTIPLIER;
    if (!Number.isFinite(multiplier) || multiplier < 1) {
      throw new RangeError(`BackoffScheduler multiplier must be >= 1, got ${multiplier}`);
    }
    const jitter = (_b2 = options2.jitter) !== null && _b2 !== void 0 ? _b2 : DEFAULT_JITTER;
    if (!Number.isFinite(jitter) || jitter < 0 || jitter > 1) {
      throw new RangeError(`BackoffScheduler jitter must be in [0, 1], got ${jitter}`);
    }
    this.baseDelayMs = baseDelayMs;
    this.maxDelayMs = maxDelayMs;
    this.multiplier = multiplier;
    this.jitter = jitter;
    this.random = (_c2 = options2.random) !== null && _c2 !== void 0 ? _c2 : Math.random;
  }
  recordSuccess() {
    this.consecutiveFailures = 0;
  }
  recordFailure() {
    this.consecutiveFailures += 1;
    return this.computeDelayMs(
      this.consecutiveFailures,
      /*jitter=*/
      true
    );
  }
  /**
   * Inspects what the next `recordFailure` would return *without*
   * jitter, so callers can log/schedule with a deterministic value.
   * The real delay applied during `recordFailure` may differ by up to
   * the configured `jitter` fraction.
   */
  peekNextDelayMs() {
    return this.computeDelayMs(
      this.consecutiveFailures + 1,
      /*jitter=*/
      false
    );
  }
  get failures() {
    return this.consecutiveFailures;
  }
  /** Restore a prior failure streak after recreating with new base/max. */
  restoreFailures(count) {
    this.consecutiveFailures = count <= 0 ? 0 : Math.floor(count);
  }
  computeDelayMs(failureCount, applyJitter) {
    if (failureCount <= 0) {
      return 0;
    }
    const power = Math.pow(this.multiplier, failureCount - 1);
    const raw = Math.min(this.baseDelayMs * power, this.maxDelayMs);
    const adjusted = applyJitter ? this.applyJitter(raw) : raw;
    const floored = Math.max(1, Math.floor(adjusted));
    return Math.min(this.maxDelayMs, floored);
  }
  applyJitter(delayMs) {
    if (this.jitter === 0) {
      return delayMs;
    }
    const rand = this.random();
    const safeRand = Number.isFinite(rand) ? Math.max(0, Math.min(rand, 1)) : 0;
    const factor = 1 - this.jitter + safeRand * 2 * this.jitter;
    return delayMs * factor;
  }
};

