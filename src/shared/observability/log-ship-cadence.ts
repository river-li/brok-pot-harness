/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/observability/log-ship-cadence.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var LOG_SHIP_INTERVAL_MS = 15e3;
var LOG_SHIP_MAX_BATCH_ENTRIES = 128;
var LOG_SHIP_MAX_BATCH_BYTES = 256 * 1024;
var LOG_SHIP_FAILURE_MAX_BACKOFF_MS = 6e4;
var LOG_SHIP_RATE_LIMIT_MAX_BACKOFF_MS = 5 * 6e4;
var LOG_SHIP_JITTER_RATIO = 0.25;
function nextLogShipDelayMs(input) {
  const random = input.random ?? Math.random;
  const backoff2 = (capMs) => Math.min(capMs, LOG_SHIP_INTERVAL_MS * 2 ** Math.max(0, input.streak));
  let baseMs;
  if (input.outcome === "shipped") {
    baseMs = LOG_SHIP_INTERVAL_MS;
  } else if (input.outcome === "failed") {
    baseMs = backoff2(LOG_SHIP_FAILURE_MAX_BACKOFF_MS);
  } else {
    baseMs = Math.max(input.retryAfterMs ?? 0, backoff2(LOG_SHIP_RATE_LIMIT_MAX_BACKOFF_MS));
  }
  return Math.round(baseMs + random() * baseMs * LOG_SHIP_JITTER_RATIO);
}
var LogShipSchedule = class {
  nextShipAtMs = 0;
  failureStreak = 0;
  rateLimitStreak = 0;
  isDue(eager, nowMs2 = Date.now()) {
    if (nowMs2 >= this.nextShipAtMs) return true;
    return eager && !this.isBackingOff();
  }
  shipNext() {
    if (!this.isBackingOff()) this.nextShipAtMs = 0;
  }
  record(result, nowMs2 = Date.now()) {
    if (result.delivered) {
      this.failureStreak = 0;
      this.rateLimitStreak = 0;
      this.nextShipAtMs = nowMs2 + nextLogShipDelayMs({ outcome: "shipped", streak: 0 });
    } else if (isRateLimitConnectError(result.error)) {
      this.failureStreak = 0;
      this.nextShipAtMs = nowMs2 + nextLogShipDelayMs({
        outcome: "rate_limited",
        streak: ++this.rateLimitStreak,
        retryAfterMs: getConnectRetryAfterMs(result.error, nowMs2)
      });
    } else {
      this.rateLimitStreak = 0;
      this.nextShipAtMs = nowMs2 + nextLogShipDelayMs({
        outcome: "failed",
        streak: ++this.failureStreak
      });
    }
  }
  isBackingOff() {
    return this.failureStreak + this.rateLimitStreak > 0;
  }
};
function takeLogShipBatch(buffer) {
  let bytes = 0;
  let count = 0;
  for (const entry of buffer) {
    if (count >= LOG_SHIP_MAX_BATCH_ENTRIES) break;
    let entryBytes = entry.message.length;
    for (const [key, value] of Object.entries(entry.metadata)) {
      entryBytes += key.length + value.length;
    }
    if (count > 0 && bytes + entryBytes > LOG_SHIP_MAX_BATCH_BYTES) break;
    bytes += entryBytes;
    count++;
  }
  return { batch: buffer.slice(0, count), remaining: buffer.slice(count) };
}

