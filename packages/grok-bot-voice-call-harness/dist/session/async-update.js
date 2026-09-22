/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-voice-call-harness/dist/session/async-update.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var VoiceCallAsyncUpdate = class {
  static frame({ topic, eventId, texts, atMs }) {
    return {
      type: "async_update.add",
      event_id: eventId,
      async_update: {
        topic,
        payload: texts.map((content) => ({
          message: { type: "text", content },
          timestampMs: atMs
        }))
      }
    };
  }
};

