var GROK_BOT_SESSION_PARTICIPANTS_PROMPT_MAX = 8;
var SLACK_ONE_REPLY_LINE = "In Slack, each SendToUser call is a separate message in this conversation, and people read it as one exchange, so gather your answer and send it once; split only when the parts are genuinely separate, such as a quick acknowledgement before a long task";
var SLACK_READING_MEDIUM_LINES = [
  "People read this on a phone or in Slack's narrow thread pane, where one long paragraph becomes a wall of text and the opening line decides whether the rest gets read",
  "Your text is posted as standard markdown, so **double asterisks** make bold and a single pair makes italics, - starts a bullet and 1. a numbered step, and links, inline code and fenced code render as written",
  "A heading renders as one oversized line, and a table renders as a Slack table that is cramped past two or three short columns in that pane",
  "In a long analysis, the headline and the two or three points that decide it are what gets read in a thread, and the full detail is something people would rather ask for than scroll past"
];
var AUTOMATIONS_IN_APP_ONLY_LINE = "Routines cannot be created, changed, or resumed from this conversation, so never offer or promise to set one up here. They are set up in the Grok Bot app, in the person's own chat with you there (your owner from their main conversation), which is also where they see and manage them; when someone asks for one, say that, and note that a routine saved there can still listen to Slack or post to a Slack channel. Pausing or deleting a routine from here works.";
var SLACK_PLUGIN_AUTH_LINE = "In Slack, connector cards and grokbot:// links are not delivered. When GetMcpServerStatus shows needsAuth and a numeric plugin= id, send one SendToUser text message naming the plugin, with https://cursor.com/grok-bot/link/v1/plugin/add?id=<id>, that they need to sign in, and that they should reply in this thread when they have finished. Several plugins: one message, one link each, one reply. Do not call AuthenticateMcpServer expecting a card, and never paste an authorization URL or a grokbot:// link. No numeric plugin id: say they need to connect that connector in the Grok Bot app. A team connector missing setup is not needsAuth: no link and no value prompt. If a later reply still shows needsAuth, including a reply from someone else, send the link again and do not claim it succeeded. Already authenticated: do not send the link.";
function slackSegments(sessionId) {
  const [platform2, channel, ...rest] = sessionId.split(":");
  if (platform2 !== "slack" || channel === void 0 || channel.length === 0) return null;
  const anchor = rest.join(":");
  return { channel, anchor: anchor.length > 0 ? anchor : void 0 };
}
function speakerList(participants) {
  const named = participants.slice(0, GROK_BOT_SESSION_PARTICIPANTS_PROMPT_MAX);
  const rest = participants.length - named.length;
  if (rest > 0) return `${named.join(", ")}, and ${rest} more`;
  if (named.length <= 2) return named.join(" and ");
  return `${named.slice(0, -1).join(", ")}, and ${named[named.length - 1]}`;
}
function speakersSentence(participants, place) {
  return ` Speakers in this ${place} so far: ${speakerList(participants)}.`;
}
function whereLine(session) {
  const slack = slackSegments(session.sessionId);
  const participants = session.participants ?? [];
  if (session.kind === GROK_BOT_SESSION_KIND_SLACK_THREAD && slack?.anchor !== void 0) {
    return `You are replying in a Slack thread \u2014 channel ${slack.channel}, thread ${slack.anchor}.` + (participants.length > 0 ? speakersSentence(participants, "thread") : "");
  }
  if (session.kind === GROK_BOT_SESSION_KIND_SLACK_GROUP_DM && slack != null) {
    return `You are replying in a Slack group direct message \u2014 conversation ${slack.channel}.` + (participants.length > 0 ? speakersSentence(participants, "conversation") : "");
  }
  if (session.kind === GROK_BOT_SESSION_KIND_SLACK_DM && slack != null) {
    if (slack.channel.startsWith("D") && participants.length === 1) {
      return `You are replying in a Slack direct message with ${participants[0]} \u2014 conversation ${slack.channel}.`;
    }
    return `You are replying in a Slack direct message \u2014 conversation ${slack.channel}.` + (participants.length > 0 ? speakersSentence(participants, "conversation") : "");
  }
  if (session.kind === GROK_BOT_SESSION_KIND_DM) {
    return "You are in a direct-message conversation with one teammate in the Grok Bot app.";
  }
  if (session.kind === GROK_BOT_SESSION_KIND_GROUP) {
    return "You are one of the bots in a group chat in the Grok Bot app with several teammates." + (participants.length > 0 ? speakersSentence(participants, "group") : "") + " You are one participant among people and other bots, not the one everyone is talking to.";
  }
  return "You are in one of this agent's parallel conversations.";
}
function renderCurrentSessionPrompt(session) {
  if (session === void 0) return null;
  if (session.sessionId.length === 0 || session.kind === GROK_BOT_SESSION_KIND_MAIN) return null;
  const inSlack = session.kind === GROK_BOT_SESSION_KIND_SLACK_DM || session.kind === GROK_BOT_SESSION_KIND_SLACK_GROUP_DM || session.kind === GROK_BOT_SESSION_KIND_SLACK_THREAD;
  const automationsInAppOnly = inSlack || session.kind === GROK_BOT_SESSION_KIND_GROUP;
  return [
    `Current conversation (session_id: ${session.sessionId}).`,
    whereLine(session),
    "Only the people in this conversation see what you say here; the agent's other conversations have their own history.",
    ...automationsInAppOnly ? [AUTOMATIONS_IN_APP_ONLY_LINE] : [],
    ...inSlack ? [SLACK_ONE_REPLY_LINE, ...SLACK_READING_MEDIUM_LINES] : [],
    ...inSlack && session.slackPluginAuthLink === true ? [SLACK_PLUGIN_AUTH_LINE] : []
  ].join("\n");
}
