init_cursor_inference();
var previewDeadline = createDeadlinePolicy({
  name: "cursor-voice-preview",
  timeoutMs: SAND_VOICE_PREVIEW_DEADLINE_MS
});
function createSandVoicePreview(backend, auth2, createClient2 = createSandCursorBackendClient) {
  let client;
  const getClient = () => {
    client ??= createClient2(AiService, {
      backend,
      getAccessToken: auth2.getAccessToken,
      getTeamId: auth2.getTeamId,
      getMachineId: auth2.getMachineId
    });
    return client;
  };
  return async (request5) => {
    const response = await previewDeadline.run(
      (signal) => getClient().textToSpeech(
        new TextToSpeechRequest({
          text: sandVoiceGreetingText(request5.greetingId),
          voiceId: request5.voiceId
        }),
        { signal }
      )
    );
    return {
      audioBase64: Buffer.from(response.audio).toString("base64"),
      mimeType: response.mimeType
    };
  };
}
