init_background_composer_pb();
init_grok_bot_pb();
var SOURCE_BY_TYPE_PREFIX = {
  github: "github",
  slack: "slack",
  linear: "linear",
  origin: "origin"
};
function subscriptionSourceOf(subscriptionType) {
  const prefix = subscriptionType.split(/[:_]/, 1)[0] ?? "";
  return SOURCE_BY_TYPE_PREFIX[prefix] ?? "unknown";
}
function positiveMs2(value) {
  return value != null && Number.isFinite(value) && value > 0 ? value : null;
}
function toSandCloudAgentSubscription(subscription) {
  return {
    id: subscription.subscriptionId,
    source: subscriptionSourceOf(subscription.subscriptionType),
    type: subscription.subscriptionType,
    expiresAtMs: positiveMs2(subscription.expiresAtMs)
  };
}
var WATCHER_KIND = {
  [GrokBotCloudAgentWatchKind.UNSPECIFIED]: "watch",
  [GrokBotCloudAgentWatchKind.LAUNCH]: "launch",
  [GrokBotCloudAgentWatchKind.REPLY]: "reply",
  [GrokBotCloudAgentWatchKind.WATCH]: "watch"
};
function toSandCloudAgentWatcher(watcher) {
  return {
    agentId: watcher.agentId,
    kind: WATCHER_KIND[watcher.kind] ?? "watch",
    isDurable: watcher.durable,
    wakes: watcher.wakes
  };
}
async function readCloudAgentWatch(clients, bcId) {
  const trimmed = bcId.trim();
  if (trimmed.length === 0) return { kind: "failed", reason: "rejected" };
  const [subscriptions, watchers] = await Promise.all([
    clients.composer.listEventSubscriptions(new ListEventSubscriptionsRequest({ bcId: trimmed })).then(
      (response) => ({
        kind: "read",
        bcId: trimmed,
        subscriptions: response.subscriptions.map(toSandCloudAgentSubscription),
        watchers: { kind: "read", watchers: [] }
      }),
      (error42) => ({
        kind: "failed",
        reason: classifyReadFailure(error42)
      })
    ),
    clients.grokBot.getGrokBotCloudAgentWatchers(new GetGrokBotCloudAgentWatchersRequest({ bcId: trimmed })).then(
      (response) => ({
        kind: "read",
        watchers: response.watchers.map(toSandCloudAgentWatcher)
      }),
      (error42) => ({
        kind: "failed",
        reason: classifyReadFailure(error42)
      })
    )
  ]);
  if (subscriptions.kind === "failed") return subscriptions;
  return { ...subscriptions, watchers };
}
