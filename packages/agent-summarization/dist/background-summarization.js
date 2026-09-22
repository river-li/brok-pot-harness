/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-summarization/dist/background-summarization.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var BackgroundSummarizationMode;
(function(BackgroundSummarizationMode2) {
  BackgroundSummarizationMode2["Background"] = "Background";
  BackgroundSummarizationMode2["BackgroundAndPersistIfCompleted"] = "BackgroundAndPersistIfCompleted";
  BackgroundSummarizationMode2["WaitForCompletion"] = "WaitForCompletion";
  BackgroundSummarizationMode2["WaitForCompletionIfStarted"] = "WaitForCompletionIfStarted";
})(BackgroundSummarizationMode || (BackgroundSummarizationMode = {}));
var DISABLED_BACKGROUND_SUMMARIZATION_PROPS = {
  unusedTokensThresholdToStartBackgroundSummarization: void 0,
  unusedPercentTokensThresholdToStartBackgroundSummarization: void 0,
  unusedTokensThresholdToPersistBackgroundSummarization: void 0,
  unusedPercentTokensThresholdToPersistBackgroundSummarization: void 0
};
function isValidUsedTokensThreshold(threshold, maxTokens) {
  return typeof threshold === "number" && Number.isSafeInteger(threshold) && Number.isFinite(maxTokens) && threshold > 0 && threshold < maxTokens;
}
function getBackgroundSummarizationTriggerThreshold(maxTokens, props) {
  if (maxTokens <= 0) {
    return void 0;
  }
  const candidates = [];
  if (props.unusedTokensThresholdToStartBackgroundSummarization !== void 0) {
    candidates.push(maxTokens - props.unusedTokensThresholdToStartBackgroundSummarization);
  }
  if (props.unusedPercentTokensThresholdToStartBackgroundSummarization !== void 0) {
    candidates.push(maxTokens * (1 - props.unusedPercentTokensThresholdToStartBackgroundSummarization));
  }
  if (isValidUsedTokensThreshold(props.usedTokensThresholdToStartBackgroundSummarization, maxTokens)) {
    candidates.push(props.usedTokensThresholdToStartBackgroundSummarization);
  }
  if (candidates.length === 0) {
    return void 0;
  }
  return Math.min(...candidates);
}
function shouldStartBackgroundSummarization(usedTokens, maxTokens, props) {
  const threshold = getBackgroundSummarizationTriggerThreshold(maxTokens, props);
  return threshold !== void 0 && usedTokens >= threshold;
}
function shouldPersistBackgroundSummarization(usedTokens, maxTokens, props) {
  const unusedTokens = maxTokens - usedTokens;
  return shouldStartBackgroundSummarization(usedTokens, maxTokens, props) && (props.unusedTokensThresholdToPersistBackgroundSummarization !== void 0 && unusedTokens <= props.unusedTokensThresholdToPersistBackgroundSummarization || props.unusedPercentTokensThresholdToPersistBackgroundSummarization !== void 0 && unusedTokens / maxTokens <= props.unusedPercentTokensThresholdToPersistBackgroundSummarization || isValidUsedTokensThreshold(props.usedTokensThresholdToPersistBackgroundSummarization, maxTokens) && usedTokens >= props.usedTokensThresholdToPersistBackgroundSummarization);
}

