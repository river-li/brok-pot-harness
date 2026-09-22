/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/desktop/sidebar-targets.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var OVERVIEW_TAB_IDS = ["overview", "routines", "media", "computer", "members"];
var SIDEBAR_DEEP_LINK_TARGET_IDS = [
  "webhook-url",
  "webhook-key",
  "webhook-header"
];
var SIDEBAR_TARGETS = {
  "webhook-url": { trigger: "webhook", label: "Webhook URL" },
  "webhook-key": { trigger: "webhook", label: "Webhook key" },
  "webhook-header": { trigger: "webhook", label: "Authorization header" }
};
function sidebarTargetTrigger(target) {
  return SIDEBAR_TARGETS[target].trigger;
}
function sidebarTargetLabel(target) {
  return SIDEBAR_TARGETS[target].label;
}

