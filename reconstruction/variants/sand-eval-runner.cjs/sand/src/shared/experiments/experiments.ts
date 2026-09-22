/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/experiments/experiments.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var SAND_GROUP_CHAT_DISCOURAGEMENT_POLICIES = [
  "control",
  "notice",
  "notice_and_hide_create"
];
function parseGroupChatDiscouragementPolicy(value) {
  const normalized = value?.trim().toLowerCase();
  return SAND_GROUP_CHAT_DISCOURAGEMENT_POLICIES.find((policy) => policy === normalized);
}

