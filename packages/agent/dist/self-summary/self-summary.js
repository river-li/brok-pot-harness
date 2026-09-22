var logger10 = createLogger("@anysphere/agent");
function findLastUserMessageIndex2(messages2, options2) {
  for (let i = messages2.length - 1; i >= 0; i--) {
    const msg = messages2[i];
    if (msg.role === "user" && (options2?.includeSummaryMessages || !msg.providerOptions?.cursor?.isSummary) && !isInjectedReminderMessage(msg)) {
      return i;
    }
  }
  return -1;
}
function shouldPerformSelfSummary(messages2, tokenDetails, ctx, configTokenLimit) {
  const tokenCount = tokenDetails?.usedTokens !== void 0 && Number.isFinite(tokenDetails.usedTokens) && tokenDetails.usedTokens > 0 ? tokenDetails.usedTokens : estimateTokenCount2(messages2, { includeNonTextContent: true });
  const evalOverrideLimit = ctx !== void 0 ? EVAL_ENFORCED_SELF_SUMMARY_TOKEN_LIMIT(ctx) : void 0;
  if (evalOverrideLimit !== void 0 && ctx !== void 0) {
    logger10.info(ctx, "[self-summary] using eval override token limit", {
      evalOverrideLimit,
      configTokenLimit
    });
  }
  const fractionLimit = tokenDetails?.maxTokens !== void 0 && tokenDetails.maxTokens > 0 ? Math.floor(tokenDetails.maxTokens * SELF_SUMMARY_CONTEXT_WINDOW_FRACTION) : void 0;
  const tokenLimit = evalOverrideLimit ?? configTokenLimit ?? fractionLimit;
  if (tokenLimit === void 0) {
    return false;
  }
  const overTokenLimit = tokenCount >= tokenLimit;
  return overTokenLimit;
}
