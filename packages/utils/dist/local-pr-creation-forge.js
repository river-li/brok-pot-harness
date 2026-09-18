function shouldRerenderUserInfoForLocalPrCreationForge(args) {
  if (args.forgeRuleContent === void 0 || args.forgeRuleContent.length === 0) {
    return [
      LOCAL_PR_CREATION_FORGE_GUIDANCE_HEADER,
      LEGACY_LOCAL_PR_CREATION_FORGE_GUIDANCE_HEADER
    ].some((header) => args.userInfoContent.includes(`<user_rule>${header}`));
  }
  return !args.userInfoContent.includes(`<user_rule>${args.forgeRuleContent}</user_rule>`);
}
var LOCAL_PR_CREATION_FORGE_RULE_PATH, LOCAL_PR_CREATION_FORGE_GUIDANCE_HEADER, LEGACY_LOCAL_PR_CREATION_FORGE_GUIDANCE_HEADER, FORGE_CLI_GLOSSARY;
var init_local_pr_creation_forge = __esm({
  "../packages/utils/dist/local-pr-creation-forge.js"() {
    "use strict";
    LOCAL_PR_CREATION_FORGE_RULE_PATH = "cursor://internal/local-pr-creation-forge";
    LOCAL_PR_CREATION_FORGE_GUIDANCE_HEADER = "Preferred pull request host:";
    LEGACY_LOCAL_PR_CREATION_FORGE_GUIDANCE_HEADER = "Pull request forge (Creation Provider):";
    FORGE_CLI_GLOSSARY = [
      "Cursor can open new pull requests on either:",
      "- GitHub, with the `gh` CLI (`gh pr create`)",
      "- Cursor Origin (Cursor's own pull-request host \u2014 not the git remote named `origin`), with the `origin` CLI (`origin pr create`)",
      "Prefer `gh` or `origin` over `gt`. If you use `gt`, you MUST pass `--github` or `--origin` for the intended host."
    ].join("\n");
  }
});
