function createSandAgentEventTracker(options2) {
  return {
    ...options2.fallback,
    trackSummarizationTriggered: (ctx, event) => {
      options2.telemetry.reportSummaryPersisted({
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
      options2.telemetry.reportSummaryLifecycle({
        ...event,
        conversationId: getConversationId(ctx) ?? options2.getConversationId(),
        requestId: getRequestId(ctx)
      });
    }
  };
}
