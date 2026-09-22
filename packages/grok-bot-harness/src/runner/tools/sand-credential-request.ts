/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/tools/sand-credential-request.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_zod();
var CREDENTIAL_REQUEST_MAX_PURPOSE_LENGTH = 300;
function clampCredentialPurpose(purpose) {
  return clampLine(purpose, CREDENTIAL_REQUEST_MAX_PURPOSE_LENGTH);
}
var credentialRequestCommonSchema = external_exports.object({
  kind: external_exports.literal("browser-login"),
  envName: external_exports.undefined().optional(),
  purpose: external_exports.string().trim().min(1),
  targetSite: external_exports.string().trim().min(1)
});
var credentialRequestSchema = credentialRequestCommonSchema.extend({
  credentialId: external_exports.string().trim().min(1),
  connectionId: external_exports.string().trim().min(1),
  catalogRevision: external_exports.string().trim().min(1),
  targetWebSocketDebuggerUrl: external_exports.string().trim().min(1).optional(),
  autoFill: external_exports.boolean().optional(),
  requestedAtMs: external_exports.number().finite(),
  expiresAtMs: external_exports.number().finite()
}).passthrough();
function summarizeCredentialRequest(request5) {
  return `Asked to fill the 1Password login ${request5.credentialId} into the sign-in page open at ${request5.targetSite}: ${request5.purpose}`;
}
function buildCredentialResolvedAck(args) {
  const { request: request5, resolution, detail } = args;
  switch (resolution) {
    case "approved":
      return [
        `[1Password filled the login into the sign-in page at ${request5.targetSite}; no credential value entered this conversation.]`,
        ...detail != null && detail.length > 0 ? [detail] : [],
        "Continue with a computerUse subagent to inspect the form and follow the user's current instruction, but never inspect or report credential input values through screenshots, accessibility, DOM, CDP, or shell tools. Submit only when the user explicitly asked for the action that requires submission; if they said not to submit, leave the masked fields filled and stop. When the site then asks for a one-time code and the login carries one (ListCredentials marks it one-time code in 1Password), that code is filled for you as the challenge appears: wait for it rather than asking the user for a code. On a username-first form the password step is filled for you as it appears on the same page: wait for it and do not send the credential-request again unless the note above asks you to, or the password field is still empty about ten seconds after the password step appears; then send the same credential-request again for the password step rather than asking the user for the password. Use request_box_help only for SSO, passkey, a code the login does not carry, captcha, payment, or when the note above says to."
      ].join("\n");
    case "denied":
      return `[The user declined to fill the 1Password login ${request5.credentialId}. Do not send that credential-request again right away; continue without it or ask the user how they'd like to proceed.]`;
    case "failed":
      return `[The 1Password login fill failed${detail != null && detail.length > 0 ? `: ${detail}` : ""}. Follow that guidance and inspect the live page before sending the credential-request again. Saved URL paths and queries are never matching constraints.]`;
  }
}

