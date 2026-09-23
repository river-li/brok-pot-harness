function composeRunnerActionAudit(options2, initiatedBy, navigation) {
  const sequencer = options2.actionAuditSequencer ?? createActionAuditSequencer();
  const audited = navigation(options2.actionAuditor, options2.navigationTelemetry);
  const sequenced = audited && withEventSequence(audited, sequencer);
  const actionAuditor = sequenced && withInitiatedBy(sequenced, initiatedBy);
  const toolDecisionAudit = actionAuditor === void 0 ? void 0 : new ToolDecisionAudit();
  const toolTargets = actionAuditor === void 0 ? void 0 : new ToolTargetLedger();
  const classifier = options2.autoReviewClassifierExecutor;
  return {
    sequencer,
    actionAuditor,
    autoReviewClassifierExecutor: classifier === void 0 || toolDecisionAudit === void 0 ? classifier : withToolDecisions(classifier, toolDecisionAudit),
    toolDecisionAudit,
    toolTargets,
    withLedgers: (ctx) => withDecisionLedger(ctx, toolDecisionAudit).with(toolTargetLedgerKey, toolTargets)
  };
}
