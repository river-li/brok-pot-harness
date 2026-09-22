/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/constants/dist/cloud-agent.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function isComputerUseGuidedSkill(skill) {
  var _a19, _b2;
  return COMPUTER_USE_GUIDED_SKILL_PATTERN.test(`${(_a19 = skill.fullPath) !== null && _a19 !== void 0 ? _a19 : ""}
${(_b2 = skill.description) !== null && _b2 !== void 0 ? _b2 : ""}`);
}
var BACKEND_REQUEST_BODY_SIZE_LIMIT_BYTES, ENV_SETUP_SKILL_ID, ENV_SETUP_MANAGED_SKILL_DIRECTORY, ENV_SETUP_MANAGED_SKILL_PATH, CLOUD_ONBOARDING_SKILL_ID, CLOUD_ONBOARDING_MANAGED_SKILL_PATH, CHANGE_MONITOR_ONBOARDING_SKILL_ID, CHANGE_MONITOR_ONBOARDING_MANAGED_SKILL_PATH, WALKTHROUGH_ARTIFACTS_SKILL_ID, WALKTHROUGH_ARTIFACTS_MANAGED_SKILL_PATH, WALKTHROUGH_ARTIFACTS_SECTION_HEADING, COMPUTER_USE_GUIDED_SKILL_PATTERN, CLOUD_AGENT_INJECTED_SECRET_NAMES_ENV_VAR, CLOUD_AGENT_SINGLE_REPO_WORKSPACE_ROOT, CLOUD_AGENT_ARTIFACTS_DIR;
var init_cloud_agent = __esm({
  "../packages/constants/dist/cloud-agent.js"() {
    "use strict";
    BACKEND_REQUEST_BODY_SIZE_LIMIT_BYTES = 5e7;
    ENV_SETUP_SKILL_ID = "env-setup";
    ENV_SETUP_MANAGED_SKILL_DIRECTORY = `/.cursor/skills-cursor/${ENV_SETUP_SKILL_ID}/`;
    ENV_SETUP_MANAGED_SKILL_PATH = `${ENV_SETUP_MANAGED_SKILL_DIRECTORY}SKILL.md`;
    CLOUD_ONBOARDING_SKILL_ID = "cloud-onboarding";
    CLOUD_ONBOARDING_MANAGED_SKILL_PATH = `/.cursor/skills-cursor/${CLOUD_ONBOARDING_SKILL_ID}/SKILL.md`;
    CHANGE_MONITOR_ONBOARDING_SKILL_ID = "change-monitor-onboarding";
    CHANGE_MONITOR_ONBOARDING_MANAGED_SKILL_PATH = `/.cursor/skills-cursor/${CHANGE_MONITOR_ONBOARDING_SKILL_ID}/SKILL.md`;
    WALKTHROUGH_ARTIFACTS_SKILL_ID = "walkthrough-artifacts";
    WALKTHROUGH_ARTIFACTS_MANAGED_SKILL_PATH = `/.cursor/skills-cursor/${WALKTHROUGH_ARTIFACTS_SKILL_ID}/SKILL.md`;
    WALKTHROUGH_ARTIFACTS_SECTION_HEADING = "Creating & Uploading Walkthrough Artifacts";
    COMPUTER_USE_GUIDED_SKILL_PATTERN = /computer[-_ ]use|\bcua\b/i;
    CLOUD_AGENT_INJECTED_SECRET_NAMES_ENV_VAR = "CLOUD_AGENT_INJECTED_SECRET_NAMES";
    CLOUD_AGENT_SINGLE_REPO_WORKSPACE_ROOT = "/workspace";
    CLOUD_AGENT_ARTIFACTS_DIR = "/opt/cursor/artifacts/";
  }
});

