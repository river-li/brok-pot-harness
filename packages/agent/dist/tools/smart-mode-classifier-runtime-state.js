/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/smart-mode-classifier-runtime-state.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function getSmartModeClassifierRuntimeState({ agentType, requestContext, smartModeClassifierMode, smartModeClassifierShadowMode, devBlockState, devDelayState }) {
  const isBackgroundAgent = agentType === AgentType.BACKGROUND;
  const autoModeSelected = smartModeClassifierMode === true && requestContext?.env?.smartModeClassifierAutoModeEnabled === true;
  const enabled = !isBackgroundAgent && autoModeSelected;
  return {
    autoModeSelected,
    enabled,
    shadowEnabled: !isBackgroundAgent && !enabled && smartModeClassifierShadowMode === true,
    devBlockState: devBlockState ?? createDevSmartModeClassifierBlockState(requestContext),
    devDelayState: devDelayState ?? createDevSmartModeClassifierDelayState(requestContext)
  };
}

