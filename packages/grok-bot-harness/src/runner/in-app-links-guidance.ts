/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/in-app-links-guidance.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var PROMPT_EXCLUDED_ANCHORS = [
  "messages",
  "messages-send-without-asking",
  "messages-allowed-recipients",
  "model"
];
var LINKABLE_SETTINGS_ANCHOR_IDS = SETTINGS_DEEP_LINK_ANCHOR_IDS.filter((anchor) => !PROMPT_EXCLUDED_ANCHORS.includes(anchor));
function taughtSettingsAnchorIds(visibility) {
  return LINKABLE_SETTINGS_ANCHOR_IDS.filter((anchor) => {
    if (anchor === "chrome-cookie-import") return visibility.chromeCookieImport === true;
    if (anchor === "egress") return visibility.boxEgressTunnel === true;
    return true;
  });
}
var UPDATE_COMPUTER = "update-computer";
var RESET_COMPUTER = "reset-computer";
function routeTemplate(route, placeholder) {
  return `${GROK_BOT_DEEP_LINK_SCHEME}://${SAND_DEEP_LINK_AUTHORITY}${sandDeepLinks.routes[route].path}?id=${placeholder}`;
}
var LEAD = `The chat renders Grok Bot deep links as pills that open the target in the app. Write [Update Track](${buildSandSettingsDeepLinkUrl("update-channel")}), not "Settings, Updates, Update Track".`;
var RECOVERY_NOTE = `Stuck or reset? Link ${UPDATE_COMPUTER} first, then ${RESET_COMPUTER}.`;
var SIDEBAR_URL = sandDeepLinks.buildUrl("sidebar", {});
function routeGuidance(taught) {
  return {
    settings: `A settings row is [label](${routeTemplate("settings", "<anchor>")}), where <anchor> is one of: ${taught.join(", ")}. ${RECOVERY_NOTE}`,
    "plugin-add": `A plugin's page is [label](${routeTemplate("plugin-add", "<plugin id from SearchPlugins>")}).`,
    sidebar: `Use [label](${SIDEBAR_URL}?agent=<teammate id>&tab=<${OVERVIEW_TAB_IDS.join("|")}>) for another bot; omit agent for this bot.`
  };
}
var TAIL = "Use the target's real name as the label, as a noun in the sentence. The chat shows that name in place of your label. Your label shows only while the target loads, on hover, and in plain text. Write only listed anchors, exactly in this form, only in the Grok Bot chat, never through a connector.";
function inAppLinksGuidance(visibility = {}) {
  const taught = taughtSettingsAnchorIds(visibility);
  const guidanceByRoute = routeGuidance(taught);
  const routeGuidanceLines = TRANSCRIPT_DEEP_LINK_ROUTES.filter((route) => route !== "sidebar").map(
    (route) => guidanceByRoute[route]
  );
  return [LEAD, ...routeGuidanceLines, TAIL, guidanceByRoute.sidebar].join(" ");
}

