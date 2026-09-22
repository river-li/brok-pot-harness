/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/chat-inference/dist/token-limit-error-classification.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function includesAll(haystack, needles) {
  return needles.every((needle) => haystack.includes(needle));
}
function isConfiguredInputTokensLimitMessage(lowerMessage) {
  return includesAll(lowerMessage, [
    "input tokens exceed the configured limit",
    "your messages resulted in",
    "tokens"
  ]);
}
function isInputTokenCountExceededMessage(lowerMessage) {
  return lowerMessage.includes("input token count") && lowerMessage.includes("exceeds the maximum number of tokens allowed");
}
function isInputTokenCountExceedsMaximumContextLengthMessage(lowerMessage) {
  return includesAll(lowerMessage, ["input token count", "exceeds", "maximum context length"]);
}
function isMaximumPromptLengthMessage(lowerMessage) {
  return includesAll(lowerMessage, ["maximum prompt length", "request contains", "tokens"]);
}
function isPromptTooLongMessage(lowerMessage) {
  return lowerMessage.includes("prompt is too long");
}
function isInputLongerThanContextMessage(lowerMessage) {
  return includesAll(lowerMessage, ["input", "token", "longer than", "context length"]);
}
function isInputPlusOutputExceedsContextLengthMessage(lowerMessage) {
  return includesAll(lowerMessage, [
    "input token count",
    "plus",
    "requested output count",
    "exceeds",
    "maximum context length"
  ]);
}
function isContextWindowOverflowMessage(lowerMessage) {
  return includesAll(lowerMessage, ["input exceeds", "context window"]);
}
function isInputTooLongForRequestedModelMessage(lowerMessage) {
  return lowerMessage.includes("input is too long for requested model");
}
function isInputLengthExceededMessage(lowerMessage) {
  return includesAll(lowerMessage, ["input length", "exceeds the maximum allowed input length"]);
}
function isRequestSizeLimitMessage(lowerMessage) {
  return includesAll(lowerMessage, [
    "request size cannot exceed",
    "bytes",
    "please shorten the request"
  ]);
}
function isInputAndMaxTokensExceedContextLimitMessage(lowerMessage) {
  return includesAll(lowerMessage, ["input length", "max_tokens", "exceed context limit"]);
}
function isGenericInputTooLongMessage(lowerMessage) {
  return lowerMessage.includes("input is too long");
}
function isRequestSizeExceedsContextWindowMessage(lowerMessage) {
  return lowerMessage.includes("request size exceeds model context window");
}
function isMessageSizeExceedsMbLimitMessage(lowerMessage) {
  return includesAll(lowerMessage, ["message size", "bytes", "exceeds", "mb limit"]);
}
function isContextLengthExceededCodeMessage(lowerMessage) {
  return lowerMessage.includes("context_length_exceeded");
}
function isPayloadTooLargeMessage(lowerMessage) {
  return lowerMessage.includes("payload too large");
}
function isMaxTokensExceededMessage(lowerMessage) {
  return /max tokens of \d+ exceeded/.test(lowerMessage);
}
function isObservedInputTokenLimitMessage(lowerMessage) {
  return isConfiguredInputTokensLimitMessage(lowerMessage) || isInputTokenCountExceededMessage(lowerMessage) || isInputTokenCountExceedsMaximumContextLengthMessage(lowerMessage) || isMaximumPromptLengthMessage(lowerMessage) || isPromptTooLongMessage(lowerMessage) || isInputLongerThanContextMessage(lowerMessage) || isInputPlusOutputExceedsContextLengthMessage(lowerMessage) || isContextWindowOverflowMessage(lowerMessage) || isInputTooLongForRequestedModelMessage(lowerMessage) || isInputLengthExceededMessage(lowerMessage) || isRequestSizeLimitMessage(lowerMessage) || isInputAndMaxTokensExceedContextLimitMessage(lowerMessage) || isGenericInputTooLongMessage(lowerMessage) || isRequestSizeExceedsContextWindowMessage(lowerMessage) || isMessageSizeExceedsMbLimitMessage(lowerMessage) || isContextLengthExceededCodeMessage(lowerMessage) || isPayloadTooLargeMessage(lowerMessage) || isMaxTokensExceededMessage(lowerMessage);
}
function isInputTokenLimitErrorMessage(errorMessage6) {
  const lowerMessage = errorMessage6.toLowerCase();
  return isObservedInputTokenLimitMessage(lowerMessage);
}
var OUTPUT_TOKEN_LIMIT_ERROR_SUBSTRING = "exceeded max output tokens";
function isOutputTokenLimitErrorMessage(errorMessage6) {
  return errorMessage6.toLowerCase().includes(OUTPUT_TOKEN_LIMIT_ERROR_SUBSTRING);
}
var CANONICAL_INPUT_TOKEN_LIMIT_MESSAGE = "input token limit exceeded";
function classifyTokenLimitErrorFromMessage(errorMessage6) {
  if (isOutputTokenLimitErrorMessage(errorMessage6)) {
    return new OutputTokensLimitExceededError(errorMessage6);
  }
  if (isInputTokenLimitErrorMessage(errorMessage6) || errorMessage6.toLowerCase().includes(CANONICAL_INPUT_TOKEN_LIMIT_MESSAGE)) {
    return new InputTokenLimitError(errorMessage6);
  }
  return void 0;
}

