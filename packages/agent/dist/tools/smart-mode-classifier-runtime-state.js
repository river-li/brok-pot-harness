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
