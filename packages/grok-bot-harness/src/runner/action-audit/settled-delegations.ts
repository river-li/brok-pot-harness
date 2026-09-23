function settledDelegationsOf(completions) {
  const settled = [];
  for (const completion of completions) {
    if (completion.subagentType === "shell" || completion.automationRunUuid !== void 0) continue;
    const delegationKind = settledDelegationKind(completion);
    if (delegationKind === void 0) continue;
    settled.push({
      delegationKind,
      targetId: completion.subagentAgentId,
      toolCallId: completion.toolCallId,
      outcome: completion.status === "completed" ? "success" : "error",
      ...completion.durationMs === void 0 ? {} : { durationMs: completion.durationMs }
    });
  }
  return settled;
}
function settledDelegationKind(completion) {
  if (completion.subagentType !== "cursor-agent") return "subagent_spawn";
  switch (completion.startedBy) {
    case "launch":
      return "cloud_agent_launch";
    case "reply":
      return "cloud_agent_followup";
    case void 0:
      return void 0;
  }
}
