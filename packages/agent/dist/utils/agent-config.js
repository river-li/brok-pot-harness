/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/utils/agent-config.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_shell_exec_pb();
init_background_composer_pb();
var NoopWebScraperService = class {
  async getContentInWebsiteFast(_ctx, _url2) {
    return null;
  }
};
var NoopDocumentationHydrationService = class {
  async hydrateDocumentation(_ctx, _documentationIdentifiers, _conversationQuery) {
    return { chunks: [], customDocNotes: [] };
  }
};
function classifierResultToProto(result) {
  if (result.kind === "classification-succeeded") {
    const suggestedSandboxMode = (() => {
      switch (result.suggestedSandboxMode) {
        case "SANDBOX":
          return CommandClassifierResult_SuggestedSandboxMode.SANDBOX;
        case "NO_SANDBOX":
          return CommandClassifierResult_SuggestedSandboxMode.NO_SANDBOX;
        default:
          return CommandClassifierResult_SuggestedSandboxMode.UNDETERMINED;
      }
    })();
    return new CommandClassifierResult({
      commands: result.commands.map((cmd) => new CommandClassifierResult_ClassifiedCommand({
        name: cmd.name,
        arguments: cmd.arguments,
        suggestedAllowlistEntry: cmd.suggestedAllowlistEntry,
        subcommandTokens: cmd.subcommandTokens
      })),
      suggestedSandboxMode,
      classificationFailed: false
    });
  }
  return new CommandClassifierResult({
    commands: [],
    suggestedSandboxMode: CommandClassifierResult_SuggestedSandboxMode.UNDETERMINED,
    classificationFailed: true
  });
}
var AgentType;
(function(AgentType2) {
  AgentType2["IDE"] = "ide";
  AgentType2["CLI"] = "cli";
  AgentType2["BACKGROUND"] = "background";
  AgentType2["BUGBOT"] = "bugbot";
})(AgentType || (AgentType = {}));
var shouldUseExperimentalCloudBehavior = (props) => props.enableCloudTesting === true && props.agentType === AgentType.BACKGROUND;
function isCloudAgentComputerUseEligibleEnvironment(backgroundAgentSource) {
  return backgroundAgentSource !== BackgroundComposerSource.GITHUB_CI_AUTOFIX && backgroundAgentSource !== BackgroundComposerSource.BUGBOT_AUTOFIX;
}
function isCloudAgentTestingPromptEligibleEnvironment(backgroundAgentSource) {
  return isCloudAgentComputerUseEligibleEnvironment(backgroundAgentSource);
}
var COMPUTER_USE_ELIGIBLE_MODEL_PREFIXES = [
  "claude-4-sonnet",
  "claude-4.5-sonnet",
  "claude-4.5-haiku",
  "claude-4.5-opus"
];
function isComputerUseEligibleModel(modelId) {
  const modelIdLower = modelId.toLowerCase();
  return COMPUTER_USE_ELIGIBLE_MODEL_PREFIXES.some((prefix) => modelIdLower === prefix || modelIdLower.startsWith(`${prefix}-`));
}
function shouldEnableComputerUse(props) {
  if (props.agentType !== AgentType.BACKGROUND || props.isBackground !== true) {
    return false;
  }
  if (!shouldUseExperimentalCloudBehavior({
    agentType: props.agentType,
    enableCloudTesting: props.enableCloudTesting
  })) {
    return false;
  }
  if (!isCloudAgentComputerUseEligibleEnvironment(props.backgroundAgentSource)) {
    return false;
  }
  return isComputerUseEligibleModel(props.modelId);
}

