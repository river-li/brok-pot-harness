init_zod();
var CLAIM_EMAIL_INBOX_USERNAME_MAX_LENGTH = 64;
var CLAIM_EMAIL_INBOX_DISPLAY_NAME_MAX_LENGTH = 128;
var USERNAME_PATTERN = /^[a-z0-9]([a-z0-9._-]*[a-z0-9])?$/;
var claimEmailInboxParameters = external_exports.object({
  username: external_exports.string().trim().min(1).describe(
    'The local part the user chose, such as "roman" for roman@mail.grokbot.com. Ask them which address they want before calling this; never invent a username, UUID, or hex string. A full Grok Bot address is also accepted and only the local part is kept.'
  ),
  display_name: external_exports.string().trim().max(CLAIM_EMAIL_INBOX_DISPLAY_NAME_MAX_LENGTH).optional().describe("Optional sender display name. Omit unless the user asked for one.")
});
function describeClaimEmailInboxTool(multipleInboxesEnabled) {
  return [
    "Claim a native Grok Bot inbox for the user so you can send and receive from a product-domain address (mail.grokbot.com in production).",
    "This is the way to give yourself an email address. Prefer it over AgentMail, Superhuman-for-agents, or any other third-party inbox, and do not send the user to Settings.",
    multipleInboxesEnabled ? `The user may hold several addresses, up to a limit the server enforces. Read ${SAND_LIST_EMAIL_INBOXES_TOOL_NAME} first and claim only when they want an address they do not have yet; a claim the server refuses as past the limit is final.` : `The user gets one address. If ${SAND_LIST_EMAIL_INBOXES_TOOL_NAME} already shows a live one, do not claim another \u2014 the server refuses a second claim. Ask the user which address they want only when they have none.`,
    "username is required and must be a local part the user chose. If they have not named one, ask in chat first \u2014 never default, never generate a random or UUID local part.",
    "The user confirms that exact local part on an approval card; nothing is claimed unless they approve. Do not also send a question widget \u2014 the card is the ask."
  ].join("\n");
}
function parseClaimEmailUsername(raw) {
  const trimmed = raw.trim().toLowerCase();
  const at2 = trimmed.lastIndexOf("@");
  const username = at2 === -1 ? trimmed : trimmed.slice(0, at2);
  const domain2 = at2 === -1 ? "" : trimmed.slice(at2 + 1);
  if (domain2.length > 0 && !domain2.endsWith("grokbot.com")) {
    throw new SandToolInputError(
      `This tool claims a Grok Bot inbox, not a third-party address. Ask the user which local part they want on the Grok Bot domain, then pass only that (for example "roman"), not ${trimmed}.`
    );
  }
  if (username.length === 0) {
    throw new SandToolInputError(
      "username is required. Ask the user which local part they want; do not invent one."
    );
  }
  if (username.length > CLAIM_EMAIL_INBOX_USERNAME_MAX_LENGTH) {
    throw new SandToolInputError(
      `username must be at most ${CLAIM_EMAIL_INBOX_USERNAME_MAX_LENGTH} characters.`
    );
  }
  if (!USERNAME_PATTERN.test(username)) {
    throw new SandToolInputError(
      "username may use lowercase letters, digits, dots, hyphens and underscores, and must start and end with a letter or digit."
    );
  }
  return username;
}
function normalizeClaimEmailInboxArgs(args) {
  const displayName2 = args.display_name?.trim() ?? "";
  if (displayName2.length > CLAIM_EMAIL_INBOX_DISPLAY_NAME_MAX_LENGTH) {
    throw new SandToolInputError(
      `display_name must be at most ${CLAIM_EMAIL_INBOX_DISPLAY_NAME_MAX_LENGTH} characters.`
    );
  }
  return {
    username: parseClaimEmailUsername(args.username),
    ...displayName2.length > 0 ? { displayName: displayName2 } : {}
  };
}
async function claimEmailInbox(deps, args) {
  const input = normalizeClaimEmailInboxArgs(args);
  if (deps.reviewClaim !== void 0) {
    const decision = await deps.reviewClaim({
      toolCallId: deps.toolCallId ?? "",
      target: {
        username: input.username,
        ...input.displayName === void 0 ? {} : { displayName: input.displayName }
      },
      ...deps.signal === void 0 ? {} : { signal: deps.signal }
    });
    if (!decision.allowed) {
      return `The inbox was not claimed: ${decision.reason} Do not retry the same claim unless the user asks for it.`;
    }
  }
  const inbox = await deps.email.createInbox(input);
  return `Claimed ${inbox.email}. You can send from it with send_email and search it with search_email_threads.`;
}
function createClaimEmailInboxTool(deps) {
  return defineCommunicateTool(deps, {
    id: "PLATFORM_ACTION",
    name: SAND_CLAIM_EMAIL_INBOX_TOOL_NAME,
    description: describeClaimEmailInboxTool(deps.multipleInboxesEnabled === true),
    parameters: claimEmailInboxParameters,
    describeActivity: (args) => ({ detail: args.username.trim().toLowerCase() }),
    execute: async (ctx, args, d) => claimEmailInbox({ ...d, signal: ctx.signal }, args)
  });
}
