var NOOP_AUDITOR = { record: () => {
} };
function withNavigationTelemetry(auditor, options2, recordGuardrailOnStampedAuditor) {
  if (options2 === void 0) return auditor;
  const { telemetry } = options2;
  const lookupSigned = options2.lookupWebBotAuthSigned ?? (() => void 0);
  const botBlockAuditor = withBotBlockDetection(
    auditor ?? NOOP_AUDITOR,
    (hit, record2) => {
      if (hit.wallEpisodeStarted === true) {
        recordGuardrailOnStampedAuditor(botBlockedGuardrailRecord(hit, record2));
      }
      telemetry.reportBotBlock({
        conversationId: record2.agentId,
        family: hit.family,
        confidence: hit.confidence,
        blockedHost: hit.blockedHost,
        blockedUrl: hit.blockedUrl,
        webBotAuthSigned: hit.webBotAuthSigned,
        webBotAuthSignatureSource: hit.webBotAuthSignatureSource,
        wallEpisodeId: hit.wallEpisodeId,
        turnId: record2.turnId,
        subagentId: record2.subagentId
      });
      options2.onBotBlock?.(hit, record2);
    },
    lookupSigned,
    (resolution, record2) => {
      telemetry.reportBotBlockResolved({
        conversationId: record2.agentId,
        family: resolution.family,
        blockedHost: resolution.blockedHost,
        durationMs: resolution.durationMs,
        wallEpisodeId: resolution.wallEpisodeId,
        resolutionKind: resolution.resolutionKind,
        resolvedSameTurn: resolution.resolvedSameTurn,
        subagentId: record2.subagentId
      });
      options2.onBotBlockResolved?.(resolution, record2);
    }
  );
  return withSiteVisitTracking(
    botBlockAuditor,
    (visit2, record2) => {
      telemetry.reportSiteVisited({
        conversationId: record2.agentId,
        siteBucket: visit2.siteBucket,
        webBotAuthSigned: visit2.webBotAuthSigned,
        wallEpisodeId: visit2.wallEpisodeId,
        requestId: record2.turnId,
        rootParentRequestId: record2.rootTurnId,
        subagentId: record2.subagentId
      });
      options2.onSiteVisited?.(visit2, record2);
    },
    (origin) => lookupSigned(origin)?.signed,
    botBlockAuditor.wallEpisodeForNavigation
  );
}
