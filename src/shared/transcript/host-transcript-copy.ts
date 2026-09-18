var TEACH_RECORDING_PERSISTED_PROMPT = "The recording is finished. Learn the task from it.";
var LEARN_FROM_DEMONSTRATION_PERSISTED_LABEL = "Learn from demonstration";
var TEACH_RECORDING_NONCE_PREFIX = "teach-recording:";
var LEARN_FROM_DEMONSTRATION_SKILL_ID = "learn-from-demonstration";
function teachRecordingPromptForPersistence() {
  return TEACH_RECORDING_PERSISTED_PROMPT;
}
function learnFromDemonstrationLabelForPersistence() {
  return LEARN_FROM_DEMONSTRATION_PERSISTED_LABEL;
}
