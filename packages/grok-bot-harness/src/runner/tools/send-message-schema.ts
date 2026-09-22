/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/tools/send-message-schema.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_zod();
var SEND_MESSAGE_TYPES = [
  "text",
  "attachment",
  "widget",
  "cursor-agent",
  "secret-request"
];
var SEND_MESSAGE_TYPES_WITH_CREDENTIAL_REQUEST = [
  ...SEND_MESSAGE_TYPES,
  "credential-request"
];
var SEND_MESSAGE_TYPE_DESCRIPTION = "text for chat messages, attachment for actual files or standalone media, widget for an interactive question with selectable options, cursor-agent to reference a Cursor cloud agent by its bcId (renders as a card that opens the agent in Cursor on click), secret-request to ask the user for a credential through a secure masked input (never a chat paste).";
var SEND_MESSAGE_TYPE_DESCRIPTION_WITH_CREDENTIAL_REQUEST = `${SEND_MESSAGE_TYPE_DESCRIPTION.slice(0, -1)}, credential-request to fill a 1Password login into the sign-in page open in the box browser.`;
var SEND_MESSAGE_DM_DESTINATION = "dm";
var SEND_MESSAGE_DM_DESCRIPTION = `Optional, only meaningful during a local group-chat turn. Pass "dm" to deliver this message privately to YOUR OWN user's 1:1 chat instead of the room; the room never sees it. Only valid with type:text. Outside a group-chat turn it is ignored because your user is already the audience.`;
var SEND_MESSAGE_DM_TEXT_ONLY_ERROR = 'to:"dm" can only be set for type:text';
var SEND_MESSAGE_DM_CHANNEL_CONFLICT_ERROR = 'to:"dm" and channel are mutually exclusive; pick one destination';
var VOICE_MEMO_SEND_GUIDANCE = "A voice memo (whatever they call it: voice note, voice message, audio note) is type:text with voice_memo: true. Write the words to speak in content \u2014 complete spoken sentences, no numbered lists, headers, or markdown. A requested list is spoken as first / next / last, not digits. Start with the thing they asked to hear; never \u201Chit play.\u201D The client plays those words as a pellet. When they asked to receive a memo, send only that one message: no status ack, no ordinary-text copy of the answer, and no audio file (.m4a, .mp3). Silence until then is correct.";
var REQUESTED_VOICE_MEMO_SILENCE_CLAUSE = "If they asked to hear the answer spoken, do not send an acknowledgement or status update \u2014 keep working in silence until the spoken answer is ready, then that first SendToUser is the memo.";
var VOICE_MEMO_FIELD_DESCRIPTION = `${VOICE_MEMO_SEND_GUIDANCE} Optional, only for type:text with no images or channel. Set it only on that spoken answer. Later SendToUser calls stay ordinary text unless they ask for another memo.`;
var AUDIO_ATTACHMENT_VOICE_MEMO_ERROR = "Audio files are not voice memos. If the user asked to hear the answer spoken, send type:text with voice_memo: true and the words to speak in content. Do not attach an audio file.";
var AUDIO_ATTACHMENT_PATH_PATTERN = /\.(?:m4a|mp3|wav|aac|ogg|opus|flac|wma)(?:$|[?#])/i;
function attachmentUrlLooksLikeAudio(url2) {
  return AUDIO_ATTACHMENT_PATH_PATTERN.test(url2);
}
var sendMessageObjectSchemaWithCredentialRequest = external_exports.object({
  type: external_exports.enum(SEND_MESSAGE_TYPES_WITH_CREDENTIAL_REQUEST).describe(SEND_MESSAGE_TYPE_DESCRIPTION_WITH_CREDENTIAL_REQUEST),
  content: external_exports.string().trim().optional().describe(
    "Required when type is text. The message to show to the user. Use actual newline characters for paragraph or list breaks, not literal backslash-n text. Only valid with type:text."
  ),
  url: external_exports.string().trim().optional().describe(
    "Required when type is attachment. Use file:// for local files or https:// for remote files and standalone media. Do not attach an audio file for a requested voice memo."
  ),
  images: external_exports.array(
    external_exports.object({
      url: external_exports.string().trim().min(1).describe("file:// or https:// URL of the image."),
      alt: external_exports.string().trim().optional().describe(
        "Optional short description of this image, shown on hover and as its fullscreen caption."
      )
    })
  ).optional().describe(
    "Optional, only for type:text. Image(s) that belong with this message; they render inside the same chat bubble, below your text \u2014 one image full width, several as a compact gallery. Use whenever you're showing something you're talking about; use type:attachment only for an image that IS the whole message."
  ),
  alt: external_exports.string().trim().optional().describe(
    "Optional. A short description (alt text) of the image for type:attachment \u2014 what the image shows. Shown to the user on hover and in the fullscreen viewer."
  ),
  reply_to: external_exports.string().trim().optional().describe(
    "Optional. Address of a prior message to reply under (for example, t3u or t3s1). If the current user message was sent through Reply, omit this to reply under the same message automatically. Otherwise, omitting it posts normally in the main chat. Set it only to choose a different prior message."
  ),
  channel: external_exports.string().trim().optional().describe(
    "Optional. A connected messaging channel address to deliver this to instead of the in-app Grok Bot chat, shaped platform:chat, the address shown to you in an [inbound] wake. On Slack a channel thread is slack:<channel id>:<thread ts>, a person is slack:<user id>, and a bare slack:<channel id> starts a new top-level post in a channel the bot has been added to (only when asked for one; answer messages in their thread). Omit to send to the in-app chat (the default). Only valid with type:text or type:attachment."
  ),
  to: external_exports.enum([SEND_MESSAGE_DM_DESTINATION]).optional().describe(SEND_MESSAGE_DM_DESCRIPTION),
  voice_memo: external_exports.boolean().optional().describe(VOICE_MEMO_FIELD_DESCRIPTION),
  widget: sandWidgetSchema.optional().describe(
    "Required when type is widget. A question with selectable options: { prompt, helpText?, options: [{ label, value?, description?, style? }], multiSelect?, allowCustom?, dismissOnMoveOn? }. The user picks one option; its value comes back as their reply, and the chat shows the resolved card with their selection checked under your prompt \u2014 so phrase the prompt as a natural question, not a menu instruction. Set multiSelect: true when several options may apply. The user toggles any subset and submits once, and the picked values return together in one reply, one per line. The user can also dismiss the question without answering; you'll be told on your next turn, so treat that as a decline and don't re-ask. Set allowCustom: true to also let the user type their own free-text answer instead of picking an option. Set dismissOnMoveOn: true only for low-stakes questions that become moot if the user moves on (it auto-dismisses once they send a newer message without answering); leave it off for real decisions you still need answered. Only valid with type:widget."
  ),
  bcId: external_exports.string().trim().optional().describe(
    "Required when type is cursor-agent. The bcId of the Cursor cloud agent to reference (e.g. bc-xxxxxxxx-...)."
  ),
  secret: external_exports.object({
    label: external_exports.string().trim().min(1).describe(
      'What credential to ask for, shown as the card title and echoed in the field placeholder ("Paste your \u2026"), e.g. "Slack bot token".'
    ),
    description: external_exports.string().trim().optional().describe("Optional short help shown under the label."),
    name: external_exports.string().trim().min(1).max(128).describe(
      'The environment variable name new box processes will read, e.g. "CURSOR_API_KEY". With plugin_id, the plugin\'s `${VAR}` setup field key instead, exactly as GetPlugin lists it.'
    ),
    plugin_id: external_exports.string().trim().regex(/^[1-9]\d*$/).optional().describe(
      "Only on a shared team bot, and only for a secret `${VAR}` setup field of a plugin already on the bot: the plugin's STABLE id (from SearchPlugins / GetPlugin). The value is saved as that plugin's team variable `name` on the bot, never as a bot secret or a box environment variable."
    )
  }).superRefine((secret, ctx) => {
    if (secret.plugin_id !== void 0) {
      if (/\s/.test(secret.name)) {
        ctx.addIssue({
          code: external_exports.ZodIssueCode.custom,
          path: ["name"],
          message: "Must be the plugin's setup field key, exactly as GetPlugin lists it."
        });
      }
      return;
    }
    if (validateBoxSecretKey(secret.name) != null) {
      ctx.addIssue({
        code: external_exports.ZodIssueCode.custom,
        path: ["name"],
        message: "Must be an allowed environment variable name."
      });
    }
  }).optional().describe(
    "Required when type is secret-request. Asks for a credential through a masked secure input. The value never reaches you or the chat. You only learn that it was provided. Where it is saved, and whether this turn may ask, is in the tool description. Do not ask anyone to paste a token, key, or password."
  ),
  credential: external_exports.object({
    kind: external_exports.literal("browser-login"),
    credential_id: external_exports.string().trim().min(1),
    connection_id: external_exports.string().trim().min(1),
    catalog_revision: external_exports.string().trim().min(1),
    site: external_exports.string().trim().min(1).describe(
      "The current browser URL or domain reported by computerUse. This is a target hint, not a saved item URL."
    ),
    purpose: external_exports.string().trim().min(1).describe(
      "One honest sentence describing the immediate use, shown to the user beside the fill."
    )
  }).strict().optional().describe(
    "Required when type is credential-request. Fills the named 1Password login into the matching live browser page; values never reach you, and you learn only whether it was filled."
  )
});
var sendMessageObjectSchema = sendMessageObjectSchemaWithCredentialRequest.omit({ credential: true }).extend({
  type: external_exports.enum(SEND_MESSAGE_TYPES).describe(SEND_MESSAGE_TYPE_DESCRIPTION)
});
var TYPE_SCOPED_SEND_MESSAGE_FIELDS = [
  { field: "content", types: ["text"] },
  { field: "url", types: ["attachment"] },
  { field: "alt", types: ["attachment"] },
  { field: "widget", types: ["widget"] },
  { field: "bcId", types: ["cursor-agent"] },
  { field: "secret", types: ["secret-request"] },
  { field: "credential", types: ["credential-request"] }
];
function isFieldProvided(value) {
  if (value == null) return false;
  if (typeof value === "string") return value.length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}
function refineSendMessage(value, ctx) {
  for (const { field, types: types3 } of TYPE_SCOPED_SEND_MESSAGE_FIELDS) {
    if (types3.includes(value.type)) continue;
    if (!isFieldProvided(value[field])) continue;
    const allowed = types3.map((type2) => `type:${type2}`).join(" or ");
    ctx.addIssue({
      code: external_exports.ZodIssueCode.custom,
      path: [field],
      message: `${field} is only valid with ${allowed} and cannot ride a type:${value.type} message \u2014 it would be silently dropped. Nothing was sent. Re-send as separate SendToUser calls, one per type: this field on its own properly-typed message (${allowed}), and any text as its own type:text message.`
    });
  }
  if (value.channel != null && value.channel.length > 0 && value.type !== "text" && value.type !== "attachment") {
    ctx.addIssue({
      code: external_exports.ZodIssueCode.custom,
      path: ["channel"],
      message: "channel can only be set for type:text or type:attachment, not widgets or cursor-agent cards"
    });
  }
  if (value.to != null && value.type !== "text") {
    ctx.addIssue({
      code: external_exports.ZodIssueCode.custom,
      path: ["to"],
      message: SEND_MESSAGE_DM_TEXT_ONLY_ERROR
    });
  }
  if (value.to != null && value.channel != null && value.channel.length > 0) {
    ctx.addIssue({
      code: external_exports.ZodIssueCode.custom,
      path: ["to"],
      message: SEND_MESSAGE_DM_CHANNEL_CONFLICT_ERROR
    });
  }
  if (value.images != null && value.images.length > 0 && value.type !== "text") {
    ctx.addIssue({
      code: external_exports.ZodIssueCode.custom,
      path: ["images"],
      message: "images can only be set for type:text (they attach to a text message); for a standalone attachment use type:attachment with url"
    });
  }
  if (value.voice_memo === true && value.type !== "text") {
    ctx.addIssue({
      code: external_exports.ZodIssueCode.custom,
      path: ["voice_memo"],
      message: "voice_memo can only be set for type:text"
    });
  }
  if (value.voice_memo === true && value.images != null && value.images.length > 0) {
    ctx.addIssue({
      code: external_exports.ZodIssueCode.custom,
      path: ["voice_memo"],
      message: "voice_memo cannot ride a text message that also has images"
    });
  }
  if (value.voice_memo === true && value.channel != null && value.channel.length > 0) {
    ctx.addIssue({
      code: external_exports.ZodIssueCode.custom,
      path: ["voice_memo"],
      message: "voice_memo is only for the in-app chat; it cannot be set with channel"
    });
  }
  switch (value.type) {
    case "text": {
      if (!value.content) {
        ctx.addIssue({
          code: external_exports.ZodIssueCode.custom,
          path: ["content"],
          message: "content is required when type is text"
        });
      }
      for (const [index, image2] of (value.images ?? []).entries()) {
        if (!isValidAttachmentUrl(image2.url)) {
          ctx.addIssue({
            code: external_exports.ZodIssueCode.custom,
            path: ["images", index, "url"],
            message: "each images url must include a file:// or https:// scheme"
          });
        }
      }
      return;
    }
    case "widget": {
      if (value.widget == null) {
        ctx.addIssue({
          code: external_exports.ZodIssueCode.custom,
          path: ["widget"],
          message: "widget is required when type is widget"
        });
      }
      return;
    }
    case "cursor-agent": {
      if (!value.bcId) {
        ctx.addIssue({
          code: external_exports.ZodIssueCode.custom,
          path: ["bcId"],
          message: "bcId is required when type is cursor-agent"
        });
      }
      return;
    }
    case "secret-request": {
      if (value.secret == null) {
        ctx.addIssue({
          code: external_exports.ZodIssueCode.custom,
          path: ["secret"],
          message: "secret is required when type is secret-request"
        });
      }
      return;
    }
    case "credential-request": {
      if (value.credential == null) {
        ctx.addIssue({
          code: external_exports.ZodIssueCode.custom,
          path: ["credential"],
          message: "credential is required when type is credential-request"
        });
      }
      return;
    }
    case "attachment": {
      const attachmentUrl = value.url;
      if (!attachmentUrl) {
        ctx.addIssue({
          code: external_exports.ZodIssueCode.custom,
          path: ["url"],
          message: "url is required when type is attachment"
        });
        return;
      }
      if (!isValidAttachmentUrl(attachmentUrl)) {
        ctx.addIssue({
          code: external_exports.ZodIssueCode.custom,
          path: ["url"],
          message: "url must include a file:// or https:// scheme when type is attachment"
        });
      }
      if (attachmentUrlLooksLikeAudio(attachmentUrl)) {
        ctx.addIssue({
          code: external_exports.ZodIssueCode.custom,
          path: ["url"],
          message: AUDIO_ATTACHMENT_VOICE_MEMO_ERROR
        });
      }
      return;
    }
    default: {
      const _exhaustive = value.type;
      return _exhaustive;
    }
  }
}
var sendMessageParameters = sendMessageObjectSchema.superRefine(refineSendMessage);
var sendMessageParametersWithCredentialRequest = sendMessageObjectSchemaWithCredentialRequest.superRefine(refineSendMessage);
var SEND_TO_USER_END_TURN_GUIDANCE = "Set end_turn to true on your final SendToUser call when your reply is complete. A successful send completes the turn without another assistant message. Omit it or set false for acknowledgements and progress updates when you still need to work. Send all required results and attachments before the final call. Do not parallelize the final call with work you still need. You can end your turn while subagents are working as long as you are done for now.";
var sendMessageEndTurnParameters = sendMessageObjectSchema.extend({
  end_turn: external_exports.boolean().optional().describe(SEND_TO_USER_END_TURN_GUIDANCE)
}).superRefine(refineSendMessage);
var sendMessageEndTurnParametersWithCredentialRequest = sendMessageObjectSchemaWithCredentialRequest.extend({
  end_turn: external_exports.boolean().optional().describe(SEND_TO_USER_END_TURN_GUIDANCE)
}).superRefine(refineSendMessage);

