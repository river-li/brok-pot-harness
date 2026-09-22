/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-summarization/dist/skill-persistence.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var MANUALLY_ATTACHED_SKILLS_REGEX = /<manually_attached_skills>[\s\S]*?<\/manually_attached_skills>/g;
function extractManuallyAttachedSkillBlocks(redactedMessage) {
  var _a20;
  const message = fromRedactedCoreMessage(redactedMessage, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
  if (message.role !== "user") {
    return [];
  }
  const content = message.content;
  const textSegments = typeof content === "string" ? [content] : content.filter((part) => part.type === "text").map((part) => part.text);
  const skillBlocks = [];
  for (const segment of textSegments) {
    const matches = (_a20 = segment.match(MANUALLY_ATTACHED_SKILLS_REGEX)) !== null && _a20 !== void 0 ? _a20 : [];
    for (const match2 of matches) {
      const normalized = match2.trim();
      if (normalized.length > 0) {
        skillBlocks.push(normalized);
      }
    }
  }
  return skillBlocks;
}
function collectAllSkillBlocks(messages) {
  var _a20, _b2;
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "user" && ((_b2 = (_a20 = messages[i].providerOptions) === null || _a20 === void 0 ? void 0 : _a20.cursor) === null || _b2 === void 0 ? void 0 : _b2.isSummary) !== true) {
      return extractManuallyAttachedSkillBlocks(messages[i]);
    }
  }
  return [];
}

