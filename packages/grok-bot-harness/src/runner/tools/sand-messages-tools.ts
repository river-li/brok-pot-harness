var logger107 = createLogger("sand:messages-tools");
function messagesToolAction(toolIdentifier) {
  return toolIdentifier === "SEND_IMESSAGE" ? "send-imessage" : "read-messages";
}
var MESSAGES_ATTACHMENT_BOX_DIR = import_node_path171.posix.join(SAND_BOX_UPLOADS_DIR, "messages");
var INLINE_IMAGE_MIMES = /* @__PURE__ */ new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp"
]);
function decodeAttachmentEnvelope(raw) {
  let parsed2;
  try {
    parsed2 = JSON.parse(raw);
  } catch (error42) {
    if (!(error42 instanceof SyntaxError)) throw error42;
    return { text: raw };
  }
  if (parsed2 === null || typeof parsed2 !== "object") return { text: raw };
  const text2 = "text" in parsed2 ? parsed2.text : void 0;
  if (typeof text2 !== "string") return { text: raw };
  const imageKey = "imageKey" in parsed2 ? parsed2.imageKey : void 0;
  return {
    text: text2,
    ...typeof imageKey === "string" ? { imageKey } : {}
  };
}
function renderAttachment(output, inflightImages) {
  if (output.result.case === "error") {
    return createStringResult(`Error: ${output.result.value.error}`);
  }
  if (output.result.case !== "success") return createStringResult("Tool completed.");
  const envelope = decodeAttachmentEnvelope(output.result.value.currentStep);
  if (envelope.imageKey === void 0) return createStringResult(envelope.text);
  const image2 = inflightImages.get(envelope.imageKey);
  inflightImages.delete(envelope.imageKey);
  if (image2 === void 0) {
    process.stderr.write("sand.messages.attachment_image_missing\n");
    return createStringResult(envelope.text);
  }
  return createImageResult(image2.base64, image2.mime, envelope.text);
}
function boxFileName(filename) {
  const cleaned = import_node_path171.posix.basename(filename).replace(/[^a-zA-Z0-9._-]/g, "_");
  return cleaned.length > 0 && cleaned !== "." && cleaned !== ".." ? cleaned : `attachment-${Date.now()}`;
}
function sendOp(args) {
  const base = {
    kind: "send",
    text: args.text,
    ...args.service !== void 0 ? { service: args.service } : {}
  };
  if (args.to !== void 0 && args.chatId !== void 0) {
    throw new Error("Pass either `to` or `chatId`, not both.");
  }
  if (args.to !== void 0) return { ...base, to: args.to };
  if (args.chatId !== void 0) return { ...base, chatId: args.chatId };
  throw new Error(
    "Pass `to` (an E.164 number or email) or `chatId` (a chat guid from FindIMessageChats)."
  );
}
var RECIPIENT_NAME_MAX_CHARS = 80;
function displayOf(args) {
  if (args.to === void 0) return void 0;
  const recipientName = args.recipientName?.replace(/\s+/g, " ").trim().slice(0, RECIPIENT_NAME_MAX_CHARS);
  return recipientName ? { recipientName } : void 0;
}
async function fetchAttachment(ctx, args, deps, inflightImages) {
  const { filename, mime: mime2, bytesBase64 } = await deps.messages.run(ctx, {
    kind: "fetch-attachment",
    messageGuid: args.messageGuid,
    attachmentGuid: args.attachmentGuid
  });
  if (INLINE_IMAGE_MIMES.has(mime2)) {
    const shrunk = await shrinkImageForModel(ctx, import_node_buffer10.Buffer.from(bytesBase64, "base64"), {
      mimeType: mime2,
      source: "sand_messages_attachment"
    });
    inflightImages.set(deps.toolCallId, { base64: shrunk.data, mime: shrunk.mimeType });
    return JSON.stringify({
      text: `${filename} (${mime2})`,
      imageKey: deps.toolCallId
    });
  }
  const boxPath = import_node_path171.posix.join(MESSAGES_ATTACHMENT_BOX_DIR, boxFileName(filename));
  await deps.agentBox.uploadFile(ctx, deps.getBoxId(), boxPath, import_node_buffer10.Buffer.from(bytesBase64, "base64"));
  return JSON.stringify({
    text: `${filename} (${mime2}) is on your box at ${boxPath}. Open it with Read.`
  });
}
var MESSAGES_TOOL_RESULT_CHAR_CAP = 2 * MESSAGES_RESULT_CHAR_BUDGET;
var LEGACY_TRUNCATION_NOTICE = "Older results were dropped to fit. Paging needs the Cursor app on the connected Mac updated; until then, narrow with chatGuid, SearchIMessages, or IMessageActivity.";
function truncationNotice(result, spansWholeHistory) {
  if (result.truncated === void 0) return void 0;
  if (result.kind === "find-chats") {
    return result.truncated === "bytes" ? "More chats matched than fit the size budget; a bigger limit will not help. Narrow with displayName or handle." : "More chats matched than were returned. Raise limit, or narrow with displayName or handle.";
  }
  if (spansWholeHistory) {
    return "This read spanned the user's whole Messages history. Narrow with chatGuid, IMessageActivity, or SearchIMessages rather than paging through everything.";
  }
  return result.truncated === "bytes" ? "Older items were withheld to fit the size budget; a bigger limit will not help. Pass nextBefore as before for the next-older page." : "Older items were withheld. Pass nextBefore as before for the next-older page.";
}
function boundLegacyReadResult(result) {
  if (result.kind === "find-chats") {
    const { page: page2, total: total2, truncated: truncated2 } = pageChats(result.chats, {
      limits: MESSAGES_PAGE_LIMITS["find-chats"]
    });
    return {
      ...result,
      chats: page2,
      total: total2,
      ...truncated2 !== void 0 ? { truncated: truncated2 } : {},
      notice: LEGACY_TRUNCATION_NOTICE
    };
  }
  const { page, total, truncated } = pageNewest(result.items, {
    limits: MESSAGES_PAGE_LIMITS[result.kind]
  });
  return {
    ...result,
    items: page,
    total,
    ...truncated !== void 0 ? { truncated } : {},
    notice: LEGACY_TRUNCATION_NOTICE
  };
}
function renderReadResult2(result, spansWholeHistory = false) {
  if (result.total !== void 0) {
    const notice = truncationNotice(result, spansWholeHistory);
    return JSON.stringify(notice === void 0 ? result : { ...result, notice });
  }
  const raw = JSON.stringify(result);
  if (raw.length <= MESSAGES_TOOL_RESULT_CHAR_CAP) return raw;
  return JSON.stringify(boundLegacyReadResult(result));
}
function renderContactsResult(result) {
  return JSON.stringify(
    result.truncated === void 0 ? result : { ...result, notice: "More people matched than were returned. Use a fuller name." }
  );
}
function limitParameter(limits) {
  return external_exports.number().int().min(1).optional().describe(
    `Max results to return; the newest are kept. Defaults to ${limits.default}; the Mac clamps to ${limits.max}.`
  );
}
var beforeParameter = external_exports.object({ date: external_exports.string(), id: external_exports.number().int() }).optional().describe(
  "Copy a truncated result's `nextBefore` (`{date, id}`) verbatim to get the next-older page."
);
var findContactsParameters = external_exports.object({
  query: external_exports.string().trim().min(1).describe("A person's name or the start of one; matches any name part, case-insensitively.")
});
var findChatsParameters = external_exports.object({
  displayName: external_exports.string().trim().min(1).optional().describe(
    "Match a group chat by its exact title, not a substring. One-to-one chats have no title, so this never finds a person; get the handle from FindContacts."
  ),
  handle: external_exports.string().trim().min(1).optional().describe(
    "Match a chat whose participant handle equals this exactly, as Messages stores it: an E.164 number (`+15555550100`) or an email."
  ),
  limit: limitParameter(MESSAGES_PAGE_LIMITS["find-chats"])
});
var chatItemsParameters = external_exports.object({
  chatGuid: external_exports.string().trim().min(1).optional().describe(
    "The chat's guid, from FindIMessageChats (e.g. `iMessage;-;+15555550100`). Omitting it reads the whole history, keeps only the newest page, and truncates; prefer a guid, SearchIMessages, or IMessageActivity."
  ),
  limit: limitParameter(MESSAGES_PAGE_LIMITS.items),
  before: beforeParameter
});
var searchParameters = external_exports.object({
  query: external_exports.string().trim().min(1).describe("Text to look for in message bodies."),
  limit: limitParameter(MESSAGES_PAGE_LIMITS.search),
  before: beforeParameter
});
var activityParameters = external_exports.object({
  since: external_exports.string().trim().min(1).describe("Start of the window (inclusive), an ISO-8601 timestamp with offset."),
  until: external_exports.string().trim().min(1).optional().describe(
    "End of the window (exclusive), an ISO-8601 timestamp with offset. Omit to run up to now."
  )
});
var fetchAttachmentParameters = external_exports.object({
  messageGuid: external_exports.string().trim().min(1).describe("The guid of the message carrying the attachment."),
  attachmentGuid: external_exports.string().trim().min(1).describe("The attachment's guid, from the message's `attachments` list.")
});
var sendParameters = external_exports.object({
  text: external_exports.string().min(1).describe("The message body, sent verbatim."),
  to: external_exports.string().trim().min(1).optional().describe(
    "One recipient's handle, exactly an E.164 number (`+15555550100`) or an email; a name or a national-format number is rejected before anything is sent. Get a number from FindContacts. Reaches a one-to-one chat only. Use this or `chatId`."
  ),
  chatId: external_exports.string().trim().min(1).optional().describe(
    "The chat's `guid` from FindIMessageChats (`iMessage;+;chat\u2026` for a group), not its `identifier`. The only way to reach a group chat. Use this or `to`."
  ),
  service: external_exports.enum(MESSAGES_SERVICES).optional().describe(
    "`iMessage` or `SMS` to force one. Omit (or `auto`) to try iMessage, then SMS only if the address is not on iMessage. Ignored with `chatId`, whose guid already carries the service."
  ),
  recipientName: external_exports.string().optional().describe(
    "The recipient's name exactly as FindContacts returned it, shown to the user on the approval card beside the number. Only used with `to`; a `chatId` send shows the chat guid alone. Omit when you do not have one."
  )
});
var checkPermissionsParameters = external_exports.object({});
function boundSendService(service) {
  return service === "iMessage" || service === "SMS" ? service : "other";
}
function boundSendVia(via) {
  return via === "participant" || via === "chat_id" ? via : "other";
}
var MESSAGES_ERROR_CLASSES = [
  "SandLocalToolPermissionDeniedError",
  "SandLocalExecError",
  "SandWireParseError",
  "ConnectError",
  "AbortError",
  "Error"
];
function boundErrorClass(error42) {
  const name17 = errorClassOf(error42);
  return MESSAGES_ERROR_CLASSES.find((known) => known === name17) ?? "other";
}
function sendFailureCategory(error42) {
  if (isMessagesDecline(error42)) return "declined";
  const code = sandMessagesErrorCode(error42);
  return code === "other" ? errorClassOf(error42) : code;
}
async function sendIMessage(ctx, args, tools) {
  const reportDelivery = bindMessageDeliveryReport(tools.recordDelivery, ctx, tools.toolCallId, {
    destinationType: "apple_messages"
  });
  let result;
  try {
    result = await tools.messages.run(ctx, sendOp(args), displayOf(args));
  } catch (error42) {
    reportDelivery.failed(error42, sendFailureCategory(error42));
    throw error42;
  }
  reportDelivery.settled({ result: "sent" });
  return JSON.stringify(result);
}
function okToolUse(result, durationMs) {
  if (result.kind === "send") {
    return {
      op: "send",
      outcome: "ok",
      durationMs,
      sendVerified: result.verified,
      sendService: boundSendService(result.service),
      sendVia: boundSendVia(result.via)
    };
  }
  if (result.kind === "check-permissions") {
    return {
      op: "check-permissions",
      outcome: "ok",
      durationMs,
      fullDiskAccess: result.fullDiskAccess,
      automation: result.automation
    };
  }
  return { op: result.kind, outcome: "ok", durationMs };
}
function failedToolUse(op, error42, durationMs) {
  if (isMessagesDecline(error42)) return { op, outcome: "declined", durationMs };
  return {
    op,
    outcome: "error",
    errorClass: boundErrorClass(error42),
    errorCode: sandMessagesErrorCode(error42),
    durationMs
  };
}
function reportMessagesToolUse(ctx, report, makeUse) {
  try {
    report(makeUse());
  } catch (error42) {
    logger107.warn(ctx, `Messages tool-use report failed (${errorLogTag(error42)})`);
  }
}
function instrumentMessages(messages2, report) {
  return {
    enabled: () => messages2.enabled(),
    run: async (ctx, op, display) => {
      const startedAt = performance.now();
      let result;
      try {
        result = await messages2.run(ctx, op, display);
      } catch (error42) {
        const paused = error42 instanceof DeferredInteractionResponseError;
        const interrupted = ctx.canceled && isIntentionalAbortReason(ctx.reason);
        if (!paused && !interrupted) {
          reportMessagesToolUse(
            ctx,
            report,
            () => failedToolUse(op.kind, error42, performance.now() - startedAt)
          );
        }
        throw error42;
      }
      reportMessagesToolUse(ctx, report, () => okToolUse(result, performance.now() - startedAt));
      return result;
    }
  };
}
function createFetchAttachmentTool(toolDeps) {
  const inflightImages = /* @__PURE__ */ new Map();
  return {
    ...defineCommunicateTool(toolDeps, {
      id: "FETCH_IMESSAGE_ATTACHMENT",
      name: "FetchIMessageAttachment",
      description: "Fetch one attachment from a message in the user's Messages history. Images come back inline for you to look at (HEIC arrives as JPEG); anything else lands on your box at a path you then open with Read. Fails for attachments over 100 MiB or not yet downloaded to the Mac; tell the user rather than retrying.",
      parameters: fetchAttachmentParameters,
      execute: (ctx, args, tools) => fetchAttachment(ctx, args, tools, inflightImages)
    }),
    render: async (_ctx, output) => renderAttachment(output, inflightImages)
  };
}
function createMessagesTools(deps) {
  const gated2 = gateMessagesOnGrants(deps.messages, deps.messagesGrants, deps.reportGrantsAsk);
  const toolDeps = {
    ...deps,
    messages: deps.reportToolUse === void 0 ? gated2 : instrumentMessages(gated2, deps.reportToolUse)
  };
  return [
    defineCommunicateTool(toolDeps, {
      id: "FIND_CONTACTS",
      name: "FindContacts",
      description: "Look up people by name in the user's Contacts on their Mac. Each match carries `name`, `phones` in E.164 (pass one straight to FindIMessageChats `handle` or SendIMessage `to`), and `emails`. `region` is the Mac's country: a number stored without a country code was read as that country's. `unresolvedPhones` are numbers as the user stored them that could not be read as complete; quote them and ask rather than guessing. `total` counts every match. A person never messaged from this Mac has no chat; that is not a reason to stop, send to the phone.",
      parameters: findContactsParameters,
      describeActivity: (args) => ({ detail: args.query }),
      execute: (ctx, args, tools) => tools.messages.run(ctx, { kind: "find-contacts", query: args.query }).then(renderContactsResult)
    }),
    defineCommunicateTool(toolDeps, {
      id: "FIND_IMESSAGE_CHATS",
      name: "FindIMessageChats",
      description: "Find chats in the user's Messages app on their Mac, by group title or by participant handle (E.164 phone or email). Returns each chat's `guid` (the chat id the other Messages tools take; `identifier` is not it), participants, service, and last activity, most recently active first, with `total` counting every match. Start here. `people` maps the handles in the result that matched a Contacts entry to that person's name; call people by that name, and show a handle only when it has no entry.",
      parameters: findChatsParameters,
      execute: (ctx, args, tools) => tools.messages.run(ctx, {
        kind: "find-chats",
        displayName: args.displayName,
        handle: args.handle,
        ...args.limit !== void 0 ? { limit: args.limit } : {}
      }).then((result) => renderReadResult2(result))
    }),
    defineCommunicateTool(toolDeps, {
      id: "CHAT_ITEMS",
      name: "ChatItems",
      description: "Read a Messages conversation on the user's Mac: messages with their reply threading, tapbacks, edits, unsends, attachments, and group events, newest last. Returns the newest page; `total` counts every item, and a truncated result carries `nextBefore` to pass as `before` for the next-older page. On a message, `handle` is the other party (the recipient on the user's own one-to-one messages, absent on their group messages), never the user's own address, and `body.fallback: true` means the text was recovered lossily. `people` maps the handles in the result that matched a Contacts entry to that person's name; call people by that name, and show a handle only when it has no entry.",
      parameters: chatItemsParameters,
      execute: (ctx, args, tools) => tools.messages.run(ctx, {
        kind: "items",
        chatGuid: args.chatGuid,
        ...args.limit !== void 0 ? { limit: args.limit } : {},
        ...args.before !== void 0 ? { before: args.before } : {}
      }).then((result) => renderReadResult2(result, args.chatGuid === void 0))
    }),
    defineCommunicateTool(toolDeps, {
      id: "SEARCH_IMESSAGES",
      name: "SearchIMessages",
      description: "Search the user's Messages history on their Mac across every chat. Matches are case-insensitive substrings of message bodies only, not attachments, group titles, names, or handles. Returns the newest matches with their chat guids, so you can follow one up with ChatItems; `total` counts every match, and a truncated result carries `nextBefore` to pass as `before` for the next-older page. `people` maps the handles in the result that matched a Contacts entry to that person's name; call people by that name, and show a handle only when it has no entry.",
      parameters: searchParameters,
      describeActivity: (args) => ({ detail: args.query }),
      execute: (ctx, args, tools) => tools.messages.run(ctx, {
        kind: "search",
        needle: args.query,
        ...args.limit !== void 0 ? { limit: args.limit } : {},
        ...args.before !== void 0 ? { before: args.before } : {}
      }).then((result) => renderReadResult2(result))
    }),
    defineCommunicateTool(toolDeps, {
      id: "IMESSAGE_ACTIVITY",
      name: "IMessageActivity",
      description: "Count messages sent and received per chat over a time window in the user's Messages history, as `{chatGuid, count, handles, displayName}` rows, most recently active chat first; `chatGuid` is what ChatItems takes. `people` maps the handles in the result that matched a Contacts entry to that person's name; call people by that name, and show a handle only when it has no entry. Use this to see which chats have been active before reading any conversation.",
      parameters: activityParameters,
      execute: (ctx, args, tools) => tools.messages.run(ctx, { kind: "activity", since: args.since, until: args.until }).then((result) => JSON.stringify(result))
    }),
    createFetchAttachmentTool(toolDeps),
    defineCommunicateTool(toolDeps, {
      id: "SEND_IMESSAGE",
      name: "SendIMessage",
      description: "Send a message from the user's Mac, as the user. Address it with `to` (one handle) or `chatId` (a chat guid). Every call raises an approval card the user must accept, unless the user has allowed that recipient, or every send, on their computer; send once and report the result. `via` echoes how it was addressed, and `verified` is whether the text has already appeared in the local chat log, so `false` means not seen yet, not failed. Never resend on `verified: false`.",
      parameters: sendParameters,
      execute: sendIMessage
    }),
    defineCommunicateTool(toolDeps, {
      id: "CHECK_IMESSAGE_PERMISSIONS",
      name: "CheckIMessagePermissions",
      description: "Report which grants the user's Mac has given the Messages tools: `fullDiskAccess` (reading history), `automation` (sending; `notAsked` can also mean Messages.app is not running), and `contacts` (FindContacts). Call it when a Messages tool fails with a denied or `helper_\u2026_failed` error, then tell the user which grant to give. A declined approval card is not a permission problem.",
      parameters: checkPermissionsParameters,
      execute: (ctx, _args, tools) => tools.messages.run(ctx, { kind: "check-permissions" }).then((result) => JSON.stringify(result))
    })
  ];
}
