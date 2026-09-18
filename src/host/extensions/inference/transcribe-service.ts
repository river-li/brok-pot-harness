init_cursor_inference();
var transcribeDeadline = createDeadlinePolicy({
  name: "cursor-transcribe-audio",
  timeoutMs: SAND_TRANSCRIBE_DEADLINE_MS
});
function stripMimeParameters(mimeType) {
  return (mimeType.split(";")[0] ?? mimeType).trim();
}
function createSandTranscribeAudio(backend, auth2, options2, createClient2 = createSandCursorBackendClient) {
  const onRequestId = options2?.onRequestId;
  let client;
  const getClient = () => {
    client ??= createClient2(AiService, {
      backend,
      getAccessToken: auth2.getAccessToken,
      getTeamId: auth2.getTeamId,
      getMachineId: auth2.getMachineId,
      ...onRequestId == null ? {} : { onRequestId }
    });
    return client;
  };
  return async (request3) => {
    const language = request3.language != null && request3.language.length > 0 ? toWhisperLanguageHint(request3.language) : void 0;
    const response = await transcribeDeadline.run(
      (signal) => getClient().transcribeAudio(
        new TranscribeAudioRequest({
          audio: new Uint8Array(request3.audio),
          mimeType: stripMimeParameters(request3.mimeType),
          ...language == null ? {} : { language }
        }),
        { signal }
      )
    );
    return {
      text: response.text,
      transcriptionTimeMs: Number(response.transcriptionTimeMs)
    };
  };
}
