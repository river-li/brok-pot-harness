/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/tools/draft-external-message-schema.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_zod();
var DRAFT_PLATFORMS = ["email", "slack"];
var draftExternalMessageObjectSchema = external_exports.object({
  platform: external_exports.enum(DRAFT_PLATFORMS).describe(
    "Which platform this draft is for. email requires providerIdentifier, from, to, subject, and body (plus replyToMessageId when replying within an existing email thread). slack requires providerIdentifier, target, channelId, and body (plus threadTs when replying in a thread)."
  ),
  providerIdentifier: external_exports.string().trim().min(1).describe(
    "The installed MCP server identifier that will carry the send, exactly as GetMcpServerStatus lists it for the account you mean. This picks both the connector and the account, and the user cannot change it on the card, so resolve it first."
  ),
  body: external_exports.string().trim().min(1).describe("The message body, written in the user's voice. Required for both platforms."),
  from: external_exports.string().trim().optional().describe(
    `Required when platform is email. The exact email address the chosen account sends from, shown on the card's From row \u2014 a plain address like ariel@acme.com, never a display name and never guessed. If you don't already know it, read it from the mailbox first: call the Gmail connector's search_threads with query "in:sent" and use a returned message's sender field.`
  ),
  to: external_exports.array(external_exports.string().trim().min(1)).optional().describe(
    'Required when platform is email. The recipient(s), each a plain email address ("user@example.com" \u2014 the "Name <user@example.com>" form is not accepted).'
  ),
  cc: external_exports.array(external_exports.string().trim().min(1)).optional().describe("Optional, email only. Cc recipient(s), each a plain email address."),
  subject: external_exports.string().trim().optional().describe("Required when platform is email. The subject line."),
  replyToMessageId: external_exports.string().trim().optional().describe(
    "Optional, email only. The provider's id of the message being replied to; this is the ONLY reply key the send uses, so set it whenever the draft replies within an existing thread and omit it for a fresh email."
  ),
  target: external_exports.string().trim().optional().describe(
    'Required when platform is slack. Where the message goes, as the user reads it: a channel ("#general") or a person ("Ariel Chen").'
  ),
  channelId: external_exports.string().trim().optional().describe(
    "Required when platform is slack. The channel or DM conversation id the send is addressed to (e.g. C0123456789), resolved with the connector's search tools \u2014 never guessed."
  ),
  threadTs: external_exports.string().trim().optional().describe(
    "Optional, slack only. The parent message's ts when this draft replies in a thread; omit for a new message."
  )
});
var PLATFORM_SCOPED_DRAFT_FIELDS = [
  { field: "from", platform: "email" },
  { field: "to", platform: "email" },
  { field: "cc", platform: "email" },
  { field: "subject", platform: "email" },
  { field: "replyToMessageId", platform: "email" },
  { field: "target", platform: "slack" },
  { field: "channelId", platform: "slack" },
  { field: "threadTs", platform: "slack" }
];
function isFieldProvided2(value) {
  if (value == null) return false;
  if (typeof value === "string") return value.length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}
function requireField(ctx, field, platform) {
  ctx.addIssue({
    code: external_exports.ZodIssueCode.custom,
    path: [field],
    message: `${field} is required when platform is ${platform}`
  });
}
function isPlainEmailAddress(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
function requireAddresses(ctx, field, values) {
  const invalid = values.filter((value) => !isPlainEmailAddress(value));
  if (invalid.length === 0) return;
  ctx.addIssue({
    code: external_exports.ZodIssueCode.custom,
    path: [field],
    message: `${field} must carry plain email address(es) like user@example.com \u2014 not a display name or "Name <addr>" form. Got: ${invalid.join(", ")}`
  });
}
function refineDraftExternalMessage(value, ctx) {
  for (const { field, platform } of PLATFORM_SCOPED_DRAFT_FIELDS) {
    if (platform === value.platform) continue;
    if (!isFieldProvided2(value[field])) continue;
    ctx.addIssue({
      code: external_exports.ZodIssueCode.custom,
      path: [field],
      message: `${field} is only valid with platform:${platform} and cannot ride a platform:${value.platform} draft \u2014 it would be silently dropped. Nothing was drafted. Re-send with only the fields that belong to platform:${value.platform}.`
    });
  }
  if (value.platform === "email") {
    if (!value.from) requireField(ctx, "from", "email");
    else requireAddresses(ctx, "from", [value.from]);
    if (value.to == null || value.to.length === 0) {
      requireField(ctx, "to", "email");
    } else {
      requireAddresses(ctx, "to", value.to);
    }
    if (value.cc != null) requireAddresses(ctx, "cc", value.cc);
    if (!value.subject) requireField(ctx, "subject", "email");
    return;
  }
  if (!value.target) requireField(ctx, "target", "slack");
  if (!value.channelId) requireField(ctx, "channelId", "slack");
}
var draftExternalMessageParameters = draftExternalMessageObjectSchema.superRefine(
  refineDraftExternalMessage
);

