/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/constants/dist/project-conversation.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function isRootProjectDetails(projectDetails) {
  return projectDetails !== void 0 && projectDetails !== null && projectDetails.subagent === void 0 && projectDetails.sideChat === void 0;
}
var STAGED_PROJECT_PORTFOLIO_INSTRUCTION;
var init_project_conversation = __esm({
  "../packages/constants/dist/project-conversation.js"() {
    "use strict";
    STAGED_PROJECT_PORTFOLIO_INSTRUCTION = [
      "At most 3 projects total, most valuable first.",
      "More than one project may use the same group only when each is a distinct, non-overlapping durable work area with its own evidence.",
      "A chatId may appear in at most one project across the whole response.",
      "Do not create an umbrella project that blends otherwise distinct work areas.",
      "Do not force a second or third project when its evidence is weak; omit it."
    ].join("\n");
  }
});

