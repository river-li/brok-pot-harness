init_errors();
var SAND_BOT_TEMPLATE_NOT_FOUND = "bot-template/not-found";
var SAND_BOT_TEMPLATE_NOT_FOUND_MESSAGE = "Grok Bot template not found.";
var BotTemplateStoreNotFound = class extends SandDomainError {
  name = "BotTemplateStoreNotFound";
  failureCode = SAND_BOT_TEMPLATE_NOT_FOUND;
  constructor() {
    super(SAND_BOT_TEMPLATE_NOT_FOUND_MESSAGE);
  }
};
function sourceAgentFetchedViewIsStale(args) {
  const { current, incoming } = args;
  if (current.activeVersion != null && incoming.activeVersion != null) {
    if (incoming.activeVersion !== current.activeVersion) {
      return incoming.activeVersion < current.activeVersion;
    }
  }
  if (current.updatedAtMs != null && incoming.updatedAtMs != null) {
    return incoming.updatedAtMs < current.updatedAtMs;
  }
  return false;
}
function laterAudienceNumber(left, right) {
  if (left == null) return right;
  if (right == null) return left;
  return left >= right ? left : right;
}
function resolveBotTemplateAudienceVisibility(args) {
  const { current, incoming } = args;
  if (current != null && current.shareId !== incoming.shareId) return incoming.visibility;
  if (incoming.visibility == null) return current?.visibility;
  if (current?.visibility == null || current.visibility === incoming.visibility) {
    return incoming.visibility;
  }
  if (sourceAgentFetchedViewIsStale({ current, incoming })) return current.visibility;
  if (incoming.version != null && current.version != null && incoming.version !== current.version) {
    return incoming.version > current.version ? incoming.visibility : current.visibility;
  }
  if (incoming.updatedAtMs != null && current.updatedAtMs != null && incoming.updatedAtMs !== current.updatedAtMs) {
    return incoming.updatedAtMs > current.updatedAtMs ? incoming.visibility : current.visibility;
  }
  return current.visibility;
}
function withResolvedBotTemplateAudience(args) {
  const { current, incoming } = args;
  const visibility = resolveBotTemplateAudienceVisibility({ current, incoming });
  if (visibility == null) return incoming;
  const keepCurrentAudience = current != null && current.shareId === incoming.shareId && visibility === current.visibility;
  if (!keepCurrentAudience) {
    if (incoming.visibility === visibility) return incoming;
    return { ...incoming, visibility };
  }
  const updatedAtMs = laterAudienceNumber(current.updatedAtMs, incoming.updatedAtMs);
  if (incoming.visibility === visibility && incoming.updatedAtMs === updatedAtMs) {
    return incoming;
  }
  return {
    ...incoming,
    visibility,
    ...updatedAtMs == null ? {} : { updatedAtMs }
  };
}
