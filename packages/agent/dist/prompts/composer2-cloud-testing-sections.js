function parseComposer2CloudTestingSectionsPlacementMetadata(value) {
  return value === "user_info" || value === "system_prompt" ? value : void 0;
}
function getComposer2CloudTestingSectionsPlacement(props) {
  const eligible = !isNamedAgentHomePromptSession(props) && props.modelInfo?.promptVersion === "cursor-0226" && props.enableComposer2IntelligentTestingPromptSection === true && props.backgroundAgentSource !== void 0 && props.agentType !== void 0 && shouldUseExperimentalCloudBehavior({
    agentType: props.agentType,
    enableCloudTesting: props.enableCloudTesting ?? false
  }) && isCloudAgentTestingPromptEligibleEnvironment(props.backgroundAgentSource);
  if (!eligible) {
    return void 0;
  }
  return props.modelInfo?.isGrok45ProductPrompt === true && props.featureFlags?.grokCloudTestingInSystemPrompt === true ? "system_prompt" : "user_info";
}
function getComposer2CloudSectionContext(props) {
  if (props.useLocalAgentPrompting === true || props.backgroundAgentSource === void 0 || props.agentType === void 0 || props.modelInfo === void 0 || props.toolInfo === void 0) {
    return void 0;
  }
  const enableCloudTesting = props.enableCloudTesting ?? false;
  const enableComputerUse = shouldEnableComputerUse({
    agentType: props.agentType,
    enableCloudTesting,
    backgroundAgentSource: props.backgroundAgentSource,
    modelId: props.modelInfo.modelName,
    isBackground: props.agentType === AgentType.BACKGROUND
  }) ?? false;
  const testingPromptProps = {
    env: props.env,
    cursorRules: props.cursorRules,
    browserTools: props.browserTools,
    cloudRule: props.cloudRule,
    mode: props.mode,
    agentType: props.agentType,
    isDev: false,
    enableCloudTesting,
    backgroundAgentSource: props.backgroundAgentSource,
    featureFlags: props.featureFlags,
    modelInfo: props.modelInfo,
    toolInfo: props.toolInfo,
    formattingOptions: {
      shouldUseFormatCodeblock: true,
      gpt5StyleLineNumbers: false,
      gpt5CodexCatN: false,
      enableLineNumbers: true
    },
    nameWeTellTheModelToCallItself: "Composer",
    enableComputerUse
  };
  return {
    testingPromptProps,
    enableComputerUse,
    browserTools: props.browserTools
  };
}
function getComposer2CloudTestingSectionElements(props, options2) {
  const context2 = getComposer2CloudSectionContext(props);
  if (context2 === void 0 || props.toolInfo === void 0) {
    return void 0;
  }
  return {
    gitAndSubmission: jsxs("section", { title: "git_and_submission", children: [jsx("h2", { children: "Git and submitting your work" }), jsx("ul", { children: GitOrNoRepositoryInstructions({
      isRepoless: props.isRepoless,
      repolessPromptVariant: props.repolessPromptVariant,
      gitInstructionsProps: {
        toolInfo: props.toolInfo,
        shouldShowTestingInstructions: true,
        suppressCreatedPrMention: isSlackV1_5ThreadBoundSession(props),
        startedAsNewProject: props.startedAsNewProject
      }
    }) })] }),
    testing: jsx(TestingInstructions2, { props: context2.testingPromptProps, browserMcpProviderName: getBrowserMcpProviderName(context2.browserTools), screenshotToolName: context2.browserTools?.find((tool) => tool.includes("browser_take_screenshot")), enableComputerUse: context2.enableComputerUse, enableManualReproduction: context2.enableComputerUse, computerUseSubagentName: "computerUse", omitTestingWorkflow: options2?.omitTestingWorkflow === true }),
    computerUse: context2.enableComputerUse ? jsx(ComputerUseInstructionsSection, { props: context2.testingPromptProps }) : void 0
  };
}
