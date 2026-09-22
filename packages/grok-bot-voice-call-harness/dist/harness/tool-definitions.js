/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-voice-call-harness/dist/harness/tool-definitions.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var DEFINITIONS = [
  SendTaskTool.definition,
  RecallTextMessagesTool.definition,
  StaySilentTool.definition,
  EndTheCallTool.definition
];
var VoiceCallToolDefinitions = class {
  static all() {
    return DEFINITIONS;
  }
  static byName(name17) {
    return DEFINITIONS.find((tool) => tool.name === name17);
  }
};

