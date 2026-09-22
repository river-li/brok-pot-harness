/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/credential-provider/credential-provider-directory-reader.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_scheduling();
init_zod();
init_errors();
var DEFAULT_TIMEOUT_MS4 = 1e4;
var CredentialProviderDirectoryError = class extends SandDomainError {
  name = "CredentialProviderDirectoryError";
  constructor(message, cause) {
    super(message, cause === void 0 ? void 0 : { cause });
  }
};
var targetRuleSchema = external_exports.discriminatedUnion("kind", [
  external_exports.object({
    kind: external_exports.literal("exact-host-port"),
    scheme: external_exports.enum(["http", "https"]),
    host: external_exports.string().min(1).max(255),
    port: external_exports.number().int().min(1).max(65535)
  }).strict(),
  external_exports.object({
    kind: external_exports.literal("registrable-domain"),
    registrableDomain: external_exports.string().min(1).max(255)
  }).strict()
]);
var directoryResponseSchema = external_exports.object({
  directory: external_exports.object({
    alwaysAllowConnectionIds: external_exports.array(external_exports.string().uuid()).max(10).default([]),
    items: external_exports.array(
      external_exports.object({
        credentialId: external_exports.string().uuid(),
        connectionId: external_exports.string().uuid(),
        catalogRevision: external_exports.string().uuid(),
        title: external_exports.string().min(1).max(255),
        category: external_exports.string().min(1).max(64),
        sites: external_exports.array(external_exports.string().max(2048)).max(20),
        targetRules: external_exports.array(targetRuleSchema).max(20),
        vaultName: external_exports.string().min(1).max(255).optional(),
        hasOneTimeCode: external_exports.boolean().default(false)
      }).strict()
    ).max(1e3)
  }).strict().nullable()
}).strict();
function createCredentialProviderDirectoryReader(options2) {
  const fetchImpl = options2.fetchImpl ?? fetch;
  const deadline = createDeadlinePolicy({
    name: "sand-credential-provider-directory",
    timeoutMs: options2.timeoutMs ?? DEFAULT_TIMEOUT_MS4
  });
  return async (probe) => {
    const backendUrl = options2.getBackendUrl();
    let accessToken;
    try {
      accessToken = await options2.getAccessToken({ backendUrl });
    } catch (cause) {
      throw new CredentialProviderDirectoryError(
        "Credential provider directory token unavailable.",
        cause
      );
    }
    let payload;
    try {
      payload = await deadline.run(async (signal) => {
        const directoryUrl = new URL("/sand/credential-provider-directory", backendUrl);
        directoryUrl.searchParams.set("includeAutofill", "1");
        directoryUrl.searchParams.set("includeOneTimeCode", "1");
        if (probe !== void 0) directoryUrl.searchParams.set("probe", probe);
        const response = await fetchImpl(directoryUrl.toString(), {
          method: "GET",
          headers: {
            accept: "application/json",
            authorization: `Bearer ${accessToken}`
          },
          signal
        });
        if (!response.ok) {
          throw new CredentialProviderDirectoryError(
            `Credential provider directory returned HTTP ${response.status}.`
          );
        }
        return await response.json();
      });
    } catch (cause) {
      throw new CredentialProviderDirectoryError(
        "Credential provider directory fetch failed.",
        cause
      );
    }
    const parsed2 = directoryResponseSchema.safeParse(payload);
    if (!parsed2.success) {
      throw new CredentialProviderDirectoryError(
        "Credential provider directory response invalid.",
        parsed2.error
      );
    }
    return parsed2.data.directory;
  };
}

