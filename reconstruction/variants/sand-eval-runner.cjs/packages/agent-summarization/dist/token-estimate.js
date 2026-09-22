/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-summarization/dist/token-estimate.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var CHARS_PER_TOKEN = 2.5;
var MESSAGE_OVERHEAD_CHARS = 25;
var TOOL_CALL_OVERHEAD_CHARS = 50;
function safeLength(value) {
  if (typeof value === "string") {
    return value.length;
  }
  if (typeof value === "object" && value !== null && "length" in value) {
    try {
      const length = value.length;
      return typeof length === "number" ? length : 0;
    } catch (_a20) {
      return 0;
    }
  }
  return 0;
}
function estimatePartChars(part) {
  switch (part.type) {
    case "text": {
      return safeLength(part.text);
    }
    case "tool-call": {
      const argsLen = safeLength(part.args);
      return argsLen + TOOL_CALL_OVERHEAD_CHARS;
    }
    case "tool-result": {
      const resultLen = safeLength(part.result);
      return resultLen + TOOL_CALL_OVERHEAD_CHARS;
    }
    case "unknown": {
      return safeLength(part.data);
    }
    default:
      return 0;
  }
}
function defaultTextContentLength(message) {
  const content = message.content;
  if (isRedactedString(content) || typeof content === "string") {
    return safeLength(content);
  }
  if (Array.isArray(content)) {
    let len = 0;
    for (const part of content) {
      if (part.type === "text") {
        len += safeLength(part.text);
      }
    }
    return len;
  }
  return 0;
}
function estimateTokenCount(messages, options2) {
  var _a20, _b2;
  const includeNonText = (_a20 = options2 === null || options2 === void 0 ? void 0 : options2.includeNonTextContent) !== null && _a20 !== void 0 ? _a20 : false;
  const getTextLen = (_b2 = options2 === null || options2 === void 0 ? void 0 : options2.textContentLengthFn) !== null && _b2 !== void 0 ? _b2 : defaultTextContentLength;
  let totalChars = 0;
  for (const message of messages) {
    const content = message.content;
    if (isRedactedString(content) || typeof content === "string") {
      totalChars += getTextLen(message);
    } else if (Array.isArray(content)) {
      if (includeNonText) {
        for (const part of content) {
          totalChars += estimatePartChars(part);
        }
      } else {
        totalChars += getTextLen(message);
      }
    }
    totalChars += MESSAGE_OVERHEAD_CHARS;
  }
  return Math.ceil(totalChars / CHARS_PER_TOKEN);
}

