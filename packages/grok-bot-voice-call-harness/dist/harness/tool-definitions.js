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
