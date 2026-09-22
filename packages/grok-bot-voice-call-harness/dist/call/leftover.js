/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-voice-call-harness/dist/call/leftover.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var VOICE_CALL_LEFTOVER_LINE_LIMIT = 6;
var VoiceCallLeftover = class {
  static callerLines({ turns, nudges }, acceptedRequests) {
    const relayedUntilMs = Math.max(-1, ...nudges.filter((nudge) => acceptedRequests.includes(nudge.request)).map((nudge) => nudge.atMs));
    return turns.filter((turn) => turn.speaker === "user" && turn.atMs > relayedUntilMs).map((turn) => turn.text.trim()).filter((text2) => text2.length > 0).slice(-VOICE_CALL_LEFTOVER_LINE_LIMIT);
  }
};

