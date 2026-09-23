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
var VoiceCallWrittenTurns = class _VoiceCallWrittenTurns {
  static TOPIC = VOICE_CALL_USER_MESSAGE_TOPIC;
  /** A written turn rides in the model's context for the rest of the call, so it is held to a spoken update's size. */
  static CHAR_LIMIT = VOICE_CALL_REQUEST_CHAR_LIMIT;
  static EVENT_ID_PREFIX = "written-turn";
  static eventId(entryId) {
    return `${_VoiceCallWrittenTurns.EVENT_ID_PREFIX}-${entryId}`;
  }
  static rides(wire) {
    return wire === "async-update";
  }
  static frame({ entryId, text: text2, atMs }) {
    return VoiceCallAsyncUpdate.frame({
      topic: _VoiceCallWrittenTurns.TOPIC,
      eventId: _VoiceCallWrittenTurns.eventId(entryId),
      texts: [text2.slice(0, _VoiceCallWrittenTurns.CHAR_LIMIT)],
      atMs
    });
  }
};
