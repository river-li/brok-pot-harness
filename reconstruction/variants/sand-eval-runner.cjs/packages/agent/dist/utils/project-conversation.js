/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/utils/project-conversation.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_dist2();
function isRootProjectUserMessage(userMessage) {
  return isRootProjectDetails(userMessage.projectDetails) && userMessage.bestOfNGroupId === void 0;
}
function resolveRootCoordinatorPrompting({ omitCloudWorkerProcedureGateEnabled, localParityPromptGateEnabled, agentType, mode, useLocalAgentPrompting, isNamedAgentSession, isRootProject }) {
  const isEligibleTurn = agentType === AgentType.BACKGROUND && mode === AgentMode.AGENT && !useLocalAgentPrompting && !isNamedAgentSession && isRootProject;
  const useProjectCoordinatorPrompting = isEligibleTurn && localParityPromptGateEnabled;
  return {
    useProjectCoordinatorPrompting,
    omitCloudWorkerProcedure: useProjectCoordinatorPrompting || isEligibleTurn && omitCloudWorkerProcedureGateEnabled
  };
}
async function resolveProjectConversationContext(ctx, stateHandler) {
  let lastMode;
  for (let index = stateHandler.turns.length - 1; index >= 0; index--) {
    const turn = await stateHandler.turns[index].get(ctx);
    if (!("userMessage" in turn)) {
      continue;
    }
    const userMessage = await turn.userMessage.get(ctx);
    lastMode ??= userMessage.mode;
    const hasProjectBoundary = userMessage.projectDetails !== void 0 || userMessage.bestOfNGroupId !== void 0;
    if (hasProjectBoundary) {
      return {
        lastMode,
        isRootProject: isRootProjectUserMessage(userMessage),
        hasProjectBoundary: true
      };
    }
    if (userMessage.isSimulatedMsg !== true) {
      break;
    }
  }
  return { lastMode, isRootProject: false, hasProjectBoundary: false };
}

