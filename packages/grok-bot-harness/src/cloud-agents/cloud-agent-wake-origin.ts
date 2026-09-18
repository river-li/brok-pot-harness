init_agent_pb();
init_unknown_record();
function cloudAgentWakeSourceOf(source) {
  switch (source) {
    case SubscriptionSource.SLACK:
      return "slack";
    case SubscriptionSource.GITHUB:
      return "github";
    case SubscriptionSource.LINEAR:
      return "linear";
    case SubscriptionSource.ORIGIN:
      return "origin";
    default:
      return "unknown";
  }
}
function cloudAgentWakeFromSubscriptionMetadata(metadata, atMs) {
  const display = metadata?.subscriptionEventDisplay;
  return {
    source: cloudAgentWakeSourceOf(metadata?.subscriptionSource),
    label: trimmedOrNull(display?.displayLabel) ?? trimmedOrNull(metadata?.title),
    url: trimmedOrNull(display?.resourceUrl) ?? trimmedOrNull(metadata?.url),
    subscriptionId: trimmedOrNull(display?.subscriptionId),
    atMs
  };
}
function trimmedOrNull(value) {
  const trimmed = value?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : null;
}
