init_invariant();
init_proto();
init_cursor_inference();
var HARNESS_REQUEST_TIMEOUT_MS = 2e4;
var WIRE_JSON = { emitDefaultValues: true };
async function requestVoiceCallHarness(deps) {
  const client = deps.client ?? createSandCursorBackendClient(GrokBotService, {
    backend: deps.backend,
    getAccessToken: deps.getAccessToken,
    getTeamId: deps.getTeamId,
    getMachineId: async () => await deps.getMachineId()
  });
  const options2 = { timeoutMs: HARNESS_REQUEST_TIMEOUT_MS };
  const body = JSON.stringify(deps.request.body);
  switch (deps.request.path) {
    case VOICE_CALL_HARNESS_SESSION_PATH: {
      const plan = await client.voiceCallHarnessSession(
        VoiceCallHarnessSessionRequest.fromJsonString(body),
        options2
      );
      return { status: 200, json: plan.toJson(WIRE_JSON) };
    }
    case VOICE_CALL_HARNESS_TOOL_PATH: {
      const answer = await client.voiceCallHarnessTool(
        VoiceCallHarnessToolRequest.fromJsonString(body),
        options2
      );
      return {
        status: 200,
        json: { kind: toolOutcomeKindOf(answer.kind), output: answer.output?.toJson() }
      };
    }
    default:
      invariant(false, `requestVoiceCallHarness: no GrokBotService RPC at ${deps.request.path}`);
  }
}
function toolOutcomeKindOf(kind) {
  switch (kind) {
    case VoiceCallHarnessToolOutcomeKind.SERVED:
      return "served";
    case VoiceCallHarnessToolOutcomeKind.UNKNOWN_TOOL:
      return "unknown_tool";
    case VoiceCallHarnessToolOutcomeKind.INVALID_INPUT:
      return "invalid_input";
    case VoiceCallHarnessToolOutcomeKind.UNSPECIFIED:
      return void 0;
  }
}
