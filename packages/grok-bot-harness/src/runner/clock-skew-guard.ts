/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/clock-skew-guard.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var SEND_DISPATCH_MAX_PLAUSIBLE_MS = 12e4;
var TTFT_MAX_PLAUSIBLE_MS = 18e5;
function sanitizeCrossClockDurationMs(rawDeltaMs, ceilingMs) {
  if (!Number.isFinite(rawDeltaMs)) {
    return { skewReason: "too_large" };
  }
  if (rawDeltaMs < 0) {
    return { skewReason: "negative" };
  }
  if (rawDeltaMs > ceilingMs) {
    return { skewReason: "too_large" };
  }
  return { ms: Math.round(rawDeltaMs) };
}
function bucketClockSkewDeltaMs(rawDeltaMs) {
  if (!Number.isFinite(rawDeltaMs)) {
    return "nonfinite";
  }
  if (rawDeltaMs < 0) {
    const abs = -rawDeltaMs;
    if (abs <= 1e3) return "neg_le_1s";
    if (abs <= 6e4) return "neg_le_1m";
    return "neg_gt_1m";
  }
  if (rawDeltaMs <= 6e4) return "le_1m";
  if (rawDeltaMs <= 3e5) return "le_5m";
  if (rawDeltaMs <= 9e5) return "le_15m";
  return "gt_15m";
}

