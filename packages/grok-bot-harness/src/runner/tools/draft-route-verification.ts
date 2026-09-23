init_scheduling();
init_errors();
function verificationExecuteFailure(result) {
  return result.needsAuth != null ? { ok: false, reason: result.error, needsAuth: result.needsAuth } : { ok: false, reason: result.error };
}
function parseSentSender(resultText) {
  const threads = parseDraftConnectorRecord(resultText)?.threads;
  if (!Array.isArray(threads)) return null;
  const threadList = threads;
  for (const thread of threadList) {
    if (typeof thread !== "object" || thread == null || !("messages" in thread)) continue;
    const { messages: messages2 } = thread;
    if (!Array.isArray(messages2)) continue;
    const messageList = messages2;
    for (const message of messageList) {
      if (typeof message !== "object" || message == null) continue;
      const sender = "sender" in message ? message.sender : void 0;
      const labelIds = "labelIds" in message ? message.labelIds : void 0;
      if (!Array.isArray(labelIds) || !labelIds.includes("SENT")) continue;
      if (typeof sender !== "string") continue;
      const bracketed = /<([^\s<>]+@[^\s<>]+)>/.exec(sender)?.[1];
      if (bracketed != null) return bracketed;
      if (sender.includes("@")) return sender.trim();
    }
  }
  return null;
}
function parseRepliedToMessage(resultText) {
  const message = parseDraftConnectorRecord(resultText);
  if (message == null) return null;
  const { subject, sender } = message;
  if (typeof subject !== "string" || subject.length === 0) return null;
  return typeof sender === "string" && sender.length > 0 ? `\u201C${subject}\u201D from ${sender}` : `\u201C${subject}\u201D`;
}
function slackReadMessages(resultText) {
  const messages2 = parseDraftConnectorRecord(resultText)?.messages;
  return typeof messages2 === "string" ? messages2 : "";
}
function parseThreadParent(resultText) {
  const messages2 = slackReadMessages(resultText);
  const author = /^From:\s*([^<(\n]+)/m.exec(messages2)?.[1]?.trim();
  const afterTs = /^Message TS:[^\n]*\n([\s\S]*)/m.exec(messages2)?.[1];
  const firstLine2 = afterTs?.split("\n").map((line) => line.trim()).find((line) => line.length > 0);
  if (author == null || author.length === 0 || firstLine2 == null) return null;
  const summary = `${author}: ${firstLine2}`;
  return summary.length > 80 ? `${summary.slice(0, 79)}\u2026` : summary;
}
function parseChannelDisplayName(resultText) {
  const match2 = /^Channel:\s*(.+?)\s*\(([^)]+)\)/.exec(slackReadMessages(resultText));
  if (match2 == null) return null;
  const [, name17, id] = match2;
  if (name17 == null || name17.length === 0) return null;
  return name17 === "DM" ? `DM (${id})` : name17;
}
function parseAuthedWorkspace(resultText) {
  const profile = parseDraftConnectorRecord(resultText)?.result;
  if (typeof profile !== "string") return null;
  const organization = /^Organization Name:\s*(.+)$/m.exec(profile)?.[1]?.trim();
  if (organization == null || organization.length === 0) return null;
  const email3 = /^Email:\s*(\S+@\S+)$/m.exec(profile)?.[1];
  return email3 == null ? organization : `${organization} (${email3})`;
}
function slackProfileField(resultText, field) {
  const profile = parseDraftConnectorRecord(resultText)?.result;
  if (typeof profile !== "string") return null;
  const value = field.exec(profile)?.[1]?.trim();
  return value == null || value.length === 0 ? null : value;
}
function parseSlackProfileDisplayName(resultText) {
  return slackProfileField(resultText, /^Display Name:\s*(.+)$/m) ?? slackProfileField(resultText, /^[^\n(]*\(([^)\n]+)\)/) ?? slackProfileField(resultText, /^Real Name:\s*(.+)$/m);
}
function parseSlackChannelPeople(channelMessages) {
  const people = [];
  for (const line of channelMessages.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.length === 0 || trimmed.startsWith("Channel:")) continue;
    const withEmail = /^([^<>]+?)\s*<([^\s<>]+@[^\s<>]+)>:/.exec(trimmed);
    if (withEmail?.[1] != null) {
      people.push({ name: withEmail[1], email: withEmail[2] });
      continue;
    }
    const name17 = /^([^:<>]+):/.exec(trimmed)?.[1]?.trim();
    if (name17 != null && name17.length > 0) people.push({ name: name17 });
  }
  return people;
}
function slackProfileSelfNames(authedProfileText) {
  return [
    slackProfileField(authedProfileText, /^Display Name:\s*(.+)$/m),
    slackProfileField(authedProfileText, /^Real Name:\s*(.+)$/m),
    slackProfileField(authedProfileText, /^Username:\s*(.+)$/m),
    slackProfileField(authedProfileText, /^[^\n(]*\(([^)\n]+)\)/)
  ].filter((name17) => name17 != null).map((name17) => name17.toLowerCase());
}
function isAuthedSpeaker(person, selfEmail, selfNames) {
  if (selfEmail != null && person.email?.toLowerCase() === selfEmail) return true;
  return selfNames.includes(person.name.toLowerCase());
}
var SLACK_CONVERSATION_ID = /^[CDG][A-Z0-9]{8,}$/i;
var SLACK_USER_ID = /^U[A-Z0-9]+$/i;
function isAnonymousChannelName(headerName, channelId) {
  return headerName === "DM" || /^DM\s*\(/.test(headerName) || headerName === channelId || SLACK_CONVERSATION_ID.test(headerName);
}
function resolveSlackToLabel(args) {
  const { headerName, channelId, channelMessages, authedProfileText, partnerProfileName } = args;
  if (!isAnonymousChannelName(headerName, channelId)) return headerName;
  if (partnerProfileName != null && partnerProfileName.length > 0) return partnerProfileName;
  const selfEmail = slackProfileField(authedProfileText, /^Email:\s*(\S+@\S+)$/m)?.toLowerCase();
  const selfNames = slackProfileSelfNames(authedProfileText);
  const partner = parseSlackChannelPeople(channelMessages).find(
    (person) => !isAuthedSpeaker(person, selfEmail, selfNames)
  );
  return partner?.name ?? headerName;
}
function sameRouteIdentity(a, b2) {
  if (a.platform === "email" && b2.platform === "email") {
    return a.sendingAddress.toLowerCase() === b2.sendingAddress.toLowerCase();
  }
  if (a.platform === "slack" && b2.platform === "slack") {
    return a.workspace === b2.workspace;
  }
  return false;
}
function plannedDraftVerificationReads(route) {
  if (route.platform === "email") {
    return [
      { toolName: "search_threads", args: { query: "in:sent", pageSize: 1 } },
      ...route.replyToMessageId == null ? [] : [
        {
          toolName: "get_message",
          args: {
            messageId: route.replyToMessageId,
            messageFormat: "MINIMAL"
          }
        }
      ]
    ];
  }
  return [
    {
      toolName: "slack_read_channel",
      args: { channel_id: route.channelId, limit: 1, response_format: "concise" }
    },
    { toolName: "slack_read_user_profile", args: {} },
    ...SLACK_USER_ID.test(route.channelId) ? [{ toolName: "slack_read_user_profile", args: { user_id: route.channelId } }] : [],
    ...route.threadTs == null ? [] : [
      {
        toolName: "slack_read_thread",
        args: {
          channel_id: route.channelId,
          message_ts: route.threadTs,
          limit: 1,
          response_format: "detailed"
        }
      }
    ]
  ];
}
async function readSlackPartnerProfileName(execute, route) {
  if (!SLACK_USER_ID.test(route.channelId)) return void 0;
  const partner = await execute({
    providerIdentifier: route.providerIdentifier,
    toolName: "slack_read_user_profile",
    args: { user_id: route.channelId }
  });
  if (!partner.ok) return void 0;
  return parseSlackProfileDisplayName(partner.text) ?? void 0;
}
async function resolveDraftRouteVerification(execute, route) {
  if (route.platform === "email") {
    const result2 = await execute({
      providerIdentifier: route.providerIdentifier,
      toolName: "search_threads",
      args: {
        query: "in:sent",
        pageSize: 1
      }
    });
    if (!result2.ok) return verificationExecuteFailure(result2);
    const sendingAddress = parseSentSender(result2.text);
    if (sendingAddress == null) {
      return {
        ok: false,
        reason: "The mailbox returned no sent message to read the sending address from."
      };
    }
    if (route.replyToMessageId == null) {
      return { ok: true, verification: { platform: "email", sendingAddress } };
    }
    const replied = await execute({
      providerIdentifier: route.providerIdentifier,
      toolName: "get_message",
      args: {
        messageId: route.replyToMessageId,
        messageFormat: "MINIMAL"
      }
    });
    if (!replied.ok) return verificationExecuteFailure(replied);
    const replyTo = parseRepliedToMessage(replied.text);
    if (replyTo == null) {
      return {
        ok: false,
        reason: `The mailbox did not report a message for replyToMessageId ${route.replyToMessageId}.`
      };
    }
    return {
      ok: true,
      verification: { platform: "email", sendingAddress, replyTo }
    };
  }
  const result = await execute({
    providerIdentifier: route.providerIdentifier,
    toolName: "slack_read_channel",
    args: {
      channel_id: route.channelId,
      limit: 1,
      response_format: "concise"
    }
  });
  if (!result.ok) return verificationExecuteFailure(result);
  const headerName = parseChannelDisplayName(result.text);
  if (headerName == null) {
    return {
      ok: false,
      reason: `The Slack connector did not report a channel for id ${route.channelId}.`
    };
  }
  const profile = await execute({
    providerIdentifier: route.providerIdentifier,
    toolName: "slack_read_user_profile",
    args: {}
  });
  if (!profile.ok) return verificationExecuteFailure(profile);
  const workspace = parseAuthedWorkspace(profile.text);
  if (workspace == null) {
    return {
      ok: false,
      reason: "The Slack connector did not report the sending account's workspace."
    };
  }
  const channelName = resolveSlackToLabel({
    headerName,
    channelId: route.channelId,
    channelMessages: slackReadMessages(result.text),
    authedProfileText: profile.text,
    partnerProfileName: await readSlackPartnerProfileName(execute, route)
  });
  if (route.threadTs == null) {
    return {
      ok: true,
      verification: { platform: "slack", channelName, workspace }
    };
  }
  const parent = await execute({
    providerIdentifier: route.providerIdentifier,
    toolName: "slack_read_thread",
    args: {
      channel_id: route.channelId,
      message_ts: route.threadTs,
      limit: 1,
      response_format: "detailed"
    }
  });
  if (!parent.ok) return verificationExecuteFailure(parent);
  const thread = parseThreadParent(parent.text);
  if (thread == null) {
    return {
      ok: false,
      reason: `The Slack connector did not report a thread parent for ts ${route.threadTs}.`
    };
  }
  return {
    ok: true,
    verification: { platform: "slack", channelName, workspace, thread }
  };
}
var verificationDeadline = createDeadlinePolicy({
  name: "draft-route-verification",
  timeoutMs: 2e4
});
function createDraftVerificationExecute(ctx, mcp, agentId) {
  return async ({ providerIdentifier, toolName, args }) => {
    try {
      const executor = mcp.createExecutor(void 0, void 0, { agentId });
      const result = await verificationDeadline.run(
        () => executor.execute(
          ctx,
          buildDraftCallArgs({
            providerIdentifier,
            toolName,
            callIdPrefix: "sand-draft-verify",
            args
          })
        )
      );
      const failure2 = describeDraftCallFailure(result);
      if (failure2 != null) return { ok: false, error: failure2 };
      return { ok: true, text: draftCallResultText(result) };
    } catch (error42) {
      if (error42 instanceof DeadlineExceededError) {
        return { ok: false, error: "The connector did not answer in time." };
      }
      return { ok: false, error: errorMessage(error42) };
    }
  };
}
