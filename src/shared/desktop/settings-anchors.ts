/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/desktop/settings-anchors.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var ANCHOR_ROWS = [
  ["account", "general"],
  ["theme", "general"],
  ["accent", "general"],
  ["language", "general"],
  ["microphone", "general"],
  ["hardware-acceleration", "general"],
  ["hardware-acceleration-restart", "general"],
  ["network-debugger", "general"],
  ["notification-sound-enabled", "general"],
  ["notification-sound", "general"],
  ["model", "general"],
  ["timezone", "general"],
  ["local-execution", "general"],
  ["computers", "computer"],
  ["chrome-cookie-import", "computer"],
  ["messages", "computer"],
  ["messages-send-without-asking", "computer"],
  ["messages-allowed-recipients", "computer"],
  ["auto-review", "general"],
  ["auto-review-rules", "general"],
  ["security-keys", "general"],
  ["usage", "usage"],
  ["plan", "usage"],
  ["cancel-trial", "usage"],
  ["on-demand", "usage"],
  ["billing", "usage"],
  ["egress", "computer"],
  ["update-status", "updates"],
  ["update-channel", "updates"],
  ["automatic-updates", "updates"],
  ["update-computer", "updates"],
  ["reset-computer", "updates"]
];
var SETTINGS_DEEP_LINK_ANCHOR_IDS = ANCHOR_ROWS.map(
  ([anchor]) => anchor
);
var SECTION_BY_ANCHOR = Object.fromEntries(ANCHOR_ROWS);
function settingsAnchorSection(anchor, machines) {
  if (anchor === "local-execution" && machines != null && machines.length > 0) return "computer";
  return SECTION_BY_ANCHOR[anchor];
}

