function buildSimulatedMessagePromptUserContent({ selectedContext, simulatedMsgReason, modelInfo, environmentParamForSubagent, babysitV2Prompt, enablePrCreationForgeGuidance, resolvedMode }) {
  const prompts = [
    synthesizeDiffTabGitActionPrompt({
      selectedContext,
      simulatedMsgReason,
      environmentParamForSubagent: environmentParamForSubagent === true,
      babysitV2Prompt: babysitV2Prompt === true,
      enablePrCreationForgeGuidance: enablePrCreationForgeGuidance === true
    }),
    synthesizeMultitaskActionPrompt(simulatedMsgReason, {
      taskToolName: modelInfo !== void 0 ? getTaskToolName(modelInfo) : void 0,
      resolvedMode
    })
  ].filter((prompt) => prompt !== void 0);
  return prompts.map((prompt) => ({
    type: "text",
    text: prompt
  }));
}
