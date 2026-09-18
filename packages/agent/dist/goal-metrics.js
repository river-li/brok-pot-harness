var goalCreated = createCounter("agent.goal.created", {
  description: "Counts durable goals created by the agent"
});
var goalContinuationStarted = createCounter("agent.goal.continuation.started", {
  description: "Counts durable goal continuation turns that started"
});
var goalTerminalTransition = createCounter("agent.goal.terminal_transition", {
  description: "Counts durable goals transitioning out of active status",
  labelNames: ["status", "reason"]
});
var goalContinuationsAtTerminal = createHistogram("agent.goal.continuations_at_terminal", {
  description: "Total continuation turns started when a durable goal transitions out of active status",
  labelNames: ["status", "reason"]
});
function recordGoalContinuationStarted(ctx) {
  goalContinuationStarted.increment(ctx);
}
function recordGoalTerminalTransition(ctx, options2) {
  const labels = {
    status: options2.status,
    reason: options2.reason
  };
  goalTerminalTransition.increment(ctx, 1, labels);
  goalContinuationsAtTerminal.histogram(ctx, options2.continuationCount, labels);
}
