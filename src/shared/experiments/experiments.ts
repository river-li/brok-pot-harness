/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/experiments/experiments.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_unknown_record();
function sandUsageWarningExperimentAssignmentOf(value) {
  if (!isUnknownRecord(value)) return null;
  const { policy, firstThresholdPercent, secondThresholdPercent } = value;
  if (policy !== "none" && policy !== "single" && policy !== "double") return null;
  if (typeof firstThresholdPercent !== "number" || !Number.isFinite(firstThresholdPercent) || firstThresholdPercent <= 0 || firstThresholdPercent >= 100) {
    return null;
  }
  if (typeof secondThresholdPercent !== "number" || !Number.isFinite(secondThresholdPercent) || secondThresholdPercent <= firstThresholdPercent || secondThresholdPercent >= 100) {
    return null;
  }
  return { policy, firstThresholdPercent, secondThresholdPercent };
}
var SAND_GROUP_CHAT_DISCOURAGEMENT_POLICIES = [
  "control",
  "notice",
  "notice_and_hide_create"
];
function parseGroupChatDiscouragementPolicy(value) {
  const normalized = value?.trim().toLowerCase();
  return SAND_GROUP_CHAT_DISCOURAGEMENT_POLICIES.find((policy) => policy === normalized);
}

