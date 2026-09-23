var DraftRefusedError = class extends SandModelVisibleError {
  constructor(message, category) {
    super(message);
    this.category = category;
  }
  category;
  toolCallAuditOutcome = "denied";
};
var SAND_DRAFT_EXTERNAL_MESSAGE_TOOL_NAME = "DraftExternalMessage";
function nonEmpty7(value) {
  return value != null && value.length > 0 ? value : void 0;
}
function requirePresent(value, field, platform2) {
  invariant(
    value != null && value.length > 0,
    () => `DraftExternalMessage cannot emit a platform:${platform2} draft without ${field}; the argument schema should have refused this call.`
  );
  return value;
}
function buildDraftEmission(args) {
  if (args.platform === "email") {
    const cc = args.cc != null && args.cc.length > 0 ? args.cc : void 0;
    const replyToMessageId = nonEmpty7(args.replyToMessageId);
    return {
      message: {
        type: "email-draft",
        draft: {
          from: requirePresent(args.from, "from", "email"),
          to: requirePresent(args.to, "to", "email"),
          ...cc != null ? { cc } : {},
          subject: requirePresent(args.subject, "subject", "email"),
          body: args.body
        }
      },
      route: {
        platform: "email",
        providerIdentifier: args.providerIdentifier,
        ...replyToMessageId != null ? { replyToMessageId } : {}
      }
    };
  }
  const threadTs = nonEmpty7(args.threadTs);
  return {
    message: {
      type: "slack-draft",
      draft: {
        target: requirePresent(args.target, "target", "slack"),
        body: args.body
      }
    },
    route: {
      platform: "slack",
      providerIdentifier: args.providerIdentifier,
      channelId: requirePresent(args.channelId, "channelId", "slack"),
      ...threadTs != null ? { threadTs } : {}
    }
  };
}
function verifyDraftAgainstRoute(draft, resolution) {
  if (!resolution.ok) {
    throw new DraftRefusedError(
      `Draft refused: the routing could not be verified through the connector (${resolution.reason}). Nothing was drafted. Fix the routing (or the connector's connection) and call this tool again.`,
      "route_unverified"
    );
  }
  const verification = resolution.verification;
  if (draft.message.type === "email-draft" && verification.platform === "email" && draft.message.draft.from.toLowerCase() !== verification.sendingAddress.toLowerCase()) {
    throw new DraftRefusedError(
      `Draft refused: from (${draft.message.draft.from}) is not the address this account really sends as (${verification.sendingAddress}). Nothing was drafted. Call this tool again with from: ${verification.sendingAddress}.`,
      "sender_mismatch"
    );
  }
  return { ...draft, verification };
}
function createDraftExternalMessageTool(deps) {
  return defineCommunicateTool(deps, {
    id: "SEND_TO_USER",
    name: SAND_DRAFT_EXTERNAL_MESSAGE_TOOL_NAME,
    description: `Draft an email or Slack message for the user to review as an editable composer card in the chat. This is the default way a message leaves under the user's name: use it when they ask for a draft or a review, when a message is how you would get a task done that they did not literally ask you to send, when you are replying to something that arrived, and whenever you are unsure whether they meant send. Use the connector's own send tools directly only when the user explicitly asked, in this conversation, to send that message to those recipients (see the system prompt's rules). You write the draft in the user's voice; they can edit every displayed field on the card and then send or discard it. The send is executed by Sand directly when they click Send, so NEVER follow this call with the connector's own send/draft tools for the same message. You must also provide the routing the send will use, which the user cannot edit: providerIdentifier is the installed MCP server identifier exactly as GetMcpServerStatus lists it for the intended account; for Slack, channelId is the real conversation id resolved with the connector's search tools (never guessed), plus threadTs when replying in a thread; for email, from is required and must be the chosen account's real sending address (a plain email address; if unknown, read a sent message's sender field via the Gmail connector's search_threads with query "in:sent" BEFORE drafting), plus replyToMessageId when replying within an existing thread. Sand verifies the routing through the connector before the card appears (the account's real sending address; the channel behind channelId; the message behind replyToMessageId or threadTs) and displays those verified facts on the card. It refuses the draft when verification fails or from is not the account's address. Drafting does not end your turn and nothing is sent yet. If the user sends the card (possibly after editing), you are resumed with a summary of what actually went out; if they discard it, you'll see that on your next turn. Treat a discard as a decline and don't redraft unasked.`,
    parameters: draftExternalMessageParameters,
    describeActivity: (args) => ({
      detail: args.platform === "email" ? "email draft" : "Slack draft"
    }),
    execute: async (ctx, args, d) => {
      const reportDelivery = bindMessageDeliveryReport(d.recordDelivery, ctx, d.toolCallId, {
        destinationType: "draft"
      });
      let emission;
      let draftId;
      try {
        const draft = buildDraftEmission(args);
        const resolution = await d.resolveRouteVerification(ctx, draft.route, d.toolCallId);
        emission = verifyDraftAgainstRoute(draft, resolution);
        draftId = d.onDraftMessage(emission, Date.now());
      } catch (error42) {
        reportDelivery.failed(
          error42,
          error42 instanceof DraftRefusedError ? error42.category : void 0
        );
        throw error42;
      }
      reportDelivery.settled({
        result: "held",
        ...draftId != null && draftId.length > 0 ? { messageId: draftId } : {}
      });
      const where = emission.message.type === "email-draft" ? `email to ${emission.message.draft.to.join(", ")}` : `Slack message to ${emission.message.draft.target}`;
      return `Draft ${where} is now an editable card in the chat` + (draftId != null && draftId.length > 0 ? ` (id: ${draftId})` : "") + ". Nothing has been sent; the user reviews, may edit, and sends or discards it from the card.";
    }
  });
}
