/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/turn-usage.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var BIGINT_ZERO = BigInt(0);
var MAX_SAFE_TOKEN_COUNT = BigInt(Number.MAX_SAFE_INTEGER);
function toSafeTokenCount(value) {
  if (value <= BIGINT_ZERO) return 0;
  if (value >= MAX_SAFE_TOKEN_COUNT) return Number.MAX_SAFE_INTEGER;
  return Number(value);
}
function turnUsageFromTurnEnded(fields2) {
  if (fields2.inputTokens == null && fields2.outputTokens == null && fields2.cacheReadTokens == null && fields2.cacheWriteTokens == null && fields2.reasoningTokens == null) {
    return void 0;
  }
  return {
    inputTokens: toSafeTokenCount(fields2.inputTokens ?? BIGINT_ZERO),
    outputTokens: toSafeTokenCount(fields2.outputTokens ?? BIGINT_ZERO),
    cacheReadTokens: toSafeTokenCount(fields2.cacheReadTokens ?? BIGINT_ZERO),
    cacheWriteTokens: toSafeTokenCount(fields2.cacheWriteTokens ?? BIGINT_ZERO),
    ...fields2.reasoningTokens != null ? { reasoningTokens: toSafeTokenCount(fields2.reasoningTokens) } : {}
  };
}
function totalInputTokens(usage) {
  return usage.inputTokens;
}
function addTokenCounts(left, right) {
  return Math.min(Number.MAX_SAFE_INTEGER, left + right);
}
function mergeTurnUsage(current, next) {
  if (current == null) return next;
  if (next == null) return current;
  const reasoningTokens = current.reasoningTokens == null && next.reasoningTokens == null ? void 0 : addTokenCounts(current.reasoningTokens ?? 0, next.reasoningTokens ?? 0);
  return {
    inputTokens: addTokenCounts(current.inputTokens, next.inputTokens),
    outputTokens: addTokenCounts(current.outputTokens, next.outputTokens),
    cacheReadTokens: addTokenCounts(current.cacheReadTokens, next.cacheReadTokens),
    cacheWriteTokens: addTokenCounts(current.cacheWriteTokens, next.cacheWriteTokens),
    ...reasoningTokens != null ? { reasoningTokens } : {}
  };
}

