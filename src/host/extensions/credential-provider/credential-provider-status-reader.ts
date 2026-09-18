init_scheduling();
init_zod();
init_errors();
var DEFAULT_TIMEOUT_MS5 = 1e4;
var MAX_CONNECTIONS = 10;
var MAX_TOTAL_ITEMS = 1e4;
var CredentialProviderStatusError = class extends SandDomainError {
  name = "CredentialProviderStatusError";
};
var statusResponseSchema = external_exports.discriminatedUnion("status", [
  external_exports.object({ status: external_exports.literal("not_connected") }).strict(),
  external_exports.object({
    status: external_exports.literal("connected"),
    connectionCount: external_exports.number().int().min(1).max(MAX_CONNECTIONS),
    itemCount: external_exports.number().int().min(0).max(MAX_TOTAL_ITEMS),
    connectionsNeedingAttention: external_exports.number().int().min(0).max(MAX_CONNECTIONS)
  }).strict()
]).superRefine((value, ctx) => {
  if (value.status === "connected" && value.connectionsNeedingAttention > value.connectionCount) {
    ctx.addIssue({
      code: external_exports.ZodIssueCode.custom,
      path: ["connectionsNeedingAttention"],
      message: "cannot exceed connectionCount"
    });
  }
});
function createCredentialProviderStatusReader(options2) {
  const fetchImpl = options2.fetchImpl ?? fetch;
  const deadline = createDeadlinePolicy({
    name: "sand-credential-provider-status",
    timeoutMs: options2.timeoutMs ?? DEFAULT_TIMEOUT_MS5
  });
  return {
    async getStatus() {
      const backendUrl = options2.getBackendUrl();
      const accessToken = await options2.getAccessToken({ backendUrl });
      const payload = await deadline.run(async (signal) => {
        const response = await fetchImpl(
          new URL("/sand/credential-provider-status", backendUrl).toString(),
          {
            method: "GET",
            headers: {
              accept: "application/json",
              authorization: `Bearer ${accessToken}`
            },
            signal
          }
        );
        if (!response.ok) {
          throw new CredentialProviderStatusError(
            `Credential provider status returned HTTP ${response.status}.`
          );
        }
        return await response.json();
      });
      const parsed2 = statusResponseSchema.parse(payload);
      return parsed2.status === "not_connected" ? { kind: "not-connected" } : {
        kind: "connected",
        connectionCount: parsed2.connectionCount,
        itemCount: parsed2.itemCount,
        connectionsNeedingAttention: parsed2.connectionsNeedingAttention
      };
    }
  };
}
