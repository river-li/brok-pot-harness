/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-voice-call-harness/dist/prompt/session-tools.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var TOOLS = [
  {
    type: "function",
    name: VOICE_CALL_NUDGE_MAIN_TOOL,
    description: VoiceCallToolDescriptions.sendTask(),
    parameters: {
      type: "object",
      properties: {
        request: {
          type: "string",
          description: VoiceCallToolDescriptions.sendTaskRequest()
        }
      },
      required: ["request"]
    }
  },
  {
    type: "function",
    name: VOICE_CALL_RECALL_TEXTS_TOOL,
    description: VoiceCallToolDescriptions.recallTextMessages(),
    parameters: { type: "object", properties: {} }
  },
  {
    type: "function",
    name: VOICE_CALL_SILENT_TOOL,
    description: VoiceCallToolDescriptions.staySilent(),
    parameters: { type: "object", properties: {} }
  },
  {
    type: "function",
    name: VOICE_CALL_HANGUP_TOOL,
    description: VoiceCallToolDescriptions.endTheCall(),
    parameters: { type: "object", properties: {} }
  }
];

