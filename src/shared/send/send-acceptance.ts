/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/send/send-acceptance.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var PROMPT_ACCEPTANCE_STATUSES = ["accepted", "rejected", "pending"];
function canonicalSendInput(input) {
  const fields = [
    input.agentId ?? null,
    input.prompt,
    input.richText ?? null,
    input.replyToId ?? null,
    input.isFork === true,
    input.automationWriteProvenance ?? null,
    [...input.attachmentPaths ?? []],
    [...input.attachmentNames ?? []]
  ];
  if (input.recipeSetupOperationId != null)
    fields.push("recipeSetupOperationId", input.recipeSetupOperationId);
  return JSON.stringify(fields);
}
var NONCE_DIGEST_MISMATCH = "send/nonce-digest-mismatch";
var SEND_MESSAGE_TOO_LONG = "send/message-too-long";
var HOST_ACCOUNT_SLOT = "host";
var DISABLE_SEND_ACCEPT_RETURN_ENV = "SAND_DISABLE_SEND_ACCEPT_RETURN";
