var SAND_BOT_TEMPLATE_VISIBILITIES = ["public", "team"];
var SAND_SHARE_BOT_EXPORT_POLICY_DEFAULT = "team_only";
function isSandShareBotExportPolicy(value) {
  return value === "all" || value === "team_only" || value === "none";
}
function isSandBotTemplateVisibility(value) {
  return value === "public" || value === "team";
}
function sandShareBotExportPolicyOf(value) {
  return isSandShareBotExportPolicy(value?.policy) ? value.policy : SAND_SHARE_BOT_EXPORT_POLICY_DEFAULT;
}
function resolvedShareScopeHasTeam(args) {
  return args.serverHasTeam ?? args.selectedTeamId != null;
}
function resolveBotTemplateShareScope(args) {
  if (args.policy === "none") return { kind: "disabled" };
  if (args.parentVisibility != null) {
    return { kind: "current", visibility: args.parentVisibility };
  }
  if (args.hasTeam && args.policy === "all") {
    return { kind: "choose" };
  }
  return {
    kind: "forced",
    visibility: args.hasTeam ? "team" : "public"
  };
}
function grokBotTemplateShareUrl(shareId) {
  return `https://x.ai/bot/${shareId}`;
}
