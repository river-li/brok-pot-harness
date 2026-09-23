init_errors();
var wakeTurn = createCounter("grok_bot.cloud_agent.wake_turn", {
  description: "A cloud agent completion woke Grok Bot and the turn settled: responded (a user-visible message, reaction, or a widget awaiting the user), quiet (nothing visible), or aborted (interrupted, paused, or failed for good); one increment per completion in the wake batch",
  labelNames: ["harness", "outcome", "status", "wake_origin"]
});
var reply = createCounter("grok_bot.cloud_agent.reply", {
  description: "CloudAgent reply action per requested mode (queue, steer, interrupt): accepted by the backend, queued_fallback when a steer landed as the agent's next run instead, or rejected by the backend",
  labelNames: ["harness", "mode", "outcome"]
});
var artifactAttached = createCounter("grok_bot.cloud_agent.artifact_attached", {
  description: "A copied cloud agent artifact (a file under the bot's /workspace/cloud-agent-artifacts/<run>/ dir) went out as an image or attachment on a message the bot sent; one increment per attached file, the reply-side twin of artifacts_cited",
  labelNames: ["harness", "kind"]
});
var artifactCompletionAttached = createCounter(
  "grok_bot.cloud_agent.artifact_completion_attached",
  {
    description: "First message in a turn that attached at least one copied artifact of a given cloud agent run; one increment per run per turn, the reply-side twin of artifact_completion_copied",
    labelNames: ["harness"]
  }
);
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
function recordCloudAgentArtifactAttachments(metrics2, sources, attachedRunIds) {
  recordCloudAgentMetric(metrics2, (scope) => {
    for (const source of sources) {
      const citation = cloudAgentArtifactCitation(source);
      if (citation === null) continue;
      artifactAttached.increment(scope.ctx, 1, { harness: scope.harness, kind: citation.kind });
      if (!attachedRunIds.has(citation.bcId)) {
        attachedRunIds.add(citation.bcId);
        artifactCompletionAttached.increment(scope.ctx, 1, { harness: scope.harness });
      }
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
