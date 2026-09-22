/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/inference/voice-preview-service.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_scheduling();
init_aiserver_connect();
init_aiserver_pb();

// @recovered-fragment 2/2
init_cursor_inference();
var previewDeadline = createDeadlinePolicy({
  name: "cursor-voice-preview",
  timeoutMs: SAND_VOICE_PREVIEW_DEADLINE_MS
});
function createSandVoicePreview(backend, auth2, createClient2 = createSandCursorBackendClient) {
  if (process.env.GROKBOT_LOCAL_MODE === "1") {
    const speak = require("./local/tts.js").createLocalSpeechService({timeoutMs:SAND_VOICE_PREVIEW_DEADLINE_MS});
    return request => speak({text:sandVoiceGreetingText(request.greetingId), voiceId:request.voiceId});
  }
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
