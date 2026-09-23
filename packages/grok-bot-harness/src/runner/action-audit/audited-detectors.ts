function createAuditedDetectors(deps) {
  const recordOnStampedAuditor = (record2) => deps.actionAuditor()?.record(record2);
  return {
    loopDetection: (options2) => createRunnerLoopDetection({
      ...options2,
      auditDetection: (report, attribution) => recordOnStampedAuditor(
        loopDetectedGuardrailRecord(
          report,
          { agentId: deps.getConversationId(), boxId: deps.resolveBoxId() },
          attribution
        )
      ),
      getConversationId: deps.getConversationId
    }),
    navigation: (auditor, options2) => withNavigationTelemetry(auditor, options2, recordOnStampedAuditor)
  };
}
