init_errors();
init_zod();
var SAND_CREDENTIAL_PROVIDER_STATUS_TOOL_NAME = "GetCredentialProviderStatus";
var credentialProviderStatusParameters = external_exports.object({}).strict();
function renderCredentialProviderStatus(status) {
  switch (status.kind) {
    case "not-connected":
      return `Credential provider status: not connected. Saved item count: 0. ${ONEPASSWORD_CONNECT_CARD_HINT}`;
    case "connected":
      return `Credential provider status: connected. Connections: ${status.connectionCount}. Saved item count: ${status.itemCount}. Connections needing renewal or attention: ${status.connectionsNeedingAttention}. This is metadata only; credential values are never returned.`;
  }
}
function createCredentialProviderStatusTool(reader) {
  return defineCommunicateTool(reader, {
    id: "READ",
    name: SAND_CREDENTIAL_PROVIDER_STATUS_TOOL_NAME,
    description: "Read the user's current saved-credential provider status from Cursor's backend. Call this when the user asks whether their password manager, vault, saved credentials, or 1Password connection is connected, how many saved items exist, or whether renewal needs attention. Never infer status from chat history or the filesystem. The tool returns only provider-neutral counts and health metadata, never secret values, item titles or sites, provider item IDs, vault IDs, tokens, or fill authority.",
    parameters: credentialProviderStatusParameters,
    execute: async (_ctx, _args, deps) => {
      if (deps.turnRefusal !== void 0) {
        return `Credential provider status: unavailable on this turn: ${SAND_CREDENTIAL_TURN_REFUSAL_PHRASE[deps.turnRefusal]}.`;
      }
      try {
        return renderCredentialProviderStatus(await deps.getStatus());
      } catch (error41) {
        return `Credential provider status: unavailable. The backend status check failed; this does not mean the provider is disconnected. Tell the user the status could not be checked and that the 1Password page in the Marketplace on their Mac shows the live state. Diagnostic class: ${errorLogTag(error41)}.`;
      }
    }
  });
}
