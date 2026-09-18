var VoiceCallHarnessRPCError = class extends Error {
  path;
  status;
  constructor({ path: path31, status, detail }) {
    super(`RPCVoiceCallHarness: ${path31} ${detail}`);
    this.name = "VoiceCallHarnessRPCError";
    this.path = path31;
    this.status = status;
  }
};
var RPCVoiceCallHarness = class _RPCVoiceCallHarness {
  transport;
  constructor(transport) {
    this.transport = transport;
  }
  async session(args) {
    const path31 = VOICE_CALL_HARNESS_SESSION_PATH;
    const response = await this.transport({ path: path31, body: args });
    return _RPCVoiceCallHarness.answer(path31, response, VoiceCallHarnessWire.parseSessionPlan);
  }
  async callTool(invocation) {
    const path31 = VOICE_CALL_HARNESS_TOOL_PATH;
    const response = await this.transport({ path: path31, body: invocation });
    const outcome = _RPCVoiceCallHarness.answer(path31, response, VoiceCallHarnessWire.parseToolOutcome);
    if (outcome.kind !== "served")
      return outcome;
    const definition2 = VoiceCallToolDefinitions.byName(invocation.name);
    if (definition2 === void 0)
      return outcome;
    const output = definition2.output.safeParse(outcome.output);
    if (!output.success) {
      throw new VoiceCallHarnessRPCError({
        path: path31,
        status: response.status,
        detail: `answered ${invocation.name} with an output its schema refuses`
      });
    }
    return { kind: "served", output: output.data };
  }
  static answer(path31, { status, json: json3 }, parse11) {
    if (status < 200 || status >= 300) {
      throw new VoiceCallHarnessRPCError({
        path: path31,
        status,
        detail: `answered ${status}`
      });
    }
    const result = parse11(json3);
    if (!result.ok) {
      throw new VoiceCallHarnessRPCError({
        path: path31,
        status,
        detail: `answered an unreadable body: ${result.error}`
      });
    }
    return result.value;
  }
};
