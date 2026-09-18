function parseCreatedDraftId(resultText) {
  const parsed2 = parseDraftConnectorJson(resultText.trim());
  if (!parsed2.ok) return null;
  const { value } = parsed2;
  if (typeof value === "string") return value.length > 0 ? value : null;
  if (typeof value === "object" && value != null && "id" in value) {
    const { id } = value;
    return typeof id === "string" && id.length > 0 ? id : null;
  }
  return null;
}
function buildDraftSendCall(route, payload) {
  if (route.platform === "email" && payload.type === "email-draft") {
    const draft = payload.draft;
    const recipients = inertDraftText(draft.to.join(", "));
    const messageArgs = {
      to: [...draft.to],
      ...draft.cc != null && draft.cc.length > 0 ? { cc: [...draft.cc] } : {},
      subject: draft.subject,
      body: draft.body,
      htmlBody: emailDraftHtmlBody(draft.body)
    };
    if (route.replyToMessageId == null) {
      return {
        toolName: "send_message",
        args: messageArgs,
        settledState: "sent",
        outcomeSummary: `sent from the user's Gmail to ${recipients}`
      };
    }
    return {
      toolName: "create_draft",
      args: { ...messageArgs, replyToMessageId: route.replyToMessageId },
      settledState: "sent",
      outcomeSummary: `sent from the user's Gmail to ${recipients}, threaded on the message it replies to`,
      completion: {
        buildCall: (firstResultText) => {
          const draftId = parseCreatedDraftId(firstResultText);
          return draftId == null ? null : { toolName: "send_message", args: { draftId } };
        },
        fallbackState: "draft-created",
        fallbackSummary: `staged in the user's mailbox as a ready-to-send Gmail draft to ${recipients}, but NOT sent \u2014 the finishing send didn't complete, so the user must finish it from Gmail`
      }
    };
  }
  if (route.platform === "slack" && payload.type === "slack-draft") {
    const target = inertDraftText(payload.draft.target);
    return {
      toolName: "slack_send_message",
      args: {
        channel_id: route.channelId,
        message: payload.draft.body,
        ...route.threadTs != null ? { thread_ts: route.threadTs } : {}
      },
      settledState: "sent",
      outcomeSummary: `sent on Slack to ${target} (channel ${inertDraftText(route.channelId)})`
    };
  }
  return null;
}
