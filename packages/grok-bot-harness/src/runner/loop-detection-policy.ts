init_errors();
function parseSandLoopDetectionMode(value) {
  return value === "shadow" || value === "on" ? value : "off";
}
var MULTI_MESSAGE_MIN_REPETITIONS = 2;
var MULTI_MESSAGE_MIN_MESSAGE_LENGTH = 10;
var INVITED_RETRY_RESULT_SUBSTRINGS = [
  "Browser driver shell failed",
  "The page changed after review",
  "classifying this action",
  "waiting for Auto-review approval",
  "could not capture the current page state",
  "connectOverCDP",
  "may be temporary; try again",
  "may be temporary. Try again"
];
function isSandInvitedRetryToolResult(resultText) {
  return INVITED_RETRY_RESULT_SUBSTRINGS.some((substring) => resultText.includes(substring));
}
var REPETITION_TOLERANT_TOOL_NAMES = /* @__PURE__ */ new Set([
  "browser_press_key",
  "browser_scroll",
  "AwaitShell",
  "ListMachines",
  "browser_take_screenshot",
  "browser_snapshot"
]);
var TOLERANT_COMPUTER_ACTIONS = /* @__PURE__ */ new Set([
  "screenshot",
  "move",
  "key",
  "scroll",
  "wait"
]);
function isTolerantComputerAction(value) {
  if (typeof value !== "object" || value === null) return false;
  const action = "action" in value ? value.action : void 0;
  if (typeof action !== "string" || !TOLERANT_COMPUTER_ACTIONS.has(action)) {
    return false;
  }
  const then = "then" in value ? value.then : void 0;
  if (then === void 0) return true;
  return Array.isArray(then) && then.every(isTolerantComputerAction);
}
function actionOf(args) {
  if (typeof args !== "object" || args === null) return void 0;
  const action = "action" in args ? args.action : void 0;
  return typeof action === "string" ? action : void 0;
}
function isSandRepetitionTolerantToolCall(toolName, args) {
  const call = resolveEffectiveToolCall({ toolName, args });
  if (REPETITION_TOLERANT_TOOL_NAMES.has(call.toolName)) return true;
  if (call.toolName === "Computer") return isTolerantComputerAction(call.args);
  if (call.toolName === "browser_tabs") return actionOf(call.args) === "close";
  return false;
}
var SHELL_SLEEP_PATTERN = /(?:^|[;&|])\s*sleep\s+\d/;
function isWaitComputerAction(value) {
  if (typeof value !== "object" || value === null) return false;
  if (actionOf(value) === "wait") return true;
  const then = "then" in value ? value.then : void 0;
  return Array.isArray(then) && then.some(isWaitComputerAction);
}
function isSandWaitToolCall(toolName, args) {
  const call = resolveEffectiveToolCall({ toolName, args });
  if (call.toolName === "AwaitShell") return true;
  if (call.toolName === "Computer") return isWaitComputerAction(call.args);
  if (call.toolName === "Shell") {
    if (typeof call.args !== "object" || call.args === null) return false;
    const command = "command" in call.args ? call.args.command : void 0;
    return typeof command === "string" && SHELL_SLEEP_PATTERN.test(command);
  }
  return false;
}
var IMAGE_TOKEN_PATTERN = /<image:\d+:[^>]*>/g;
var VOLATILE_METADATA_PATTERNS = [
  [/\b\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:?\d{2})?\b/g, "<ts>"],
  [/\b\d{1,2}:\d{2}(?::\d{2})?\b/g, "<time>"],
  [/\b\d+(?:\.\d+)?\s?(?:ms|s|sec|secs|seconds?|m|min|mins|minutes?)\b/g, "<dur>"],
  [/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi, "<uuid>"],
  [/\b[0-9a-f]{16,}\b/gi, "<hex>"],
  [/\bid\s*[:=]\s*[A-Za-z0-9_-]+/g, "id:<id>"]
];
function normalizeSandToolResultForComparison(resultText) {
  const imageTokens = resultText.match(IMAGE_TOKEN_PATTERN) ?? [];
  let text2 = resultText.replace(IMAGE_TOKEN_PATTERN, "\0");
  for (const [pattern, replacement] of VOLATILE_METADATA_PATTERNS) {
    text2 = text2.replace(pattern, replacement);
  }
  let i = 0;
  return text2.replace(/\u0000/g, () => imageTokens[i++] ?? "");
}
function isSandOutboundMessageToolCall(toolName, args) {
  return isSandUserDeliveryToolCall({ toolName, args });
}
var OUTBOUND_MESSAGE_FLOOD_MIN_CONSECUTIVE = 8;
var REPETITION_TOLERANT_MIN_REPETITIONS = 4;
var CHANGED_RESULTS_MIN_REPETITIONS = 6;
var PROGRESS_MIN_REPETITIONS = 20;
var MAX_EVENTS_PER_TURN = 32;
var MAX_REPORTED_COUNT = 1e4;
var MAX_MITIGATIONS_PER_TURN = 16;
var SAND_LOOP_DETECTION_OFF = {
  kind: "off",
  settleTurn: () => {
  }
};
function loopDetectionModeOf(policy) {
  return policy.kind === "off" ? "off" : policy.mode;
}
var MITIGATION_BY_CANDIDATE = {
  none: "none",
  single_message_retry: "retry_once",
  multi_message_nudge: "loop_reminder"
};
var APPLIED_MITIGATION_BY_CANDIDATE = {
  single_message_retry: "retry_once",
  multi_message_nudge: "loop_reminder"
};
var TERMINAL_STAGE_BY_TURN_OUTCOME = {
  success: "recovered",
  awaiting_user: "recovered",
  aborted: "failed",
  error: "failed"
};
function clampCount(value) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(MAX_REPORTED_COUNT, Math.max(0, Math.trunc(value)));
}
function projectLoopObservation(observation, turn) {
  return {
    conversationId: turn.conversationId,
    requestId: turn.requestId,
    mode: turn.mode,
    loopKind: observation.loopKind,
    repetitions: clampCount(observation.repetitions),
    ...observation.period === void 0 ? {} : { period: clampCount(observation.period) },
    isReoccurrence: observation.isReoccurrence,
    evidenceFingerprint: observation.evidenceFingerprint,
    mitigation: MITIGATION_BY_CANDIDATE[observation.candidateMitigation]
  };
}
function createRunnerLoopDetection(options2) {
  const mode = options2.loopDetectionMode ?? (() => "off");
  return {
    mode,
    onDetected: options2.onLoopDetected,
    onMitigation: options2.onLoopMitigation,
    resolveTurn: (requestId2) => createSandLoopDetectionPolicy({
      mode: mode(),
      conversationId: options2.getConversationId(),
      requestId: requestId2,
      report: (report) => options2.onLoopDetected?.(report),
      ...options2.onLoopMitigation === void 0 ? {} : { reportMitigation: options2.onLoopMitigation }
    })
  };
}
function projectLoopMitigationObservation(observation, turn) {
  return {
    conversationId: turn.conversationId,
    requestId: turn.requestId,
    mode: turn.mode,
    loopKind: observation.loopKind,
    evidenceFingerprint: observation.evidenceFingerprint,
    mitigation: APPLIED_MITIGATION_BY_CANDIDATE[observation.mitigation],
    stage: observation.stage
  };
}
function createSandLoopDetectionPolicy(inputs) {
  const mode = inputs.mode;
  if (mode === "off") return SAND_LOOP_DETECTION_OFF;
  const turn = {
    conversationId: inputs.conversationId,
    requestId: inputs.requestId,
    mode
  };
  const seen = /* @__PURE__ */ new Set();
  let emitted = 0;
  const reportMitigation = inputs.reportMitigation;
  const openMitigations = /* @__PURE__ */ new Map();
  const closedMitigations = /* @__PURE__ */ new Set();
  let mitigationsEmitted = 0;
  const emitMitigation = (observation) => {
    if (reportMitigation === void 0) return;
    try {
      reportMitigation(projectLoopMitigationObservation(observation, turn));
    } catch (error42) {
      reportHostDiagnostic({
        kind: "loop_mitigation_report_failed",
        errorClass: errorLogTag(error42)
      });
    }
  };
  const reporting = {
    kind: "privacy_safe",
    onDetection: (observation) => {
      if (emitted >= MAX_EVENTS_PER_TURN) return;
      const dedupeKey2 = [
        observation.loopKind,
        observation.evidenceFingerprint,
        observation.isReoccurrence,
        observation.candidateMitigation
      ].join(":");
      if (seen.has(dedupeKey2)) return;
      seen.add(dedupeKey2);
      emitted++;
      inputs.report(projectLoopObservation(observation, turn));
    },
    onMitigation: (observation) => {
      if (reportMitigation === void 0) return;
      const key = `${observation.mitigation}:${observation.evidenceFingerprint}`;
      if (observation.stage === "applied") {
        if (openMitigations.has(key)) {
          openMitigations.delete(key);
          closedMitigations.add(key);
          emitMitigation({ ...observation, stage: "looped_again" });
          return;
        }
        if (closedMitigations.has(key)) return;
        if (mitigationsEmitted >= MAX_MITIGATIONS_PER_TURN) return;
        mitigationsEmitted++;
        openMitigations.set(key, observation);
        emitMitigation(observation);
        return;
      }
      if (!openMitigations.delete(key)) return;
      closedMitigations.add(key);
      emitMitigation(observation);
    }
  };
  return {
    kind: "active",
    mode,
    singleMessage: {
      responseAction: mode === "on" ? "retry_once" : "observe",
      reporting
    },
    multiMessage: {
      minRepetitions: MULTI_MESSAGE_MIN_REPETITIONS,
      minMessageLength: MULTI_MESSAGE_MIN_MESSAGE_LENGTH,
      injectReminder: mode === "on",
      reporting,
      isExemptToolResult: isSandInvitedRetryToolResult,
      changedResultsMinRepetitions: CHANGED_RESULTS_MIN_REPETITIONS,
      progressMinRepetitions: PROGRESS_MIN_REPETITIONS,
      normalizeToolResultForComparison: normalizeSandToolResultForComparison,
      normalizeMessageTextForComparison: normalizeSandToolResultForComparison,
      outboundMessageFlood: {
        isOutboundMessageToolCall: isSandOutboundMessageToolCall,
        minConsecutive: OUTBOUND_MESSAGE_FLOOD_MIN_CONSECUTIVE
      },
      repetitionTolerantTools: {
        isTolerantToolCall: isSandRepetitionTolerantToolCall,
        minRepetitions: REPETITION_TOLERANT_MIN_REPETITIONS,
        isWaitToolCall: isSandWaitToolCall
      }
    },
    settleTurn: (outcome) => {
      const stage = TERMINAL_STAGE_BY_TURN_OUTCOME[outcome];
      try {
        for (const observation of openMitigations.values()) {
          emitMitigation({ ...observation, stage });
        }
      } finally {
        openMitigations.clear();
      }
    }
  };
}
