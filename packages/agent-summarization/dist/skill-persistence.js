var MANUALLY_ATTACHED_SKILLS_REGEX = /<manually_attached_skills>[\s\S]*?<\/manually_attached_skills>/g;
function extractManuallyAttachedSkillBlocks(redactedMessage) {
  var _a19;
  const message = fromRedactedCoreMessage(redactedMessage, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
  if (message.role !== "user") {
    return [];
  }
  const content = message.content;
  const textSegments = typeof content === "string" ? [content] : content.filter((part) => part.type === "text").map((part) => part.text);
  const skillBlocks = [];
  for (const segment of textSegments) {
    const matches = (_a19 = segment.match(MANUALLY_ATTACHED_SKILLS_REGEX)) !== null && _a19 !== void 0 ? _a19 : [];
    for (const match2 of matches) {
      const normalized = match2.trim();
      if (normalized.length > 0) {
        skillBlocks.push(normalized);
      }
    }
  }
  return skillBlocks;
}
function collectAllSkillBlocks(messages2) {
  var _a19, _b2;
  for (let i = messages2.length - 1; i >= 0; i--) {
    if (messages2[i].role === "user" && ((_b2 = (_a19 = messages2[i].providerOptions) === null || _a19 === void 0 ? void 0 : _a19.cursor) === null || _b2 === void 0 ? void 0 : _b2.isSummary) !== true) {
      return extractManuallyAttachedSkillBlocks(messages2[i]);
    }
  }
  return [];
}
