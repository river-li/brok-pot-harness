/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/tools/sand-subscription-usage-tool.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_dist();
init_dist3();
init_zod();
var logger104 = createLogger("sand:check-subscription-usage-tool");
var SAND_CHECK_SUBSCRIPTION_USAGE_TOOL_NAME = "CheckSubscriptionUsage";
var USAGE_UNAVAILABLE = "Usage information is unavailable right now.";
function formatUtcTimestamp(ms2) {
  return new Date(ms2).toISOString().replace(/\.\d{3}Z$/, "Z");
}
function formatCountdown(verb, atMs, nowMs) {
  const remaining = formatDurationMs(atMs - nowMs, { alwaysShowSeconds: false }) ?? "0s";
  return `${verb} in ${remaining} (${formatUtcTimestamp(atMs)}).`;
}
function formatPlanName(usage) {
  if (usage.cursorPlan === null) {
    return usage.isTeamSeat ? "Plan: team seat" : null;
  }
  const seat = usage.isTeamSeat ? " (team seat)" : "";
  return `Plan: Cursor ${usage.cursorPlan}${seat}`;
}
function formatPlanLine(usage) {
  const plan = formatPlanName(usage);
  if (usage.superGrokPlan === null) {
    return plan;
  }
  const funding = `Included Grok Bot usage is funded by ${usage.superGrokPlan}.`;
  return plan === null ? funding : `${plan}. ${funding}`;
}
function formatUsageLine(usage) {
  if (usage.usagePercent === null) {
    return null;
  }
  const shown = Math.min(100, Number(usage.usagePercent.toFixed(1)));
  return `Included usage this cycle: ${shown}% used`;
}
function formatOnDemandLine(usage) {
  if (usage.onDemand === null || usage.usesPooledEnterpriseAllowance) {
    return null;
  }
  const { enabled, dashboardUrl } = usage.onDemand;
  const status = enabled ? "On-demand usage is enabled: requests past the included allowance bill to the user's on-demand balance until their spend limit is reached." : "On-demand usage is available but not enabled. Without it, requests stop at the included allowance until the cycle resets.";
  if (dashboardUrl === null) {
    return status;
  }
  return enabled ? `${status} They can check or change the limit at ${dashboardUrl}` : `${status} The user can enable it at ${dashboardUrl}`;
}
function formatTrialLine(trialExpiresAtMs, nowMs) {
  if (trialExpiresAtMs === null) {
    return null;
  }
  return trialExpiresAtMs > nowMs ? formatCountdown("Trial expires", trialExpiresAtMs, nowMs) : `Trial expired at ${formatUtcTimestamp(trialExpiresAtMs)}.`;
}
function formatResetLine(nextResetMs, nowMs) {
  if (nextResetMs === null || nextResetMs <= nowMs) {
    return null;
  }
  return formatCountdown("Cycle resets", nextResetMs, nowMs);
}
function formatCycleUsage(usage, nowMs) {
  const lines2 = [
    formatPlanLine(usage),
    formatUsageLine(usage),
    formatOnDemandLine(usage),
    formatTrialLine(usage.trialExpiresAtMs, nowMs),
    formatResetLine(usage.nextResetMs, nowMs)
  ].filter((line) => line !== null);
  return lines2.length === 0 ? USAGE_UNAVAILABLE : lines2.join("\n");
}
function createCheckSubscriptionUsageTool(deps) {
  return defineCommunicateTool(deps, {
    id: "CHECK_SUBSCRIPTION_USAGE",
    name: SAND_CHECK_SUBSCRIPTION_USAGE_TOOL_NAME,
    description: "Report the user's Grok Bot subscription plan, how much of this cycle's included usage is already used, whether on-demand usage is enabled, and when the cycle resets. Call this when the user asks about their subscription, plan, usage, limits, on-demand spend, or when their usage resets. Takes no parameters.",
    parameters: external_exports.object({}),
    execute: async (ctx, _args, d) => {
      let usage;
      try {
        usage = await d.getCycleUsage();
      } catch (error3) {
        logger104.warn(ctx, `CheckSubscriptionUsage lookup failed (${errorLogTag(error3)})`);
        return USAGE_UNAVAILABLE;
      }
      return formatCycleUsage(usage, Date.now());
    }
  });
}

