/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/bot-templates/bot-template-import.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_errors();
function importedTemplateSetupFromRecipe(recipe, options2) {
  return {
    kind: "recipe",
    automations: recipe.routines,
    plugins: recipe.plugins,
    memories: recipe.memory,
    skills: recipe.skills,
    ...options2?.gettingStartedTrusted === true ? { isTrustedSource: true } : {},
    ...recipe.gettingStarted === void 0 || options2?.gettingStartedTrusted !== true ? {} : { gettingStartedSkill: recipe.gettingStarted.skill }
  };
}
var NOTHING_LEFT_AFTER_SERVER_FOLDED_SETUP = {
  kind: "recipe",
  automations: [],
  plugins: [],
  memories: [],
  skills: [],
  isSetupSendSuppressed: true
};
function importedTemplateSetupForHarness(setup, harness, options2) {
  if (harness !== "temporal") return setup;
  if (setup.kind === "unavailable") {
    return options2?.isServerSetupConfirmed === true ? NOTHING_LEFT_AFTER_SERVER_FOLDED_SETUP : setup;
  }
  const serverOwnedSkillsOmitted = { ...setup, skills: [] };
  if (options2?.isServerSetupConfirmed === true) {
    return { ...serverOwnedSkillsOmitted, isSetupSendSuppressed: true };
  }
  if (serverOwnedSkillsOmitted.automations.length > 0 || serverOwnedSkillsOmitted.plugins.length > 0 || serverOwnedSkillsOmitted.memories.length > 0) {
    return serverOwnedSkillsOmitted;
  }
  return { ...serverOwnedSkillsOmitted, isSetupSendSuppressed: true };
}
var BOT_TEMPLATE_IMPORT_ACCESS_DENIED_CODE = "bot_template_import_access_denied";
var BotTemplateImportAccessDeniedError = class extends SandDomainError {
  name = "BotTemplateImportAccessDeniedError";
  code = BOT_TEMPLATE_IMPORT_ACCESS_DENIED_CODE;
  constructor() {
    super(BOT_TEMPLATE_IMPORT_ACCESS_DENIED_CODE);
  }
};
function botTemplatePostcardText(source) {
  return source.description?.trim() ?? "";
}

