var SECRET_REQUEST_MAX_LABEL_LENGTH = 120;
var SECRET_REQUEST_MAX_DESCRIPTION_LENGTH = 400;
function clampSecretLabel(label) {
  return clampLine(label, SECRET_REQUEST_MAX_LABEL_LENGTH);
}
function clampSecretDescription(description9) {
  return clampBlock(description9, SECRET_REQUEST_MAX_DESCRIPTION_LENGTH);
}
function summarizeSecretRequest(request5) {
  return `Requested a secret from the user securely: ${request5.label}`;
}
var SECRET_REQUEST_OWNER_APP_DM_ONLY = "A secret for this bot can only be requested in the owner's Grok Bot app DM. Reply in ordinary text that the owner should continue there. Do not ask anyone to paste a token, key, or password. Do not send secret-request again from this turn.";
var SECRET_REQUEST_PLUGIN_ID_TEAM_BOT_ONLY = "plugin_id only applies to a shared team bot's plugins. On this bot, request the secret without plugin_id: it is saved as an environment variable on the user's box.";
var PERSONAL_SECRET_REQUEST_GUIDANCE = 'Use {"type":"secret-request","secret":{"label":"...","name":"CURSOR_API_KEY"}} to ask for a credential (an API token, key, or secret): the user gets a masked secure input and the value becomes an environment variable in new box processes. NEVER ask the user to paste a token, key, or password into the chat; always request it this way so it stays out of the transcript and out of your context. You only learn that they provided it. Sending a secret-request ends your turn; you are resumed once they submit. ';
var BOT_SECRET_REQUEST_GUIDANCE = 'Use {"type":"secret-request","secret":{"label":"...","name":"CRM_API_TOKEN"}} to ask the owner for a credential for this bot. The owner gets a masked secure input and the value is saved on this bot, then available as process.env.NAME. This is only available in the owner\'s Grok Bot app DM. NEVER ask anyone to paste a token, key, or password into the chat. You only learn that they provided it. Sending a secret-request ends your turn; you are resumed once they submit. For a secret `${VAR}` setup field of a plugin on this bot (GetPlugin lists the field as secret), add "plugin_id" (the plugin\'s id) and pass the field key as "name": the value is saved as that plugin\'s team variable on the bot, never as a bot secret, and its connectors read it on your next turn. One secret-request per secret key, after the plugin is on the bot. ';
var SECRET_REQUEST_PROBE_NAME = "API_TOKEN";
function secretRequestToolGuidance(resolve29) {
  if (resolve29 == null) return PERSONAL_SECRET_REQUEST_GUIDANCE;
  try {
    const target = resolve29(SECRET_REQUEST_PROBE_NAME);
    if (target.kind === "bot-secret") return BOT_SECRET_REQUEST_GUIDANCE;
  } catch (error42) {
    if (error42 instanceof SandToolInputError) return `${error42.message} `;
    throw error42;
  }
  return `${SECRET_REQUEST_OWNER_APP_DM_ONLY} `;
}
function refuseNestedSecretRequest(_name) {
  throw new SandToolInputError(SECRET_REQUEST_OWNER_APP_DM_ONLY);
}
function resolveSendMessageSecretTarget(secret, resolve29) {
  const { name: name17, pluginId } = secret;
  if (resolve29 == null) {
    if (pluginId !== void 0) {
      throw new SandToolInputError(SECRET_REQUEST_PLUGIN_ID_TEAM_BOT_ONLY);
    }
    return boxEnvSecretTarget(name17);
  }
  return pluginId === void 0 ? resolve29(name17) : resolve29(name17, { pluginId });
}
function buildSecretProvidedAck(request5) {
  switch (request5.target.kind) {
    case "box-env":
      return [
        `[The user securely provided the requested secret: "${request5.label}". It is available to new box processes as process.env.${request5.target.name}; you never see the value and it is not in this conversation.]`,
        `Shell output containing the value is shown as [REDACTED]. Do not print or echo process.env.${request5.target.name} to verify it. Confirm that it is set, then continue using the environment variable. This is the user's personal secret on their own box, separate from any Bot secrets your owner configured.`
      ].join("\n");
    case "bot-secret":
      return [
        `[The user securely provided the requested secret: "${request5.label}". It was saved on this bot as process.env.${request5.target.name}; you never see the value and it is not in this conversation.]`,
        `Shell output containing the value is shown as [REDACTED]. Do not print or echo process.env.${request5.target.name} to verify it. Confirm that it is set, then continue using the environment variable. This secret is on the bot, not a personal secret on the user's computer.`
      ].join("\n");
    case "bot-plugin-variable":
      return [
        `[The user securely provided the requested secret: "${request5.label}". It was saved on this bot as the ${request5.target.key} setup value of plugin ${request5.target.pluginId}, for the whole team; you never see the value and it is not in this conversation.]`,
        `The plugin's connectors read it on your next turn: check GetMcpServerStatus then, and do not ask for this value again. It is not an environment variable and not a bot secret.`
      ].join("\n");
    case "channel-credential":
    default:
      return [
        `[The user securely provided the requested secret: "${request5.label}". It was stored as a legacy connector credential; you never see the value and it is not in this conversation.]`,
        "Confirm that it was received. Do not claim the connector is linked without checking its status."
      ].join("\n");
  }
}
var SECRET_SAVE_FAILED_REASON_MAX_LENGTH = 300;
var SECRET_SAVE_FAILED_DEFAULT_REASON = "the secret store did not accept it";
function secretSaveFailedTarget(request5) {
  if (request5.target.kind === "box-env") {
    return `process.env.${request5.target.name} is NOT set in the box`;
  }
  if (request5.target.kind === "bot-secret") {
    return `process.env.${request5.target.name} is NOT set on this bot`;
  }
  if (request5.target.kind === "bot-plugin-variable") {
    return `the ${request5.target.key} setup value of plugin ${request5.target.pluginId} is NOT set on this bot`;
  }
  return "no connector credential was stored";
}
function buildSecretSaveFailedAck(request5, reason) {
  const trimmed = clampLine(reason, SECRET_SAVE_FAILED_REASON_MAX_LENGTH).replace(/\.+$/, "");
  const why = trimmed.length > 0 ? trimmed : SECRET_SAVE_FAILED_DEFAULT_REASON;
  return [
    `[The user tried to provide the requested secret "${request5.label}", but saving it failed: ${why}. Nothing was saved and ${secretSaveFailedTarget(request5)}; you never see the value and it is not in this conversation.]`,
    "Do not assume the secret exists or that a retry has already happened. The same request card is still open for the user to try again, so do not send secret-request again for it and never ask anyone to paste a token, key, or password into the chat. If the reason is something the user can fix (for example sharing the bot with the team, or using a longer value), briefly tell them what to do; otherwise tell them the save failed on your side and that you will continue once it succeeds."
  ].join("\n");
}
