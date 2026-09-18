init_zod();
var SAND_CARRY_OVER_TOOL_NAME = "propose_carry_over";
var SAND_CARRY_OVER_SUBAGENT_TYPE = "carryOver";
function isCarryOverSubagentType(subagentType) {
  return subagentType === SAND_CARRY_OVER_SUBAGENT_TYPE;
}
var SAND_CARRY_OVER_SUGGESTIONS_MAX = 3;
var REASON_TARGET_CHARS = 80;
var REASON_MAX_CHARS = 120;
var PICK_MAX = 100;
var pickName = external_exports.string().trim().min(1).max(128);
var pickList = external_exports.array(pickName).max(PICK_MAX).default([]);
var pluginPick = external_exports.object({
  name: pickName.describe("The plugin's id or display name, exactly as listed in the inventory."),
  reason: external_exports.string().trim().max(REASON_MAX_CHARS).describe(
    `One short line on what this bot uses it for, under ${REASON_TARGET_CHARS} characters, no trailing period, for example "Routine Watch #deploys posts there".`
  )
});
var pluginPickList = external_exports.array(pluginPick).max(PICK_MAX).default([]);
var carryOverParameters = external_exports.object({
  secrets: pickList.describe(
    "Secret names from the inventory that the team bot's skills or routines use, exactly as listed."
  ),
  plugins: pluginPickList.describe(
    "Plugins from the inventory the team bot's job needs, only the ones you are sure of and five at most, each with its reason; they come ticked on the card."
  ),
  suggestions: pluginPickList.describe(
    `Up to ${SAND_CARRY_OVER_SUGGESTIONS_MAX} more plugins from the inventory the team bot would likely need next, each with its reason; they come unticked under the picks, and none is fine.`
  )
});
function firstPickOfEachName(picks) {
  const seen = /* @__PURE__ */ new Set();
  return picks.filter((pick2) => {
    const key = pick2.name.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
function carryOverProposalOf(args) {
  const plugins = firstPickOfEachName(args.plugins);
  const picked = new Set(plugins.map((pick2) => pick2.name.toLowerCase()));
  const suggestions = firstPickOfEachName(args.suggestions).filter((pick2) => !picked.has(pick2.name.toLowerCase())).slice(0, SAND_CARRY_OVER_SUGGESTIONS_MAX);
  const reasons = {};
  for (const pick2 of [...plugins, ...suggestions]) {
    if (pick2.reason.length > 0) reasons[pick2.name] = pick2.reason;
  }
  return {
    secrets: [...new Set(args.secrets)],
    plugins: plugins.map((pick2) => pick2.name),
    suggestions: suggestions.map((pick2) => pick2.name),
    reasons
  };
}
function createCarryOverTool(deps) {
  return defineCommunicateTool(deps, {
    id: "PLATFORM_ACTION",
    name: SAND_CARRY_OVER_TOOL_NAME,
    description: `Propose which of the owner's plugins and secrets (by name) the team bot should have, from the inventory in your instructions. The plugins come ticked on the owner's card and up to ${SAND_CARRY_OVER_SUGGESTIONS_MAX} suggestions come unticked, each with a short reason; the owner decides on the card and their desktop does the copying, so this call copies nothing and you never see a secret value.`,
    parameters: carryOverParameters,
    describeActivity: () => ({ detail: "propose" }),
    execute: async (_ctx, args, d) => await d.onProposal(carryOverProposalOf(args))
  });
}
