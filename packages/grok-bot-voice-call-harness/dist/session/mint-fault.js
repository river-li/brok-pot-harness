var VOICE_CALL_MINT_REASONS = [
  "not_configured",
  "unsupported_model",
  "rejected",
  "unreachable",
  "malformed_response"
];
var VOICE_CALL_MINT_HTTP = ["429", "401", "403", "503"];
var MINT_HEADER_PREFIX = "voice_mint_";
var MINT_HEADER_BY_VALUE = (() => {
  const headers = /* @__PURE__ */ new Map();
  for (const reason of VOICE_CALL_MINT_REASONS) {
    headers.set(`${MINT_HEADER_PREFIX}${reason}`, {
      reason,
      http: "absent"
    });
    for (const http8 of VOICE_CALL_MINT_HTTP) {
      headers.set(`${MINT_HEADER_PREFIX}${reason}_${http8}`, { reason, http: http8 });
    }
  }
  return headers;
})();
