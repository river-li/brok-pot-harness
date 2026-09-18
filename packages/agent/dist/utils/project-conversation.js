init_dist();
init_agent_pb();
function isRootProjectUserMessage(userMessage2) {
  return isRootProjectDetails(userMessage2.projectDetails) && userMessage2.bestOfNGroupId === void 0;
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
    const userMessage2 = await turn.userMessage.get(ctx);
    lastMode ??= userMessage2.mode;
    const hasProjectBoundary = userMessage2.projectDetails !== void 0 || userMessage2.bestOfNGroupId !== void 0;
    if (hasProjectBoundary) {
      return {
        lastMode,
        isRootProject: isRootProjectUserMessage(userMessage2),
        hasProjectBoundary: true
      };
    }
    if (userMessage2.isSimulatedMsg !== true) {
      break;
    }
  }
  return { lastMode, isRootProject: false, hasProjectBoundary: false };
}
