/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/actions/common.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_cursor_rules_pb();

// @recovered-fragment 2/2
function getAllRules(requestContext, serverFetchedRules, featureFlags) {
  if (featureFlags?.dropCustomPromptContext === true) {
    return [];
  }
  const teamRuleName = (rule) => rule.fullPath.split("/").pop() ?? rule.fullPath;
  const allRules = [...requestContext.rules, ...serverFetchedRules];
  const disabled = new Set(requestContext.disabledTeamRules);
  const enabledRules = allRules.filter((rule) => rule.source !== CursorRuleSource.TEAM || rule.isRequired || !disabled.has(teamRuleName(rule)));
  const seenTeamRules = /* @__PURE__ */ new Set();
  return enabledRules.filter((rule) => {
    if (rule.source !== CursorRuleSource.TEAM) {
      return true;
    }
    const name17 = teamRuleName(rule);
    if (seenTeamRules.has(name17)) {
      return false;
    }
    seenTeamRules.add(name17);
    return true;
  });
}
function userMessagePlainText(message) {
  const content = message.content;
  if (typeof content === "string") {
    return content.length > 0 ? content : void 0;
  }
  if (!Array.isArray(content)) {
    return void 0;
  }
  const text2 = content.filter((part) => part.type === "text").map((part) => part.text).join("\n");
  return text2.length > 0 ? text2 : void 0;
}
function getFirstUserInfoCloudTestingSectionsPlacement(priorMessages) {
  const firstMsg = priorMessages[0];
  if (firstMsg?.role !== "user") {
    return void 0;
  }
  return parseComposer2CloudTestingSectionsPlacementMetadata(firstMsg.providerOptions?.cursor?.composer2CloudTestingSectionsPlacement);
}
function getFirstUserInfoMessageContent(priorMessages) {
  const firstMsg = priorMessages[0];
  if (firstMsg?.role !== "user") {
    return void 0;
  }
  const plainFirst = fromRedactedCoreMessage(firstMsg, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
  const contentStr = userMessagePlainText(plainFirst);
  if (contentStr === void 0 || !contentStr.includes("<user_info>")) {
    return void 0;
  }
  return contentStr;
}
function getFirstUserInfoOmitCloudWorkerProcedure(priorMessages) {
  return priorMessages[0]?.providerOptions?.cursor?.omitCloudWorkerProcedure === true;
}
function getFirstUserInfoProjectCoordinatorPrompting(priorMessages) {
  return priorMessages[0]?.providerOptions?.cursor?.useProjectCoordinatorPrompting === true;
}
var TRIGGER_INFO_OPEN = "<automation_trigger_info>";
var TRIGGER_INFO_CLOSE = "</automation_trigger_info>";
function extractAutomationTriggerContext(messages2) {
  for (const message of messages2) {
    if (message.role !== "user")
      continue;
    const content = message.content;
    const textParts = [];
    if (Array.isArray(content)) {
      for (const part of content) {
        if (part.type === "text") {
          textParts.push(part.text.unwrap(PrivacyCapability.UNSAFE_ALWAYS_ALLOWED));
        }
      }
    } else {
      textParts.push(content.unwrap(PrivacyCapability.UNSAFE_ALWAYS_ALLOWED));
    }
    const fullText = textParts.join("\n");
    const openIdx = fullText.indexOf(TRIGGER_INFO_OPEN);
    if (openIdx === -1)
      continue;
    const closeIdx = fullText.indexOf(TRIGGER_INFO_CLOSE, openIdx);
    if (closeIdx === -1)
      continue;
    return fullText.slice(openIdx, closeIdx + TRIGGER_INFO_CLOSE.length).trim();
  }
  return void 0;
}

