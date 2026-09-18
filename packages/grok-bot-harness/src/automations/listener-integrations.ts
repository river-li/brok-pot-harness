function isListenerPlatform(value) {
  return LISTENER_INTEGRATION_PLATFORMS.some((platform2) => platform2 === value);
}
function countListenerPlatforms(automations) {
  const counts = { github: 0, origin: 0, slack: 0 };
  for (const automation of automations) {
    if (!automation.isEnabled) continue;
    const platforms = /* @__PURE__ */ new Set();
    for (const listener of triggerListeners(automation.trigger)) {
      if (isListenerPlatform(listener.type)) platforms.add(listener.type);
    }
    for (const platform2 of platforms) counts[platform2] += 1;
  }
  return counts;
}
function listenerPlatformsInTrigger(trigger2) {
  const platforms = /* @__PURE__ */ new Set();
  for (const listener of triggerListeners(trigger2)) {
    if (isListenerPlatform(listener.type)) platforms.add(listener.type);
  }
  return [...platforms];
}
function joinScopes(scopes) {
  return scopes.join(", ");
}
function describeScopeIssues(issues) {
  const missingBot = issues.filter((issue2) => issue2.kind === "bot-not-in-channel").map((issue2) => issue2.scope);
  const notFound = issues.filter((issue2) => issue2.kind === "not-found").map((issue2) => issue2.scope);
  const parts = [];
  if (missingBot.length > 0) {
    parts.push(
      `Invite @Cursor to ${joinScopes(missingBot)} in Slack \u2014 messages there can't reach this listener until the bot joins.`
    );
  }
  if (notFound.length > 0) {
    parts.push(
      `Couldn't find ${joinScopes(notFound)} \u2014 check the name, or invite @Cursor to it first if it's a private channel.`
    );
  }
  return parts.join(" ");
}
