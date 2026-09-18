function usesGptPersistenceInstructions(modelInfo) {
  return modelInfo?.isGpt5 === true || modelInfo?.isGpt5Family === true || modelInfo?.isGpt51 === true || modelInfo?.isGpt52 === true || modelInfo?.isGpt54 === true || modelInfo?.isGpt55 === true || modelInfo?.isGpt56 === true || modelInfo?.isGpt52Codex === true || modelInfo?.isGpt53Codex === true || modelInfo?.isGpt53CodexSpark === true;
}
