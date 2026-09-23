function createSandAgentEventTracker(options2) {
  return {
    ...options2.fallback,
    trackSummarizationTriggered: (ctx, event) => {
      options2.telemetry?.reportSummaryPersisted({
        conversationId: getConversationId(ctx) ?? options2.getConversationId(),
        requestId: getRequestId(ctx),
        summaryLifecycleId: event.summaryLifecycleId,
        summarizationModelId: event.summarizationModelId,
        mainModelId: event.mainModelId,
        summarizerType: event.summarizerType,
        triggerTokensUsed: event.triggerTokensUsed,
        triggerTokensMax: event.triggerTokensMax
      });
    },
    trackSummaryLifecycle: (ctx, event) => {
      options2.telemetry?.reportSummaryLifecycle({
        ...event,
        conversationId: getConversationId(ctx) ?? options2.getConversationId(),
        requestId: getRequestId(ctx)
      });
    },
    trackSkillApplied: (ctx, skill) => {
      options2.fallback.trackSkillApplied(ctx, skill);
      const auditor = options2.actionAuditor?.();
      if (auditor === void 0) return;
      const action = skillActivatedAction(skill, options2.skills?.() ?? []);
      if (action === void 0) return;
      const agentId = options2.getConversationId();
      const laneConversationId = getConversationId(ctx);
      const turnId = getRequestId(ctx);
      auditor.record({
        agentId,
        turnId,
        rootTurnId: getRootParentRequestId(ctx) ?? turnId,
        subagentId: laneConversationId !== void 0 && laneConversationId !== agentId ? laneConversationId : void 0,
        boxId: options2.resolveBoxId?.(),
        toolCallId: skill.toolCallId,
        occurredAtMs: Date.now(),
        action
      });
    }
  };
}
