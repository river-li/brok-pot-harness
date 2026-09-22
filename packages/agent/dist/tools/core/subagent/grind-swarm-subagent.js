/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/core/subagent/grind-swarm-subagent.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
var path22 = __toESM(require("node:path"), 1);
init_subagents_pb();

// @recovered-fragment 2/2
var SWARM_GENERIC_PROPS = {
  agentId: "",
  repoPath: ".",
  branch: "your branch",
  instructionsFile: "AGENTS.md",
  isolationMode: "shared-no-git"
};
function swarmAgentDir(projectFolder, instanceId) {
  return path22.join(projectFolder, "swarm-agents", instanceId);
}
function computeAgentWorkDir(internalProps, context2) {
  const projectFolder = internalProps.env?.projectFolder ?? internalProps.requestContext?.env?.projectFolder;
  const instanceId = context2.subagentInstanceId;
  if (!projectFolder || !instanceId) {
    return void 0;
  }
  return swarmAgentDir(projectFolder, instanceId);
}
function createCoordinatorAgentSystemPromptOverride(internalProps, _toolSetHandle, context2) {
  return swarmSystemPrompt({
    role: "planner",
    ...SWARM_GENERIC_PROPS,
    agentWorkDir: computeAgentWorkDir(internalProps, context2)
  });
}
function createWorkerAgentSystemPromptOverride(internalProps, _toolSetHandle, context2) {
  return swarmSystemPrompt({
    role: "worker",
    ...SWARM_GENERIC_PROPS,
    agentWorkDir: computeAgentWorkDir(internalProps, context2)
  });
}
function createCoordinatorAgentConfig() {
  return {
    subagent_type: new SubagentType({
      type: {
        case: "custom",
        value: new SubagentTypeCustom({ name: "coordinator-agent" })
      }
    }),
    description: "Autonomous planner that explores the codebase and delegates work to workers and sub-planners. Uses a shared workspace; avoid git operations unless explicitly requested. Use to start a grind-swarm or to delegate a scoped area (include scope in the prompt).",
    preserveTaskTool: true,
    subagentSource: "builtin",
    systemPromptOverride: createCoordinatorAgentSystemPromptOverride,
    continuationPolicy: {
      idleThreshold: 3,
      maxLoops: 100,
      continuationMessage: ({ isEscapeHatch, idleCount, escapeToken }) => isEscapeHatch ? swarmEscapeHatchMessage(idleCount, escapeToken, "planner") : swarmContinuationMessage("planner")
    },
    computeAllowedWritePaths: ({ projectFolder, subagentInstanceId }) => [
      swarmAgentDir(projectFolder, subagentInstanceId)
    ]
  };
}
function createWorkerAgentConfig() {
  return {
    subagent_type: new SubagentType({
      type: {
        case: "custom",
        value: new SubagentTypeCustom({ name: "worker-agent" })
      }
    }),
    description: "Worker that implements a single task and reports back. Uses a shared workspace; do not run git commands unless explicitly requested. Use for concrete implementation work.",
    preserveTaskTool: false,
    subagentSource: "builtin",
    systemPromptOverride: createWorkerAgentSystemPromptOverride,
    continuationPolicy: {
      idleThreshold: 3,
      maxLoops: 100,
      continuationMessage: ({ isEscapeHatch, idleCount, escapeToken }) => isEscapeHatch ? swarmEscapeHatchMessage(idleCount, escapeToken, "worker") : swarmContinuationMessage("worker")
    }
  };
}

