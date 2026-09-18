async function resolvePinnedForceModelId(args) {
  const { forceModelId, subagentModelForcePolicy, isModelBlocked, isMaxModeCompatible, logForcedModel } = args;
  if (forceModelId !== void 0 && !isModelBlocked(forceModelId) && await isMaxModeCompatible(forceModelId)) {
    return logForcedModel({
      candidateModelId: forceModelId,
      modelResolutionReason: "force_model",
      reasonDetails: { forceModelId, subagentModelForcePolicy }
    });
  }
  return void 0;
}
async function tryResolveForcedSubagentModel(args) {
  const { subagentModelForcePolicy, forceModelId, userRequestedModelId, isModelBlocked, isModelValid, isMaxModeCompatible, logForcedModel } = args;
  switch (subagentModelForcePolicy) {
    case SubagentModelForcePolicy.RequestBasedComposer: {
      if (forceModelId === void 0) {
        return void 0;
      }
      const userSelectedForcedComposerModelId = userRequestedModelId !== void 0 && isBuiltInComposerSubagentSlug(userRequestedModelId) && !isModelBlocked(userRequestedModelId) && isModelValid(userRequestedModelId) && await isMaxModeCompatible(userRequestedModelId) ? userRequestedModelId : void 0;
      if (userSelectedForcedComposerModelId !== void 0) {
        return logForcedModel({
          candidateModelId: userSelectedForcedComposerModelId,
          modelResolutionReason: "force_model_user_composer_selection",
          reasonDetails: {
            forceModelId,
            userSelectedForcedComposerModelId,
            subagentModelForcePolicy
          }
        });
      }
      return resolvePinnedForceModelId({
        forceModelId,
        subagentModelForcePolicy,
        isModelBlocked,
        isMaxModeCompatible,
        logForcedModel
      });
    }
    case SubagentModelForcePolicy.ParentPin:
      return resolvePinnedForceModelId({
        forceModelId,
        subagentModelForcePolicy,
        isModelBlocked,
        isMaxModeCompatible,
        logForcedModel
      });
    case SubagentModelForcePolicy.None:
      return void 0;
    default: {
      const _exhaustive = subagentModelForcePolicy;
      throw new Error(`Unhandled subagent model force policy: ${String(_exhaustive)}`);
    }
  }
}
