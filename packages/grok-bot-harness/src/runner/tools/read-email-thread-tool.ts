init_zod();
var READ_EMAIL_THREAD_DEFAULT_MAX_MESSAGES = 20;
var READ_EMAIL_THREAD_MAX_MESSAGES = 50;
var READ_EMAIL_THREAD_DEFAULT_BODY_MAX_CHARS = 4e3;
var READ_EMAIL_THREAD_BODY_MAX_CHARS_CEILING = 5e4;
var READ_EMAIL_THREAD_ID_MAX_LENGTH = 64;
var readEmailThreadParameters = external_exports.object({
  thread_id: external_exports.string().trim().min(1).max(READ_EMAIL_THREAD_ID_MAX_LENGTH).describe(`A thread_id returned by ${SAND_SEARCH_EMAIL_THREADS_TOOL_NAME}.`),
  max_messages: external_exports.number().int().min(1).max(READ_EMAIL_THREAD_MAX_MESSAGES).optional().catch(void 0).describe(
    `Most recent messages to include (default ${READ_EMAIL_THREAD_DEFAULT_MAX_MESSAGES}, max ${READ_EMAIL_THREAD_MAX_MESSAGES}). Older ones are counted, not shown.`
  ),
  body_max_chars: external_exports.number().int().min(1).max(READ_EMAIL_THREAD_BODY_MAX_CHARS_CEILING).optional().catch(void 0).describe(
    `Per-message body cap in characters (default ${READ_EMAIL_THREAD_DEFAULT_BODY_MAX_CHARS}). Raise it only when a long message was cut off.`
  )
});
var description5 = [
  `Read one email conversation in full, oldest message first, by the thread_id that ${SAND_SEARCH_EMAIL_THREADS_TOOL_NAME} returned. Do not invent thread ids.`,
  "Each message shows who sent it, to whom, when, its delivery state, its body, and its stored attachments with the attachment_id to open each one. An image pasted into the body is listed as inline; the body marks where it sat as [inline image: <content id>].",
  "A body can be marked not indexed: the message arrived within the last minute and its text is not readable yet, so wait briefly and read again. A purged body was removed by retention and will not return."
].join("\n");
function messageLines(message, index) {
  const from2 = message.from === null ? "unknown sender" : formatEmailAddress(message.from);
  const subject = message.subject.trim().length > 0 ? message.subject.trim() : "(no subject)";
  const lines2 = [
    `--- ${index + 1}. ${formatEmailDirection(message.direction)} ${formatEmailTimestamp(message.occurredAtMs)} \xB7 message_id ${message.messageId}`,
    `From: ${from2}`
  ];
  if (message.to.length > 0) lines2.push(`To: ${formatEmailAddresses(message.to)}`);
  if (message.cc.length > 0) lines2.push(`Cc: ${formatEmailAddresses(message.cc)}`);
  if (message.replyTo.length > 0) {
    lines2.push(`Reply-To: ${formatEmailAddresses(message.replyTo)}`);
  }
  lines2.push(`Subject: ${subject}`);
  const meta = [`delivery: ${message.deliveryState.toLowerCase()}`];
  if (message.attachmentCount > 0) {
    meta.push(
      `${message.attachmentCount} ${message.attachmentCount === 1 ? "attachment" : "attachments"}`
    );
  }
  lines2.push(meta.join(" \xB7 "));
  lines2.push(...attachmentLines(message));
  switch (message.bodyStatus) {
    case "available":
      lines2.push("", message.body.trimEnd());
      if (message.bodyTruncated) {
        lines2.push("[body truncated; raise body_max_chars to read more]");
      }
      break;
    case "not_indexed":
      lines2.push("", "[body not indexed yet; read the thread again shortly]");
      break;
    case "purged":
      lines2.push("", "[body removed by retention]");
      break;
    case "rejected":
      lines2.push("", "[message rejected by the spam or virus scan; body and attachments withheld]");
      break;
  }
  return lines2;
}
function attachmentLines(message) {
  if (message.attachments.length === 0) {
    if (message.attachmentCount > 0 && message.bodyStatus !== "rejected") {
      return ["attachments: none stored (tiny images or parts that could not be kept)"];
    }
    return [];
  }
  return message.attachments.map((attachment) => {
    const name17 = displayAttachmentName(attachment);
    const detail = `${attachment.contentType}, ${formatEmailAttachmentSize(attachment.sizeBytes)}`;
    const inline = isInlineEmailAttachment(attachment) ? `, inline in the body as [inline image: ${attachment.contentId}]` : "";
    if (attachment.skipReason !== null) {
      return `- attachment_id ${attachment.attachmentId}: ${name17} (${detail}${inline}) \u2014 skipped: ${attachment.skipReason.replaceAll("_", " ")}, cannot be opened`;
    }
    return `- attachment_id ${attachment.attachmentId}: ${name17} (${detail}${inline}) \u2014 open with ${SAND_READ_EMAIL_ATTACHMENT_TOOL_NAME}`;
  });
}
function renderEmailThread(threadId, thread) {
  const lines2 = [
    `Thread ${threadId}: ${thread.messages.length} ${thread.messages.length === 1 ? "message" : "messages"}${thread.truncatedOlderCount > 0 ? ` shown, ${thread.truncatedOlderCount} older not shown (raise max_messages to include them)` : ""}.`
  ];
  thread.messages.forEach((message, index) => {
    lines2.push(...messageLines(message, index));
  });
  return lines2.join("\n");
}
async function readEmailThread(deps, args) {
  const thread = await deps.email.readThread({
    threadId: args.thread_id,
    maxMessages: Math.min(
      args.max_messages ?? READ_EMAIL_THREAD_DEFAULT_MAX_MESSAGES,
      READ_EMAIL_THREAD_MAX_MESSAGES
    ),
    bodyMaxChars: Math.min(
      args.body_max_chars ?? READ_EMAIL_THREAD_DEFAULT_BODY_MAX_CHARS,
      READ_EMAIL_THREAD_BODY_MAX_CHARS_CEILING
    )
  });
  return renderEmailThread(args.thread_id, thread);
}
function createReadEmailThreadTool(deps) {
  return defineCommunicateTool(deps, {
    id: "PLATFORM_ACTION",
    name: SAND_READ_EMAIL_THREAD_TOOL_NAME,
    description: description5,
    parameters: readEmailThreadParameters,
    describeActivity: (args) => ({ detail: args.thread_id }),
    execute: async (_ctx, args, d) => readEmailThread(d, args)
  });
}
