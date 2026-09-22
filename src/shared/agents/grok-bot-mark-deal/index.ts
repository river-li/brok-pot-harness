/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/agents/grok-bot-mark-deal/index.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var GROK_BOT_CUSTOM_URL_MARK = { shape: "blob", color: "black" };
function grokBotHasCustomPicture(input) {
  return (input.avatarDataUrl ?? "").length > 0 || (input.avatarVersion ?? "").length > 0;
}

