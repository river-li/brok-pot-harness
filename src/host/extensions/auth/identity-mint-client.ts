init_dist2();
init_scheduling();
init_errors();
init_sand_client_metadata();
var mintDeadline = createDeadlinePolicy({
  name: "grok-bot-box-identity-mint",
  timeoutMs: 15e3
});
var MAX_RESPONSE_BODY_BYTES = 64 * 1024;
var GrokBotBoxIdentityMintClient = class {
  backend;
  getBoxCredential;
  fetchImpl;
  log;
  constructor(args) {
    this.backend = args.backend;
    this.getBoxCredential = args.getBoxCredential;
    this.fetchImpl = args.fetchImpl ?? fetch;
    this.log = args.log;
  }
  cancelUnreadResponseBody(response) {
    void response.body?.cancel().catch((error42) => {
      this.log(`identity mint body cancel failed: ${errorLogTag(error42)}`);
    });
  }
  async mint(request5) {
    const credential = this.getBoxCredential();
    if (credential === null) {
      return { kind: "host_error" };
    }
    try {
      const { response, body } = await mintDeadline.run(async (signal) => {
        const response2 = await this.fetchImpl(
          new URL(CLOUD_AGENT_IDENTITY_GROK_BOT_BOX_TOKEN_PATH, this.backend.backendUrl),
          {
            method: "POST",
            headers: {
              "content-type": "application/json",
              authorization: `Bearer ${credential}`,
              ...getSandBackendClientHeaders(this.backend)
            },
            body: JSON.stringify({
              audience: request5.audience,
              ...request5.nonce !== void 0 ? { nonce: request5.nonce } : {},
              ...request5.subClaim !== void 0 ? { subClaim: request5.subClaim } : {}
            }),
            signal
          }
        );
        if (!response2.ok) {
          this.cancelUnreadResponseBody(response2);
          return { response: response2, body: void 0 };
        }
        const contentLength = response2.headers.get("content-length");
        if (contentLength !== null && /^\d+$/.test(contentLength) && Number(contentLength) > MAX_RESPONSE_BODY_BYTES) {
          this.cancelUnreadResponseBody(response2);
          return { response: response2, body: "oversized" };
        }
        const bytes = new Uint8Array(await response2.arrayBuffer());
        if (bytes.byteLength > MAX_RESPONSE_BODY_BYTES) {
          return { response: response2, body: "oversized" };
        }
        return { response: response2, body: bytes };
      });
      if (!response.ok) {
        const retryAfter = response.headers.get("retry-after");
        const retryAfterSeconds = retryAfter !== null && /^\d+$/.test(retryAfter) ? Number(retryAfter) : void 0;
        return {
          kind: "backend_status",
          status: response.status,
          ...retryAfterSeconds !== void 0 ? { retryAfterSeconds } : {}
        };
      }
      if (body === void 0 || body === "oversized") {
        return { kind: "malformed_response" };
      }
      let parsed2;
      try {
        parsed2 = JSON.parse(new TextDecoder().decode(body));
      } catch {
        return { kind: "malformed_response" };
      }
      if (parsed2 === null || typeof parsed2 !== "object" || Array.isArray(parsed2)) {
        return { kind: "malformed_response" };
      }
      if (!("token" in parsed2) || typeof parsed2.token !== "string" || parsed2.token.length === 0) {
        return { kind: "malformed_response" };
      }
      if (!("expiresAtUnixSeconds" in parsed2) || typeof parsed2.expiresAtUnixSeconds !== "number" || !Number.isFinite(parsed2.expiresAtUnixSeconds) || parsed2.expiresAtUnixSeconds <= 0) {
        return { kind: "malformed_response" };
      }
      return {
        kind: "minted",
        token: parsed2.token,
        expiresAtUnixSeconds: parsed2.expiresAtUnixSeconds
      };
    } catch (error42) {
      const timedOut = error42 instanceof DeadlineExceededError || error42 instanceof Error && error42.name === "AbortError";
      return { kind: "transport", timedOut };
    }
  }
};
