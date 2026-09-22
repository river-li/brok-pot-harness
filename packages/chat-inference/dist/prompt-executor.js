/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/chat-inference/dist/prompt-executor.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_dist4();
function createStringResult(content, isError = false) {
  return {
    content: [{ type: "text", text: content }],
    isError
  };
}
function createImageResult(imageData, mimeType, textContent, isError = false) {
  const content = [];
  if (textContent) {
    content.push({ type: "text", text: textContent });
  }
  content.push({ type: "image", data: imageData, mimeType });
  return {
    content,
    isError
  };
}
var OutputTokensLimitExceededError = class extends Error {
  constructor(message = "Provider exceeded max output tokens") {
    super(message);
    this.name = "OutputTokensLimitExceededError";
  }
};
var InputTokenLimitError = class extends Error {
  constructor(message = "Input token limit exceeded") {
    super(message);
    this.name = "InputTokenLimitError";
  }
};
var ProactiveSummarizationThresholdError = class extends Error {
  constructor(message = "Configured summarization threshold reached") {
    super(message);
    this.name = "ProactiveSummarizationThresholdError";
  }
};
var compactionEpochKey = createKey(/* @__PURE__ */ Symbol("compactionEpoch"), void 0);

