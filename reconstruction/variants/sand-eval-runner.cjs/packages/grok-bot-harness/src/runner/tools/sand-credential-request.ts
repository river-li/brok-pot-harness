/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/tools/sand-credential-request.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_zod();

// @recovered-fragment 2/2
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
function summarizeCredentialRequest(request3) {
  return `Asked to fill the 1Password login ${request3.credentialId} into the sign-in page open at ${request3.targetSite}: ${request3.purpose}`;
}

