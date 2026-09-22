/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/cycle-usage/cycle-usage-service.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function timestampMs(value) {
  if (value === void 0) return null;
  const ms2 = value.toDate().getTime();
  return Number.isFinite(ms2) && ms2 > 0 ? ms2 : null;
}
function onDemandFromSettings(settings) {
  if (settings === void 0 || !settings.visible || !settings.eligible) return null;
  return {
    enabled: settings.enabled,
    dashboardUrl: settings.dashboardUrl.length > 0 ? settings.dashboardUrl : null
  };
}
function nonEmpty2(value) {
  return value !== void 0 && value.length > 0 ? value : null;
}
function cycleUsageFromStatusResponse(response) {
  const usagePercent = response.usagePercent;
  const grokPlanLabel = nonEmpty2(response.grokPlanLabel);
  return {
    cursorPlan: nonEmpty2(response.cursorPlanName),
    superGrokPlan: grokPlanLabel === GROK_BOT_PLAN_LABEL ? null : grokPlanLabel,
    usagePercent: usagePercent !== void 0 && Number.isFinite(usagePercent) ? usagePercent : null,
    nextResetMs: timestampMs(response.nextResetTimestampUtc),
    trialExpiresAtMs: timestampMs(response.sandTrialExpiresAt),
    isTeamSeat: response.isTeamSeat,
    usesPooledEnterpriseAllowance: response.usesPooledEnterpriseAllowance,
    onDemand: onDemandFromSettings(response.onDemandSettings)
  };
}

