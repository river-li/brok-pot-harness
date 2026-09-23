var AUTOMATION_ACTION_VERB = {
  created: "Created",
  updated: "Updated",
  enabled: "Enabled",
  disabled: "Disabled",
  deleted: "Deleted"
};
var GENERIC_TIMELINE_EVENT_LINE = "Updated this conversation";
function describeTimelineEvent(event) {
  switch (event.type) {
    case "name-changed":
      return `Renamed to ${event.to}`;
    case "channel-connected":
      return `Connected to ${event.label}`;
    case "channel-disconnected":
      return `Disconnected from ${event.label}`;
    case "automation-changed":
      return `${AUTOMATION_ACTION_VERB[event.action] ?? "Changed"} routine "${event.automationName}"`;
    case "team-shared":
      return TEAM_SHARED_EVENT_LINE;
    case "team-bot-publish":
      return TEAM_BOT_PUBLISH_EVENT_LINE;
    case "person-added":
      return `${event.person.name} was added to the chat`;
  }
  return fallbackForUnknownTimelineEvent(event, GENERIC_TIMELINE_EVENT_LINE);
}
var TEAM_SHARED_EVENT_LINE = "Setting up Team Bot";
var TEAM_BOT_PUBLISH_EVENT_LINE = "Ready to publish to the team";
function fallbackForUnknownTimelineEvent(_event, fallback2) {
  return fallback2;
}
var TIMELINE_EVENT_WAKE_CUE = "[event]";
function buildTimelineEventWakePrompt(events) {
  const lines2 = events.map((event) => `- ${describeTimelineEvent(event)}`);
  return [`${TIMELINE_EVENT_WAKE_CUE} Something about this conversation just changed.`, "This is a system event recorded in your timeline, not the user typing in this app, and possibly something you did yourself.", ...lines2, "If it is worth acknowledging to the user, reply with SendToUser; otherwise it is fine to stay silent."].join("\n");
}
