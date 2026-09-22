/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/utils/prompt-prefix-telemetry.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var userInfoRerenderedCounter = createCounter("agent.prompt_prefix.user_info_rerendered", {
  description: "Cached first-turn <user_info> replaced on a later turn, by reason (one increment per contributing reason)",
  labelNames: ["reason", "vendor", "model"]
});
var prefixRebuiltCounter = createCounter("agent.prompt_prefix.rebuilt", {
  description: "Per-turn rebuild of a prompt-prefix component; `changed` is whether it differs from the previous turn (`first` = no fingerprinted previous turn). `tool_names` tracks the static tool name set only, not descriptions or schemas.",
  labelNames: ["component", "changed", "vendor", "model"]
});
var systemPromptChangeCauseCounter = createCounter("agent.prompt_prefix.system_prompt_change_cause", {
  description: "Which fingerprinted input differed when the rebuilt system prompt changed (one increment per differing input; `unknown` = content changed but no fingerprinted input did)",
  labelNames: ["cause", "vendor", "model"]
});
function modelLabels(modelInfo) {
  return {
    vendor: modelInfo?.vendor ?? "unknown",
    model: modelInfo?.modelName ?? "unknown"
  };
}
function recordUserInfoRerendered(ctx, reasons, modelInfo) {
  const labels = modelLabels(modelInfo);
  for (const reason of reasons) {
    userInfoRerenderedCounter.increment(ctx, 1, { reason, ...labels });
  }
}
var userInfoCatalogUpdateCounter = createCounter("agent.prompt_prefix.user_info_catalog_update", {
  description: "Stale <user_info> catalog carried on the new user turn instead of re-rendering the cached first message, by catalog (one increment per stale catalog)",
  labelNames: ["catalog", "vendor", "model"]
});
function recordUserInfoCatalogUpdate(ctx, catalogs, modelInfo) {
  const labels = modelLabels(modelInfo);
  for (const catalog of catalogs) {
    userInfoCatalogUpdateCounter.increment(ctx, 1, { catalog, ...labels });
  }
}
function fingerprintString(input) {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash.toString(36);
}
var SYSTEM_PROMPT_FINGERPRINT_KEYS = [
  "content",
  "mode",
  "model",
  "agentType",
  "toolNames",
  "mcp",
  "rules",
  "featureFlags",
  "promptOptions"
];
function buildSystemPromptFingerprint(params) {
  const { props } = params;
  return {
    content: fingerprintString(params.content),
    mode: String(props.mode),
    model: params.modelInfo?.modelName ?? "",
    agentType: String(params.agentType),
    toolNames: fingerprintString(params.toolSetHandle.getStaticTools().map((tool) => tool.name).sort().join("\n")),
    mcp: fingerprintString(params.mcpTools.map((tool) => tool.name).sort().join("\n")),
    rules: fingerprintString([
      ...props.cursorRules.map((rule) => `${rule.fullPath}
${rule.content}`),
      props.cloudRule ?? ""
    ].join("\n\0")),
    featureFlags: fingerprintString(JSON.stringify(params.featureFlags ?? {})),
    promptOptions: [
      String(props.omitCloudWorkerProcedure),
      String(props.useProjectCoordinatorPrompting)
    ].join("|")
  };
}
function parseSystemPromptFingerprintMetadata(value) {
  if (typeof value !== "object" || value === null) {
    return void 0;
  }
  const record2 = value;
  const parsed = {};
  for (const key of SYSTEM_PROMPT_FINGERPRINT_KEYS) {
    const item = record2[key];
    if (typeof item !== "string") {
      return void 0;
    }
    parsed[key] = item;
  }
  return parsed;
}
function getPreviousSystemPromptFingerprint(messages) {
  const systemMessage = messages.find((message) => message.role === "system");
  return parseSystemPromptFingerprintMetadata(systemMessage?.providerOptions?.cursor?.systemPromptFingerprint);
}
function diffSystemPromptFingerprints(previous, current) {
  const contentChanged = previous.content !== current.content;
  const causes = [];
  for (const key of SYSTEM_PROMPT_FINGERPRINT_KEYS) {
    if (key !== "content" && previous[key] !== current[key]) {
      causes.push(key);
    }
  }
  if (contentChanged && causes.length === 0) {
    causes.push("unknown");
  }
  return { contentChanged, causes };
}
function recordSystemPromptRebuild(ctx, params) {
  const labels = modelLabels(params.modelInfo);
  const previous = getPreviousSystemPromptFingerprint(params.previousMessages);
  if (previous === void 0) {
    for (const component of ["system_prompt", "tool_names"]) {
      prefixRebuiltCounter.increment(ctx, 1, {
        component,
        changed: "first",
        ...labels
      });
    }
    return;
  }
  const { contentChanged, causes } = diffSystemPromptFingerprints(previous, params.current);
  prefixRebuiltCounter.increment(ctx, 1, {
    component: "system_prompt",
    changed: String(contentChanged),
    ...labels
  });
  prefixRebuiltCounter.increment(ctx, 1, {
    component: "tool_names",
    changed: String(previous.toolNames !== params.current.toolNames),
    ...labels
  });
  if (contentChanged) {
    for (const cause of causes) {
      systemPromptChangeCauseCounter.increment(ctx, 1, { cause, ...labels });
    }
  }
}

