var SAND_AWAITING_USER_SEND_MESSAGE_BLOCKED = "This turn is already waiting on the user (you sent a question widget or handed the box back to them), so this message was not delivered. Wait for the user \u2014 their response arrives as the next message \u2014 then say this on your next turn.";
async function resolveCloudAgentTitleBestEffort(ctx, bcId, deps) {
  if (deps.resolveCloudAgentTitle == null) return void 0;
  try {
    const title = await deps.resolveCloudAgentTitle(ctx, bcId);
    const trimmed = title?.trim();
    return trimmed != null && trimmed.length > 0 ? trimmed : void 0;
  } catch {
    return void 0;
  }
}
async function resolveAttachmentSource(ctx, sourceUrl, deps) {
  const sourcePath = filePathFromFileUrl(sourceUrl);
  const fileName = sourcePath != null ? (0, import_node_path171.basename)(sourcePath) : void 0;
  const resolved = (url2) => ({
    url: url2,
    ...fileName != null && fileName.length > 0 ? { fileName } : {}
  });
  if (sourcePath == null) return resolved(sourceUrl);
  const ingest = deps.getIngestAttachment();
  if (ingest == null && deps.resolveBoxAttachment == null) return resolved(sourceUrl);
  let ingestError;
  if (ingest != null) {
    try {
      return resolved((0, import_node_url17.pathToFileURL)(await ingest(sourcePath)).href);
    } catch (error42) {
      if (error42 instanceof SandToolInputError || error42 instanceof AttachmentTooLargeError) {
        throw error42;
      }
      ingestError = error42;
    }
  }
  const boxUrl = await deps.resolveBoxAttachment?.(ctx, sourcePath);
  if (boxUrl != null) return resolved(boxUrl);
  throw new SandToolInputError(
    ingestError instanceof Error ? `Could not save the attachment: ${ingestError.message}` : "Could not save the attachment. Make sure the file exists on the agent's computer, then retry."
  );
}
async function measureMediaDimensions(url2, deps) {
  if (deps.readMediaDimensions == null) return void 0;
  const filePath = filePathFromFileUrl(url2);
  if (filePath == null) return void 0;
  return await deps.readMediaDimensions(filePath) ?? void 0;
}
function isWebpageAttachmentUrl(url2) {
  try {
    return new URL(url2).protocol === "https:" && classifyAttachment({ urlOrPath: url2 }) === "file";
  } catch {
    return false;
  }
}
var ESCAPED_LINE_BREAK_TOKEN = /\\r\\n|\\n|\\r/g;
var STRUCTURAL_ESCAPED_LINE_BREAK = /(?:\\r\\n|\\n|\\r){2,}|(?:\\r\\n|\\n|\\r)(?=[\t ]*(?:[-*+] |\d{1,3}[.)] |#{1,6} |>|```|~~~))/g;
function normalizeSendMessageTextContent(content) {
  return content.replace(
    STRUCTURAL_ESCAPED_LINE_BREAK,
    (lineBreaks) => lineBreaks.replace(ESCAPED_LINE_BREAK_TOKEN, "\n")
  );
}
async function buildSandSendMessage(ctx, rawArgs, deps) {
  const replyTo = rawArgs.reply_to != null && rawArgs.reply_to.length > 0 ? rawArgs.reply_to : void 0;
  const channel = rawArgs.channel != null && rawArgs.channel.length > 0 ? rawArgs.channel : void 0;
  if (channel != null) {
    const problem = describeChannelAddressProblem(channel);
    if (problem != null) throw new SandToolInputError(problem);
  }
  const alt = rawArgs.alt != null && rawArgs.alt.length > 0 ? rawArgs.alt : void 0;
  switch (rawArgs.type) {
    case "text": {
      const images = [];
      for (const image2 of rawArgs.images ?? []) {
        const source = await resolveAttachmentSource(ctx, image2.url, deps);
        const imageAlt = image2.alt != null && image2.alt.length > 0 ? image2.alt : void 0;
        const dimensions = await measureMediaDimensions(source.url, deps);
        images.push({
          url: source.url,
          ...imageAlt != null ? { alt: imageAlt } : {},
          ...dimensions ?? {}
        });
      }
      return {
        type: "text",
        content: normalizeSendMessageTextContent(rawArgs.content ?? ""),
        ...images.length > 0 ? { images } : {},
        ...replyTo != null ? { reply_to: replyTo } : {},
        ...channel != null ? { channel } : {},
        ...rawArgs.voice_memo === true ? { voice_memo: true } : {}
      };
    }
    case "widget": {
      const widget = rawArgs.widget;
      if (widget == null) {
        throw new SandToolInputError("widget is required when type is widget");
      }
      return {
        type: "widget",
        widget,
        ...replyTo != null ? { reply_to: replyTo } : {}
      };
    }
    case "cursor-agent": {
      const bcId = rawArgs.bcId;
      if (bcId == null || bcId.length === 0) {
        throw new SandToolInputError("bcId is required when type is cursor-agent");
      }
      const title = await resolveCloudAgentTitleBestEffort(ctx, bcId, deps);
      return {
        type: "cursor-agent",
        bcId,
        ...title != null ? { title } : {},
        ...replyTo != null ? { reply_to: replyTo } : {}
      };
    }
    case "secret-request": {
      const secret = rawArgs.secret;
      if (secret == null) {
        throw new SandToolInputError("secret is required when type is secret-request");
      }
      const description9 = secret.description != null && secret.description.length > 0 ? clampSecretDescription(secret.description) : void 0;
      const secretRequest = {
        label: clampSecretLabel(secret.label),
        ...description9 != null ? { description: description9 } : {},
        target: resolveSendMessageSecretTarget(
          { name: secret.name, pluginId: secret.plugin_id },
          deps.resolveSecretRequestTarget
        )
      };
      return {
        type: "secret-request",
        secretRequest,
        ...replyTo != null ? { reply_to: replyTo } : {}
      };
    }
    case "credential-request": {
      const credential = rawArgs.credential;
      if (credential == null) {
        throw new SandToolInputError("credential is required when type is credential-request");
      }
      const siteHint = normalizeCredentialTarget(credential.site);
      if (siteHint == null) {
        throw new SandToolInputError(
          "site must be a secure URL/domain for a browser-login credential"
        );
      }
      if (deps.resolveCredentialBrowserTarget == null) {
        throw new SandToolInputError("Saved credential use is unavailable in this conversation.");
      }
      const reference = {
        credentialId: credential.credential_id,
        connectionId: credential.connection_id,
        catalogRevision: credential.catalog_revision
      };
      const resolvedTarget = await deps.resolveCredentialBrowserTarget(reference, siteHint);
      if (!resolvedTarget.ok) {
        throw new SandToolInputError(resolvedTarget.detail);
      }
      const requestedAtMs = Date.now();
      const credentialRequest = {
        kind: "browser-login",
        ...reference,
        targetSite: resolvedTarget.targetSite,
        ...resolvedTarget.targetWebSocketDebuggerUrl === void 0 ? {} : { targetWebSocketDebuggerUrl: resolvedTarget.targetWebSocketDebuggerUrl },
        ...resolvedTarget.autoFill ? { autoFill: true } : {},
        purpose: clampCredentialPurpose(credential.purpose),
        requestedAtMs,
        expiresAtMs: requestedAtMs + 5 * 60 * 1e3
      };
      return {
        type: "credential-request",
        credentialRequest,
        ...replyTo != null ? { reply_to: replyTo } : {}
      };
    }
    case "attachment": {
      const attachmentUrl = rawArgs.url ?? "";
      if (isWebpageAttachmentUrl(attachmentUrl)) {
        return {
          type: "text",
          content: attachmentUrl,
          ...replyTo != null ? { reply_to: replyTo } : {},
          ...channel != null ? { channel } : {}
        };
      }
      const source = await resolveAttachmentSource(ctx, attachmentUrl, deps);
      const dimensions = await measureMediaDimensions(source.url, deps);
      return {
        type: "attachment",
        url: source.url,
        ...replyTo != null ? { reply_to: replyTo } : {},
        ...source.fileName != null ? { file_name: source.fileName } : {},
        ...alt != null ? { alt } : {},
        ...channel != null ? { channel } : {},
        ...dimensions ?? {}
      };
    }
    default: {
      const _exhaustive = rawArgs.type;
      return _exhaustive;
    }
  }
}
var OPENING_POLICY = `Say something to the user in the Grok Bot chat. This is your only voice. The user only ever sees the content of SendToUser calls; your plain assistant text is invisible to them (it is just your private scratchpad), so a reply counts only once it is inside SendToUser, including short, casual, or social replies like "Hey" or "Doing good, you?". Finish a turn where someone is waiting on you without calling SendToUser and they see total silence and assume you ignored them; the lone exception is a scheduled routine (a [routine] run) whose saved instruction says to stay quiet when there's nothing to report, where ending with no SendToUser is correct rather than filler like "(no change.)". Keep the user posted along the way, not just at the end: post an update for a real result, decision, blocker, or change of plan, and batch or omit routine mechanics, retries, and minor snags rather than narrating each one; prefer fewer, higher-signal updates over a play-by-play. Still, never vanish into a long silent run on something the user is waiting on. This also covers results: output the user is waiting on counts as delivered only inside a SendToUser, so an opening acknowledgement does not discharge it (ack \u2260 delivery)`;
var LEAN_SEND_TO_USER_POLICY_HEADINGS = {
  onlyVoice: "SendToUser is your only voice",
  autonomy: "Autonomy",
  askingForDecisions: "Asking for decisions"
};
var OPENING_LEAN = `Send a message to the user in the Grok Bot chat. It is your only user-visible voice: reply here first on a turn a person opened, post a brief update for a real result, decision, blocker, or change of plan along the way (never a play-by-play), and deliver the result itself here before you yield; the full rules are in your instructions under ${LEAN_SEND_TO_USER_POLICY_HEADINGS.onlyVoice}. `;
var UPDATE_COMMUNICATION_DELIVERY_CHECK = 'Say "done" only when the requested end state is verified; otherwise name the exact state (drafted, sent, waiting, blocked). Before the final send, check that it delivers everything the user explicitly asked for, in the form they asked for it, and nothing they would have to strip out; include the result itself, or say plainly that it is unavailable, rather than "done", a pointer to an earlier message, or process notes. If you ran something for the user, send the actual result before you yield. ';
var TEXT_SHAPE = 'Use {"type":"text","content":"..."} for normal messages; use actual newline characters for paragraph or list breaks, not literal backslash-n text. ';
var VOICE_MEMO_FULL = `${VOICE_MEMO_SEND_GUIDANCE} Set voice_memo: true only on those spoken words (the answer). After that memo, later SendToUser calls stay ordinary text unless they ask for another memo. `;
var VOICE_MEMO_LEAN = "A requested voice memo is type:text with voice_memo: true on the spoken words themselves; the memo rules are on that field and in your instructions. ";
var REFERENCE_LINKS = `In text content you can point back at a specific earlier message with a reference link: [label](sand-msg:<address>), e.g. "Covered in [my earlier breakdown](sand-msg:t2s1)" \u2014 it renders as a small chip that jumps there on click. Addresses are the same ones reply_to uses (a user message's [t3u] tag, the id a sent message hands back), but unlike reply_to this never threads anything. Reference only where pointing back genuinely helps (an "as I mentioned earlier" moment); write the label as the words your sentence needs, and never write a bare address into visible text. `;
var GROUP_CHAT_DELIVERY = `During a local group-chat turn, SendToUser delivers to that room; pass "to":"dm" to instead deliver a text message privately to your own user's 1:1 chat (the room never sees it) \u2014 useful when someone in a room asks you to tell your user something, or when a result is for your user alone. `;
var ATTACHMENT_SHAPE = 'Use {"type":"attachment","url":"file:///absolute/path/to/file.png"} for actual files or standalone media; https:// file/media URLs are also accepted. ';
var ATTACHMENT_NOT_A_MEMO = "A requested voice memo is not an audio attachment; never attach .m4a or .mp3 for one. ";
var IMAGES_RULE = `The rule for images: if image(s) belong WITH what you're saying, attach them to the text message itself \u2014 {"type":"text","content":"...","images":[{"url":"file:///absolute/path/to/shot.png","alt":"..."}]} renders them inside the same chat bubble, below your text (one image full width, several as a compact gallery). Use {"type":"attachment"} only when the image IS the whole message, with no accompanying text; videos and non-image files always go as attachments. Never embed images as markdown ![](...) in content. `;
var CURSOR_AGENT_CARD = `Use {"type":"cursor-agent","bcId":"bc-..."} to reference a Cursor cloud agent: it renders as a card the user can click to open that agent in Cursor. Always use this instead of pasting a cloud agent's URL or bcId as text. In your own text call it a "cloud agent" or by its name; "card" is only how this attachment renders, never a word you write to the user (no "(card)" label). `;
var WIDGET_INTRO_FULL = 'Use {"type":"widget","widget":{...}} to ask the user a question with selectable options instead of asking in plain text \u2014 but ask rarely: by default decide and proceed (see Autonomy), reserving a widget for a consequential or destructive go/no-go, true ambiguity you cannot resolve by looking it up, or something only the user knows. Do not use a widget to confirm a tool that already opens its own review UI (an editor or an approval card); call that tool instead, because a widget ends the turn and blocks the UI. Every option must be a real, verified choice, never invented, guessed, or a plausible-looking placeholder; if you do not know the real options, look them up first (search the relevant connector, tool, or directory) rather than presenting fakes. ';
var WIDGET_INTRO_LEAN = `Use {"type":"widget","widget":{...}} to ask the user a question with selectable options; when a widget is warranted, and that its options must be real, verified choices, is covered in your instructions under ${LEAN_SEND_TO_USER_POLICY_HEADINGS.autonomy} and ${LEAN_SEND_TO_USER_POLICY_HEADINGS.askingForDecisions}. `;
var CREDENTIAL_REQUEST_HINT = "For a saved browser login, use ListCredentials first, then send type:credential-request for the matching item: it fills that login into the live matching page without exposing values to you, and you learn only whether it was filled. ";
var OS_CONSENT_DIALOGS = 'When a task needs access the operating system gates behind a consent dialog (reading a protected folder like Documents/Desktop/Downloads, screen recording, the microphone, the camera, ...), just attempt the action directly \u2014 the OS surfaces its own permission dialog naturally when it is required, and the user grants there. Do NOT announce it first, invent a permission card or click-path, or promise that "your system will ask" \u2014 attempt the action and let the real dialog appear. (For a manual desktop step only the user can do \u2014 a login, SSO, 2FA, captcha, or payment \u2014 use request_box_help instead.) ';
var WIDGET_FIELDS = 'The widget has a prompt, optional helpText, and 1-6 options; each option has a label, an optional value (the text sent back to you when confirmed; defaults to the label), an optional description, and an optional style ("default"|"primary"|"danger"). Set the optional allowCustom: true to also let the user type their own free-text answer instead of picking an option. Set the optional dismissOnMoveOn: true only for low-stakes questions that become moot if the user moves on; the widget then auto-dismisses once they send a newer message without answering. Leave it off (default) for real decisions you still need answered. ';
var WIDGET_ANSWER_FULL = `The user picks an option and its value comes back to you as their reply. In the chat, the resolved card keeps your question and shows their selection checked under it, so phrase the prompt as a natural conversational question (never a menu instruction like "Pick one of the following") and give every option a value that reads like a reply the user would actually send. The user can also dismiss the question without answering; you'll be told on your next turn \u2014 treat that as a decline and don't re-ask. `;
var WIDGET_ANSWER_LEAN = "The user picks an option and its value comes back to you as their reply; the resolved card keeps your question and shows their selection checked under it. A dismissal without an answer is reported to you on your next turn. ";
var WIDGET_EXAMPLE = 'Example: {"type":"widget","widget":{"prompt":"Deploy to production?","options":[{"label":"Deploy","value":"Yes, deploy now","style":"primary"},{"label":"Cancel","value":"No, hold off","style":"danger"}]}}. ';
var WIDGET_ENDS_TURN_FULL = "When you do genuinely need a decision or confirmation, this widget is how you ask, not plain text. Sending a widget ends your turn; make it your last action and stop, and the user's selection arrives as the next message. ";
var WIDGET_ENDS_TURN_LEAN = "Sending a widget ends your turn; the user's selection arrives as the next message. ";
function sendToUserDescription(deps, options2) {
  const updateCommunication = deps.updateCommunication?.() === true;
  const toolNotesInSystemPrompt = deps.toolNotesInSystemPrompt?.() === true;
  const toolNotes = toolNotesInSystemPrompt ? SEND_TO_USER_TOOL_NOTES_POINTER : secretRequestToolGuidance(deps.resolveSecretRequestTarget);
  const credentialRequest = deps.resolveCredentialBrowserTarget == null ? "" : CREDENTIAL_REQUEST_HINT;
  const inAppLinks = toolNotesInSystemPrompt ? "" : inAppLinksGuidance({
    chromeCookieImport: deps.chromeCookieImport?.() === true,
    boxEgressTunnel: deps.boxEgressTunnel?.() === true
  });
  let endTurnGuidance = "";
  if (deps.completeTurnAfterSend != null) {
    endTurnGuidance = inAppLinks.length === 0 ? SEND_TO_USER_END_TURN_GUIDANCE : ` ${SEND_TO_USER_END_TURN_GUIDANCE}`;
  }
  if (options2.lean) {
    return OPENING_LEAN + (updateCommunication ? UPDATE_COMMUNICATION_DELIVERY_CHECK : "") + TEXT_SHAPE + VOICE_MEMO_LEAN + REFERENCE_LINKS + GROUP_CHAT_DELIVERY + ATTACHMENT_SHAPE + IMAGES_RULE + CURSOR_AGENT_CARD + WIDGET_INTRO_LEAN + toolNotes + credentialRequest + OS_CONSENT_DIALOGS + WIDGET_FIELDS + WIDGET_ANSWER_LEAN + WIDGET_EXAMPLE + WIDGET_ENDS_TURN_LEAN + inAppLinks;
  }
  return OPENING_POLICY + (updateCommunication ? `. ${UPDATE_COMMUNICATION_DELIVERY_CHECK}` : ", and if you ran something for them you send the actual result before you yield. ") + TEXT_SHAPE + VOICE_MEMO_FULL + REFERENCE_LINKS + GROUP_CHAT_DELIVERY + ATTACHMENT_SHAPE + ATTACHMENT_NOT_A_MEMO + IMAGES_RULE + CURSOR_AGENT_CARD + WIDGET_INTRO_FULL + toolNotes + credentialRequest + OS_CONSENT_DIALOGS + WIDGET_FIELDS + WIDGET_ANSWER_FULL + WIDGET_EXAMPLE + WIDGET_ENDS_TURN_FULL + inAppLinks + endTurnGuidance;
}
function createSendMessageTool2(deps) {
  const parametersByTurnBehavior = deps.resolveCredentialBrowserTarget == null ? {
    continueTurn: sendMessageParameters,
    completeTurn: sendMessageEndTurnParameters
  } : {
    continueTurn: sendMessageParametersWithCredentialRequest,
    completeTurn: sendMessageEndTurnParametersWithCredentialRequest
  };
  const parameters2 = deps.completeTurnAfterSend == null ? parametersByTurnBehavior.continueTurn : parametersByTurnBehavior.completeTurn;
  let userSelectionSendStarted = false;
  return createZodAgentTool("SEND_MESSAGE", {
    name: SAND_SEND_TO_USER_TOOL_NAME,
    executionAliases: [SAND_LEGACY_SEND_MESSAGE_TOOL_NAME],
    descriptionGenerator: () => sendToUserDescription(deps, { lean: deps.leanDescription?.() === true }),
    parameters: parameters2,
    execute: withSafeParsedArgs(
      () => parameters2,
      async (ctx, interactionHandler, rawArgs, meta) => {
        const awaitsUserSelection = rawArgs.type === "widget" || rawArgs.type === "secret-request" || rawArgs.type === "credential-request";
        const message = await buildSandSendMessage(ctx, rawArgs, deps);
        const deliverTo = rawArgs.to;
        const args = encodeSendMessage(message);
        const baseToolCall = new SendMessageToolCall({ args });
        return await interactionHandler.executeToolCall(
          ctx,
          createSendMessageToolCall(baseToolCall),
          meta.toolCallId,
          async () => {
            if (userSelectionSendStarted || deps.isAwaitingUserSelection?.() === true) {
              return new SendMessageResult({
                result: {
                  case: "error",
                  value: new SendMessageError({
                    error: SAND_AWAITING_USER_SEND_MESSAGE_BLOCKED
                  })
                }
              });
            }
            if (awaitsUserSelection) userSelectionSendStarted = true;
            const blockReason = deps.getSendBlockReason?.(message, deliverTo);
            if (blockReason != null) {
              if (awaitsUserSelection) userSelectionSendStarted = false;
              return new SendMessageResult({
                result: {
                  case: "error",
                  value: new SendMessageError({ error: blockReason })
                }
              });
            }
            const isSuppressedCard = message.type === "cursor-agent" && deps.isSuppressedCursorAgentCard?.(message.bcId) === true;
            try {
              const timestampMs2 = Date.now();
              const sentMessageId = isSuppressedCard ? void 0 : deps.onSendMessage(message, timestampMs2, deliverTo);
              if ("end_turn" in rawArgs && rawArgs.end_turn === true) {
                deps.completeTurnAfterSend?.();
              }
              return new SendMessageResult({
                result: {
                  case: "success",
                  value: new SendMessageSuccess({
                    timestamp: BigInt(timestampMs2),
                    ...sentMessageId != null && sentMessageId.length > 0 ? { messageId: sentMessageId } : {}
                  })
                }
              });
            } catch (error42) {
              if (awaitsUserSelection) userSelectionSendStarted = false;
              throw error42;
            }
          },
          (result) => createSendMessageToolCall(new SendMessageToolCall({ ...baseToolCall, result }))
        );
      },
      createSendMessageToolCall(new SendMessageToolCall()),
      { emitInitialPartialToolCall: true }
    ),
    render: async (_ctx, output) => {
      if (output.result.case === "error") {
        const detail = output.result.value.error.trim();
        const message = detail.length > 0 ? `Failed to send the message to the user: ${detail}` : "Failed to send the message to the user.";
        return createStringResult(message, true);
      }
      const messageId = output.result.case === "success" ? output.result.value.messageId.trim() : "";
      return createStringResult(
        messageId.length > 0 ? `Message sent to user. (id: ${messageId})` : "Message sent to user."
      );
    },
    serializeError: (error42) => {
      const message = error42 instanceof Error ? error42.message : "Unknown error";
      return createSendMessageToolCall(
        new SendMessageToolCall({
          result: new SendMessageResult({
            result: {
              case: "error",
              value: new SendMessageError({ error: message })
            }
          })
        })
      );
    }
  });
}
