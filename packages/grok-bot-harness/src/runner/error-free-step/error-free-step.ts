init_dist4();
init_errors();
var logger109 = createLogger("sand:error-free-step");
var GROK_BOT_ERROR_FREE_STEP_METRIC = "grok_bot.turn.error_free_step";
var ERROR_FREE_STEP_DEADLINE_MS = 6e4;
var ENDED_VERDICT = {
  aborted: { outcome: "neutral", reason: "aborted" },
  quiesced_for_upgrade: { outcome: "neutral", reason: "quiesced_for_upgrade" },
  awaiting_user: { outcome: "bad", reason: "awaiting_user" }
};
var ERROR_VERDICT = {
  none: { outcome: "bad", reason: "error" },
  bot_block: { outcome: "bad", reason: "bot_block" },
  usage_limit: { outcome: "neutral", reason: "usage_limit" },
  rate_limit: { outcome: "neutral", reason: "rate_limit" }
};
var HARNESS_STEP = {
  box: {
    key: (options2) => options2.ackToken,
    opening: (startedAt) => ({ anchor: startedAt, weight: 1 }),
    writesEligible: true,
    rendersStreamedText: true
  },
  temporal: {
    key: (options2) => options2.inferenceRequestId,
    opening: (_startedAt, accepted) => accepted === void 0 ? void 0 : { anchor: accepted.oldestAcceptedAt, weight: accepted.count },
    writesEligible: false,
    rendersStreamedText: false
  }
};
var errorFreeStep = createCounter(GROK_BOT_ERROR_FREE_STEP_METRIC, {
  labelNames: ["harness", "outcome", "reason"]
});
function createErrorFreeStepTracker(host) {
  const { harness, clock } = host;
  if (harness === void 0) return { beginRun: () => void 0 };
  const step = HARNESS_STEP[harness];
  const labels = { harness };
  let pending;
  function emit(turn, outcome, reason) {
    try {
      errorFreeStep.increment(host.ctx, turn.weight, { ...labels, outcome, reason });
    } catch (error42) {
      logger109.warn(host.ctx, `Error free step observation failed (${errorLogTag(error42)})`);
    }
  }
  function settle(turn, verdict) {
    turn.settled = true;
    turn.timer?.dispose();
    if (pending === turn) pending = void 0;
    emit(turn, verdict.outcome, verdict.reason);
  }
  function pastDeadline(turn) {
    return clock.monotonicNow() >= turn.anchor + ERROR_FREE_STEP_DEADLINE_MS;
  }
  function bindRun(turn) {
    return {
      visibleOutput(kind) {
        if (turn.settled || kind === "text" && !step.rendersStreamedText) return;
        settle(
          turn,
          pastDeadline(turn) ? { outcome: "bad", reason: "deadline" } : { outcome: "good", reason: kind }
        );
      },
      ended(outcome, errorType) {
        if (turn.settled || outcome === "success") return;
        if (pastDeadline(turn)) return settle(turn, { outcome: "bad", reason: "deadline" });
        settle(turn, outcome === "error" ? ERROR_VERDICT[errorType] : ENDED_VERDICT[outcome]);
      }
    };
  }
  return {
    beginRun(options2, startedAt) {
      if (host.isSubagentRunner) return void 0;
      if (options2.requestSource !== void 0 && options2.requestSource !== "turn") return void 0;
      const key = step.key(options2);
      const continued = key !== void 0 && pending?.key === key ? pending : void 0;
      if (options2.continuesTurn === true) {
        return continued === void 0 ? void 0 : bindRun(continued);
      }
      if (options2.isGroupMemberTurn === true || options2.hidden === true || options2.resumeTurn === true || (options2.requestSource ?? host.inheritedRequestSource) !== "turn") {
        return void 0;
      }
      if (continued !== void 0) return bindRun(continued);
      const opening = step.opening(startedAt, host.userMessagesAccepted);
      if (opening === void 0) return void 0;
      const turn = { ...opening, key, timer: void 0, settled: false };
      turn.timer = clock.schedule(
        Math.max(0, opening.anchor + ERROR_FREE_STEP_DEADLINE_MS - startedAt),
        () => {
          if (!turn.settled) settle(turn, { outcome: "bad", reason: "deadline" });
        }
      );
      pending = turn;
      if (step.writesEligible) emit(turn, "eligible", "none");
      return bindRun(turn);
    }
  };
}
