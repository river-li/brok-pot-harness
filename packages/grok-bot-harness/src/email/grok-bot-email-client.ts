var SAND_EMAIL_UNAVAILABLE = "Email is unavailable right now. Try again shortly.";
var MODEL_FACING_CODES = /* @__PURE__ */ new Set([
  Code.NotFound,
  Code.InvalidArgument,
  Code.PermissionDenied,
  Code.FailedPrecondition,
  Code.ResourceExhausted
]);
function toSandEmailError(error41, reportUnexpectedError) {
  if (error41 instanceof SandEmailError) return error41;
  if (error41 instanceof ConnectError && MODEL_FACING_CODES.has(error41.code)) {
    return new SandEmailError(error41.rawMessage);
  }
  reportUnexpectedError(error41);
  return new SandEmailError(SAND_EMAIL_UNAVAILABLE);
}
function toAddress(address) {
  return { name: address.name, email: address.email };
}
function toDirection(direction) {
  switch (direction) {
    case GrokBotEmailDirection.INBOUND:
      return "inbound";
    case GrokBotEmailDirection.OUTBOUND:
      return "outbound";
    default:
      return "unknown";
  }
}
function toBodyStatus(status) {
  switch (status) {
    case GrokBotEmailBodyStatus.AVAILABLE:
      return "available";
    case GrokBotEmailBodyStatus.PURGED:
      return "purged";
    case GrokBotEmailBodyStatus.REJECTED:
      return "rejected";
    default:
      return "not_indexed";
  }
}
function attachmentSummaryFromProto(summary) {
  return {
    attachmentId: summary.attachmentId,
    filename: summary.filename,
    contentType: summary.contentType,
    sizeBytes: Number(summary.sizeBytes),
    skipReason: summary.skipReason ?? null,
    disposition: summary.disposition,
    contentId: summary.contentId ?? null
  };
}
function attachmentFromProto(response) {
  if (response.attachment === void 0) {
    throw new Error("ReadGrokBotEmailAttachment response has no attachment");
  }
  const summary = attachmentSummaryFromProto(response.attachment);
  switch (response.content.case) {
    case "text":
      return {
        summary,
        content: {
          kind: "text",
          text: response.content.value.text,
          truncated: response.content.value.truncated
        }
      };
    case "data":
      return { summary, content: { kind: "bytes", data: response.content.value } };
    default:
      throw new Error("ReadGrokBotEmailAttachment response has no content");
  }
}
function toSearchMode(mode) {
  switch (mode) {
    case "keyword":
      return GrokBotEmailSearchMode.KEYWORD;
    case "semantic":
      return GrokBotEmailSearchMode.SEMANTIC;
    case "hybrid":
      return GrokBotEmailSearchMode.HYBRID;
    case void 0:
      return GrokBotEmailSearchMode.UNSPECIFIED;
  }
}
function inboxFromProto(inbox) {
  return { email: inbox.email };
}
function matchingMessageFromProto(message) {
  return {
    messageId: message.messageId,
    from: message.from === void 0 ? null : toAddress(message.from),
    occurredAtMs: Number(message.occurredAtMs),
    direction: toDirection(message.direction),
    snippet: message.snippet ?? null
  };
}
function threadSummaryFromProto(thread) {
  return {
    threadId: thread.threadId,
    subject: thread.subject,
    messageCount: thread.messageCount,
    lastMessageAtMs: Number(thread.lastMessageAtMs),
    participants: thread.participants.map(toAddress),
    matchingMessages: thread.matchingMessages.map(matchingMessageFromProto)
  };
}
function threadMessageFromProto(message) {
  return {
    messageId: message.messageId,
    direction: toDirection(message.direction),
    from: message.from === void 0 ? null : toAddress(message.from),
    to: message.to.map(toAddress),
    cc: message.cc.map(toAddress),
    replyTo: message.replyTo.map(toAddress),
    subject: message.subject,
    occurredAtMs: Number(message.occurredAtMs),
    deliveryState: message.deliveryState,
    attachmentCount: message.attachmentCount,
    body: message.body,
    bodyTruncated: message.bodyTruncated,
    bodyStatus: toBodyStatus(message.bodyStatus),
    attachments: message.attachments.map(attachmentSummaryFromProto)
  };
}
function searchRequestToProto(args) {
  return new SearchGrokBotEmailThreadsRequest({
    query: args.query,
    inboxEmail: args.inboxEmail,
    fromAddress: args.fromAddress,
    afterMs: args.afterMs === void 0 ? void 0 : BigInt(Math.floor(args.afterMs)),
    beforeMs: args.beforeMs === void 0 ? void 0 : BigInt(Math.floor(args.beforeMs)),
    limit: args.limit ?? 0,
    mode: toSearchMode(args.mode)
  });
}
function readRequestToProto(args) {
  return new ReadGrokBotEmailThreadRequest({
    threadId: args.threadId,
    maxMessages: args.maxMessages ?? 0,
    bodyMaxChars: args.bodyMaxChars ?? 0
  });
}
function readAttachmentRequestToProto(args) {
  return new ReadGrokBotEmailAttachmentRequest({ attachmentId: args.attachmentId });
}
function sendRequestToProto(input) {
  return new SendGrokBotEmailRequest({
    fromInboxEmail: input.fromInboxEmail,
    to: [...input.to],
    cc: [...input.cc],
    bcc: [...input.bcc],
    subject: input.subject,
    textBody: input.textBody,
    htmlBody: input.htmlBody,
    inReplyToMessageId: input.inReplyToMessageId,
    fromName: input.fromDisplayName,
    replyTo: (input.replyTo ?? []).map(
      (address) => new GrokBotEmailAddress({ name: address.name, email: address.email })
    )
  });
}
function createGrokBotEmailReadPort(rpcs, options2) {
  async function guarded(run) {
    try {
      return await run();
    } catch (error41) {
      throw toSandEmailError(error41, options2.reportUnexpectedError);
    }
  }
  return {
    listInboxes: () => guarded(async () => {
      const response = await rpcs.listGrokBotEmailInboxes(new ListGrokBotEmailInboxesRequest({}));
      return response.inboxes.map(inboxFromProto);
    }),
    searchThreads: (args) => guarded(async () => {
      const response = await rpcs.searchGrokBotEmailThreads(searchRequestToProto(args));
      return response.threads.map(threadSummaryFromProto);
    }),
    readThread: (args) => guarded(async () => {
      const response = await rpcs.readGrokBotEmailThread(readRequestToProto(args));
      return {
        messages: response.messages.map(threadMessageFromProto),
        truncatedOlderCount: response.truncatedOlderCount
      };
    }),
    readAttachment: (args) => guarded(
      async () => attachmentFromProto(
        await rpcs.readGrokBotEmailAttachment(readAttachmentRequestToProto(args))
      )
    )
  };
}
function createGrokBotEmailClientPort(rpcs, options2) {
  return {
    ...createGrokBotEmailReadPort(rpcs, options2),
    createInbox: async (input) => {
      try {
        const response = await rpcs.createGrokBotEmailInbox(
          new CreateGrokBotEmailInboxRequest({
            username: input.username,
            displayName: input.displayName ?? ""
          })
        );
        if (response.inbox === void 0) {
          throw new SandEmailError(SAND_EMAIL_UNAVAILABLE);
        }
        return inboxFromProto(response.inbox);
      } catch (error41) {
        throw toSandEmailError(error41, options2.reportUnexpectedError);
      }
    },
    send: async (input) => {
      if (input.attachments !== void 0 && input.attachments.length > 0) {
        throw new SandEmailError(
          "Attachments can only be sent from a server-hosted agent; nothing was sent."
        );
      }
      try {
        const response = await rpcs.sendGrokBotEmail(sendRequestToProto(input));
        return { messageId: response.messageId, threadId: response.threadId };
      } catch (error41) {
        throw toSandEmailError(error41, options2.reportUnexpectedError);
      }
    }
  };
}
