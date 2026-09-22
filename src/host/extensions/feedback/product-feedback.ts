var import_node_crypto46 = require("node:crypto");
init_scheduling();
init_errors();
init_cursor_inference();
init_sand_client_metadata();
var productFeedbackDeadline = createDeadlinePolicy({
  name: "sand-agent-feedback-submit",
  timeoutMs: 15e3
});
function retryAfterSecondsOf(response) {
  const retryAfter = Number(response.headers.get("retry-after") ?? "");
  return Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter : void 0;
}
function deterministicSubmissionId(args) {
  const hex = (0, import_node_crypto46.createHash)("sha256").update(`${args.conversationId}\0${args.toolCallId}`).digest("hex");
  return asWellFormedUuidV8(hex);
}
function asWellFormedUuidV8(hex) {
  const versionNibble = "8";
  const variantNibble = "8";
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${versionNibble}${hex.slice(13, 16)}-${variantNibble}${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
}
async function refusalCodeOf(response) {
  try {
    const body = await response.json();
    return typeof body === "object" && body !== null && "error" in body && body.error === "agent_feedback_privacy_mode" ? "privacy-mode" : "access-denied";
  } catch (error42) {
    reportFallback("product_feedback", error42);
    return "access-denied";
  }
}
function createSandProductFeedbackSubmitter(deps) {
  return async (args) => {
    const backendUrl = deps.backend.backendUrl;
    let auth2;
    try {
      const accessToken = await deps.getAccessToken({ backendUrl });
      auth2 = await resolveSandBackendAuthContext({
        accessToken,
        getTeamId: deps.getTeamId
      });
    } catch (error42) {
      deps.log(`product feedback token unavailable (${errorLogTag(error42)})`);
      return { result: { ok: false, code: "not-signed-in" } };
    }
    try {
      const fetchImpl = deps.fetchImpl ?? fetch;
      const response = await productFeedbackDeadline.run(async (signal) => {
        return await fetchImpl(new URL("/sand/feedback", backendUrl), {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${auth2.accessToken}`,
            ...auth2.teamId !== void 0 ? { "x-cursor-team-id": String(auth2.teamId) } : {},
            ...getSandBackendClientHeaders(deps.backend)
          },
          body: JSON.stringify({
            message: args.message,
            submissionId: deterministicSubmissionId(args),
            conversationId: args.conversationId,
            source: "agent",
            ...args.clientSurface === void 0 ? {} : { clientSurface: args.clientSurface },
            ...args.approvalPlatform === void 0 ? {} : { approvalPlatform: args.approvalPlatform },
            appVersion: deps.backend.clientVersion
          }),
          signal
        });
      });
      if (response.status === 400) return { result: { ok: false, code: "invalid-feedback" } };
      if (response.status === 402) return { result: { ok: false, code: "subscription-required" } };
      if (response.status === 403) {
        return { result: { ok: false, code: await refusalCodeOf(response) } };
      }
      if (response.status === 429) {
        const retryAfterSeconds = retryAfterSecondsOf(response);
        return {
          result: { ok: false, code: "rate-limited" },
          ...retryAfterSeconds != null ? { retryAfterSeconds } : {}
        };
      }
      if (!response.ok) return { result: { ok: false, code: "unavailable" } };
      return { result: { ok: true } };
    } catch (error42) {
      deps.log(`product feedback submit failed (${errorLogTag(error42)})`);
      return { result: { ok: false, code: "unavailable" } };
    }
  };
}
