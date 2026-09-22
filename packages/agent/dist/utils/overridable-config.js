init_dist4();
var configOverridesKey = createKey(/* @__PURE__ */ Symbol("configOverrides"), {});
function overridableConfig(key, defaultValue) {
  return (ctx) => {
    const config2 = ctx.get(configOverridesKey);
    return config2[key] ?? defaultValue;
  };
}
var READ_LINT_TIMEOUT_MS = overridableConfig("read_lint_timeout_ms", 1e4);
var WRITE_EVAL_TRANSCRIPTS = overridableConfig("writeEvalTranscripts", false);
var EVAL_ENFORCED_TEMPERATURE = overridableConfig("evalServiceEnforcedTemperature", void 0);
var EVAL_ENFORCED_TOP_P = overridableConfig("evalServiceEnforcedTopP", void 0);
var EVAL_ENFORCED_TOP_K = overridableConfig("evalServiceEnforcedTopK", void 0);
var EVAL_ENFORCED_MIN_P = overridableConfig("evalServiceEnforcedMinP", void 0);
var EVAL_ENFORCED_TEMPERATURE_NON_THINKING = overridableConfig("evalServiceEnforcedTemperatureNonThinking", void 0);
var EVAL_ENFORCED_AGENT_TOKEN_LIMIT = overridableConfig("evalServiceEnforcedAgentTokenLimit", void 0);
var EVAL_ENFORCED_MAX_TOKENS_BEFORE_SUMMARIZATION = overridableConfig("evalServiceEnforcedMaxTokensBeforeSummarization", void 0);
var EVAL_ENFORCED_SELF_SUMMARY = overridableConfig("evalServiceEnforcedSelfSummary", void 0);
var EVAL_ENFORCED_WAIT_FOR_SUMMARIZATION_COMPLETION = overridableConfig("evalServiceEnforcedWaitForSummarizationCompletion", void 0);
var EVAL_ENFORCED_SELF_SUMMARY_TOKEN_LIMIT = overridableConfig("evalServiceEnforcedSelfSummaryTokenLimit", void 0);
var EVAL_ENFORCED_EFFORT_LEVEL = overridableConfig("evalServiceEnforcedEffortLevel", void 0);
var EVAL_ENFORCED_IS_EAGER_EDITING_MODEL = overridableConfig("evalServiceEnforcedIsEagerEditingModel", void 0);
var DISABLE_SEMANTIC_SEARCH = overridableConfig("disableSemanticSearch", false);
var ALLOW_PROMPT_TWEAKS = overridableConfig("allowPromptTweaks", false);
var DISABLE_UI_BROWSER_VERIFICATION_PROMPT = overridableConfig("disableUiBrowserVerificationPrompt", false);
var ALLOW_TASK_TOOL_IN_RL_HARNESS = overridableConfig("allowTaskToolInRlHarness", false);
var ALLOW_NESTED_TASK_TOOL_IN_RL_HARNESS = overridableConfig("allowNestedTaskToolInRlHarness", false);
var SUMMARIZATION_FORCE_DETERMINISTIC_FALLBACK = overridableConfig("summarizationForceDeterministicFallback", void 0);
var CANVAS_POST_EDIT_DIAGNOSTICS_TIMEOUT_MS = overridableConfig("canvas_post_edit_diagnostics_timeout_ms", 1e4);
