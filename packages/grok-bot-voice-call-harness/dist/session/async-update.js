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
