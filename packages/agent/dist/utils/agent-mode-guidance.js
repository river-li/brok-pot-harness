var MODE_DISPLAY_NAMES = {
  agent: "Agent",
  plan: "Plan",
  debug: "Debug",
  chat: "Ask",
  multitask: "Multitask"
};
function isUnifiedModeId(mode) {
  return Object.hasOwn(MODE_DISPLAY_NAMES, mode);
}
function buildCurrentModeStatement(currentMode, _targetModes, _fromModes) {
  const currentDisplayName = isUnifiedModeId(currentMode) ? MODE_DISPLAY_NAMES[currentMode] : currentMode;
  return `You are now in ${currentDisplayName} mode. You have EXITED your previous mode. Continue with the task in the new mode.`;
}
