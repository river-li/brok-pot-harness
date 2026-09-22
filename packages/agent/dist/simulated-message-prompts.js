/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/simulated-message-prompts.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
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

