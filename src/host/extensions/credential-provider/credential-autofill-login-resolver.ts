init_scheduling();
init_zod();
init_errors();
var DEFAULT_TIMEOUT_MS3 = 2e4;
var PASSWORD_STEP_TIMEOUT_MS = 4e4;
var AUTO_FILL_REQUEST_TIMEOUT_MS = 18e4;
var autofillResultSchema = external_exports.object({
  filled: external_exports.boolean(),
  retryable: external_exports.boolean().optional()
}).strict();
var autofillRequestResultSchema = external_exports.object({
  accepted: external_exports.boolean(),
  filled: external_exports.boolean().optional(),
  detail: external_exports.string().optional()
}).strict();
var CredentialAutofillLoginError = class extends SandDomainError {
  name = "CredentialAutofillLoginError";
};
function createAutofillRequester(options2, route, resultSchema, defaultTimeoutMs) {
  const fetchImpl = options2.fetchImpl ?? fetch;
  const deadline = createDeadlinePolicy({
    name: "sand-credential-autofill-login",
    timeoutMs: options2.timeoutMs ?? defaultTimeoutMs
  });
  return async (body) => {
    const backendUrl = options2.getBackendUrl();
    const accessToken = await options2.getAccessToken({ backendUrl }).catch((cause) => {
      throw new CredentialAutofillLoginError("Credential autofill token unavailable.", { cause });
    });
    const payload = await deadline.run(async (signal) => {
      const response = await fetchImpl(new URL(route, backendUrl).toString(), {
        method: "POST",
        headers: {
          accept: "application/json",
          authorization: `Bearer ${accessToken}`,
          "content-type": "application/json"
        },
        body: JSON.stringify(body),
        signal
      });
      if (!response.ok) {
        throw new CredentialAutofillLoginError(
          `Credential autofill returned HTTP ${response.status}.`
        );
      }
      return await response.json();
    }).catch((cause) => {
      throw new CredentialAutofillLoginError("Credential autofill request failed.", { cause });
    });
    const parsed2 = resultSchema.safeParse(payload);
    if (!parsed2.success) {
      throw new CredentialAutofillLoginError("Credential autofill response invalid.", {
        cause: parsed2.error
      });
    }
    return parsed2.data;
  };
}
function itemReference(item) {
  return {
    credentialId: item.credentialId,
    connectionId: item.connectionId,
    catalogRevision: item.catalogRevision
  };
}
function createCredentialAutoFillRequestResolver(options2) {
  const request3 = createAutofillRequester(
    options2,
    "/sand/credential-provider-autofill-request",
    autofillRequestResultSchema,
    AUTO_FILL_REQUEST_TIMEOUT_MS
  );
  return ({ agentId, entryId, request: credentialRequest }) => request3({
    agentId,
    entryId,
    credentialId: credentialRequest.credentialId,
    connectionId: credentialRequest.connectionId,
    catalogRevision: credentialRequest.catalogRevision,
    targetSite: credentialRequest.targetSite,
    ...credentialRequest.targetWebSocketDebuggerUrl === void 0 ? {} : { targetWebSocketDebuggerUrl: credentialRequest.targetWebSocketDebuggerUrl }
  });
}
function createCredentialOneTimeCodeResolver(options2) {
  const request3 = createAutofillRequester(
    options2,
    "/sand/credential-provider-autofill-one-time-code",
    autofillResultSchema,
    DEFAULT_TIMEOUT_MS3
  );
  return (session, target) => request3({
    ...itemReference(session.item),
    targetSite: target.url,
    targetWebSocketDebuggerUrl: target.webSocketDebuggerUrl,
    oneTimeCodeTicket: session.oneTimeCodeTicket
  });
}
function createCredentialPasswordStepResolver(options2) {
  const request3 = createAutofillRequester(
    options2,
    "/sand/credential-provider-autofill-password-step",
    autofillResultSchema,
    PASSWORD_STEP_TIMEOUT_MS
  );
  return (session, target) => request3({
    ...itemReference(session.item),
    targetSite: target.url,
    targetWebSocketDebuggerUrl: target.webSocketDebuggerUrl,
    passwordStepTicket: session.passwordStepTicket
  });
}
