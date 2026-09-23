function isRootProjectDetails(projectDetails) {
  return projectDetails !== void 0 && projectDetails !== null && projectDetails.subagent === void 0 && projectDetails.sideChat === void 0;
}
var STAGED_PROJECT_INIT_DESCRIPTION_MAX_CHARS;
var init_project_conversation = __esm({
  "../packages/constants/dist/project-conversation.js"() {
    "use strict";
    STAGED_PROJECT_INIT_DESCRIPTION_MAX_CHARS = 600;
  }
});
