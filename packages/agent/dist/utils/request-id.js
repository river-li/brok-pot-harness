var requestIdKey2 = createKey(/* @__PURE__ */ Symbol("requestId"), void 0);
var parentRequestIdKey2 = createKey(/* @__PURE__ */ Symbol("parentRequestId"), void 0);
var rootParentRequestIdKey2 = createKey(/* @__PURE__ */ Symbol("rootParentRequestId"), void 0);
var parentAgentToolCallIdKey2 = createKey(/* @__PURE__ */ Symbol("parentAgentToolCallId"), void 0);
var subagentTypeKey2 = createKey(/* @__PURE__ */ Symbol("subagentType"), void 0);
var directMetaParentChildSubagentKey = createKey(/* @__PURE__ */ Symbol("directMetaParentChildSubagent"), void 0);
var requestModelNameKey = createKey(/* @__PURE__ */ Symbol("requestModelName"), void 0);
var conversationGroupIdKey2 = createKey(/* @__PURE__ */ Symbol("conversationGroupId"), void 0);
var conversationIdKey2 = createKey(/* @__PURE__ */ Symbol("conversationId"), void 0);
var secretScopeIdKey = createKey(/* @__PURE__ */ Symbol("secretScopeId"), void 0);
var bubbleRetryableTaskErrorsKey = createKey(/* @__PURE__ */ Symbol("bubbleRetryableTaskErrors"), void 0);
var getRequestId = (ctx) => {
  return ctx.get(requestIdKey2);
};
var getParentRequestId = (ctx) => {
  return ctx.get(parentRequestIdKey2);
};
var getRootParentRequestId = (ctx) => {
  return ctx.get(rootParentRequestIdKey2);
};
var getIsDirectMetaParentChildSubagentFromContext = (ctx) => {
  return ctx.get(directMetaParentChildSubagentKey) === true;
};
var createSubagentContext = (ctx, subagentRequestId, parentAgentToolCallId) => {
  const parentRequestId = getRequestId(ctx);
  const rootParentRequestId = getRootParentRequestId(ctx) ?? parentRequestId;
  return ctx.with(requestIdKey2, subagentRequestId).with(invocationIdGeneratorKey, () => getInvocationIdFromRequestId(subagentRequestId)).with(parentRequestIdKey2, parentRequestId).with(rootParentRequestIdKey2, rootParentRequestId).with(directMetaParentChildSubagentKey, void 0).with(parentAgentToolCallIdKey2, parentAgentToolCallId);
};
var getConversationGroupId = (ctx) => {
  return ctx.get(conversationGroupIdKey2) ?? ctx.get(conversationIdKey2);
};
var getConversationId = (ctx) => {
  return ctx.get(conversationIdKey2);
};
var getSecretScopeId = (ctx) => {
  return ctx.get(secretScopeIdKey);
};
var getShouldBubbleRetryableTaskErrorsFromContext = (ctx) => {
  return ctx.get(bubbleRetryableTaskErrorsKey) === true;
};
var clientVersionKey = createKey(/* @__PURE__ */ Symbol("clientVersion"), void 0);
var CLIENT_VERSION_SEMVER_REGEX = /^v?\d+\.\d+\.\d+(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;
var CLIENT_VERSION_PRODUCT_PREFIXES = [
  "sdk-python-",
  "sdk-",
  "agentkit-"
];
var clientTypeKey = createKey(/* @__PURE__ */ Symbol("clientType"), void 0);
var clientRemoteTypeKey = createKey(/* @__PURE__ */ Symbol("clientRemoteType"), void 0);
var clientOsKey = createKey(/* @__PURE__ */ Symbol("clientOs"), void 0);
var CLIENT_OS_METRIC_VALUES = /* @__PURE__ */ new Set([
  "darwin",
  "win32",
  "linux",
  "ios",
  "android"
]);
function normalizeClientOsMetricTag(rawOs) {
  if (rawOs === void 0 || rawOs.trim() === "") {
    return "unknown";
  }
  const os13 = rawOs.trim().toLowerCase();
  if (os13 === "windows") {
    return "win32";
  }
  return CLIENT_OS_METRIC_VALUES.has(os13) ? os13 : "other";
}
function getClientVersionMetricTagsFromContext(ctx) {
  const rawVersion = ctx.get(clientVersionKey)?.trim();
  let version3 = "unknown";
  if (rawVersion !== void 0 && rawVersion !== "") {
    const lowerVersion = rawVersion.toLowerCase();
    const prefix = CLIENT_VERSION_PRODUCT_PREFIXES.find((p2) => lowerVersion.startsWith(p2));
    const candidate = prefix === void 0 ? rawVersion : rawVersion.slice(prefix.length);
    if (CLIENT_VERSION_SEMVER_REGEX.test(candidate)) {
      version3 = candidate.replace(/^v/, "");
    }
  }
  const type2 = ctx.get(clientTypeKey);
  return {
    clientversion: version3,
    clienttype: type2 ?? "unknown"
  };
}
function getSdkFlavorMetricTagFromContext(ctx) {
  const rawVersion = ctx.get(clientVersionKey)?.trim().toLowerCase();
  if (rawVersion === void 0) {
    return { sdkflavor: "none" };
  }
  if (rawVersion.startsWith("sdk-python-")) {
    return { sdkflavor: "python" };
  }
  if (rawVersion.startsWith("sdk-")) {
    return { sdkflavor: "ts" };
  }
  if (rawVersion.startsWith("agentkit-")) {
    return { sdkflavor: "agentkit" };
  }
  return { sdkflavor: "none" };
}
function getClientRemoteTypeMetricTagFromContext(ctx) {
  return {
    remoteType: ctx.get(clientRemoteTypeKey) ?? "unknown"
  };
}
function getClientOsMetricTagFromContext(ctx) {
  return {
    os: normalizeClientOsMetricTag(ctx.get(clientOsKey))
  };
}
var membershipTypeKey = createKey(/* @__PURE__ */ Symbol("membershipType"), void 0);
var MEMBERSHIP_TYPE_TAG_KEYS = {
  MEMBERSHIPTYPE: "membershiptype"
};
function getMembershipTypeMetricTagsFromContext(ctx) {
  const value = ctx.get(membershipTypeKey) ?? "unknown";
  return {
    [MEMBERSHIP_TYPE_TAG_KEYS.MEMBERSHIPTYPE]: value
  };
}
var isAutoKey = createKey(/* @__PURE__ */ Symbol("isAuto"), void 0);
var isPremiumKey = createKey(/* @__PURE__ */ Symbol("isPremium"), void 0);
var teamIdKey = createKey(/* @__PURE__ */ Symbol("teamId"), void 0);
var isUserApiKeyKey = createKey(/* @__PURE__ */ Symbol("isUserApiKey"), void 0);
var IS_DEV_SPAN_ATTRIBUTE = "user.is_dev";
var maxModeKey = createKey(/* @__PURE__ */ Symbol("maxMode"), void 0);
var autoRoutingReasonKey = createKey(/* @__PURE__ */ Symbol("autoRoutingReason"), void 0);
var conversationInitMsRecorderKey = createKey(/* @__PURE__ */ Symbol("conversationInitMsRecorder"), void 0);
var cloudAgentPreAgentTurnPrepMsRecorderKey = createKey(/* @__PURE__ */ Symbol("cloudAgentPreAgentTurnPrepMsRecorder"), void 0);
async function withCloudAgentPreAgentTurnPrepPhase(ctx, phase, run) {
  const startMs = performance.now();
  try {
    return await run();
  } finally {
    ctx.get(cloudAgentPreAgentTurnPrepMsRecorderKey)?.(phase, performance.now() - startMs);
  }
}
var cloudAgentTurnPrepGlueMsRecorderKey = createKey(/* @__PURE__ */ Symbol("cloudAgentTurnPrepGlueMsRecorder"), void 0);
var cloudAgentTurnPrepPrewarmRecorderKey = createKey(/* @__PURE__ */ Symbol("cloudAgentTurnPrepPrewarmRecorder"), void 0);
var cloudAgentTurnPrepRootPromptRestoreRecorderKey = createKey(/* @__PURE__ */ Symbol("cloudAgentTurnPrepRootPromptRestoreRecorder"), void 0);
var ANYSPHERE_TEAM_ID = 1;
function getIsAutoFromContext(ctx) {
  return ctx.get(isAutoKey) === true;
}
function getIsPremiumFromContext(ctx) {
  return ctx.get(isPremiumKey) === true;
}
function getIsAnysphereTeamFromContext(ctx) {
  const teamId = ctx.get(teamIdKey);
  return teamId !== void 0 && teamId === ANYSPHERE_TEAM_ID;
}
function getIsUserApiKeyFromContext(ctx) {
  return ctx.get(isUserApiKeyKey) === true;
}
function getIsDevFromContext(ctx) {
  return ctx.get(INHERITABLE_SPAN_ATTRIBUTES_KEY)[IS_DEV_SPAN_ATTRIBUTE] === true;
}
function getIsSubagentFromContext(ctx) {
  return ctx.get(parentRequestIdKey2) !== void 0;
}
function getMaxModeFromContext(ctx) {
  return ctx.get(maxModeKey) === true;
}
function getAutoRoutingReasonFromContext(ctx) {
  return ctx.get(autoRoutingReasonKey) ?? "unknown";
}
