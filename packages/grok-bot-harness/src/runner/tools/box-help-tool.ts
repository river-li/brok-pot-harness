init_zod();
var requestBoxHelpParameters = external_exports.object({
  instruction: external_exports.string().trim().min(1).describe(
    'A short instruction shown over the box and in chat, addressed to the user (e.g. "Sign in to your Google account", "Approve the 2FA prompt"). Keep it to one line; no explanatory paragraph.'
  ),
  reason: external_exports.enum(["auth", "captcha", "payment", "other"]).optional().catch(void 0).describe(
    'Why the user is needed: "auth" for any sign-in step (login, SSO, passkey, 2FA), "captcha" for a puzzle or image captcha (a press-and-hold button is a mouse hold the subagent does itself), "payment", or "other".'
  ),
  domain: external_exports.string().trim().optional().catch(void 0).describe(
    'Destination app/site the user is trying to access (e.g. "salesforce.com", "google.com"). On a normal login page this is the browser-bar host. On an SSO/IdP page (Okta, Google accounts, Azure AD, \u2026) this is the *destination* app that started SSO, NOT the IdP host (put that in idp_domain). Omit when unknown or the step is not on a website.'
  ),
  idp_domain: external_exports.string().trim().optional().catch(void 0).describe(
    'When the browser is on an SSO/IdP page, the IdP host from the URL bar (e.g. "anysphere.okta.com", "accounts.google.com", "login.microsoftonline.com"). Omit on a direct app login with no separate IdP.'
  )
});
function normalizeBoxHelpDomain(raw) {
  const value = raw.trim().toLowerCase();
  if (value.length === 0) return void 0;
  try {
    const hostname2 = new URL(value.includes("://") ? value : `https://${value}`).hostname;
    const host = hostname2.replace(/^www\./, "");
    return host.length > 0 ? host : void 0;
  } catch {
    return void 0;
  }
}
function connectorCardEmissionToMessage(emission) {
  return {
    type: "connector",
    connector: emission.connector,
    serverId: emission.serverId,
    variant: emission.variant
  };
}
function createRequestBoxHelpTool(deps) {
  let pendingHandoff = Promise.resolve();
  return defineCommunicateTool(deps, {
    id: "REQUEST_BOX_HELP",
    name: "request_box_help",
    description: "Hand your box's desktop to the user for a step only they can do: a login, SSO, passkey, 2FA, a puzzle or image captcha, or payment confirmation. " + (deps.credentialFillEnabled === true ? "Not for a verification-code page when the login just filled carries a one-time code in 1Password: that code is filled for the subagent, so hand off only if the page is still asking after about a minute. " : "") + 'Pass one short instruction (no paragraph); the box is surfaced with a "hand back to agent" button and that instruction is shown in chat, then your turn ends. The user does the step on the box and hands it back, and you are resumed automatically, so start by using the read-only Screenshot tool to see what they changed. Use this instead of asking for credentials: the user signs in themselves on the box and you never see their password or 2FA. For classification: domain is the destination app being accessed; when the browser has redirected to an SSO/IdP page (Okta, Google accounts, \u2026), still put the destination app in domain and put the IdP host in idp_domain.',
    parameters: requestBoxHelpParameters,
    execute: async (ctx, args, d) => {
      ctx.signal.throwIfAborted();
      const agentId = d.getAgentId();
      invariant(agentId != null, "request_box_help was called outside an agent run.");
      const handoff = pendingHandoff.then(async () => {
        ctx.signal.throwIfAborted();
        const domain = args.domain != null ? normalizeBoxHelpDomain(args.domain) : void 0;
        const idpDomain = args.idp_domain != null ? normalizeBoxHelpDomain(args.idp_domain) : void 0;
        const turnId = d.getTurnId();
        const subagentAgentId = d.getRevivingSubagentAgentId();
        const outcome = await d.requestHelp({
          agentId,
          instruction: args.instruction,
          telemetry: {
            ...args.reason != null ? { reason: args.reason } : {},
            ...domain != null ? { domain } : {},
            ...idpDomain != null ? { idpDomain } : {},
            ...turnId != null && turnId.length > 0 ? { turnId } : {},
            ...subagentAgentId != null ? { subagentAgentId } : {}
          }
        });
        if (!ctx.canceled) d.endTurn({ toolCallId: d.toolCallId });
        if (outcome.kind === "started") {
          d.onSendMessage({ type: "text", content: args.instruction }, Date.now(), {
            requestId: outcome.requestId,
            instruction: args.instruction
          });
        }
        ctx.signal.throwIfAborted();
        if (outcome.kind === "already-pending") {
          return `The user still has the box. You handed it to them for "${outcome.instruction}" and they haven't handed it back, so this request was NOT sent. Asking twice would put a second copy of the same request in their chat. Do not ask again. If you have something to tell them (what you're waiting on, or that you need a different step), say it with SendToUser; otherwise just wait, and you'll be resumed automatically when they hand the box back.`;
        }
        return "Handed the box to the user. They have control now; wait for them to hand it back, and you'll be resumed automatically.";
      });
      pendingHandoff = handoff.then(
        () => void 0,
        () => void 0
      );
      return handoff;
    }
  });
}
