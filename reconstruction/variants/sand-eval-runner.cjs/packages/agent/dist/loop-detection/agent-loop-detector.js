/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/loop-detection/agent-loop-detector.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
var import_node_crypto14 = require("node:crypto");
init_dist();
init_utils_pb2();

// @recovered-fragment 2/2
var logger31 = createLogger("@anysphere/agent:loop-detection");
var loopDetectionCounter = createCounter("agent.assistant_message_looping", {
  description: "Count of agent message loops detected",
  labelNames: ["loop_kind", "isLoopReoccurrence", "caller"]
});
var loopDetectionLatency = createHistogram("agent.assistant_message_looping.latency_ms", {
  description: "Latency of loop detection in milliseconds",
  labelNames: ["result", "caller"]
});
var singleMessageLoopCheckLatency = createHistogram("agent.single_message_looping.check_for_loop.latency_ms", {
  description: "Latency of single-message loop detector checks in milliseconds",
  labelNames: ["result", "caller", "channel"]
});
var SINGLE_MESSAGE_MULTI_LINE_LOOP_MIN_REPETITIONS = 2;
var SINGLE_MESSAGE_MULTI_LINE_LOOP_MIN_REPETITIONS_IN_CODE_FENCE = 3;
var SINGLE_MESSAGE_LOOP_DETECTOR_MAX_LINE_LENGTH = 1e4;
var SINGLE_LINE_LOOP_MIN_REPETITIONS = 3;
var SINGLE_LINE_LOOP_MIN_REPETITIONS_IN_CODE_FENCE = 4;
var SINGLE_LINE_LOOP_MIN_P_TIMES_K = 100;
var SINGLE_LINE_LOOP_MIN_P_TIMES_K_IN_CODE_FENCE = 200;
var SINGLE_LINE_LOOP_MAX_P = 256;
var SINGLE_MESSAGE_MULTI_LINE_LOOP_MIN_P_TIMES_K = 3;
var SINGLE_MESSAGE_MULTI_LINE_LOOP_MIN_P_TIMES_K_IN_CODE_FENCE = 4;
var MULTI_LINE_LOOP_MIN_TOTAL_CHARS = 50;
var MULTI_LINE_LOOP_MIN_TOTAL_CHARS_IN_CODE_FENCE = 100;
var SINGLE_MESSAGE_LOOP_DETECTOR_MAX_CHECK_TIME_MS = 500;
var SINGLE_MESSAGE_LOOP_KIND_BY_CHANNEL = {
  response: {
    single_line: "single_message_single_line",
    multi_line: "single_message_multi_line"
  },
  reasoning: {
    single_line: "single_message_reasoning_single_line",
    multi_line: "single_message_reasoning_multi_line"
  }
};
var suppressAgentLoopEvidencePreviewKey = createKey(/* @__PURE__ */ Symbol.for("anysphere.agent.suppressLoopEvidencePreview"), false);
var LOOP_EVIDENCE_FINGERPRINT_DOMAIN = "cursor-agent-loop-evidence-v1";
var LOOP_EVIDENCE_FINGERPRINT_MAX_BYTES = 1024;
function fingerprintAgentLoopEvidence(loopKind, evidenceParts) {
  const hash = (0, import_node_crypto14.createHash)("sha256");
  hash.update(`${LOOP_EVIDENCE_FINGERPRINT_DOMAIN}:${loopKind}:`);
  let remainingBytes = LOOP_EVIDENCE_FINGERPRINT_MAX_BYTES;
  for (const part of evidenceParts) {
    if (remainingBytes <= 0) {
      break;
    }
    const bytes = Buffer.from(part, "utf8").subarray(0, remainingBytes);
    hash.update(`${bytes.length}:`);
    hash.update(bytes);
    remainingBytes -= bytes.length;
  }
  return hash.digest("hex");
}
function reportLoopObservation(reporting, observation) {
  if (reporting === void 0) {
    return;
  }
  try {
    reporting.onDetection(observation);
  } catch {
  }
}
function reportLoopMitigationObservation(reporting, observation) {
  try {
    reporting?.onMitigation?.(observation);
  } catch {
  }
}
function resolveAgentSingleMessageLoopDetection(config2) {
  if (config2.singleMessageLoopDetection !== void 0) {
    return config2.singleMessageLoopDetection;
  }
  return config2.featureFlags?.nalLoopDetection === true ? { responseAction: "retry_once" } : void 0;
}
function normalizeAgentSingleMessageLoopDetection(detection) {
  if (detection === void 0 || detection === false) {
    return void 0;
  }
  return detection === true ? { responseAction: "retry_once" } : detection;
}
var AgentLoopError = class extends ConnectError {
  constructor(options2) {
    const message = options2.loopType === "assistantMessage" ? `Agent loop detected: pattern of ${options2.patternLength} messages repeating` : `Agent single-message loop detected: ${options2.loopKind}`;
    super(message, Code.FailedPrecondition, void 0, [
      new ErrorDetails({
        error: ErrorDetails_Error.INTERNAL,
        details: new CustomErrorDetails({
          title: "Agent Looping Detected",
          detail: "The model got stuck in a repeating response pattern, so this turn was stopped. Please try again with a different model or start a new conversation. If the problem persists, please contact support.",
          isRetryable: false
        })
      })
    ]);
    this.name = "AgentLoopError";
    this.loopType = options2.loopType;
    if (options2.loopType === "singleMessage") {
      this.singleMessageLoopKind = options2.loopKind;
      this.repetitions = options2.repetitions;
      this.period = options2.period;
      this.evidenceFingerprint = options2.evidenceFingerprint;
    }
  }
};
function stripThinkingTags(text2) {
  let startIndex = text2.indexOf("<think>");
  while (startIndex !== -1) {
    const endIndex = text2.indexOf("</think>", startIndex);
    if (endIndex === -1) {
      break;
    }
    text2 = text2.slice(0, startIndex) + text2.slice(endIndex + "</think>".length);
    startIndex = text2.indexOf("<think>", startIndex);
  }
  return text2;
}
var LOOP_TOOL_RESULT_TEXT_MAX_CHARS = 4096;
function extractToolResultTextForLoopDetection(result) {
  if (typeof result === "string") {
    return result.slice(0, LOOP_TOOL_RESULT_TEXT_MAX_CHARS);
  }
  if (Array.isArray(result)) {
    let text2 = "";
    let imageTokens = "";
    for (const part of result) {
      if (typeof part === "string") {
        text2 += part;
      } else if (typeof part === "object" && part !== null) {
        const p2 = part;
        if (p2.type === "text" && typeof p2.text === "string") {
          text2 += p2.text;
        } else if (p2.type === "image") {
          const data = typeof p2.data === "string" ? p2.data : typeof p2.image === "string" ? p2.image : "";
          imageTokens += `<image:${data.length}:${data.slice(0, 256)}>`;
        } else if (typeof p2.type === "string") {
          text2 += `<${p2.type}>`;
        }
      }
      if (text2.length >= LOOP_TOOL_RESULT_TEXT_MAX_CHARS && imageTokens.length >= LOOP_TOOL_RESULT_TEXT_MAX_CHARS) {
        break;
      }
    }
    return text2.slice(0, LOOP_TOOL_RESULT_TEXT_MAX_CHARS) + imageTokens.slice(0, LOOP_TOOL_RESULT_TEXT_MAX_CHARS);
  }
  if (result === null || result === void 0) {
    return "";
  }
  if (typeof result === "object") {
    try {
      return JSON.stringify(result).slice(0, LOOP_TOOL_RESULT_TEXT_MAX_CHARS);
    } catch (_e2) {
      return "";
    }
  }
  return String(result).slice(0, LOOP_TOOL_RESULT_TEXT_MAX_CHARS);
}
function convertCoreMessagesToLoopFormat(messages) {
  const result = [];
  for (const message of messages) {
    if (message.role === "system") {
      continue;
    }
    if (message.role === "tool") {
      const previous = result[result.length - 1];
      if (previous !== void 0 && previous.role === "assistant" && Array.isArray(message.content)) {
        for (const part of message.content) {
          if (typeof part === "object" && part !== null && part.type === "tool-result") {
            const resultPart = part;
            const source = Array.isArray(resultPart.experimental_content) ? resultPart.experimental_content : resultPart.result;
            previous.toolResultTexts ??= [];
            previous.toolResultTexts.push(extractToolResultTextForLoopDetection(source));
          }
        }
      }
      continue;
    }
    if (message.role !== "user" && message.role !== "assistant") {
      continue;
    }
    let text2 = "";
    const toolCalls3 = [];
    if (typeof message.content === "string") {
      text2 = message.content;
    } else if (Array.isArray(message.content)) {
      for (const part of message.content) {
        if (typeof part === "string") {
          text2 += part;
        } else if (typeof part === "object" && part !== null) {
          if ("type" in part) {
            if (part.type === "text" && "text" in part) {
              text2 += part.text;
            } else if (part.type === "tool-call") {
              const toolCallPart = part;
              toolCalls3.push({
                toolName: toolCallPart.toolName,
                args: toolCallPart.args
              });
            }
          }
        }
      }
    }
    const textWithoutThinking = stripThinkingTags(text2).trim();
    result.push({
      role: message.role,
      text: textWithoutThinking,
      toolCalls: toolCalls3.length > 0 ? toolCalls3 : void 0
    });
  }
  return result;
}
function createMessageKey(message, options2 = {}) {
  const { ignoreToolArgs = false, onlyToolArgs = false, normalizeText } = options2;
  const text2 = normalizeText === void 0 ? message.text : normalizeText(message.text);
  let toolInfo = "";
  if (message.toolCalls && message.toolCalls.length > 0) {
    toolInfo = message.toolCalls.map((tc) => `${tc.toolName}:${tc.args !== null && tc.args !== void 0 ? JSON.stringify(tc.args) : ""}`).sort().join("|");
    if (toolInfo) {
      toolInfo = `<<<TOOLS>>>${toolInfo}`;
    }
  }
  if (onlyToolArgs) {
    return toolInfo;
  }
  if (ignoreToolArgs) {
    return text2;
  }
  return `${text2}${toolInfo}`;
}
function detectPatternInMessages(messageKeys, minRepetitions, minMessageLength) {
  if (messageKeys.length < minRepetitions) {
    return null;
  }
  const maxPeriod = messageKeys.length - 1;
  const periodMatchRunLengths = new Array(maxPeriod + 1).fill(0);
  for (let i = 1; i < messageKeys.length; i++) {
    const currentKey = messageKeys[i];
    for (let p2 = 1; p2 <= Math.min(i, maxPeriod); p2++) {
      const priorIndex = i - p2;
      const priorKey = messageKeys[priorIndex];
      if (currentKey === priorKey) {
        const matched = ++periodMatchRunLengths[p2];
        const repetitions = Math.floor(matched / p2);
        if (currentKey.length >= minMessageLength && repetitions >= minRepetitions) {
          const patternStartIdx = i - p2 + 1 - matched;
          return { patternLength: p2, patternStartIdx };
        }
      } else {
        periodMatchRunLengths[p2] = 0;
      }
    }
  }
  return null;
}
function collectRunOccurrenceResults(params) {
  const { keys, messages, patternStartIdx, patternLength, normalize: normalize5 } = params;
  const unit = keys.slice(patternStartIdx, patternStartIdx + patternLength);
  const results = [];
  for (let start = patternStartIdx; start + patternLength <= keys.length; start += patternLength) {
    for (let offset = 0; offset < patternLength; offset++) {
      if (keys[start + offset] !== unit[offset]) {
        return results;
      }
    }
    const texts = [];
    for (let offset = 0; offset < patternLength; offset++) {
      for (const text2 of messages[start + offset].toolResultTexts ?? []) {
        texts.push(normalize5 === void 0 ? text2 : normalize5(text2));
      }
      texts.push("");
    }
    results.push(texts.join("\0"));
  }
  return results;
}
var SingleMessageLoopDetector2 = class extends SingleMessageLoopDetector {
  constructor() {
    super({
      multiLineLoopMinRepetitions: () => SINGLE_MESSAGE_MULTI_LINE_LOOP_MIN_REPETITIONS,
      multiLineLoopMinRepetitionsInCodeFence: () => SINGLE_MESSAGE_MULTI_LINE_LOOP_MIN_REPETITIONS_IN_CODE_FENCE,
      maxLineLength: () => SINGLE_MESSAGE_LOOP_DETECTOR_MAX_LINE_LENGTH,
      maxCheckTimeMs: () => SINGLE_MESSAGE_LOOP_DETECTOR_MAX_CHECK_TIME_MS,
      singleLineLoopMinRepetitions: () => SINGLE_LINE_LOOP_MIN_REPETITIONS,
      singleLineLoopMinRepetitionsInCodeFence: () => SINGLE_LINE_LOOP_MIN_REPETITIONS_IN_CODE_FENCE,
      singleLineLoopMinPTimesK: () => SINGLE_LINE_LOOP_MIN_P_TIMES_K,
      singleLineLoopMinPTimesKInCodeFence: () => SINGLE_LINE_LOOP_MIN_P_TIMES_K_IN_CODE_FENCE,
      singleLineLoopMaxP: () => SINGLE_LINE_LOOP_MAX_P,
      multiLineLoopMinPTimesK: () => SINGLE_MESSAGE_MULTI_LINE_LOOP_MIN_P_TIMES_K,
      multiLineLoopMinPTimesKInCodeFence: () => SINGLE_MESSAGE_MULTI_LINE_LOOP_MIN_P_TIMES_K_IN_CODE_FENCE,
      multiLineLoopMinTotalChars: () => MULTI_LINE_LOOP_MIN_TOTAL_CHARS,
      multiLineLoopMinTotalCharsInCodeFence: () => MULTI_LINE_LOOP_MIN_TOTAL_CHARS_IN_CODE_FENCE
    });
  }
};
function getAgentSingleMessageLoopInfo(detector, channel) {
  const singleLoopInfo = detector.getSingleLineLoopInfo();
  const multiLineLoopInfo = detector.getMultiLineLoopInfo();
  const loopInfo = singleLoopInfo ?? multiLineLoopInfo;
  if (!loopInfo) {
    return null;
  }
  return {
    loopKind: SINGLE_MESSAGE_LOOP_KIND_BY_CHANNEL[channel][singleLoopInfo ? "single_line" : "multi_line"],
    pattern: loopInfo.pattern,
    repetitions: loopInfo.repetitions,
    period: singleLoopInfo?.period
  };
}
function checkForAgentSingleMessageLooping(params) {
  const channel = params.channel ?? "response";
  if (params.detector.loopDetected()) {
    const loopInfo2 = getAgentSingleMessageLoopInfo(params.detector, channel);
    if (!loopInfo2) {
      return { loopDetected: false };
    }
    return {
      loopDetected: true,
      ...loopInfo2
    };
  }
  if (params.detector.timedOut()) {
    return { loopDetected: false };
  }
  const addTextStartTime = performance.now();
  const loopDetected = params.detector.addText({
    newText: params.newText,
    caller: params.caller
  });
  const addTextLatencyMs = performance.now() - addTextStartTime;
  if (!loopDetected && params.detector.timedOut()) {
    singleMessageLoopCheckLatency.histogram(params.ctx, addTextLatencyMs, {
      result: "timeout",
      caller: params.caller,
      channel
    });
    logger31.info(params.ctx, "NAL single-message loop detection timed out; failing open", {
      caller: params.caller,
      channel,
      newTextLength: params.newText.length
    });
    return { loopDetected: false };
  }
  if (!loopDetected) {
    singleMessageLoopCheckLatency.histogram(params.ctx, addTextLatencyMs, {
      result: "no_loop_detected",
      caller: params.caller,
      channel
    });
    return { loopDetected: false };
  }
  const loopInfo = getAgentSingleMessageLoopInfo(params.detector, channel);
  if (!loopInfo) {
    singleMessageLoopCheckLatency.histogram(params.ctx, addTextLatencyMs, {
      result: "no_loop_detected",
      caller: params.caller,
      channel
    });
    return { loopDetected: false };
  }
  singleMessageLoopCheckLatency.histogram(params.ctx, addTextLatencyMs, {
    result: "loop_detected",
    caller: params.caller,
    channel
  });
  logger31.warn(params.ctx, "NAL single-message looping detected", {
    loopKind: loopInfo.loopKind,
    repetitions: loopInfo.repetitions,
    period: loopInfo.period,
    ...params.ctx.get(suppressAgentLoopEvidencePreviewKey) ? {} : {
      patternPreview: `${loopInfo.pattern.slice(0, 200)}${loopInfo.pattern.length > 200 ? "..." : ""}`
    }
  });
  loopDetectionCounter.increment(params.ctx, 1, {
    loop_kind: loopInfo.loopKind,
    isLoopReoccurrence: "false",
    caller: params.caller
  });
  const eventTracker = getAgentEventTracker(params.ctx);
  eventTracker.trackLoopDetected(params.ctx, {
    loopKind: loopInfo.loopKind,
    isLoopReoccurrence: false,
    period: loopInfo.period,
    repetitions: loopInfo.repetitions
  });
  const evidenceFingerprint = fingerprintAgentLoopEvidence(loopInfo.loopKind, [loopInfo.pattern]);
  reportLoopObservation(params.reporting, {
    loopKind: loopInfo.loopKind,
    repetitions: loopInfo.repetitions,
    period: loopInfo.period,
    isReoccurrence: false,
    evidenceFingerprint,
    candidateMitigation: channel === "response" ? "single_message_retry" : "none"
  });
  return {
    loopDetected: true,
    ...loopInfo,
    evidenceFingerprint
  };
}
function findLastUserMessageIndex(loopMessages) {
  for (let i = loopMessages.length - 1; i >= 0; i--) {
    if (loopMessages[i].role === "user") {
      return i;
    }
  }
  return -1;
}
function currentMessageForLoopDetection(params) {
  return {
    role: "assistant",
    // Strip thinking tags from current message text to match how we process
    // historical messages.
    text: stripThinkingTags(params.currentMessageText).trim(),
    toolCalls: params.currentMessageToolCalls,
    toolResultTexts: params.currentMessageToolResultTexts
  };
}
function checkForAgentOutboundMessageFlood(params, reporting) {
  const { outboundMessageFlood, isExemptToolResult, isToolCall } = params;
  if (outboundMessageFlood === void 0 || !isToolCall) {
    return { loopDetected: false };
  }
  const { isOutboundMessageToolCall, minConsecutive } = outboundMessageFlood;
  if (!(minConsecutive >= 1)) {
    return { loopDetected: false };
  }
  const startTime = performance.now();
  const loopMessages = convertCoreMessagesToLoopFormat(params.currentMessages);
  const lastUserMessageIndex = findLastUserMessageIndex(loopMessages);
  if (lastUserMessageIndex === -1) {
    return { loopDetected: false };
  }
  const sequence = [
    ...loopMessages.slice(lastUserMessageIndex + 1),
    currentMessageForLoopDetection(params)
  ];
  let run = 0;
  const runToolNames = /* @__PURE__ */ new Set();
  for (const msg of sequence) {
    if (msg.role !== "assistant") {
      continue;
    }
    const toolCalls3 = msg.toolCalls ?? [];
    if (toolCalls3.length === 0) {
      continue;
    }
    if (isExemptToolResult !== void 0 && msg.toolResultTexts?.some(isExemptToolResult) === true) {
      continue;
    }
    if (toolCalls3.every((tc) => isOutboundMessageToolCall(tc.toolName, tc.args))) {
      run++;
      for (const tc of toolCalls3) {
        runToolNames.add(tc.toolName);
      }
    } else {
      run = 0;
      runToolNames.clear();
    }
  }
  if (run < minConsecutive) {
    return { loopDetected: false };
  }
  const loopKind = "multi_message_outbound_flood";
  const patternKeys = [...runToolNames].sort();
  if (params.ctx) {
    logger31.warn(params.ctx, "NAL outbound message flood detected", {
      loopKind,
      consecutiveMessages: run,
      toolNames: patternKeys
    });
    loopDetectionCounter.increment(params.ctx, 1, {
      loop_kind: loopKind,
      isLoopReoccurrence: "false",
      caller: "cli"
    });
    loopDetectionLatency.histogram(params.ctx, performance.now() - startTime, {
      result: "loop_detected",
      caller: "cli"
    });
    getAgentEventTracker(params.ctx).trackLoopDetected(params.ctx, {
      loopKind: "multi_message",
      isLoopReoccurrence: false,
      period: 1,
      repetitions: run
    });
  }
  const evidenceFingerprint = fingerprintAgentLoopEvidence(loopKind, patternKeys);
  if (reporting !== void 0) {
    reportLoopObservation(reporting.sink, {
      loopKind,
      repetitions: run,
      period: 1,
      isReoccurrence: false,
      evidenceFingerprint,
      candidateMitigation: reporting.candidateMitigation
    });
  }
  return {
    loopDetected: true,
    loopKind,
    patternLength: 1,
    patternKeys,
    isReoccurrence: false,
    evidenceFingerprint
  };
}
function checkForAgentMessageLooping(params, reporting) {
  const { currentMessages, isToolCall, minRepetitions = 3, minMessageLength = 50, shouldIgnoreToolArgs = false, shouldOnlyCheckToolArgs = false, isExemptToolResult, changedResultsMinRepetitions, progressMinRepetitions, normalizeToolResultForComparison, normalizeMessageTextForComparison, repetitionTolerantTools } = params;
  const startTime = performance.now();
  if (!isToolCall) {
    return { loopDetected: false };
  }
  const loopMessages = convertCoreMessagesToLoopFormat(currentMessages);
  const lastUserMessageIndex = findLastUserMessageIndex(loopMessages);
  if (lastUserMessageIndex === -1) {
    return { loopDetected: false };
  }
  function shouldIncludeMessage(text2, hasTools) {
    if (shouldOnlyCheckToolArgs) {
      return true;
    }
    const includeDueToLength = text2.length >= minMessageLength;
    const includeDueToTools = hasTools && !shouldIgnoreToolArgs;
    return includeDueToLength || includeDueToTools;
  }
  function isExemptOccurrence(msg) {
    if (isExemptToolResult === void 0) {
      return false;
    }
    return msg.toolResultTexts?.some(isExemptToolResult) === true;
  }
  const keyOptions = {
    ignoreToolArgs: shouldIgnoreToolArgs,
    onlyToolArgs: shouldOnlyCheckToolArgs,
    normalizeText: normalizeMessageTextForComparison
  };
  const assistantMessageKeys = [];
  const assistantMessagesForKeys = [];
  for (let i = lastUserMessageIndex + 1; i < loopMessages.length; i++) {
    const msg = loopMessages[i];
    if (msg.role === "assistant") {
      const hasTools = (msg.toolCalls?.length ?? 0) > 0;
      if (shouldIncludeMessage(msg.text, hasTools) && !isExemptOccurrence(msg)) {
        assistantMessageKeys.push(createMessageKey(msg, keyOptions));
        assistantMessagesForKeys.push(msg);
      }
    }
  }
  const currentMessageForKey = currentMessageForLoopDetection(params);
  const hasCurrentTools = (currentMessageForKey.toolCalls?.length ?? 0) > 0;
  if (shouldIncludeMessage(currentMessageForKey.text, hasCurrentTools) && !isExemptOccurrence(currentMessageForKey)) {
    assistantMessageKeys.push(createMessageKey(currentMessageForKey, keyOptions));
    assistantMessagesForKeys.push(currentMessageForKey);
  }
  if (assistantMessageKeys.length < minRepetitions) {
    return { loopDetected: false };
  }
  let currentPattern = detectPatternInMessages(assistantMessageKeys, minRepetitions, minMessageLength);
  if (!currentPattern) {
    return { loopDetected: false };
  }
  {
    const { patternStartIdx, patternLength } = currentPattern;
    const patternMessages = assistantMessagesForKeys.slice(patternStartIdx, patternStartIdx + patternLength);
    let requiredRepetitions = minRepetitions;
    const isPureTolerantPattern = repetitionTolerantTools !== void 0 && patternMessages.length > 0 && patternMessages.every((msg) => msg.toolCalls !== void 0 && msg.toolCalls.length > 0 && msg.toolCalls.every((tc) => repetitionTolerantTools.isTolerantToolCall(tc.toolName, tc.args)));
    const isWaitToolCall = repetitionTolerantTools?.isWaitToolCall;
    const isPollingPattern = isWaitToolCall !== void 0 && patternMessages.some((msg) => (msg.toolCalls ?? []).some((tc) => isWaitToolCall(tc.toolName, tc.args)));
    const isTolerantPattern = isPureTolerantPattern || isPollingPattern;
    const occurrenceResults = collectRunOccurrenceResults({
      keys: assistantMessageKeys,
      messages: assistantMessagesForKeys,
      patternStartIdx,
      patternLength,
      normalize: normalizeToolResultForComparison
    });
    let identicalPairs = 0;
    for (let i = 1; i < occurrenceResults.length; i++) {
      if (occurrenceResults[i] === occurrenceResults[i - 1]) {
        identicalPairs++;
      }
    }
    const adjacentPairs = Math.max(0, occurrenceResults.length - 1);
    const resultsChanged = identicalPairs < adjacentPairs;
    const everyOccurrenceChanged = adjacentPairs > 0 && identicalPairs === 0;
    if (isTolerantPattern && resultsChanged) {
      return { loopDetected: false };
    }
    if (isTolerantPattern && repetitionTolerantTools !== void 0) {
      requiredRepetitions = Math.max(requiredRepetitions, repetitionTolerantTools.minRepetitions);
    }
    if (everyOccurrenceChanged && progressMinRepetitions !== void 0) {
      requiredRepetitions = Math.max(requiredRepetitions, progressMinRepetitions);
    } else if (resultsChanged && changedResultsMinRepetitions !== void 0) {
      requiredRepetitions = Math.max(requiredRepetitions, changedResultsMinRepetitions);
    }
    if (requiredRepetitions > minRepetitions) {
      currentPattern = detectPatternInMessages(assistantMessageKeys, requiredRepetitions, minMessageLength);
      if (!currentPattern) {
        return { loopDetected: false };
      }
    }
  }
  let isLoopReoccurrence = false;
  if (lastUserMessageIndex > 0) {
    const previousAssistantKeys = [];
    for (let i = 0; i < lastUserMessageIndex; i++) {
      const msg = loopMessages[i];
      if (msg.role === "assistant") {
        const hasTools = (msg.toolCalls?.length ?? 0) > 0;
        if (shouldIncludeMessage(msg.text, hasTools) && !isExemptOccurrence(msg)) {
          previousAssistantKeys.push(createMessageKey(msg, keyOptions));
        }
      }
    }
    const previousPattern = detectPatternInMessages(previousAssistantKeys, minRepetitions, minMessageLength);
    if (previousPattern) {
      isLoopReoccurrence = true;
    }
  }
  const patternKeys = assistantMessageKeys.slice(currentPattern.patternStartIdx, currentPattern.patternStartIdx + currentPattern.patternLength);
  const loopKind = shouldOnlyCheckToolArgs ? "multi_message_only_toolcall_args" : shouldIgnoreToolArgs ? "multi_message_ignoring_toolcall_args" : "multi_message";
  if (params.ctx) {
    logger31.warn(params.ctx, "NAL assistant message looping detected", {
      loopKind,
      isLoopReoccurrence,
      patternLength: currentPattern.patternLength,
      repetitions: minRepetitions,
      ...params.ctx.get(suppressAgentLoopEvidencePreviewKey) ? {} : { firstPatternKeyPreview: patternKeys[0]?.slice(0, 200) ?? "" }
    });
    loopDetectionCounter.increment(params.ctx, 1, {
      loop_kind: loopKind,
      isLoopReoccurrence: isLoopReoccurrence ? "true" : "false",
      caller: "cli"
    });
    loopDetectionLatency.histogram(params.ctx, performance.now() - startTime, {
      result: "loop_detected",
      caller: "cli"
    });
    const eventTracker = getAgentEventTracker(params.ctx);
    eventTracker.trackLoopDetected(params.ctx, {
      loopKind: loopKind === "multi_message_only_toolcall_args" ? "multi_message_only_toolcall_args" : "multi_message",
      isLoopReoccurrence,
      period: currentPattern.patternLength,
      repetitions: minRepetitions
    });
  }
  const evidenceFingerprint = fingerprintAgentLoopEvidence(loopKind, patternKeys);
  if (reporting !== void 0) {
    reportLoopObservation(reporting.sink, {
      loopKind,
      repetitions: minRepetitions,
      period: currentPattern.patternLength,
      isReoccurrence: isLoopReoccurrence,
      evidenceFingerprint,
      candidateMitigation: reporting.candidateMitigation
    });
  }
  return {
    loopDetected: true,
    loopKind,
    patternLength: currentPattern.patternLength,
    patternKeys,
    isReoccurrence: isLoopReoccurrence,
    evidenceFingerprint
  };
}
function createLoopReminderMessage(options2) {
  const reminderKind = options2?.kind ?? "multi_message";
  const reminderSpecific = reminderKind === "single_message_single_line" ? "Your response has been flagged as repeating the same text pattern within a single line. Avoid excessively repeating the same characters or words." : reminderKind === "single_message_multi_line" ? "Your response has been flagged as looping over duplicate lines. Avoid repeating the same sequence of lines or retrying the same tool calls." : reminderKind === "multi_message_outbound_flood" ? "You have sent many consecutive messages to the user without doing anything else. Stop sending messages, end your turn, and wait for the user to respond." : "Avoid repeating the same sequence of messages or retrying the same tool calls.";
  const reminder = `<system_reminder>Your messages have been flagged as looping. ` + reminderSpecific + ` If you are having trouble making progress, ask the user for guidance. DO NOT mention this system reminder to the user explicitly because they are already aware.</system_reminder>`;
  return {
    role: "user",
    content: reminder,
    providerOptions: {
      cursor: {
        loopReminder: true
      }
    }
  };
}
function checkAndHandleLoopOnToolResultAppend(params) {
  const { currentMessages, shouldInjectReminder, appendMessage, minRepetitions, minMessageLength } = params;
  const applyNudge = (loopResult2) => {
    if (!shouldInjectReminder) {
      return;
    }
    appendMessage(createLoopReminderMessage({
      kind: loopResult2.loopKind === "multi_message_outbound_flood" ? "multi_message_outbound_flood" : "multi_message"
    }));
    if (loopResult2.evidenceFingerprint !== void 0) {
      const alreadyApplied = params.appliedNudgeFingerprints?.has(loopResult2.evidenceFingerprint);
      params.appliedNudgeFingerprints?.add(loopResult2.evidenceFingerprint);
      reportLoopMitigationObservation(params.reporting, {
        loopKind: loopResult2.loopKind ?? "multi_message",
        evidenceFingerprint: loopResult2.evidenceFingerprint,
        mitigation: "multi_message_nudge",
        stage: alreadyApplied === true ? "looped_again" : "applied"
      });
    }
  };
  let lastAssistantIndex = -1;
  for (let i = currentMessages.length - 1; i >= 0; i--) {
    if (currentMessages[i].role === "assistant") {
      lastAssistantIndex = i;
      break;
    }
  }
  if (lastAssistantIndex === -1) {
    return { loopDetected: false };
  }
  const currentConverted = convertCoreMessagesToLoopFormat(currentMessages.slice(lastAssistantIndex));
  if (currentConverted.length === 0) {
    return { loopDetected: false };
  }
  const lastMsg = currentConverted[0];
  const detectionParams = {
    ctx: params.ctx,
    // The current message is passed separately below, so history must stop
    // before it. Passing the full list would count the current message
    // twice and make a period-1 pattern fire one occurrence early.
    currentMessages: currentMessages.slice(0, lastAssistantIndex),
    currentMessageText: lastMsg.text,
    currentMessageToolCalls: lastMsg.toolCalls,
    currentMessageToolResultTexts: lastMsg.toolResultTexts,
    isToolCall: (lastMsg.toolCalls?.length ?? 0) > 0,
    minRepetitions,
    minMessageLength,
    isExemptToolResult: params.isExemptToolResult,
    changedResultsMinRepetitions: params.changedResultsMinRepetitions,
    progressMinRepetitions: params.progressMinRepetitions,
    normalizeToolResultForComparison: params.normalizeToolResultForComparison,
    normalizeMessageTextForComparison: params.normalizeMessageTextForComparison,
    outboundMessageFlood: params.outboundMessageFlood,
    repetitionTolerantTools: params.repetitionTolerantTools
  };
  const nudgeReporting = params.reporting === void 0 ? void 0 : { sink: params.reporting, candidateMitigation: "multi_message_nudge" };
  const loopResult = checkForAgentMessageLooping(detectionParams, nudgeReporting);
  if (loopResult.loopDetected) {
    applyNudge(loopResult);
    return loopResult;
  }
  const toolLoopResult = checkForAgentMessageLooping({
    ...detectionParams,
    shouldOnlyCheckToolArgs: true
  }, params.reporting === void 0 ? void 0 : { sink: params.reporting, candidateMitigation: "none" });
  if (toolLoopResult.loopDetected) {
    return toolLoopResult;
  }
  const floodResult = checkForAgentOutboundMessageFlood(detectionParams, nudgeReporting);
  if (floodResult.loopDetected) {
    applyNudge(floodResult);
    return floodResult;
  }
  return { loopDetected: false };
}

