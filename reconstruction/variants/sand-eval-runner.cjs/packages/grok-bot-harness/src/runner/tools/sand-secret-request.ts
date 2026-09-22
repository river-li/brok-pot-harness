/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/tools/sand-secret-request.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var SECRET_REQUEST_MAX_LABEL_LENGTH = 120;
var SECRET_REQUEST_MAX_DESCRIPTION_LENGTH = 400;
function clampSecretLabel(label) {
  return clampLine(label, SECRET_REQUEST_MAX_LABEL_LENGTH);
}
function clampSecretDescription(description9) {
  return clampBlock(description9, SECRET_REQUEST_MAX_DESCRIPTION_LENGTH);
}
function summarizeSecretRequest(request3) {
  return `Requested a secret from the user securely: ${request3.label}`;
}
var SECRET_REQUEST_OWNER_APP_DM_ONLY = "A secret for this bot can only be requested in the owner's Grok Bot app DM. Reply in ordinary text that the owner should continue there. Do not ask anyone to paste a token, key, or password. Do not send secret-request again from this turn.";
var SECRET_REQUEST_PLUGIN_ID_TEAM_BOT_ONLY = "plugin_id only applies to a shared team bot's plugins. On this bot, request the secret without plugin_id: it is saved as an environment variable on the user's box.";
var PERSONAL_SECRET_REQUEST_GUIDANCE = 'Use {"type":"secret-request","secret":{"label":"...","name":"CURSOR_API_KEY"}} to ask for a credential (an API token, key, or secret): the user gets a masked secure input and the value becomes an environment variable in new box processes. NEVER ask the user to paste a token, key, or password into the chat; always request it this way so it stays out of the transcript and out of your context. You only learn that they provided it. Sending a secret-request ends your turn; you are resumed once they submit. ';
var BOT_SECRET_REQUEST_GUIDANCE = 'Use {"type":"secret-request","secret":{"label":"...","name":"CRM_API_TOKEN"}} to ask the owner for a credential for this bot. The owner gets a masked secure input and the value is saved on this bot, then available as process.env.NAME. This is only available in the owner\'s Grok Bot app DM. NEVER ask anyone to paste a token, key, or password into the chat. You only learn that they provided it. Sending a secret-request ends your turn; you are resumed once they submit. For a secret `${VAR}` setup field of a plugin on this bot (GetPlugin lists the field as secret), add "plugin_id" (the plugin\'s id) and pass the field key as "name": the value is saved as that plugin\'s team variable on the bot, never as a bot secret, and its connectors read it on your next turn. One secret-request per secret key, after the plugin is on the bot. ';
var SECRET_REQUEST_PROBE_NAME = "API_TOKEN";
function secretRequestToolGuidance(resolve14) {
  if (resolve14 == null) return PERSONAL_SECRET_REQUEST_GUIDANCE;
  try {
    const target = resolve14(SECRET_REQUEST_PROBE_NAME);
    if (target.kind === "bot-secret") return BOT_SECRET_REQUEST_GUIDANCE;
  } catch (error3) {
    if (error3 instanceof SandToolInputError) return `${error3.message} `;
    throw error3;
  }
  return `${SECRET_REQUEST_OWNER_APP_DM_ONLY} `;
}
function refuseNestedSecretRequest(_name) {
  throw new SandToolInputError(SECRET_REQUEST_OWNER_APP_DM_ONLY);
}
function resolveSendMessageSecretTarget(secret, resolve14) {
  const { name: name17, pluginId } = secret;
  if (resolve14 == null) {
    if (pluginId !== void 0) {
      throw new SandToolInputError(SECRET_REQUEST_PLUGIN_ID_TEAM_BOT_ONLY);
    }
    return boxEnvSecretTarget(name17);
  }
  return pluginId === void 0 ? resolve14(name17) : resolve14(name17, { pluginId });
}

