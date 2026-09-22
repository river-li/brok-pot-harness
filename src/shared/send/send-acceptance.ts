var PROMPT_ACCEPTANCE_STATUSES = ["accepted", "rejected", "pending"];
function canonicalSendInput(input) {
  return JSON.stringify([
    input.agentId ?? null,
    input.prompt,
    input.richText ?? null,
    input.replyToId ?? null,
    input.isFork === true,
    input.automationWriteProvenance ?? null,
    [...input.attachmentPaths ?? []],
    [...input.attachmentNames ?? []]
  ]);
}
var NONCE_DIGEST_MISMATCH = "send/nonce-digest-mismatch";
var SEND_MESSAGE_TOO_LONG = "send/message-too-long";
var HOST_ACCOUNT_SLOT = "host";
var DISABLE_SEND_ACCEPT_RETURN_ENV = "SAND_DISABLE_SEND_ACCEPT_RETURN";
