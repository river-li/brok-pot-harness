/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/sand-agent-event-tracker.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
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

