init_utils_pb();
var USAGE_LIMIT_RATE_LIMIT_REASONS = /* @__PURE__ */ new Set([
  "sand_included_limit",
  "enterprise_grok_bot_trial_cap"
]);
var USAGE_LIMIT_ERROR_CODES = /* @__PURE__ */ new Set([
  ErrorDetails_Error.FREE_USER_USAGE_LIMIT,
  ErrorDetails_Error.PRO_USER_USAGE_LIMIT,
  ErrorDetails_Error.USAGE_PRICING_REQUIRED,
  ErrorDetails_Error.USAGE_PRICING_REQUIRED_CHANGEABLE,
  ErrorDetails_Error.GPT_4_VISION_PREVIEW_RATE_LIMIT
]);
var BILLING_HINTED_RATE_LIMITED_CODES = /* @__PURE__ */ new Set([
  ErrorDetails_Error.RATE_LIMITED,
  ErrorDetails_Error.RATE_LIMITED_CHANGEABLE
]);
var RATE_LIMIT_ERROR_CODES = /* @__PURE__ */ new Set([
  ErrorDetails_Error.FREE_USER_RATE_LIMIT_EXCEEDED,
  ErrorDetails_Error.PRO_USER_RATE_LIMIT_EXCEEDED,
  ErrorDetails_Error.GENERIC_RATE_LIMIT_EXCEEDED,
  ErrorDetails_Error.API_KEY_RATE_LIMIT
]);
function carriesBillingLimitHint(additionalInfo) {
  return additionalInfo?.spendLimitHit === "true" || additionalInfo?.limitType === "included_usage" || additionalInfo?.usageLimitType === "included_usage";
}
function classifyErrorDetails(details) {
  if (details === void 0) return void 0;
  const additionalInfo = details.details?.additionalInfo;
  const rateLimitReason = additionalInfo?.rateLimitReason;
  if (rateLimitReason !== void 0 && USAGE_LIMIT_RATE_LIMIT_REASONS.has(rateLimitReason)) {
    return "usage_limit";
  }
  if (USAGE_LIMIT_ERROR_CODES.has(details.error)) return "usage_limit";
  if (BILLING_HINTED_RATE_LIMITED_CODES.has(details.error)) {
    return carriesBillingLimitHint(additionalInfo) ? "usage_limit" : void 0;
  }
  if (RATE_LIMIT_ERROR_CODES.has(details.error)) return "rate_limit";
  return void 0;
}
function classifyNode(error41, seen) {
  if (error41 == null || typeof error41 !== "object") return void 0;
  if (seen.has(error41)) return void 0;
  seen.add(error41);
  const own = classifyErrorDetails(classifyError2(error41).displayInfo?.errorDetails);
  if (own !== void 0) return own;
  const fields2 = error41;
  const fromCause = classifyNode(fields2.cause, seen);
  if (fromCause !== void 0) return fromCause;
  if (Array.isArray(fields2.errors)) {
    for (const inner of fields2.errors) {
      const fromInner = classifyNode(inner, seen);
      if (fromInner !== void 0) return fromInner;
    }
  }
  return void 0;
}
function classifyExpectedTurnFailure(error41) {
  return classifyNode(error41, /* @__PURE__ */ new Set());
}
function resolveTurnOutcomeTags(args) {
  const adjusted = adjustTurnOutcomeForBotBlock({
    conversationId: args.conversationId,
    outcome: args.outcome
  });
  if (adjusted.outcome !== "error" || adjusted.errorType !== "none") {
    return adjusted;
  }
  const expected = classifyExpectedTurnFailure(args.error);
  return expected === void 0 ? adjusted : { outcome: "error", errorType: expected };
}
