var DEBUG_SUBAGENT_RESULT_SUFFIX = `The debug subagent has finished.
- After reproducing the bug: "Issue reproduced, please proceed. <additional notes>"
- To clean up debug logs: "<The issue has been fixed.> Please clean up the instrumentation."`;
var DEBUG_SUBAGENT_CONFIG = {
  subagent_type: new SubagentType({
    type: {
      case: "debug",
      value: new SubagentTypeDebug()
    }
  }),
  description: "Debug specialist that uses hypothesis-driven investigation with instrumentation logs. Use when investigating reproducible bugs with non-obvious root causes. The subagent will instrument code and provide reproduction steps. After reproduction, it will analyze logs, and repeat until the root cause is found and fixed. This subagent is stateful and auto-resumes from previous context.",
  preserveTaskTool: false,
  systemReminder: () => renderContent(DebugSubagentSystemPrompt()),
  resumeModeOverride: SubagentResumeMode.LAST_AGENT_SAME_TYPE,
  resultSuffix: DEBUG_SUBAGENT_RESULT_SUFFIX
  // Uses parent's tools - no override needed (needs file read/write/delete)
  // Uses parent's model - no default override
};
function createDebugSubagentConfig() {
  return DEBUG_SUBAGENT_CONFIG;
}
