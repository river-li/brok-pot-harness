/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/telemetry/analytics-service.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_bounded();
function withAutomationRunAnalytics(telemetry, analytics) {
  return {
    startTurn: (start) => telemetry.startTurn(start),
    reportSummaryLifecycle: (report) => telemetry.reportSummaryLifecycle(report),
    reportSummaryPersisted: (report) => telemetry.reportSummaryPersisted(report),
    reportToolCallError: (report) => telemetry.reportToolCallError(report),
    reportToolCallStalled: (report) => telemetry.reportToolCallStalled(report),
    reportToolCallStarted: (report) => telemetry.reportToolCallStarted(report),
    reportToolCallCompleted: (report) => telemetry.reportToolCallCompleted(report),
    reportDynamicToolCall: (report) => telemetry.reportDynamicToolCall(report),
    reportToolCallArgsRejected: (report) => telemetry.reportToolCallArgsRejected(report),
    reportBrowserOperation: (report) => telemetry.reportBrowserOperation(report),
    reportComputerOperation: (report) => telemetry.reportComputerOperation(report),
    reportMessagesTool: (report) => telemetry.reportMessagesTool(report),
    reportAgentError: (report) => telemetry.reportAgentError(report),
    reportBotBlock: (report) => telemetry.reportBotBlock(report),
    reportBotBlockResolved: (report) => telemetry.reportBotBlockResolved(report),
    reportAgentLoopDetected: (report) => telemetry.reportAgentLoopDetected(report),
    reportAgentLoopMitigation: (report) => telemetry.reportAgentLoopMitigation(report),
    reportSiteVisited: (report) => telemetry.reportSiteVisited(report),
    reportDaemonPing: (report) => telemetry.reportDaemonPing(report),
    reportBoxBootStage: (report) => telemetry.reportBoxBootStage(report),
    reportExecDaemonRestart: (report) => telemetry.reportExecDaemonRestart(report),
    reportSupervisorRestart: (report) => telemetry.reportSupervisorRestart(report),
    reportTurnInterrupt: (report) => telemetry.reportTurnInterrupt(report),
    reportTurnAwait: (report) => telemetry.reportTurnAwait(report),
    reportAgentDelete: (report) => telemetry.reportAgentDelete(report),
    reportTurnRetry: (report) => telemetry.reportTurnRetry(report),
    reportUserMessageReceived: (report) => telemetry.reportUserMessageReceived(report),
    reportClosingSendNudge: (report) => telemetry.reportClosingSendNudge(report),
    reportSubagentRevival: (report) => telemetry.reportSubagentRevival(report),
    reportSubagentStalled: (report) => telemetry.reportSubagentStalled(report),
    reportGroupMemberTurnOutcome: (report) => telemetry.reportGroupMemberTurnOutcome(report),
    reportShellRevival: (report) => telemetry.reportShellRevival(report),
    reportComputerUseUsage: (report) => telemetry.reportComputerUseUsage(report),
    reportComputerUseDispatch: (report) => telemetry.reportComputerUseDispatch(report),
    reportTtft: (report) => telemetry.reportTtft(report),
    reportSendDispatch: (report) => telemetry.reportSendDispatch(report),
    reportQueueAccepted: (report) => telemetry.reportQueueAccepted(report),
    reportQueueDequeued: (report) => telemetry.reportQueueDequeued(report),
    reportQueueWatchdog: (report) => telemetry.reportQueueWatchdog(report),
    reportWedgedRunReap: (report) => telemetry.reportWedgedRunReap(report),
    reportAckObligation: (report) => {
      analytics.trackEvent("sand.ack.obligation", {
        conversation_id: report.conversationId,
        outcome: report.outcome,
        ...report.ageMs != null ? { age_ms: report.ageMs } : {},
        ...report.coalescedCount != null ? { coalesced_count: report.coalescedCount } : {},
        ...report.redriveAttempts != null ? { redrive_attempts: report.redriveAttempts } : {},
        ...report.timeToFirstVisibleAckMs != null ? { time_to_first_visible_ack_ms: report.timeToFirstVisibleAckMs } : {},
        ...report.interruptToReplacementAckMs != null ? { interrupt_to_replacement_ack_ms: report.interruptToReplacementAckMs } : {},
        ...report.reason != null ? { reason: report.reason } : {}
      });
      telemetry.reportAckObligation(report);
    },
    reportPendingWake: (report) => telemetry.reportPendingWake(report),
    reportTurnUsage: (report) => telemetry.reportTurnUsage(report),
    reportPromptPrefixDiff: (report) => telemetry.reportPromptPrefixDiff(report),
    reportTurnEmptyDelivery: (report) => telemetry.reportTurnEmptyDelivery(report),
    reportJournalOutcome: (report) => telemetry.reportJournalOutcome(report),
    reportAutoReviewExpireSweepFailed: (report) => telemetry.reportAutoReviewExpireSweepFailed(report),
    reportAutomationLifecycle: (report) => telemetry.reportAutomationLifecycle(report),
    reportAutomationFireDropped: (report) => telemetry.reportAutomationFireDropped(report),
    reportAutomationAgentGoneRecovered: (report) => telemetry.reportAutomationAgentGoneRecovered(report),
    reportAutomationRun: (report) => {
      analytics.trackEvent("sand.automation.run", {
        agent_id: report.conversationId,
        automation_id: report.automationId,
        trigger: brandLiteralEnum(report.trigger),
        outcome: report.outcome,
        is_group: report.isGroup,
        ...report.sentMessageCount != null ? { sent_message_count: report.sentMessageCount } : {}
      });
      telemetry.reportAutomationRun(report);
    }
  };
}

