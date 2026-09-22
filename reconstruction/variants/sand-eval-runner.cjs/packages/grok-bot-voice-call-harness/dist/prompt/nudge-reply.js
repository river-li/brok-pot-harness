/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-voice-call-harness/dist/prompt/nudge-reply.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var VOICE_CALL_REQUEST_CHAR_LIMIT = 2e3;
var VOICE_CALL_REQUEST_TOO_LONG_ERROR = `The task was not sent: request exceeds ${VOICE_CALL_REQUEST_CHAR_LIMIT} characters. Reformulate it within the limit while preserving every constraint, especially prohibitions and approval requirements. Do not drop constraints or split the task into executable pieces. Ask the caller to clarify if it cannot fit safely.`;
var VoiceCallRequests = class _VoiceCallRequests {
  static parse(value) {
    if (typeof value !== "string" || value.trim().length === 0) {
      return { kind: "rejected", error: VOICE_CALL_MISSING_REQUEST_ERROR };
    }
    const request3 = value.trim();
    return request3.length > VOICE_CALL_REQUEST_CHAR_LIMIT ? { kind: "rejected", error: VOICE_CALL_REQUEST_TOO_LONG_ERROR } : { kind: "accepted", request: request3 };
  }
  static fromToolArguments(argumentsJson) {
    let value;
    try {
      value = JSON.parse(argumentsJson);
    } catch {
      return _VoiceCallRequests.parse(void 0);
    }
    return _VoiceCallRequests.parse(typeof value === "object" && value !== null && "request" in value ? value.request : void 0);
  }
};

