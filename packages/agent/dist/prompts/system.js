function extractToolInfo(toolSetHandle) {
  const availableTools = toolSetHandle.getAllTools();
  const promptVisibleTools = toolSetHandle.getStaticTools();
  const descriptionProps = toolSetHandle.getDescriptionProps();
  const automationsCommunicationToolNames = [];
  let availableSubagentModelsDescription;
  let availableSubagentTypesDescription;
  for (const tool of availableTools) {
    if (tool.toolIdentifier === "PLATFORM_ACTION" && isAutomationsPlatformCommunicationToolName(tool.name)) {
      automationsCommunicationToolNames.push(tool.name);
    }
    if (tool.toolIdentifier === "TASK" && "descriptionTokenPartsGenerator" in tool) {
      const tokenParts = tool.descriptionTokenPartsGenerator?.(descriptionProps, { promptVisible: promptVisibleTools.includes(tool) });
      availableSubagentModelsDescription = tokenParts?.availableSubagentModelsDescriptionText;
      availableSubagentTypesDescription = tokenParts?.availableSubagentTypesDescriptionText;
    }
  }
  return {
    hasAnyEditTools: toolSetHandle.hasTool("WRITE") || toolSetHandle.hasTool("STR_REPLACE") || toolSetHandle.hasTool("APPLY_PATCH"),
    allTools: descriptionProps.allTools,
    automationsCommunicationToolNames,
    availableSubagentModelsDescription,
    availableSubagentTypesDescription,
    mcpMetaToolServerCount: promptVisibleTools.find((tool) => tool.dynamicToolMetaRole === "discovery")?.mcpSnapshotDescriptors?.length ?? 0
  };
}
