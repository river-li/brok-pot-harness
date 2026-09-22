init_errors();
var wakeTurn = createCounter("grok_bot.cloud_agent.wake_turn", {
  description: "A cloud agent completion woke Grok Bot and the turn settled: responded (a user-visible message, reaction, or a widget awaiting the user), quiet (nothing visible), or aborted (interrupted, paused, or failed for good); one increment per completion in the wake batch",
  labelNames: ["harness", "outcome", "status", "wake_origin"]
});
var reply = createCounter("grok_bot.cloud_agent.reply", {
  description: "CloudAgent reply action per requested mode (queue, steer, interrupt): accepted by the backend, queued_fallback when a steer landed as the agent's next run instead, or rejected by the backend",
  labelNames: ["harness", "mode", "outcome"]
});
function recordCloudAgentMetric(metrics2, record2) {
  if (metrics2 === void 0) return;
  try {
    record2(metrics2);
  } catch (error42) {
    process.stderr.write(`sand.cloud_agent.metrics_failed error_class=${errorLogTag(error42)}
`);
  }
}
function cloudAgentWakeTurnOutcome(result, options2 = {}) {
  if (options2.signalAborted === true || result.aborted || result.pausedForUpgrade === true) {
    return "aborted";
  }
  return result.sentMessageCount > 0 || result.reacted || result.awaitingUserSelection === true ? "responded" : "quiet";
}
function recordCloudAgentWakeTurns(metrics2, wakes, outcome) {
  recordCloudAgentMetric(metrics2, (scope) => {
    for (const wake of wakes) {
      wakeTurn.increment(scope.ctx, 1, {
        harness: scope.harness,
        outcome,
        status: wake.status,
        wake_origin: wake.wakeOrigin
      });
    }
  });
}
function recordCloudAgentReply(metrics2, args) {
  recordCloudAgentMetric(metrics2, (scope) => {
    reply.increment(scope.ctx, 1, {
      harness: scope.harness,
      mode: args.mode,
      outcome: args.outcome
    });
  });
}
