/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/auth/auth-service.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_errors();
var SandCredentialsWaitingError = class extends SandDomainError {
  name = "SandCredentialsWaitingError";
};
var EXPIRY_LEEWAY_MS = 3e4;
var InferenceCredentialStore = class {
  credential;
  setCredential(credential) {
    if (credential.accessToken.length === 0) return;
    this.credential = credential;
  }
  getValidAccessToken(now = Date.now()) {
    const credential = this.credential;
    if (credential === void 0) return null;
    if (now >= credential.expiresAtMs - EXPIRY_LEEWAY_MS) return null;
    return credential.accessToken;
  }
  getValidGrokBotToken(now = Date.now()) {
    const credential = this.credential;
    if (credential === void 0) return null;
    if (now >= credential.expiresAtMs - EXPIRY_LEEWAY_MS) return null;
    return credential.grokBotToken ?? credential.accessToken;
  }
  hasValidCredential(now = Date.now()) {
    return this.getValidAccessToken(now) !== null;
  }
  clear() {
    this.credential = void 0;
  }
};
var SAND_SHORTLIVED_CREDS_WAITING_MESSAGE = "Waiting for an inference credential. Grok Bot's computer renews this automatically (no desktop required); this resolves on its own shortly.";
function createHostAuthService(options2) {
  const store = new InferenceCredentialStore();
  const listeners2 = /* @__PURE__ */ new Set();
  let lastRenewalEvent = null;
  let wroteFirstCredential = false;
  const emit = (event) => {
    lastRenewalEvent = event;
    for (const listener of [...listeners2]) {
      try {
        listener(event);
      } catch (error42) {
        options2.log(`credential renewal listener failed: ${errorLogTag(error42)}`);
      }
    }
  };
  const { devTokenFile, boxIdentityCredential } = options2.credentials;
  const isDevTokenFile = devTokenFile.length > 0;
  const hasRenewalCredential = isDevTokenFile || boxIdentityCredential.length > 0;
  const renewer = new SandInferenceCredentialRenewer({
    getCredential: isDevTokenFile ? () => devTokenFile : () => boxIdentityCredential.length > 0 ? boxIdentityCredential : null,
    renew: isDevTokenFile ? () => readDevInferenceCredentialFile({ path: devTokenFile }) : (credential) => renewSandBoxInferenceCredential({
      backend: options2.backend,
      credential
    }),
    setCredential: (credential) => {
      wroteFirstCredential = store.getValidAccessToken() == null;
      store.setCredential(credential);
    },
    onResult: (result) => {
      const isFirstCredential = result.outcome === "renewed" && wroteFirstCredential;
      wroteFirstCredential = false;
      if (result.outcome === "failed") {
        options2.log(
          `inference-credential renewal failed (streak ${result.consecutiveFailures}): ${result.errorSummary ?? "unknown error"}`
        );
      }
      emit({ ...result, isFirstCredential });
    },
    retry: options2.retry,
    clock: options2.clock,
    allowImmediateRenewalDuringBackoff: isDevTokenFile,
    pollIntervalMs: isDevTokenFile ? DEV_TOKEN_FILE_POLL_INTERVAL_MS : void 0
  });
  renewer.start();
  if (isDevTokenFile) {
    options2.log(
      `DEV inference-credential renewer started, reading short-lived tokens from ${devTokenFile} (dev:box-docker local loop)`
    );
  } else {
    options2.log(
      hasRenewalCredential ? "inference-credential renewer started (backend self-renewal is the sole inference-credential source)" : "inference-credential renewer started, but no renewal credential was delivered into the box; inference is unavailable until the box is re-provisioned with one"
    );
  }
  const getOrRenewToken = async (read) => {
    let token = read();
    if (token === null && hasRenewalCredential) {
      const renewed = await renewer.requestImmediateRenewal();
      if (renewed) token = read();
    }
    if (token === null)
      throw new SandCredentialsWaitingError(SAND_SHORTLIVED_CREDS_WAITING_MESSAGE);
    return token;
  };
  return {
    getAccessToken: async () => await getOrRenewToken(() => store.getValidAccessToken()),
    getGrokBotToken: async () => await getOrRenewToken(() => store.getValidGrokBotToken()),
    peekAccessToken: () => store.getValidAccessToken(),
    peekBoxIdentityCredential: () => boxIdentityCredential.length > 0 ? boxIdentityCredential : null,
    getLastRenewalEvent: () => lastRenewalEvent,
    getMachineId: () => getOrCreateHostMachineId(),
    subscribeToRenewal: (listener) => {
      listeners2.add(listener);
      return () => listeners2.delete(listener);
    },
    dispose: () => {
      renewer.close();
      listeners2.clear();
    }
  };
}
function bestEffortAccessToken(backend, auth2) {
  return async () => {
    try {
      const token = await auth2.getAccessToken({ backendUrl: backend.backendUrl });
      return token.length > 0 ? token : null;
    } catch (error42) {
      reportFallback("auth_service", error42);
      return null;
    }
  };
}

