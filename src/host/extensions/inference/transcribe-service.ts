/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/inference/transcribe-service.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_scheduling();
init_aiserver_connect();
init_aiserver_pb();

// @recovered-fragment 2/2
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
  return async (request5) => {
    const language = request5.language != null && request5.language.length > 0 ? toWhisperLanguageHint(request5.language) : void 0;
    const response = await transcribeDeadline.run(
      (signal) => getClient().transcribeAudio(
        new TranscribeAudioRequest({
          audio: new Uint8Array(request5.audio),
          mimeType: stripMimeParameters(request5.mimeType),
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

