/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-voice-call-harness/dist/prompt/nudge-reply.js
 * Bundle: sand-host/extensions/content-search/search-index-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var VOICE_CALL_REQUEST_CHAR_LIMIT = 2e3;
var VOICE_CALL_REQUEST_TOO_LONG_ERROR = `The task was not sent: request exceeds ${VOICE_CALL_REQUEST_CHAR_LIMIT} characters. Reformulate it within the limit while preserving every constraint, especially prohibitions and approval requirements. Do not drop constraints or split the task into executable pieces. Ask the caller to clarify if it cannot fit safely.`;

